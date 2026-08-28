import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'

const SettingsSection = () => {
  const { user, fetchUser } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [telegramId, setTelegramId] = useState(user?.telegram_chat_id || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/settings`,
        { full_name: fullName, telegram_chat_id: telegramId },
        { withCredentials: true }
      )
      setMessage({ type: 'success', text: 'Settings saved!' })
      fetchUser()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-bold">Account Settings</h2>

      {message.text && (
        <div
          className={`p-3 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-green-bg text-green border border-green/25'
              : 'bg-red-bg text-red border border-red/25'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-muted cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Telegram Chat ID
          </label>
          <input
            type="text"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            placeholder="e.g. 123456789"
            className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
          />
          <p className="text-text-muted text-xs mt-2">
            Required for instant alerts. See guide below ↓
          </p>
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {/* Telegram Setup Guide */}
      <div className="bg-bg-card2 border border-border-subtle rounded-xl p-6 mt-8">
        <h4 className="font-bold text-sm mb-4">📱 Telegram Alerts Setup Guide</h4>
        <a
          href="https://t.me/AffiGuardProBot"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 bg-[#229ED9] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1a8fbf] transition-colors"
        >
          ✈️ Start AffiGuard Bot on Telegram
        </a>
        <ol className="mt-4 space-y-3 text-sm text-text-secondary list-decimal list-inside">
          <li>Click the button above to open AffiGuard Bot. Press <strong>START</strong>.</li>
          <li>
            Get your Chat ID by messaging{' '}
            <a href="https://t.me/userinfobot" target="_blank" rel="noopener" className="text-cyan hover:underline">
              @userinfobot
            </a>{' '}
            and sending <code className="bg-bg-deep px-1.5 py-0.5 rounded text-xs">/start</code>.
          </li>
          <li>Paste that numeric ID in the <strong>Telegram Chat ID</strong> field above and click <strong>Save Settings</strong>.</li>
          <li>You'll now receive instant Telegram alerts when links break or go out of stock! ✅</li>
        </ol>
      </div>
    </div>
  )
}

export default SettingsSection
