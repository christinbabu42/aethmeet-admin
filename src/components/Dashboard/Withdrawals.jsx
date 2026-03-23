import React, { useState, useEffect } from "react";
import api from "../../api/axios";

// UI ONLY – backend remains the source of truth for actual payouts
const DISPLAY_RATE = 0.62; 

export default function Withdrawal() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch pending withdrawals on mount
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get("/admin/withdraw/pending");
      setWithdrawals(res.data.pending || []);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (userId) => {
    if (!window.confirm("Are you sure you want to approve this withdrawal?")) return;
    try {
      await api.post(`/admin/withdraw/approve/${userId}`);
      alert("Approved: Withdrawal completed");
      fetchWithdrawals();
    } catch (err) {
      alert("Error approving withdrawal");
    }
  };

  // Logic for Approve All button
  const approveAll = async () => {
    if (withdrawals.length === 0) return;
    if (!window.confirm(`Are you sure you want to approve ALL ${withdrawals.length} pending requests?`)) return;

    setActionLoading(true);
    try {
      // Logic: Loops through all current IDs and approves them
      await Promise.all(withdrawals.map(item => api.post(`/admin/withdraw/approve/${item.userId}`)));
      alert("Success: All withdrawals have been approved.");
      fetchWithdrawals();
    } catch (err) {
      alert("Error during bulk approval. Some requests may have failed.");
      fetchWithdrawals();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* TOP HEADER SECTION */}
      <div style={styles.headerSection}>
        <div>
          <h2 style={styles.title}>Pending Withdrawals</h2>
          <p style={styles.subtitle}>You have {withdrawals.length} requests waiting for approval</p>
        </div>
        
        {withdrawals.length > 0 && (
          <button 
            onClick={approveAll} 
            disabled={actionLoading}
            style={{ 
              ...styles.approveAllBtn, 
              opacity: actionLoading ? 0.6 : 1 
            }}
          >
            {actionLoading ? "Processing..." : "Approve All Requests"}
          </button>
        )}
      </div>

      <hr style={styles.divider} />

      {/* MAIN CONTENT AREA */}
      {loading ? (
        <div style={styles.centerMessage}>
          <div style={styles.spinner}></div>
          <p>Fetching pending transactions...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
          <p style={{ fontWeight: "600", color: "#64748b" }}>All clear! No pending withdrawals.</p>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {withdrawals.map((item) => (
            <div key={item.userId} style={styles.card}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {item.userId.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p style={styles.userLabel}>USER REFERENCE</p>
                  <p style={styles.userIdText}>{item.userId}</p>
                </div>
              </div>
              
              <div style={styles.amountInfo}>
                <p style={styles.userLabel}>REQUESTED AMOUNT</p>
                <div style={styles.amountRow}>
                  <div style={styles.coinBadge}>
                    <span style={{ marginRight: "4px" }}>🪙</span>
                    <span style={styles.coinText}>{item.coins.toLocaleString()} Coins</span>
                  </div>
                  <div style={styles.rupeeValue}>
                    ₹ {(item.coins * DISPLAY_RATE).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => approve(item.userId)}
                style={styles.approveBtn}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#22c55e")}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// STYLES OBJECT
const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Inter', -apple-system, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    color: "#1e293b"
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "10px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    margin: 0,
    color: "#0f172a",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    margin: "5px 0 0 0",
    color: "#64748b",
    fontSize: "14px"
  },
  approveAllBtn: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)"
  },
  divider: {
    border: "0",
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "25px 0"
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flex: 1.5
  },
  avatar: {
    width: "40px",
    height: "40px",
    backgroundColor: "#f1f5f9",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#475569",
    fontSize: "12px",
    border: "1px solid #e2e8f0"
  },
  userLabel: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#94a3b8",
    margin: "0 0 4px 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  userIdText: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155"
  },
  amountInfo: {
    flex: 1.5
  },
  amountRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  coinBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    padding: "4px 12px",
    borderRadius: "20px"
  },
  coinText: {
    color: "#b45309",
    fontWeight: "700",
    fontSize: "14px"
  },
  rupeeValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    fontFamily: "monospace"
  },
  approveBtn: {
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  },
  emptyState: {
    textAlign: "center",
    padding: "60px",
    backgroundColor: "white",
    borderRadius: "16px",
    border: "2px dashed #e2e8f0"
  },
  centerMessage: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b"
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    margin: "0 auto 15px auto",
    animation: "spin 1s linear infinite"
  }
};