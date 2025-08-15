# EduVision – Pricing Tab & Weekly Quota (Drop‑in)

This package adds a **Pricing** tab and **weekly quota** logic to your Vite/React app (Git + Netlify friendly).

- **Free plan**: 25 video creations/downloads per week (resets every ISO week / Monday).
- **Pro plan**: Unlimited usage.
- UI shows **plan badge** and **remaining quota** in the top-right.
- All state is stored in **localStorage** (no backend required).

## Files

- `src/pricing/PlanContext.jsx`
- `src/pricing/PricingTab.jsx`
- `src/pricing/NavPlanBadge.jsx`
- `src/pricing/PricingLink.jsx`
- `src/pricing/quota.js`
- `src/pages/AppWithPricing.jsx` (example wrapper)

## Install

```bash
npm install react-router-dom
```

## Integrate

Wrap your app in `PlanProvider` and add a `/pricing` route + a nav link (see file comments).
Enforce the limit in your create/download buttons with:
```js
import { canUseFeature, recordUsage } from "./pricing/quota";
```
