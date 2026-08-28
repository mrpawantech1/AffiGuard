import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-bg-deep/90 backdrop-blur-xl border-b border-border-subtle' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-cyan rounded-lg flex items-center justify-center text-black font-extrabold text-sm">
              🛡
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Affi<span className="text-cyan">Guard</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-cyan'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm">
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-bg-card2 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 border-b border-border-subtle' : 'max-h-0'
      }`}>
        <div className="px-4 py-6 bg-bg-card/95 backdrop-blur-xl flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-cyan'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-border-subtle">
            <Link to="/login" className="btn-ghost w-full justify-center">
              Login
            </Link>
            <Link to="/signup" className="btn-primary w-full justify-center">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
