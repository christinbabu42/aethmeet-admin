
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SupportContacts() {
  const [incomePhones, setIncomePhones] = useState([]);
  const [walletPhones, setWalletPhones] = useState([]);

  const [incomeEmails, setIncomeEmails] = useState([]);
  const [walletEmails, setWalletEmails] = useState([]);

  const [incomePhoneInput, setIncomePhoneInput] = useState("");
  const [walletPhoneInput, setWalletPhoneInput] = useState("");

  const [incomeInput, setIncomeInput] = useState("");
  const [walletInput, setWalletInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================
  // LOAD SAVED CONTACTS
  // ============================================
  useEffect(() => {
    let mounted = true;

    const loadContacts = async () => {
      try {
        const res = await api.get("/admin/support-contacts");

        if (!mounted) return;

        if (res.data?.success) {
          const data = res.data.data || {};

          setIncomePhones(
            Array.isArray(data.incomePhones) ? data.incomePhones : []
          );

          setWalletPhones(
            Array.isArray(data.walletPhones) ? data.walletPhones : []
          );

          setIncomeEmails(
            Array.isArray(data.incomeEmails) ? data.incomeEmails : []
          );

          setWalletEmails(
            Array.isArray(data.walletEmails) ? data.walletEmails : []
          );
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
            "Could not load support contacts."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadContacts();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================
  // ADD PHONE NUMBER
  // ============================================
  const addPhone = (type) => {
    setError("");
    setSuccess("");

    const value =
      type === "income"
        ? incomePhoneInput.trim()
        : walletPhoneInput.trim();

    if (!value) {
      setError("Please enter a phone number.");
      return;
    }

    if (
      value.length > 30 ||
      !/^[+0-9()\-\s]+$/.test(value) ||
      value.replace(/\D/g, "").length < 7
    ) {
      setError("Please enter a valid phone number.");
      return;
    }

    const currentList =
      type === "income" ? incomePhones : walletPhones;

    if (currentList.includes(value)) {
      setError("This phone number has already been added.");
      return;
    }

    if (currentList.length >= 10) {
      setError("Maximum 10 phone numbers are allowed per list.");
      return;
    }

    if (type === "income") {
      setIncomePhones((prev) => [...prev, value]);
      setIncomePhoneInput("");
    } else {
      setWalletPhones((prev) => [...prev, value]);
      setWalletPhoneInput("");
    }
  };

  // ============================================
  // REMOVE PHONE NUMBER
  // ============================================
  const removePhone = (type, phone) => {
    setError("");
    setSuccess("");

    if (type === "income") {
      setIncomePhones((prev) =>
        prev.filter((item) => item !== phone)
      );
    } else {
      setWalletPhones((prev) =>
        prev.filter((item) => item !== phone)
      );
    }
  };

  // ============================================
  // ADD EMAIL
  // ============================================
  const addEmail = (type) => {
    setError("");
    setSuccess("");

    const value =
      type === "income"
        ? incomeInput.trim().toLowerCase()
        : walletInput.trim().toLowerCase();

    if (!value) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    const currentList =
      type === "income" ? incomeEmails : walletEmails;

    if (currentList.includes(value)) {
      setError("This email address has already been added.");
      return;
    }

    if (currentList.length >= 10) {
      setError("Maximum 10 email addresses are allowed per list.");
      return;
    }

    if (type === "income") {
      setIncomeEmails((prev) => [...prev, value]);
      setIncomeInput("");
    } else {
      setWalletEmails((prev) => [...prev, value]);
      setWalletInput("");
    }
  };

  // ============================================
  // REMOVE EMAIL
  // ============================================
  const removeEmail = (type, email) => {
    setError("");
    setSuccess("");

    if (type === "income") {
      setIncomeEmails((prev) =>
        prev.filter((item) => item !== email)
      );
    } else {
      setWalletEmails((prev) =>
        prev.filter((item) => item !== email)
      );
    }
  };

  // ============================================
  // SAVE CONTACTS
  // ============================================
  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (incomePhones.length > 10 || walletPhones.length > 10) {
      setError("Maximum 10 phone numbers are allowed per list.");
      return;
    }

    if (incomeEmails.length > 10 || walletEmails.length > 10) {
      setError("Maximum 10 email addresses are allowed per list.");
      return;
    }

    try {
      setSaving(true);

      const res = await api.put("/admin/support-contacts", {
        incomePhones,
        walletPhones,
        incomeEmails,
        walletEmails,
      });

      if (res.data?.success) {
        const data = res.data.data || {};

        setIncomePhones(data.incomePhones || []);
        setWalletPhones(data.walletPhones || []);
        setIncomeEmails(data.incomeEmails || []);
        setWalletEmails(data.walletEmails || []);

        setSuccess("Support contacts saved successfully.");
      } else {
        setError(res.data?.message || "Could not save contacts.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to save support contacts."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // PHONE INPUT SECTION
  // ============================================
  const renderPhoneSection = (
    title,
    description,
    type,
    phones,
    input,
    setInput
  ) => (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1 mb-5">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="tel"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPhone(type);
            }
          }}
          placeholder="+91 98765 43210"
          maxLength={30}
          className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          type="button"
          onClick={() => addPhone(type)}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl"
        >
          + Add Phone Number
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {phones.length === 0 ? (
          <p className="text-sm text-slate-400 py-3">
            No phone numbers added yet.
          </p>
        ) : (
          phones.map((phone, index) => (
            <div
              key={`${phone}-${index}`}
              className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-pink-500">☎</span>
                <span className="text-sm text-slate-700 break-all">
                  {phone}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removePhone(type, phone)}
                className="text-red-500 hover:text-red-700 font-semibold text-sm shrink-0"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Maximum 10 phone numbers.
      </p>
    </section>
  );

  // ============================================
  // EMAIL INPUT SECTION
  // ============================================
  const renderEmailSection = (
    title,
    description,
    type,
    emails,
    input,
    setInput
  ) => (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1 mb-5">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addEmail(type);
            }
          }}
          placeholder="Enter email address"
          className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          type="button"
          onClick={() => addEmail(type)}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl"
        >
          + Add Email
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {emails.length === 0 ? (
          <p className="text-sm text-slate-400 py-3">
            No email addresses added yet.
          </p>
        ) : (
          emails.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-pink-500">✉</span>
                <span className="text-sm text-slate-700 break-all">
                  {email}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeEmail(type, email)}
                className="text-red-500 hover:text-red-700 font-semibold text-sm shrink-0"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Maximum 10 email addresses.
      </p>
    </section>
  );

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">
          Support Contacts
        </h2>

        <p className="text-slate-500 mt-1">
          Manage multiple phone numbers and email contacts for
          income, withdrawals and wallet support.
        </p>
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
          {success}
        </div>
      )}

      {/* INCOME PHONES */}
      {renderPhoneSection(
        "Income & Withdrawal Phone Numbers",
        "Phone numbers for host earnings, income statements and withdrawal enquiries.",
        "income",
        incomePhones,
        incomePhoneInput,
        setIncomePhoneInput
      )}

      {/* WALLET PHONES */}
      {renderPhoneSection(
        "Wallet & Transaction Phone Numbers",
        "Phone numbers for coin purchases, wallet balances, payments and transaction enquiries.",
        "wallet",
        walletPhones,
        walletPhoneInput,
        setWalletPhoneInput
      )}

      {/* INCOME EMAILS */}
      {renderEmailSection(
        "Income & Withdrawal Emails",
        "Email addresses for host earnings, income statements and withdrawal enquiries.",
        "income",
        incomeEmails,
        incomeInput,
        setIncomeInput
      )}

      {/* WALLET EMAILS */}
      {renderEmailSection(
        "Wallet & Transaction Emails",
        "Email addresses for coin purchases, wallet balances, payment and transaction enquiries.",
        "wallet",
        walletEmails,
        walletInput,
        setWalletInput
      )}

      {/* SAVE BUTTON */}
      <div className="flex justify-end pb-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white font-bold px-10 py-4 rounded-xl shadow-lg"
        >
          {saving ? "Saving..." : "Save Support Settings"}
        </button>
      </div>
    </div>
  );
}
