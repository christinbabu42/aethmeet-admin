import React from "react";

const TermsAndConditions = () => {
  const termsAndConditionsText = `
TERMS & CONDITIONS
Last Updated: March 2026

App Name: Aeth-Meet
Operated by: Aeth-Meet (Individual developer)
Jurisdiction: India

1. Eligibility (Age Restriction)
Aeth-Meet is strictly an 18+ platform. By using this service, you represent that you are at least 18 years of age. Minors are strictly prohibited.

2. Virtual Items (Coins)
• Definition: Coins are digital virtual items used exclusively within the platform.
• Bidirectional Gifting: Hosts and users may send virtual gifts to each other within the platform using coins.
• Platform-Limited Use: Virtual gifts are for entertainment purposes only and have no monetary value outside the platform.
• No Peer-to-Peer Money Transfer: The gifting system does not constitute money transfer services, financial services, or peer-to-peer payment functionality.
• Platform Control: All virtual item balances, transfers, and conversions are subject to platform rules and may be modified, reversed, or cancelled in cases of fraud, abuse, policy violations, or technical errors.
• No Real Value: They do not represent real currency, property, or financial investment and cannot be transferred outside the platform.
• No Cash Value: Coins cannot be withdrawn or exchanged for "real" money by users.

3. Refund Policy
• Finality: All coin purchases are final and non-refundable except where required by applicable law or Google Play policies.
• Disputes: In cases of payment disputes, refund abuse, or chargebacks, we reserve the right to suspend associated accounts pending investigation.

4. Host Earnings & Taxes
• Hosts may receive virtual gifts from users and may also send virtual gifts within the platform as part of platform engagement features.
• Internal Conversion: These virtual items may be converted internally for host payouts based on platform-specific policies.
• Tax Responsibility: Hosts are responsible for complying with applicable local tax laws regarding their earnings.
• Payout Discretion: We reserve the right to adjust, delay, or withhold payouts in cases of fraud, abuse, policy violations, or suspicious activity.

5. User Generated Content (UGC) & Moderation
• Disclaimer: User-generated content reflects the views of the individual users and not the platform.
• Monitoring: We use AI and human moderators to review content.
• Reporting: Users can report any violation using the in-app report button.
• Blocking: Users have the right to block any other user immediately.
• Enforcement: Violations may result in content removal, suspension, or permanent account termination at our discretion.

6. Live Streaming & Private Call Rules
Hosts and users must not:
• Broadcast nudity or sexually explicit content.
• Request or offer sexual acts in exchange for coins, gifts, or virtual compensation.
• Any attempt to exploit, manipulate, or pressure users for financial gain is strictly prohibited.
• Promote escorting, prostitution, or sexual services.
• Record, screenshot, or distribute any private call or live session without explicit consent from all participants.
• Engage in illegal activities or share personal contact details for off-platform communication.
• Harass, threaten, or exploit other users.

7. Community Guidelines
All users must comply with our Community Guidelines. These guidelines are legally binding, and violation constitutes a breach of these Terms.

8. Account Suspension
We reserve the right to suspend or terminate accounts that violate our policies or community guidelines without prior notice.

9. Payment Bypass Prohibition
Users and hosts must not share UPI IDs, QR codes, or bank details to negotiate off-platform payments. This results in a permanent ban.

10. Limitation of Liability
Aeth-Meet provides services "as is." We are not liable for damages arising from user interactions or platform downtime. We do not guarantee uninterrupted or error-free service and may suspend the platform temporarily for maintenance or security reasons.

11. Governing Law
These Terms shall be governed by and interpreted in accordance with the laws of the applicable jurisdiction in which the company operates, without regard to conflict of law principles.

12. Contact Us
For legal queries: aethmeet@gmail.com.
  `;

  return (
    <div className="flex-1 bg-slate-50 min-h-full">
      <div className="px-5 pt-5 pb-10 max-w-full overflow-hidden">
        {/* Card Container */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
          
          {/* Header Decoration (Gold Line) */}
          <div className="w-10 h-1 bg-[#C5A059] rounded-full mb-5" />
          
          {/* Content Text - preserved with whitespace formatting */}
          <pre className="whitespace-pre-wrap font-sans text-[15px] leading-[26px] text-slate-800 text-left tracking-wide">
            {termsAndConditionsText}
          </pre>
          
        </div>
        
        {/* Bottom Spacer */}
        <div className="h-10" />
      </div>
    </div>
  );
};

export default TermsAndConditions;