from fastapi import APIRouter, HTTPException

from models.schemas import UserCreate, UserSignup, UserLogin
from modules.registration import get_all_users, get_user_by_id, register_user
from store import in_memory_store as store
from modules.route_analysis import get_frequent_riders
from modules.sustainability import identify_eco_friendly_users

router = APIRouter()

@router.post("/signup")
def signup(user: UserSignup):
    if user.email in store.users_dict:
        raise HTTPException(status_code=400, detail="Email already registered")
    # For simulation, just push an object
    user_record = {
        "user_id": user.email,
        "name": user.name,
        "email": user.email,
        "password": user.password,
    }
    store.users_dict[user.email] = user_record
    return {"message": "Signup successful", "user": user_record}

@router.post("/login")
def login(user: UserLogin):
    user_record = store.users_dict.get(user.email)
    if not user_record or user_record.get("password") != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "token": f"fake-token-for-{user.email}", "user_id": user.email}

@router.post("/register")
def create_user(user: UserCreate):
    return register_user(user.model_dump())


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
