# User Panel Package for Vite + Netlify

## Installation
1. Place `src/user-panel` into your project's `src` folder.
2. Place `netlify/functions` into your project's root `netlify` folder.
3. Install dependencies:
   ```bash
   npm install @react-oauth/google react-phone-input-2
   ```
4. Add Google OAuth Provider in `src/main.jsx`:
   ```jsx
   import { GoogleOAuthProvider } from "@react-oauth/google";
   <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
     <App />
   </GoogleOAuthProvider>
   ```
5. Update download URLs in `UserPanel.jsx` for Student, Teacher, Learner.

## Deployment
- Works on GitHub + Netlify without exposing API keys.
- Serverless functions for OTP sending and verification are inside `netlify/functions`.
