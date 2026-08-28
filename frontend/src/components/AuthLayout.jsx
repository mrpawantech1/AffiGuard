import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const AuthLayout = ({ children, title, subtitle, backLink }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep p-4">
      <div className="w-full max-w-md">
        {backLink && (
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 text-text-muted hover:text-cyan text-sm transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        )}

        <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block text-2xl font-extrabold text-cyan mb-2">
              AffiGuard
            </Link>
            {title && <h1 className="text-2xl font-bold mt-2">{title}</h1>}
            {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
