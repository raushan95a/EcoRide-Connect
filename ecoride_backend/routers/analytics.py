from fastapi import APIRouter, HTTPException

from modules.analytics import (
    analyze_emission_trends,
    generate_full_analytics_report,
    generate_route_summary_table,
    generate_user_summary_table,
)
from modules.recursion import (
    recursive_ride_count_for_user,
    recursive_search_ride_history,
    recursive_total_distance,
    recursive_total_emissions,
)
from store import in_memory_store as store

router = APIRouter()


@router.get("/report")
def analytics_report():
    return generate_full_analytics_report()


@router.get("/user-summary")
def user_summary():
    return generate_user_summary_table(
        store.users_dict, store.rides_list, store.user_ride_history_dict
    )


@router.get("/route-summary")
def route_summary():
    return generate_route_summary_table(store.route_ride_count_dict, store.rides_list)


@router.get("/emission-trends")
def emission_trends():
    return analyze_emission_trends(store.rides_list)


@router.get("/recursive/total-distance")
def recursive_distance():
    return {"total_distance_km": round(recursive_total_distance(store.rides_list), 2)}


@router.get("/recursive/total-emissions")
def recursive_emissions():
    return {"total_emissions_kg": round(recursive_total_emissions(store.rides_list), 2)}


@router.get("/recursive/ride-count/{user_id}")
def recursive_user_ride_count(user_id: str):
    ride_history = store.user_ride_history_dict.get(user_id)
    if ride_history is None:
        raise HTTPException(status_code=404, detail="User ride history not found")
    return {"user_id": user_id, "ride_count": recursive_ride_count_for_user(ride_history)}


@router.get("/recursive/search/{user_id}/{ride_id}")
def recursive_search(user_id: str, ride_id: str):
    ride_history = store.user_ride_history_dict.get(user_id)
    if ride_history is None:
        raise HTTPException(status_code=404, detail="User ride history not found")
    return {
        "user_id": user_id,
        "ride_id": ride_id,
        "found": recursive_search_ride_history(ride_history, ride_id),
    }
