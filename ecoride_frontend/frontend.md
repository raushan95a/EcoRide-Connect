
# FRONTEND SECTION (React JS)

---

## 1. Project Structure

```
ecoride_frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── api/
│   │   └── api.js              # All API calls to FastAPI backend
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── StatCard.jsx        # Reusable summary card
│   │   ├── DataTable.jsx       # Reusable table component
│   │   └── Badge.jsx           # Status badge (Eco-Friendly, Unreliable, etc.)
│   ├── pages/
│   │   ├── Dashboard.jsx       # Overview stats
│   │   ├── Users.jsx           # User management
│   │   ├── Drivers.jsx         # Driver management
│   │   ├── Rides.jsx           # Ride booking, history, cancellation
│   │   ├── Routes.jsx          # Route demand analysis
│   │   ├── Carpool.jsx         # Carpool groups & savings
│   │   ├── Sustainability.jsx  # Sustainability report & vehicle comparison
│   │   ├── Rewards.jsx         # Eco reward winners
│   │   └── Analytics.jsx       # Full analytics report + pandas tables
│   └── styles/
│       └── index.css
├── package.json
└── vite.config.js
```

---

## 2. Tech & Libraries

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "react-router-dom": "^6",
    "axios": "^1.6",
    "recharts": "^2.8"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4"
  }
}
```

Use **Recharts** for charts. Use plain CSS or Tailwind CSS for styling.

---

## 3. API Integration (`src/api/api.js`)

Create one central file with all axios calls to `http://localhost:8000`:

```javascript
import axios from "axios";
const BASE = "http://localhost:8000";

// Users
export const registerUser = (data) => axios.post(`${BASE}/users/register`, data);
export const getAllUsers = () => axios.get(`${BASE}/users/`);
export const getFrequentRiders = () => axios.get(`${BASE}/users/frequent`);
export const getEcoUsers = () => axios.get(`${BASE}/users/eco-friendly`);

// Drivers
export const registerDriver = (data) => axios.post(`${BASE}/drivers/register`, data);
export const getAllDrivers = () => axios.get(`${BASE}/drivers/`);
export const getUnreliableDrivers = () => axios.get(`${BASE}/drivers/unreliable`);
export const getEcoDrivers = () => axios.get(`${BASE}/drivers/eco-friendly`);

// Rides
export const bookRide = (data) => axios.post(`${BASE}/rides/book`, data);
export const cancelRide = (id) => axios.post(`${BASE}/rides/${id}/cancel`);
export const getAllRides = () => axios.get(`${BASE}/rides/`);
export const getRideSummary = (id) => axios.get(`${BASE}/rides/${id}`);
export const getUserRideHistory = (uid) => axios.get(`${BASE}/rides/user/${uid}`);
export const simulateRideRequests = () => axios.get(`${BASE}/rides/simulate`);

// Routes
export const getPopularRoutes = () => axios.get(`${BASE}/routes/popular`);
export const getLowDemandRoutes = () => axios.get(`${BASE}/routes/low-demand`);
export const getUniqueRoutes = () => axios.get(`${BASE}/routes/unique`);
export const getPeakTimes = () => axios.get(`${BASE}/routes/peak-times`);

// Carpool
export const getCarpoolGroups = () => axios.get(`${BASE}/carpool/groups`);
export const getCarpoolSavings = (route) => axios.get(`${BASE}/carpool/savings/${encodeURIComponent(route)}`);
export const getEfficientCarpool = () => axios.get(`${BASE}/carpool/efficient`);

// Sustainability
export const getSustainabilityReport = () => axios.get(`${BASE}/sustainability/report`);
export const compareVehicles = () => axios.get(`${BASE}/sustainability/compare-vehicles`);

// Rewards
export const getRewardWinners = () => axios.get(`${BASE}/rewards/winners`);
export const getRandomDiscount = () => axios.get(`${BASE}/rewards/simulate-discount`);

// Analytics
export const getAnalyticsReport = () => axios.get(`${BASE}/analytics/report`);
export const getUserSummaryTable = () => axios.get(`${BASE}/analytics/user-summary`);
export const getRouteSummaryTable = () => axios.get(`${BASE}/analytics/route-summary`);
export const getEmissionTrends = () => axios.get(`${BASE}/analytics/emission-trends`);
export const getRecursiveTotalDistance = () => axios.get(`${BASE}/analytics/recursive/total-distance`);
export const getRecursiveTotalEmissions = () => axios.get(`${BASE}/analytics/recursive/total-emissions`);
```

