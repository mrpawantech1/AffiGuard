import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const Toast = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green" />,
    error: <XCircle className="w-5 h-5 text-red" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow" />,
    info: <AlertCircle className="w-5 h-5 text-cyan" />,
  }

  const colors = {
    success: 'border-green/30 bg-green-bg/20',
    error: 'border-red/30 bg-red-bg/20',
    warning: 'border-yellow/30 bg-yellow-bg/20',
    info: 'border-cyan/30 bg-cyan-soft/20',
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 bg-bg-card border ${colors[type] || colors.success} rounded-xl shadow-xl backdrop-blur-sm animate-slide-in`}
    >
      {icons[type] || icons.success}
      <span className="text-text-main text-sm flex-1">{message}</span>
      <button
        onClick={() => {
          setVisible(false)
          if (onClose) onClose()
        }}
        className="text-text-muted hover:text-text-main transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
