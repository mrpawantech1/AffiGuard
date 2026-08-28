import React from 'react'

const StatsBar = ({ links, onFilter, activeFilter }) => {
  const total = links.length
  const active = links.filter((l) => l.status === 'active').length
  const broken = links.filter((l) => l.status === 'broken').length
  const outOfStock = links.filter((l) => l.status === 'out_of_stock').length

  const stats = [
    { label: 'Total Links', value: total, filter: null },
    { label: 'Active', value: active, filter: 'active', color: 'text-green' },
    { label: 'Broken', value: broken, filter: 'broken', color: 'text-red' },
    { label: 'Out of Stock', value: outOfStock, filter: 'out_of_stock', color: 'text-yellow' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          onClick={() => onFilter(stat.filter)}
          className={`bg-bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-border-strong hover:-translate-y-1 ${
            activeFilter === stat.filter ? 'border-cyan shadow-[0_0_20px_rgba(0,229,255,0.1)]' : 'border-border-subtle'
          }`}
        >
          <div className="text-text-muted text-xs uppercase tracking-wider font-semibold flex justify-between">
            {stat.label}
            {stat.filter !== null && (
              <span className="text-[10px] opacity-60">click to filter</span>
            )}
          </div>
          <div className={`text-2xl font-extrabold ${stat.color || 'text-text-main'}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsBar
