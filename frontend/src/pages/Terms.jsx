import React from 'react'

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <div className="section-eyebrow text-center">Legal</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="text-text-muted text-sm mt-4">Last updated: July 2026</p>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 md:p-8 space-y-8 text-text-secondary leading-relaxed">
        <p>Welcome to AffiGuard ("Service", "we", "our"). By accessing or using our Service, you agree to be bound by these Terms of Service. Please read them carefully.</p>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">1. Description of Service</h2>
          <p>AffiGuard is a web-based link monitoring service that automatically checks URLs for availability, broken link status, and product out-of-stock conditions. We provide automated checks, status reporting, and alerts via Telegram and email.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">2. Supported Link Types</h2>
          <p>Our Service is designed to monitor the following types of URLs:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-text-muted">
            <li>Amazon India (amazon.in) and Amazon.com product pages</li>
            <li>Flipkart product listings</li>
            <li>Shopify-based e-commerce stores</li>
            <li>Etsy listings</li>
            <li>WordPress and blog pages</li>
            <li>WooCommerce store products</li>
            <li>Generic HTTP/HTTPS URLs (websites, landing pages, etc.)</li>
          </ul>
          <p className="mt-2 text-sm text-text-muted"><strong>Important:</strong> Monitoring accuracy varies significantly by platform and website. We make no guarantee that our service will work for every website or URL type.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">3. Limitations and Disclaimers</h2>
          <p><strong>NO GUARANTEE OF ACCURACY:</strong> AffiGuard does not guarantee 100% accuracy in detecting broken links, out-of-stock status, or any other link condition. False positives and false negatives can and do occur.</p>
          <p className="mt-2"><strong>FALSE ALERTS:</strong> Certain websites, particularly large e-commerce platforms with aggressive bot-detection, may cause false alerts.</p>
          <p className="mt-2"><strong>UNSUPPORTED SITES:</strong> Many websites actively block automated requests. Checks on such sites may fail, return incorrect results, or be inconsistent.</p>
          <p className="mt-2"><strong>NETWORK AND THIRD-PARTY DEPENDENCIES:</strong> Our monitoring relies on third-party services including Smart Proxy Network and Playwright. Downtime or changes in these services may affect monitoring accuracy.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">4. User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            <li>Only monitor URLs you have the legal right to access</li>
            <li>Not use the Service to conduct denial-of-service attacks or overload websites</li>
            <li>Comply with the Terms of Service of websites you monitor</li>
            <li>Not use the Service for illegal purposes</li>
            <li>Keep your account credentials secure and not share them</li>
            <li>Provide accurate information during registration</li>
            <li>Not attempt to circumvent plan limits or rate limits</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">5. Subscription Plans and Payments</h2>
          <p><strong>Free Plan:</strong> Available indefinitely with a limit of 15 monitored links and basic features. No payment required.</p>
          <p className="mt-2"><strong>Paid Plans:</strong> Pro, Business, and Agency plans are billed monthly. Subscription fees are non-refundable except where required by law.</p>
          <p className="mt-2"><strong>Plan Expiry:</strong> Upon expiry of a paid plan, your account automatically reverts to Free tier limits. Links exceeding the Free tier limit (15) will be paused — not deleted.</p>
          <p className="mt-2"><strong>Price Changes:</strong> We reserve the right to change pricing with 30 days' notice. Existing subscriptions will honour the original price until renewal.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">6. Disclaimer of Warranties</h2>
          <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">7. Limitation of Liability</h2>
          <p>TO THE FULLEST EXTENT PERMITTED BY LAW, AFFIGUARD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
          <p className="mt-2">Our total liability to you for any claims arising from use of the Service shall not exceed the amount you paid for the Service in the three months preceding the claim.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">8. Data and Privacy</h2>
          <p>We collect and process data as described in our <a href="/privacy" className="text-cyan hover:underline">Privacy Policy</a>. We store your monitored URLs and check history for up to 90 days. You can delete your data at any time through your account settings or by contacting us.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">9. Termination</h2>
          <p>We reserve the right to terminate or suspend your account at any time for violation of these Terms. You may delete your account at any time by contacting us at the email below.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">10. Changes to Terms</h2>
          <p>We may modify these Terms at any time. Significant changes will be communicated via email or a dashboard notice. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-cyan mb-3">11. Contact</h2>
          <p>For questions about these Terms, contact us at: <a href="/contact" className="text-cyan hover:underline">contact page</a> or email: support@affiguard.com</p>
          <p className="mt-2">Governing law: These Terms are governed by the laws of India.</p>
        </section>
      </div>
    </div>
  )
}

export default Terms
