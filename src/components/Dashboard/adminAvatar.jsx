import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // ✅ Using your custom instance

// We keep this ONLY for displaying images, as the api instance handles the /api prefix for data
const IMAGE_BASE_URL = "https://api.aethmeet.com";

export default function AdminAvatar() {
  const [avatars, setAvatars] = useState([]);
  const [url, setUrl] = useState("");
  const [gender, setGender] = useState("boy");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      // ✅ Using api instance (automatically adds /api and headers)
      const res = await api.get("/admin/avatar");
      setAvatars(res.data.avatars || []);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return alert("Please enter an image URL");

    setLoading(true);
    try {
      if (editingId) {
        // ✅ Using api instance for PUT
        await api.put(`/admin/avatar/${editingId}`, { url, gender });
        alert("Avatar Updated Successfully");
      } else {
        // ✅ Using api instance for POST
        await api.post("/admin/avatar", { url, gender });
        alert("Avatar Added Successfully");
      }
      setUrl("");
      setEditingId(null);
      fetchAvatars();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Action failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this avatar?")) return;
    try {
      // ✅ Using api instance for DELETE
      await api.delete(`/admin/avatar/${id}`);
      fetchAvatars();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const editAvatar = (item) => {
    setUrl(item.url);
    setGender(item.gender);
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Avatar Management</h2>

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Path/URL</label>
            <input
              type="text"
              placeholder="/public/avathar-boy/1.jpeg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender Category</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setGender("boy")}
                className={`flex-1 p-3 rounded-lg border transition-all ${
                  gender === "boy" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Boy
              </button>
              <button
                type="button"
                onClick={() => setGender("girl")}
                className={`flex-1 p-3 rounded-lg border transition-all ${
                  gender === "girl" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Girl
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-pink-600 hover:bg-pink-700"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Processing..." : editingId ? "Update Avatar" : "Add New Avatar"}
        </button>
        
        {editingId && (
          <button 
            type="button" 
            onClick={() => {setEditingId(null); setUrl("");}}
            className="w-full mt-2 text-sm text-gray-500 hover:underline"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* GRID LIST SECTION */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {avatars.map((item) => (
          <div key={item._id} className="group relative bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-pink-200 hover:shadow-md transition-all text-center">
            <img
              src={`${IMAGE_BASE_URL}${item.url}`}
              alt="avatar"
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-white shadow-sm"
              onError={(e) => { e.target.src = "https://via.placeholder.com/80"; }}
            />
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${item.gender === 'girl' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
              {item.gender}
            </span>

            <div className="flex justify-center space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => editAvatar(item)} className="text-blue-600 text-sm font-semibold hover:text-blue-800">Edit</button>
              <button onClick={() => deleteAvatar(item._id)} className="text-red-500 text-sm font-semibold hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}