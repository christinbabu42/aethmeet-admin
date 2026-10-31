import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import api, {
  setAccessToken,
  clearAccessToken,
} from "./api/axios";

import Dashboard from "./Dashboard";
import Login from "./Login";

// legal pages
import PrivacyPolicy from "./legal/privacy";
import TermsConditions from "./legal/terms";
import CommunityGuidelines from "./legal/communityGuideline";
import ModerationPolicy from "./legal/ModerationPolicy";
import RefundPolicy from "./legal/Refund";
import Support from "./legal/LegalScreen";
import DeleteAccount from "./legal/DeleteAccount";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore the admin session using the HttpOnly refresh cookie.
  useEffect(() => {
    let mounted = true;

    const handleExpired = () => {
      clearAccessToken();

      if (mounted) {
        setIsAdmin(false);
      }
    };

    window.addEventListener("admin-auth-expired", handleExpired);

    const restoreSession = async () => {
      try {
        const res = await api.post("/auth/refresh", {});

        if (!mounted) return;

        if (res.data?.success && res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          setIsAdmin(true);
        } else {
          clearAccessToken();
          setIsAdmin(false);
        }
      } catch (error) {
        clearAccessToken();

        if (mounted) {
          setIsAdmin(false);
        }

        // A server/network error is not proof that the refresh cookie
        // is invalid. Do not delete cookies or local storage here.
        console.error(
          "Could not restore admin session:",
          error.response?.data?.message || error.message
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
      window.removeEventListener(
        "admin-auth-expired",
        handleExpired
      );
    };
  }, []);

  const handleLoginSuccess = async (googleResponse) => {
    try {
      const res = await api.post("/auth/google", {
        idToken: googleResponse.idToken,
        isAdminLogin: true,
      });

      if (res.data?.isAdmin && res.data?.accessToken) {
        // Refresh token is HttpOnly and must NOT be read by JavaScript.
        setAccessToken(res.data.accessToken);
        setIsAdmin(true);
      } else {
        clearAccessToken();
        setIsAdmin(false);
        alert("Access Denied: You are not an admin.");
      }
    } catch (err) {
      clearAccessToken();

      console.error("Login failed", err);

      alert(
        err.response?.data?.message || "Authentication failed"
      );
    }
  };

  const handleLogout = async () => {
    try {
      // Backend reads the refresh token from the HttpOnly cookie.
      await api.post("/auth/logout", {});
    } catch (error) {
      console.error(
        "Logout request failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      clearAccessToken();
      setIsAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-slate-600">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

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
          <Route
            path="/moderation-policy"
            element={<ModerationPolicy />}
          />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/support" element={<Support />} />
          <Route
            path="/delete-account"
            element={<DeleteAccount />}
          />
        </Routes>
      </div>
    </Router>
  );
}