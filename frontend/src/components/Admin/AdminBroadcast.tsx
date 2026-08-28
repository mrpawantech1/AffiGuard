import React, { useState } from 'react'
import { adminApi } from '../../utils/adminApi'

const AdminBroadcast = () => {
  const [message, setMessage] = useState('')
  const [paidOnly, setPaidOnly] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleBroadcast = async () => {
    if (!message.trim()) {
      alert('Please enter a message.')
      return
    }
    if (!confirm(`Send to ${paidOnly ? 'paid' : 'ALL'} users with Telegram connected?`)) return

    setLoading(true)
    setResult(null)
    try {
      const data = await adminApi.broadcast(message, paidOnly)
      setResult(data)
    } catch (err) {
      setResult({ error: err.response?.data?.error || 'Broadcast failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📢 Broadcast</h2>

      <div className="bg-bg-card border border-border-subtle rounded-xl p-6 max-w-lg">
        <p className="text-text-muted text-sm mb-4">
          Send Telegram message to all users (or paid only) who have Telegram connected.
          HTML supported: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;a href="..."&gt;link&lt;/a&gt;
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="6"
          placeholder="Write your message..."
          className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all resize-vertical"
        />

        <div className="flex items-center gap-3 mt-4 mb-4">
          <input
            type="checkbox"
            checked={paidOnly}
            onChange={(e) => setPaidOnly(e.target.checked)}
            className="w-4 h-4 accent-cyan"
          />
          <label className="text-text-secondary text-sm cursor-pointer">Paid users only</label>
        </div>

        <button
          onClick={handleBroadcast}
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? 'Sending...' : 'Send Broadcast'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-bg-card2 border border-border-subtle rounded-xl text-sm">
            {result.error ? (
              <div className="text-red">❌ {result.error}</div>
            ) : (
              <div className="space-y-1 text-text-secondary">
                <div>✅ Sent: <span className="text-green font-bold">{result.sent}</span></div>
                <div>❌ Failed: <span className="text-red font-bold">{result.failed}</span></div>
                <div>⏭️ Skipped (no Telegram): <span className="text-text-muted">{result.skipped}</span></div>
                <div>📊 Total: {result.total}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBroadcast
