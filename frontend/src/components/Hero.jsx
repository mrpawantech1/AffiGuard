import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Clock, Globe } from 'lucide-react'

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-cyan-soft text-cyan text-sm font-semibold px-4 py-2 rounded-full mb-6 animate-fade-up">
          <span className="w-2 h-2 bg-cyan rounded-full animate-pulse"></span>
          Smart Monitoring for Affiliate Marketers
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] animate-fade-up">
          Never Lose a Sale to{' '}
          <span className="gradient-text">Broken or Out-of-Stock</span> Links
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto animate-fade-up delay-100">
          AffiGuard automatically monitors your affiliate links 24/7 using intelligent proxy routing and headless browser technology.
          Get instant Telegram alerts when something goes wrong — <span className="text-text-main font-semibold">before your readers notice</span>.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-200">
          <Link to="/signup" className="btn-primary text-base px-8 py-4">
            Start Free – 15 Links
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#checker" className="btn-ghost text-base px-8 py-4">
            Try Instant Checker ↓
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-up delay-300">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-cyan">3</div>
            <div className="text-text-muted text-sm mt-1">Detection Layers</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-cyan">&lt;1s</div>
            <div className="text-text-muted text-sm mt-1">Alert Delivery</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-cyan">50+</div>
            <div className="text-text-muted text-sm mt-1">Platforms Supported</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-cyan">99.9%</div>
            <div className="text-text-muted text-sm mt-1">Uptime Target</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
