import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const PLAN_KEY = "eduvision_plan";

const PlanContext = createContext({
  plan: "free",
  setPlan: (p) => {},
});

export const PlanProvider = ({ children }) => {
  const [plan, setPlanState] = useState("free");

  useEffect(() => {
    const saved = localStorage.getItem(PLAN_KEY);
    if (saved) setPlanState(saved);
  }, []);

  const setPlan = (p) => {
    setPlanState(p);
    localStorage.setItem(PLAN_KEY, p);
  };

  const value = useMemo(() => ({ plan, setPlan }), [plan]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export const usePlan = () => useContext(PlanContext);
export const PLAN_STORAGE_KEY = PLAN_KEY;
