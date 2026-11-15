from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ShoppingActivity(Base):
    __tablename__ = "shopping_activity"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    list_id = Column(String(36), ForeignKey("shopping_lists.id", ondelete="SET NULL"), nullable=True)
    activity_type = Column(String(50), nullable=False) # "created", "completed", "item_added", "reused", "scanned"
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="activities")
    shopping_list = relationship("ShoppingList", back_populates="activities")

