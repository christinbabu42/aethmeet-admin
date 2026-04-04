import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Filter States
  const [range, setRange] = useState('today'); 
  const [customDates, setCustomDates] = useState({ start: '', end: '' });

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Constructing query params
      const params = { range };
      if (range === 'custom') {
        params.startDate = customDates.start;
        params.endDate = customDates.end;
      }

      const res = await api.get('/admin/stats', { params });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately if not custom, or if custom and both dates are set
    if (range !== 'custom' || (customDates.start && customDates.end)) {
      fetchStats();
    }

    // Refresh every 30 seconds (skipped for custom range to avoid UI jumping)
    const interval = setInterval(() => {
      if (range !== 'custom') fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [range, customDates]);

  const formatNumber = (num) => num?.toLocaleString() || 0;

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(num || 0);

  const Card = ({ title, value, color, icon }) => (
    <div className={`${color} p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-200`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs opacity-80 uppercase font-black tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-2xl opacity-50">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 🛠️ FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-lg">📅</span>
            <select 
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-semibold cursor-pointer"
            >
              <option value="5min">Last 5 Minutes</option>
              <option value="today">Today</option>
              <option value="2days">Last 2 Days</option>
              <option value="1week">Last 1 Week</option>
              <option value="1month">Last 1 Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
              <option value="all">All Time</option>
              <option value="custom">Custom Duration</option>
            </select>
          </div>

          {range === 'custom' && (
            <div className="flex items-center gap-2 animate-fadeIn bg-blue-50 p-1.5 rounded-xl border border-blue-100">
              <input 
                type="date" 
                className="bg-transparent text-sm font-medium outline-none px-2"
                onChange={(e) => setCustomDates({ ...customDates, start: e.target.value })}
              />
              <span className="text-blue-300 text-xs font-bold">TO</span>
              <input 
                type="date" 
                className="bg-transparent text-sm font-medium outline-none px-2"
                onChange={(e) => setCustomDates({ ...customDates, end: e.target.value })}
              />
            </div>
          )}
        </div>

        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
        >
          <span>🔄</span> Update View
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Top Row: User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <Card title="Total Users" value={formatNumber(stats?.totalUsers)} color="bg-gradient-to-br from-blue-500 to-blue-700" icon="👥" />
            <Card title="Total Hosts" value={formatNumber(stats?.totalHosts)} color="bg-gradient-to-br from-pink-500 to-pink-700" icon="💃" />
            <Card title="Online Hosts" value={formatNumber(stats?.onlineHosts)} color="bg-gradient-to-br from-green-500 to-green-700" icon="🟢" />
            <Card title="Active Calls" value={formatNumber(stats?.activeCalls)} color="bg-gradient-to-br from-purple-500 to-purple-700" icon="📞" />
          </div>

          {/* Bottom Row: Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn delay-100">
            <Card title="Period Revenue" value={formatCurrency(stats?.todayRevenue)} color="bg-gradient-to-br from-yellow-400 to-yellow-600" icon="💰" />
            <Card title="Total Revenue" value={formatCurrency(stats?.totalRevenue)} color="bg-gradient-to-br from-orange-500 to-orange-700" icon="📈" />
            <Card title="Net Commission" value={formatCurrency(stats?.commission)} color="bg-gradient-to-br from-indigo-500 to-indigo-700" icon="🏦" />
            <Card title="Pending Payouts" value={formatCurrency(stats?.pendingPayouts)} color="bg-gradient-to-br from-red-500 to-red-700" icon="⌛" />
          </div>
        </>
      )}
    </div>
  );
}