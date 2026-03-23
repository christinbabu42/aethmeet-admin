import React, { useEffect, useState } from "react";
import { 
  LucideVideo, 
  LucideUsers, 
  LucideCoins, 
  LucideXCircle, 
  LucideTrophy, 
  LucideEye, 
  LucideClock,
  LucideTag,
  LucideTrash2,
  LucideFilter,
  LucideChevronRight,
  LucideX
} from "lucide-react";
import api from "../../api/axios";

const VideoCallAdmin = () => {
  const [allStreams, setAllStreams] = useState([]); 
  const [filteredStreams, setFilteredStreams] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState("today");
  const [showModal, setShowModal] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchStreams();
    const timer = setInterval(() => setNow(new Date()), 1000); // For live duration updates
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    applyFilter();
  }, [duration, allStreams]);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/video/all-streams");
      setAllStreams(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load streams.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    const today = new Date();
    let filtered = allStreams.filter((stream) => {
      const streamDate = new Date(stream.startedAt);
      const diffTime = Math.abs(today - streamDate);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (duration === "today") return streamDate.toDateString() === today.toDateString();
      if (duration === "2days") return diffDays <= 2;
      if (duration === "1week") return diffDays <= 7;
      if (duration === "1month") return diffDays <= 30;
      if (duration === "6months") return diffDays <= 180;
      if (duration === "1year") return diffDays <= 365;
      return true;
    });
    setFilteredStreams(filtered);
  };

  // --- Helper Functions ---
  const formatDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : now;
    const diff = Math.floor((endTime - startTime) / 1000);
    
    if (diff < 0) return "0s";
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h > 0 ? h + "h " : ""}${m}m ${s}s`;
  };

  const getTotalEarnings = () => filteredStreams.reduce((acc, curr) => acc + (curr.totalCoinsEarned || 0), 0);

  const getUniqueHosts = () => {
    const hosts = {};
    filteredStreams.forEach(s => {
      const id = s.hostId?._id;
      if (id) {
        if (!hosts[id]) {
          hosts[id] = { 
            name: s.hostId.name, 
            profile: s.hostId.profilePic, 
            count: 0, 
            totalTime: 0 
          };
        }
        hosts[id].count += 1;
        const end = s.endedAt ? new Date(s.endedAt) : now;
        hosts[id].totalTime += (end - new Date(s.startedAt));
      }
    });
    return Object.values(hosts);
  };

  const handleEndStream = async (id) => {
    if (!window.confirm("Force end this live stream?")) return;
    try {
      await api.patch(`/admin/video/end-stream/${id}`);
      fetchStreams(); 
    } catch (err) {
      alert("Error ending stream.");
    }
  };

  const handleDeleteAllFiltered = async () => {
    const count = filteredStreams.length;
    if (count === 0) return alert("No streams to delete.");
    if (window.confirm(`Delete all ${count} streams for "${duration}"?`)) {
      try {
        const idsToDelete = filteredStreams.map(s => s._id);
        await api.post("/admin/video/bulk-delete", { ids: idsToDelete });
        alert("Deleted successfully.");
        fetchStreams();
      } catch (err) {
        alert("Bulk delete failed.");
      }
    }
  };

  if (loading) return <div style={styles.center}>Loading Live Data...</div>;

  return (
    <div style={styles.container}>
      {/* --- Top Summary Bar --- */}
      <div style={styles.summaryBar}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Total Earnings</span>
          <span style={styles.summaryValue}><LucideCoins size={20} color="#EAB308"/> {getTotalEarnings()}</span>
        </div>
        <div style={styles.summaryCard} onClick={() => setShowModal(true)} className="cursor-pointer hover:bg-gray-50">
          <span style={styles.summaryLabel}>Unique Active Hosts (Click to view)</span>
          <span style={styles.summaryValue}><LucideUsers size={20} color="#3B82F6"/> {getUniqueHosts().length}</span>
        </div>
      </div>

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Live Stream Monitor</h2>
          <p style={styles.subtitle}>Showing {filteredStreams.length} results for <b>{duration}</b></p>
        </div>
        
        <div style={styles.controls}>
          <div style={styles.filterWrapper}>
            <LucideFilter size={16} style={styles.filterIcon} />
            <select value={duration} onChange={(e) => setDuration(e.target.value)} style={styles.dropdown}>
              <option value="today">Today</option>
              <option value="2days">Last 2 Days</option>
              <option value="1week">1 Week</option>
              <option value="1month">1 Month</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button onClick={handleDeleteAllFiltered} style={styles.bulkDeleteBtn}><LucideTrash2 size={18} /> Delete View</button>
          <button onClick={fetchStreams} style={styles.refreshBtn}>Refresh</button>
        </div>
      </div>

      <div style={styles.grid}>
        {filteredStreams.map((stream) => (
          <div key={stream._id} style={styles.card}>
            <div style={styles.statusBadge(stream.status)}>{stream.status.toUpperCase()}</div>
            <img src={stream.coverImage || "https://via.placeholder.com/300x150"} style={styles.cover} alt="Stream Cover" />

            <div style={styles.infoSection}>
              <div style={styles.hostRow}>
                <img src={stream.hostId?.profilePic} style={styles.avatar} alt="host" />
                <div style={{ flex: 1 }}>
                  <p style={styles.hostName}>{stream.hostId?.name || "Deleted User"}</p>
                  <p style={styles.streamTitle}>{stream.title || "Untitled Stream"}</p>
                </div>
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <LucideUsers size={16} color="#3B82F6" />
                  <div style={styles.statColumn}>
                    <span style={styles.statLabel}>Current</span>
                    <span style={styles.statValue}>{stream.currentViewers}</span>
                  </div>
                </div>
                <div style={styles.statItem}>
                  <LucideClock size={16} color="#8b5cf6" />
                  <div style={styles.statColumn}>
                    <span style={styles.statLabel}>Duration</span>
                    <span style={styles.statValue}>{formatDuration(stream.startedAt, stream.endedAt)}</span>
                  </div>
                </div>
              </div>

              <div style={styles.metricsBox}>
                <div style={styles.metricRow}>
                  <span style={styles.metricLabel}><LucideCoins size={12}/> Earnings:</span>
                  <span style={styles.metricValue}>{stream.totalCoinsEarned}</span>
                </div>
                <div style={styles.metricRow}>
                  <span style={styles.metricLabel}><LucideTrophy size={12}/> Gifts:</span>
                  <span style={styles.metricValue}>{stream.totalGiftsReceived}</span>
                </div>
              </div>

              {stream.status === 'streaming' ? (
                <button onClick={() => handleEndStream(stream._id)} style={styles.endBtn}>
                  <LucideXCircle size={16} style={{marginRight: 8}} /> Terminate
                </button>
              ) : (
                <div style={styles.endedInfo}>Ended: {new Date(stream.endedAt).toLocaleString()}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- Host Details Modal --- */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{margin:0}}>Hosts Active in {duration}</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}><LucideX/></button>
            </div>
            <div style={styles.modalBody}>
              {getUniqueHosts().map((h, i) => (
                <div key={i} style={styles.hostListItem}>
                  <img src={h.profile} style={styles.miniAvatar} />
                  <div style={{flex:1}}>
                    <p style={{margin:0, fontWeight:'bold'}}>{h.name}</p>
                    <p style={{margin:0, fontSize:'12px', color:'#666'}}>{h.count} streams this period</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{margin:0, fontSize:'13px', fontWeight:'bold'}}>Total Time</p>
                    <p style={{margin:0, fontSize:'12px'}}>{(h.totalTime/60000).toFixed(1)} mins</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", backgroundColor: "#f4f7f6", minHeight: "100vh" },
  center: { display: "flex", justifyContent: "center", padding: "50px", fontSize: "18px" },
  summaryBar: { display: 'flex', gap: '20px', marginBottom: '20px' },
  summaryCard: { flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '5px', cursor: 'pointer' },
  summaryLabel: { fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
  summaryValue: { fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' },
  header: { display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: "30px", flexWrap: 'wrap', gap: '15px' },
  title: { fontSize: "24px", fontWeight: "bold", margin: 0 },
  subtitle: { margin: 0, fontSize: '14px', color: '#64748b' },
  controls: { display: 'flex', gap: '12px', alignItems: 'center' },
  filterWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  filterIcon: { position: 'absolute', left: '10px', color: '#64748b', pointerEvents: 'none' },
  dropdown: { padding: "10px 10px 10px 35px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer", fontWeight: '600' },
  bulkDeleteBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: "10px 16px", backgroundColor: "#be123c", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 'bold' },
  refreshBtn: { padding: "10px 16px", backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 'bold' },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" },
  card: { backgroundColor: "#fff", borderRadius: "15px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", position: "relative" },
  cover: { width: "100%", height: "160px", objectFit: "cover", backgroundColor: "#000" },
  statusBadge: (status) => ({ position: "absolute", top: "12px", right: "12px", backgroundColor: status === 'streaming' ? "#22c55e" : "#64748b", color: "#fff", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", zIndex: 1 }),
  infoSection: { padding: "18px" },
  hostRow: { display: "flex", alignItems: "center", marginBottom: "15px" },
  avatar: { width: "45px", height: "45px", borderRadius: "12px", marginRight: "12px", objectFit: 'cover' },
  hostName: { fontWeight: "800", margin: 0, fontSize: "15px" },
  streamTitle: { fontSize: "13px", color: "#64748b", margin: 0 },
  statsGrid: { display: "flex", justifyContent: "space-between", paddingBottom: "15px", borderBottom: "1px solid #f1f5f9" },
  statItem: { display: "flex", alignItems: "center", gap: "10px" },
  statColumn: { display: 'flex', flexDirection: 'column' },
  statLabel: { fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' },
  statValue: { fontSize: '14px', fontWeight: '800' },
  metricsBox: { backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
  metricRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px' },
  metricLabel: { color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' },
  metricValue: { fontWeight: '700' },
  endBtn: { width: "100%", marginTop: "15px", padding: "10px", backgroundColor: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: 'center' },
  endedInfo: { textAlign: 'center', marginTop: '15px', fontSize: '11px', color: '#94a3b8' },
  modalOverlay: { position: 'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
  modalContent: { backgroundColor:'#fff', width:'500px', borderRadius:'15px', padding:'25px', maxHeight:'80vh', display:'flex', flexDirection:'column' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #eee', paddingBottom:'15px' },
  modalBody: { overflowY:'auto', paddingTop:'15px' },
  hostListItem: { display:'flex', alignItems:'center', padding:'10px', borderBottom:'1px solid #f9f9f9', gap:'15px' },
  miniAvatar: { width:'40px', height:'40px', borderRadius:'50%' },
  closeBtn: { background:'none', border:'none', cursor:'pointer' }
};

export default VideoCallAdmin;