import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'

const SettingsSection = ({ addToast }) => {
  const { user, fetchUser } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [telegramId, setTelegramId] = useState(user?.telegram_chat_id || '')
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' })

  const handleSave = async () => {
    setLoading(true)
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/user/settings`,
        { full_name: fullName, telegram_chat_id: telegramId },
        { withCredentials: true }
      )
      addToast('Settings saved!', 'success')
      fetchUser()
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to save.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code.' })
      return
    }
    setCouponLoading(true)
    setCouponMessage({ type: '', text: '' })
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/redeem-coupon`,
        { code: couponCode.trim().toUpperCase() },
        { withCredentials: true }
      )
      setCouponMessage({ type: 'success', text: res.data.message || 'Coupon applied!' })
      setCouponCode('')
      fetchUser()
      addToast('Coupon redeemed successfully!', 'success')
    } catch (err) {
      setCouponMessage({ type: 'error', text: err.response?.data?.error || 'Invalid coupon.' })
    } finally {
      setCouponLoading(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-xl font-bold">Account Settings</h2>

      {/* Profile */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4">
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

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* ─── COUPON SECTION ─── */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <h4 className="font-bold text-sm mb-2">🏷️ Redeem Coupon Code</h4>
        <p className="text-text-muted text-xs mb-3">
          Have a coupon? Enter it below to unlock free months or plan upgrades.
        </p>

        {couponMessage.text && (
          <div className={`p-3 rounded-xl text-sm mb-3 ${
            couponMessage.type === 'success'
              ? 'bg-green-bg text-green border border-green/25'
              : 'bg-red-bg text-red border border-red/25'
          }`}>
            {couponMessage.text}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="e.g. WELCOME30"
            className="flex-1 px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all uppercase"
          />
          <button
            onClick={handleRedeemCoupon}
            disabled={couponLoading}
            className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
          >
            {couponLoading ? '...' : 'Redeem'}
          </button>
        </div>
      </div>

      {/* ─── Telegram Guide ─── */}
      <div className="bg-bg-card2 border border-border-subtle rounded-xl p-6">
        <h4 className="font-bold text-sm mb-4">📱 Telegram Alerts Setup Guide</h4>
        <a
          href="https://t.me/AffiGuardProBot"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 bg-[#229ED9] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1a8fbf] transition-colors"
        >
          ✈️ Start AffiGuard Bot on Telegram
        </a>
        <ol className="mt-4 space-y-2 text-sm text-text-secondary list-decimal list-inside">
          <li>Click the button above to open AffiGuard Bot. Press <strong>START</strong>.</li>
          <li>
            Get your Chat ID from{' '}
            <a href="https://t.me/userinfobot" target="_blank" rel="noopener" className="text-cyan hover:underline">
              @userinfobot
            </a>
          </li>
          <li>Paste the ID above and click <strong>Save Settings</strong>.</li>
          <li>You'll now receive instant Telegram alerts! ✅</li>
        </ol>
      </div>
    </div>
  )
}

export default SettingsSection
