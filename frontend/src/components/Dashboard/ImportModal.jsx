import React, { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

const ImportModal = ({ isOpen, onClose, onCrawl, onAddLinks }) => {
  const [pageUrl, setPageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [crawlData, setCrawlData] = useState(null)
  const [selected, setSelected] = useState({})
  const [error, setError] = useState('')

  const handleCrawl = async () => {
    if (!pageUrl) {
      setError('Please enter a page URL.')
      return
    }
    setLoading(true)
    setError('')
    const result = await onCrawl(pageUrl)
    if (result.success) {
      setCrawlData(result.data)
      // Select all new links by default
      const initialSelected = {}
      result.data.found.forEach((item, idx) => {
        if (!item.already_added) {
          initialSelected[idx] = true
        }
      })
      setSelected(initialSelected)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const toggleSelect = (idx) => {
    setSelected((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const selectAll = () => {
    const all = {}
    crawlData.found.forEach((_, idx) => {
      if (!crawlData.found[idx].already_added) {
        all[idx] = true
      }
    })
    setSelected(all)
  }

  const deselectAll = () => {
    setSelected({})
  }

  const handleAddSelected = async () => {
    const itemsToAdd = crawlData.found.filter((_, idx) => selected[idx])
    if (itemsToAdd.length === 0) {
      alert('Select at least one link.')
      return
    }
    let added = 0,
      failed = 0
    for (const item of itemsToAdd) {
      const result = await onAddLinks({
        name: item.name,
        url: item.url,
        platform: item.platform,
      })
      if (result.success) added++
      else failed++
    }
    alert(`Added ${added} links${failed ? `, ${failed} failed` : ''}`)
    if (added > 0) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-bg-card border border-border-strong rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">📥 Import Affiliate Links</h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-card2 rounded-lg transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <p className="text-text-muted text-sm mb-4">
          Paste your blog post URL, YouTube description page, or any page with affiliate links.
          We'll find all Amazon, Flipkart, and other affiliate links automatically.
          <span className="text-text-secondary font-semibold"> You choose which ones to add.</span>
        </p>

        {error && (
          <div className="p-3 bg-red-bg border border-red/25 rounded-xl text-red text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="url"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            placeholder="https://yourblog.com/best-phones-2024"
            className="flex-1 px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
          />
          <button
            onClick={handleCrawl}
            disabled={loading}
            className="btn-primary px-6 py-3 whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Find Links'
            )}
          </button>
        </div>

        {crawlData && (
          <div className="mt-4">
            <div className="text-sm text-text-muted mb-2">
              Found <strong>{crawlData.found.length}</strong> affiliate links{' '}
              {crawlData.total_on_page && `from ${crawlData.total_on_page} total links`}
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {crawlData.found.map((item, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    item.already_added ? 'opacity-50 border-border-subtle bg-bg-card2' : 'border-border-subtle hover:border-cyan/30 cursor-pointer'
                  } transition-colors`}
                >
                  <input
                    type="checkbox"
                    checked={!!selected[idx]}
                    onChange={() => toggleSelect(idx)}
                    disabled={item.already_added}
                    className="mt-1 w-4 h-4 accent-cyan"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-text-muted text-xs truncate">{item.url}</div>
                    <span className="inline-block text-[10px] bg-cyan-soft text-cyan px-2 py-0.5 rounded-full mt-1">
                      {item.platform}
                    </span>
                    {item.already_added && (
                      <span className="ml-2 text-xs text-text-muted">Already added</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={selectAll} className="btn-ghost px-4 py-2 text-sm">
                Select All
              </button>
              <button onClick={deselectAll} className="btn-ghost px-4 py-2 text-sm">
                Deselect All
              </button>
              <button onClick={handleAddSelected} className="btn-primary px-4 py-2 text-sm ml-auto">
                Add Selected
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportModal
