import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

// 1️⃣ Role Priority Map (Lower number = Higher position)
const ROLE_PRIORITY = {
  superadmin: 0,
  admin: 1,
  finance: 2,
  support: 3,
  host: 4,
  user: 5,
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, data) => {
    try {
      const res = await api.put(`/admin/users/${userId}/action`, data);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...res.data.user } : u));
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("ARE YOU SURE? This will permanently delete this user and their wallet data!")) return;
    
    try {
      await api.delete(`/admin/user/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      alert("User deleted successfully.");
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  // 2️⃣ Combined Search & Role-Based Sorting
  const filteredUsers = users
    .filter(u => 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by priority map
      const priorityA = ROLE_PRIORITY[a.role] ?? 99;
      const priorityB = ROLE_PRIORITY[b.role] ?? 99;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // Secondary sort: newest users first within the same role
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) return <div className="p-10 text-center font-bold">Loading Users...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between mb-6">
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="border rounded-lg px-4 py-2 w-1/3 focus:ring-2 focus:ring-pink-500 outline-none" 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-gray-600 font-semibold text-sm uppercase">User</th>
              <th className="p-4 text-gray-600 font-semibold text-sm uppercase">Role</th>
              <th className="p-4 text-gray-600 font-semibold text-sm uppercase">Balance</th>
              <th className="p-4 text-gray-600 font-semibold text-sm uppercase">Status</th>
              <th className="p-4 text-right text-gray-600 font-semibold text-sm uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map((u) => (
              <tr 
                key={u._id} 
                className={`hover:bg-gray-50 transition-colors ${u.role === 'superadmin' ? 'bg-yellow-50/50' : ''}`}
              >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-gray-800">
                    {u.name || 'N/A'}
                  </div>

                  {u.role === 'superadmin' && (
                    <span className="px-2 py-0.5 text-[10px] bg-yellow-200 text-yellow-800 rounded-full font-bold uppercase">
                      Super
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500">{u.email}</div>

                {/* ✅ PUBLIC ID */}
              <div className="text-[11px] bg-gray-100 inline-flex items-center gap-2 px-2 py-0.5 rounded font-mono text-gray-600 mt-1">
                {u.publicId}
                <button
                  onClick={() => navigator.clipboard.writeText(u.publicId)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Copy
                </button>
              </div>
              </td>
                <td className="p-4">
                  <select
                    value={u.role}
                    disabled={u.role === "superadmin"}
                    onChange={(e) => handleAction(u._id, { role: e.target.value })}
                    className={`border rounded p-1 text-sm bg-white ${
                      u.role === "superadmin" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="host">Host</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="support">Support</option>
                    <option value="finance">Finance</option>
                  </select>
                </td>
                <td className="p-4 text-blue-600 font-mono font-semibold">
                  {u.coins?.toLocaleString() || 0} 🪙
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.actionstatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.actionstatus || 'active'}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    disabled={u.role === "superadmin"}
                    onClick={() =>
                      handleAction(u._id, {
                        actionstatus: u.actionstatus === "banned" ? "active" : "banned",
                      })
                    }
                    className={`text-xs font-bold px-3 py-1 rounded border ${
                      u.role === "superadmin"
                        ? "opacity-40 cursor-not-allowed"
                        : u.actionstatus === "banned"
                        ? "border-green-600 text-green-600"
                        : "border-orange-600 text-orange-600"
                    }`}
                  >
                    {u.actionstatus === "banned" ? "Unban" : "Ban"}
                  </button>
                                  
                  <button
                    disabled={u.role === "superadmin"}
                    onClick={() => handleDelete(u._id)}
                    className={`text-xs font-bold px-3 py-1 rounded border transition-all ${
                      u.role === "superadmin"
                        ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-red-600 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}