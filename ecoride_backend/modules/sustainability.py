import math

from store import in_memory_store as store


def _completed_rides() -> list:
    return [ride for ride in store.rides_list if ride["ride_status"] == "Completed"]


def calculate_total_fuel_consumption() -> float:
    return round(sum(ride["fuel_consumption"] for ride in _completed_rides()), 2)


def calculate_total_carbon_emission() -> float:
    return round(sum(ride["carbon_emission_kg"] for ride in _completed_rides()), 2)


def compare_electric_vs_fuel_vehicles() -> dict:
    electric_emissions = []
    fuel_emissions = []

    for ride in _completed_rides():
        driver = store.drivers_dict.get(ride["driver_id"])
        if not driver:
            continue
        if driver["fuel_type"] == "Electric":
            electric_emissions.append(ride["carbon_emission_kg"])
        else:
            fuel_emissions.append(ride["carbon_emission_kg"])

    electric_avg = sum(electric_emissions) / len(electric_emissions) if electric_emissions else 0.0
    fuel_avg = sum(fuel_emissions) / len(fuel_emissions) if fuel_emissions else 0.0
    reduction_percent = 0.0
    if fuel_avg:
        reduction_percent = ((fuel_avg - electric_avg) / fuel_avg) * 100

    normalized_electric = math.log(electric_avg + 1) if electric_avg >= 0 else 0.0
    normalized_fuel = math.log(fuel_avg + 1) if fuel_avg >= 0 else 0.0

    return {
        "electric_avg_emission": round(electric_avg, 2),
        "fuel_avg_emission": round(fuel_avg, 2),
        "emission_reduction_percent": round(reduction_percent, 2),
        "normalized_scores": {
            "electric": round(normalized_electric, 4),
            "fuel": round(normalized_fuel, 4),
        },
    }


def identify_eco_friendly_users() -> list:
    eco_users = []
    for user in store.users_list:
        if user["preferred_travel_mode"] not in {"Carpool", "Electric", "Bike"}:
            continue
        user_rides = [
            store.rides_dict[ride_id]
            for ride_id in store.user_ride_history_dict.get(user["user_id"], [])
            if ride_id in store.rides_dict and store.rides_dict[ride_id]["ride_status"] == "Completed"
        ]
        if not user_rides:
            avg_emission = 0.0
        else:
            avg_emission = sum(ride["carbon_emission_kg"] for ride in user_rides) / len(user_rides)
        if avg_emission < 3.0:
            eco_score = max(0.0, 100 - (avg_emission * 20))
            eco_users.append(
                {
                    **user,
                    "avg_carbon_emission": round(avg_emission, 2),
                    "eco_friendly_score": round(eco_score, 2),
                }
            )
    eco_users.sort(key=lambda item: item["eco_friendly_score"], reverse=True)
    return eco_users


def identify_eco_friendly_drivers() -> list:
    eco_drivers = []
    for driver in store.drivers_list:
        driver_rides = [
            ride
            for ride in _completed_rides()
            if ride["driver_id"] == driver["driver_id"]
        ]
        avg_emission = (
            sum(ride["carbon_emission_kg"] for ride in driver_rides) / len(driver_rides)
            if driver_rides
            else 0.0
        )
        if driver["fuel_type"] == "Electric" or avg_emission < 2.5:
            eco_drivers.append(
                {
                    **driver,
                    "avg_emission_per_ride": round(avg_emission, 2),
                }
            )
    eco_drivers.sort(key=lambda item: item["avg_emission_per_ride"])
    return eco_drivers


def get_sustainability_report() -> dict:
    total_drivers = len(store.drivers_list)
    electric_drivers = [
        driver for driver in store.drivers_list if driver["fuel_type"] == "Electric"
    ]
    eco_rides = [ride for ride in _completed_rides() if ride["eco_friendly"]]

    return {
        "total_fuel_consumed": calculate_total_fuel_consumption(),
        "total_co2_emitted_kg": calculate_total_carbon_emission(),
        "eco_friendly_rides_count": len(eco_rides),
        "electric_vehicle_percentage": round(
            (len(electric_drivers) / total_drivers) * 100, 2
        )
        if total_drivers
        else 0.0,
        "top_eco_users": identify_eco_friendly_users()[:5],
        "top_eco_drivers": identify_eco_friendly_drivers()[:5],
    }
