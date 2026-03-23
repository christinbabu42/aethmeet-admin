import React from 'react';

const DeliveryRefundCancellation = () => {
  const supportEmail = "luviospprt@gmail.com";
  const effectiveDate = "March 7, 2026";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-rose-500 to-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-extrabold mb-2 text-white">Delivery, Cancellation and Refund Policy</h1>
          <p className="opacity-90">Effective Date: {effectiveDate}</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Meta Info */}
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-6">
            <p><span className="font-bold text-slate-900">App Name:</span> Luvios</p>
            <p><span className="font-bold text-slate-900">Operated by:</span> Luvios Entertainment</p>
          </div>
          
          <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl">
            <p className="text-rose-900 leading-relaxed">
              <span className="font-bold">Important: </span>
              Users must be at least <span className="font-bold underline">18 years old</span> to use Luvios. 
              Luvios provides digital entertainment services including live streaming, private calls, and interactive gifting.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* 1. Delivery Policy */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-600">1. Delivery Policy</h2>
            <p>
              Luvios provides digital services and virtual goods exclusively within the application. 
              All purchases relate to digital entertainment services and virtual items delivered electronically.
            </p>
            <p>
              All purchases within Luvios relate strictly to digital goods and services. 
              No physical products are delivered to users.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><span className="font-bold text-slate-800">Instant Credit:</span> Purchased coins or virtual items are typically credited to the user's in-app wallet immediately.</li>
              <li><span className="font-bold text-slate-800">System Latency:</span> In rare cases of network congestion or provider delays, delivery may take up to 24 hours.</li>
              <li><span className="font-bold text-slate-800">Non-Delivery:</span> If items are not visible after 24 hours, users must contact support with valid proof of purchase.</li>
            </ul>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900 mb-2 underline">Scope of Virtual Goods:</p>
              <p className="mb-4">Includes Coins, Gifts, Premium features, Private call access, and Live stream interactions.</p>
              <p className="text-sm text-slate-500 italic leading-relaxed">
                Virtual currency (Coins) are digital items used only within the Luvios platform for entertainment services. 
                <span className="font-bold text-slate-700"> Coins purchased by users cannot be redeemed for real-world money, transferred between users, or used outside the Luvios platform.</span> They possess no real-world monetary value.
              </p>
            </div>
          </section>

          {/* 2. No Gambling Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">2. No Gambling or Betting</h2>
            <p>Luvios is an entertainment platform. Coins and virtual gifts are used only for social interaction, live streaming engagement, and appreciation of hosts.</p>
            <ul className="list-inside list-disc text-slate-600">
              <li>Luvios does not provide gambling, betting, or wagering services.</li>
              <li>Coins cannot be used to participate in games of chance.</li>
              <li>Users cannot exchange coins for real-world currency.</li>
            </ul>
          </section>

          {/* 3. Host Gifting & Earnings Transparency */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">3. Host Gifting & Earnings</h2>
            <p>
              Hosts may receive virtual gifts from users during live streams, private calls, or other interactions within the platform. 
              These gifts are converted into internal earnings based on the platform’s coin conversion system.
            </p>
            <p className="bg-indigo-50 p-4 rounded-lg text-indigo-900 border border-indigo-100">
              Host earnings are <span className="font-bold underline text-indigo-950">internal credits recorded within the Luvios platform based on virtual gifts received</span> and are subject to platform rules, safety verification, and compliance checks before any withdrawal or redemption is permitted.
            </p>
          </section>

          {/* 4. Gift Transactions */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">4. Gift Transactions</h2>
            <p>Virtual gifts sent during live streams, private calls, or chats are considered completed digital transactions.</p>
            <ul className="list-disc pl-5 text-slate-600">
              <li>All gifts sent are final and cannot be reversed or refunded.</li>
              <li>Users and hosts are responsible for confirming the gift before sending.</li>
              <li>Luvios cannot retrieve or return gifts once they have been delivered.</li>
            </ul>
          </section>

          {/* 5. Live Streaming Service Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">5. Live Streaming Service Disclaimer</h2>
            <p>Luvios provides a platform for hosts to broadcast live content and interact with users. The platform does not guarantee uninterrupted live sessions.</p>
            <ul className="list-disc pl-5 text-slate-600">
              <li>Live streams may be affected by internet connectivity or technical issues.</li>
              <li>Luvios is not responsible for interruptions caused by user devices or network failures.</li>
              <li>Coins spent during live interactions or calls are considered consumed once the session begins.</li>
            </ul>
          </section>

          {/* 6. Cancellation Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">6. Cancellation Policy</h2>
            <p>Once a purchase is completed through Google Play Billing, it cannot be cancelled from within the Luvios application.</p>
            <p className="font-semibold text-slate-900">By completing a payment, you acknowledge that consumption of the service begins immediately upon delivery.</p>
          </section>

          {/* 7. Refund Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">7. Refund Policy</h2>
            <p>Luvios maintains a strict policy regarding virtual goods. Refund requests are evaluated under specific exceptional circumstances.</p>
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl text-blue-900">
              Refund requests for purchases made through Google Play will be handled in accordance with Google Play’s refund policy. 
              Users should submit refund requests through their Google Play account. Luvios may assist users by verifying transaction issues 
              such as duplicate charges or technical failures.
            </div>
          </section>

          {/* 8. Payment Failures */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">8. Payment Failures</h2>
            <p>If a payment attempt fails, users should verify their Google Play account status before retrying.</p>
            <ul className="list-disc pl-5 text-slate-600">
              <li>If your account was charged but coins were not delivered, contact support with your Google Play transaction ID.</li>
              <li>Duplicate payments caused by technical errors may be eligible for refund after verification.</li>
            </ul>
          </section>

          {/* 9. Non-Refundable Situations */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">9. Non-Refundable Situations</h2>
            <p className="text-slate-600">Refunds will not be issued for coins that have already been used, gifts that have been sent, account termination due to policy violations, or purchases made by mistake after delivery.</p>
          </section>

          {/* 10. Payment Compliance */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">10. Payment Compliance</h2>
            <p>All in-app purchases are processed securely through <span className="font-bold text-slate-900">Google Play Billing</span>. Off-platform payment requests (UPI, bank details) are strictly prohibited and result in termination.</p>
          </section>

          {/* 11. Age Responsibility */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">11. Age Responsibility</h2>
            <p>Luvios services are intended strictly for users aged 18 years or older.</p>
            <ul className="list-disc pl-5 text-slate-600">
              <li>Users must ensure they meet the legal age requirement in their country.</li>
              <li>Accounts belonging to minors will be permanently suspended.</li>
              <li>Luvios may request age verification at any time.</li>
            </ul>
          </section>

          {/* 12. Contact & Support */}
          <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-inner">
            <h3 className="text-xl font-bold mb-4 text-white">12. Contact for Payment Issues</h3>
            <p className="mb-2"><span className="text-slate-400">Email:</span> <a href={`mailto:${supportEmail}`} className="text-rose-400 hover:underline">{supportEmail}</a></p>
            <p><span className="text-slate-400">Response Time:</span> 24 – 72 hours</p>
          </section>

          {/* 13. Policy Updates */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">13. Policy Updates</h2>
            <p className="text-slate-600">Luvios Entertainment reserves the right to update this policy. Updated versions will be posted within the app.</p>
          </section>

          {/* Footer Text */}
          <div className="pt-8 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500 italic">
              By using Luvios or purchasing coins, you agree to this Delivery, Cancellation and Refund Policy.
            </p>
          </div>
        </div>
      </div>
      <div className="h-20" /> {/* Extra space for scrolling */}
    </div>
  );
};

export default DeliveryRefundCancellation;