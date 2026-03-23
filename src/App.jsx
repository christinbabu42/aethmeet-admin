import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import Login from "./Login";

// legal pages
import PrivacyPolicy from "./legal/privacy";
import TermsConditions from "./legal/terms";
import CommunityGuidelines from "./legal/communityGuideline";
import ModerationPolicy from "./legal/ModerationPolicy";
import RefundPolicy from "./legal/Refund";
import Support from "./legal/LegalScreen";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = async (googleResponse) => {
    try {
      const res = await axios.post(
        "https://api.aethmeet.com/api/auth/google",
        {
          idToken: googleResponse.credential,
          isAdminLogin: true, // 👈 IMPORTANT
        }
      );

      if (res.data.isAdmin) {
        localStorage.setItem("adminToken", res.data.token);
        setIsAdmin(true);
      } else {
        alert("Access Denied: You are not an admin.");
      }
    } catch (err) {
      console.error("Login failed", err);

      const message =
        err.response?.data?.message || "Login failed. Please try again.";

      alert(message); // ✅ shows backend message
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Main App Route */}
          <Route
            path="/"
            element={
              isAdmin ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Legal Pages Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route
            path="/community-guidelines"
            element={<CommunityGuidelines />}
          />
          <Route path="/moderation-policy" element={<ModerationPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
    </Router>
  );
}