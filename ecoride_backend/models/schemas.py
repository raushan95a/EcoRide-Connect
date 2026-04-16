from typing import List

from pydantic import BaseModel, Field, field_validator


VALID_MEMBERSHIPS = {"Regular", "Premium", "Student"}
VALID_TRAVEL_MODES = {"Carpool", "Solo", "Bike", "Electric"}
VALID_VEHICLE_TYPES = {"Car", "Bike", "Electric"}
VALID_FUEL_TYPES = {"Petrol", "Diesel", "Electric"}
VALID_RIDE_TYPES = {"Solo", "Carpool"}
VALID_PAYMENT_MODES = {"Cash", "UPI", "Card"}


class UserCreate(BaseModel):
    user_id: str
    user_name: str
    age: int = Field(ge=18, le=100)
    contact_number: str
    membership_type: str
    preferred_travel_mode: str

    @field_validator("membership_type")
    @classmethod
    def validate_membership_type(cls, value: str) -> str:
        if value not in VALID_MEMBERSHIPS:
            raise ValueError("membership_type must be Regular, Premium, or Student")
        return value

    @field_validator("preferred_travel_mode")
    @classmethod
    def validate_travel_mode(cls, value: str) -> str:
        if value not in VALID_TRAVEL_MODES:
            raise ValueError("preferred_travel_mode must be Carpool, Solo, Bike, or Electric")
        return value


class UserResponse(UserCreate):
    user_status: str


class DriverCreate(BaseModel):
    driver_id: str
    driver_name: str
    vehicle_type: str
    vehicle_number: str
    fuel_type: str
    rating: float = Field(ge=1.0, le=5.0)

    @field_validator("vehicle_type")
    @classmethod
    def validate_vehicle_type(cls, value: str) -> str:
        if value not in VALID_VEHICLE_TYPES:
            raise ValueError("vehicle_type must be Car, Bike, or Electric")
        return value

    @field_validator("fuel_type")
    @classmethod
    def validate_fuel_type(cls, value: str) -> str:
        if value not in VALID_FUEL_TYPES:
            raise ValueError("fuel_type must be Petrol, Diesel, or Electric")
        return value


class DriverResponse(DriverCreate):
    driver_status: str
    cancellation_count: int


class RideCreate(BaseModel):
    ride_id: str
    user_id: str
    driver_id: str
    source_location: str
    destination_location: str
    distance_km: float = Field(gt=0)
    ride_type: str
    payment_mode: str
    num_passengers: int = Field(ge=1, le=8)

    @field_validator("ride_type")
    @classmethod
    def validate_ride_type(cls, value: str) -> str:
        if value not in VALID_RIDE_TYPES:
            raise ValueError("ride_type must be Solo or Carpool")
        return value

    @field_validator("payment_mode")
    @classmethod
    def validate_payment_mode(cls, value: str) -> str:
        if value not in VALID_PAYMENT_MODES:
            raise ValueError("payment_mode must be Cash, UPI, or Card")
        return value


class RideResponse(RideCreate):
    fare_amount: float
    fuel_consumption: float
    carbon_emission_kg: float
    ride_status: str
    eco_friendly: bool
    discount_applied: float


class AnalyticsReport(BaseModel):
    total_rides: int
    average_distance_km: float
    average_fare: float
    std_deviation_fare: float
    most_popular_route: str
    eco_friendly_rides: int
    high_demand_routes: List[str]
    cancelled_rides: int
    emission_trend: List[float]


class UserSummaryRow(BaseModel):
    user_id: str
    total_rides: int
    avg_distance: float
    total_emission: float
    status: str


class RewardOutput(BaseModel):
    user_id: str
    user_name: str
    reward_type: str
    reward_code: str
    green_points: int


class CarpoolGroup(BaseModel):
    route: str
    user_ids: List[str]
    original_fare: float
    reduced_fare_per_user: float
    emission_saved_kg: float
