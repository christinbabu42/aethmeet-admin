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

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // In a real production app, you might want to call a 
      // /api/auth/me endpoint here to verify the token is still valid
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

const handleLoginSuccess = async (googleResponse) => {
  try {
    const res = await axios.post(
      "https://api.aethmeet.com/api/auth/google",
      {
        accessToken: googleResponse.access_token, // <--- send accessToken
        isAdminLogin: true
      }
    );

    if (res.data.isAdmin && res.data.token) {
      localStorage.setItem("adminToken", res.data.token);
      setIsAdmin(true);
    } else {
      alert("Access Denied: You are not an admin.");
    }
  } catch (err) {
    console.error("Login failed", err);
    alert(err.response?.data?.message || "Authentication failed");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-slate-600">Verifying Session...</p>
        </div>
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