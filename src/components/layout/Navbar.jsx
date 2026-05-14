import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Track active section via IntersectionObserver (only on home page)
  useEffect(() => {
    if (location.pathname !== '/') return

    const sectionIds = ['home', 'about', 'projects', 'contact']
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [location.pathname])

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        // Navigate to home first, then scroll after a brief delay
        navigate('/')
        setTimeout(() => {
          const el = document.querySelector(href)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      } else {
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      setMobileOpen(false)
    } else {
      navigate(href)
      setMobileOpen(false)
    }
  }

  const isLinkActive = (link) => {
    if (link.href.startsWith('#')) {
      return location.pathname === '/' && activeSection === link.href.slice(1)
    }
    return location.pathname.startsWith(link.href)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/95 backdrop-blur-md border-b border-cyan-500/10 shadow-lg shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => handleNavClick('#home')} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 group-hover:shadow-cyan-500/70 transition-shadow border border-cyan-400/20">
                <span className="text-white font-black text-sm tracking-tight" style={{ textShadow: '0 0 8px rgba(255,255,255,0.6)' }}>RA</span>
              </div>
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span
                className="text-base font-black tracking-wide"
                style={{
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.5))',
                }}
              >
                Rakib Adnan
              </span>
              <span className="text-[10px] text-cyan-400/60 font-mono tracking-[0.2em] uppercase">&lt;Web Dev /&gt;</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className={`nav-link ${isLinkActive(link) ? 'active' : ''}`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:rakibadnan796@gmail.com"
              className="hidden md:inline-flex btn-primary text-sm py-2 px-5"
            >
              Hire Me
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg bg-dark-800/80 border border-cyan-500/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX size={18} /> : <HiMenu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-800/98 backdrop-blur-md border-t border-cyan-500/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className={`w-full text-left block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isLinkActive(link)
                        ? 'text-cyan-400 bg-cyan-500/10 border-l-2 border-cyan-400'
                        : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/5'
                    }`}
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.07 }}
                className="pt-2"
              >
                <a
                  href="mailto:rakibadnan796@gmail.com"
                  className="btn-primary w-full justify-center text-sm"
                >
                  Hire Me
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
