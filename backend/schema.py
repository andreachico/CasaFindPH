import re
import strawberry
from typing import List, Optional
from models import Property, User, UserRoleEnum
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import bcrypt as _bcrypt
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SUPERADMIN_EMAILS = {
    "casafind.admin@gmail.com",
    "casafind-admin@gmail.com",
}


def _is_super_admin_email(email: str) -> bool:
    return email.strip().lower() in SUPERADMIN_EMAILS


# Database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://casafind_admin:And9821!casafind@localhost:5432/casafind_db"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# JWT secret
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")

# -----------------------------
# GraphQL Types
# -----------------------------
@strawberry.type
class UserType:
    id: str
    first_name: str
    last_name: str
    email: str
    role: str
    verified: bool
    contact_number: Optional[str] = None


def _validate_password(password: str) -> None:
    if len(password) < 8:
        raise Exception("Password must be at least 8 characters long.")
    if not re.search(r"[A-Z]", password):
        raise Exception("Password must contain at least one uppercase letter.")
    if not re.search(r"[0-9]", password):
        raise Exception("Password must contain at least one number.")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise Exception("Password must contain at least one special character (!@#$%^&* etc).")


def _hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")[:72]
    return _bcrypt.hashpw(password_bytes, _bcrypt.gensalt()).decode("utf-8")


def _to_user_type(u: User) -> "UserType":
    role_value = u.role.value if isinstance(u.role, UserRoleEnum) else str(u.role or "SEEKER")
    return UserType(
        id=str(u.id),
        first_name=u.first_name or "",
        last_name=u.last_name or "",
        email=u.email,
        role=role_value,
        verified=bool(getattr(u, "verified", False)),
        contact_number=u.contact_number,
    )

@strawberry.type
class AuthPayload:
    user: UserType
    token: str

@strawberry.type
class PropertyType:
    id: str
    title: str
    description: Optional[str]
    listing_type: str
    price: float
    room_count: int
    bathroom_count: int
    parking_count: int
    property_size: Optional[float]
    lot_size: Optional[float]
    image_url: Optional[str] = None
    detail_image_url: Optional[str] = None
    address: Optional[str] = None
    year_built: Optional[int] = None
    furnishing: Optional[str] = None


def _to_property_type(p: Property) -> "PropertyType":
    return PropertyType(
        id=str(p.id),
        title=p.title,
        description=p.description,
        listing_type=p.listing_type if isinstance(p.listing_type, str) else p.listing_type.value,
        price=float(p.price) if p.price is not None else 0.0,
        room_count=p.room_count,
        bathroom_count=p.bathroom_count,
        parking_count=p.parking_count,
        property_size=float(p.property_size) if p.property_size is not None else None,
        lot_size=float(p.lot_size) if p.lot_size is not None else None,
        image_url=p.image_url,
        detail_image_url=getattr(p, "detail_image_url", None),
        address=getattr(p, "address", None),
        year_built=getattr(p, "year_built", None),
        furnishing=getattr(p, "furnishing", None),
    )

# -----------------------------
# Queries
# -----------------------------
@strawberry.type
class Query:
    @strawberry.field
    def users(self) -> List[UserType]:
        db = SessionLocal()
        users = db.query(User).all()
        db.close()
        return [_to_user_type(u) for u in users]

    @strawberry.field
    def properties(self) -> List[PropertyType]:
        db = SessionLocal()
        props = db.query(Property).order_by(Property.created_at.desc()).all()
        db.close()
        return [_to_property_type(p) for p in props]

