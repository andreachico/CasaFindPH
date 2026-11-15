from sqlalchemy import Column, Integer, String, Text, Enum, Date, Numeric, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import enum
import uuid

Base = declarative_base()

class UserRoleEnum(enum.Enum):
    ADMIN = "ADMIN"
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
    verified = Column(Boolean, nullable=False, default=False)

# `listing_type` is stored as a plain varchar in the existing casafind_db
# `properties` table (values: 'sale' / 'rent').

class Property(Base):
    """Shared properties table in the local casafind_db.

    Only the columns the website needs are mapped here. The physical table has
    additional nullable columns (address_id, status_id, etc.) which are left to
    their defaults so inserts still succeed.
    """
    __tablename__ = "properties"
    __table_args__ = {"extend_existing": True}
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    listing_type = Column(String(20), nullable=False, default="sale")
    price = Column(Numeric(12, 2), nullable=False, default=0)
    room_count = Column(Integer, nullable=False, default=0)
    bathroom_count = Column(Integer, nullable=False, default=0)
    parking_count = Column(Integer, nullable=False, default=0)
    property_size = Column(Numeric(10, 2), nullable=True)
    lot_size = Column(Numeric(10, 2), nullable=True)
    image_url = Column(String(500), nullable=True)
    detail_image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now())