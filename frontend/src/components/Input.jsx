import React from 'react'

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  autoComplete = 'off',
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 bg-bg-card2 border border-border-subtle rounded-xl text-text-main placeholder:text-text-muted/50 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan-soft transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    </div>
  )
}

export default Input
