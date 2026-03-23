import { useEffect, useState } from "react";
import api from "../../api/axios";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const { data } = await api.get("/admin/reports");
      setReports(data.reports);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Reports Error:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/reports/${id}`, { status });
      fetchReports();
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await api.delete(`/admin/reports/${id}`);
      fetchReports();
    } catch (error) {
      console.error("Delete Report Error:", error);
    }
  };

  const suspendUser = async (userId) => {
    if (!userId) return alert("User ID not found");
    if (!window.confirm("Suspend this user?")) return;
    try {
      await api.patch(`/admin/reports/users/${userId}/suspend`);
      alert("User suspended successfully");
      fetchReports();
    } catch (error) {
      console.error("Suspend Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to suspend user");
    }
  };

  const banUser = async (userId) => {
    if (!userId) return alert("User ID not found");
    if (!window.confirm("Ban this user permanently?")) return;
    try {
      await api.patch(`/admin/reports/users/${userId}/ban`);
      alert("User banned permanently");
      fetchReports();
    } catch (error) {
      console.error("Ban Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to ban user");
    }
  };

  const activateUser = async (userId) => {
    if (!userId) return alert("User ID not found");
    if (!window.confirm("Reactivate this user?")) return;
    try {
      await api.patch(`/admin/reports/users/${userId}/reactivate`);
      alert("User reactivated successfully");
      fetchReports();
    } catch (error) {
      console.error("Reactivate Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to reactivate user");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const styles = {
    container: { padding: "30px", backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    header: { marginBottom: "25px", color: "#333", fontSize: "24px", fontWeight: "600" },
    table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 10px", marginTop: "10px" },
    th: { textAlign: "left", padding: "12px 15px", color: "#6c757d", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" },
    card: { backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
    td: { padding: "15px", verticalAlign: "middle", borderTop: "1px solid #eee" },
    badge: (status) => ({
      padding: "5px 12px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "bold",
      textTransform: "uppercase",
      backgroundColor: status === "resolved" ? "#d1e7dd" : status === "reviewed" ? "#fff3cd" : "#f8d7da",
      color: status === "resolved" ? "#0f5132" : status === "reviewed" ? "#856404" : "#842029",
    }),
    userStatusBadge: (status) => ({
      fontSize: "10px",
      padding: "2px 6px",
      borderRadius: "4px",
      marginLeft: "8px",
      textTransform: "uppercase",
      fontWeight: "bold",
      backgroundColor: status === "banned" ? "#000" : status === "suspended" ? "#ffc107" : "#198754",
      color: status === "suspended" ? "#000" : "#fff",
    }),
    btn: { padding: "8px 14px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "500", marginRight: "8px" },
    btnDelete: { backgroundColor: "#dc3545", color: "#fff" },
    btnSuspend: { backgroundColor: "#ffc107", color: "#000" },
    btnBan: { backgroundColor: "#000", color: "#fff" },
    btnActive: { backgroundColor: "#198754", color: "#fff" },
    empty: { textAlign: "center", padding: "50px", color: "#6c757d", backgroundColor: "#fff", borderRadius: "10px" }
  };

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading reports...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Reports Management</h2>

      {reports.length === 0 ? (
        <div style={styles.empty}>
          <p>No reports found in the system.</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Reporter</th>
              <th style={styles.th}>Reported User</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const userStatus = report.reportedUser?.actionstatus || "active";

              return (
                <tr key={report._id} style={styles.card}>
                  <td style={{ ...styles.td, borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
                    <div style={{ fontWeight: "600" }}>{report.reporter?.name || "N/A"}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{report.reporter?.email}</div>
                  </td>

                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ fontWeight: "600" }}>{report.reportedUser?.name || "N/A"}</div>
                      <span style={styles.userStatusBadge(userStatus)}>
                        {userStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{report.reportedUser?.email}</div>
                  </td>

<td style={{ ...styles.td, color: "#555", fontSize: "13px", maxWidth: "250px" }}>
  <div style={{ fontWeight: "500" }}>{report.reason}</div>

  {report.reason === "Other" && report.description && (
    <div
      style={{
        marginTop: "6px",
        fontSize: "12px",
        color: "#777",
        background: "#f1f3f5",
        padding: "6px 8px",
        borderRadius: "6px",
      }}
    >
      {report.description}
    </div>
  )}
</td>

                  <td style={styles.td}>
                    <span style={styles.badge(report.status)}>{report.status}</span>
                  </td>

                  <td style={{ ...styles.td, fontSize: "12px", color: "#666" }}>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>

                  <td style={{ ...styles.td, borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>

                      {userStatus === "banned" && (
                        <button
                          onClick={() => activateUser(report.reportedUser?._id)}
                          style={{ ...styles.btn, ...styles.btnActive }}
                        >
                          Unban
                        </button>
                      )}

                      {userStatus === "suspended" && (
                        <button
                          onClick={() => activateUser(report.reportedUser?._id)}
                          style={{ ...styles.btn, ...styles.btnActive }}
                        >
                          Unsuspend
                        </button>
                      )}

                      {userStatus === "active" && (
                        <>
                          <button
                            onClick={() => suspendUser(report.reportedUser?._id)}
                            style={{ ...styles.btn, ...styles.btnSuspend }}
                          >
                            Suspend
                          </button>

                          <button
                            onClick={() => banUser(report.reportedUser?._id)}
                            style={{ ...styles.btn, ...styles.btnBan }}
                          >
                            Ban
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => deleteReport(report._id)}
                        style={{ ...styles.btn, ...styles.btnDelete }}
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;