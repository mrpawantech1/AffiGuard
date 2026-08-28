import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import { Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [expired, setExpired] = useState(false)
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      setExpired(true)
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    const result = await resetPassword(token, password)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
      if (result.error && result.error.includes('expired')) {
        setExpired(true)
      }
    }
    setLoading(false)
  }

  if (expired) {
    return (
      <AuthLayout backLink="/login">
        <div className="text-center py-4">
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="text-xl font-bold">Link Invalid or Expired</h2>
          <p className="text-text-muted text-sm mt-2">
            This password reset link is missing, invalid, or has already been used. Reset links expire after 1 hour.
          </p>
          <Link to="/forgot-password" className="btn-primary w-full justify-center mt-6 py-3.5">
            Request a New Link
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout backLink="/login">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green" />
          </div>
          <h2 className="text-xl font-bold">Password Updated!</h2>
          <p className="text-text-muted text-sm mt-2">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Link to="/login" className="btn-primary w-full justify-center mt-6 py-3.5">
            Go to Login →
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Choose a strong password — at least 8 characters."
      backLink="/login"
    >
      {error && (
        <div className="p-3 bg-red-bg border border-red/25 rounded-xl text-red text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 bottom-3 text-text-muted hover:text-cyan transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 bottom-3 text-text-muted hover:text-cyan transition-colors"
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password Strength Bar */}
        <div className="space-y-1">
          <div className="h-1 rounded-full bg-border-subtle overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                password.length >= 8
                  ? password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                    ? 'w-full bg-green'
                    : 'w-3/4 bg-yellow'
                  : 'w-1/4 bg-red'
              }`}
            />
          </div>
          <div className="text-xs text-text-muted">
            {password.length === 0
              ? ''
              : password.length < 8
              ? 'Weak'
              : password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)
              ? 'Strong'
              : 'Fair'}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Resetting…
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
