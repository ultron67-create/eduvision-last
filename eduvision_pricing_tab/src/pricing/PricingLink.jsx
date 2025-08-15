import React from "react";
import { Link } from "react-router-dom";

export default function PricingLink() {
  return (
    <Link
      to="/pricing"
      className="px-3 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
    >
      Pricing
    </Link>
  );
}
