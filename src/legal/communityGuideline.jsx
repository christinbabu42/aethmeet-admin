import React from 'react';

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100">
      {/* Container to mimic the ScrollView/Padding */}
      <div className="max-w-4xl mx-auto px-5 py-10 sm:px-10">
        
        {/* Formal Header Section */}
        <header className="border-b-2 border-slate-100 pb-5 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
            📜 Aeth-Meet – COMMUNITY GUIDELINES & TERMS OF SERVICE
          </h1>
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Effective Date: March 2026</span>
            <span className="text-xs font-semibold text-slate-500">Platform: Aeth-Meet</span>
            <span className="text-xs font-semibold text-slate-500">Category: Live Entertainment & Interactive Streaming</span>
            <span className="text-xs font-semibold text-slate-500">Operated by: Aeth-Meet (Individual developer)</span>
            <span className="text-xs font-semibold text-slate-500 tracking-wide">Jurisdiction: India</span>
          </div>
        </header>

        {/* 1. Introduction */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            1. INTRODUCTION
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            At Aeth-Meet, our mission is to create a safe and engaging live entertainment environment where users and hosts can interact respectfully. We prioritize:
          </p>
          <div className="pl-2 mb-4 space-y-1">
            {['Safety', 'Trust', 'Authenticity', 'Transparency'].map((item) => (
              <p key={item} className="text-sm font-bold text-blue-800">• {item}</p>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-slate-600 italic">
            These Community Guidelines define what is allowed and prohibited on Aeth-Meet. Private calls and chats are not continuously monitored in real time.
            However, automated safety systems and user reports may trigger moderation review.
          </p>
        </section>

        {/* 2. Eligibility */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            2. ELIGIBILITY & AGE POLICY
          </h2>
          <p className="text-sm font-black text-red-600 underline decoration-red-600 mb-2 italic">
            Aeth-Meet is strictly 18+. Minors are not permitted under any circumstances.
          </p>
          <p className="text-sm text-slate-600 mb-2">We enforce this through:</p>
          <ul className="list-none pl-2 mb-4 space-y-1">
            <li className="text-sm text-slate-600">• Automated age detection systems</li>
            <li className="text-sm text-slate-600">• Manual moderation and account review</li>
            <li className="text-sm text-slate-600">• Identity verification (KYC) mechanisms</li>
          </ul>
          <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
            <p className="text-sm text-red-800 font-semibold leading-relaxed">
              Accounts suspected of underage usage will be permanently terminated. We maintain a zero-tolerance policy for child exploitation.
            </p>
          </div>
        </section>

        {/* 3. Live Streaming */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            3. LIVE STREAMING POLICY
          </h2>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">Live streaming is the core feature of Aeth-Meet. All sessions must adhere to the following:</p>
          
          <h3 className="text-sm font-bold text-slate-700 mt-5 mb-2">3.1 Allowed Live Content</h3>
          <ul className="list-none pl-2 mb-4 space-y-1">
            <li className="text-sm text-slate-600">• Talent performances (Singing, dancing, etc.)</li>
            <li className="text-sm text-slate-600">• Casual hosting and storytelling</li>
            <li className="text-sm text-slate-600">• Interactive social sessions</li>
            <li className="text-sm text-slate-600">• Non-explicit engagement</li>
          </ul>

          <h3 className="text-sm font-bold text-slate-700 mt-5 mb-2">3.2 Strictly Prohibited Content</h3>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
            {[
              'Nudity or near nudity (underwear, bikinis, transparent clothing)',
              'Sexually suggestive poses or behavior',
              'Explicit sexual acts or simulations',
              'Adult services promotion or escort solicitation',
              'Sharing personal contact details, QR codes, or UPI IDs',
              'Display of drugs or weapons',
              'Hate speech and violent acts'
            ].map((item, index) => (
              <p key={index} className="text-xs font-semibold text-slate-500">
                ❌ {item}
              </p>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 italic mt-3">
            Violations may result in immediate termination, loss of earnings, and legal reporting.
          </p>
        </section>

        {/* 4. Private Call Policy */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            4. PRIVATE CALL POLICY
          </h2>
          <p className="text-sm text-slate-600 mb-2">Private calls are intended for entertainment and social engagement. They are NOT for:</p>
          <ul className="list-none pl-2 space-y-1">
            <li className="text-sm text-slate-600">• Sexual services or prostitution</li>
            <li className="text-sm text-slate-600">• Payment negotiation or off-platform arrangements</li>
            <li className="text-sm text-red-600 font-bold uppercase tracking-tight underline">
              • Recording without explicit consent (Strictly Prohibited)
            </li>
          </ul>
        </section>

        {/* 5. Reporting and Blocking */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            5. REPORTING & BLOCKING SYSTEMS
          </h2>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">To maintain a safe environment, Aeth-Meet provides robust tools for users to manage their experience:</p>
          
          <h3 className="text-sm font-bold text-slate-700 mt-4 mb-1">5.1 Reporting Mechanism</h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">Users can report any stream, message, or profile that violates these guidelines by clicking the "Report" icon. Our safety team reviews reports 24/7.</p>

          <h3 className="text-sm font-bold text-slate-700 mt-4 mb-1">5.2 User Blocking</h3>
          <p className="text-sm text-slate-600 leading-relaxed">You have the right to block any user at any time. Blocking prevents the user from viewing your profile, joining your live streams, or sending you messages.</p>
        </section>

        {/* 6. Child Safety */}
        <section className="bg-red-800 p-6 rounded-xl mb-10 shadow-lg border border-red-950">
          <h2 className="text-xl font-black text-white mb-4 uppercase">
            6. CHILD SAFETY POLICY
          </h2>
          <p className="text-xs font-black text-red-200 mb-2 tracking-widest uppercase">ZERO TOLERANCE FOR:</p>
          <div className="space-y-1 mb-4">
            <p className="text-sm text-white font-medium">• Sexual content involving minors</p>
            <p className="text-sm text-white font-medium">• Sharing/requesting sexual images of minors</p>
            <p className="text-sm text-white font-medium">• Promotion of pedophilia</p>
          </div>
          <p className="text-sm text-white font-black pt-3 border-t border-red-700 tracking-wide">
            ACTION: IMMEDIATE ACCOUNT TERMINATION & POLICE REPORTING.
          </p>
        </section>

        {/* 12 - 13 Financials */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            12. COIN & PAYMENT POLICY
          </h2>
          <p className="text-sm text-slate-600 mb-2">12.1 Coins are digital virtual items with no real-world monetary value.</p>
          <p className="text-sm text-slate-600 mb-4">12.2 All purchases must comply with Google Play Billing Policy.</p>
          
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mt-3">
            <h3 className="text-sm font-black text-amber-900 mb-1">13. PAYMENT BYPASS PROHIBITION</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              Sharing UPI IDs or bank details for off-platform payments will result in a <span className="underline font-black">PERMANENT BAN</span>.
            </p>
          </div>
        </section>

        {/* 14. Host Gifting */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            14. HOST GIFTING POLICY
          </h2>
          <ul className="list-none pl-2 space-y-2">
            <li className="text-sm text-slate-600">• Hosts may send virtual gifts to users using Coins.</li>
            <li className="text-sm text-slate-600">• Host-sent gifts do NOT increase host withdrawal eligibility.</li>
            <li className="text-sm text-slate-600 font-medium">• Artificial coin circulation, self-gifting, coordinated gifting, or coin manipulation is strictly prohibited.</li>
            <li className="text-sm text-slate-600">• Any attempt to inflate earnings through secondary accounts will result in permanent suspension and forfeiture of earnings.</li>
          </ul>
        </section>

        {/* 15. Coin Disclaimer */}
        <section className="mb-10 bg-slate-50 border border-slate-200 p-5 rounded-lg">
          <h2 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
            15. COIN VALUE & EARNINGS DISCLAIMER
          </h2>
          <div className="space-y-2">
            <p className="text-[13px] text-slate-600 leading-relaxed">• Coins are digital virtual items and do not represent real currency.</p>
            <p className="text-[13px] text-slate-600 leading-relaxed">• Displayed INR value is an estimated conversion for transparency purposes only.</p>
            <p className="text-[13px] text-slate-600 leading-relaxed">• Aeth-Meet reserves the right to modify coin conversion rates at any time.</p>
            <p className="text-[13px] text-slate-600 leading-relaxed">• Final withdrawal amounts may vary based on platform fees, taxes, and compliance deductions.</p>
          </div>
        </section>

        {/* 17. Data and Privacy */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            17. DATA & PRIVACY SUMMARY
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We collect Account info, Device identifiers, Usage data, and Live stream content. We do NOT sell personal data.
          </p>
        </section>

        {/* 18. Google Play Billing */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-blue-700 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wide">
            18. GOOGLE PLAY BILLING COMPLIANCE
          </h2>
          <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
            <p className="text-sm text-red-800 font-bold leading-relaxed">
              All digital purchases must be completed through Google Play Billing. External methods (UPI, Paytm) are prohibited.
            </p>
          </div>
        </section>

        {/* Footer Terms */}
        <footer className="border-t border-slate-200 pt-8 mt-10 space-y-6">
          <div>
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">20. LIMITATION OF LIABILITY</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-tighter">Aeth-Meet provides services "as is" and is not responsible for individual user interactions.</p>
          </div>
          
          <div>
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">21. POLICY UPDATES</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-tighter">Aeth-Meet reserves the right to update these policies. Continued use constitutes acceptance.</p>
          </div>
          
          <p className="text-center text-[10px] font-black text-slate-300 tracking-[0.3em] py-5">
            © 2026 Aeth-Meet
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CommunityGuidelines;