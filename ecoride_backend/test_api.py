import unittest
import uuid

try:
    from fastapi.testclient import TestClient
except RuntimeError as exc:
    TestClient = None
    TESTCLIENT_IMPORT_ERROR = str(exc)
else:
    TESTCLIENT_IMPORT_ERROR = None

from main import app
from store import in_memory_store as store


class EcoRideApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if TestClient is None:
            raise unittest.SkipTest(TESTCLIENT_IMPORT_ERROR)
        cls.client_context = TestClient(app)
        cls.client = cls.client_context.__enter__()
        cls.sample_user_id = store.users_list[0]["user_id"]
        cls.sample_route = store.rides_list[0]["route"]

    @classmethod
    def tearDownClass(cls):
        cls.client_context.__exit__(None, None, None)

    def _unique_suffix(self) -> str:
        return uuid.uuid4().hex[:6].upper()

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["message"], "Welcome to EcoRide Connect API")

    def test_user_routes(self):
        suffix = self._unique_suffix()
        payload = {
            "user_id": f"UT{suffix}",
            "user_name": "Test Rider",
            "age": 24,
            "contact_number": "9876543210",
            "membership_type": "Premium",
            "preferred_travel_mode": "Carpool",
        }

        create_response = self.client.post("/users/register", json=payload)
        self.assertEqual(create_response.status_code, 200)
        self.assertEqual(create_response.json()["user_id"], payload["user_id"])

        list_response = self.client.get("/users/")
        self.assertEqual(list_response.status_code, 200)
        self.assertTrue(any(user["user_id"] == payload["user_id"] for user in list_response.json()))

        get_response = self.client.get(f"/users/{payload['user_id']}")
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.json()["user_name"], payload["user_name"])

        self.assertEqual(self.client.get("/users/frequent").status_code, 200)
        self.assertEqual(self.client.get("/users/eco-friendly").status_code, 200)

    def test_driver_routes(self):
        suffix = self._unique_suffix()
        payload = {
            "driver_id": f"DT{suffix}",
            "driver_name": "Test Driver",
            "vehicle_type": "Electric",
            "vehicle_number": f"TS09CD{suffix[:4]}",
            "fuel_type": "Electric",
            "rating": 4.8,
        }

        create_response = self.client.post("/drivers/register", json=payload)
        self.assertEqual(create_response.status_code, 200)
        self.assertEqual(create_response.json()["driver_id"], payload["driver_id"])

        list_response = self.client.get("/drivers/")
        self.assertEqual(list_response.status_code, 200)
        self.assertTrue(any(driver["driver_id"] == payload["driver_id"] for driver in list_response.json()))

        get_response = self.client.get(f"/drivers/{payload['driver_id']}")
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.json()["driver_name"], payload["driver_name"])

        self.assertEqual(self.client.get("/drivers/unreliable").status_code, 200)
        self.assertEqual(self.client.get("/drivers/eco-friendly").status_code, 200)

    def test_ride_routes(self):
        suffix = self._unique_suffix()
        user_payload = {
            "user_id": f"UR{suffix}",
            "user_name": "Ride Tester",
            "age": 26,
            "contact_number": "9123456780",
            "membership_type": "Regular",
            "preferred_travel_mode": "Solo",
        }
        driver_payload = {
            "driver_id": f"DR{suffix}",
            "driver_name": "Ride Driver",
            "vehicle_type": "Car",
            "vehicle_number": f"AP10XY{suffix[:4]}",
            "fuel_type": "Petrol",
            "rating": 4.5,
        }

        self.client.post("/users/register", json=user_payload)
        self.client.post("/drivers/register", json=driver_payload)

        ride_payload = {
            "ride_id": f"RT{suffix}",
            "user_id": user_payload["user_id"],
            "driver_id": driver_payload["driver_id"],
            "source_location": "SRM",
            "destination_location": "Guntur",
            "distance_km": 18.5,
            "ride_type": "Carpool",
            "payment_mode": "UPI",
            "num_passengers": 3,
        }

        book_response = self.client.post("/rides/book", json=ride_payload)
        self.assertEqual(book_response.status_code, 200)
        self.assertEqual(book_response.json()["ride_id"], ride_payload["ride_id"])

        list_response = self.client.get("/rides/")
        self.assertEqual(list_response.status_code, 200)
        self.assertTrue(any(ride["ride_id"] == ride_payload["ride_id"] for ride in list_response.json()))

        summary_response = self.client.get(f"/rides/{ride_payload['ride_id']}")
        self.assertEqual(summary_response.status_code, 200)
        self.assertIn("summary", summary_response.json())

        history_response = self.client.get(f"/rides/user/{user_payload['user_id']}")
        self.assertEqual(history_response.status_code, 200)
        self.assertTrue(any(ride["ride_id"] == ride_payload["ride_id"] for ride in history_response.json()))

        cancel_response = self.client.post(f"/rides/{ride_payload['ride_id']}/cancel")
        self.assertEqual(cancel_response.status_code, 200)
        self.assertEqual(cancel_response.json()["ride_status"], "Cancelled")

        simulate_response = self.client.get("/rides/simulate")
        self.assertEqual(simulate_response.status_code, 200)
        self.assertEqual(len(simulate_response.json()), 5)

    def test_route_routes(self):
        self.assertEqual(self.client.get("/routes/popular").status_code, 200)
        self.assertEqual(self.client.get("/routes/low-demand").status_code, 200)

        unique_response = self.client.get("/routes/unique")
        self.assertEqual(unique_response.status_code, 200)
        self.assertIn(self.sample_route, unique_response.json())

        self.assertEqual(self.client.get("/routes/peak-times").status_code, 200)

    def test_carpool_routes(self):
        groups_response = self.client.get("/carpool/groups")
        self.assertEqual(groups_response.status_code, 200)
        groups = groups_response.json()
        self.assertTrue(groups)

        route_value = groups[0]["route"]
        savings_response = self.client.get(f"/carpool/savings/{route_value}")
        self.assertEqual(savings_response.status_code, 200)
        self.assertEqual(savings_response.json()["route"], route_value)

        self.assertEqual(self.client.get("/carpool/efficient").status_code, 200)

    def test_sustainability_routes(self):
        self.assertEqual(self.client.get("/sustainability/report").status_code, 200)
        self.assertEqual(self.client.get("/sustainability/compare-vehicles").status_code, 200)
        self.assertEqual(self.client.get("/sustainability/fuel-total").status_code, 200)
        self.assertEqual(self.client.get("/sustainability/emission-total").status_code, 200)

    def test_reward_routes(self):
        self.assertEqual(self.client.get("/rewards/winners").status_code, 200)

        discount_response = self.client.get("/rewards/simulate-discount")
        self.assertEqual(discount_response.status_code, 200)
        self.assertIn("discount_percent", discount_response.json())

        green_points_response = self.client.get(f"/rewards/green-points/{self.sample_user_id}")
        self.assertEqual(green_points_response.status_code, 200)
        self.assertEqual(green_points_response.json()["user_id"], self.sample_user_id)

    def test_analytics_routes(self):
        report_response = self.client.get("/analytics/report")
        self.assertEqual(report_response.status_code, 200)
        self.assertIn("total_rides", report_response.json())

        self.assertEqual(self.client.get("/analytics/user-summary").status_code, 200)
        self.assertEqual(self.client.get("/analytics/route-summary").status_code, 200)
        self.assertEqual(self.client.get("/analytics/emission-trends").status_code, 200)
        self.assertEqual(self.client.get("/analytics/recursive/total-distance").status_code, 200)
        self.assertEqual(self.client.get("/analytics/recursive/total-emissions").status_code, 200)

        ride_count_response = self.client.get(
            f"/analytics/recursive/ride-count/{self.sample_user_id}"
        )
        self.assertEqual(ride_count_response.status_code, 200)

        sample_history = store.user_ride_history_dict[self.sample_user_id]
        if sample_history:
            search_response = self.client.get(
                f"/analytics/recursive/search/{self.sample_user_id}/{sample_history[0]}"
            )
            self.assertEqual(search_response.status_code, 200)
            self.assertTrue(search_response.json()["found"])


if __name__ == "__main__":
    unittest.main()
