from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings
import os

database_url = settings.DATABASE_URL
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

connect_args = {}
if database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    database_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.models import user, shopping_list, shopping_item, scanned_document, activity
    Base.metadata.create_all(bind=engine)

    # Ensure auth_provider column exists on profiles table
    with engine.connect() as conn:
        try:
            from sqlalchemy import text
            conn.execute(text("ALTER TABLE profiles ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'email'"))
            conn.commit()
        except Exception:
            pass

