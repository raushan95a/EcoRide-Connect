import random

from models.schemas import DriverCreate, RideCreate, UserCreate
from modules.registration import register_driver, register_user
from modules.ride_booking import book_ride
from store.in_memory_store import reset_store


USER_NAMES = [
    "Rohan",
    "Sneha",
    "Karthik",
    "Ananya",
    "Varun",
    "Meghana",
    "Akhil",
    "Divya",
    "Rahul",
    "Keerthi",
    "Sai",
    "Lavanya",
    "Nikhil",
    "Harika",
    "Pranav",
    "Sanjana",
    "Tarun",
    "Bhavya",
    "Arjun",
    "Pooja",
]

DRIVER_NAMES = [
    "Mahesh",
    "Kiran",
    "Suresh",
    "Ravi",
    "Naresh",
    "Vamsi",
    "Teja",
    "Madhu",
    "Ganesh",
    "Ritesh",
]

LOCATIONS = [
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


def seed_all_data() -> None:
    reset_store()
    random.seed(42)

    membership_types = ["Regular", "Premium", "Student"]
    travel_modes = ["Carpool", "Solo", "Bike", "Electric"]
    vehicle_types = ["Car", "Bike", "Electric"]
    fuel_map = {"Car": ["Petrol", "Diesel"], "Bike": ["Petrol"], "Electric": ["Electric"]}

    for index, name in enumerate(USER_NAMES, start=1):
        user_payload = UserCreate(
            user_id=f"U{100 + index}",
            user_name=name,
            age=random.randint(18, 40),
            contact_number=f"9{random.randint(100000000, 999999999)}",
            membership_type=random.choice(membership_types),
            preferred_travel_mode=random.choice(travel_modes),
        )
        register_user(user_payload.model_dump())

    for index, name in enumerate(DRIVER_NAMES, start=1):
        vehicle_type = random.choice(vehicle_types)
        driver_payload = DriverCreate(
            driver_id=f"D{index:02d}",
            driver_name=name,
            vehicle_type=vehicle_type,
            vehicle_number=f"AP{random.randint(10, 39)}AB{random.randint(1000, 9999)}",
            fuel_type=random.choice(fuel_map[vehicle_type]),
            rating=round(random.uniform(3.5, 5.0), 1),
        )
        register_driver(driver_payload.model_dump())

    user_ids = [f"U{100 + index}" for index in range(1, 21)]
    driver_ids = [f"D{index:02d}" for index in range(1, 11)]
    payment_modes = ["Cash", "UPI", "Card"]

    for index in range(1, 26):
        source, destination = random.sample(LOCATIONS, 2)
        ride_type = random.choice(["Solo", "Carpool"])
        passengers = random.randint(2, 4) if ride_type == "Carpool" else 1
        ride_payload = RideCreate(
            ride_id=f"R{200 + index}",
            user_id=random.choice(user_ids),
            driver_id=random.choice(driver_ids),
            source_location=source,
            destination_location=destination,
            distance_km=round(random.uniform(5, 50), 2),
            ride_type=ride_type,
            payment_mode=random.choice(payment_modes),
            num_passengers=passengers,
        )
        book_ride(ride_payload.model_dump())
