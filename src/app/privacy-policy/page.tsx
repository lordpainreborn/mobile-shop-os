"use client";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Effective Date: January 1, 2025</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed">
              We collect information you provide directly, including account registration details (name, email, shop name), 
              inventory data, sales transactions, repair ticket information, and trade-in records. We also collect 
              automatic information such as IP address, browser type, and usage patterns.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-slate-600 leading-relaxed">
              We use your information to provide and improve the Service, process transactions, send important account 
              notifications, and communicate with you about updates and support. Your data is used solely to operate 
              and enhance the AIOMS POS platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement industry-standard security measures including encryption in transit (HTTPS/TLS), 
              encrypted password storage (bcrypt), JWT session management, and regular security audits. 
              However, no method of electronic transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Sharing</h2>
            <p className="text-slate-600 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              anonymized, aggregated data that cannot identify you or your shop. We may share data only 
              when required by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Retention</h2>
            <p className="text-slate-600 leading-relaxed">
              We retain your data for as long as your account is active. Upon account deletion, we will 
              remove your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed">
              You have the right to access, correct, or delete your personal data. You may export all your data 
              at any time through the backup feature. For data-related requests, contact us via Telegram.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              We use essential cookies for session management and authentication. These cookies are necessary 
              for the Service to function and do not require consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Children&apos;s Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              The Service is not intended for use by children under 13. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Changes to Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes 
              via email or through the Service. Your continued use constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              For privacy-related inquiries, contact us at Telegram: @LordPainReborn or call +959 961 089 869.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <a href="/" className="text-blue-600 text-sm font-semibold hover:underline">
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
