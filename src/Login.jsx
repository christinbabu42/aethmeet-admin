import React, { useRef, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Note: Replace with your actual Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "647678003424-sct1je6u5s8fq497hcd96ercqjmtr5f3.apps.googleusercontent.com";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.aeth.videocallapp";

function LoginContent({ onLoginSuccess }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const downloadSectionRef = useRef(null);

  // Create a ref to trigger the hidden Google button
  const googleHiddenBtnRef = useRef(null);

  const handleAdminClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    // Trigger the official Google Login button programmatically
    const btn = document.querySelector('#hiddenGoogleBtn div[role="button"]');
    if (btn) {
      btn.click();
    } else {
      console.error("Google button not ready");
    }
  };

  const scrollToDownload = (e) => {
    if (e) e.preventDefault();
    downloadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadRedirect = () => {
    window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen w-full relative font-sans bg-gradient-to-b from-[#FFFFFF] via-[#FCFBF7] to-[#F7F3E8] text-slate-900 selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">

      {/* --- SUBTLE AMBIENT LUXURY GLOWS --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-[#F3E5AB]/30 blur-[120px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[140px]" />
      </div>

      {/* HIDDEN GOOGLE LOGIN COMPONENT (Used to get the ID Token) */}
      <div id="hiddenGoogleBtn" style={{ display: 'none' }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log("Login Success (ID Token):", credentialResponse);
            onLoginSuccess({
              idToken: credentialResponse.credential 
            });
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="w-full py-4 px-6 md:px-12 border-b border-[#D4AF37]/20 flex justify-between items-center sticky top-0 z-40 backdrop-blur-xl bg-white/85 shadow-[0_2px_20px_rgba(212,175,55,0.06)]">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={scrollToDownload}
        >
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#FFFDF7] to-[#F5EED8] border border-[#D4AF37]/30 shadow-sm group-hover:shadow-md transition-all">
            <img src="/logo.png" alt="Aeth-Meet Logo" className="h-7 w-auto" />
          </div>
          <span className="text-xl font-extrabold tracking-widest uppercase bg-gradient-to-r from-[#996515] via-[#C5A059] to-[#8A6D3B] bg-clip-text text-transparent">
            Helloza
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a 
            href="/support" 
            className="hidden md:block text-sm font-medium text-slate-600 hover:text-[#996515] transition-colors"
          >
            Support
          </a>

          <button
            onClick={handleDownloadRedirect}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#AA771C] hover:brightness-105 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Get App
          </button>

          {/* 3-Line Hamburger Button */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col gap-1.5 p-2.5 rounded-xl border border-[#D4AF37]/25 bg-white hover:bg-[#FCF9F0] transition-colors group shadow-2xs"
              aria-label="Menu"
            >
              <div className="w-5 h-0.5 bg-slate-700 group-hover:bg-[#B8860B] transition-colors"></div>
              <div className="w-5 h-0.5 bg-slate-700 group-hover:bg-[#B8860B] transition-colors"></div>
              <div className="w-5 h-0.5 bg-slate-700 group-hover:bg-[#B8860B] transition-colors"></div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-[0_15px_35px_rgba(184,134,11,0.15)] overflow-hidden py-1.5 z-50">
                <button 
                  onClick={handleAdminClick}
                  className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-gradient-to-r hover:from-[#FCF8EC] hover:to-[#F7EED3] hover:text-[#8A6D3B] transition-colors font-semibold flex items-center justify-between"
                >
                  Staff Only
                  <span className="text-[10px] font-bold bg-[#D4AF37]/15 text-[#996515] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full uppercase">
                    Login
                  </span>
                </button>
                <div className="h-px bg-[#D4AF37]/15 mx-3" />
                <button 
                  onClick={() => { 
                    setIsMenuOpen(false); 
                    handleDownloadRedirect(); 
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-[#FCF8EC] hover:text-[#996515] font-medium transition-colors flex items-center justify-between"
                >
                  Download App
                  <span className="text-xs text-[#B8860B]">↗</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col items-center justify-center relative px-6 pt-14 pb-24 z-10">
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
          
          {/* Luxury Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D4AF37]/35 shadow-2xs mb-8">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#996515]">
              Exclusive Live Connections
            </span>
          </div>

          {/* Center Emblem */}
          <div className="relative mb-8">
            <div className="absolute -inset-3 rounded-full blur-2xl bg-gradient-to-r from-[#D4AF37]/35 via-[#F3E5AB]/50 to-[#B8860B]/35" />
            <div className="relative p-5 rounded-3xl bg-white border border-[#D4AF37]/30 shadow-[0_12px_35px_rgba(212,175,55,0.18)]">
              <img 
                src="/logo.png" 
                alt="Aeth-Meet Logo" 
                className="h-20 w-20 object-contain opacity-0 animate-[fadeIn_1.5s_ease-in-out_forwards]"
              />
            </div>
          </div>

          <style>
            {`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
            `}
          </style>

          {/* Applied the Gold Styling & Font to Both Lines */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight leading-[1.15] mb-6">
            <span className="italic font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#996515] via-[#D4AF37] to-[#AA771C] drop-shadow-2xs">
              Where authentic
            </span> <br />
            <span className="italic font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#996515] via-[#D4AF37] to-[#AA771C] drop-shadow-2xs">
              connections come alive.
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed mb-12 font-normal">
            Step into a refined space designed for genuine conversations, face-to-face video moments, and unforgettable encounters.
          </p>

          {/* App Download Card */}
          <div 
            ref={downloadSectionRef}
            className="flex flex-col items-center p-8 sm:p-10 rounded-3xl bg-white/95 border border-[#D4AF37]/35 w-full max-w-2xl backdrop-blur-xl shadow-[0_20px_50px_rgba(184,134,11,0.10)] relative overflow-hidden"
          >
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            <p className="text-xs font-extrabold text-[#996515] uppercase tracking-[0.22em] mb-2">
              Experience Aeth-Meet on Mobile
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              Download the Official Android App
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 px-8 py-4 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#AA771C] text-white rounded-2xl hover:brightness-105 transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-[0_10px_25px_rgba(184,134,11,0.3)] font-bold text-base sm:text-lg"
              >
                {/* Google Play Icon SVG */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                <span>Get it on Google Play</span>
              </a>
            </div>

            {/* Compliance Section */}
            <div className="mt-8 pt-6 border-t border-[#D4AF37]/20 w-full">
              <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
                Aeth-Meet offers virtual 'Aeth Coins' as digital items for premium video calling and gifting. 
                Coins have no cash value, are non-refundable after use, and are consumed exclusively 
                within the app. Delivery is instant via Google Play Billing.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full py-8 px-6 border-t border-[#D4AF37]/20 flex flex-wrap justify-center gap-x-8 gap-y-3 bg-white/80 backdrop-blur-md relative z-10">
        <a href="/privacy" className="text-xs font-medium text-slate-600 hover:text-[#996515] transition-colors">Privacy Policy</a>
        <a href="/terms" className="text-xs font-medium text-slate-600 hover:text-[#996515] transition-colors">Terms & Conditions</a>
        <a href="/community-guidelines" className="text-xs font-medium text-slate-600 hover:text-[#996515] transition-colors">Community Guidelines</a>
        <a href="/moderation-policy" className="text-xs font-medium text-slate-600 hover:text-[#996515] transition-colors">Moderation Policy</a>
        <a href="/refund-policy" className="text-xs font-medium text-slate-600 hover:text-[#996515] transition-colors">Refund Policy</a>
        <a href="/delete-account" className="text-xs font-medium text-slate-600 hover:text-[#996515] transition-colors">Delete Account</a>

        <p className="text-xs text-slate-400 w-full text-center mt-3">
          © 2026 Aeth-Meet. Operated in India.
        </p>
      </footer>
    </div>
  );
}

// Wrapper component to provide Google Context
export default function Login(props) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent {...props} />
    </GoogleOAuthProvider>
  );
}