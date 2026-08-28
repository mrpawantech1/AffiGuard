import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import { Loader2 } from 'lucide-react'

const Signup = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setReferralCode(ref.toUpperCase())
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    const result = await signup(email, password, fullName, referralCode)
    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <AuthLayout
      title="Create free account"
      subtitle="Monitor up to 15 links for free — forever. No credit card needed."
      backLink="/"
    >
      {error && (
        <div className="p-3 bg-red-bg border border-red/25 rounded-xl text-red text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />

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

        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          autoComplete="new-password"
          required
        />

        {referralCode && (
          <div className="p-3 bg-cyan-soft border border-cyan/20 rounded-xl">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Referral Code</div>
            <div className="text-cyan font-mono text-sm mt-1">{referralCode}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account…
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-text-muted">
        By signing up you agree to our{' '}
        <Link to="/terms" className="text-cyan hover:underline">Terms of Service</Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-cyan hover:underline">Privacy Policy</Link>
      </div>

      <div className="text-center mt-4 text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan font-semibold hover:underline">
          Sign in →
        </Link>
      </div>
    </AuthLayout>
  )
}

export default Signup
