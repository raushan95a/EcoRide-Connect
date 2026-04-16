from fastapi import APIRouter

from modules.rewards import (
    generate_green_points_for_user,
    generate_random_discount,
    select_eco_reward_winners,
)
from modules.sustainability import identify_eco_friendly_users

router = APIRouter()


@router.get("/winners")
def reward_winners(num_winners: int = 3):
    eco_users = identify_eco_friendly_users()
    return select_eco_reward_winners(eco_users, num_winners=num_winners)


@router.get("/simulate-discount")
def simulate_discount():
    return {"discount_percent": generate_random_discount()}


@router.get("/green-points/{user_id}")
def green_points(user_id: str):
    return generate_green_points_for_user(user_id)
