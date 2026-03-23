import { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  Phone, 
  Video, 
  Trash2, 
  Calendar, 
  Filter, 
  Clock, 
  IndianRupee, 
  BarChart3 
} from "lucide-react";

export default function CallManagement() {
  const [calls, setCalls] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [timeRange, setTimeRange] = useState(""); // Default to "All Time" (empty)

  const fetchCalls = async () => {
    try {
      const res = await api.get("/admin/calls", {
        params: {
          status: statusFilter,
          callType: typeFilter,
          timeRange: timeRange, // Pass duration filter to backend
        },
      });
      setCalls(res.data.calls);
    } catch (error) {
      console.error("Fetch Calls Error:", error);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [statusFilter, typeFilter, timeRange]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this call record?")) return;
    try {
      await api.delete(`/admin/calls/${id}`);
      fetchCalls();
    } catch (error) {
      alert("Failed to delete record");
    }
  };

  // Helper to calculate totals for the UI
  const totals = calls.reduce((acc, curr) => ({
    coins: acc.coins + (curr.totalCoinsSpent || 0),
    earnings: acc.earnings + (curr.hostEarningsInRupees || 0),
    revenue: acc.revenue + (curr.platformFeeInRupees || 0)
  }), { coins: 0, earnings: 0, revenue: 0 });

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <Phone className="text-indigo-600" />
              Call Management
            </h2>
            <p className="text-slate-500 mt-1">Monitor call logs, earnings, and platform performance.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
            <Calendar size={18} className="text-slate-400 ml-2" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="outline-none bg-transparent text-sm font-semibold text-slate-700 pr-4 cursor-pointer"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="2days">Last 2 Days</option>
              <option value="1week">Last 1 Week</option>
              <option value="1month">Last 1 Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Coins Spent</p>
              <h3 className="text-2xl font-bold text-slate-800">{totals.coins.toLocaleString()}</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <BarChart3 size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Host Earnings</p>
              <h3 className="text-2xl font-bold text-green-600">₹{totals.earnings.toFixed(2)}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <IndianRupee size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Platform Revenue</p>
              <h3 className="text-2xl font-bold text-indigo-600">₹{totals.revenue.toFixed(2)}</h3>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
              <Clock size={24} />
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="outline-none text-sm font-medium text-slate-600"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="rejected">Rejected</option>
              <option value="missed">Missed</option>
              <option value="failed">Failed</option>
              <option value="busy">Busy</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border shadow-sm">
            <Video size={16} className="text-slate-400" />
            <select
              onChange={(e) => setTypeFilter(e.target.value)}
              className="outline-none text-sm font-medium text-slate-600"
            >
              <option value="">All Types</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          
          <p className="text-xs text-slate-400 font-medium ml-auto">
            Showing {calls.length} records
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-center">User Details</th>
                  <th className="px-6 py-4">Type & Status</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-center">Coins</th>
                  <th className="px-6 py-4">Host Earned</th>
                  <th className="px-6 py-4">Platform Fee</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calls.map((call) => (
                  <tr key={call._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{call.callerId?.name || "N/A"}</span>
                        <span className="text-[10px] text-slate-400">Host: {call.hostId?.name || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold uppercase w-fit px-2 py-0.5 rounded ${call.callType === 'video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                          {call.callType}
                        </span>
                        <span className={`text-xs font-medium ${call.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                          ● {call.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {Math.floor(call.duration / 60)}m {call.duration % 60}s
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded font-bold">
                        {call.totalCoinsSpent}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₹{call.hostEarningsInRupees?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">
                      ₹{call.platformFeeInRupees?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(call.startedAt).toLocaleDateString()}<br/>
                      {new Date(call.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(call._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {calls.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium italic text-lg">No call records found for this period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}