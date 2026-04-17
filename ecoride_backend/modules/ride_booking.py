import math
import random

from fastapi import HTTPException

from modules.registration import (
    get_driver_by_id,
    get_user_by_id,
    refresh_driver_status,
    refresh_user_status,
)
from store import in_memory_store as store


FUEL_CONSUMPTION_RATES = {"Petrol": 0.08, "Diesel": 0.07, "Electric": 0.02}
EMISSION_RATES = {"Petrol": 0.21, "Diesel": 0.19, "Electric": 0.0}


def calculate_fare(distance_km: float, ride_type: str, membership_type: str) -> tuple:
    base_fare = distance_km * 10
    discount_applied = 0.0

    if ride_type == "Carpool":
        discount_applied += base_fare * 0.30
    discounted_fare = base_fare - discount_applied

    if membership_type == "Premium":
        member_discount = discounted_fare * 0.10
        discount_applied += member_discount
        discounted_fare -= member_discount
    elif membership_type == "Student":
        member_discount = discounted_fare * 0.05
        discount_applied += member_discount
        discounted_fare -= member_discount

    fare_amount = math.ceil(discounted_fare)
    return fare_amount, round(discount_applied, 2)


def calculate_fuel_and_emission(
    distance_km: float, fuel_type: str, num_passengers: int
) -> tuple:
    fuel_consumption = round(distance_km * FUEL_CONSUMPTION_RATES[fuel_type], 2)
    base_emission = distance_km * EMISSION_RATES[fuel_type]
    shared_emission = base_emission / max(num_passengers, 1)
    emission_variance = math.sqrt(distance_km) / max(num_passengers, 1)
    carbon_emission_kg = round(shared_emission + (emission_variance * 0.01), 2)
    return fuel_consumption, carbon_emission_kg


def book_ride(ride_data: dict) -> dict:
    user = get_user_by_id(ride_data["user_id"])
    driver = get_driver_by_id(ride_data["driver_id"])

    if ride_data["ride_id"] in store.rides_dict:
        raise HTTPException(status_code=400, detail="Ride ID already exists")

    fare_amount, discount_applied = calculate_fare(
        ride_data["distance_km"], ride_data["ride_type"], user["membership_type"]
    )
    fuel_consumption, carbon_emission_kg = calculate_fuel_and_emission(
        ride_data["distance_km"], driver["fuel_type"], ride_data["num_passengers"]
    )

    forced_pending = bool(ride_data.get("force_pending"))
    if forced_pending:
        ride_status = "Pending"
    else:
        ride_status = "Completed" if random.random() < 0.85 else "Cancelled"
    if ride_status == "Cancelled":
        driver["cancellation_count"] += 1
        refresh_driver_status(driver["driver_id"])

    eco_friendly = carbon_emission_kg < 3.0
    route = f'{ride_data["source_location"]}->{ride_data["destination_location"]}'
    simulated_hour = random.randint(6, 22)

    ride_record = {
        **ride_data,
        "fare_amount": fare_amount,
        "fuel_consumption": fuel_consumption,
        "carbon_emission_kg": carbon_emission_kg,
        "ride_status": ride_status,
        "eco_friendly": eco_friendly,
        "discount_applied": discount_applied,
        "route": route,
        "hour": simulated_hour,
        "emission_variance": round(math.sqrt(ride_data["distance_km"]), 2),
    }

    store.unique_routes_set.add(route)
    store.route_ride_count_dict[route] = store.route_ride_count_dict.get(route, 0) + 1
    store.user_ride_history_dict.setdefault(user["user_id"], []).append(ride_data["ride_id"])
    store.ride_route_tuples.append(
        (ride_data["ride_id"], ride_data["source_location"], ride_data["destination_location"])
    )
    store.ride_metric_tuples.append(
        (ride_data["distance_km"], fare_amount, carbon_emission_kg)
    )
    store.route_logs_list.append(
        {
            "ride_id": ride_data["ride_id"],
            "route": route,
            "hour": simulated_hour,
            "ride_type": ride_data["ride_type"],
        }
    )
    store.rides_list.append(ride_record)
    store.rides_dict[ride_data["ride_id"]] = ride_record
    if ride_status == "Completed":
        payment_status = "Paid"
    elif ride_status == "Cancelled":
        payment_status = "Refund Pending"
    else:
        payment_status = "Payment Pending"

    store.payments_list.append(
        {
            "ride_id": ride_data["ride_id"],
            "user_id": ride_data["user_id"],
            "payment_mode": ride_data["payment_mode"],
            "fare_amount": fare_amount,
            "status": payment_status,
        }
    )
    refresh_user_status(user["user_id"])
    store.save_store()
    return ride_record


def cancel_ride(ride_id: str) -> dict:
    ride = store.rides_dict.get(ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride["ride_status"] == "Cancelled":
        return ride

    ride["ride_status"] = "Cancelled"
    driver = get_driver_by_id(ride["driver_id"])
    driver["cancellation_count"] += 1
    refresh_driver_status(driver["driver_id"])
    return ride


def get_ride_summary(ride_id: str) -> dict:
    ride = store.rides_dict.get(ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    user = get_user_by_id(ride["user_id"])
    driver = get_driver_by_id(ride["driver_id"])
    summary = "\n".join(
        [
            "----- RIDE SUMMARY -----",
            f"Ride ID: {ride['ride_id']}",
            f"User: {user['user_name']}",
            f"Driver: {driver['driver_name']}",
            f"Route: {ride['source_location']} -> {ride['destination_location']}",
            f"Distance: {ride['distance_km']} km",
            f"Ride Type: {ride['ride_type']}",
            f"Fare: Rs. {ride['fare_amount']}",
            f"Emission: {ride['carbon_emission_kg']} kg CO2",
            f"Status: {ride['ride_status']}",
        ]
    )
    return {"summary": summary, "ride": ride}


def get_frequently_cancelled_drivers() -> list:
    return [
        driver
        for driver in store.drivers_list
        if driver.get("cancellation_count", 0) > 5
    ]
