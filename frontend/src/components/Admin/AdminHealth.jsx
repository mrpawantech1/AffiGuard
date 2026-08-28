import React, { useState, useEffect } from 'react'
import { adminApi } from '../../utils/adminApi'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const AdminHealth = () => {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHealth()
  }, [])

  const fetchHealth = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getHealth()
      setHealth(data)
    } catch (err) {
      console.error('Failed to fetch health:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    if (status === 'ok') return <CheckCircle className="w-5 h-5 text-green" />
    if (status === 'configured' || status === 'not_configured') return <AlertCircle className="w-5 h-5 text-yellow" />
    return <XCircle className="w-5 h-5 text-red" />
  }

  const getStatusBadge = (status) => {
    const map = {
      ok: 'bg-green-bg text-green',
      configured: 'bg-cyan-soft text-cyan',
      not_configured: 'bg-bg-card2 text-text-muted',
      error: 'bg-red-bg text-red',
    }
    return map[status] || map.error
  }

  const labels = {
    database: '🗄️ Database',
    telegram: '📱 Telegram Bot',
    cron: '⏰ Cron',
    proxy_network: '🔍 Smart Proxy Network',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan" />
        <span className="ml-3 text-text-muted">Checking system health...</span>
      </div>
    )
  }

  const overall = health?.overall || 'unknown'

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🩺 System Health</h2>
        <button onClick={fetchHealth} className="btn-ghost px-4 py-2 text-sm">
          🔄 Check Now
        </button>
      </div>

      <div
        className={`p-4 rounded-xl mb-6 text-center ${
          overall === 'ok' ? 'bg-green-bg text-green border border-green/25' : 'bg-yellow-bg text-yellow border border-yellow/25'
        }`}
      >
        <div className="text-lg font-bold">
          {overall === 'ok' ? '🟢 All systems OK' : '🟡 System Degraded'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(health?.checks || {}).map(([key, value]) => (
          <div key={key} className="bg-bg-card border border-border-subtle rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{labels[key] || key}</span>
              {getStatusIcon(value.status)}
            </div>
            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(value.status)}`}>
              {value.status}
            </span>
            {value.bot_username && (
              <div className="text-text-muted text-sm mt-2">@ {value.bot_username}</div>
            )}
            {value.last_run && (
              <div className="text-text-muted text-sm mt-2">
                Last: {new Date(value.last_run).toLocaleString()}
              </div>
            )}
            {value.error && (
              <div className="text-red text-sm mt-2">{value.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminHealth
