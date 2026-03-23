import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ Updated Placeholder for Outflows
const TransactionPlaceholder = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
    <span className="text-8xl mb-6">{icon}</span>
    <h3 className="text-3xl font-black text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 max-w-md italic">No distribution or debit records found for this period.</p>
  </div>
);

export default function AdminDistributions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('today'); 
  const [customDays, setCustomDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [coinPurchases, setCoinPurchases] = useState([]);
const [giftPurchases, setGiftPurchases] = useState([]);
const [giftReceived, setGiftReceived] = useState([]);

const [totals, setTotals] = useState({
  coin: 0,
  purchase: 0,
  received: 0
});


  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [transactions, filterType, customDays, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/wallet/admin/transactions');
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/wallet/admin/transactions/${id}`);
      if (res.data.success) {
        setTransactions(prev => prev.filter(tx => tx._id !== id));
      }
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const applyFilter = () => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = transactions.filter((tx) => {
      // ⭐ THE CORE LOGIC CHANGE: Show everything EXCEPT 'CREDIT'
      // This targets GIFT_PURCHASE and any other DEBIT types
      // Only show gift outflows
if (tx.category !== 'GIFT_PURCHASE') return false;


      const txDate = new Date(tx.createdAt);
      const diffTime = startOfToday - txDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filterType === 'today') return txDate >= startOfToday;
      if (filterType === '2days') return diffDays <= 1;
      if (filterType === '1week') return diffDays <= 6;
      if (filterType === '1month') return diffDays <= 29;
      if (filterType === 'custom' && customDays) return diffDays <= (parseInt(customDays) - 1);
      if (filterType === 'range' && startDate && endDate) {
        const start = new Date(startDate); start.setHours(0, 0, 0, 0);
        const end = new Date(endDate); end.setHours(23, 59, 59, 999);
        return txDate >= start && txDate <= end;
      }
      return true; 
    });

    setFilteredTransactions(filtered);
    
    // Calculate total coins spent/distributed
    const total = filtered.reduce((sum, tx) => sum + (tx.coins || 0), 0);
    setTotalDebited(total);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-xl font-bold text-slate-600 animate-pulse">Loading Distribution Ledger...</div>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Distribution Ledger</h1>
            <p className="text-slate-500 mt-1">Monitoring all Coin Outflows & Gifts</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-rose-600 p-5 rounded-2xl shadow-lg text-white min-w-[220px]">
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Total Coins Distributed</p>
              <p className="text-3xl font-black italic">🪙 {totalDebited.toLocaleString()}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 min-w-[150px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Debit Events</p>
              <p className="text-3xl font-black text-slate-800">{filteredTransactions.length}</p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-6 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Timeframe</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 font-bold outline-none focus:ring-rose-500"
            >
              <option value="today">Today</option>
              <option value="1week">This Week</option>
              <option value="1month">This Month</option>
              <option value="range">Custom Range</option>
            </select>
          </div>

          {filterType === 'range' && (
            <div className="flex items-center gap-3">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm rounded-xl p-2.5 font-bold outline-none" />
              <div className="font-bold text-slate-300">to</div>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm rounded-xl p-2.5 font-bold outline-none" />
            </div>
          )}
        </div>

        {/* Results Table */}
        {filteredTransactions.length === 0 ? (
          <TransactionPlaceholder title="No distributions found" icon="📉" />
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-4 font-bold uppercase text-[10px] tracking-widest">User Details</th>
                    <th className="p-4 font-bold uppercase text-[10px] tracking-widest">Category</th>
                    <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-rose-400">Coins Deducted</th>
                    <th className="p-4 font-bold uppercase text-[10px] tracking-widest">Type</th>
                    <th className="p-4 font-bold uppercase text-[10px] tracking-widest">Timestamp</th>
                    <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                            {tx.userId?.nickname?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-none">{tx.userId?.nickname || 'System'}</p>
                            <p className="text-[11px] text-slate-500 mt-1">{tx.userId?._id || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-[10px] font-black bg-slate-100 text-slate-600">
                         {tx.category === "GIFT_PURCHASE" ? "GIFT_RECEIVED" : tx.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-black text-rose-600">
                          🪙 {tx.coins}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-400">{tx.type}</td>
                      <td className="p-4">
                        <p className="text-xs text-slate-500 font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400 lowercase">{new Date(tx.createdAt).toLocaleTimeString()}</p>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(tx._id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
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