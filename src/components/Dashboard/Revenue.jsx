import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import { 
  RefreshCcw, 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  Users 
} from "lucide-react";

const Revenue = () => {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all"); // all, today, 2days, 1week, 1month, 6month, 1year, custom
  const [customDate, setCustomDate] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/revenue");
      setRawData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Revenue fetch error", err);
      setLoading(false);
    }
  };

  // 🔹 Filtering Logic
  const filteredData = useMemo(() => {
    if (!rawData) return null;

    const now = new Date();
    const calls = rawData.calls.filter((call) => {
      const callDate = new Date(call.endedAt);
      
      if (timeRange === "all") return true;
      if (timeRange === "today") return callDate.toDateString() === now.toDateString();
      
      if (timeRange === "2days") {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(now.getDate() - 2);
        return callDate >= twoDaysAgo;
      }
      if (timeRange === "1week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return callDate >= weekAgo;
      }
      if (timeRange === "1month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return callDate >= monthAgo;
      }
      if (timeRange === "6month") {
        const halfYearAgo = new Date();
        halfYearAgo.setMonth(now.getMonth() - 6);
        return callDate >= halfYearAgo;
      }
      if (timeRange === "1year") {
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        return callDate >= yearAgo;
      }
      if (timeRange === "custom") {
        if (!customDate.start || !customDate.end) return true;
        return callDate >= new Date(customDate.start) && callDate <= new Date(customDate.end);
      }
      return true;
    });

    // Recalculate Totals based on filtered calls
    const totals = calls.reduce((acc, call) => ({
      totalCoins: acc.totalCoins + (call.totalCoinsSpent || 0),
      totalHostEarnings: acc.totalHostEarnings + (call.hostEarnings || 0),
      totalCommission: acc.totalCommission + (call.platformCommission || 0),
      totalHostRupees: acc.totalHostRupees + (call.hostEarningsInRupees || 0),
      totalPlatformRupees: acc.totalPlatformRupees + (call.platformFeeInRupees || 0),
    }), { totalCoins: 0, totalHostEarnings: 0, totalCommission: 0, totalHostRupees: 0, totalPlatformRupees: 0 });

    return { totals, calls };
  }, [rawData, timeRange, customDate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-screen">
        <RefreshCcw className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium animate-pulse">Calculating revenue data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Revenue Analytics
          </h1>
          <p className="text-sm text-gray-500">Real-time overview of platform earnings and payouts</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Date Inputs */}
          {timeRange === "custom" && (
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
              <input 
                type="date" 
                className="text-xs p-1 outline-none border-none" 
                onChange={(e) => setCustomDate({...customDate, start: e.target.value})}
              />
              <span className="text-gray-400">to</span>
              <input 
                type="date" 
                className="text-xs p-1 outline-none border-none" 
                onChange={(e) => setCustomDate({...customDate, end: e.target.value})}
              />
            </div>
          )}

          {/* Time Range Dropdown */}
          <div className="relative group">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="2days">Last 2 Days</option>
              <option value="1week">Last 1 Week</option>
              <option value="1month">Last 1 Month</option>
              <option value="6month">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
          </div>

          <button 
            onClick={fetchRevenue}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCcw size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card 
          title="Total Spent" 
          value={filteredData.totals.totalCoins} 
          subtitle="Total Coins"
          icon={<Wallet className="text-blue-600" size={18} />}
          accent="bg-blue-600"
        />
        <Card 
          title="Host Coins" 
          value={filteredData.totals.totalHostEarnings.toFixed(1)} 
          subtitle="Earnings"
          icon={<Users className="text-purple-600" size={18} />}
          accent="bg-purple-600"
        />
        <Card 
          title="Commission" 
          value={filteredData.totals.totalCommission.toFixed(1)} 
          subtitle="Coins Collected"
          icon={<PieChart className="text-orange-600" size={18} />}
          accent="bg-orange-600"
        />
        <Card 
          title="Host Payouts" 
          value={`₹${filteredData.totals.totalHostRupees.toLocaleString()}`} 
          subtitle="Actual Cash ₹"
          icon={<ArrowUpRight className="text-red-600" size={18} />}
          accent="bg-red-600"
        />
        <Card 
          title="Platform Net" 
          value={`₹${filteredData.totals.totalPlatformRupees.toLocaleString()}`} 
          subtitle="Actual Revenue ₹"
          icon={<TrendingUp className="text-green-600" size={18} />}
          accent="bg-green-600"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Transaction Logs</h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            {filteredData.calls.length} Transactions
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 text-gray-500 text-left border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Caller & Host</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Call Info</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Duration</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Coins Flow</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Rupee Flow</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Date/Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.calls.map((call) => (
                <tr key={call._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{call.callerId?.name || "Guest"}</span>
                      <span className="text-xs text-pink-500 font-medium italic">to {call.hostId?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      call.callType === 'video' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {call.callType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {Math.floor(call.duration / 60)}m {call.duration % 60}s
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-gray-700 font-bold">Spent: {call.totalCoinsSpent}</span>
                      <span className="text-green-600">Host: +{call.hostEarnings}</span>
                      <span className="text-orange-500">Comm: -{call.platformCommission}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-red-500 font-bold">Host: ₹{call.hostEarningsInRupees}</span>
                      <span className="text-green-600 font-bold">Platform: ₹{call.platformFeeInRupees}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      {new Date(call.endedAt).toLocaleDateString()}<br/>
                      {new Date(call.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.calls.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <Calendar className="mx-auto mb-2 opacity-20" size={48} />
              <p>No transactions found for the selected period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 🔹 Reusable Card Component
const Card = ({ title, value, subtitle, icon, accent }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden transition-transform hover:-translate-y-1">
    <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
    <div className="flex justify-between items-start mb-2">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <div className="p-1.5 bg-gray-50 rounded-lg">{icon}</div>
    </div>
    <p className="text-2xl font-black text-gray-800 tracking-tight">{value}</p>
    <p className="text-[10px] text-gray-500 mt-1 font-medium">{subtitle}</p>
  </div>
);

export default Revenue;