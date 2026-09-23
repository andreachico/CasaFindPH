from sqlalchemy import Column, Integer, String, Text, Enum, Date, Numeric, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class UserRoleEnum(enum.Enum):
    AGENT = "AGENT"
    OWNER = "OWNER"
    SEEKER = "SEEKER"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    birthday = Column(Date, nullable=True)
    address = Column(Text, nullable=True)
    contact_number = Column(String(20), nullable=True)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRoleEnum), nullable=False)

# `listing_type` and the `properties` table are managed by CasaFindCMS via its
# Supabase migrations. create_type=False tells SQLAlchemy the enum already
# exists so startup table creation never tries to recreate it.
ListingTypeEnum = Enum("sale", "rent", name="listing_type", create_type=False)

class Property(Base):
    """Shared properties table owned by CasaFindCMS (Supabase Postgres).

    The column shape mirrors CasaFindCMS/supabase/migrations so the CasaFind
    website reads exactly what editors publish in the CMS.
    """
    __tablename__ = "properties"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    listing_type = Column(ListingTypeEnum, nullable=False, server_default="sale")
    price = Column(Numeric(15, 2), nullable=False, server_default="0")
    room_count = Column(Integer, nullable=False, server_default="0")
    bathroom_count = Column(Integer, nullable=False, server_default="0")
    parking_count = Column(Integer, nullable=False, server_default="0")
    property_size = Column(Numeric(10, 2), nullable=True)
    lot_size = Column(Numeric(10, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())