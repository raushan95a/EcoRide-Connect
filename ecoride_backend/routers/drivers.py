from fastapi import APIRouter

from models.schemas import DriverCreate
from modules.registration import get_all_drivers, get_driver_by_id, register_driver
from modules.ride_booking import get_frequently_cancelled_drivers
from modules.sustainability import identify_eco_friendly_drivers

router = APIRouter()


@router.post("/register")
def create_driver(driver: DriverCreate):
    return register_driver(driver.model_dump())


@router.get("/")
def list_drivers():
    return get_all_drivers()


@router.get("/unreliable")
def list_unreliable_drivers():
    return get_frequently_cancelled_drivers()


@router.get("/eco-friendly")
def list_eco_friendly_drivers():
    return identify_eco_friendly_drivers()


@router.get("/{driver_id}")
def get_driver(driver_id: str):
    return get_driver_by_id(driver_id)
