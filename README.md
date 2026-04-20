# EcoRide Connect

EcoRide Connect is a full-stack ride sharing and sustainability analytics platform.
It combines a FastAPI backend with a React + Vite frontend to manage users, drivers, rides, route demand, carpool efficiency, rewards, and eco impact metrics.

## What This Project Includes

- End-to-end ride flow: signup/login, booking, cancellation, and ride history
- Admin workflows for users, drivers, rides, rewards, analytics, and sustainability
- Route intelligence: popular routes, low-demand routes, peak-time analysis
- Carpool optimization and estimated emission/fare savings
- Sustainability dashboards and emission trend analysis
- Recursive analytics endpoints for educational/algorithmic use cases

## Repository Structure

```text
EcoRide-Connect/
|- ecoride_backend/     # FastAPI app, business modules, in-memory + JSON persistence
|- ecoride_frontend/    # React + Vite dashboard and user/admin UI
```

## Tech Stack

Backend:
- Python
- FastAPI
- Pydantic
- NumPy, Pandas

Frontend:
- React
- Vite
- React Router
- Axios
- Recharts

## Architecture Overview

```text
React (Vite UI)
   |
   | HTTP (JSON)
   v
FastAPI Routers
   |
   v
Service Modules (registration, rides, analytics, carpool, sustainability, rewards)
   |
   v
In-memory store (lists/dicts/sets/tuples) <-> data/db.json
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

## Quick Start

Run backend and frontend in separate terminals.

### 1) Backend Setup

```powershell
cd ecoride_backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -r test_requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:
- API root: http://localhost:8000/
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Notes:
- On startup, backend attempts to load persisted state from `ecoride_backend/data/db.json`.
- If no persisted state is found, seed data is generated automatically.

### 2) Frontend Setup

```powershell
cd ecoride_frontend
npm install
npm run dev
```

Frontend URL:
- App: http://localhost:5173/

The frontend is currently configured to call backend APIs at:
- `http://localhost:8000`

## Authentication and Demo Access

User auth endpoints:
- POST `/users/signup`
- POST `/users/login`

Admin auth endpoint:
- POST `/admin/login`

Demo admin credentials:
- Email: `admin@ecoride.com`
- Password: `admin`

## API Surface (High Level)

Users:
- `/users/register`, `/users/`, `/users/{user_id}`, `/users/frequent`, `/users/eco-friendly`

Drivers:
- `/drivers/register`, `/drivers/`, `/drivers/{driver_id}`, `/drivers/unreliable`, `/drivers/eco-friendly`

Rides:
- `/rides/book`, `/rides/{ride_id}/cancel`, `/rides/`, `/rides/{ride_id}`, `/rides/user/{user_id}`, `/rides/simulate`

Routes:
- `/routes/popular`, `/routes/low-demand`, `/routes/unique`, `/routes/peak-times`

Carpool:
- `/carpool/groups`, `/carpool/savings/{route}`, `/carpool/efficient`

Sustainability:
- `/sustainability/report`, `/sustainability/compare-vehicles`, `/sustainability/fuel-total`, `/sustainability/emission-total`

Rewards:
- `/rewards/winners`, `/rewards/simulate-discount`, `/rewards/green-points/{user_id}`

Analytics:
- `/analytics/report`, `/analytics/user-summary`, `/analytics/route-summary`, `/analytics/emission-trends`
- `/analytics/recursive/total-distance`, `/analytics/recursive/total-emissions`
- `/analytics/recursive/ride-count/{user_id}`, `/analytics/recursive/search/{user_id}/{ride_id}`

## Example API Calls

Register a user:

```bash
curl -X POST "http://localhost:8000/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "U900",
    "user_name": "Alice",
    "age": 24,
    "contact_number": "9876543210",
    "membership_type": "Premium",
    "preferred_travel_mode": "Carpool"
  }'
```

Book a ride:

```bash
curl -X POST "http://localhost:8000/rides/book" \
  -H "Content-Type: application/json" \
  -d '{
    "ride_id": "R900",
    "user_id": "U900",
    "driver_id": "D001",
    "source_location": "SRM",
    "destination_location": "Guntur",
    "distance_km": 18.5,
    "ride_type": "Carpool",
    "payment_mode": "UPI",
    "num_passengers": 3
  }'
```

## Running Tests

From `ecoride_backend`:

```powershell
python -m unittest test_api.py
python -m unittest tests.test_api
```

## Key Project Docs

- Backend API details: `ecoride_backend/docs.md`
- Full implementation guide: `ecoride_backend/implementation.md`
- Frontend implementation notes: `ecoride_frontend/frontend.md`

## Common Development Notes

- CORS is enabled in the backend for local development.
- Authentication tokens are currently demo-style tokens stored in browser localStorage.
- Data model combines in-memory collections with JSON file persistence for easy local runs.

## Troubleshooting

- Port already in use:
  - Change backend port in `uvicorn` command and update frontend API base URL accordingly.
- Frontend cannot reach backend:
  - Ensure backend is running on `http://localhost:8000` before starting frontend workflows.
- Missing Python packages:
  - Re-activate your virtual environment and reinstall requirements.

## Future Improvements

- Replace demo auth with JWT + refresh flow
- Add role-based backend authorization middleware
- Move from JSON/in-memory storage to PostgreSQL
- Add CI checks for lint, tests, and build verification

## License

This project is intended for educational and demonstration use.