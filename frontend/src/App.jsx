import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/home";
import Signup from "./page/signup";
import Login from "./page/login";
import About from "./page/about";
import FarmerDashboard from "./page/FarmerDashboard";
import BuyerDashboard from "./page/BuyerDashboard";
import BillingPage from "./page/BillingPage";
import FarmerReport from "./page/FarmerSalesReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        {/* Dashboards */}
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        {/* BILLING */}
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/farmer-report" element={<FarmerReport />} />


      </Routes>
    </Router>
  );
}

export default App;
