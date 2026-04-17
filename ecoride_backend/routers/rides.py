from fastapi import APIRouter, HTTPException

from models.schemas import RideCreate
from modules.rewards import simulate_random_ride_requests
from modules.ride_booking import book_ride, cancel_ride, get_ride_summary
from store import in_memory_store as store

router = APIRouter()


@router.post("/book")
def create_ride(ride: RideCreate):
    ride_payload = ride.model_dump()
    # Rides booked from the user flow should start in Pending state.
    ride_payload["force_pending"] = True
    return book_ride(ride_payload)


@router.post("/{ride_id}/cancel")
def cancel_existing_ride(ride_id: str):
    return cancel_ride(ride_id)


@router.get("/")
def list_rides():
    return store.rides_list


@router.get("/user/{user_id}")
def get_user_ride_history(user_id: str):
    ride_ids = store.user_ride_history_dict.get(user_id)
    if ride_ids is None:
        # Default to an empty list instead of throwing an error for a user with zero rides
        return []
    return [store.rides_dict[ride_id] for ride_id in ride_ids if ride_id in store.rides_dict]


@router.get("/simulate")
def simulate_ride_requests(num: int = 5):
    return simulate_random_ride_requests(num)


@router.get("/{ride_id}")
def get_ride(ride_id: str):
    return get_ride_summary(ride_id)
