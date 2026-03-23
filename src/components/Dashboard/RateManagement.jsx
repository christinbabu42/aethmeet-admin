import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { Settings, Save, RefreshCcw, Info, CheckCircle, AlertCircle, TrendingUp, Gift } from 'lucide-react';

const RateManagement = () => {
  const [config, setConfig] = useState({
    userCoinValue: 0,
    hostCoinValue: 0,
    platformCommissionRate: 0,
    giftCommissionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/rate-config');
      
      setConfig({
        userCoinValue: response.data.userCoinValue || 1.0,
        hostCoinValue: response.data.hostCoinValue || 0.42,
        platformCommissionRate: response.data.platformCommissionRate || 0.15,
        giftCommissionRate: response.data.giftCommissionRate || 0.2,
      });
      setLoading(false);
    } catch (err) {
      showStatus('error', 'Failed to fetch configuration from server');
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation for both rates
    if (config.platformCommissionRate > 1 || config.platformCommissionRate < 0 || 
        config.giftCommissionRate > 1 || config.giftCommissionRate < 0) {
      showStatus('error', 'Commission rates must be between 0 and 1 (e.g., 0.15)');
      return;
    }

    setUpdating(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.put('/admin/rate-config', config);
      
      if (response.data.success) {
        showStatus('success', 'Rates updated successfully!');
        if(response.data.config) {
            setConfig({
                userCoinValue: response.data.config.userCoinValue,
                hostCoinValue: response.data.config.hostCoinValue,
                platformCommissionRate: response.data.config.platformCommissionRate,
                giftCommissionRate: response.data.config.giftCommissionRate
            });
        }
      }
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 4000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 min-h-[400px]">
        <RefreshCcw className="animate-spin text-blue-500 mr-2" />
        <span className="text-gray-600 font-medium">Connecting to API...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 mt-10">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center gap-2">
          <Settings className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Rate & Commission Control</h2>
        </div>
        <button 
          onClick={fetchConfig}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all hover:rotate-180"
          title="Refresh Data"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* User Coin Value */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            User Purchase Value (₹)
            <span className="group relative">
              <Info size={14} className="text-gray-400 cursor-help" />
              <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded w-56 -top-12 left-6 z-10 shadow-xl">
                What the platform charges the user for 1 coin (Selling Price).
              </div>
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={config.userCoinValue}
              onChange={(e) => setConfig({ ...config, userCoinValue: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
              required
            />
            <span className="absolute right-4 top-3 text-gray-400 font-medium">INR</span>
          </div>
        </div>

        {/* Host Coin Value */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            Host Payout Value (₹)
            <span className="group relative">
              <Info size={14} className="text-gray-400 cursor-help" />
              <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded w-56 -top-12 left-6 z-10 shadow-xl">
                The cash value of 1 coin when paid out to the Host.
              </div>
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={config.hostCoinValue}
              onChange={(e) => setConfig({ ...config, hostCoinValue: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
              required
            />
            <span className="absolute right-4 top-3 text-gray-400 font-medium">INR</span>
          </div>
        </div>

        {/* Platform Commission (Calls) */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            Call Commission Rate (0 - 1)
            <span className="group relative">
              <Info size={14} className="text-gray-400 cursor-help" />
              <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded w-56 -top-12 left-6 z-10 shadow-xl">
                The percentage the platform keeps from Calls (0.15 = 15%).
              </div>
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={config.platformCommissionRate}
              onChange={(e) => setConfig({ ...config, platformCommissionRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
              required
            />
            <span className="absolute right-4 top-3 text-blue-600 font-bold">
              {(config.platformCommissionRate * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Gift Commission */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            Gift Commission Rate (0 - 1)
            <span className="group relative">
              <Info size={14} className="text-gray-400 cursor-help" />
              <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded w-56 -top-12 left-6 z-10 shadow-xl">
                Platform cut specifically from virtual gifts (0.2 = 20%).
              </div>
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={config.giftCommissionRate}
              onChange={(e) =>
                setConfig({
                  ...config,
                  giftCommissionRate: parseFloat(e.target.value) || 0
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all pr-12"
              required
            />
            <span className="absolute right-4 top-3 text-purple-600 font-bold">
              {(config.giftCommissionRate * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Status Messages */}
        {status.message && (
          <div className={`flex items-center gap-2 p-4 rounded-lg animate-in fade-in slide-in-from-top-1 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={updating}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-white transition-all shadow-md ${
            updating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
          }`}
        >
          {updating ? <RefreshCcw className="animate-spin" size={20} /> : <Save size={20} />}
          {updating ? 'Updating Database...' : 'Save Configuration'}
        </button>
      </form>

      {/* Logic Preview Card */}
      <div className="mt-8 p-5 bg-slate-900 rounded-xl text-white shadow-inner">
        <h4 className="text-blue-400 text-sm font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={16} /> Platform Profit Calculator (Per 100 Coins)
        </h4>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded border border-slate-700">
                <p className="text-slate-400 text-[10px] uppercase font-bold">User Pays</p>
                <p className="text-lg font-bold">₹{(100 * config.userCoinValue).toFixed(2)}</p>
            </div>
            <div className="bg-slate-800 p-3 rounded border border-slate-700">
                <p className="text-slate-400 text-[10px] uppercase font-bold italic flex items-center gap-1">
                   <Gift size={10} /> Gift Host Payout
                </p>
                <p className="text-lg font-bold text-purple-400">₹{(100 * (1 - config.giftCommissionRate) * config.hostCoinValue).toFixed(2)}</p>
            </div>
            <div className="bg-blue-900/40 p-4 rounded border border-blue-700 col-span-2">
                <p className="text-blue-300 text-[10px] uppercase font-bold">Est. Platform Profit (Call)</p>
                <p className="text-2xl font-black text-green-400">
                    ₹{((100 * config.userCoinValue) - (100 * (1 - config.platformCommissionRate) * config.hostCoinValue)).toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                    Profit includes coin sale markup and chosen commission fee.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RateManagement;