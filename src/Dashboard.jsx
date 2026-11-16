
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import api from "./api/axios";

// Import all sub-pages
import Overview from "./components/Dashboard/Overview";
import UserManagement from "./components/Dashboard/UserManagement";
import HostManagement from "./components/Dashboard/Hostmanagement";
import CallManagement from "./components/Dashboard/CallManagement";
import WalletTransactions from "./components/Dashboard/WalletTransactions";
import Withdrawals from "./components/Dashboard/Withdrawals";
import GiftsManagement from "./components/Dashboard/GiftsManagement";
import RateManagement from "./components/Dashboard/RateManagement";
import PurchaseCoinRate from "./components/Dashboard/purchaseCoinRate";
import Revenue from "./components/Dashboard/Revenue";
import Reports from "./components/Dashboard/Reports";
import VideoCall from "./components/Dashboard/video-call";
import ConcurrentUsers from "./components/Dashboard/ConcurrentUsers";
import HostVerification from "./components/Dashboard/HostVerification";
import WalletBalance from "./components/Dashboard/WalletBalance";
import AppControl from "./components/Dashboard/AppControl";
import UserDetails from "./components/Dashboard/UserDetails";
import SupportContacts from "./components/Dashboard/SupportContacts";

const menuItems = [
  { id: "Overview", path: "/", icon: "📊" },
  { id: "User Management", path: "/users", icon: "👤" },
  { id: "User Details & Analytics", path: "/user-details", icon: "📈" },
  { id: "Host Management", path: "/hosts", icon: "💃" },
  { id: "Host Verification", path: "/host-verification", icon: "🛡️" },
  { id: "Wallet Balance", path: "/wallet-balance", icon: "🪙" },
  { id: "Call Management", path: "/calls", icon: "📞" },
  { id: "Video Call Management", path: "/video-calls", icon: "🎥" },
  { id: "Concurrent Users", path: "/concurrent-users", icon: "👥" },
  { id: "Wallet & Transactions", path: "/wallet-transactions", icon: "💰" },
  { id: "Withdrawals", path: "/withdrawals", icon: "🏦" },
  { id: "Gifts Management", path: "/gifts", icon: "🎁" },
  { id: "Rate Management", path: "/rates", icon: "💎" },
  { id: "Purchase Coin Rate", path: "/purchase-coin-rate", icon: "🪙" },
  { id: "Revenue", path: "/revenue", icon: "💵" },
  { id: "Reports", path: "/reports", icon: "🚩" },
  { id: "App Control", path: "/app-control", icon: "⚙️" },
  { id: "Support Contacts", path: "/support-contacts", icon: "📧" },
];

export default function Dashboard({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 1450,
    totalHosts: 230,
    onlineHosts: 45,
    activeCalls: 12,
    todayRevenue: 890,
    totalRevenue: 54200,
    commission: 12400,
    pendingPayouts: 15,
  });

  const activeItem =
    menuItems.find((item) => item.path === location.pathname) ||
    menuItems[0];

  useEffect(() => {
    api.get("/admin/users")
      .then((res) => {
        // Your GET /admin/users endpoint returns { success, data }
        if (res.data?.success) {
          setUsers(res.data.data);
        }
      })
      .catch((e) => console.log("Fetch error:", e));
  }, []);

  const renderContent = () => (
    <Routes>
      <Route path="/" element={<Overview stats={stats} />} />
      <Route path="/users" element={<UserManagement users={users} />} />
      <Route path="/user-details" element={<UserDetails />} />
      <Route path="/hosts" element={<HostManagement />} />
      <Route path="/host-verification" element={<HostVerification />} />
      <Route path="/wallet-balance" element={<WalletBalance />} />
      <Route path="/calls" element={<CallManagement />} />
      <Route path="/video-calls" element={<VideoCall />} />
      <Route path="/concurrent-users" element={<ConcurrentUsers />} />
      <Route path="/wallet-transactions" element={<WalletTransactions />} />
      <Route path="/withdrawals" element={<Withdrawals />} />
      <Route path="/gifts" element={<GiftsManagement />} />
      <Route path="/rates" element={<RateManagement />} />
      <Route path="/purchase-coin-rate" element={<PurchaseCoinRate />} />
      <Route path="/revenue" element={<Revenue />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/app-control" element={<AppControl />} />
      <Route path="/support-contacts" element={<SupportContacts />}
/>

      {/* Unknown dashboard URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* SIDEBAR */}
      <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-8 text-2xl font-black border-b border-slate-800 text-center">
          <span className="text-pink-500">AETH</span> ADMIN
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-8 py-4 text-sm font-medium transition-all ${
                activeItem.path === item.path
                  ? "bg-pink-600 text-white border-r-4 border-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <span className="text-xl mr-4">{item.icon}</span>
              {item.id}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="m-6 p-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold"
        >
          Logout Session
        </button>
      </div>

      {/* HEADER & CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b h-20 flex justify-between items-center px-10 shadow-sm z-10">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {activeItem.id}
          </h2>

          <div className="flex items-center space-x-4">
            <p className="text-xs text-green-500 font-mono flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Server: Stable
            </p>
            <div className="w-10 h-10 rounded-full bg-pink-500"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
