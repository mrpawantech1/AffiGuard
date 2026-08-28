import React, { useState, useEffect } from 'react'
import { adminApi } from '../../utils/adminApi'
import { Loader2, Eye, Send, Ban, Trash2 } from 'lucide-react'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [page, search, planFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getUsers(page, search, planFilter)
      setUsers(data.users || [])
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async (userId, email) => {
    if (!confirm(`Suspend ${email}? Resets to Free plan, deactivates all links.`)) return
    await adminApi.suspendUser(userId, true)
    fetchUsers()
  }

  const handleDelete = async (userId, email) => {
    if (!confirm(`⚠️ PERMANENTLY delete ${email}? This cannot be undone.`)) return
    if (!confirm('All links, history, alerts will be deleted. Sure?')) return
    await adminApi.deleteUser(userId)
    fetchUsers()
  }

  const handleSendMessage = async (userId) => {
    const message = prompt('Enter message to send via Telegram:')
    if (message) {
      const result = await adminApi.sendMessage(userId, message)
      alert(result.sent ? '✅ Message sent!' : '❌ Failed to send.')
    }
  }

  const getPlanBadge = (plan) => {
    const map = {
      free: 'bg-bg-card2 text-text-muted',
      hobby: 'bg-cyan-soft text-cyan',
      pro_lite: 'bg-cyan-soft text-cyan',
      popular: 'bg-yellow-bg text-yellow',
      business: 'bg-green-bg text-green',
      agency: 'bg-purple-soft text-purple',
    }
    return map[plan] || map.free
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN')
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="flex-1 min-w-[200px] px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
        />
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
        >
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="hobby">Hobby</option>
          <option value="pro_lite">Pro Lite</option>
          <option value="popular">Popular</option>
          <option value="business">Business</option>
          <option value="agency">Agency</option>
        </select>
        <button onClick={fetchUsers} className="btn-ghost px-4 py-2">
          🔄
        </button>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-card2">
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Plan</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Joined</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Last Login</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Expiry</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Telegram</th>
              <th className="p-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-text-muted">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-text-muted">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-border-subtle hover:bg-bg-card2/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold">{user.email}</div>
                    <div className="text-text-muted text-sm">{user.full_name || ''}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPlanBadge(user.plan)}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-4 text-text-muted text-sm">{formatDate(user.join_date)}</td>
                  <td className="p-4 text-text-muted text-sm">{formatDate(user.last_login)}</td>
                  <td className="p-4 text-text-muted text-sm">{formatDate(user.plan_expiry)}</td>
                  <td className="p-4 text-center">{user.telegram_chat_id ? '✅' : '❌'}</td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleSendMessage(user.id)}
                        className="p-2 bg-bg-card2 border border-border-subtle rounded-lg hover:border-cyan transition-colors"
                        title="Send Message"
                      >
                        <Send className="w-4 h-4 text-cyan" />
                      </button>
                      <button
                        onClick={() => handleSuspend(user.id, user.email)}
                        className="p-2 bg-yellow-bg border border-yellow/25 rounded-lg hover:bg-yellow/20 transition-colors"
                        title="Suspend"
                      >
                        <Ban className="w-4 h-4 text-yellow" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.email)}
                        className="p-2 bg-red-bg border border-red/25 rounded-lg hover:bg-red/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red" />
                      </button>
                    </div>
                  </td>
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

export default AdminUsers
