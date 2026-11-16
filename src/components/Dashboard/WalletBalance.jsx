
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

export default function WalletBalance() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState("CREDIT");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");

      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Wallet users fetch error:", error);
      alert("Failed to load wallet balances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) =>
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.publicId?.toLowerCase().includes(query)
    );
  }, [users, search]);

  const openAdjustment = (user) => {
    setSelectedUser(user);
    setAdjustmentType("CREDIT");
    setAmount("");
    setReason("");
  };

  const closeAdjustment = () => {
    if (saving) return;

    setSelectedUser(null);
    setAmount("");
    setReason("");
  };

  const handleAdjustment = async (e) => {
    e.preventDefault();

    const coins = Number(amount);

    if (!Number.isSafeInteger(coins) || coins <= 0) {
      alert("Enter a valid whole number of coins.");
      return;
    }

    if (reason.trim().length < 5) {
      alert("Please provide a reason (at least 5 characters).");
      return;
    }

    const currentBalance = selectedUser.coins || 0;

    if (
      adjustmentType === "DEBIT" &&
      coins > currentBalance
    ) {
      alert("Insufficient wallet balance.");
      return;
    }

    const newBalance =
      adjustmentType === "CREDIT"
        ? currentBalance + coins
        : currentBalance - coins;

    if (!Number.isSafeInteger(newBalance) || newBalance < 0) {
      alert("Invalid resulting wallet balance.");
      return;
    }

    const confirmed = window.confirm(
      `${adjustmentType === "CREDIT" ? "Add" : "Deduct"} ${coins.toLocaleString()} coins?\n\n` +
      `User: ${selectedUser.name}\n` +
      `Previous balance: ${currentBalance.toLocaleString()}\n` +
      `New balance: ${newBalance.toLocaleString()}\n\n` +
      `Reason: ${reason.trim()}`
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      const res = await api.post(
        `/admin/users/${selectedUser._id}/wallet-adjustment`,
        {
          type: adjustmentType,
          amount: coins,
          reason: reason.trim(),
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Adjustment failed");
      }

      const updatedBalance = res.data.coins;

      setUsers((previous) =>
        previous.map((user) =>
          user._id === selectedUser._id
            ? { ...user, coins: updatedBalance }
            : user
        )
      );

      alert("Wallet adjustment completed successfully.");

      setSelectedUser(null);
      setAmount("");
      setReason("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to adjust wallet."
      );
    } finally {
      setSaving(false);
    }
  };

  const totalCoins = users.reduce(
    (total, user) => total + (user.coins || 0),
    0
  );

  if (loading) {
    return (
      <div className="p-10 text-center font-bold">
        Loading wallet balances...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-bold text-slate-800">
            {users.length.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Wallet Coins</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {totalCoins.toLocaleString()} 🪙
          </h2>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">Users With Balance</p>
          <h2 className="text-2xl font-bold text-green-600">
            {users.filter((user) => user.coins > 0).length.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* USER LIST */}
      <div className="bg-white rounded-xl border shadow-sm">

        <div className="p-5 border-b flex flex-col md:flex-row justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Wallet Management
            </h2>
            <p className="text-sm text-gray-500">
              Search users and manage their wallet balances.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search name, email or Public ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-xs uppercase text-gray-500">User</th>
                <th className="p-4 text-xs uppercase text-gray-500">Role</th>
                <th className="p-4 text-xs uppercase text-gray-500">Public ID</th>
                <th className="p-4 text-xs uppercase text-gray-500">Wallet Balance</th>
                <th className="p-4 text-right text-xs uppercase text-gray-500">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">

                  <td className="p-4">
                    <p className="font-semibold text-gray-800">
                      {user.name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-xs text-gray-600">
                    {user.publicId || "N/A"}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-blue-600 font-mono">
                      {(user.coins || 0).toLocaleString()} 🪙
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      disabled={user.role === "superadmin"}
                      onClick={() => openAdjustment(user)}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      Manage Balance
                    </button>
                  </td>

                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        <div className="p-4 border-t text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>

      </div>

      {/* ADJUSTMENT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Manage Wallet
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedUser.name} · {selectedUser.publicId}
                </p>
              </div>

              <button
                onClick={closeAdjustment}
                disabled={saving}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustment} className="p-6 space-y-5">

              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">
                  Current Wallet Balance
                </p>
                <h2 className="text-3xl font-bold text-blue-700">
                  {(selectedUser.coins || 0).toLocaleString()} 🪙
                </h2>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Adjustment Type
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => setAdjustmentType("CREDIT")}
                    className={`p-3 rounded-lg border font-bold ${
                      adjustmentType === "CREDIT"
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    + Add Coins
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentType("DEBIT")}
                    className={`p-3 rounded-lg border font-bold ${
                      adjustmentType === "DEBIT"
                        ? "bg-red-50 border-red-500 text-red-700"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    − Deduct Coins
                  </button>

                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Number of Coins
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter coin amount"
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Reason for Adjustment
                </label>

                <textarea
                  required
                  minLength={5}
                  maxLength={300}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Example: Customer support compensation"
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current balance</span>
                  <strong>
                    {(selectedUser.coins || 0).toLocaleString()}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Adjustment</span>
                  <strong className={
                    adjustmentType === "CREDIT"
                      ? "text-green-600"
                      : "text-red-600"
                  }>
                    {adjustmentType === "CREDIT" ? "+" : "-"}
                    {Number(amount || 0).toLocaleString()}
                  </strong>
                </div>

                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">New balance</span>
                  <strong className="text-blue-700">
                    {(
                      (selectedUser.coins || 0) +
                      (adjustmentType === "CREDIT" ? 1 : -1) *
                      (Number(amount) || 0)
                    ).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  disabled={saving}
                  onClick={closeAdjustment}
                  className="flex-1 border rounded-lg p-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !amount || Number(amount) <= 0}
                  className={`flex-1 rounded-lg p-3 font-bold text-white disabled:opacity-50 ${
                    adjustmentType === "CREDIT"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {saving
                    ? "Processing..."
                    : adjustmentType === "CREDIT"
                    ? "Add Coins"
                    : "Deduct Coins"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
