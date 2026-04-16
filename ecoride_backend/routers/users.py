from fastapi import APIRouter

from models.schemas import UserCreate
from modules.registration import get_all_users, get_user_by_id, register_user
from modules.route_analysis import get_frequent_riders
from modules.sustainability import identify_eco_friendly_users

router = APIRouter()


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
