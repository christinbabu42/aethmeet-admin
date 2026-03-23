import React, { useState, useEffect } from 'react';

import api from '../../api/axios'; // 👈 Your custom api instance



export default function Overview() {

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await api.get('/admin/stats');

        setStats(res.data);

      } catch (err) {

        console.error("Failed to fetch dashboard stats", err);

      } finally {

        setLoading(false);

      }

    };

    fetchStats();

   

    // Optional: Refresh data every 30 seconds for "Live" feel

    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);

  }, []);



  const formatNumber = (num) => num?.toLocaleString() || 0;



  const formatCurrency = (num) =>

    new Intl.NumberFormat('en-IN', {

      style: 'currency',

      currency: 'INR',

      maximumFractionDigits: 0,

    }).format(num || 0);



  const Card = ({ title, value, color, icon }) => (

    <div className={`${color} p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-200`}>

      <div className="flex justify-between items-start">

        <div>

          <p className="text-xs opacity-80 uppercase font-black tracking-wider">{title}</p>

          <p className="text-3xl font-bold mt-2">{value}</p>

        </div>

        <span className="text-2xl opacity-50">{icon}</span>

      </div>

    </div>

  );



  if (loading) return (

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">

      {[...Array(8)].map((_, i) => (

        <div key={i} className="bg-gray-200 h-32 rounded-2xl"></div>

      ))}

    </div>

  );



  return (

    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">

        <Card title="Total Users" value={formatNumber(stats?.totalUsers)} color="bg-gradient-to-br from-blue-500 to-blue-700" icon="👥" />

        <Card title="Total Hosts" value={formatNumber(stats?.totalHosts)} color="bg-gradient-to-br from-pink-500 to-pink-700" icon="💃" />

        <Card title="Online Hosts" value={formatNumber(stats?.onlineHosts)} color="bg-gradient-to-br from-green-500 to-green-700" icon="🟢" />

        <Card title="Active Calls" value={formatNumber(stats?.activeCalls)} color="bg-gradient-to-br from-purple-500 to-purple-700" icon="📞" />

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn delay-100">

        <Card title="Today's Revenue" value={formatCurrency(stats?.todayRevenue)} color="bg-gradient-to-br from-yellow-400 to-yellow-600" icon="💰" />

        <Card title="Total Revenue" value={formatCurrency(stats?.totalRevenue)} color="bg-gradient-to-br from-orange-500 to-orange-700" icon="📈" />

        <Card title="Net Commission" value={formatCurrency(stats?.commission)} color="bg-gradient-to-br from-indigo-500 to-indigo-700" icon="🏦" />

        <Card title="Pending Payouts" value={formatNumber(stats?.pendingPayouts)} color="bg-gradient-to-br from-red-500 to-red-700" icon="⌛" />

      </div>

    </div>

  );

} 
