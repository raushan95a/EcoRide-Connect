from fastapi import APIRouter

from modules.sustainability import (
    calculate_total_carbon_emission,
    calculate_total_fuel_consumption,
    compare_electric_vs_fuel_vehicles,
    get_sustainability_report,
)

router = APIRouter()


@router.get("/report")
def sustainability_report():
    return get_sustainability_report()


@router.get("/compare-vehicles")
def compare_vehicle_emissions():
    return compare_electric_vs_fuel_vehicles()


@router.get("/fuel-total")
def total_fuel():
    return {"total_fuel_consumed": calculate_total_fuel_consumption()}


@router.get("/emission-total")
def total_emission():
    return {"total_co2_emitted_kg": calculate_total_carbon_emission()}
