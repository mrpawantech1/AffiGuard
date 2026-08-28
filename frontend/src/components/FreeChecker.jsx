import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const FreeChecker = () => {
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState('generic')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('affiguard_terms_accepted') === 'true'
    setTermsAccepted(accepted)
  }, [])

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please enter a URL to check.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/check-single`,
        { url: url.trim(), platform },
        { withCredentials: true }
      )
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      active: { label: 'Active', className: 'bg-green-bg text-green border-green/25' },
      broken: { label: 'Broken', className: 'bg-red-bg text-red border-red/25' },
      out_of_stock: { label: 'Out of Stock', className: 'bg-yellow-bg text-yellow border-yellow/25' },
      error: { label: 'Error', className: 'bg-red-bg text-red border-red/25' },
      pending: { label: 'Pending', className: 'bg-bg-card2 text-text-muted border-border-subtle' },
    }
    return map[status] || map.pending
  }

  if (!termsAccepted) {
    return (
      <section id="checker" className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="card text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Before you continue</h3>
            <p className="text-text-muted text-sm mb-6">
              To use the Free Link Checker, please read and accept our{' '}
              <a href="/terms" className="text-cyan hover:underline">Terms &amp; Conditions</a>{' '}
              and <a href="/privacy" className="text-cyan hover:underline">Privacy Policy</a>.
            </p>
            <button
              onClick={() => {
                localStorage.setItem('affiguard_terms_accepted', 'true')
                setTermsAccepted(true)
              }}
              className="btn-primary"
            >
              Accept &amp; Continue
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="checker" className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="card relative overflow-hidden">
          {/* Gradient line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan to-transparent"></div>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">🔍 Free Link Checker</h2>
            <p className="text-text-muted text-sm mt-2">Check any URL instantly — no signup required. 10 free checks per hour.</p>
          </div>

          <form onSubmit={handleCheck} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.amazon.in/dp/..."
                  className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
                  disabled={loading}
                />
              </div>
              <div>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all"
                  disabled={loading}
                >
                  <option value="generic">Generic</option>
                  <option value="amazon">Amazon</option>
                  <option value="flipkart">Flipkart</option>
                  <option value="shopify">Shopify</option>
                  <option value="etsy">Etsy</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full md:w-auto px-8 py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking…
                </>
              ) : (
                'Check Now'
              )}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-bg border border-red/25 rounded-xl text-red text-sm">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 p-6 bg-bg-card2 border border-border-subtle rounded-xl animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-lg">Result</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(result.status).className}`}>
                  {getStatusBadge(result.status).label}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <div className="text-text-muted text-xs uppercase tracking-wider">Response Time</div>
                  <div className="font-mono text-sm mt-1">{result.response_time ? `${result.response_time} ms` : '—'}</div>
                </div>
                <div>
                  <div className="text-text-muted text-xs uppercase tracking-wider">Detection Method</div>
                  <div className="font-mono text-sm mt-1">{result.layer_used || '—'}</div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-text-muted text-xs uppercase tracking-wider">URL Checked</div>
                  <div className="text-xs text-text-muted truncate mt-1 font-mono">{result.url}</div>
                </div>
              </div>

              {result.error && (
                <div className="mt-3 text-red text-sm">⚠️ {result.error}</div>
              )}

              <div className="mt-4 pt-4 border-t border-border-subtle text-center text-sm text-text-muted">
                Want to monitor this link automatically?{' '}
                <a href="/signup" className="text-cyan font-semibold hover:underline">Create a free account →</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FreeChecker
