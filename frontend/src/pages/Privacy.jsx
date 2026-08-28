import React from 'react'

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <div className="section-eyebrow text-center">Your Privacy</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-text-muted text-sm mt-4">Last updated: July 2026</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 md:p-8 space-y-8 text-text-secondary leading-relaxed">
        <p>AffiGuard ("we", "our", "Service") is committed to protecting your privacy. This Policy describes how we collect, use, and protect your information.</p>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">1. Information We Collect</h2>
          <p><strong>Account Information:</strong> When you register, we collect your email address, name (optional), and a hashed password. We never store your plain-text password.</p>
          <p className="mt-2"><strong>Link Data:</strong> URLs you add for monitoring, their names, platform tags, and check frequency preferences.</p>
          <p className="mt-2"><strong>Check History:</strong> Results of link checks including status, response times, and detection layer — kept for 90 days.</p>
          <p className="mt-2"><strong>Alert Preferences:</strong> Your Telegram Chat ID if you choose to enable Telegram alerts.</p>
          <p className="mt-2"><strong>Technical Data:</strong> IP addresses (for rate limiting), browser type, and usage analytics.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            <li>To perform link monitoring checks on your behalf</li>
            <li>To send you status change alerts via Telegram and email</li>
            <li>To send plan expiry notifications</li>
            <li>To improve our detection algorithms and service quality</li>
            <li>To enforce plan limits and prevent abuse</li>
            <li>To respond to your support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">3. Data Sharing</h2>
          <p>We do not sell your personal data. We share data only with:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-text-muted">
            <li><strong>Supabase:</strong> Our database provider (PostgreSQL hosting)</li>
            <li><strong>Smart Proxy Network:</strong> URLs you submit may be passed to our proxy network for advanced checking if enabled</li>
            <li><strong>Telegram:</strong> Your Chat ID and alert messages are sent via the Telegram Bot API</li>
            <li><strong>Render/Vercel:</strong> Hosting providers who may log request metadata</li>
          </ul>
          <p className="mt-2">All third-party providers are bound by their own privacy policies.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">4. Data Retention</h2>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            <li>Account data: Retained until you delete your account</li>
            <li>Link check history: 90 days rolling window</li>
            <li>Alert logs: 90 days</li>
            <li>IP rate limit data: 1 hour</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">5. Security</h2>
          <p>We use industry-standard security measures including HTTPS encryption, hashed passwords, and secure session management. However, no system is 100% secure. Report security issues to security@affiguard.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">6. Your Rights</h2>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            <li>Access, correct, or delete your personal data</li>
            <li>Export your link data</li>
            <li>Opt out of non-essential communications</li>
            <li>Delete your account at any time</li>
          </ul>
          <p className="mt-2">Contact us at the address below to exercise these rights.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">7. Cookies</h2>
          <p>We use a single session cookie to keep you logged in. No third-party tracking cookies are used.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">8. Changes</h2>
          <p>We may update this policy. Changes will be communicated via email or dashboard notice.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">9. Contact</h2>
          <p>For privacy questions: <a href="/contact" className="text-cyan hover:underline">contact us</a> or email privacy@affiguard.com</p>
        </section>
      </div>
    </div>
  )
}

export default Privacy
