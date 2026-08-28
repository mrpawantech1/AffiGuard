import React, { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

const AddLinkModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    url: '',
    platform: 'generic',
    frequency: 'twice_daily',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.url) {
      setError('URL is required.')
      return
    }
    setLoading(true)
    setError('')
    const result = await onAdd(form)
    if (!result.success) {
      setError(result.error)
    } else {
      setForm({ name: '', url: '', platform: 'generic', frequency: 'twice_daily' })
      onClose()
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-bg-card border border-border-strong rounded-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add New Link</h3>
          <button onClick={onClose} className="p-2 hover:bg-bg-card2 rounded-lg transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-bg border border-red/25 rounded-xl text-red text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Link Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. My Amazon Product"
              className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              URL *
            </label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://www.amazon.in/dp/..."
              required
              className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Platform
            </label>
            <select
              name="platform"
              value={form.platform}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
            >
              <option value="generic">Generic / Other</option>
              <option value="amazon">Amazon</option>
              <option value="flipkart">Flipkart</option>
              <option value="shopify">Shopify</option>
              <option value="etsy">Etsy</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Check Frequency
            </label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
            >
              <option value="twice_daily">Every 12 hrs – Free</option>
              <option value="six_hourly">Every 6 hrs – Basic</option>
              <option value="two_hourly">Every 2 hrs – Pro</option>
              <option value="hourly">Every 1 hr – Business</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" onClick={onClose} className="btn-ghost px-6 py-2">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-6 py-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding…
                </>
              ) : (
                'Add Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLinkModal
