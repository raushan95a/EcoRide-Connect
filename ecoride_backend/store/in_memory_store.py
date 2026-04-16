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
