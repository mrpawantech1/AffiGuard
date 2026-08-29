import React from 'react'
import { Globe, RefreshCw, Monitor, Bell, Tag, History } from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: 'Layer 1 – Direct HTTP',
    description: 'Lightning-fast initial request with custom browser headers. Catches 90% of broken links and out-of-stock pages in under 15 seconds.',
  },
  {
    icon: RefreshCw,
    title: 'Layer 2 – Smart Proxy Routing',
    description: 'Uses residential IP proxies to bypass bot detection on sites like Amazon and Flipkart. Renders JavaScript pages for accurate stock status.',
  },
  {
    icon: Monitor,
    title: 'Layer 3 – Headless Browser',
    description: 'Full Chromium browser as the final fallback. Handles complex single-page apps, dynamic AJAX content, and CAPTCHA-protected pages.',
  },
  {
    icon: Bell,
    title: 'Instant Telegram Alerts',
    description: 'Receive alerts within 1 second of status change. One alert per change — no spam, just actionable notifications.',
  },
  {
    icon: Tag,
    title: 'Smart Out-of-Stock Detection',
    description: 'Specialized pattern matching for Amazon, Flipkart, Shopify, and generic e-commerce. Detects "Sold Out", "Currently Unavailable", and more.',
  },
  {
    icon: History,
    title: '90-Day Check History',
    description: 'Full audit trail of every check. Track response times, detect patterns, and see exactly when your links changed status.',
  },
]

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-eyebrow">How it works</div>
          <h2 className="section-title">Enterprise-grade monitoring<br/>at indie prices</h2>
          <p className="section-subtitle mt-4">
            Three detection layers ensure nothing slips through — even for bot-protected sites.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card card-hover group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-cyan-soft rounded-xl flex items-center justify-center text-cyan group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Supported Platforms */}
        <div className="mt-16 card text-center">
          <div className="section-eyebrow text-center">Supported Platforms</div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['Amazon.in / .com', 'Flipkart', 'Shopify Stores', 'Etsy', 'WordPress / Blogs', 'WooCommerce', 'Any HTTP/HTTPS URL'].map((platform) => (
              <span
                key={platform}
                className="px-4 py-2 bg-cyan-soft text-cyan text-sm font-semibold rounded-full border border-cyan/20"
              >
                {platform}
              </span>
            ))}
          </div>
          <p className="text-text-muted text-sm mt-4">
            ⚠️ Detection accuracy varies by platform. See <a href="/terms" className="text-cyan hover:underline">Terms</a> for limitations.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Features
