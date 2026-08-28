import React from 'react'
import { X, CheckCircle, XCircle, MinusCircle } from 'lucide-react'

const TagGuardModal = ({ isOpen, onClose, results }) => {
  if (!isOpen) return null

  const warnings = results.filter((r) => r.tag_present === false).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-bg-card border border-border-strong rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">🏷️ Tag Guard Results</h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-card2 rounded-lg transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <div className={`text-lg font-semibold mb-4 ${warnings > 0 ? 'text-red' : 'text-green'}`}>
          {warnings > 0
            ? `⚠️ ${warnings} link(s) have missing affiliate tags!`
            : '✅ All affiliate tags are present.'}
        </div>

        <div className="space-y-3">
          {results.length === 0 ? (
            <p className="text-text-muted text-sm">No affiliate links to check.</p>
          ) : (
            results.map((r, idx) => {
              let icon, color, label
              if (r.tag_present === null) {
                icon = <MinusCircle className="w-5 h-5 text-text-muted" />
                color = 'text-text-muted'
                label = 'Not applicable'
              } else if (r.tag_present) {
                icon = <CheckCircle className="w-5 h-5 text-green" />
                color = 'text-green'
                label = `Tag found: ${r.tag_found}`
              } else {
                icon = <XCircle className="w-5 h-5 text-red" />
                color = 'text-red'
                label = 'Tag MISSING'
              }
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border border-border-subtle flex items-start gap-3 ${
                    r.tag_present === false ? 'bg-red-bg/10' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{r.link_name || r.url}</div>
                    <div className={`text-sm ${color}`}>{label}</div>
                    {r.final_url && r.final_url !== r.url && (
                      <div className="text-text-muted text-xs truncate mt-1">
                        Final: {r.final_url}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default TagGuardModal
