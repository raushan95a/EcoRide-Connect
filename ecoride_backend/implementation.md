# EcoRide Connect — Full Stack Implementation Guide
### Smart Ride Sharing, Trip Tracking, and Sustainability Analytics System

---

## Project Overview

**EcoRide Connect** is a smart urban mobility platform that manages ride-sharing services for students and professionals. The system handles ride bookings, driver/user management, sustainability metrics, carpool optimization, and eco-reward distribution.

**Tech Stack:**
- **Backend:** Python + FastAPI
- **Data/Analytics:** NumPy + Pandas (used inside backend logic)

---

---

# BACKEND SECTION (Python + FastAPI)

---

## 1. Project Structure

```
ecoride_backend/
├── main.py                   # FastAPI app entry point
├── requirements.txt
├── data/
│   └── seed_data.py          # Seed script to generate 20 users, 10 drivers, 25 rides
├── models/
│   └── schemas.py            # Pydantic models (request/response schemas)
├── store/
│   └── in_memory_store.py    # In-memory data store using lists, dicts, sets, tuples
├── modules/
│   ├── registration.py       # Module 1: User & Driver Registration
│   ├── ride_booking.py       # Module 2: Ride Booking & Cancellation
│   ├── route_analysis.py     # Module 3: Route & Demand Analysis
│   ├── carpool.py            # Module 4: Carpool Optimization
│   ├── sustainability.py     # Module 5: Sustainability Analysis
│   ├── rewards.py            # Module 6: Reward Module (uses random)
│   ├── analytics.py          # Module 7: Mathematical & Data Analytics (NumPy + Pandas)
│   └── recursion.py          # Module 8: Recursive functions
└── routers/
    ├── users.py
    ├── drivers.py
    ├── rides.py
    ├── routes.py
    ├── carpool.py
    ├── sustainability.py
    ├── rewards.py
    └── analytics.py
```

---

## 2. requirements.txt

```
fastapi
uvicorn
pydantic
numpy
pandas
python-multipart
```

---

## 3. In-Memory Data Store (`store/in_memory_store.py`)

This file is the central data store. It must use **all four** Python data structures meaningfully as required by the project.

### Instructions:
- Use **lists** to store: `users_list`, `drivers_list`, `rides_list`, `route_logs_list`, `payments_list`
- Use **tuples** for fixed data records (immutable snapshots):
  - `(user_id, user_name, membership_type)` — user identity tuples
  - `(driver_id, vehicle_type, fuel_type)` — driver vehicle tuples
  - `(ride_id, source, destination)` — ride route tuples
  - `(distance, fare, emission)` — ride metric tuples
- Use **sets** to store: `unique_routes_set`, `unique_vehicle_types_set`, `unique_fuel_types_set`, `frequent_riders_set`
- Use **dictionaries** to map:
  - `users_dict`: `user_id → user details dict`
  - `drivers_dict`: `driver_id → driver details dict`
  - `rides_dict`: `ride_id → ride summary dict`
  - `route_ride_count_dict`: `"SRC→DEST" → count`
  - `user_ride_history_dict`: `user_id → list of ride_ids`

All five routers read from and write to this shared store. Do NOT use a database — all data lives in memory.

---

## 4. Pydantic Schemas (`models/schemas.py`)

### User
```python
class UserCreate(BaseModel):
    user_id: str          # e.g. "U101"
    user_name: str
    age: int
    contact_number: str
    membership_type: str  # "Regular" | "Premium" | "Student"
    preferred_travel_mode: str  # "Carpool" | "Solo" | "Bike" | "Electric"

class UserResponse(UserCreate):
    user_status: str      # "Regular Rider" | "Frequent Rider"
```

### Driver
```python
class DriverCreate(BaseModel):
    driver_id: str        # e.g. "D01"
    driver_name: str
    vehicle_type: str     # "Car" | "Bike" | "Electric"
    vehicle_number: str
    fuel_type: str        # "Petrol" | "Diesel" | "Electric"
    rating: float         # 1.0 to 5.0

class DriverResponse(DriverCreate):
    driver_status: str    # "Reliable" | "Unreliable Driver"
    cancellation_count: int
```