# -----------------------------
# Mutations
# -----------------------------
@strawberry.type
class Mutation:

    @strawberry.mutation
    def register(
        self,
        firstName: str,
        lastName: str,
        email: str,
        password: str,
        role: str,
        contactNumber: Optional[str] = None,
    ) -> AuthPayload:
        db = SessionLocal()

        # Email exists?
        if db.query(User).filter(User.email == email).first():
            db.close()
            raise Exception("Email already registered.")

        # Password rules
        try:
            _validate_password(password)
        except Exception:
            db.close()
            raise

        # Hash password
        hashed_pw = _hash_password(password)

        role_enum = UserRoleEnum(role.upper())
        is_admin = role_enum == UserRoleEnum.ADMIN

        # Create user
        user = User(
            first_name=firstName,
            last_name=lastName,
            email=email,
            password_hash=hashed_pw,
            role=role_enum.value,
            contact_number=contactNumber,
            verified=not is_admin or _is_super_admin_email(email),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        if str(user.role or "").upper() == UserRoleEnum.ADMIN.value and not user.verified and not _is_super_admin_email(user.email):
            db.close()
            raise Exception("This admin account is pending verification.")

        # JWT
        token = jwt.encode(
            {"user_id": str(user.id), "role": str(user.role or "SEEKER").upper()},
            JWT_SECRET,
            algorithm="HS256"
        )
        result = AuthPayload(user=_to_user_type(user), token=token)
        db.close()
        return result

    @strawberry.mutation
    def login(self, email: str, password: str) -> AuthPayload:
        db = SessionLocal()
        user = db.query(User).filter(User.email == email).first()
        password_bytes = password.encode("utf-8")[:72]
        if not user or not _bcrypt.checkpw(password_bytes, user.password_hash.encode("utf-8")):
            db.close()
            raise Exception("Invalid credentials.")
        if str(user.role or "").upper() == UserRoleEnum.ADMIN.value and not user.verified and not _is_super_admin_email(user.email):
            db.close()
            raise Exception("This admin account is pending verification.")

        token = jwt.encode(
            {"user_id": str(user.id), "role": str(user.role or "SEEKER").upper()},
            JWT_SECRET,
            algorithm="HS256"
        )
        result = AuthPayload(user=_to_user_type(user), token=token)
        db.close()
        return result

    @strawberry.mutation
    def create_user(
        self,
        firstName: str,
        lastName: str,
        email: str,
        password: str,
        role: str,
        contactNumber: Optional[str] = None,
        verified: Optional[bool] = None,
    ) -> UserType:
        db = SessionLocal()
        try:
            if db.query(User).filter(User.email == email).first():
                raise Exception("Email already registered.")
            try:
                role_enum = UserRoleEnum(role.upper())
            except ValueError:
                raise Exception("Role must be ADMIN, AGENT, OWNER or SEEKER.")
            _validate_password(password)
            if verified is None:
                verified = role_enum != UserRoleEnum.ADMIN or _is_super_admin_email(email)
            user = User(
                first_name=firstName,
                last_name=lastName,
                email=email,
                password_hash=_hash_password(password),
                role=role_enum.value,
                contact_number=contactNumber,
                verified=verified,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            return _to_user_type(user)
        finally:
            db.close()

    @strawberry.mutation
    def update_user(
        self,
        id: int,
        firstName: Optional[str] = None,
        lastName: Optional[str] = None,
        email: Optional[str] = None,
        password: Optional[str] = None,
        role: Optional[str] = None,
        contactNumber: Optional[str] = None,
        verified: Optional[bool] = None,
    ) -> UserType:
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == id).first()
            if not user:
                raise Exception("User not found.")
            if email is not None and email != user.email:
                if db.query(User).filter(User.email == email).first():
                    raise Exception("Email already registered.")
                user.email = email
            if firstName is not None:
                user.first_name = firstName
            if lastName is not None:
                user.last_name = lastName
            if role is not None:
                try:
                    user.role = UserRoleEnum(role.upper()).value
                except ValueError:
                    raise Exception("Role must be ADMIN, AGENT, OWNER or SEEKER.")
                if str(user.role or "").upper() == UserRoleEnum.ADMIN.value and verified is None and not _is_super_admin_email(user.email):
                    user.verified = False
            if contactNumber is not None:
                user.contact_number = contactNumber
            if verified is not None:
                user.verified = verified
            elif str(user.role or "").upper() == UserRoleEnum.ADMIN.value and _is_super_admin_email(user.email):
                user.verified = True
            if password:
                _validate_password(password)
                user.password_hash = _hash_password(password)
            db.commit()
            db.refresh(user)
            return _to_user_type(user)
        finally:
            db.close()

    @strawberry.mutation
    def delete_user(self, id: int) -> bool:
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == id).first()
            if not user:
                raise Exception("User not found.")
            db.delete(user)
            db.commit()
            return True
        finally:
            db.close()

    @strawberry.mutation
    def create_property(
        self,
        title: str,
        description: Optional[str] = None,
        listing_type: str = "sale",
        price: float = 0,
        room_count: int = 0,
        bathroom_count: int = 0,
        parking_count: int = 0,
        property_size: Optional[float] = None,
        lot_size: Optional[float] = None,
        image_url: Optional[str] = None,
        detail_image_url: Optional[str] = None,
        address: Optional[str] = None,
        year_built: Optional[int] = None,
        furnishing: Optional[str] = None,
    ) -> PropertyType:
        if listing_type not in ("sale", "rent"):
            raise Exception("listing_type must be 'sale' or 'rent'.")

        db = SessionLocal()
        try:
            prop = Property(
                title=title,
                description=description,
                listing_type=listing_type,
                price=price,
                room_count=room_count,
                bathroom_count=bathroom_count,
                parking_count=parking_count,
                property_size=property_size,
                lot_size=lot_size,
                image_url=image_url,
                detail_image_url=detail_image_url,
                address=address,
                year_built=year_built,
                furnishing=furnishing,
            )
            db.add(prop)
            db.commit()
            db.refresh(prop)
            return _to_property_type(prop)
        finally:
            db.close()

    @strawberry.mutation
    def update_property(
        self,
        id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        listing_type: Optional[str] = None,
        price: Optional[float] = None,
        room_count: Optional[int] = None,
        bathroom_count: Optional[int] = None,
        parking_count: Optional[int] = None,
        property_size: Optional[float] = None,
        lot_size: Optional[float] = None,
        image_url: Optional[str] = None,
        detail_image_url: Optional[str] = None,
        address: Optional[str] = None,
        year_built: Optional[int] = None,
        furnishing: Optional[str] = None,
    ) -> PropertyType:
        if listing_type is not None and listing_type not in ("sale", "rent"):
            raise Exception("listing_type must be 'sale' or 'rent'.")

        db = SessionLocal()
        try:
            prop = db.query(Property).filter(Property.id == id).first()
            if not prop:
                raise Exception("Property not found.")
            if title is not None:
                prop.title = title
            if description is not None:
                prop.description = description
            if listing_type is not None:
                prop.listing_type = listing_type
            if price is not None:
                prop.price = price
            if room_count is not None:
                prop.room_count = room_count
            if bathroom_count is not None:
                prop.bathroom_count = bathroom_count
            if parking_count is not None:
                prop.parking_count = parking_count
            if property_size is not None:
                prop.property_size = property_size
            if lot_size is not None:
                prop.lot_size = lot_size
            if image_url is not None:
                prop.image_url = image_url or None
            if detail_image_url is not None:
                prop.detail_image_url = detail_image_url or None
            if address is not None:
                prop.address = address
            if year_built is not None:
                prop.year_built = year_built
            if furnishing is not None:
                prop.furnishing = furnishing
            db.commit()
            db.refresh(prop)
            return _to_property_type(prop)
        finally:
            db.close()

    @strawberry.mutation
    def delete_property(self, id: str) -> bool:
        db = SessionLocal()
        try:
            prop = db.query(Property).filter(Property.id == id).first()
            if not prop:
                raise Exception("Property not found.")
            db.delete(prop)
            db.commit()
            return True
        finally:
            db.close()

schema = strawberry.Schema(query=Query, mutation=Mutation)