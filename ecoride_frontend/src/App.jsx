import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Drivers from "./pages/Drivers";
import Analytics from "./pages/Analytics";
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/rides" element={<div>Rides coming soon</div>} />
          <Route path="/routes" element={<div>Routes coming soon</div>} />
          <Route path="/carpool" element={<div>Carpool coming soon</div>} />
          <Route path="/sustainability" element={<div>Sustainability coming soon</div>} />
          <Route path="/rewards" element={<div>Rewards coming soon</div>} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
