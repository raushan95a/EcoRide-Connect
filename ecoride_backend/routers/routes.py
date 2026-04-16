from fastapi import APIRouter

from modules.route_analysis import (
    analyze_peak_travel_times,
    get_all_unique_routes,
    get_low_demand_routes,
    get_popular_routes,
)
from store import in_memory_store as store

router = APIRouter()


@router.get("/popular")
def popular_routes(top_n: int = 5):
    return get_popular_routes(top_n=top_n)


@router.get("/low-demand")
def low_demand_routes(threshold: int = 3):
    return get_low_demand_routes(threshold=threshold)


@router.get("/unique")
def unique_routes():
    return get_all_unique_routes()


@router.get("/peak-times")
def peak_travel_times():
    return analyze_peak_travel_times(store.rides_list)
