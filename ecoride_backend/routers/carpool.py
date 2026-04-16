from fastapi import APIRouter

from modules.carpool import (
    calculate_carpool_savings,
    group_users_by_route,
    identify_efficient_sharing,
)

router = APIRouter()


@router.get("/groups")
def list_carpool_groups():
    return group_users_by_route()


@router.get("/savings/{route}")
def get_carpool_savings(route: str):
    return calculate_carpool_savings(route)


@router.get("/efficient")
def efficient_carpool_groups():
    return identify_efficient_sharing()
