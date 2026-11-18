import os
import uuid
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base, Property, User, UserRoleEnum
from schema import schema

load_dotenv()

# Database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://casafind_admin:And9821!casafind@localhost:5432/casafind_db"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GraphQL
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

# Uploaded media
uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "uploads"))
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

def ensure_user_verified_column():
    with engine.begin() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'verified'")
        ).fetchone()
        if not exists:
            conn.execute(text("ALTER TABLE users ADD COLUMN verified BOOLEAN NOT NULL DEFAULT FALSE"))


def ensure_user_auth_columns():
    with engine.begin() as conn:
        compatibility = {
            "first_name": "VARCHAR(100)",
            "last_name": "VARCHAR(100)",
            "birthday": "DATE",
            "address": "TEXT",
            "contact_number": "VARCHAR(20)",
            "role": "VARCHAR(30) DEFAULT 'SEEKER'",
        }

        for column_name, definition in compatibility.items():
            exists = conn.execute(
                text("SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = :column_name"),
                {"column_name": column_name},
            ).fetchone()
            if not exists:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {column_name} {definition}"))


def ensure_property_image_url_column():
    with engine.begin() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'image_url'")
        ).fetchone()
        if not exists:
            conn.execute(text("ALTER TABLE properties ADD COLUMN image_url VARCHAR(500)"))


def ensure_property_detail_image_url_column():
    with engine.begin() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'detail_image_url'")
        ).fetchone()
        if not exists:
            conn.execute(text("ALTER TABLE properties ADD COLUMN detail_image_url VARCHAR(500)"))


def ensure_property_slice_columns():
    new_columns = {
        "address": "TEXT",
        "year_built": "INTEGER",
        "furnishing": "VARCHAR(30)",
    }
    with engine.begin() as conn:
        for column_name, definition in new_columns.items():
            exists = conn.execute(
                text("SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = :column_name"),
                {"column_name": column_name},
            ).fetchone()
            if not exists:
                conn.execute(text(f"ALTER TABLE properties ADD COLUMN {column_name} {definition}"))

# Create tables on startup
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    ensure_user_verified_column()
    ensure_user_auth_columns()
    ensure_property_image_url_column()
    ensure_property_detail_image_url_column()
    ensure_property_slice_columns()

# Upload endpoint
@app.post("/upload")
def upload_photo(file: UploadFile = File(...)):
    os.makedirs(uploads_dir, exist_ok=True)
    ext = os.path.splitext(file.filename or "image")[1] or ".jpg"
    safe_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(uploads_dir, safe_name)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return {"url": f"/uploads/{safe_name}"}