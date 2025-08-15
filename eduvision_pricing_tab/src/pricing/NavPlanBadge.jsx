import React, { useEffect, useState } from "react";
import { usePlan } from "./PlanContext";
import { usageSummary } from "./quota";

export default function NavPlanBadge() {
  const { plan } = usePlan();
  const [usage, setUsage] = useState(usageSummary());

  useEffect(() => {
    const id = setInterval(() => setUsage(usageSummary()), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-800">
        {plan.toUpperCase()}
      </span>
      {plan === "free" && (
        <span className="text-xs text-gray-700">
          {usage.remaining} left this week
        </span>
      )}
    </div>
  );
}
