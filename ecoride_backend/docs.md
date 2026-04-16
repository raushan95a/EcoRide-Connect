# EcoRide Backend API Documentation

## Base URL

- Local: http://localhost:8000
- No global /api prefix is currently used.

## Request Content Type

- For POST requests with body payloads, send Content-Type: application/json.

## Root

### GET /

- Description: Basic API welcome endpoint.
- Client parameters: None

---

## Users

### POST /users/register

- Description: Register a new user.
- Client body parameters:

```json
{
	"user_id": "string",
	"user_name": "string",
	"age": 24,
	"contact_number": "string",
	"membership_type": "Regular | Premium | Student",
	"preferred_travel_mode": "Carpool | Solo | Bike | Electric"
}
```

- Validation rules:
	- age: integer between 18 and 100
	- membership_type: one of Regular, Premium, Student
	- preferred_travel_mode: one of Carpool, Solo, Bike, Electric

### GET /users/

- Description: Get all users.
- Client parameters: None

### GET /users/{user_id}

- Description: Get one user by user ID.
- Path parameters:
	- user_id: string

### GET /users/frequent

- Description: Get frequent riders.
- Client parameters: None

### GET /users/eco-friendly

- Description: Get eco-friendly users.
- Client parameters: None

---

## Drivers

### POST /drivers/register

- Description: Register a new driver.
- Client body parameters:

```json
{
	"driver_id": "string",
	"driver_name": "string",
	"vehicle_type": "Car | Bike | Electric",
	"vehicle_number": "string",
	"fuel_type": "Petrol | Diesel | Electric",
	"rating": 4.8
}
```

- Validation rules:
	- vehicle_type: one of Car, Bike, Electric
	- fuel_type: one of Petrol, Diesel, Electric
	- rating: float between 1.0 and 5.0

### GET /drivers/

- Description: Get all drivers.
- Client parameters: None

### GET /drivers/{driver_id}

- Description: Get one driver by driver ID.
- Path parameters:
	- driver_id: string

### GET /drivers/unreliable

- Description: Get frequently cancelled/unreliable drivers.
- Client parameters: None

### GET /drivers/eco-friendly

- Description: Get eco-friendly drivers.
- Client parameters: None

---

## Rides

### POST /rides/book

- Description: Book a new ride.
- Client body parameters:

```json
{
	"ride_id": "string",
	"user_id": "string",
	"driver_id": "string",
	"source_location": "string",
	"destination_location": "string",
	"distance_km": 18.5,
	"ride_type": "Solo | Carpool",
	"payment_mode": "Cash | UPI | Card",
	"num_passengers": 3
}
```

- Validation rules:
	- distance_km: float greater than 0
	- ride_type: Solo or Carpool
	- payment_mode: Cash, UPI, or Card
	- num_passengers: integer between 1 and 8

### POST /rides/{ride_id}/cancel

- Description: Cancel a ride by ride ID.
- Path parameters:
	- ride_id: string

### GET /rides/

- Description: Get all rides.
- Client parameters: None

### GET /rides/{ride_id}

- Description: Get ride summary by ride ID.
- Path parameters:
	- ride_id: string

### GET /rides/user/{user_id}

- Description: Get all rides for one user.
- Path parameters:
	- user_id: string

### GET /rides/simulate

- Description: Simulate random ride requests.
- Query parameters:
	- num: integer, optional, default is 5

---

## Routes Analytics

### GET /routes/popular

- Description: Get popular routes.
- Query parameters:
	- top_n: integer, optional, default is 5

### GET /routes/low-demand

- Description: Get low-demand routes.
- Query parameters:
	- threshold: integer, optional, default is 3

### GET /routes/unique

- Description: Get all unique route values.
- Client parameters: None

### GET /routes/peak-times

- Description: Get peak travel time analysis.
- Client parameters: None

---

## Carpool

### GET /carpool/groups

- Description: Get grouped users by route for carpooling.
- Client parameters: None

### GET /carpool/savings/{route}

- Description: Get fare/emission savings for a given route.
- Path parameters:
	- route: string (example: SRM->Guntur)

### GET /carpool/efficient

- Description: Get efficient carpool sharing groups.
- Client parameters: None

---

## Sustainability

### GET /sustainability/report

- Description: Get sustainability summary report.
- Client parameters: None

### GET /sustainability/compare-vehicles

- Description: Compare electric vs fuel vehicles.
- Client parameters: None

### GET /sustainability/fuel-total

- Description: Get total fuel consumption.
- Client parameters: None

### GET /sustainability/emission-total

- Description: Get total carbon emissions.
- Client parameters: None

---

## Rewards

### GET /rewards/winners

- Description: Get reward winners list.
- Query parameters:
	- num_winners: integer, optional, default is 3

### GET /rewards/simulate-discount

- Description: Get simulated discount percentage.
- Client parameters: None

### GET /rewards/green-points/{user_id}

- Description: Get green points for one user.
- Path parameters:
	- user_id: string

---

## Analytics

### GET /analytics/report

- Description: Get full analytics report.
- Client parameters: None

### GET /analytics/user-summary

- Description: Get analytics user summary table.
- Client parameters: None

### GET /analytics/route-summary

- Description: Get analytics route summary table.
- Client parameters: None

### GET /analytics/emission-trends

- Description: Get emission trend data.
- Client parameters: None

### GET /analytics/recursive/total-distance

- Description: Get recursively calculated total distance.
- Client parameters: None

### GET /analytics/recursive/total-emissions

- Description: Get recursively calculated total emissions.
- Client parameters: None

### GET /analytics/recursive/ride-count/{user_id}

- Description: Get recursive ride count for a user.
- Path parameters:
	- user_id: string

### GET /analytics/recursive/search/{user_id}/{ride_id}

- Description: Search a ride ID in a user's history using recursion.
- Path parameters:
	- user_id: string
	- ride_id: string

---

## Notes for Frontend Team

- Current backend mainly supports Create and Read operations, plus ride cancel.
- Update and Delete endpoints for users, drivers, and rides are not implemented yet.
- For path values that can contain special characters, URL encode before sending.
