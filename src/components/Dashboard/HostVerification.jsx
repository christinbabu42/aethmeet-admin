
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const STATUS_OPTIONS = [
  { label: "Waiting", value: "waiting" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
];

export default function HostVerification() {
  const [hosts, setHosts] = useState([]);
  const [status, setStatus] = useState("waiting");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchHosts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/host-verifications", {
        params: { status },
      });

      setHosts(res.data?.data || []);
    } catch (err) {
      console.error("Host verification fetch error:", err);
      setError(
        err.response?.data?.message ||
        "Could not load host verification requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, [status]);

  const filteredHosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return hosts;

    return hosts.filter((host) =>
      [
        host.name,
        host.email,
        host.publicId,
        host._id,
      ].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [hosts, search]);

  const updateVerification = async (host, newStatus) => {
    const action = newStatus === "verified" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${host.name || "this host"}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(host._id);
      setError("");

      await api.patch(
        `/admin/host-verifications/${host._id}`,
        { status: newStatus }
      );

      // Remove the updated host from the current status tab.
      setHosts((previous) =>
        previous.filter((item) => item._id !== host._id)
      );

      alert(
        newStatus === "verified"
          ? "Host approved successfully."
          : "Host rejected successfully."
      );
    } catch (err) {
      console.error("Verification update error:", err);

      alert(
        err.response?.data?.message ||
        "Could not update verification status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const copyId = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      alert("ID copied.");
    } catch {
      alert("Could not copy ID.");
    }
  };

  const statusStyle = (value) => {
    if (value === "verified") {
      return "bg-green-100 text-green-700";
    }

    if (value === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Host Verification
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review and approve or reject host accounts.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or ID..."
          className="w-full md:w-80 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((item) => (
          <button
            key={item.value}
            onClick={() => setStatus(item.value)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              status === item.value
                ? "bg-pink-600 text-white"
                : "bg-white border text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-pink-600 font-semibold">
            Loading host requests...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchHosts}
              className="px-5 py-2 rounded-lg bg-pink-600 text-white font-semibold"
            >
              Retry
            </button>
          </div>
        ) : filteredHosts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No {status} host verification requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-sm font-semibold text-slate-600">
                    Host
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600">
                    Public ID
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600">
                    MongoDB ID
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="p-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredHosts.map((host) => (
                  <tr
                    key={host._id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3 min-w-44">
                        <img
                          src={
                            host.profilePic ||
                            "https://placehold.co/44x44?text=User"
                          }
                          alt=""
                          className="w-11 h-11 rounded-full object-cover bg-slate-100"
                        />
                        <span className="font-semibold text-slate-800">
                          {host.name || "Unnamed user"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {host.email || "N/A"}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => copyId(host.publicId)}
                        className="text-sm text-indigo-600 hover:underline"
                        title="Copy public ID"
                      >
                        {host.publicId || "N/A"} 📋
                      </button>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => copyId(host._id)}
                        className="text-xs text-slate-500 hover:text-indigo-600"
                        title="Copy MongoDB ID"
                      >
                        {host._id} 📋
                      </button>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyle(
                          host.hostVerificationStatus
                        )}`}
                      >
                        {host.hostVerificationStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {status === "waiting" && (
                          <>
                            <button
                              disabled={updatingId === host._id}
                              onClick={() =>
                                updateVerification(host, "verified")
                              }
                              className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold disabled:opacity-50"
                            >
                              {updatingId === host._id
                                ? "Updating..."
                                : "Approve"}
                            </button>

                            <button
                              disabled={updatingId === host._id}
                              onClick={() =>
                                updateVerification(host, "rejected")
                              }
                              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {status !== "waiting" && (
                          <span className="text-xs text-slate-400">
                            No action
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Showing {filteredHosts.length} {status} request(s).
      </p>
    </div>
  );
}
