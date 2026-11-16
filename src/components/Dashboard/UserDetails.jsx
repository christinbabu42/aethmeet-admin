
import { useState } from "react";
import api from "../../api/axios";

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatDuration = (seconds) => {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  return hours > 0
    ? `${hours}h ${minutes}m`
    : minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getName = (person) =>
  person?.name || person?.nickname || person?.email || "Unknown";

const StatusBadge = ({ status }) => {
  const colors = {
    completed: "bg-green-100 text-green-700",
    ongoing: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    missed: "bg-orange-100 text-orange-700",
    failed: "bg-red-100 text-red-700",
    busy: "bg-yellow-100 text-yellow-700",
    ringing: "bg-purple-100 text-purple-700",
    streaming: "bg-green-100 text-green-700",
    ended: "bg-gray-100 text-gray-700",
    SUCCESS: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CREDIT: "bg-green-100 text-green-700",
    DEBIT: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "-"}
    </span>
  );
};

const StatCard = ({ title, value, subtitle }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-sm text-gray-500 font-medium">{title}</p>
    <h3 className="text-2xl font-extrabold text-slate-800 mt-2">
      {value}
    </h3>
    {subtitle && (
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100">
      <h3 className="font-extrabold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </section>
);
const toLocalISO = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString();
};

const getPeriodRange = (period, customFrom, customTo) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  start.setHours(0, 0, 0, 0);

  switch (period) {
    case "today":
      break;

    case "2days":
      start.setDate(start.getDate() - 1);
      break;

    case "week":
      start.setDate(start.getDate() - 6);
      break;

    case "month":
      start.setMonth(start.getMonth() - 1);
      break;

    case "6months":
      start.setMonth(start.getMonth() - 6);
      break;

    case "custom": {
      if (!customFrom || !customTo) {
        throw new Error("Please select both custom dates.");
      }

      const from = new Date(`${customFrom}T00:00:00`);
      const to = new Date(`${customTo}T00:00:00`);

      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
        throw new Error("Invalid custom date range.");
      }

      if (from > to) {
        throw new Error("Start date cannot be after end date.");
      }

      to.setDate(to.getDate() + 1);

      return {
        from: toLocalISO(from),
        to: toLocalISO(to),
      };
    }

    default:
      break;
  }

  return {
    from: toLocalISO(start),
    to: toLocalISO(end),
  };
};

