import React, { useEffect, useState } from "react";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Power, 
  Coins, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Flame
} from "lucide-react";
import api from "../../api/axios";

export default function PurchaseCoinRate() {
  const [packs, setPacks] = useState([]);
  const [coins, setCoins] = useState("");
  const [rate, setRate] = useState("");
  const [isHot, setIsHot] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Using 'api' instance and correct endpoint
  const fetchPacks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/coin-packs");
      // Adjusting to match your backend response structure
      setPacks(res.data.packs || []);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coins || !rate) return;

    const payload = { 
      coins: Number(coins), 
      rate: Number(rate), 
      isHot 
    };

    try {
      if (editingId) {
        // ✅ FIXED: Using 'api' and template literals for ID
        await api.put(`/admin/coin-packs/${editingId}`, payload);
        setEditingId(null);
      } else {
        // ✅ FIXED: Using 'api' for creation
        await api.post("/admin/coin-packs", payload);
      }
      setCoins("");
      setRate("");
      setIsHot(false);
      fetchPacks();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving pack");
    }
  };

  const handleEdit = (pack) => {
    setCoins(pack.coins);
    setRate(pack.rate);
    setIsHot(pack.isHot || false);
    setEditingId(pack._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pack?")) return;
    try {
      // ✅ FIXED: Using 'api' instance
      await api.delete(`/admin/coin-packs/${id}`);
      fetchPacks();
    } catch (err) {
      alert("Error deleting pack");
    }
  };

  const toggleActive = async (pack) => {
    try {
      // ✅ FIXED: Correct logic for toggling status via 'api'
      await api.put(`/admin/coin-packs/${pack._id}`, {
        ...pack,
        isActive: !pack.isActive,
      });
      fetchPacks();
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Coins className="text-yellow-500" size={32} />
            Coin Pack Management
          </h1>
          <p className="text-gray-500 mt-2">Create and manage coin pricing for your users.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            {editingId ? <Pencil size={18} /> : <PlusCircle size={18} />}
            {editingId ? "Edit Existing Pack" : "Add New Coin Pack"}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Coins Amount</label>
              <input
                type="number"
                placeholder="e.g. 100"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Rate per Coin (₹)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 0.50"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-gray-600">
                    <input 
                        type="checkbox" 
                        checked={isHot} 
                        onChange={(e) => setIsHot(e.target.checked)}
                        className="w-4 h-4 text-indigo-600"
                    />
                    Mark as Hot Pack
                </label>
            </div>
            <div className="flex gap-2">
                <button 
                  type="submit" 
                  className={`flex-1 py-2 px-4 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 ${
                    editingId ? "bg-orange-500 hover:bg-orange-600" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {editingId ? "Update Pack" : "Create Pack"}
                </button>
                {editingId && (
                    <button 
                        type="button"
                        onClick={() => {setEditingId(null); setCoins(""); setRate(""); setIsHot(false);}}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-medium"
                    >
                        Cancel
                    </button>
                )}
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Pack Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rate</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packs.map((pack) => (
                  <tr key={pack._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                            <Coins size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{pack.coins} Coins</p>
                            {pack.isHot && (
                                <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase mt-1">
                                    <Flame size={10} fill="currentColor" /> Trending Pack
                                </span>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">₹{pack.rate} <span className="text-[10px] text-gray-400">/coin</span></td>
                    <td className="px-6 py-4">
                        <span className="text-indigo-600 font-bold text-lg">₹{(pack.coins * pack.rate).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleActive(pack)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          pack.isActive 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {pack.isActive ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {pack.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(pack)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pack._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {packs.length === 0 && !loading && (
            <div className="py-20 text-center">
                <Coins className="mx-auto text-gray-200 mb-4" size={64} />
                <p className="text-gray-400">No coin packs found. Create one above.</p>
            </div>
          )}

          {loading && (
            <div className="py-10 text-center text-gray-500">Loading packs...</div>
          )}
        </div>
      </div>
    </div>
  );
}