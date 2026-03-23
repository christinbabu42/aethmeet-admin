import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function HostManagement() {
  const [hosts, setHosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await api.get('/admin/users');
        // Logic: Extract array from the 'data' property of the response object
        const allUsers = res.data.data || [];
        
        // Logic: Apply categorical filter before setting master state
        const femaleHosts = allUsers.filter(u => u.role === 'host' || u.gender === 'female');
        setHosts(femaleHosts);
      } catch (err) {
        console.error("Error fetching hosts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHosts();
  }, []);

  // Logic: Derived state filtering for the search bar
  const filteredHosts = hosts.filter(host => 
    host.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host._id.includes(searchTerm)
  );

  const toggleVerification = async (hostId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.put(`/admin/users/${hostId}/action`, { isVerified: newStatus });
      
      // Update local state so UI reflects change immediately
      setHosts(hosts.map(h => h._id === hostId ? { ...h, isVerified: newStatus } : h));
      alert(`Host ${newStatus ? 'Verified' : 'Unverified'}!`);
    } catch (err) {
      alert("Failed to update verification status.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Full ID copied!");
  };

  if (loading) return <div className="p-10 text-center font-bold text-pink-600">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-pink-600">💃 Host Management</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg outline-none w-64"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Host Details</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHosts.map((host) => (
              <tr key={host._id} className="border-b hover:bg-pink-50/30">
                <td className="p-4 flex items-center gap-3">
                  <img src={host.profilePic || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full" alt=""/>
                  <div>
                    <div className="font-bold">{host.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      ID: {host.publicId || "N/A"}
                      <button
                        onClick={() => copyToClipboard(host.publicId)}
                        className="hover:scale-110 transition"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-green-600 font-bold">{host.coins?.toLocaleString()}</td>
                <td className="p-4">
                    {host.status === "online" && "🟢 Online"}
                    {host.status === "offline" && "⚪ Offline"}
                    {host.status === "live" && "🔴 Live"}
                    {host.status === "busy" && "🟡 Busy"}
                  </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleVerification(host._id, host.isVerified)}
                    className={`px-3 py-1 rounded text-xs font-bold ${host.isVerified ? 'bg-gray-200' : 'bg-pink-600 text-white'}`}
                  >
                    {host.isVerified ? 'Revoke' : 'Approve'}
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