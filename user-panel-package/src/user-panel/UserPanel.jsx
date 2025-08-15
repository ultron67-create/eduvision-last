import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function UserPanel() {
  const [profileType, setProfileType] = useState("Student");
  const [phone, setPhone] = useState("");

  const profileDownloads = {
    Student: "https://example.com/student-app-download",
    Teacher: "https://example.com/teacher-app-download",
    Learner: "https://example.com/learner-app-download",
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
  };

  const handlePhoneLogin = async () => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Choose Profile Type</h2>

      <div className="flex gap-4 mb-6">
        {["Student", "Teacher", "Learner"].map((type) => (
          <button
            key={type}
            className={\`px-4 py-2 rounded-lg border \${profileType === type ? "bg-blue-500 text-white" : "bg-gray-100"}\`}
            onClick={() => setProfileType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-2">Sign Up / Log In</h3>

      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => console.log("Google Login Failed")}
      />

      <div className="my-4 text-center text-gray-500">or</div>

      <PhoneInput
        country={"us"}
        value={phone}
        onChange={(value) => setPhone(value)}
        inputStyle={{ width: "100%" }}
      />
      <button
        onClick={handlePhoneLogin}
        className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg"
      >
        Send OTP
      </button>

      <div className="mt-6 text-center">
        <a
          href={profileDownloads[profileType]}
          className="inline-block bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download {profileType} App
        </a>
      </div>
    </div>
  );
}
