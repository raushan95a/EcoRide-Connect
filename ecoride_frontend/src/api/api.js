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