### Ride
```python
class RideCreate(BaseModel):
    ride_id: str          # e.g. "R205"
    user_id: str
    driver_id: str
    source_location: str
    destination_location: str
    distance_km: float
    ride_type: str        # "Solo" | "Carpool"
    payment_mode: str     # "Cash" | "UPI" | "Card"
    num_passengers: int   # for carpool; 1 for solo

class RideResponse(RideCreate):
    fare_amount: float
    fuel_consumption: float
    carbon_emission_kg: float
    ride_status: str      # "Completed" | "Cancelled"
    eco_friendly: bool
    discount_applied: float
```

### Analytics Report
```python
class AnalyticsReport(BaseModel):
    total_rides: int
    average_distance_km: float
    average_fare: float
    std_deviation_fare: float
    most_popular_route: str
    eco_friendly_rides: int
    high_demand_routes: list
    cancelled_rides: int
    emission_trend: list  # list of emission values across rides

class UserSummaryRow(BaseModel):
    user_id: str
    total_rides: int
    avg_distance: float
    total_emission: float
    status: str
```

### Reward
```python
class RewardOutput(BaseModel):
    user_id: str
    user_name: str
    reward_type: str      # "Free Ride Coupon" | "Green Points" | "Discount"
    reward_code: str
    green_points: int
```

### Carpool Group
```python
class CarpoolGroup(BaseModel):
    route: str
    user_ids: list
    original_fare: float
    reduced_fare_per_user: float
    emission_saved_kg: float
```

---

## 5. Module Implementations

### Module 1: User & Driver Registration (`modules/registration.py`)

**Functions to implement:**

```python
def register_user(user_data: dict) -> dict:
    """
    - Check if user_id already exists in users_dict → raise error if duplicate
    - Validate membership_type is one of: Regular, Premium, Student
    - Classify user status:
        if user has more than 10 rides in user_ride_history_dict → "Frequent Rider"
        else → "Regular Rider"
    - Add to: users_list (list), users_dict (dict)
    - Add tuple (user_id, user_name, membership_type) to user_identity_tuples list
    - Return full user record with status
    """

def register_driver(driver_data: dict) -> dict:
    """
    - Check if driver_id already exists in drivers_dict → raise error if duplicate
    - Add fuel_type to unique_fuel_types_set (set)
    - Add vehicle_type to unique_vehicle_types_set (set)
    - Add tuple (driver_id, vehicle_type, fuel_type) to driver_vehicle_tuples list
    - Classify driver:
        if cancellation_count > 5 → driver_status = "Unreliable Driver"
        else → "Reliable"
    - Add to: drivers_list (list), drivers_dict (dict)
    - Return full driver record with status
    """

def get_all_users() -> list:
    """Return users_list"""

def get_all_drivers() -> list:
    """Return drivers_list"""

def get_user_by_id(user_id: str) -> dict:
    """Lookup from users_dict"""

def get_driver_by_id(driver_id: str) -> dict:
    """Lookup from drivers_dict"""
```

---

### Module 2: Ride Booking & Cancellation (`modules/ride_booking.py`)

**Functions to implement:**

```python
import math
import random

def calculate_fare(distance_km: float, ride_type: str, membership_type: str) -> tuple:
    """
    Base fare logic:
    - Base rate: Rs. 10 per km
    - If ride_type == "Carpool" → apply 30% discount on base fare
    - If membership_type == "Premium" → apply additional 10% discount
    - If membership_type == "Student" → apply additional 5% discount
    - Use math.ceil() to round up final fare to nearest rupee
    - Return tuple: (fare_amount, discount_applied)
    """

def calculate_fuel_and_emission(distance_km: float, fuel_type: str, num_passengers: int) -> tuple:
    """
    Fuel consumption rates per km:
    - Petrol: 0.08 L/km
    - Diesel: 0.07 L/km
    - Electric: 0.02 kWh/km (treat as 0 carbon emission)

    Carbon emission rates per km:
    - Petrol: 0.21 kg CO2/km
    - Diesel: 0.19 kg CO2/km
    - Electric: 0.0 kg CO2/km

    If ride_type is Carpool, divide emission by num_passengers (shared emission)
    Use math.sqrt() somewhere in the formula for emission variance calculation (attach it as a metadata field)
    Return tuple: (fuel_consumption, carbon_emission_kg)
    """

def book_ride(ride_data: dict) -> dict:
    """
    - Validate user_id and driver_id exist
    - Prevent duplicate ride_id
    - Calculate fare using calculate_fare()
    - Calculate fuel and emission using calculate_fuel_and_emission()
    - Randomly simulate ride outcome: random.random() < 0.85 → "Completed", else → "Cancelled"
    - If "Cancelled": increment driver cancellation_count in drivers_dict
    - Classify ride:
        if carbon_emission_kg < 3.0 → eco_friendly = True
        else → eco_friendly = False
    - Add route string "SOURCE→DESTINATION" to unique_routes_set (set)
    - Update route_ride_count_dict: increment count for this route
    - Update user_ride_history_dict: append ride_id to user's history
    - Add tuple (ride_id, source, destination) to ride_route_tuples list
    - Add tuple (distance, fare, emission) to ride_metric_tuples list
    - Add to: rides_list (list), rides_dict (dict)
    - Add payment record to payments_list
    - Return full ride record
    """

def cancel_ride(ride_id: str) -> dict:
    """
    - Find ride in rides_dict
    - Set ride_status to "Cancelled"
    - Increment driver's cancellation_count
    - Re-classify driver if cancellation_count > 5
    - Return updated ride record
    """

def get_ride_summary(ride_id: str) -> dict:
    """
    Format the ride summary exactly like the sample output:
    ----- RIDE SUMMARY -----
    Ride ID: ...
    User: ...
    Driver: ...
    Route: SOURCE → DESTINATION
    Distance: X km
    Ride Type: ...
    Fare: Rs. X
    Emission: X kg CO2
    Status: ...
    """

def get_frequently_cancelled_drivers() -> list:
    """Return list of drivers where cancellation_count > 5"""
```