---

## 4. Pages

### `Dashboard.jsx`
- On load, fetch: analytics report, sustainability report, total users, total drivers
- Display **StatCards** for:
  - Total Rides
  - Average Distance (km)
  - Total CO2 Emitted (kg)
  - Eco-Friendly Rides Count
  - Cancelled Rides
  - Most Popular Route
- Show a **BarChart** (Recharts) of top 5 routes by ride count
- Show a **PieChart** of ride types: Solo vs Carpool

---

### `Users.jsx`
- **Left Panel: Register User Form**
  - Fields: User ID, Name, Age, Contact, Membership Type (dropdown), Preferred Travel Mode (dropdown)
  - On submit → call `registerUser()` → show success/error toast
- **Right Panel: Users Table**
  - Columns: User ID | Name | Age | Membership | Travel Mode | Status
  - Status shown as colored Badge: Frequent Rider (blue), Eco-Friendly (green), Regular (gray)
  - Filter buttons: All | Frequent Riders | Eco-Friendly

---

### `Drivers.jsx`
- **Left Panel: Register Driver Form**
  - Fields: Driver ID, Name, Vehicle Type (dropdown), Vehicle Number, Fuel Type (dropdown), Rating (1–5)
  - On submit → call `registerDriver()`
- **Right Panel: Drivers Table**
  - Columns: Driver ID | Name | Vehicle | Fuel Type | Rating | Cancellations | Status
  - Status Badge: Reliable (green), Unreliable Driver (red)
  - Filter buttons: All | Eco-Friendly | Unreliable

---

### `Rides.jsx`

Three tabs:

**Tab 1: Book a Ride**
- Form fields: Ride ID, User ID, Driver ID, Source, Destination, Distance (km), Ride Type (Solo/Carpool), Passengers, Payment Mode
- On submit → call `bookRide()` → show Ride Summary card with all details (Fare, Emission, Status, Eco badge)

**Tab 2: All Rides**
- Table: Ride ID | User | Driver | Route | Distance | Type | Fare | Emission | Status | Eco
- Status badge: Completed (green), Cancelled (red)
- Eco badge: 🌱 if eco_friendly = true

**Tab 3: Simulate Rides**
- Button: "Generate Random Rides" → calls `simulateRideRequests()` → displays simulated ride cards

---

### `Routes.jsx`
- **Popular Routes Section**: Bar chart + table showing route, ride count, demand tag
- **Low Demand Routes Section**: List of routes with low ride counts
- **Peak Travel Times Section**: Line chart of rides per hour (Recharts LineChart)
- **All Unique Routes**: List of unique routes from the set

---

### `Carpool.jsx`
- Show carpool groups table: Route | Users | Passengers | Reduced Fare/User | Emission Saved | Tag
- Highlight efficient groups (3+ passengers) with a special badge
- Show a savings card for each route with original vs reduced fare comparison

---

### `Sustainability.jsx`
- **Summary Cards**: Total Fuel Consumed | Total CO2 Emitted | Eco-Friendly Rides | Electric Vehicle %
- **Vehicle Comparison Card**: Electric avg emission vs Fuel avg emission + % reduction
- **Eco-Friendly Users Table**: User ID | Name | Avg Emission | Travel Mode
- **Eco-Friendly Drivers Table**: Driver ID | Name | Fuel Type | Avg Emission
- Show a **BarChart** comparing electric vs petrol/diesel emissions

---

