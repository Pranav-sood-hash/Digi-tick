from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True) # Used for local auth mode
    full_name = Column(String(255), nullable=True)
    avatar_url = Column(String(1024), nullable=True)
    auth_provider = Column(String(50), default="email", nullable=False) # 'email' or 'google'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    shopping_lists = relationship("ShoppingList", back_populates="user", cascade="all, delete-orphan")
    scanned_documents = relationship("ScannedDocument", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("ShoppingActivity", back_populates="user", cascade="all, delete-orphan")

