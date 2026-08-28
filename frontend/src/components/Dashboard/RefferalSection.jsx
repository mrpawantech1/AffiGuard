import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'
import { Copy, Share2 } from 'lucide-react'

const ReferralSection = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total_referrals: 0,
    free_months_earned: 0,
    free_months_remaining: 0,
    referral_link: '',
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/referral/stats`, {
          withCredentials: true,
        })
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch referral stats:', err)
      }
    }
    if (user) fetchStats()
  }, [user])

  const copyLink = () => {
    navigator.clipboard.writeText(stats.referral_link)
    alert('Referral link copied!')
  }

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `AffiGuard use karo — affiliate links aur product pages 24/7 monitor karo. Mere referral link se sign up karo: ${stats.referral_link}`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  const shareTelegram = () => {
    const msg = encodeURIComponent(
      `AffiGuard — never lose money to broken affiliate links! Sign up: ${stats.referral_link}`
    )
    window.open(`https://t.me/share/url?url=${encodeURIComponent(stats.referral_link)}&text=${msg}`, '_blank')
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-xl font-bold">🎁 Refer &amp; Earn</h2>

      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-cyan">{stats.total_referrals}</div>
            <div className="text-text-muted text-xs">Total Referrals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-cyan">{stats.free_months_earned}</div>
            <div className="text-text-muted text-xs">Free Months Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-cyan">{stats.free_months_remaining}</div>
            <div className="text-text-muted text-xs">Months Remaining</div>
          </div>
        </div>

        <div className="text-text-muted text-sm font-semibold mb-2">Your Referral Link:</div>
        <div
          onClick={copyLink}
          className="flex items-center gap-2 bg-bg-card2 border border-border-subtle rounded-xl p-3 cursor-pointer hover:border-cyan transition-colors"
        >
          <span className="text-cyan font-mono text-sm truncate flex-1">{stats.referral_link || 'Loading…'}</span>
          <Copy className="w-4 h-4 text-text-muted flex-shrink-0" />
        </div>

        <div className="mt-4 bg-cyan-soft border border-cyan/20 rounded-xl p-4 text-sm text-text-secondary">
          🏆 <strong>Milestone Rewards:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside text-text-muted">
            <li><strong>5 paid referrals</strong> → 1 month free Pro</li>
            <li><strong>10 paid referrals</strong> → 2 months free (cumulative)</li>
            <li><strong>15 paid referrals</strong> → 3 months free, and more…</li>
          </ul>
          <div className="text-xs text-text-muted mt-2">Free months automatically extend your plan expiry.</div>
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <h4 className="font-bold text-sm mb-4">📤 Share Your Link</h4>
        <div className="flex flex-wrap gap-3">
          <button onClick={shareWhatsApp} className="btn-ghost px-4 py-2 text-sm">
            💬 WhatsApp
          </button>
          <button onClick={shareTelegram} className="btn-ghost px-4 py-2 text-sm">
            ✈️ Telegram
          </button>
          <button onClick={copyLink} className="btn-ghost px-4 py-2 text-sm">
            📋 Copy Link
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReferralSection
