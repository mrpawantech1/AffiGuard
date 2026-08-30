import React from 'react'
import { Link2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const StatsBar = ({ links, onFilter, activeFilter, addToast }) => {
  const total = links.length
  const active = links.filter((l) => l.status === 'active').length
  const broken = links.filter((l) => l.status === 'broken').length
  const outOfStock = links.filter((l) => l.status === 'out_of_stock').length

  const stats = [
    {
      label: 'Total Links',
      value: total,
      filter: null,
      icon: Link2,
      color: 'text-cyan',
      bg: 'bg-cyan-soft/10',
      border: 'border-cyan/20',
    },
    {
      label: 'Active',
      value: active,
      filter: 'active',
      icon: CheckCircle,
      color: 'text-green',
      bg: 'bg-green-bg/10',
      border: 'border-green/20',
    },
    {
      label: 'Broken',
      value: broken,
      filter: 'broken',
      icon: XCircle,
      color: 'text-red',
      bg: 'bg-red-bg/10',
      border: 'border-red/20',
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      filter: 'out_of_stock',
      icon: AlertCircle,
      color: 'text-yellow',
      bg: 'bg-yellow-bg/10',
      border: 'border-yellow/20',
    },
  ]

  const handleClick = (filter) => {
    onFilter(filter)
    if (filter) {
      const label = stats.find((s) => s.filter === filter)?.label || filter
      const count = links.filter((l) => l.status === filter).length
      addToast(`Showing ${count} ${label} links`, 'info')
    } else {
      addToast('Showing all links', 'info')
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isActive = activeFilter === stat.filter
        return (
          <button
            key={stat.label}
            onClick={() => handleClick(stat.filter)}
            className={`group relative bg-bg-card border rounded-xl p-3 sm:p-4 transition-all duration-300 text-left ${
              isActive
                ? `${stat.border} ${stat.bg} shadow-[0_0_30px_rgba(0,229,255,0.05)]`
                : 'border-border-subtle hover:border-border-strong hover:-translate-y-0.5 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-text-muted text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className={`text-xl sm:text-2xl font-extrabold mt-0.5 ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
              <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            {isActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-cyan rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default StatsBar
