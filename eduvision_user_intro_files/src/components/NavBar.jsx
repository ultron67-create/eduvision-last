import { useState, useEffect } from "react";

export default function NavBar({ onLoginClick }) {
  const [userData, setUserData] = useState(null);
  const [country, setCountry] = useState("US");

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) setUserData(JSON.parse(saved));
  }, []);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Mentora</div>
      <div className="flex items-center gap-4">
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="text-black p-1 rounded"
        >
          <option value="US">US</option>
          <option value="IN">IN</option>
          <option value="UK">UK</option>
        </select>

        {userData ? (
          <span className="font-semibold">{userData.role}</span>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            Log In
          </button>
        )}
      </div>
    </nav>
  );
}