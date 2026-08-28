import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import { Loader2, CheckCircle } from 'lucide-react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { forgotPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    setError('')
    setSent(false)

    const result = await forgotPassword(email)
    if (result.success) {
      setSent(true)
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <AuthLayout backLink="/login">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green" />
          </div>
          <h2 className="text-xl font-bold">Check your inbox</h2>
          <p className="text-text-muted text-sm mt-2">
            If <span className="text-text-main font-semibold">{email}</span> is registered, a reset link has been sent.
          </p>
          <p className="text-text-muted text-sm mt-1">
            Didn't receive it? Check your spam folder or{' '}
            <button
              onClick={() => setSent(false)}
              className="text-cyan hover:underline font-semibold"
            >
              try again
            </button>
          </p>
          <Link to="/login" className="btn-primary w-full justify-center mt-6 py-3.5">
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email and we'll send you a reset link. It expires in 1 hour."
      backLink="/login"
    >
      {error && (
        <div className="p-3 bg-red-bg border border-red/25 rounded-xl text-red text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending…
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="text-center mt-6 text-sm text-text-muted">
        Remembered it?{' '}
        <Link to="/login" className="text-cyan font-semibold hover:underline">
          Back to Login →
        </Link>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword
