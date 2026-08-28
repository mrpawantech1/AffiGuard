import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'

const plans = [
  {
    key: 'free',
    name: 'Free',
    inr: 0,
    usd: 0,
    links: 15,
    frequency: 'Every 12 hrs',
    features: [
      '15 monitored links',
      'Every 12-hour checks',
      'Broken link detection',
      'Out-of-stock detection',
      'Telegram alerts (under 1 min)',
      '7-day check history',
      'Direct HTTP layer',
    ],
    nope: ['Smart proxy routing', 'Email alerts'],
  },
  {
    key: 'basic',
    name: 'Basic',
    inr: 499,
    usd: 15,
    links: 50,
    frequency: 'Every 6 hrs',
    popular: false,
    features: [
      '50 monitored links',
      'Every 6-hour checks',
      'Broken & out-of-stock detection',
      'Telegram alerts (instant)',
      'Email alerts ✉️',
      '90-day check history',
      'HTTP + Smart Proxy layers',
    ],
    nope: [],
  },
  {
    key: 'pro',
    name: 'Pro',
    inr: 1299,
    usd: 35,
    links: 150,
    frequency: 'Every 2 hrs',
    popular: true,
    features: [
      '150 monitored links',
      'Every 2-hour checks',
      'Broken & out-of-stock detection',
      'Telegram alerts (instant)',
      'Email alerts ✉️',
      '90-day check history',
      'HTTP + Smart Proxy + Headless Browser',
      'Priority support',
    ],
    nope: [],
  },
  {
    key: 'business',
    name: 'Business',
    inr: 3999,
    usd: 99,
    links: 500,
    frequency: 'Every 1 hr',
    popular: false,
    features: [
      '500+ monitored links',
      'Every 1-hour checks',
      'Broken & out-of-stock detection',
      'Telegram alerts (instant)',
      'Email alerts ✉️',
      '90-day check history',
      'HTTP + Smart Proxy + Headless Browser',
      'Dedicated account manager',
    ],
    nope: [],
  },
]

const Pricing = () => {
  const [currency, setCurrency] = useState('INR')

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="section-eyebrow">Pricing</div>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-subtitle mt-4">Start free. Upgrade when you need more links.</p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-bg-card p-1 rounded-full border border-border-subtle">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                currency === 'INR' ? 'bg-cyan text-black' : 'text-text-muted hover:text-text-main'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                currency === 'USD' ? 'bg-cyan text-black' : 'text-text-muted hover:text-text-main'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const price = currency === 'INR' ? plan.inr : plan.usd
            const sym = currency === 'INR' ? '₹' : '$'

            return (
              <div
                key={plan.key}
                className={`card relative flex flex-col ${
                  plan.popular ? 'border-cyan shadow-[0_0_30px_rgba(0,229,255,0.15)]' : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan text-black text-xs font-extrabold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="text-lg font-bold">{plan.name}</div>
                <div className="mt-2">
                  {price === 0 ? (
                    <div className="text-4xl font-extrabold">Free</div>
                  ) : (
                    <div className="text-4xl font-extrabold">
                      <sup className="text-xl -top-4">{sym}</sup>{price}
                    </div>
                  )}
                  <div className="text-text-muted text-sm mt-1">
                    {price === 0 ? 'Forever free' : 'per month'}
                  </div>
                </div>

                <div className="mt-6 space-y-3 flex-grow">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.nope.map((f) => (
                    <div key={f} className="flex items-start gap-3 text-sm text-text-muted">
                      <X className="w-4 h-4 text-red flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/signup"
                  className={`mt-8 w-full text-center py-3 rounded-lg font-bold transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : price === 0
                      ? 'btn-secondary'
                      : 'btn-ghost'
                  }`}
                >
                  {price === 0 ? 'Get Started Free' : `Choose ${plan.name}`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Pricing
