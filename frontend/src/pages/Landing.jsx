import React, { useEffect, useRef } from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import FreeChecker from '../components/FreeChecker'
import Testimonials from '../components/Testimonials'

const Landing = () => {
  const sectionRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-8')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="overflow-hidden">
      <Hero />
      <div ref={el => sectionRefs.current[0] = el} className="opacity-0 translate-y-8 transition-all duration-700">
        <FreeChecker />
      </div>
      <div ref={el => sectionRefs.current[1] = el} className="opacity-0 translate-y-8 transition-all duration-700">
        <Features />
      </div>
      <div ref={el => sectionRefs.current[2] = el} className="opacity-0 translate-y-8 transition-all duration-700">
        <Pricing />
      </div>
      <div ref={el => sectionRefs.current[3] = el} className="opacity-0 translate-y-8 transition-all duration-700">
        <Testimonials />
      </div>
    </div>
  )
}

export default Landing
