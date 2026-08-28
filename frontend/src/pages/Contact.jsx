import React, { useState } from 'react'
import { Mail, Bug, Lock } from 'lucide-react'
import axios from 'axios'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Email and message are required.' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/feedback`,
        {
          name: formData.name,
          email: formData.email,
          message: `Subject: ${formData.subject || 'General'}\n\n${formData.message}`,
          rating: null,
        },
        { withCredentials: true }
      )
      setStatus({ type: 'success', message: '✅ Thank you! Your message has been sent.' })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="section-eyebrow text-center">Reach Out</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="text-text-muted text-lg mt-4">We typically respond within 24 hours on business days.</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl mb-3">📧</div>
          <h3 className="font-bold text-sm">Email Support</h3>
          <a href="mailto:support@affiguard.com" className="text-cyan text-sm hover:underline">support@affiguard.com</a>
          <p className="text-text-muted text-xs mt-2">General questions, billing, account issues</p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-3">🐛</div>
          <h3 className="font-bold text-sm">Bug Reports</h3>
          <a href="mailto:support@affiguard.com" className="text-cyan text-sm hover:underline">support@affiguard.com</a>
          <p className="text-text-muted text-xs mt-2">Technical issues, false alerts, detection problems</p>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-bold text-sm">Privacy &amp; Legal</h3>
          <a href="mailto:support@affiguard.com" className="text-cyan text-sm hover:underline">support@affiguard.com</a>
          <p className="text-text-muted text-xs mt-2">Data deletion requests and privacy concerns</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Send a Message</h2>

        {status.message && (
          <div className={`p-4 rounded-xl mb-4 text-sm ${
            status.type === 'success' ? 'bg-green-bg text-green border border-green/25' : 'bg-red-bg text-red border border-red/25'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
            >
              <option value="">Select a subject</option>
              <option value="billing">Billing / Subscription</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="account">Account Issue</option>
              <option value="privacy">Privacy / Data</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your issue or question..."
              required
              className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all resize-vertical"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-8 py-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Sending…
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact
