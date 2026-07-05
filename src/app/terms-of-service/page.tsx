"use client";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Effective Date: January 1, 2025</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing and using the AIOMS POS platform (&quot;Service&quot;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Description of Service</h2>
            <p className="text-slate-600 leading-relaxed">
              AIOMS POS is a cloud-based Point of Sale and shop management platform designed for mobile phone shops. 
              The Service includes inventory management, sales processing, repair ticketing, trade-in tracking, 
              and financial reporting features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Account Registration</h2>
            <p className="text-slate-600 leading-relaxed">
              You must provide accurate and complete information when creating an account. You are responsible for 
              maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Subscription & Payment</h2>
            <p className="text-slate-600 leading-relaxed">
              The Service offers a free trial period followed by paid subscription plans. Subscription fees are non-refundable 
              except as required by applicable law. We reserve the right to modify pricing with 30 days advance notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Ownership</h2>
            <p className="text-slate-600 leading-relaxed">
              You retain full ownership of all data you input into the Service. We will not sell, share, or distribute 
              your data to third parties without your explicit consent. You may export your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Acceptable Use</h2>
            <p className="text-slate-600 leading-relaxed">
              You agree not to use the Service for any unlawful purpose, attempt to gain unauthorized access to any 
              portion of the Service, or interfere with or disrupt the Service or servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              AIOMS POS shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              We may terminate or suspend your account at any time for violation of these terms. Upon termination, 
              your right to use the Service ceases immediately. You may request data export before termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the Service after changes 
              constitutes acceptance of the modified terms. We will notify users of material changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              For questions about these Terms, contact us at Telegram: @LordPainReborn or call +959 961 089 869.
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
