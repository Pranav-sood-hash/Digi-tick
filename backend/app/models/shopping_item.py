from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ShoppingItem(Base):
    __tablename__ = "shopping_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    list_id = Column(String(36), ForeignKey("shopping_lists.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    quantity = Column(Float, default=1.0)
    unit = Column(String(50), default="item") # "kg", "packet", "bottle", "item", "liter", "can", "box", etc.
    category = Column(String(100), default="Other", index=True) # "Produce", "Dairy & Eggs", "Bakery", "Beverages", "Meat & Seafood", "Pantry", "Snacks", "Personal Care", "Household", "Other"
    notes = Column(Text, nullable=True)
    is_purchased = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    shopping_list = relationship("ShoppingList", back_populates="items")

