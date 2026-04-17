import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/carpool" element={<Carpool />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
