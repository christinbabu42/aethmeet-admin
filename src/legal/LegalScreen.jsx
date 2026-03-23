import React, { useState } from "react";
// Importing the separate web-compatible pages
// Ensure these files are also named .jsx if they contain JSX
import PrivacyPolicy from "./privacy";
import TermsAndConditions from "./terms";

// Note: If you have separate components for these, import them here. 
// Otherwise, they currently act as placeholders within the switcher.
const Placeholder = ({ title }) => (
  <div className="p-8 text-center text-slate-400 italic">
    {title} content is currently being prepared.
  </div>
);

export default function LegalScreen() {
  const [activeTab, setActiveTab] = useState("privacy");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Professional Section Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Legal Center
          </h1>
          <p className="text-slate-500 text-sm">
            Review our policies, terms, and community standards for Luvios.
          </p>
        </div>

        {/* Container Wrapper */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          
          {/* Tabs Navigation - Scrollable on mobile for many tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 scrollbar-hide">
            <button
              type="button"
              className={`flex-1 min-w-[150px] py-4 px-6 text-sm font-bold transition-all duration-200 outline-none whitespace-nowrap ${
                activeTab === "privacy" 
                  ? "bg-white text-rose-600 border-b-2 border-rose-500" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("privacy")}
            >
              Privacy Policy
            </button>

            <button
              type="button"
              className={`flex-1 min-w-[150px] py-4 px-6 text-sm font-bold transition-all duration-200 outline-none whitespace-nowrap ${
                activeTab === "terms" 
                  ? "bg-white text-rose-600 border-b-2 border-rose-500" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("terms")}
            >
              Terms & Conditions
            </button>

            <button
              type="button"
              className={`flex-1 min-w-[150px] py-4 px-6 text-sm font-bold transition-all duration-200 outline-none whitespace-nowrap ${
                activeTab === "community" 
                  ? "bg-white text-rose-600 border-b-2 border-rose-500" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("community")}
            >
              Community Guidelines
            </button>

            <button
              type="button"
              className={`flex-1 min-w-[150px] py-4 px-6 text-sm font-bold transition-all duration-200 outline-none whitespace-nowrap ${
                activeTab === "refund" 
                  ? "bg-white text-rose-600 border-b-2 border-rose-500" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("refund")}
            >
              Refund Policy
            </button>
          </div>

          {/* Content Area */}
          <div className="p-2 sm:p-4 min-h-[60vh]">
            {activeTab === "privacy" && <PrivacyPolicy />}
            {activeTab === "terms" && <TermsAndConditions />}
            {activeTab === "community" && <Placeholder title="Community Guidelines" />}
            {activeTab === "refund" && <Placeholder title="Refund Policy" />}
          </div>
          
        </div>

        {/* Bottom Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
            © 2026 Luvios Entertainment • Last updated March 2026
          </p>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12" />
      </div>
    </div>
  );
}