export default function UserDetails() {
  const [identifier, setIdentifier] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [period, setPeriod] = useState("today");
const [customFrom, setCustomFrom] = useState("");
const [customTo, setCustomTo] = useState("");

const searchUser = async (
  e,
  selectedPeriod = period,
  selectedFrom = customFrom,
  selectedTo = customTo
) => {
  e?.preventDefault();

  const search = identifier.trim();

  if (!search) {
    setError("Enter email, User ID or Public ID.");
    return;
  }

  let range;

  try {
    range = getPeriodRange(
      selectedPeriod,
      selectedFrom,
      selectedTo
    );
  } catch (err) {
    setError(err.message);
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await api.get(
      `/admin/users/${encodeURIComponent(search)}/details`,
      {
        params: {
          from: range.from,
          to: range.to,
        },
      }
    );

    if (!res.data?.success) {
      throw new Error(
        res.data?.message || "Unable to load user details."
      );
    }

    setData(res.data.data);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Failed to fetch user."
    );
  } finally {
    setLoading(false);
  }
};

  const user = data?.user;
  const calls = data?.calls || {};
  const live = data?.live || {};
  const gifts = data?.gifts || {};
  const wallet = data?.wallet || {};
  const income = data?.income || {};
  const transactions = data?.walletTransactions || {};

  const callRows = data?.recentCalls || [];
  const giftRows = gifts.recent || [];
  const walletRows = transactions.recent || [];

  return (
    <div className="space-y-7 max-w-full">

      {/* SEARCH */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-extrabold text-slate-800">
          User Details & Analytics
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Search an individual user to view complete activity and financial history.
        </p>

        <form
          onSubmit={searchUser}
          className="flex flex-col sm:flex-row gap-3 mt-6"
        >
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter email, MongoDB User ID or Public ID"
            className="flex-1 min-w-0 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold rounded-xl px-8 py-3"
          >
            {loading ? "Searching..." : "Search User"}
          </button>
        </form>

        {data && (
  <div className="mt-6 border-t border-gray-100 pt-5">
    <p className="text-sm font-bold text-slate-700 mb-3">
      Filter Activity Period
    </p>

    <div className="flex flex-wrap gap-2">
      {[
        { label: "Today", value: "today" },
        { label: "2 Days", value: "2days" },
        { label: "1 Week", value: "week" },
        { label: "1 Month", value: "month" },
        { label: "6 Months", value: "6months" },
      ].map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={loading}
          onClick={() => {
            setPeriod(item.value);
            searchUser(null, item.value);
          }}
          className={`px-4 py-2 rounded-xl text-sm font-bold border ${
            period === item.value
              ? "bg-pink-600 text-white border-pink-600"
              : "bg-white text-slate-600 border-gray-200 hover:border-pink-400"
          }`}
        >
          {item.label}
        </button>
      ))}

      <button
        type="button"
        disabled={loading}
        onClick={() => setPeriod("custom")}
        className={`px-4 py-2 rounded-xl text-sm font-bold border ${
          period === "custom"
            ? "bg-pink-600 text-white border-pink-600"
            : "bg-white text-slate-600 border-gray-200 hover:border-pink-400"
        }`}
      >
        Custom
      </button>
    </div>

    {period === "custom" && (
      <div className="flex flex-col sm:flex-row gap-3 mt-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            From
          </label>
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            To
          </label>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2"
          />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            searchUser(null, "custom", customFrom, customTo)
          }
          className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold rounded-xl px-6 py-2"
        >
          Apply Dates
        </button>
      </div>
    )}

    <p className="text-xs text-gray-400 mt-3">
      The selected period applies to activity statistics and histories.
      Current wallet balance remains the actual current balance.
    </p>
  </div>
)}

        {error && (
          <p className="mt-4 text-sm text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>

      {!data && !loading && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">
          <div className="text-5xl mb-4">👤</div>
          <h3 className="font-bold text-slate-700">
            Search for a user
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            User calls, live sessions, gifts and wallet information will appear here.
          </p>
        </div>
      )}

      {data && (
        <>
          {/* USER PROFILE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="User"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center text-3xl">
                  👤
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-extrabold text-slate-800">
                  {user.name || user.nickname || "Unnamed User"}
                </h2>

                <p className="text-gray-500 text-sm break-all">
                  {user.email}
                </p>

                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Public ID: {user.publicId || "-"}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Role: {user.role}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Gender: {user.gender || "-"}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    Joined: {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <StatusBadge status={user.status || "offline"} />
                <span className="text-xs text-gray-500">
                  Account: {user.actionstatus || "active"}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 break-all">
              MongoDB ID: {user._id}
            </p>
          </div>

          {/* CALL STATISTICS */}
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-4">
              📞 Call Statistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title="Total Calls"
                value={formatNumber(calls.totalCalls)}
              />

              <StatCard
                title="Connected Calls"
                value={formatNumber(calls.connectedCalls)}
                subtitle="Completed + ongoing"
              />

              <StatCard
                title="Rejected Calls"
                value={formatNumber(calls.rejectedCalls)}
              />

              <StatCard
                title="Missed / Failed / Busy"
                value={formatNumber(
                  (calls.missedCalls || 0) +
                  (calls.failedCalls || 0) +
                  (calls.busyCalls || 0)
                )}
              />

              <StatCard
                title="Completed Calls"
                value={formatNumber(calls.completedCalls)}
              />

              <StatCard
                title="Ongoing Calls"
                value={formatNumber(calls.ongoingCalls)}
              />

              <StatCard
                title="Total Connected Time"
                value={formatDuration(calls.totalDurationSeconds)}
              />

              <StatCard
                title="Coins Spent as Caller"
                value={formatNumber(calls.coinsSpentAsCaller)}
              />
            </div>
          </div>

          {/* LIVE STREAM STATISTICS */}
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-4">
              🔴 Live Streaming Statistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title="Total Live Sessions"
                value={formatNumber(live.totalSessions)}
              />

              <StatCard
                title="Total Live Time"
                value={formatDuration(live.totalDurationSeconds)}
              />

              <StatCard
                title="Live Reward Minutes"
                value={formatNumber(live.rewardMinutes)}
              />

              <StatCard
                title="Live Coins Earned"
                value={formatNumber(live.coinsEarned)}
              />

              <StatCard
                title="Call Coins Earned"
                value={formatNumber(income.callCoins)}
              />

              <StatCard
                title="Gift Coins Earned"
                value={formatNumber(income.giftCoins)}
              />

              <StatCard
                title="Total Host Earnings"
                value={formatNumber(income.totalCoins)}
                subtitle={`${formatNumber(income.totalRupees)} rupees`}
              />

              <StatCard
                title="Coins Earned as Call Host"
                value={formatNumber(calls.coinsEarnedAsHost)}
              />
            </div>
          </div>

          {/* GIFT STATISTICS */}
          <Section title="🎁 Gift Statistics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="rounded-xl bg-green-50 p-5">
                <h4 className="font-bold text-green-800 mb-4">
                  Gifts Received
                </h4>

                <p className="text-3xl font-extrabold text-green-700">
                  {formatNumber(gifts.received?.quantity)}
                </p>

                <p className="text-sm text-green-700 mt-1">
                  Total gift quantity
                </p>

                <p className="text-lg font-bold mt-4">
                  {formatNumber(gifts.received?.coins)} coins
                </p>

                <p className="text-xs text-green-700">
                  {formatNumber(gifts.received?.transactions)} transactions
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-5">
                <h4 className="font-bold text-orange-800 mb-4">
                  Gifts Sent
                </h4>

                <p className="text-3xl font-extrabold text-orange-700">
                  {formatNumber(gifts.sent?.quantity)}
                </p>

                <p className="text-sm text-orange-700 mt-1">
                  Total gift quantity
                </p>

                <p className="text-lg font-bold mt-4">
                  {formatNumber(gifts.sent?.coins)} coins
                </p>

                <p className="text-xs text-orange-700">
                  {formatNumber(gifts.sent?.transactions)} transactions
                </p>
              </div>
            </div>
          </Section>

          {/* WALLET */}
          <Section title="💰 Wallet & Financial Summary">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

              <StatCard
                title="Current Wallet Balance"
                value={`${formatNumber(wallet.coins)} coins`}
              />

              <StatCard
                title="Total Successful Credits"
                value={`${formatNumber(transactions.totalCredits)} coins`}
              />

              <StatCard
                title="Total Successful Debits"
                value={`${formatNumber(transactions.totalDebits)} coins`}
              />

              <StatCard
                title="Available Host Earnings"
                value={`${formatNumber(income.availableCoins)} coins`}
              />

              <StatCard
                title="Withdrawn Coins"
                value={formatNumber(income.withdrawnCoins)}
              />

              <StatCard
                title="Pending Withdrawals"
                value={formatNumber(income.pendingWithdrawalCoins)}
              />

              <StatCard
                title="Total Earnings"
                value={`${formatNumber(income.totalCoins)} coins`}
              />

              <StatCard
                title="Total Rupee Earnings"
                value={`₹${formatNumber(income.totalRupees)}`}
              />
            </div>
          </Section>

          {/* RECENT CALLS */}
          <Section title="📞 Recent Call History">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[850px]">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Caller</th>
                    <th className="p-3">Host</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Spent</th>
                    <th className="p-3">Host Earnings</th>
                  </tr>
                </thead>

                <tbody>
                  {callRows.map((call) => (
                    <tr key={call._id} className="border-t">
                      <td className="p-3">{formatDate(call.createdAt)}</td>
                      <td className="p-3">{getName(call.callerId)}</td>
                      <td className="p-3">{getName(call.hostId)}</td>
                      <td className="p-3">{call.callType}</td>
                      <td className="p-3">
                        <StatusBadge status={call.status} />
                      </td>
                      <td className="p-3">
                        {formatDuration(call.duration)}
                      </td>
                      <td className="p-3">
                        {formatNumber(call.totalCoinsSpent)}
                      </td>
                      <td className="p-3">
                        {formatNumber(call.hostEarnings)}
                      </td>
                    </tr>
                  ))}

                  {callRows.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-6 text-center text-gray-400">
                        No calls found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Showing latest 50 calls. Statistics above include all recorded calls.
            </p>
          </Section>

          {/* LIVE SESSION HISTORY */}
          <Section title="🔴 Live Session History">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[750px]">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Started</th>
                    <th className="p-3">Ended</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Reward Minutes</th>
                    <th className="p-3">Coins Earned</th>
                    <th className="p-3">Gifts Received</th>
                  </tr>
                </thead>

                <tbody>
                  {(live.sessions || []).map((stream) => (
                    <tr key={stream._id} className="border-t">
                      <td className="p-3">{stream.title || "Live Stream"}</td>
                      <td className="p-3">{formatDate(stream.startedAt)}</td>
                      <td className="p-3">{formatDate(stream.endedAt)}</td>
                      <td className="p-3">
                        <StatusBadge status={stream.status} />
                      </td>
                      <td className="p-3">{formatNumber(stream.rewardMinutes)}</td>
                      <td className="p-3">{formatNumber(stream.totalCoinsEarned)}</td>
                      <td className="p-3">{formatNumber(stream.totalGiftsReceived)}</td>
                    </tr>
                  ))}

                  {(!live.sessions || live.sessions.length === 0) && (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-gray-400">
                        No live sessions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          {/* GIFT HISTORY */}
          <Section title="🎁 Recent Gift Transactions">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[650px]">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Sender</th>
                    <th className="p-3">Receiver</th>
                    <th className="p-3">Gift</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Price</th>
                  </tr>
                </thead>

                <tbody>
                  {giftRows.map((gift) => (
                    <tr key={gift._id} className="border-t">
                      <td className="p-3">{formatDate(gift.createdAt)}</td>
                      <td className="p-3">{getName(gift.sender)}</td>
                      <td className="p-3">{getName(gift.receiver)}</td>
                      <td className="p-3">{gift.gift?.name || "-"}</td>
                      <td className="p-3">{formatNumber(gift.quantity)}</td>
                      <td className="p-3">{formatNumber(gift.gift?.price)} coins</td>
                    </tr>
                  ))}

                  {giftRows.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-400">
                        No gift transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          {/* WALLET TRANSACTION HISTORY */}
          <Section title="💰 Recent Wallet Transactions">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[700px]">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Coins</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {walletRows.map((tx) => (
                    <tr key={tx._id} className="border-t">
                      <td className="p-3">{formatDate(tx.createdAt)}</td>
                      <td className="p-3">{tx.category}</td>
                      <td className="p-3">
                        <StatusBadge status={tx.type} />
                      </td>
                      <td className="p-3 font-bold">
                        {formatNumber(tx.coins)}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="p-3">{tx.reason || "-"}</td>
                    </tr>
                  ))}

                  {walletRows.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-gray-400">
                        No wallet transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
