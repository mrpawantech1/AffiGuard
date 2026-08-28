import React, { useState, useEffect, useRef } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Amazon Affiliate Marketer, Delhi',
    avatar: 'RS',
    rating: 5,
    text: 'AffiGuard saved me during a major sale event. My Amazon affiliate link had gone out-of-stock and I had no idea. The Telegram alert came within minutes — I swapped the link before losing thousands in commissions.',
  },
  {
    name: 'Priya Krishnan',
    role: 'Tech Blogger, Bengaluru',
    avatar: 'PK',
    rating: 5,
    text: 'I run a Flipkart affiliate blog with 80+ product links. Before AffiGuard, I\'d find broken links weeks later. Now I get instant alerts. My CTR improved because readers trust that my links always work. Worth every rupee.',
  },
  {
    name: 'Arjun Mehta',
    role: 'E-commerce Owner, Mumbai',
    avatar: 'AM',
    rating: 4,
    text: 'We use this for our WooCommerce store to monitor 30+ product landing pages. The Smart Proxy Network handles our JS-heavy pages perfectly. Setup was under 5 minutes and the Telegram bot integration is seamless. Highly recommend!',
  },
  {
    name: 'Sneha Nair',
    role: 'YouTube Creator & Blogger, Pune',
    avatar: 'SN',
    rating: 5,
    text: 'As a content creator who reviews products, broken affiliate links are my nightmare. AffiGuard\'s free tier covers my basics perfectly, and when I needed more, upgrading was instant. The dashboard is clean and easy to use.',
  },
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  const goTo = (index) => {
    setCurrentIndex((index + testimonials.length) % testimonials.length)
  }

  const next = () => goTo(currentIndex + 1)
  const prev = () => goTo(currentIndex - 1)

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(next, 4500)
    }
    return () => clearInterval(intervalRef.current)
  }, [currentIndex, isPaused])

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-transparent via-cyan/5 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div>
            <div className="section-eyebrow">User love</div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              What our users{' '}
              <span className="gradient-text">are saying</span>
            </h2>
            <p className="text-text-muted text-lg mt-4">
              Real feedback from affiliate marketers, bloggers, and e-commerce sellers using AffiGuard daily.
            </p>
          </div>

          {/* Right - Slider */}
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((t, i) => (
                  <div key={i} className="min-w-full p-6 bg-bg-card border border-border-subtle rounded-2xl relative">
                    {/* Quote mark */}
                    <div className="absolute top-4 right-6 text-6xl text-cyan/10 font-serif">"</div>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-5 h-5 ${j < t.rating ? 'fill-yellow text-yellow' : 'text-border-subtle'}`}
                        />
                      ))}
                    </div>

                    <p className="text-text-main text-base leading-relaxed min-h-[120px]">{t.text}</p>

                    <div className="flex items-center gap-4 mt-6">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan to-blue-400 flex items-center justify-center text-black font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-bold">{t.name}</div>
                        <div className="text-text-muted text-sm">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentIndex ? 'bg-cyan w-8' : 'bg-border-subtle hover:bg-text-muted'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
