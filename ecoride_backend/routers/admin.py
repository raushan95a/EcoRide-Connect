from fastapi import APIRouter, HTTPException
from models.schemas import AdminLogin

router = APIRouter()

# Fixed admin credentials for demonstration
ADMIN_EMAIL = "admin@ecoride.com"
ADMIN_PASSWORD = "admin"

@router.post("/login")
def login(admin: AdminLogin):
    if admin.email != ADMIN_EMAIL or admin.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    return {"message": "Admin Login successful", "token": "fake-admin-token", "role": "admin"}
