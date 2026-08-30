import React, { useState } from 'react'
import { Loader2, Trash2, RefreshCw, AlertCircle, CheckCircle, XCircle, Link2 } from 'lucide-react'

const LinksTable = ({ links, onCheck, onDelete, loading, addToast }) => {
  const [checkingId, setCheckingId] = useState(null)

  const handleCheck = async (id) => {
    setCheckingId(id)
    await onCheck(id)
    setCheckingId(null)
  }

  const getStatusBadge = (status) => {
    const map = {
      active: { label: 'Active', icon: CheckCircle, className: 'bg-green-bg/10 text-green border-green/20' },
      broken: { label: 'Broken', icon: XCircle, className: 'bg-red-bg/10 text-red border-red/20' },
      out_of_stock: { label: 'Out of Stock', icon: AlertCircle, className: 'bg-yellow-bg/10 text-yellow border-yellow/20' },
      error: { label: 'Error', icon: XCircle, className: 'bg-red-bg/10 text-red border-red/20' },
      pending: { label: 'Pending', icon: Link2, className: 'bg-bg-card2 text-text-muted border-border-subtle' },
    }
    return map[status] || map.pending
  }

  const getResponseColor = (ms) => {
    if (!ms) return 'text-text-muted'
    if (ms < 1000) return 'text-green'
    if (ms < 3000) return 'text-yellow'
    return 'text-red'
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
      <div className="bg-bg-card border border-border-subtle rounded-xl p-4 sm:p-6">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4 animate-pulse">
              <div className="h-4 w-24 sm:w-32 bg-bg-card2 rounded" />
              <div className="h-4 w-16 sm:w-20 bg-bg-card2 rounded" />
              <div className="h-4 w-12 sm:w-16 bg-bg-card2 rounded" />
              <div className="h-4 w-16 sm:w-24 bg-bg-card2 rounded" />
              <div className="h-8 w-8 bg-bg-card2 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="bg-bg-card border border-border-subtle rounded-xl p-8 sm:p-12 text-center">
        <div className="text-5xl sm:text-6xl mb-4 opacity-30">🔗</div>
        <h3 className="text-lg sm:text-xl font-bold">No links yet</h3>
        <p className="text-text-muted text-sm mt-2 max-w-sm mx-auto">
          Add your first link to start monitoring. We'll check it automatically and alert you if anything changes.
        </p>
        <button
          onClick={() => document.querySelector('[data-add-link]')?.click()}
          className="btn-primary mt-6 px-6 py-3 text-sm"
        >
          + Add Your First Link
        </button>
      </div>
    )
  }

  // ── Desktop Table View ──────────────────────────────────────
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-card2">
                <th className="text-left p-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="text-left p-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left p-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Platform</th>
                <th className="text-left p-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Last Checked</th>
                <th className="text-left p-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Response</th>
                <th className="text-left p-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const status = getStatusBadge(link.status)
                const StatusIcon = status.icon
                const responseColor = getResponseColor(link.response_time)
                const isChecking = checkingId === link.id

                return (
                  <tr
                    key={link.id}
                    className="border-b border-border-subtle hover:bg-bg-card2/40 transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-semibold text-sm">{link.name || 'Unnamed'}</div>
                      <div className="text-text-muted text-xs truncate max-w-[160px] font-mono">{link.url}</div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="p-3 text-text-muted text-xs">{link.platform || 'generic'}</td>
                    <td className="p-3 text-text-muted text-xs">{formatDate(link.last_checked)}</td>
                    <td className="p-3">
                      <span className={`font-mono text-xs ${responseColor}`}>
                        {link.response_time ? `${link.response_time}ms` : '—'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCheck(link.id)}
                          disabled={isChecking}
                          className={`p-1.5 rounded-lg border transition-all duration-200 ${
                            isChecking
                              ? 'bg-bg-card2 border-border-subtle cursor-not-allowed'
                              : 'bg-bg-card2 border-border-subtle hover:border-cyan hover:bg-cyan-soft/20'
                          }`}
                          title="Check now"
                        >
                          {isChecking ? (
                            <Loader2 className="w-4 h-4 animate-spin text-cyan" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
                          )}
                        </button>
                        <button
                          onClick={() => onDelete(link.id)}
                          className="p-1.5 bg-red-bg/20 border border-red/25 rounded-lg hover:bg-red-bg/40 transition-all duration-200 group"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Card View ──────────────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {links.map((link) => {
          const status = getStatusBadge(link.status)
          const StatusIcon = status.icon
          const responseColor = getResponseColor(link.response_time)
          const isChecking = checkingId === link.id

          return (
            <div
              key={link.id}
              className="bg-bg-card border border-border-subtle rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{link.name || 'Unnamed'}</div>
                  <div className="text-text-muted text-xs truncate font-mono">{link.url}</div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ml-2 ${status.className}`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>{link.platform || 'generic'}</span>
                <span>•</span>
                <span>{formatDate(link.last_checked)}</span>
                <span>•</span>
                <span className={responseColor}>
                  {link.response_time ? `${link.response_time}ms` : '—'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
                <button
                  onClick={() => handleCheck(link.id)}
                  disabled={isChecking}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isChecking
                      ? 'bg-bg-card2 text-text-muted cursor-not-allowed'
                      : 'bg-bg-card2 hover:bg-bg-card2/80 text-text-main'
                  }`}
                >
                  {isChecking ? (
                    <Loader2 className="w-4 h-4 animate-spin text-cyan" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Check
                </button>
                <button
                  onClick={() => onDelete(link.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-red-bg/20 text-red hover:bg-red-bg/40 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default LinksTable
