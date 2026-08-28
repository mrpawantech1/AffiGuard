import React, { useState, useEffect } from 'react'
import { adminApi } from '../../utils/adminApi'
import { Loader2 } from 'lucide-react'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [revenue, setRevenue] = useState({ usd: 0, inr: 0 })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    email: '',
    amount: '',
    currency: 'USD',
    plan: 'popular',
    months: 1,
    note: '',
  })
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    fetchPayments()
  }, [page])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getPayments(page)
      setPayments(data.payments || [])
      setTotalPages(data.total_pages || 1)
      setRevenue({ usd: data.revenue_usd || 0, inr: data.revenue_inr || 0 })
    } catch (err) {
      console.error('Failed to fetch payments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordPayment = async (e) => {
    e.preventDefault()
    setFormStatus({ type: '', message: '' })
    if (!form.email || !form.amount || !form.plan) {
      setFormStatus({ type: 'error', message: 'Email, amount, and plan are required.' })
      return
    }
    try {
      await adminApi.recordPayment({
        email: form.email,
        amount: parseFloat(form.amount),
        currency: form.currency,
        plan: form.plan,
        months: parseInt(form.months),
        note: form.note,
      })
      setFormStatus({ type: 'success', message: '✅ Payment recorded and plan updated.' })
      setForm({ email: '', amount: '', currency: 'USD', plan: 'popular', months: 1, note: '' })
      fetchPayments()
      setTimeout(() => setShowForm(false), 2000)
    } catch (err) {
      setFormStatus({ type: 'error', message: err.response?.data?.error || 'Failed to record payment.' })
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">💰 Payments</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 text-sm">
          {showForm ? '− Close' : '+ Record Payment'}
        </button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mb-6">
        <div className="bg-bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider font-semibold">Total USD</div>
          <div className="text-2xl font-extrabold text-green">${revenue.usd.toFixed(2)}</div>
        </div>
        <div className="bg-bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-text-muted text-xs uppercase tracking-wider font-semibold">Total INR</div>
          <div className="text-2xl font-extrabold text-yellow">₹{revenue.inr.toFixed(2)}</div>
        </div>
      </div>

      {/* Record Payment Form */}
      {showForm && (
        <div className="bg-bg-card border border-border-subtle rounded-xl p-6 mb-6 max-w-md">
          <h3 className="font-bold text-lg mb-4">Record Manual Payment</h3>
          {formStatus.message && (
            <div
              className={`p-3 rounded-xl text-sm mb-4 ${
                formStatus.type === 'success'
                  ? 'bg-green-bg text-green border border-green/25'
                  : 'bg-red-bg text-red border border-red/25'
              }`}
            >
              {formStatus.message}
            </div>
          )}
          <form onSubmit={handleRecordPayment} className="space-y-3">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="User Email"
              className="w-full px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
              required
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Amount"
                className="flex-1 px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
                required
                step="0.01"
              />
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <div className="flex gap-3">
              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="flex-1 px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
              >
                <option value="hobby">Hobby</option>
                <option value="pro_lite">Pro Lite</option>
                <option value="popular">Popular</option>
                <option value="business">Business</option>
                <option value="agency">Agency</option>
              </select>
              <input
                type="number"
                value={form.months}
                onChange={(e) => setForm({ ...form, months: e.target.value })}
                placeholder="Months"
                className="w-24 px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
                min="1"
                max="24"
              />
            </div>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Gateway / Note (optional)"
              className="w-full px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
            />
            <button type="submit" className="btn-primary w-full py-3">
              Record Payment
            </button>
          </form>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-card2">
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Amount</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Plan</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Gateway</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-text-muted">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  Loading...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-text-muted">No payments recorded yet.</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle hover:bg-bg-card2/50 transition-colors">
                  <td className="p-4">{p.users?.email || p.user_id || '—'}</td>
                  <td className="p-4 font-semibold">
                    {p.currency === 'INR' ? '₹' : '$'}{p.amount}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-soft text-cyan">
                      {p.plan}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted text-sm">{p.gateway || '—'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.status === 'paid' ? 'bg-green-bg text-green' : 'bg-yellow-bg text-yellow'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted text-sm">{formatDate(p.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-ghost px-4 py-2 text-sm disabled:opacity-50"
          >
            ‹
          </button>
          <span className="flex items-center px-4 text-text-muted text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="btn-ghost px-4 py-2 text-sm disabled:opacity-50"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminPayments
