import React from 'react';

const ModerationPolicy = () => {
  const supportEmail = "aethmeet@gmail.com";
  const effectiveDate = "March 7, 2026";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-rose-500 to-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-extrabold mb-2 text-white">Moderation Policy</h1>
          <p className="opacity-90">Effective Date: {effectiveDate}</p>
        </div>

        <div className="p-8 space-y-8">
          
          {/* 1. Introduction */}
          <section className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl">
            <h2 className="text-xl font-bold text-rose-700 mb-3">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              Aeth-Meet is committed to maintaining a safe, respectful, and positive environment for all users. 
              Aeth-Meet uses a combination of automated safety systems, community reporting tools, and limited 
              moderation review to detect policy violations and maintain platform safety. 
              <br /><br />
              <span className="font-bold text-slate-900">Private calls and chats are not actively monitored in real-time.</span>
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* 2. Types of Content Moderated */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-600">2. Types of Content Moderated</h2>
            <p>The moderation system covers all user-generated activity, including:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Live video streams & Private video calls</li>
              <li>Profile photos and bios</li>
              <li>Chat messages</li>
              <li>Virtual gifts and interactions</li>
              <li>Usernames and account information</li>
            </ul>
          </section>

          {/* 3. Prohibited Content */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-indigo-600">3. Prohibited Content</h2>
            <p>The following content is strictly prohibited on Aeth-Meet:</p>
            
            <div className="space-y-3">
              <p><span className="font-bold text-slate-900">Illegal Activities:</span></p>
              <ul className="list-disc pl-8 text-slate-600">
                <li>Human trafficking, child exploitation, drug trafficking, and fraud/scams.</li>
              </ul>

              <p><span className="font-bold text-slate-900">Sexual Exploitation:</span></p>
              <ul className="list-disc pl-8 text-slate-600">
                <li>Explicit sexual acts, nudity, pornographic content, or soliciting prostitution/escort services.</li>
              </ul>

              <p><span className="font-bold text-slate-900">Harassment and Abuse:</span></p>
              <ul className="list-disc pl-8 text-slate-600">
                <li>Bullying, threats, hate speech, discrimination, stalking, and blackmail.</li>
              </ul>

              <p><span className="font-bold text-slate-900">Platform Abuse:</span></p>
              <ul className="list-disc pl-8 text-slate-600">
                <li>Fake accounts, spam, coin/gift system manipulation, and bypassing payment systems.</li>
              </ul>
            </div>
          </section>

          {/* 4. Live Stream Monitoring */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">4. Live Stream Monitoring</h2>
            <p>Because Aeth-Meet supports live broadcasting:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Aeth-Meet may use automated AI-based safety tools to detect nudity, harassment, scams, or other policy violations.</li>
              <li>Live streams may be monitored in real time by automated systems and human moderators.</li>
              <li>Moderators may pause, restrict, or terminate a live stream if policy violations are detected.</li>
              <li>Repeated violations may result in temporary or permanent account suspension.</li>
            </ul>
          </section>

          {/* 5. User Reporting & Blocking */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">5. User Reporting & Blocking</h2>
            <p>
              Aeth-Meet provides an in-app reporting and blocking system to maintain a safe environment. 
              Users can access these options from the three-dot (⋮) menu on a user's profile page, 
              where the options "Report" and "Block" are available.
            </p>
            <p>
              The "Report" option allows users to report violations such as harassment,
              inappropriate content, scams, or abusive behavior. All reports are reviewed by the 
              Aeth-Meet moderation team.
            </p>
            <p>
              The "Block" option allows users to immediately prevent another user 
              from sending messages, initiating calls, or interacting with them on the platform.
            </p>
          </section>

          {/* 6. Report Categories */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">6. Report Categories</h2>
            <p>When reporting a user, Aeth-Meet may ask the reporting user to select a reason such as:</p>
            <ul className="list-disc pl-5 text-slate-600">
              <li>Harassment or abusive behavior</li>
              <li>Inappropriate live stream or video call content</li>
              <li>Spam or scam activity</li>
              <li>Fake profile or impersonation</li>
              <li>Hate speech or discrimination</li>
            </ul>
          </section>

          {/* 7. Enforcement Actions */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">7. Enforcement Actions</h2>
            <p>Depending on the severity of the violation, Aeth-Meet may take the following actions:</p>
            <ul className="list-disc pl-5 text-slate-600">
              <li>Content removal, warning notifications, or temporary feature restrictions.</li>
              <li>Temporary account suspension or permanent account termination.</li>
              <li>Reporting illegal activities to law enforcement when required.</li>
            </ul>
          </section>

          {/* 8. Appeals Process */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">8. Appeals Process</h2>
            <p>Users who believe their account or content was incorrectly moderated may submit an appeal by contacting support at <a href={`mailto:${supportEmail}`} className="text-rose-500 hover:underline">{supportEmail}</a>.</p>
          </section>

          {/* 9. Age Restrictions */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">9. Age Restrictions</h2>
            <p>Aeth-Meet is strictly limited to users 18 years and older. Accounts suspected of belonging to minors will be suspended/banned and may be subject to identity verification.</p>
          </section>

          {/* 10. Host Responsibilities */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">10. Host Responsibilities</h2>
            <p>
              Hosts who broadcast live content on Aeth-Meet must follow additional safety rules.
              Hosts are strictly prohibited from streaming explicit sexual content, nudity,
              illegal activities, harassment, or misleading promotions.
            </p>
          </section>

          {/* 11. Continuous Improvement */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">11. Continuous Improvement</h2>
            <p>Aeth-Meet continuously improves its moderation systems by updating detection technologies, expanding human moderator teams, and responding to community feedback to maintain a safe platform.</p>
          </section>

          {/* 12. User Responsibility */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">12. User Responsibility</h2>
            <p>
              Users are solely responsible for their behavior and interactions on the platform. 
              Aeth-Meet does not control or guarantee the behavior of other users.
            </p>
          </section>

          {/* 13. Privacy Protection */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-indigo-600">13. Privacy Protection</h2>
            <p>
              Users are strictly prohibited from recording, screenshotting, or distributing 
              private video calls, chats, or user content without consent.
            </p>
          </section>

          {/* Footer Text */}
          <div className="pt-8 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500 italic">
              By using Aeth-Meet, you agree to adhere to these moderation standards and our Community Guidelines.
            </p>
          </div>
        </div>
      </div>
      <div className="h-20" /> {/* Extra space for scrolling */}
    </div>
  );
};

export default ModerationPolicy;