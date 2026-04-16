from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data.seed_data import seed_all_data
from routers import analytics, carpool, drivers, rewards, rides, routes, sustainability, users

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
    seed_all_data()


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
