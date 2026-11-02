import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";

const ConcurrentUsers = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("today");
  const [dates, setDates] = useState({
    start: "",
    end: ""
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const params = { range };

      if (range === "custom") {
        params.startDate = dates.start;
        params.endDate = dates.end;
      }

      const res = await api.get(
        "/admin/concurrent-users",
        { params }
      );

      setData(res.data);
    } catch (error) {
      console.error("Concurrent analytics error:", error);
    } finally {
      setLoading(false);
    }
  }, [range, dates]);

  useEffect(() => {
    if (range === "custom" && (!dates.start || !dates.end)) {
      return;
    }

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [fetchData, range, dates]);

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(`${date}T00:00:00+05:30`)
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata"
      });
  };

  const formatTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    });
  };

  const rows = data?.dailyPeakUsers || [];

  const chartRows = [...rows].reverse();

  const maxUsers = Math.max(
    1,
    ...rows.map(item => item.peakUsers || 0)
  );

  const highestDay = rows.reduce(
    (best, item) =>
      !best || item.peakUsers > best.peakUsers
        ? item
        : best,
    null
  );

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Concurrent Users Analytics
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor simultaneous app users and daily peaks.
          </p>
        </div>

        <button
          onClick={() => fetchData()}
          disabled={loading}
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border p-4 flex flex-wrap items-center gap-3">

        <select
          value={range}
          onChange={e => setRange(e.target.value)}
          className="border rounded-xl p-3 bg-gray-50 font-semibold"
        >
          <option value="today">Today</option>
          <option value="2days">Last 2 Days</option>
          <option value="1week">Last 1 Week</option>
          <option value="1month">Last 1 Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
          <option value="all">All Time</option>
          <option value="custom">Custom Duration</option>
        </select>

        {range === "custom" && (
          <>
            <input
              type="date"
              value={dates.start}
              onChange={e =>
                setDates({ ...dates, start: e.target.value })
              }
              className="border rounded-xl p-3"
            />

            <span className="text-gray-400">TO</span>

            <input
              type="date"
              value={dates.end}
              min={dates.start || undefined}
              onChange={e =>
                setDates({ ...dates, end: e.target.value })
              }
              className="border rounded-xl p-3"
            />

            <button
              onClick={fetchData}
              disabled={!dates.start || !dates.end}
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Search
            </button>
          </>
        )}
      </div>

      {loading && !data ? (
        <div className="p-10 text-center text-gray-500">
          Loading analytics...
        </div>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">

            {/* CURRENT USERS */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
              <p className="text-sm opacity-80 font-semibold">
                Currently Connected
              </p>

              <p className="text-4xl font-bold mt-3">
                {data?.currentUsers ?? 0}
              </p>

              <p className="text-xs mt-1 opacity-75">
                Unique connected users now
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/20">
                <div>
                  <p className="text-xs opacity-80">
                    Male
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {data?.currentMaleUsers ?? 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs opacity-80">
                    Female
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {data?.currentFemaleUsers ?? 0}
                  </p>
                </div>
              </div>
            </div>


{/* UNIQUE ACTIVE USERS - SELECTED DURATION */}
<div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
  <p className="text-sm opacity-80 font-semibold">
    Unique Active Users
  </p>

  <p className="text-4xl font-bold mt-3">
    {data?.periodUniqueActiveUsers ?? 0}
  </p>

  <p className="text-xs mt-1 opacity-75">
    Different accounts connected during selected duration
  </p>

  <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/20">
    <div>
      <p className="text-xs opacity-80">Male</p>
      <p className="text-2xl font-bold mt-1">
        {data?.periodMaleActiveUsers ?? 0}
      </p>
    </div>

    <div>
      <p className="text-xs opacity-80">Female</p>
      <p className="text-2xl font-bold mt-1">
        {data?.periodFemaleActiveUsers ?? 0}
      </p>
    </div>
  </div>
</div>

            {/* HIGHEST PEAK */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-2xl text-white shadow-lg">
              <p className="text-sm opacity-80 font-semibold">
                Highest Simultaneous Users
              </p>
              <p className="text-4xl font-bold mt-3">
                {data?.periodPeakUsers ?? 0}
              </p>
              <p className="text-xs mt-2 opacity-75">
                Highest daily peak in selected period
              </p>
            </div>

            {/* PEAK DATE */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-2xl text-white shadow-lg">
              <p className="text-sm opacity-80 font-semibold">
                Peak Date
              </p>
              <p className="text-2xl font-bold mt-3">
                {formatDate(data?.peakDate)}
              </p>
              <p className="text-xs mt-2 opacity-75">
                {formatTime(data?.peakAt)}
              </p>
            </div>

            {/* MALE USERS */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
              <p className="text-sm opacity-80 font-semibold">
                Male Users at Peak
              </p>
              <p className="text-4xl font-bold mt-3">
                {data?.peakMaleUsers ?? 0}
              </p>
              <p className="text-xs mt-2 opacity-75">
                Male users at the highest simultaneous moment
              </p>
            </div>

            {/* FEMALE USERS */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-700 p-6 rounded-2xl text-white shadow-lg">
              <p className="text-sm opacity-80 font-semibold">
                Female Users at Peak
              </p>
              <p className="text-4xl font-bold mt-3">
                {data?.peakFemaleUsers ?? 0}
              </p>
              <p className="text-xs mt-2 opacity-75">
                Female users at the highest simultaneous moment
              </p>
            </div>
          </div>

          {/* DAILY CHART */}
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="mb-6">
              <h2 className="text-lg font-bold">
                Daily Simultaneous Users
              </h2>

              <p className="text-sm text-gray-500">
                Highest connected user count recorded each day.
              </p>
            </div>

            {chartRows.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No historical peak data available yet.
              </div>
            ) : (
              <div className="space-y-5">
                {chartRows.map(item => (
                  <div key={item.dateKey}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-semibold text-gray-700">
                        {formatDate(item.dateKey)}
                      </span>

                      <span className="font-bold text-blue-700">
                        {item.peakUsers} users
                      </span>
                    </div>

                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{
                          width: `${Math.max(
                            1,
                            (item.peakUsers / maxUsers) * 100
                          )}%`
                        }}
                      />
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      Peak time: {formatTime(item.peakAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HISTORY TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold">
                Peak Users History
              </h2>

              <p className="text-sm text-gray-500">
                Daily historical records
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Peak Users</th>
                    <th className="p-4">Peak Time (IST)</th>
                    <th className="p-4">Male</th>
                    <th className="p-4">Female</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map(item => (
                    <tr
                      key={item.dateKey}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-4 font-semibold">
                        {formatDate(item.dateKey)}
                      </td>

                      <td className="p-4 font-bold text-blue-700">
                        {item.peakUsers}
                      </td>

                      <td className="p-4 text-gray-600">
                        {formatTime(item.peakAt)}
                      </td>

                      <td className="p-4 font-semibold text-blue-700">
                        {item.maleUsers ?? 0}
                      </td>

                      <td className="p-4 font-semibold text-pink-700">
                        {item.femaleUsers ?? 0}
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-gray-400"
                      >
                        No records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConcurrentUsers;