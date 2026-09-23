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
    id: int
    first_name: str
    last_name: str
    email: str
    role: str

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
        return [
            UserType(
                id=u.id,
                first_name=u.first_name,
                last_name=u.last_name,
                email=u.email,
                role=u.role.value
            )
            for u in users
        ]

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
        role: str
    ) -> AuthPayload:
        db = SessionLocal()

        # Email exists?
        if db.query(User).filter(User.email == email).first():
            db.close()
            raise Exception("Email already registered.")

        # -------------------------
        # PASSWORD VALIDATION
        # -------------------------
        if len(password) < 8:
            db.close()
            raise Exception("Password must be at least 8 characters long.")
        if not re.search(r"[A-Z]", password):
            db.close()
            raise Exception("Password must contain at least one uppercase letter.")
        if not re.search(r"[0-9]", password):
            db.close()
            raise Exception("Password must contain at least one number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            db.close()
            raise Exception("Password must contain at least one special character (!@#$%^&* etc).")

        # Truncate for bcrypt (max 72 bytes)
        password_bytes = password.encode("utf-8")[:72]

        # Hash password
        hashed_pw = _bcrypt.hashpw(password_bytes, _bcrypt.gensalt()).decode("utf-8")

        # Create user
        user = User(
            first_name=firstName,
            last_name=lastName,
            email=email,
            password_hash=hashed_pw,
            role=UserRoleEnum(role.upper())
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # JWT
        token = jwt.encode(
            {"user_id": user.id, "role": user.role.value},
            JWT_SECRET,
            algorithm="HS256"
        )
        db.close()

        return AuthPayload(
            user=UserType(
                id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                role=user.role.value
            ),
            token=token
        )

    @strawberry.mutation
    def login(self, email: str, password: str) -> AuthPayload:
        db = SessionLocal()
        user = db.query(User).filter(User.email == email).first()
        password_bytes = password.encode("utf-8")[:72]
        if not user or not _bcrypt.checkpw(password_bytes, user.password_hash.encode("utf-8")):
            db.close()
            raise Exception("Invalid credentials.")

        token = jwt.encode(
            {"user_id": user.id, "role": user.role.value},
            JWT_SECRET,
            algorithm="HS256"
        )
        db.close()

        return AuthPayload(
            user=UserType(
                id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                role=user.role.value
            ),
            token=token
        )

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
            )
            db.add(prop)
            db.commit()
            db.refresh(prop)
            return _to_property_type(prop)
        finally:
            db.close()

schema = strawberry.Schema(query=Query, mutation=Mutation)