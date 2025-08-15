import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { PlanProvider } from "../pricing/PlanContext";
import { PricingTab } from "../pricing";
import NavPlanBadge from "../pricing/NavPlanBadge";

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="text-gray-600 mt-2">Your existing app content goes here.</p>
    </div>
  );
}

export default function AppWithPricing() {
  return (
    <PlanProvider>
      <BrowserRouter>
        <nav className="w-full flex items-center justify-between bg-gray-900 text-white px-4 py-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-semibold">EduVision</Link>
            <Link to="/pricing" className="ml-3 px-3 py-1 rounded bg-purple-600 hover:bg-purple-700">Pricing</Link>
          </div>
          <NavPlanBadge />
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<PricingTab />} />
        </Routes>
      </BrowserRouter>
    </PlanProvider>
  );
}