---

### Module 3: Route & Demand Analysis (`modules/route_analysis.py`)

**Functions to implement:**

```python
def get_popular_routes(top_n: int = 5) -> list:
    """
    - Use route_ride_count_dict
    - Sort by ride count descending
    - Tag routes with count > 10 as "High Demand Route"
    - Return top N routes with counts and demand tags
    """

def get_low_demand_routes(threshold: int = 3) -> list:
    """
    - Return routes from route_ride_count_dict with count < threshold
    """

def analyze_peak_travel_times(rides_list: list) -> dict:
    """
    - Rides have a simulated hour field (randomly assigned 6–22 during booking)
    - Group rides by hour
    - Identify peak hours (hours with most rides)
    - Return dict: { hour: ride_count } sorted descending
    """

def get_frequent_riders() -> list:
    """
    - Iterate user_ride_history_dict
    - If user has >= 10 rides → add to frequent_riders_set (set)
    - Return list of frequent rider user_ids with their ride counts
    """

def get_all_unique_routes() -> list:
    """Return sorted list from unique_routes_set"""
```

---

### Module 4: Carpool Optimization (`modules/carpool.py`)

**Functions to implement:**

```python
def group_users_by_route() -> list:
    """
    - Scan rides_list for Carpool rides
    - Group by "SOURCE→DESTINATION" route
    - For each group, list all user_ids sharing that route
    - Calculate reduced cost per user: total_fare / num_passengers
    - Calculate emission saved compared to solo rides
    - Identify efficient sharing: if group size >= 3 → tag as "Efficient Ride Share"
    - Return list of CarpoolGroup objects
    """

def calculate_carpool_savings(route: str) -> dict:
    """
    - For a given route, find all carpool rides
    - Compare original solo fare vs carpool fare
    - Calculate total emission saved
    - Return savings summary dict
    """

def identify_efficient_sharing() -> list:
    """Return carpool groups where num_passengers >= 3"""
```

---

### Module 5: Sustainability Analysis (`modules/sustainability.py`)

**Functions to implement:**

```python
import math

def calculate_total_fuel_consumption() -> float:
    """Sum fuel_consumption across all completed rides_list"""

def calculate_total_carbon_emission() -> float:
    """Sum carbon_emission_kg across all completed rides_list"""

def compare_electric_vs_fuel_vehicles() -> dict:
    """
    - Split drivers into electric vs fuel (Petrol/Diesel)
    - Calculate avg emission per ride for each group
    - Use math.log() to compute a normalized emission score
    - Return comparison dict:
      {
        "electric_avg_emission": X,
        "fuel_avg_emission": X,
        "emission_reduction_percent": X
      }
    """

def identify_eco_friendly_users() -> list:
    """
    - A user is eco-friendly if:
      * preferred_travel_mode in ["Carpool", "Electric", "Bike"]
      * AND their avg carbon_emission < 3.0 kg per ride
    - Return list of user dicts with eco_friendly_score
    """

def identify_eco_friendly_drivers() -> list:
    """
    - A driver is eco-friendly if:
      * fuel_type == "Electric"
      * OR avg emission per ride < 2.5 kg CO2
    - Return list of eco-friendly drivers
    """

def get_sustainability_report() -> dict:
    """
    Return:
    {
      "total_fuel_consumed": X,
      "total_co2_emitted_kg": X,
      "eco_friendly_rides_count": X,
      "electric_vehicle_percentage": X,
      "top_eco_users": [...],
      "top_eco_drivers": [...]
    }
    """
```