### `Rewards.jsx`
- Button: "Select Eco Reward Winners" → calls `getRewardWinners()` → displays winner cards
- Each winner card shows:
  - User ID, Name
  - Reward Type badge (Free Ride Coupon / Green Points / Discount)
  - Coupon Code (styled like a coupon)
  - Green Points value
- Button: "Generate Random Discount" → shows a discount coupon popup

---

### `Analytics.jsx`

Four sections:

**Section 1: Analytics Report**
- Stat cards matching Sample Output 2:
  - Total Rides, Average Distance, Most Popular Route, Eco-Friendly Rides, High Demand Routes, Cancelled Rides

**Section 2: User Summary Table (from Pandas)**
- Table from `/analytics/user-summary`:
  - Columns: UserID | Total Rides | Avg Distance | Total Emission | Status
  - Status badge coloring

**Section 3: Route Summary Table (from Pandas)**
- Table from `/analytics/route-summary`:
  - Columns: Route | Total Rides | Avg Fare | Avg Emission | Demand Tag

**Section 4: Recursive Computations**
- Show 4 cards with results:
  - Recursive Total Distance (km)
  - Recursive Total Emissions (kg CO2)
  - Input field: User ID → "Get Recursive Ride Count"
  - Input fields: User ID + Ride ID → "Search Ride in History" (True/False result)

---

## 5. Navbar (`components/Navbar.jsx`)

Navigation links:
- 🏠 Dashboard
- 👤 Users
- 🚗 Drivers
- 🛣️ Rides
- 📍 Routes
- 🤝 Carpool
- 🌿 Sustainability
- 🎁 Rewards
- 📊 Analytics

Use `react-router-dom`'s `<NavLink>` for active state highlighting.

---

## 6. Reusable Components

### `StatCard.jsx`
```jsx
// Props: title, value, unit, color, icon
// Renders a card with a big number, title, and optional unit label
```

### `DataTable.jsx`
```jsx
// Props: columns (array of {key, label}), data (array of row objects)
// Renders a styled table with headers and rows
// Optional: onRowClick handler
```

### `Badge.jsx`
```jsx
// Props: label, type ("success" | "danger" | "info" | "warning" | "eco")
// Renders a small colored badge chip
// "Eco-Friendly" → green, "Unreliable Driver" → red, "Frequent Rider" → blue
// "High Demand Route" → orange, "Completed" → green, "Cancelled" → red
```

---

