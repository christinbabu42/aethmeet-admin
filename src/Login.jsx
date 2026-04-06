import React, { useRef, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Note: Replace with your actual Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "647678003424-sct1je6u5s8fq497hcd96ercqjmtr5f3.apps.googleusercontent.com";

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
    e.preventDefault();
    downloadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0F172A] font-sans selection:bg-rose-500 selection:text-white">
      
      {/* HIDDEN GOOGLE LOGIN COMPONENT (Used to get the ID Token) */}
      <div id="hiddenGoogleBtn" style={{ display: 'none' }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log("Login Success (ID Token):", credentialResponse);
            // ✅ Passing the 'credential' (ID Token) to your backend
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
      <nav className="w-full py-4 px-8 border-b border-white/10 flex justify-between items-center bg-[#0F172A] sticky top-0 z-40 backdrop-blur-md">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={scrollToDownload}
        >
          <img src="/logo1.png" alt="Aeth-Meet Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-tight text-white uppercase">Aeth-Meet</span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="/support" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Support</a>
          
          {/* 3-Line Hamburger Button */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors group"
              aria-label="Menu"
            >
              <div className="w-6 h-0.5 bg-gray-400 group-hover:bg-rose-400 transition-colors"></div>
              <div className="w-6 h-0.5 bg-gray-400 group-hover:bg-rose-400 transition-colors"></div>
              <div className="w-6 h-0.5 bg-gray-400 group-hover:bg-rose-400 transition-colors"></div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                <button 
                  onClick={handleAdminClick}
                  className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-rose-500 hover:text-white transition-colors font-medium flex items-center justify-between"
                >
                  Staff Only
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded uppercase">Login</span>
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); scrollToDownload(); }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors"
                >
                  Download App
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- BANNER SECTION --- */}
      <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/dating.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col items-center relative px-6 pb-20 -mt-20">
        <div className="absolute top-[20%] left-[5%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-rose-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-pink-500/40 via-purple-500/30 to-pink-500/40"></div>
            <img 
              src="/logo1.png" 
              alt="Aeth-Meet Logo" 
              className="relative h-24 w-24 object-contain opacity-0 animate-[fadeIn_2s_ease-in-out_forwards]"
            />
          </div>

          <style>
            {`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            `}
          </style>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Where meaningful <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">
              connections
            </span> begin.
          </h1>
          
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-12">
            Meet interesting people, start conversations, and create unforgettable moments. 
            Your next great story starts right here.
          </p>

          {/* App Links */}
          <div 
            ref={downloadSectionRef}
            className="flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 w-full max-w-2xl backdrop-blur-md shadow-2xl"
          >
            <p className="text-sm font-bold text-white uppercase tracking-widest mb-6">Experience Aeth-Meet on your phone</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#0F172A] rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                <span className="font-bold text-lg">App Store</span>
              </button>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#0F172A] rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                <span className="font-bold text-lg">Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full p-8 border-t border-white/5 flex flex-wrap justify-center gap-x-8 gap-y-3 bg-[#0F172A] z-10">
        <a href="/privacy" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Privacy Policy</a>
        <a href="/terms" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Terms & Conditions</a>
        <a href="/community-guidelines" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Community Guidelines</a>
        <a href="/moderation-policy" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Moderation Policy</a>
        <a href="/refund-policy" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Refund Policy</a>
        
          {/* ✅ ADD THIS */}
        <a href="/delete-account" className="text-xs text-gray-500 hover:text-rose-400 transition-colors">Delete Account</a>

        <p className="text-xs text-gray-600 w-full text-center mt-4">
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