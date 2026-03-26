import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Withdrawal() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rate, setRate] = useState(0);

  // Fetch withdrawals on mount
  useEffect(() => {
    fetchWithdrawals();

    api.get("/api/config").then(res => {
      setRate(res.data.hostCoinValue); // ✅ from DB
    });
  }, []);

  const fetchWithdrawals = async () => {
    try {
      // Backend returns both "pending" and "processing" statuses
      const res = await api.get("/admin/withdraw/pending");
      setWithdrawals(res.data.pending || []);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unified handler for Approve, Complete (Mark Paid), and Reject
   * FIXED: Now uses withdrawalId to target specific transaction
   */
  const handleAction = async (endpoint, withdrawalId, msg) => {
    if (!window.confirm(msg)) return;
    try {
      await api.post(`/admin/withdraw/${endpoint}/${withdrawalId}`);
      alert(`Success: ${endpoint} action completed.`);
      fetchWithdrawals();
    } catch (err) {
      console.error(`Error during ${endpoint}:`, err);
      alert(`Action failed: ${err.response?.data?.message || "Server Error"}`);
    }
  };

  /**
   * Logic for Approve All button (Moves all PENDING to PROCESSING)
   * FIXED: Uses item.withdrawalId for specific targeting
   */
  const approveAll = async () => {
    const onlyPending = withdrawals.filter(w => w.status === "pending");
    if (onlyPending.length === 0) return;
    if (!window.confirm(`Move ALL ${onlyPending.length} pending requests to processing?`)) return;

    setActionLoading(true);
    try {
      await Promise.all(
        onlyPending.map(item => 
          api.post(`/admin/withdraw/approve/${item.withdrawalId}`)
        )
      );
      alert("Success: All selected requests moved to processing.");
      fetchWithdrawals();
    } catch (err) {
      console.error("Bulk approval error:", err);
      alert("Error during bulk approval.");
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
          <h2 style={styles.title}>Withdrawal Management</h2>
          <p style={styles.subtitle}>Manage payouts: {withdrawals.length} active requests</p>
        </div>
        
        {withdrawals.filter(w => w.status === "pending").length > 0 && (
          <button 
            onClick={approveAll} 
            disabled={actionLoading}
            style={{ 
              ...styles.approveAllBtn, 
              opacity: actionLoading ? 0.6 : 1 
            }}
          >
            {actionLoading ? "Processing..." : "Approve All Pending"}
          </button>
        )}
      </div>

      <hr style={styles.divider} />

      {/* MAIN CONTENT AREA */}
      {loading ? (
        <div style={styles.centerMessage}>
          <div style={styles.spinner}></div>
          <p>Fetching active transactions...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
          <p style={{ fontWeight: "600", color: "#64748b" }}>All clear! No pending or processing withdrawals.</p>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {withdrawals.map((item) => (
            <div key={item.withdrawalId} style={styles.card}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {item.name ? item.name.substring(0, 2).toUpperCase() : "UR"}
                </div>
                <div>
                  <p style={styles.userLabel}>USER INFO</p>
                  <p style={styles.userIdText}>{item.name || "N/A"}</p>
                  
                  {/* Status Badge */}
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: item.status === "processing" ? "#fef3c7" : "#f1f5f9",
                    color: item.status === "processing" ? "#92400e" : "#475569"
                  }}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div style={styles.payoutDetails}>
                <p style={styles.userLabel}>PAYMENT INFO</p>
                <div style={styles.paymentInfoBox}>
                  {item.upiId && <p style={styles.paymentText}><strong>UPI:</strong> {item.upiId}</p>}
                  
                  {item.bankDetails?.accountNumber && (
                    <div style={styles.bankBox}>
                      <p style={styles.paymentText}><strong>A/C:</strong> {item.bankDetails.accountNumber}</p>
                      <p style={styles.paymentText}><strong>IFSC:</strong> {item.bankDetails.ifsc}</p>
                    </div>
                  )}

                  {item.paypalEmail && <p style={styles.paymentText}><strong>PayPal:</strong> {item.paypalEmail}</p>}
                  {!item.upiId && !item.bankDetails?.accountNumber && !item.paypalEmail && <p style={styles.paymentText}>No info</p>}
                </div>
              </div>

              <div style={styles.amountInfo}>
                <p style={styles.userLabel}>AMOUNT</p>
                <div style={styles.amountRow}>
                  <div style={styles.coinBadge}>
                    <span style={styles.coinText}>🪙 {item.coins.toLocaleString()}</span>
                  </div>
                  <div style={styles.rupeeValue}>
                    ₹ {Number(item.rupees).toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div style={styles.buttonGroup}>
                {/* FIXED: All button callbacks now pass item.withdrawalId */}
                {item.status === "pending" && (
                  <button 
                    onClick={() => handleAction('approve', item.withdrawalId, "Move this to processing for manual payout?")}
                    style={styles.approveBtn}
                  >
                    ✅ Approve
                  </button>
                )}

                {item.status === "processing" && (
                  <button 
                    onClick={() => handleAction('complete', item.withdrawalId, "Have you successfully sent the payment? This will mark it as completed.")}
                    style={styles.paidBtn}
                  >
                    💸 Mark Paid
                  </button>
                )}

                <button 
                  onClick={() => handleAction('reject', item.withdrawalId, "Reject and refund coins to user?")}
                  style={styles.rejectBtn}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// STYLES OBJECT
const styles = {
  container: { padding: "40px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" },
  headerSection: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "10px" },
  title: { fontSize: "28px", fontWeight: "800", margin: 0, color: "#0f172a" },
  subtitle: { color: "#64748b", fontSize: "14px", margin: "5px 0 0 0" },
  approveAllBtn: { backgroundColor: "#4f46e5", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  divider: { border: "0", height: "1px", backgroundColor: "#e2e8f0", margin: "25px 0" },
  listContainer: { display: "flex", flexDirection: "column", gap: "12px" },
  card: { backgroundColor: "white", border: "1px solid #e2e8f0", padding: "20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  userInfo: { display: "flex", alignItems: "center", gap: "15px", flex: 1 },
  avatar: { width: "40px", height: "40px", backgroundColor: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" },
  userLabel: { fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" },
  userIdText: { margin: 0, fontSize: "14px", fontWeight: "600" },
  statusBadge: { padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "800", marginTop: "4px", display: "inline-block" },
  payoutDetails: { flex: 1.5, padding: "0 15px", borderLeft: "1px solid #f1f5f9", borderRight: "1px solid #f1f5f9" },
  paymentText: { fontSize: "12px", margin: "2px 0", color: "#475569" },
  amountInfo: { flex: 0.8, paddingLeft: "20px" },
  rupeeValue: { fontSize: "18px", fontWeight: "800", color: "#059669" },
  coinText: { color: "#b45309", fontWeight: "700", fontSize: "12px" },
  buttonGroup: { display: "flex", gap: "8px" },
  approveBtn: { backgroundColor: "#22c55e", color: "white", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  paidBtn: { backgroundColor: "#4f46e5", color: "white", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  rejectBtn: { backgroundColor: "#ef4444", color: "white", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  spinner: { width: "30px", height: "30px", border: "3px solid #e2e8f0", borderTop: "3px solid #4f46e5", borderRadius: "50%", margin: "0 auto 15px auto", animation: "spin 1s linear infinite" }
};