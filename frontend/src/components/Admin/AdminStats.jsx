import React, { useState, useEffect } from 'react'
import { adminApi } from '../../utils/adminApi'
import { Loader2 } from 'lucide-react'

const AdminStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats()
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan" />
        <span className="ml-3 text-text-muted">Loading stats...</span>
      </div>
    )
  }

  const statItems = [
    { label: 'Total Users', value: stats?.total_users || 0, color: 'text-cyan' },
    { label: 'Joined Today', value: stats?.new_today || 0, color: 'text-green' },
    { label: 'Paid Users', value: stats?.paid_users || 0, color: 'text-yellow' },
    { label: 'Free Users', value: stats?.free_users || 0, color: 'text-text-muted' },
    { label: 'Active Links', value: stats?.total_links || 0, color: 'text-cyan' },
    { label: 'Alerts (7d)', value: stats?.alerts_7d || 0, color: 'text-green' },
  ]

  const planColors = {
    free: 'bg-text-muted',
    hobby: 'bg-cyan',
    pro_lite: 'bg-cyan',
    popular: 'bg-yellow',
    business: 'bg-green',
    agency: 'bg-purple',
  }

  const planLabels = {
    free: 'Free',
    hobby: 'Hobby',
    pro_lite: 'Pro Lite',
    popular: 'Popular',
    business: 'Business',
    agency: 'Agency',
  }

  const planCounts = stats?.plan_counts || {}
  const maxPlanCount = Math.max(1, ...Object.values(planCounts))

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statItems.map((stat) => (
          <div key={stat.label} className="bg-bg-card border border-border-subtle rounded-xl p-4">
            <div className="text-text-muted text-xs uppercase tracking-wider font-semibold">{stat.label}</div>
            <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Plan Breakdown */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6 max-w-md">
        <div className="font-bold text-sm mb-4">Plan Breakdown</div>
        <div className="space-y-3">
          {Object.entries(planCounts).map(([plan, count]) => (
            <div key={plan} className="flex items-center gap-3">
              <div className="w-20 text-text-muted text-sm">{planLabels[plan] || plan}</div>
              <div className="flex-1 bg-bg-card2 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${planColors[plan] || 'bg-cyan'}`}
                  style={{ width: `${(count / maxPlanCount) * 100}%` }}
                />
              </div>
              <div className="text-text-muted text-sm w-8 text-right">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminStats
