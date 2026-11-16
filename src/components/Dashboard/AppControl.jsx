
import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";

const DEFAULT_SETTINGS = {
  forceUpdate: false,
  minimumBuildNumber: 43,
  latestVersion: "1.0.5",
  updateMessage:
    "A new version of Helloza is available. Please update to continue.",
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=com.aeth.videocallapp",
  maintenanceMode: false,
  maintenanceMessage:
    "Helloza is currently undergoing maintenance. Please try again later.",
  maintenanceEndTime: "",
};

const formatDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (number) => String(number).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

export default function AppControl() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

    const originalSettings = useRef({
    forceUpdate: false,
    maintenanceMode: false,
  });
  
  // =====================================
  // LOAD SETTINGS
  // =====================================
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/app-settings");

      if (!res.data?.success) {
        throw new Error("Could not load app settings.");
      }

      const data = res.data.data;

      originalSettings.current = {
  forceUpdate: data.forceUpdate ?? false,
  maintenanceMode: data.maintenanceMode ?? false,
};

      setSettings({
        forceUpdate: data.forceUpdate ?? false,
        minimumBuildNumber: data.minimumBuildNumber ?? 43,
        latestVersion: data.latestVersion ?? "1.0.5",
        updateMessage:
          data.updateMessage ?? DEFAULT_SETTINGS.updateMessage,
        playStoreUrl:
          data.playStoreUrl ?? DEFAULT_SETTINGS.playStoreUrl,
        maintenanceMode: data.maintenanceMode ?? false,
        maintenanceMessage:
          data.maintenanceMessage ??
          DEFAULT_SETTINGS.maintenanceMessage,
        maintenanceEndTime: formatDateTimeLocal(
          data.maintenanceEndTime
        ),
      });
    } catch (err) {
      console.error("Settings fetch error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // =====================================
  // UPDATE FORM
  // =====================================
  const updateField = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccess("");
  };

  // =====================================
  // SAVE SETTINGS
  // =====================================
  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (
      !Number.isInteger(Number(settings.minimumBuildNumber)) ||
      Number(settings.minimumBuildNumber) < 1
    ) {
      setError("Please enter a valid minimum build number.");
      return;
    }

    if (!settings.latestVersion.trim()) {
      setError("Please enter the latest app version.");
      return;
    }

    if (
      settings.maintenanceEndTime &&
      new Date(settings.maintenanceEndTime).getTime() <= Date.now()
    ) {
      setError("Maintenance end time must be in the future.");
      return;
    }

const restrictionsBeingEnabled =
  (settings.forceUpdate && !originalSettings.current.forceUpdate) ||
  (settings.maintenanceMode &&
    !originalSettings.current.maintenanceMode);

    if (restrictionsBeingEnabled) {
      const confirmed = window.confirm(
        "You are enabling an app restriction. This may prevent users from accessing Helloza. Continue?"
      );

      if (!confirmed) return;
    }

    try {
      setSaving(true);

      const payload = {
        forceUpdate: settings.forceUpdate,
        minimumBuildNumber: Number(settings.minimumBuildNumber),
        latestVersion: settings.latestVersion.trim(),
        updateMessage: settings.updateMessage,
        playStoreUrl: settings.playStoreUrl,
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
        maintenanceEndTime: settings.maintenanceEndTime
          ? new Date(settings.maintenanceEndTime).toISOString()
          : null,
      };

      const res = await api.put(
        "/admin/app-settings",
        payload
      );

      if (!res.data?.success) {
        throw new Error("Settings update failed.");
      }

      setSuccess("App settings saved successfully.");

      await fetchSettings();

    } catch (err) {
      console.error("Settings update error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to save app settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================
  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            App Control
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage Helloza updates and server maintenance.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={saving}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50"
        >
          ↻ Refresh Settings
        </button>
      </div>

      {/* STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Force Update
          </p>

          <div className="flex items-center justify-between mt-3">
            <h3 className="text-xl font-black text-slate-800">
              {settings.forceUpdate ? "Enabled" : "Disabled"}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                settings.forceUpdate
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {settings.forceUpdate ? "ACTIVE" : "OFF"}
            </span>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Server Maintenance
          </p>

          <div className="flex items-center justify-between mt-3">
            <h3 className="text-xl font-black text-slate-800">
              {settings.maintenanceMode ? "Maintenance" : "Operational"}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                settings.maintenanceMode
                  ? "bg-orange-100 text-orange-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {settings.maintenanceMode ? "ACTIVE" : "ONLINE"}
            </span>
          </div>
        </div>
      </div>

      {/* FORCE UPDATE */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              🚀 Force Update
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Require outdated Android users to update.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-xs font-bold text-slate-500">
              {settings.forceUpdate ? "ON" : "OFF"}
            </span>

            <input
              type="checkbox"
              checked={settings.forceUpdate}
              onChange={(e) =>
                updateField("forceUpdate", e.target.checked)
              }
              className="w-5 h-5 accent-pink-600"
            />
          </label>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Latest App Version
            </label>

            <input
              type="text"
              value={settings.latestVersion}
              onChange={(e) =>
                updateField("latestVersion", e.target.value)
              }
              placeholder="1.0.6"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Minimum Supported Build Number
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={settings.minimumBuildNumber}
              onChange={(e) =>
                updateField("minimumBuildNumber", e.target.value)
              }
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-500"
            />

            <p className="text-xs text-slate-400 mt-2">
              Android versionCode, not version name.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Update Message
            </label>

            <textarea
              rows={3}
              maxLength={500}
              value={settings.updateMessage}
              onChange={(e) =>
                updateField("updateMessage", e.target.value)
              }
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Google Play Store URL
            </label>

            <input
              type="url"
              value={settings.playStoreUrl}
              onChange={(e) =>
                updateField("playStoreUrl", e.target.value)
              }
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </section>

      {/* MAINTENANCE */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              🛠 Server Maintenance
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Temporarily restrict access to Helloza.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-xs font-bold text-slate-500">
              {settings.maintenanceMode ? "ON" : "OFF"}
            </span>

            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                updateField("maintenanceMode", e.target.checked)
              }
              className="w-5 h-5 accent-orange-500"
            />
          </label>
        </div>

        <div className="p-6 space-y-5">

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Maintenance Message
            </label>

            <textarea
              rows={4}
              maxLength={1000}
              value={settings.maintenanceMessage}
              onChange={(e) =>
                updateField("maintenanceMessage", e.target.value)
              }
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Expected Maintenance Completion
            </label>

            <input
              type="datetime-local"
              value={settings.maintenanceEndTime}
              onChange={(e) =>
                updateField("maintenanceEndTime", e.target.value)
              }
              className="w-full sm:w-1/2 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400"
            />

            <p className="text-xs text-slate-400 mt-2">
              Optional. This is an estimated time and does not automatically
              disable maintenance.
            </p>
          </div>

        </div>
      </section>

      {/* FEEDBACK */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-medium">
          {success}
        </div>
      )}

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl font-black shadow-lg shadow-pink-200 transition-all"
        >
          {saving ? "Saving Settings..." : "Save App Settings"}
        </button>
      </div>

    </div>
  );
}
