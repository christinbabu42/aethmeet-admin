import React from "react";

const PrivacyPolicy = () => {
  const privacyPolicyText = `
PRIVACY POLICY
Last Updated: March 2026

App Name: Aeth-Meet
Operated by: Aeth-Meet (Individual developer)
Jurisdiction: India

1. Introduction
We value your privacy. This policy explains how Aeth-Meet collects and safeguards your data. Aeth-Meet is strictly for users aged 18 and above.

2. Information Collection
We collect:
• Identity: Name, email, and phone number.
• Profile Information: Profile photos, usernames, and content voluntarily shared during live sessions or chats.
• Messages & Communications: Content of chats or live interactions may be processed for moderation, safety, and fraud prevention.
• Transaction Data: Coin purchase history, transaction IDs, and usage records for billing, fraud prevention, and dispute resolution.
• Moderation Data: Report history, block lists, enforcement actions, and safety-related logs.
• Host Verification Data: Government ID and KYC details for hosts receiving payouts (if applicable).
• Media: Access to Camera and Microphone.
• Technical: Device identifiers used for fraud prevention, security, and performance optimization.

3. Camera & Microphone Usage
• Usage: Accessed only during active live streaming or private calls.
• Background: We do NOT access your camera or mic in the background.
• Consent: No audio or video is recorded or stored on our servers without your explicit consent.

4. Live Streaming & Content Storage
• Processing: Live sessions are temporarily processed through secure servers for streaming delivery.
• Storage: We do not permanently store live video content unless required for safety investigations, fraud prevention, or legal compliance.
• Moderation: Reported content may be retained for moderation review.

5. Payment Processing
• Billing: All coin purchases are processed securely through Google Play Billing.
• Security: We do not store or have access to your credit card or bank details.

6. Use of Information & Analytics
We may use third-party analytics services to understand usage patterns and improve user experience. These services collect anonymized technical data and do not access private communications.

7. Data Retention & Deletion
• Retention: We retain your data only as long as your account is active.
• Deletion: Users can permanently delete their account directly from in-app settings.
• Timeline: Deletion requests are processed within 30 days unless retention is required for fraud prevention, safety investigations, or legal compliance.

8. Security
We implement professional encryption and security measures to protect your data against unauthorized access.

9. Data Safety Transparency
The data we collect is used solely for providing core platform functionality, security, fraud prevention, and improving user experience. We do not sell, rent, or trade personal data to third parties for marketing or advertising purposes.

10. Third-Party Services
We may use trusted third-party providers for:
• Payment processing (Google Play Billing)
• Cloud hosting and streaming infrastructure
• Analytics services
• Fraud prevention and security monitoring
These providers only access data necessary to perform their services and are contractually obligated to protect user data.

11. Children's Privacy
Aeth-Meet is strictly for users 18+. If we discover that a minor has created an account, the account will be immediately terminated and associated data removed.

12. Legal Basis for Processing (GDPR)
We process personal data based on: User consent, contractual necessity, legal obligations, and legitimate interests such as fraud prevention and platform safety.

13. Contact Us
For privacy queries: aethmeet@gmail.com.
  `;

  return (
    <div className="flex-1 bg-slate-50 min-h-full">
      <div className="px-5 pt-5 pb-10 max-w-full overflow-hidden">
        {/* Card Container (Equivalent to styles.card) */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
          
          {/* Header Decoration (Equivalent to styles.headerDecoration) */}
          <div className="w-10 h-1 bg-[#C5A059] rounded-full mb-5" />
          
          {/* Content Text - Using pre-wrap to keep your string formatting */}
          <pre className="whitespace-pre-wrap font-sans text-[15px] leading-[26px] text-slate-800 text-left tracking-wide">
            {privacyPolicyText}
          </pre>
          
        </div>
        
        {/* Bottom Spacer */}
        <div className="h-10" />
      </div>
    </div>
  );
};

export default PrivacyPolicy;