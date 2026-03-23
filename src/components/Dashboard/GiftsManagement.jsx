import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function GiftManagement() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", image: "" });

const loadGifts = async () => {
  try {
    setLoading(true);
    const res = await api.get("/admin/gifts");
    if (res.data.success) {
      setGifts(res.data.data);
    }
  } catch (err) {
    console.error("Gift fetch failed:", err.response?.data);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadGifts();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Please fill details");
    try {
      if (editingId) {
        await api.put(`/admin/gifts/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/admin/gifts", form);
      }
      setForm({ name: "", price: "", image: "" });
      loadGifts();
    } catch (err) {
      alert("Operation failed");
    }
  };

  const deleteGift = async (id) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this gift?")) return;
    try {
      await api.delete(`/admin/gifts/${id}`);
      loadGifts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const startEdit = (gift) => {
    setEditingId(gift._id);
    setForm({ name: gift.name, price: gift.price, image: gift.image || "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", price: "", image: "" });
  };

  const toggleActive = async (gift) => {
    try {
      await api.put(`/admin/gifts/${gift._id}`, { active: !gift.active });
      loadGifts();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">🎁 Gift Store Management</h2>
          <p className="text-gray-500">Add and manage rewards for your users</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold">
          Total Gifts: {gifts.length}
        </div>
      </div>

      {/* Form Section */}
      <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 mb-10 transition-all ${editingId ? 'border-orange-400 ring-4 ring-orange-50' : 'border-gray-100'}`}>
        <h3 className="text-lg font-bold text-gray-700 mb-4">{editingId ? "⚡ Edit Gift" : "Create New Gift"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Gift Name</label>
            <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Price (Coins)</label>
            <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Image Name</label>
            <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className={`flex-1 font-bold py-2.5 rounded-xl transition-all shadow-lg active:scale-95 ${editingId ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'} text-white`}>
              {editingId ? "Update Gift" : "Add Gift"}
            </button>
            {editingId && <button onClick={cancelEdit} className="px-4 py-2.5 bg-gray-200 rounded-xl font-bold text-gray-600">Cancel</button>}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Preview</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Gift Name</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {gifts.map((gift) => (
              <tr key={gift._id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner">
                    {/* Fixed Image Logic: No more broken via.placeholder links */}
                    {gift.image ? (
                      <img 
                        src={`http://localhost:5000/public/gifts/${gift.image}`} 
                        alt="" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.parentElement.innerHTML = '<span class="text-xl">🎁</span>';
                        }}
                      />
                    ) : (
                      <span className="text-xl">🎁</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{gift.name}</td>
                <td className="px-6 py-4 font-black text-orange-600">🪙 {gift.price}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => startEdit(gift)} className="text-indigo-600 font-bold text-sm hover:underline">Edit</button>
                    <button onClick={() => toggleActive(gift)} className={`text-xs font-bold px-3 py-1 rounded border transition-all ${gift.active ? "text-red-500 border-red-200 hover:bg-red-50" : "text-green-500 border-green-200 hover:bg-green-50"}`}>
                      {gift.active ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => deleteGift(gift._id)} className="text-gray-300 hover:text-red-600 transition-colors px-2 text-lg" title="Delete Permanent">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}