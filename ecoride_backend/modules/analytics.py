import math

import numpy as np
import pandas as pd

from modules.route_analysis import get_popular_routes
from store import in_memory_store as store


def calculate_average_ride_distance(rides_list: list) -> float:
    if not rides_list:
        return 0.0
    distances = np.array([ride["distance_km"] for ride in rides_list], dtype=float)
    return round(float(np.mean(distances)), 2)


def calculate_average_fare(rides_list: list) -> float:
    if not rides_list:
        return 0.0
    fares = np.array([ride["fare_amount"] for ride in rides_list], dtype=float)
    return round(float(np.mean(fares)), 2)


def calculate_std_deviation_fare(rides_list: list) -> float:
    if not rides_list:
        return 0.0
    fares = np.array([ride["fare_amount"] for ride in rides_list], dtype=float)
    return round(float(np.std(fares)), 2)


def analyze_emission_trends(rides_list: list) -> dict:
    if not rides_list:
        return {"mean": 0.0, "max": 0.0, "min": 0.0, "std": 0.0, "series": []}

    emissions = np.array([ride["carbon_emission_kg"] for ride in rides_list], dtype=float)
    return {
        "mean": round(float(np.mean(emissions)), 2),
        "max": math.ceil(float(np.max(emissions))),
        "min": math.floor(float(np.min(emissions))),
        "std": round(float(np.std(emissions)), 2),
        "series": emissions.round(2).tolist(),
    }


def generate_user_summary_table(
    users_dict: dict, rides_list: list, user_ride_history_dict: dict
) -> list:
    ride_lookup = {ride["ride_id"]: ride for ride in rides_list}
    rows = []

    for user_id, user in users_dict.items():
        user_rides = [
            ride_lookup[ride_id]
            for ride_id in user_ride_history_dict.get(user_id, [])
            if ride_id in ride_lookup
        ]
        total_rides = len(user_rides)
        avg_distance = (
            sum(ride["distance_km"] for ride in user_rides) / total_rides if total_rides else 0.0
        )
        total_emission = sum(ride["carbon_emission_kg"] for ride in user_rides)

        if total_rides >= 10:
            status = "Frequent Rider"
        elif total_emission < 10:
            status = "Eco-Friendly"
        else:
            status = "Regular"

        rows.append(
            {
                "user_id": user_id,
                "total_rides": total_rides,
                "avg_distance": round(avg_distance, 2),
                "total_emission": round(total_emission, 2),
                "status": status,
            }
        )

    df = pd.DataFrame(rows)
    if df.empty:
        return []
    df = df.sort_values(by="total_rides", ascending=False)
    return df.to_dict(orient="records")


def generate_route_summary_table(route_ride_count_dict: dict, rides_list: list) -> list:
    rows = []
    for route, total_rides in route_ride_count_dict.items():
        route_rides = [ride for ride in rides_list if ride.get("route") == route]
        avg_fare = (
            sum(ride["fare_amount"] for ride in route_rides) / len(route_rides) if route_rides else 0.0
        )
        avg_emission = (
            sum(ride["carbon_emission_kg"] for ride in route_rides) / len(route_rides)
            if route_rides
            else 0.0
        )
        rows.append(
            {
                "route": route,
                "total_rides": total_rides,
                "avg_fare": round(avg_fare, 2),
                "avg_emission": round(avg_emission, 2),
                "demand_tag": "High Demand Route" if total_rides > 10 else "Normal",
            }
        )

    df = pd.DataFrame(rows)
    if df.empty:
        return []
    df = df.sort_values(by="total_rides", ascending=False)
    return df.to_dict(orient="records")


def generate_full_analytics_report() -> dict:
    popular_routes = get_popular_routes(top_n=1)
    emission_trend = analyze_emission_trends(store.rides_list)
    high_demand_routes = [
        route
        for route, count in store.route_ride_count_dict.items()
        if count > 10
    ]

    return {
        "total_rides": len(store.rides_list),
        "average_distance_km": calculate_average_ride_distance(store.rides_list),
        "average_fare": calculate_average_fare(store.rides_list),
        "std_deviation_fare": calculate_std_deviation_fare(store.rides_list),
        "most_popular_route": popular_routes[0]["route"] if popular_routes else "",
        "eco_friendly_rides": len([ride for ride in store.rides_list if ride["eco_friendly"]]),
        "high_demand_routes": high_demand_routes,
        "cancelled_rides": len(
            [ride for ride in store.rides_list if ride["ride_status"] == "Cancelled"]
        ),
        "emission_trend": emission_trend["series"],
    }
