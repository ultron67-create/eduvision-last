import { useState } from "react";
import { NavBar, AuthModal } from "./components";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <NavBar onLoginClick={() => setShowModal(true)} />
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onLogin={(data) => console.log("Logged in as:", data)}
        />
      )}
      <div className="p-6">Main content here...</div>
    </>
  );
}