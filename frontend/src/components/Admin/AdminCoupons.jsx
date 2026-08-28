import React, { useState, useEffect } from 'react'
import { adminApi } from '../../utils/adminApi'
import { Loader2, Trash2 } from 'lucide-react'

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: '',
    type: 'free_months',
    value: 1,
    plan_grant: 'popular',
    max_uses: 1,
    expires_days: 30,
    note: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getCoupons()
      setCoupons(data.coupons || [])
    } catch (err) {
      console.error('Failed to fetch coupons:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    try {
      const result = await adminApi.createCoupon(form)
      setStatus({ type: 'success', message: `✅ Coupon created: ${result.code}` })
      setForm({ code: '', type: 'free_months', value: 1, plan_grant: 'popular', max_uses: 1, expires_days: 30, note: '' })
      fetchCoupons()
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to create coupon.' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this coupon?')) return
    await adminApi.deleteCoupon(id)
    fetchCoupons()
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🏷️ Coupons</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Form */}
        <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Create Coupon</h3>
          {status.message && (
            <div
              className={`p-3 rounded-xl text-sm mb-4 ${
                status.type === 'success'
                  ? 'bg-green-bg text-green border border-green/25'
                  : 'bg-red-bg text-red border border-red/25'
              }`}
            >
              {status.message}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="Code (leave blank to auto-generate)"
              className="w-full px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all uppercase"
            />
            <div className="flex gap-3">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="flex-1 px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
              >
                <option value="free_months">Free Months</option>
                <option value="plan_upgrade">Plan Upgrade</option>
              </select>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 1 })}
                placeholder="Value"
                className="w-24 px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
                min="1"
              />
            </div>
            {form.type === 'plan_upgrade' && (
              <select
                value={form.plan_grant}
                onChange={(e) => setForm({ ...form, plan_grant: e.target.value })}
                className="w-full px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
              >
                <option value="hobby">Hobby</option>
                <option value="pro_lite">Pro Lite</option>
                <option value="popular">Popular</option>
                <option value="business">Business</option>
                <option value="agency">Agency</option>
              </select>
            )}
            <div className="flex gap-3">
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: parseInt(e.target.value) || 1 })}
                placeholder="Max Uses"
                className="flex-1 px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
                min="1"
              />
              <input
                type="number"
                value={form.expires_days}
                onChange={(e) => setForm({ ...form, expires_days: parseInt(e.target.value) || 30 })}
                placeholder="Expires (days)"
                className="flex-1 px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
                min="1"
              />
            </div>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Note (optional)"
              className="w-full px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
            />
            <button type="submit" className="btn-primary w-full py-3">
              Create Coupon
            </button>
          </form>
        </div>

        {/* Coupon List */}
        <div>
          <h3 className="font-bold text-lg mb-4">Active Coupons</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-cyan" />
            </div>
          ) : coupons.length === 0 ? (
            <p className="text-text-muted text-sm">No coupons yet.</p>
          ) : (
            <div className="space-y-3">
              {coupons.map((c) => (
                <div key={c.id} className="bg-bg-card border border-border-subtle rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <code className="text-cyan font-bold text-lg">{c.code}</code>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 bg-red-bg border border-red/25 rounded-lg hover:bg-red/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red" />
                    </button>
                  </div>
                  <div className="text-text-muted text-sm mt-2">
                    {c.is_active ? '🟢' : '🔴'} {c.type} · Value: {c.value} · Used: {c.uses}/{c.max_uses} · Expires: {formatDate(c.expires_at)}
                    {c.note && <div className="text-xs mt-1">📝 {c.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCoupons
