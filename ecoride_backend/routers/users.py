from fastapi import APIRouter, HTTPException

from models.schemas import UserCreate, UserSignup, UserLogin
from modules.registration import get_all_users, get_user_by_id, register_user
from store import in_memory_store as store
from store.in_memory_store import save_store
from modules.route_analysis import get_frequent_riders
from modules.sustainability import identify_eco_friendly_users

router = APIRouter()

@router.post("/signup")
def signup(user: UserSignup):
    if user.email in store.users_dict:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Store complete record to satisfy the ride booking requirements
    user_record = {
        "user_id": user.email,
        "user_name": user.name,
        "name": user.name,
        "email": user.email,
        "password": user.password,
        "membership_type": "Regular",
        "preferred_travel_mode": "Solo",
        "age": 20,
        "contact_number": "0000000000",
    }
    
    saved_record = register_user(user_record)
    save_store()
    
    return {"message": "Signup successful", "user": saved_record}

@router.post("/login")
def login(user: UserLogin):
    user_record = store.users_dict.get(user.email)
    if not user_record or user_record.get("password") != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "token": f"fake-token-for-{user.email}",
        "user_id": user_record.get("user_id", user.email),
    }


@router.post("/register")
def create_user(user: UserCreate):
    record = register_user(user.model_dump())
    save_store()
    return record


@router.get("/")
def list_users():
    return get_all_users()


@router.get("/frequent")
def list_frequent_riders():
    return get_frequent_riders()


@router.get("/eco-friendly")
def list_eco_friendly_users():
    return identify_eco_friendly_users()


@router.get("/{user_id}")
def get_user(user_id: str):
    return get_user_by_id(user_id)
