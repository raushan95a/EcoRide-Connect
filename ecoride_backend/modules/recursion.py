def recursive_total_distance(rides: list, index: int = 0) -> float:
    if index == len(rides):
        return 0.0
    return rides[index]["distance_km"] + recursive_total_distance(rides, index + 1)


def recursive_total_emissions(rides: list, index: int = 0) -> float:
    if index == len(rides):
        return 0.0
    return rides[index]["carbon_emission_kg"] + recursive_total_emissions(rides, index + 1)


def recursive_ride_count_for_user(ride_history: list, index: int = 0) -> int:
    if index == len(ride_history):
        return 0
    return 1 + recursive_ride_count_for_user(ride_history, index + 1)


def recursive_search_ride_history(
    ride_history: list, target_ride_id: str, index: int = 0
) -> bool:
    if index == len(ride_history):
        return False
    if ride_history[index] == target_ride_id:
        return True
    return recursive_search_ride_history(ride_history, target_ride_id, index + 1)