---

### Module 6: Reward Module (`modules/rewards.py`)

**Functions to implement (uses `random` module):**

```python
import random
import string

def generate_coupon_code(prefix: str = "ECO") -> str:
    """
    - Use random.randint() to generate a 3-digit number
    - Append to prefix: e.g. "ECO100", "ECO247"
    - Return coupon code string
    """

def assign_green_points() -> int:
    """
    - Use random.randint(10, 100) to assign green points
    """

def select_eco_reward_winners(eco_users: list, num_winners: int = 3) -> list:
    """
    - Use random.sample() to randomly select num_winners from eco_users list
    - For each winner, randomly assign reward_type:
        random.choice(["Free Ride Coupon", "Green Points", "Discount"])
    - Generate coupon code using generate_coupon_code()
    - Assign green points using assign_green_points()
    - Return list of RewardOutput dicts
    Format output like:
    ----- ECO REWARD SECTION -----
    User ID: U121
    Name: Rohan
    Reward: Free Ride Coupon
    Code: ECO100
    """

def generate_random_discount() -> float:
    """
    - Use random.uniform(5.0, 30.0) to generate a discount percentage
    - Round to 2 decimal places
    """

def simulate_random_ride_requests(num: int = 5) -> list:
    """
    - Use random module to generate `num` random ride request dicts
    - Random source/destination from a predefined list of city locations
      e.g. ["SRM", "Vijayawada", "Guntur", "Tenali", "Mangalagiri", "Amaravati"]
    - Random distance between 5–50 km
    - Random ride_type: random.choice(["Solo", "Carpool"])
    - Random num_passengers: random.randint(1, 4)
    - Return list of ride request dicts (not saved to store — just simulated)
    """
```

---

### Module 7: Mathematical & Data Analytics (`modules/analytics.py`)

**Functions to implement (uses `math`, `numpy`, `pandas`):**

```python
import math
import numpy as np
import pandas as pd

def calculate_average_ride_distance(rides_list: list) -> float:
    """
    - Extract distance_km values into a NumPy array
    - Use np.mean() to calculate average
    - Return rounded to 2 decimal places
    """

def calculate_average_fare(rides_list: list) -> float:
    """
    - Extract fare_amount into NumPy array
    - Use np.mean()
    """

def calculate_std_deviation_fare(rides_list: list) -> float:
    """
    - Use np.std() on fare_amount array
    """

def analyze_emission_trends(rides_list: list) -> dict:
    """
    - Extract carbon_emission_kg into NumPy array
    - Calculate: mean, max, min, std using numpy
    - Use math.floor() and math.ceil() on min/max
    - Return trend dict with all stats
    """

def generate_user_summary_table(users_dict: dict, rides_list: list, user_ride_history_dict: dict) -> list:
    """
    - Build a Pandas DataFrame with columns:
        UserID | TotalRides | AvgDistance | TotalEmission | Status
    - For each user, compute:
        total_rides = len(user_ride_history_dict.get(user_id, []))
        avg_distance = mean of distance_km from their rides
        total_emission = sum of carbon_emission_kg from their rides
        status:
          if total_rides >= 10 → "Frequent Rider"
          elif total_emission < 10 → "Eco-Friendly"
          else → "Regular"
    - Use pd.DataFrame() to build the table
    - Sort by TotalRides descending
    - Return list of dicts (df.to_dict(orient='records'))
    Sample output matches:
    UserID  TotalRides  AvgDistance  Emission  Status
    U101    12          10.5         20.3      Eco-Friendly
    U102    5           8.2          18.1      Regular
    U103    20          15.4         40.2      Frequent Rider
    """

def generate_route_summary_table(route_ride_count_dict: dict, rides_list: list) -> list:
    """
    - Build a Pandas DataFrame with columns:
        Route | TotalRides | AvgFare | AvgEmission | DemandTag
    - DemandTag:
        if TotalRides > 10 → "High Demand Route"
        else → "Normal"
    - Use pd.DataFrame()
    - Sort by TotalRides descending
    - Return list of dicts
    """

def generate_full_analytics_report() -> dict:
    """
    Combine all analytics into a single report matching Sample Output 2:
    ----- RIDE ANALYTICS REPORT -----
    Total Rides: X
    Average Distance: X km
    Most Popular Route: SRC → DEST
    Eco-Friendly Rides: X
    High Demand Routes: X
    Cancelled Rides: X
    Returns a structured dict with all fields
    """
```

