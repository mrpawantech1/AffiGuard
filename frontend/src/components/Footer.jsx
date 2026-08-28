import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-bg-card border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-cyan rounded-lg flex items-center justify-center text-black font-extrabold text-xs">
                🛡
              </div>
              <span className="text-lg font-extrabold">
                Affi<span className="text-cyan">Guard</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm max-w-sm">
              Professional link monitoring for Amazon affiliates, bloggers, and e-commerce businesses. Never lose a sale to broken or out-of-stock links.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-sm mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/#features" className="text-text-muted hover:text-cyan text-sm transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="text-text-muted hover:text-cyan text-sm transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="text-text-muted hover:text-cyan text-sm transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-sm mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-text-muted hover:text-cyan text-sm transition-colors">Help &amp; FAQ</Link></li>
              <li><Link to="/contact" className="text-text-muted hover:text-cyan text-sm transition-colors">Contact</Link></li>
              <li><Link to="/about" className="text-text-muted hover:text-cyan text-sm transition-colors">About</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border-subtle mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            © 2026 AffiGuard. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/terms" className="text-text-muted hover:text-cyan transition-colors">Terms</Link>
            <Link to="/privacy" className="text-text-muted hover:text-cyan transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
