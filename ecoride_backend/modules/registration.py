from fastapi import HTTPException

from store import in_memory_store as store


VALID_MEMBERSHIPS = {"Regular", "Premium", "Student"}


def _get_user_status(user_id: str) -> str:
    ride_count = len(store.user_ride_history_dict.get(user_id, []))
    if ride_count >= 10:
        store.frequent_riders_set.add(user_id)
        return "Frequent Rider"
    return "Regular Rider"


def _get_driver_status(cancellation_count: int) -> str:
    if cancellation_count > 5:
        return "Unreliable Driver"
    return "Reliable"


def register_user(user_data: dict) -> dict:
    if user_data["user_id"] in store.users_dict:
        raise HTTPException(status_code=400, detail="User ID already exists")
    if user_data["membership_type"] not in VALID_MEMBERSHIPS:
        raise HTTPException(status_code=400, detail="Invalid membership type")

    user_record = {
        **user_data,
        "user_status": _get_user_status(user_data["user_id"]),
    }
    store.users_list.append(user_record)
    store.users_dict[user_data["user_id"]] = user_record
    store.user_ride_history_dict.setdefault(user_data["user_id"], [])
    store.user_identity_tuples.append(
        (user_data["user_id"], user_data["user_name"], user_data["membership_type"])
    )
    return user_record


def register_driver(driver_data: dict) -> dict:
    if driver_data["driver_id"] in store.drivers_dict:
        raise HTTPException(status_code=400, detail="Driver ID already exists")

    cancellation_count = driver_data.get("cancellation_count", 0)
    driver_record = {
        **driver_data,
        "cancellation_count": cancellation_count,
        "driver_status": _get_driver_status(cancellation_count),
    }

    store.unique_fuel_types_set.add(driver_record["fuel_type"])
    store.unique_vehicle_types_set.add(driver_record["vehicle_type"])
    store.driver_vehicle_tuples.append(
        (
            driver_record["driver_id"],
            driver_record["vehicle_type"],
            driver_record["fuel_type"],
        )
    )
    store.drivers_list.append(driver_record)
    store.drivers_dict[driver_record["driver_id"]] = driver_record
    return driver_record


def refresh_user_status(user_id: str) -> dict:
    user_record = get_user_by_id(user_id)
    user_record["user_status"] = _get_user_status(user_id)
    return user_record


def refresh_driver_status(driver_id: str) -> dict:
    driver_record = get_driver_by_id(driver_id)
    driver_record["driver_status"] = _get_driver_status(driver_record["cancellation_count"])
    return driver_record


def get_all_users() -> list:
    return store.users_list


def get_all_drivers() -> list:
    return store.drivers_list


def get_user_by_id(user_id: str) -> dict:
    user = store.users_dict.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_driver_by_id(driver_id: str) -> dict:
    driver = store.drivers_dict.get(driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver
