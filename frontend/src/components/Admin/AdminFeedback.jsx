import React, { useState, useEffect } from 'react'
import { adminApi } from '../../utils/adminApi'
import { Loader2 } from 'lucide-react'

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFeedback()
  }, [page])

  const fetchFeedback = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getFeedback(page)
      setFeedback(data.feedback || [])
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      console.error('Failed to fetch feedback:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0))
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN')
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">💬 User Feedback</h2>

      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-card2">
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Name / Email</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Rating</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Message</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-text-muted">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  Loading...
                </td>
              </tr>
            ) : feedback.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-text-muted">No feedback yet.</td>
              </tr>
            ) : (
              feedback.map((f) => (
                <tr key={f.id} className="border-b border-border-subtle hover:bg-bg-card2/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold">{f.name || 'Anonymous'}</div>
                    <div className="text-text-muted text-sm">{f.email || ''}</div>
                  </td>
                  <td className="p-4 text-sm">{renderStars(f.rating)}</td>
                  <td className="p-4 text-sm max-w-xs">{f.message}</td>
                  <td className="p-4 text-text-muted text-sm">{formatDate(f.created_at)}</td>
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

export default AdminFeedback