---

### Module 8: Recursive Functions (`modules/recursion.py`)

**Implement ALL four recursive functions as required:**

```python
def recursive_total_distance(rides: list, index: int = 0) -> float:
    """
    Recursively sum distance_km across rides list.
    Base case: index == len(rides) → return 0
    Recursive case: rides[index]['distance_km'] + recursive_total_distance(rides, index + 1)
    """

def recursive_total_emissions(rides: list, index: int = 0) -> float:
    """
    Recursively sum carbon_emission_kg across rides list.
    Base case: index == len(rides) → return 0.0
    Recursive case: rides[index]['carbon_emission_kg'] + recursive_total_emissions(rides, index + 1)
    """

def recursive_ride_count_for_user(ride_history: list, index: int = 0) -> int:
    """
    Recursively count number of rides for a user.
    Base case: index == len(ride_history) → return 0
    Recursive case: 1 + recursive_ride_count_for_user(ride_history, index + 1)
    """

def recursive_search_ride_history(ride_history: list, target_ride_id: str, index: int = 0) -> bool:
    """
    Recursively search for a ride_id in a user's ride history.
    Base case: index == len(ride_history) → return False
    If ride_history[index] == target_ride_id → return True
    Else: return recursive_search_ride_history(ride_history, target_ride_id, index + 1)
    """
```

---

## 6. Seed Data (`data/seed_data.py`)

Generate and pre-load the following minimum data when the app starts:

- **20 users** with varied membership types (Regular, Premium, Student), ages 18–40, contact numbers, and preferred travel modes
- **10 drivers** with varied vehicle types (Car, Bike, Electric), fuel types (Petrol, Diesel, Electric), and ratings
- **25 rides** covering multiple routes, ride types (Solo, Carpool), varying distances (5–50 km), with some cancelled

Use `random` module to generate realistic but varied data. Use city names from the local context: SRM, Vijayawada, Guntur, Tenali, Mangalagiri, Amaravati, Narasaraopet, Ongole, Nellore, Tirupati.

Call this seed function at FastAPI startup using `@app.on_event("startup")`.

---

## 7. FastAPI Routers

### `routers/users.py`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register a new user |
| GET | `/users/` | Get all users |
| GET | `/users/{user_id}` | Get user by ID |
| GET | `/users/frequent` | Get frequent riders |
| GET | `/users/eco-friendly` | Get eco-friendly users |

### `routers/drivers.py`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/drivers/register` | Register a new driver |
| GET | `/drivers/` | Get all drivers |
| GET | `/drivers/{driver_id}` | Get driver by ID |
| GET | `/drivers/unreliable` | Get frequently cancelling drivers |
| GET | `/drivers/eco-friendly` | Get eco-friendly drivers |

### `routers/rides.py`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rides/book` | Book a ride |
| POST | `/rides/{ride_id}/cancel` | Cancel a ride |
| GET | `/rides/` | Get all rides |
| GET | `/rides/{ride_id}` | Get ride summary |
| GET | `/rides/user/{user_id}` | Get ride history for a user |
| GET | `/rides/simulate` | Simulate random ride requests (uses random module) |

### `routers/routes.py`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/routes/popular` | Get top popular routes |
| GET | `/routes/low-demand` | Get low-demand routes |
| GET | `/routes/unique` | Get all unique routes (from set) |
| GET | `/routes/peak-times` | Analyze peak travel hours |

### `routers/carpool.py`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/carpool/groups` | Get carpool groups by route |
| GET | `/carpool/savings/{route}` | Get savings for a specific route |
| GET | `/carpool/efficient` | Get efficient carpool groups (3+ passengers) |

### `routers/sustainability.py`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sustainability/report` | Full sustainability report |
| GET | `/sustainability/compare-vehicles` | Electric vs fuel comparison |
| GET | `/sustainability/fuel-total` | Total fuel consumed |
| GET | `/sustainability/emission-total` | Total CO2 emitted |

