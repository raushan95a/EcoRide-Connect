from fastapi import HTTPException

from store import in_memory_store as store


def _build_carpool_groups() -> list:
    grouped = {}
    for ride in store.rides_list:
        if ride["ride_type"] != "Carpool":
            continue
        route = ride["route"]
        grouped.setdefault(
            route,
            {
                "route": route,
                "user_ids": [],
                "original_fare": 0.0,
                "actual_fare_total": 0.0,
                "reduced_fare_per_user": 0.0,
                "emission_saved_kg": 0.0,
                "total_passengers": 0,
                "tag": "Shared Ride",
            },
        )
        group = grouped[route]
        group["user_ids"].append(ride["user_id"])
        solo_fare = ride["distance_km"] * 10
        solo_emission = ride["distance_km"] * 0.21
        group["original_fare"] += round(solo_fare, 2)
        group["actual_fare_total"] += ride["fare_amount"]
        group["emission_saved_kg"] += max(solo_emission - ride["carbon_emission_kg"], 0)
        group["total_passengers"] += max(ride["num_passengers"], 1)

    results = []
    for route, group in grouped.items():
        user_count = len(group["user_ids"])
        reduced_fare_per_user = round(group["actual_fare_total"] / max(user_count, 1), 2)
        emission_saved_kg = round(group["emission_saved_kg"], 2)
        tag = "Efficient Ride Share" if group["total_passengers"] >= 3 else "Shared Ride"
        results.append(
            {
                "route": route,
                "user_ids": group["user_ids"],
                "original_fare": round(group["original_fare"], 2),
                "reduced_fare_per_user": reduced_fare_per_user,
                "emission_saved_kg": emission_saved_kg,
                "tag": tag,
                "total_passengers": group["total_passengers"],
                "actual_fare_total": round(group["actual_fare_total"], 2),
            }
        )
    return results


def group_users_by_route() -> list:
    return _build_carpool_groups()


def calculate_carpool_savings(route: str) -> dict:
    route_groups = {group["route"]: group for group in _build_carpool_groups()}
    if route not in route_groups:
        raise HTTPException(status_code=404, detail="Carpool route not found")

    group = route_groups[route]
    savings = round(group["original_fare"] - group["actual_fare_total"], 2)
    return {
        "route": route,
        "total_users": len(group["user_ids"]),
        "original_total_fare": round(group["original_fare"], 2),
        "carpool_total_fare": round(group["actual_fare_total"], 2),
        "total_fare_saved": savings,
        "total_emission_saved_kg": group["emission_saved_kg"],
        "tag": group["tag"],
    }


def identify_efficient_sharing() -> list:
    return [group for group in _build_carpool_groups() if group["total_passengers"] >= 3]
