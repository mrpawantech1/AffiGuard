import React, { useState } from 'react'
import { Loader2, Trash2, RefreshCw, Search } from 'lucide-react'

const LinksTable = ({ links, onCheck, onDelete, loading }) => {
  const [checkingId, setCheckingId] = useState(null)

  const handleCheck = async (id) => {
    setCheckingId(id)
    await onCheck(id)
    setCheckingId(null)
  }

  const getStatusBadge = (status) => {
    const map = {
      active: { label: 'Active', className: 'bg-green-bg text-green border-green/25' },
      broken: { label: 'Broken', className: 'bg-red-bg text-red border-red/25' },
      out_of_stock: { label: 'Out of Stock', className: 'bg-yellow-bg text-yellow border-yellow/25' },
      error: { label: 'Error', className: 'bg-red-bg text-red border-red/25' },
      pending: { label: 'Pending', className: 'bg-bg-card2 text-text-muted border-border-subtle' },
    }
    return map[status] || map.pending
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    const now = new Date()
    const diff = (now - d) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan" />
        <span className="ml-3 text-text-muted">Loading your links...</span>
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-16 bg-bg-card border border-border-subtle rounded-xl">
        <div className="text-5xl mb-4">🔗</div>
        <h3 className="text-xl font-bold">No links yet</h3>
        <p className="text-text-muted text-sm mt-2">Add your first link to start monitoring.</p>
      </div>
    )
  }

  return (
    <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[780px]">
        <thead>
          <tr className="border-b border-border-subtle bg-bg-card2">
            <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
            <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
            <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Platform</th>
            <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Last Checked</th>
            <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Response</th>
            <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Method</th>
            <th className="text-left p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-b border-border-subtle hover:bg-bg-card2/50 transition-colors">
              <td className="p-4">
                <div className="font-semibold">{link.name || 'Unnamed'}</div>
                <div className="text-text-muted text-xs truncate max-w-[200px] font-mono">{link.url}</div>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(link.status).className}`}>
                  {getStatusBadge(link.status).label}
                </span>
              </td>
              <td className="p-4 text-text-muted text-sm">{link.platform || 'generic'}</td>
              <td className="p-4 text-text-muted text-sm">{formatDate(link.last_checked)}</td>
              <td className="p-4 font-mono text-sm">{link.response_time ? `${link.response_time}ms` : '—'}</td>
              <td className="p-4 text-text-muted text-sm">{link.layer_used || '—'}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCheck(link.id)}
                    disabled={checkingId === link.id}
                    className="p-2 bg-bg-card2 border border-border-subtle rounded-lg hover:border-cyan transition-colors disabled:opacity-50"
                    title="Check now"
                  >
                    {checkingId === link.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-cyan" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-text-muted" />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(link.id)}
                    className="p-2 bg-red-bg border border-red/25 rounded-lg hover:bg-red/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LinksTable
