import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const Help = () => {
  const [openItems, setOpenItems] = useState({})

  const toggle = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const faqGroups = [
    {
      title: 'Getting Started',
      items: [
        {
          id: 'getting-started',
          q: 'How do I get started with AffiGuard?',
          a: (
            <div className="space-y-2">
              <p>1. Create a free account at affiguard.com/signup</p>
              <p>2. Add up to 15 links to monitor (free plan)</p>
              <p>3. Set up your Telegram Chat ID for alerts (optional but recommended)</p>
              <p>4. Links are checked automatically twice daily (6 AM and 6 PM UTC)</p>
              <p>5. You'll receive Telegram alerts instantly when a status changes</p>
            </div>
          ),
        },
        {
          id: 'telegram',
          q: 'How do I find my Telegram Chat ID?',
          a: (
            <div className="space-y-2">
              <p><strong>Follow these steps to get your Telegram Chat ID:</strong></p>
              <p>1. Open Telegram and search for <strong>@userinfobot</strong></p>
              <p>2. Start a chat and send /start</p>
              <p>3. The bot will reply with your Chat ID (a number like 123456789)</p>
              <p>4. Copy this number and paste it in Dashboard → Settings → Telegram Chat ID</p>
              <p className="mt-2 text-text-muted text-sm">You must also start a chat with our bot first. The Telegram bot username is shown in your dashboard settings page.</p>
            </div>
          ),
        },
        {
          id: 'layers',
          q: 'What does "multi-layer" detection mean?',
          a: (
            <div className="space-y-2">
              <p><strong>Layer 1 – Direct HTTP:</strong> Fastest method. Makes a direct HTTP request with browser-like headers. Works for most websites.</p>
              <p><strong>Layer 2 – Smart Proxy Routing:</strong> Uses residential IP proxies to bypass bot detection. Renders JavaScript pages for accurate stock status.</p>
              <p><strong>Layer 3 – Headless Browser:</strong> Full Chromium browser as the final fallback. Handles complex single-page apps and CAPTCHA-protected pages.</p>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Link Monitoring',
      items: [
        {
          id: 'frequency',
          q: 'How often are my links checked?',
          a: (
            <div className="space-y-2">
              <p><strong>Free and Basic plans:</strong> Twice daily — approximately 6 AM and 6 PM UTC (11:30 AM and 11:30 PM IST).</p>
              <p><strong>Pro, Business, Agency plans:</strong> Can be set to hourly frequency per link via the Add Link modal.</p>
              <p>You can also trigger a manual check any time from your dashboard by clicking the "Check" button next to any link.</p>
            </div>
          ),
        },
        {
          id: 'false-positives',
          q: 'Why am I getting false "Out of Stock" alerts?',
          a: (
            <div className="space-y-2">
              <p>False positives can occur when:</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li>The product page contains out-of-stock text for related products or ads</li>
                <li>The website uses non-standard wording not in our keyword list</li>
                <li>The website is geo-restricted and shows different content</li>
                <li>Amazon or Flipkart returns a CAPTCHA page instead of the product page</li>
                <li>The page is dynamically loaded and our checker sees an incomplete version</li>
              </ul>
              <p className="mt-2">Contact us to report persistent false positives so we can improve our keyword patterns.</p>
            </div>
          ),
        },
        {
          id: 'amazon-broken',
          q: 'Why does my Amazon link show as "Out of Stock" when it works in my browser?',
          a: (
            <div className="space-y-2">
              <p>Amazon aggressively blocks automated requests. Here's what happens:</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li><strong>Layer 1 (Direct) gets blocked</strong> – It retries with Smart Proxy Network</li>
                <li><strong>Amazon "Dogs of Amazon" page</strong> – If we detect this, we mark it as "Out of Stock"</li>
                <li><strong>Sometimes it shows as "Error"</strong> – This means all layers failed, and we need to retry</li>
              </ul>
              <p className="mt-2">Amazon monitoring is challenging due to their anti-bot systems. Results may vary.</p>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Plans & Billing',
      items: [
        {
          id: 'expiry',
          q: 'What happens when my plan expires?',
          a: (
            <div className="space-y-2">
              <p>When your paid plan expires:</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li>Your account automatically reverts to the Free tier (15 link limit)</li>
                <li>Link monitoring is <strong>paused</strong> for links above the Free tier limit</li>
                <li>You'll receive a Telegram alert at 7, 3, 1 days before expiry and on the day it expires</li>
                <li>When you renew, monitoring resumes for all your links up to your new plan limit</li>
              </ul>
              <p className="mt-2"><strong>Your data is safe.</strong> We never delete your links or history due to plan expiry.</p>
            </div>
          ),
        },
        {
          id: 'security',
          q: 'Is my data safe?',
          a: (
            <div className="space-y-2">
              <p>Yes. We take data security seriously:</p>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li>Passwords are hashed using bcrypt — we never store plain-text passwords</li>
                <li>All communication is encrypted via HTTPS</li>
                <li>We use Supabase (PostgreSQL) hosted on secure infrastructure</li>
                <li>Session tokens are randomly generated and expire after inactivity</li>
                <li>We do not sell your data to third parties</li>
                <li>Check history is automatically deleted after 90 days</li>
              </ul>
              <p className="mt-2">See our <a href="/privacy" className="text-cyan hover:underline">Privacy Policy</a> for full details.</p>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Technical Questions',
      items: [
        {
          id: 'free-checker',
          q: 'The free checker shows a different result than my dashboard check. Why?',
          a: (
            <p>
              The free checker always uses Layer 1 only (direct HTTP) and has a rate limit. Dashboard checks use all available layers based on your plan. This means dashboard checks are generally more accurate, especially for complex sites.
            </p>
          ),
        },
        {
          id: 'rate-limit',
          q: 'What is the free checker rate limit?',
          a: (
            <p>
              The free checker allows up to 10 checks per hour per IP address. Creating a free account gives you unlimited manual checks from the dashboard and up to 15 monitored links.
            </p>
          ),
        },
      ],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <div className="text-center mb-12">
        <div className="section-eyebrow text-center">Support</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Help &amp; FAQ</h1>
        <p className="text-text-muted text-lg mt-4">Find answers to common questions about AffiGuard.</p>
      </div>

      <div className="space-y-8">
        {faqGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xl font-bold text-cyan mb-4 border-l-4 border-cyan pl-4">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.id} className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-bg-card2 transition-colors"
                  >
                    <span className="font-semibold">{item.q}</span>
                    {openItems[item.id] ? (
                      <ChevronUp className="w-5 h-5 text-cyan flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-cyan flex-shrink-0" />
                    )}
                  </button>
                  {openItems[item.id] && (
                    <div className="px-6 pb-5 pt-2 border-t border-border-subtle text-text-secondary leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-text-muted text-sm">
        Still have questions? <a href="/contact" className="text-cyan hover:underline">Contact us →</a>
      </div>
    </div>
  )
}

export default Help
