import React, { useEffect, useState } from 'react';
import axios from 'axios';

// --- Production Configuration ---
// This uses the environment variable if present, otherwise falls back to localhost for development
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create a configured axios instance for the wallet admin routes
const walletApi = axios.create({
  baseURL: `${API_BASE}/api/wallet/admin`,
});

const TransactionPlaceholder = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
    <span className="text-8xl mb-6">{icon}</span>
    <h3 className="text-3xl font-black text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 max-w-md italic">No matching transactions found for this selection.</p>
  </div>
);

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Filtering States ---
  const [filterType, setFilterType] = useState('today'); 
  const [categoryFilter, setCategoryFilter] = useState('COIN_PURCHASE'); 
  const [customDays, setCustomDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [transactions, filterType, categoryFilter, customDays, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      // Updated to use the dynamic walletApi instance
      const res = await walletApi.get('/transactions');
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      // Improved error logging for production
      console.error("❌ Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      // Updated to use the dynamic walletApi instance
      const res = await walletApi.delete(`/transactions/${id}`);
      if (res.data.success) {
        setTransactions(prev => prev.filter(tx => tx._id !== id));
      }
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err.message);
      alert("Failed to delete.");
    }
  };

  const applyFilter = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = transactions.filter((tx) => {
      // 1. CATEGORY FILTER (Matches the 3 requested types)
      if (tx.category !== categoryFilter) return false;

      const txDate = new Date(tx.createdAt);
      const diffTime = startOfToday - txDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 2. TIMEFRAME FILTERS
      if (filterType === 'today') return txDate >= startOfToday;
      if (filterType === '2days') return diffDays <= 1;
      if (filterType === '1week') return diffDays <= 6;
      if (filterType === '1month') return diffDays <= 29;
      if (filterType === '6month') return diffDays <= 179;
      if (filterType === '1year') return diffDays <= 364;
      
      if (filterType === 'custom' && customDays) {
        return diffDays <= (parseInt(customDays) - 1);
      }

      if (filterType === 'range' && startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return txDate >= start && txDate <= end;
      }
      
      return true; 
    });

    setFilteredTransactions(filtered);
    
    // SUMMATION: If COIN_PURCHASE, sum the 'amount' (money). Else, sum 'coins'.
    const total = filtered.reduce((sum, tx) => {
        if (categoryFilter === 'COIN_PURCHASE') {
            return sum + (tx.amount || 0);
        } else {
            return sum + (tx.coins || 0);
        }
    }, 0);
    
    setTotalValue(total);
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading Ledger...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {categoryFilter === 'COIN_PURCHASE' && '💰 Coin Revenue Ledger'}
                {categoryFilter === 'GIFT_PURCHASE' && '🎁 Gift Outflow Ledger'}
                {categoryFilter === 'GIFT_RECEIVED' && '💎 Host Earnings Ledger'}
            </h1>
            <p className="text-slate-500 mt-1">Audit and track wallet movements</p>
          </div>
          
          <div className="flex gap-4">
            <div className={`
                ${categoryFilter === 'COIN_PURCHASE' ? 'bg-indigo-600' : 
                  categoryFilter === 'GIFT_PURCHASE' ? 'bg-rose-600' : 'bg-emerald-600'} 
                p-5 rounded-2xl shadow-lg text-white min-w-[220px] transition-colors duration-300
            `}>
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider">
                  {categoryFilter === 'COIN_PURCHASE' ? 'Total Revenue' : 'Total Coins'}
              </p>
              <p className="text-3xl font-black italic">
                  {categoryFilter === 'COIN_PURCHASE' ? '₹' : '🪙'}
                  {totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-6 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* CATEGORY SELECTOR */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Transaction Source</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-indigo-500 block p-2.5 font-bold outline-none"
            >
              <option value="COIN_PURCHASE">1️⃣ COIN_PURCHASE (Money to Coins)</option>
              <option value="GIFT_PURCHASE">2️⃣ GIFT_PURCHASE (Sent by User)</option>
              <option value="GIFT_RECEIVED">3️⃣ GIFT_RECEIVED (Received by Host)</option>
            </select>
          </div>

          <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>

          {/* TIMEFRAME SELECTOR */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Timeframe</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl block p-2.5 font-bold outline-none"
            >
              <option value="today">Today</option>
              <option value="1week">Last 1 Week</option>
              <option value="1month">Last 1 Month</option>
              <option value="range">Custom Range</option>
            </select>
          </div>

          {filterType === 'range' && (
            <div className="flex items-center gap-3">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm rounded-xl p-2.5 font-bold outline-none" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm rounded-xl p-2.5 font-bold outline-none" />
            </div>
          )}
        </div>

        {/* Results Table */}
        {filteredTransactions.length === 0 ? (
          <TransactionPlaceholder 
            title={`No records for ${categoryFilter.replace('_',' ')}`} 
            icon={categoryFilter === 'COIN_PURCHASE' ? "💰" : categoryFilter === 'GIFT_PURCHASE' ? "🎁" : "💎"} 
          />
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="p-4 font-bold uppercase text-[10px]">User Details</th>
                    <th className="p-4 font-bold uppercase text-[10px]">Category</th>
                    <th className="p-4 font-bold uppercase text-[10px]">Coins</th>
                    <th className="p-4 font-bold uppercase text-[10px]">Amount</th>
                    <th className="p-4 font-bold uppercase text-[10px]">Timestamp</th>
                    <th className="p-4 font-bold uppercase text-[10px] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 uppercase overflow-hidden">
                            {tx.userId?.profilePic ? (
                              <img 
                                src={`${API_BASE}/public/uploads/${tx.userId.profilePic}`} 
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            ) : tx.userId?.nickname?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-none">{tx.userId?.nickname || 'Unknown'}</p>
                            <p className="text-[11px] text-slate-500 mt-1">{tx.userId?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            tx.category === 'COIN_PURCHASE' ? 'bg-blue-50 text-blue-600' :
                            tx.category === 'GIFT_PURCHASE' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className={`p-4 font-mono font-bold ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'CREDIT' ? '+' : '-'} {tx.coins}
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                          {tx.amount ? `₹${tx.amount.toLocaleString()}` : '--'}
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400 italic">{new Date(tx.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(tx._id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}