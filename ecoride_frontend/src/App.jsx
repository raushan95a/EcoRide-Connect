import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Drivers from "./pages/Drivers";
import Analytics from "./pages/Analytics";
import Rides from "./pages/Rides";
import RoutesPage from "./pages/Routes";
import Carpool from "./pages/Carpool";
import Sustainability from "./pages/Sustainability";
import Rewards from "./pages/Rewards";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import MyRides from "./pages/MyRides";
import BookRide from "./pages/BookRide";
import React from 'react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/routes" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute requireAdmin={true}><Users /></ProtectedRoute>} />
          <Route path="/drivers" element={<ProtectedRoute requireAdmin={true}><Drivers /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute requireAdmin={true}><Analytics /></ProtectedRoute>} />
          <Route path="/carpool" element={<ProtectedRoute requireAdmin={true}><Carpool /></ProtectedRoute>} />
          <Route path="/sustainability" element={<ProtectedRoute requireAdmin={true}><Sustainability /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute requireAdmin={true}><Rewards /></ProtectedRoute>} />
          <Route path="/rides" element={<ProtectedRoute requireAdmin={true}><Rides /></ProtectedRoute>} />

          <Route path="/my-rides" element={<ProtectedRoute requireAdmin={false}><MyRides /></ProtectedRoute>} />
          <Route path="/book-ride" element={<ProtectedRoute requireAdmin={false}><BookRide /></ProtectedRoute>} />
          <Route path="/routes" element={<ProtectedRoute requireAdmin={false}><RoutesPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
