import React from 'react'
import { Shield, Zap, Users, Heart } from 'lucide-react'

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="section-eyebrow text-center">Our Story</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About AffiGuard</h1>
        <p className="text-text-muted text-lg mt-4">
          Built for affiliate marketers, bloggers, and e-commerce businesses who can't afford broken links.
        </p>
      </div>

      {/* Content */}
      <div className="card space-y-8">
        <p className="text-text-secondary leading-relaxed">
          AffiGuard was built to solve a painful problem: affiliate marketers spending hours manually checking if their Amazon product links are still working — only to discover that a broken link has been silently losing commissions for weeks.
        </p>
        <p className="text-text-secondary leading-relaxed">
          We built a tool that does this automatically, checks multiple times per day, uses advanced detection layers to handle bot-blocking sites, and sends instant Telegram notifications the moment something goes wrong.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 bg-bg-card2 rounded-xl border border-border-subtle">
            <div className="w-12 h-12 bg-cyan-soft rounded-xl flex items-center justify-center text-cyan mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Our Mission</h3>
            <p className="text-text-muted text-sm mt-2">
              Make professional-grade link monitoring accessible to every content creator, affiliate marketer, and small business — not just enterprises with large budgets.
            </p>
          </div>

          <div className="p-6 bg-bg-card2 rounded-xl border border-border-subtle">
            <div className="w-12 h-12 bg-cyan-soft rounded-xl flex items-center justify-center text-cyan mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">What Makes Us Different</h3>
            <p className="text-text-muted text-sm mt-2">
              Most uptime monitors just check if a URL returns 200 OK. That's not enough. A product page can return 200 OK while showing "Currently Unavailable". We detect that.
            </p>
          </div>

          <div className="p-6 bg-bg-card2 rounded-xl border border-border-subtle">
            <div className="w-12 h-12 bg-cyan-soft rounded-xl flex items-center justify-center text-cyan mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Technology</h3>
            <p className="text-text-muted text-sm mt-2">
              AffiGuard is built with Python (Flask), PostgreSQL (Supabase), and modern JavaScript. Scheduled checks run via cron-job.org, hitting our backend every hour. Alerts are delivered through the Telegram Bot API with sub-second delivery.
            </p>
          </div>

          <div className="p-6 bg-bg-card2 rounded-xl border border-border-subtle">
            <div className="w-12 h-12 bg-cyan-soft rounded-xl flex items-center justify-center text-cyan mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Contact</h3>
            <p className="text-text-muted text-sm mt-2">
              Questions, feature requests, or bug reports? Reach us at{' '}
              <a href="/contact" className="text-cyan hover:underline">our contact page</a>{' '}
              or email support@affiguard.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
