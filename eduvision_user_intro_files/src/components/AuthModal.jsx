import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function AuthModal({ onClose, onLogin }) {
  const [role, setRole] = useState("Student");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    const userData = { name, role, phone };
    localStorage.setItem("userData", JSON.stringify(userData));
    onLogin(userData);
    onClose();
  };

  const handleGoogleLoginSuccess = (res) => {
    const userData = { name: "Google User", role };
    localStorage.setItem("userData", JSON.stringify(userData));
    onLogin(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Sign Up / Log In</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <PhoneInput
          country={"us"}
          value={phone}
          onChange={(val) => setPhone(val)}
          inputStyle={{ width: "100%" }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded mt-3 mb-4"
        >
          <option>Student</option>
          <option>Teacher</option>
          <option>Learner</option>
        </select>

        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => console.log("Google Login Failed")}
        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
        >
          Continue
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-300 p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}