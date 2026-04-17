import json
import os

"""Shared in-memory store for the EcoRide backend."""

users_list = []
drivers_list = []
rides_list = []
route_logs_list = []
payments_list = []

user_identity_tuples = []
driver_vehicle_tuples = []
ride_route_tuples = []
ride_metric_tuples = []

unique_routes_set = set()
unique_vehicle_types_set = set()
unique_fuel_types_set = set()
frequent_riders_set = set()

users_dict = {}
drivers_dict = {}
rides_dict = {}
route_ride_count_dict = {}
user_ride_history_dict = {}


DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "db.json")

def save_store(filepath: str = DB_FILE) -> None:
    data = {
        "users_list": users_list,
        "drivers_list": drivers_list,
        "rides_list": rides_list,
        "route_logs_list": route_logs_list,
        "payments_list": payments_list,
        "user_identity_tuples": [list(t) for t in user_identity_tuples],
        "driver_vehicle_tuples": [list(t) for t in driver_vehicle_tuples],
        "ride_route_tuples": [list(t) for t in ride_route_tuples],
        "ride_metric_tuples": [list(t) for t in ride_metric_tuples],
        "unique_routes_set": list(unique_routes_set),
        "unique_vehicle_types_set": list(unique_vehicle_types_set),
        "unique_fuel_types_set": list(unique_fuel_types_set),
        "frequent_riders_set": list(frequent_riders_set),
        "users_dict": users_dict,
        "drivers_dict": drivers_dict,
        "rides_dict": rides_dict,
        "route_ride_count_dict": route_ride_count_dict,
        "user_ride_history_dict": user_ride_history_dict,
    }
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f)

def load_store(filepath: str = DB_FILE) -> bool:
    if not os.path.exists(filepath):
        return False
    with open(filepath, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception:
            return False
            
    reset_store()
    
    users_list.extend(data.get("users_list", []))
    drivers_list.extend(data.get("drivers_list", []))
    rides_list.extend(data.get("rides_list", []))
    route_logs_list.extend(data.get("route_logs_list", []))
    payments_list.extend(data.get("payments_list", []))
    
    user_identity_tuples.extend([tuple(t) for t in data.get("user_identity_tuples", [])])
    driver_vehicle_tuples.extend([tuple(t) for t in data.get("driver_vehicle_tuples", [])])
    ride_route_tuples.extend([tuple(t) for t in data.get("ride_route_tuples", [])])
    ride_metric_tuples.extend([tuple(t) for t in data.get("ride_metric_tuples", [])])
    
    unique_routes_set.update(data.get("unique_routes_set", []))
    unique_vehicle_types_set.update(data.get("unique_vehicle_types_set", []))
    unique_fuel_types_set.update(data.get("unique_fuel_types_set", []))
    frequent_riders_set.update(data.get("frequent_riders_set", []))
    
    users_dict.update(data.get("users_dict", {}))
    drivers_dict.update(data.get("drivers_dict", {}))
    rides_dict.update(data.get("rides_dict", {}))
    route_ride_count_dict.update(data.get("route_ride_count_dict", {}))
    user_ride_history_dict.update(data.get("user_ride_history_dict", {}))
    return True

def reset_store() -> None:
    """Clear all in-memory collections so seed data can be recreated safely."""
    users_list.clear()
    drivers_list.clear()
    rides_list.clear()
    route_logs_list.clear()
    payments_list.clear()

    user_identity_tuples.clear()
    driver_vehicle_tuples.clear()
    ride_route_tuples.clear()
    ride_metric_tuples.clear()

    unique_routes_set.clear()
    unique_vehicle_types_set.clear()
    unique_fuel_types_set.clear()
    frequent_riders_set.clear()

    users_dict.clear()
    drivers_dict.clear()
    rides_dict.clear()
    route_ride_count_dict.clear()
    user_ride_history_dict.clear()
