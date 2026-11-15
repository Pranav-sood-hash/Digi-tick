from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.ocr import OCRScanResponse, ConfirmOCRRequest
from app.schemas.shopping_list import ShoppingListResponse
from app.services.auth_service import get_current_user
from app.services.ocr_service import process_scanned_image
from app.services.list_service import create_list, add_single_item, format_list_summary, get_list_by_id

router = APIRouter(prefix="/ocr", tags=["AI OCR Scanner"])

@router.post("/scan", response_model=OCRScanResponse)
async def scan_shopping_list_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image (PNG, JPG, WEBP).")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed 10MB limit.")

    result = process_scanned_image(
        db=db,
        user_id=current_user.id,
        file_bytes=contents,
        filename=file.filename or "scan.jpg",
        mime_type=file.content_type
    )
    return result

@router.post("/confirm", response_model=ShoppingListResponse)
def confirm_scanned_items_to_list(
    payload: ConfirmOCRRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Target list: either existing or new
    if payload.list_id:
        target_list = get_list_by_id(db, current_user.id, payload.list_id)
        list_summary = format_list_summary(target_list)
    else:
        title = payload.new_list_title or "Scanned Shopping List"
        list_summary = create_list(db, current_user.id, title)
        target_list = get_list_by_id(db, current_user.id, list_summary["id"])

    # 2. Add all confirmed items
    for item_data in payload.items:
        add_single_item(db, current_user.id, target_list.id, item_data)

    db.refresh(target_list)
    return format_list_summary(target_list)

