import React, { useState, useEffect } from 'react'
import { adminApi } from '../../utils/adminApi'
import { Loader2, RefreshCw } from 'lucide-react'

const AdminLinks = () => {
  const [links, setLinks] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [page, statusFilter])

  const fetchLinks = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getAdminLinks(page, statusFilter)
      setLinks(data.links || [])
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      console.error('Failed to fetch links:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRecheck = async (linkId) => {
    await adminApi.recheckLink(linkId)
    fetchLinks()
  }

  const getStatusBadge = (status) => {
    const map = {
      active: 'bg-green-bg text-green',
      broken: 'bg-red-bg text-red',
      out_of_stock: 'bg-yellow-bg text-yellow',
      error: 'bg-red-bg text-red',
      pending: 'bg-bg-card2 text-text-muted',
    }
    return map[status] || map.pending
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-IN')
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Links</h2>

      <div className="flex gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="broken">Broken</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="error">Error</option>
          <option value="pending">Pending</option>
        </select>
        <button onClick={fetchLinks} className="btn-ghost px-4 py-2">
          🔄
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-card2">
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Name / URL</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Platform</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Last Checked</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Action</th>
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
            ) : links.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-text-muted">No links found.</td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.id} className="border-b border-border-subtle hover:bg-bg-card2/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold">{link.name}</div>
                    <div className="text-text-muted text-xs truncate max-w-[200px] font-mono">{link.url}</div>
                  </td>
                  <td className="p-4 text-sm">
                    {link.users?.email || '—'}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      link.users?.plan === 'free' ? 'bg-bg-card2 text-text-muted' : 'bg-cyan-soft text-cyan'
                    }`}>
                      {link.users?.plan || '?'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(link.status)}`}>
                      {link.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted text-sm">{link.platform || 'generic'}</td>
                  <td className="p-4 text-text-muted text-sm">{formatDate(link.last_checked)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRecheck(link.id)}
                      className="p-2 bg-bg-card2 border border-border-subtle rounded-lg hover:border-cyan transition-colors"
                      title="Recheck"
                    >
                      <RefreshCw className="w-4 h-4 text-cyan" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

export default AdminLinks
