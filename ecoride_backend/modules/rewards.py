import random

from modules.registration import get_user_by_id


CITY_LOCATIONS = [
    "SRM",
    "Vijayawada",
    "Guntur",
    "Tenali",
    "Mangalagiri",
    "Amaravati",
    "Narasaraopet",
    "Ongole",
    "Nellore",
    "Tirupati",
]


def generate_coupon_code(prefix: str = "ECO") -> str:
    return f"{prefix}{random.randint(100, 999)}"


def assign_green_points() -> int:
    return random.randint(10, 100)


def select_eco_reward_winners(eco_users: list, num_winners: int = 3) -> list:
    if not eco_users:
        return []
    winner_count = min(num_winners, len(eco_users))
    winners = random.sample(eco_users, winner_count)
    results = []
    for winner in winners:
        reward_type = random.choice(["Free Ride Coupon", "Green Points", "Discount"])
        reward_code = generate_coupon_code()
        results.append(
            {
                "user_id": winner["user_id"],
                "user_name": winner["user_name"],
                "reward_type": reward_type,
                "reward_code": reward_code,
                "green_points": assign_green_points(),
                "display": "\n".join(
                    [
                        "----- ECO REWARD SECTION -----",
                        f"User ID: {winner['user_id']}",
                        f"Name: {winner['user_name']}",
                        f"Reward: {reward_type}",
                        f"Code: {reward_code}",
                    ]
                ),
            }
        )
    return results


def generate_random_discount() -> float:
    return round(random.uniform(5.0, 30.0), 2)


def simulate_random_ride_requests(num: int = 5) -> list:
    requests = []
    for index in range(num):
        source, destination = random.sample(CITY_LOCATIONS, 2)
        ride_type = random.choice(["Solo", "Carpool"])
        num_passengers = random.randint(1, 4) if ride_type == "Carpool" else 1
        requests.append(
            {
                "request_id": f"SIM{index + 1:03d}",
                "source_location": source,
                "destination_location": destination,
                "distance_km": round(random.uniform(5, 50), 2),
                "ride_type": ride_type,
                "num_passengers": num_passengers,
            }
        )
    return requests


def generate_green_points_for_user(user_id: str) -> dict:
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user_id,
        "user_name": user["user_name"],
        "green_points": assign_green_points(),
    }
