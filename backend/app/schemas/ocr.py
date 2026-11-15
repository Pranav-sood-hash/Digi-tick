from pydantic import BaseModel
from typing import Optional, List
from app.schemas.shopping_item import ShoppingItemCreate

class ExtractedItem(BaseModel):
    name: str
    quantity: float = 1.0
    unit: str = "item"
    category: str = "Other"
    notes: Optional[str] = None
    confidence: float = 0.9

class OCRScanResponse(BaseModel):
    document_id: str
    image_url: str
    raw_text: str
    items: List[ExtractedItem]
    is_simulated: bool = False
    message: str

class ConfirmOCRRequest(BaseModel):
    document_id: Optional[str] = None
    list_id: Optional[str] = None
    new_list_title: Optional[str] = None
    items: List[ShoppingItemCreate]

