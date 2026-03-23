import { useEffect, useState } from 'react';
import api from './api/axios';

// Import all sub-pages
import Overview from './components/Dashboard/Overview';
import UserManagement from './components/Dashboard/UserManagement';
import HostManagement from './components/Dashboard/Hostmanagement';
import CallManagement from './components/Dashboard/CallManagement';
import WalletTransactions from './components/Dashboard/WalletTransactions';
import Withdrawals from './components/Dashboard/Withdrawals';
import GiftsManagement from './components/Dashboard/GiftsManagement';
import RateManagement from './components/Dashboard/RateManagement';
import PurchaseCoinRate from './components/Dashboard/purchaseCoinRate';
import Revenue from './components/Dashboard/Revenue';
import Reports from './components/Dashboard/Reports';
// ✅ Import Video Call Management
import VideoCall from './components/Dashboard/video-call';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 1450, totalHosts: 230, onlineHosts: 45, activeCalls: 12,
    todayRevenue: 890, totalRevenue: 54200, commission: 12400, pendingPayouts: 15
  });

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(e => console.log("Fetch error:", e));
  }, []);

  const menuItems = [
    { id: 'Overview', icon: '📊' },
    { id: 'User Management', icon: '👤' },
    { id: 'Host Management', icon: '💃' },
    { id: 'Call Management', icon: '📞' },
    { id: 'Video Call Management', icon: '🎥' }, // ✅ Added to menu
    { id: 'Wallet & Transactions', icon: '💰' },
    { id: 'Withdrawals', icon: '🏦' },
    { id: 'Gifts Management', icon: '🎁' },
    { id: 'Rate Management', icon: '💎' },
    { id: 'Purchase Coin Rate', icon: '🪙' }, 
    { id: 'Revenue', icon: '💵' },
    { id: 'Reports', icon: '🚩' },
  ];

  // Logic to render the correct page component
  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview stats={stats} />;
      case 'User Management': return <UserManagement users={users} />;
      case 'Host Management': return <HostManagement />;
      case 'Call Management': return <CallManagement />;
      case 'Video Call Management': return <VideoCall />; // ✅ Added to render logic
      case 'Wallet & Transactions': return <WalletTransactions />;
      case 'Withdrawals': return <Withdrawals />;
      case 'Gifts Management': return <GiftsManagement />;
      case 'Rate Management': return <RateManagement />;
      case 'Revenue': return <Revenue />;
      case 'Purchase Coin Rate': return <PurchaseCoinRate />;
      case 'Reports': return <Reports />;
      default: return <Overview stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <div className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-8 text-2xl font-black border-b border-slate-800 text-center">
          <span className="text-pink-500">AETH</span> ADMIN
        </div>
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-8 py-4 text-sm font-medium transition-all ${
                activeTab === item.id 
                ? 'bg-pink-600 text-white border-r-4 border-white' 
                : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="text-xl mr-4">{item.icon}</span>
              {item.id}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="m-6 p-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold">
          Logout Session
        </button>
      </div>

      {/* HEADER & CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b h-20 flex justify-between items-center px-10 shadow-sm z-10">
          <h2 className="text-2xl font-extrabold text-slate-800">{activeTab}</h2>
          <div className="flex items-center space-x-4">
            <p className="text-xs text-green-500 font-mono flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Server: Stable
            </p>
            <div className="w-10 h-10 rounded-full bg-pink-500"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}