## 7. App.jsx Routing

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import all pages and Navbar

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/routes" element={<Routes />} />
          <Route path="/carpool" element={<Carpool />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

---

## 8. Styling Guidelines

- Use a green-themed color palette to reflect eco-friendliness
- Primary color: `#2e7d32` (dark green)
- Accent: `#66bb6a` (light green)
- Background: `#f1f8e9` (very light green-white)
- Danger: `#c62828` (red for cancellations/unreliable)
- Info: `#1565c0` (blue for frequent riders)
- Font: Use a clean sans-serif (Inter or system-ui)
- Cards should have subtle shadows and rounded corners
- Tables should have alternating row colors for readability

---

## 9. Sample Output Displays

The frontend must display outputs that exactly match the sample outputs in the requirements:

**Ride Summary Card** must show:
```
----- RIDE SUMMARY -----
Ride ID: R205
User: Kavya
Driver: Arun
Route: SRM → Vijayawada
Distance: 18 km
Ride Type: Carpool
Fare: Rs. 120
Emission: 2.5 kg CO2
Status: Completed
```

**Analytics Report Card** must show:
```
----- RIDE ANALYTICS REPORT -----
Total Rides: 120
Average Distance: 12.4 km
Most Popular Route: SRM → Guntur
Eco-Friendly Rides: 45
High Demand Routes: 6
Cancelled Rides: 14
```

**Reward Card** must show:
```
----- ECO REWARD SECTION -----
User ID: U121
Name: Rohan
Reward: Free Ride Coupon
Code: ECO100
```

---

## 10. Running the Project

### Backend
```bash
cd ecoride_backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend will be available at: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`

### Frontend
```bash
cd ecoride_frontend
npm install
npm run dev
```
Frontend will be available at: `http://localhost:5173`

---

### Frontend
- [ ] All 8 pages implemented
- [ ] All API endpoints integrated
- [ ] Recharts used for at least 3 charts (bar, pie, line)
- [ ] Reusable Badge, StatCard, DataTable components
- [ ] React Router navigation
- [ ] Register forms for users and drivers
- [ ] Ride booking form with result display
- [ ] Rewards page with random selection
- [ ] Analytics page with user and route summary tables
- [ ] Recursive results displayed on Analytics page
- [ ] Sample output formats reproduced visually


# EcoRide Connect — Modern UI Color System

A minimal, warm, and modern palette inspired by eco-tech platforms, mobility apps, and clean dashboards.

---

## Primary Gradient (Brand Identity)

```
linear-gradient(135deg, #FF7A18, #FFB347, #FFE29F)
```

**Use for:**

* Hero sections
* Navbar background
* Primary buttons
* Highlights

**Feel:** Warm, energetic, modern mobility vibe

---

## Secondary Gradient (Eco-Tech Accent)

```
linear-gradient(135deg, #00C9A7, #92FE9D)
```

**Use for:**

* Eco-friendly badges
* Sustainability cards
* Success states

**Feel:** Clean, fresh, subtle eco reference (not overpowering)

---

## Dark Modern Gradient (Premium Look)

```
linear-gradient(135deg, #1F1C2C, #928DAB)
```

**Use for:**

* Dashboard headers
* Sidebar / navbar (dark mode)
* Analytics sections

**Feel:** Professional, modern SaaS UI

---

## Accent Gradient (Highlight / CTA)

```
linear-gradient(135deg, #F857A6, #FF5858)
```

**Use for:**

* Call-to-action buttons
* Important alerts
* Reward sections

**Feel:** Vibrant, engaging, eye-catching

---

## Background Colors (Minimal Base)

| Purpose                 | Color     |
| ----------------------- | --------- |
| Main Background         | `#F9FAFB` |
| Card Background         | `#FFFFFF` |
| Soft Section Background | `#F3F4F6` |

---

## Neutral Colors (Text & Layout)

| Type             | Color     |
| ---------------- | --------- |
| Primary Text     | `#111827` |
| Secondary Text   | `#6B7280` |
| Border / Divider | `#E5E7EB` |

---

## 🚦 Status Colors (Clean & Modern)

| Status        | Color     | Usage              |
| ------------- | --------- | ------------------ |
| Success / Eco | `#10B981` | Eco-friendly rides |
| Warning       | `#F59E0B` | High demand        |
| Error         | `#EF4444` | Cancelled rides    |
| Info          | `#3B82F6` | Frequent riders    |

---

## UI Component Styling

### Buttons

```
Primary:
background: linear-gradient(135deg, #FF7A18, #FFB347);
color: white;

Secondary:
background: #F3F4F6;
color: #111827;
```

---

### Cards

```
background: #FFFFFF;
border-radius: 16px;
box-shadow: 0 4px 20px rgba(0,0,0,0.05);
padding: 16px;
```

---

### Badges

```
Eco-Friendly:
background: #D1FAE5;
color: #065F46;

Unreliable:
background: #FEE2E2;
color: #991B1B;

Frequent Rider:
background: #DBEAFE;
color: #1E40AF;
```

---

### Navbar (Modern Look)

```
background: linear-gradient(135deg, #1F1C2C, #928DAB);
color: white;
```

---

## Chart Colors (Recharts Friendly)

```
Primary Bars: #FF7A18
Secondary Bars: #00C9A7
Accent: #F857A6
Neutral: #6B7280
```

---

## Design Feel Summary

* Warm + modern (orange, peach, soft pink)
* Balanced with cool eco tones (teal, mint)
* Clean SaaS look (light gray + white)
* Minimal but visually rich using gradients

---

## Tip

Avoid using gradients everywhere.
Use them **only for emphasis**, and keep most UI clean and white — that’s what makes it look premium.

---
