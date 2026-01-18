from fastapi import APIRouter

# route prefix /health
router = APIRouter(prefix="/health", tags=["health"])

#endpoint to check the health of the API
@router.get("")
def health():
    return {"status": "ok"}