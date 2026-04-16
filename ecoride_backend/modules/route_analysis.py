from store import in_memory_store as store


def get_popular_routes(top_n: int = 5) -> list:
    sorted_routes = sorted(
        store.route_ride_count_dict.items(), key=lambda item: item[1], reverse=True
    )
    results = []
    for route, count in sorted_routes[:top_n]:
        results.append(
            {
                "route": route,
                "count": count,
                "demand_tag": "High Demand Route" if count > 10 else "Normal",
            }
        )
    return results


def get_low_demand_routes(threshold: int = 3) -> list:
    return [
        {"route": route, "count": count}
        for route, count in store.route_ride_count_dict.items()
        if count < threshold
    ]


def analyze_peak_travel_times(rides_list: list) -> dict:
    hour_counts = {}
    for ride in rides_list:
        hour = ride.get("hour")
        if hour is None:
            continue
        hour_counts[hour] = hour_counts.get(hour, 0) + 1

    sorted_items = sorted(hour_counts.items(), key=lambda item: item[1], reverse=True)
    return {hour: count for hour, count in sorted_items}


def get_frequent_riders() -> list:
    riders = []
    for user_id, history in store.user_ride_history_dict.items():
        count = len(history)
        if count >= 10:
            store.frequent_riders_set.add(user_id)
            riders.append({"user_id": user_id, "ride_count": count})
    riders.sort(key=lambda item: item["ride_count"], reverse=True)
    return riders


def get_all_unique_routes() -> list:
    return sorted(store.unique_routes_set)