### `routers/rewards.py`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rewards/winners` | Randomly select eco reward winners |
| GET | `/rewards/simulate-discount` | Generate a random discount coupon |
| GET | `/rewards/green-points/{user_id}` | Assign random green points to user |

### `routers/analytics.py`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/report` | Full ride analytics report |
| GET | `/analytics/user-summary` | Pandas-based user summary table |
| GET | `/analytics/route-summary` | Pandas-based route summary table |
| GET | `/analytics/emission-trends` | NumPy emission trend analysis |
| GET | `/analytics/recursive/total-distance` | Recursive total distance |
| GET | `/analytics/recursive/total-emissions` | Recursive total emissions |
| GET | `/analytics/recursive/ride-count/{user_id}` | Recursive ride count for user |
| GET | `/analytics/recursive/search/{user_id}/{ride_id}` | Recursive ride history search |

---

## 8. `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, drivers, rides, routes, carpool, sustainability, rewards, analytics
from data.seed_data import seed_all_data

app = FastAPI(title="EcoRide Connect API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    seed_all_data()  # Load 20 users, 10 drivers, 25 rides on startup

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(drivers.router, prefix="/drivers", tags=["Drivers"])
app.include_router(rides.router, prefix="/rides", tags=["Rides"])
app.include_router(routes.router, prefix="/routes", tags=["Routes"])
app.include_router(carpool.router, prefix="/carpool", tags=["Carpool"])
app.include_router(sustainability.router, prefix="/sustainability", tags=["Sustainability"])
app.include_router(rewards.router, prefix="/rewards", tags=["Rewards"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "Welcome to EcoRide Connect API"}
```

---

## 9. Business Logic Rules (Suggested Logic)

Implement these classification rules throughout the backend:

| Condition | Label |
|-----------|-------|
| `ride_type == "Carpool"` | Reduce fare by 30% |
| `carbon_emission_kg < 3.0` | `eco_friendly = True` → "Eco-Friendly Ride" |
| `driver.cancellation_count > 5` | driver_status = "Unreliable Driver" |
| `route_ride_count > 10` | "High Demand Route" |
| `user total_rides >= 10` | "Frequent Rider" → add to `frequent_riders_set` |
| `user total_rides < 10 AND total_emission < 10` | "Eco-Friendly" status |
| `fuel_type == "Electric"` | 0 carbon emission |

---

## 10. Python Concepts Checklist for Backend

Ensure every concept below is used **meaningfully** in the code:

| Concept | Where Used |
|---------|-----------|
| Data types (int, float, str, bool) | All models and calculations |
| Variables | Throughout all modules |
| Operators (+, -, *, /, %, //) | Fare, emission calculations |
| Expressions | Conditions in classification logic |
| Decision-making (if/elif/else) | Driver status, rider status, eco-friendly flags |
| Loops (for, while) | Iterating rides, users, route aggregation |
| Lists | users_list, rides_list, drivers_list, route_logs |
| Tuples | user identity, driver vehicle, ride metrics (immutable) |
| Sets | unique_routes_set, unique_vehicle_types_set, frequent_riders_set |
| Dictionaries | users_dict, drivers_dict, rides_dict, route counts, ride history |
| User-defined functions | All 8 modules contain multiple named functions |
| Recursion | Module 8: 4 recursive functions |
| math module | ceil (fare), sqrt (emission variance), floor, log (comparison) |
| random module | Ride simulation, reward winners, coupon codes, discounts |
| NumPy | Mean, std, array ops in analytics module |
| Pandas | DataFrame user summary and route summary tables |

---

### Backend
- [ ] 20+ users seeded on startup
- [ ] 10+ drivers seeded on startup
- [ ] 25+ rides seeded on startup
- [ ] All 4 data structures used: lists, tuples, sets, dicts
- [ ] All 8 modules implemented as separate files
- [ ] 8+ user-defined functions
- [ ] At least 1 recursion (all 4 recursive functions implemented)
- [ ] `math` module used (ceil, sqrt, log, floor)
- [ ] `random` module used (sample, choice, randint, uniform, random)
- [ ] NumPy used (mean, std, array)
- [ ] Pandas used (DataFrame, sort, to_dict)
- [ ] Duplicate ID prevention in registration
- [ ] Fare calculation with carpool discount
- [ ] Cancellation handling updates driver status
- [ ] Eco-friendly classification logic
- [ ] CORS enabled for React frontend