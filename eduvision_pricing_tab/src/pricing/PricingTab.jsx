import React from "react";
import { usePlan } from "./PlanContext";
import { usageSummary, canUseFeature } from "./quota";

export default function PricingTab() {
  const { plan, setPlan } = usePlan();
  const usage = usageSummary(25);
  const allowed = canUseFeature(plan, 25);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pricing & Plans</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 shadow-sm ${plan === "free" ? "ring-2 ring-blue-500" : ""}`}>
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="text-gray-600 mt-2">Create or download up to <b>25 videos/week</b>.</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-4">
            <li>Access to core features</li>
            <li>Weekly reset every Monday (ISO week)</li>
            <li>Community support</li>
          </ul>
          <button
            className="mt-6 w-full py-2 rounded-xl bg-gray-900 text-white hover:bg-black"
            onClick={() => setPlan("free")}
            disabled={plan === "free"}
          >
            {plan === "free" ? "Current plan" : "Switch to Free"}
          </button>
        </div>

        <div className={`rounded-2xl border p-6 shadow-sm ${plan === "pro" ? "ring-2 ring-blue-500" : ""}`}>
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="text-gray-600 mt-2">Unlimited video creation & downloads.</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-4">
            <li>No weekly caps</li>
            <li>Priority support</li>
            <li>Early access to features</li>
          </ul>
          <button
            className="mt-6 w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setPlan("pro")}
            disabled={plan === "pro"}
          >
            {plan === "pro" ? "Current plan" : "Upgrade to Pro (mock)"}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            This demo toggles your plan locally. Hook up Stripe/Razorpay later.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border p-6">
        <h3 className="text-lg font-semibold">Your weekly usage</h3>
        <div className="mt-2 text-gray-700">
          <div>Week: <span className="font-mono">{usage.weekId}</span></div>
          <div>Used: <span className="font-semibold">{usage.used}</span> / {usage.limit}</div>
          <div>Remaining: <span className="font-semibold">{usage.remaining}</span></div>
        </div>
        {plan === "free" && (
          <p className="mt-3 text-sm text-gray-600">
            When you reach 25 this week, features will be temporarily disabled until next week.
          </p>
        )}
        {plan === "pro" && (
          <p className="mt-3 text-sm text-gray-600">
            You are on Pro — there is no weekly cap.
          </p>
        )}
      </div>
    </div>
  );
}
