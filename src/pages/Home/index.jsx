import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import {
  FaWordpress,
  FaReact,
  FaShopify,
  FaJs,
  FaArrowRight,
  FaEnvelope,
  FaDownload,
} from 'react-icons/fa'
import { SiReact as SiReactnative } from 'react-icons/si'
import { HiCode, HiOutlineExternalLink } from 'react-icons/hi'
import AnimatedSection from '../../components/common/AnimatedSection'

// Typing animation hook
const useTypingEffect = (words, speed = 100, pause = 2000) => {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]

    if (!deleting && charIndex < current.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), speed)
      return () => clearTimeout(timeout)
    }

    if (!deleting && charIndex === current.length) {
      const timeout = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(timeout)
    }

    if (deleting && charIndex > 0) {
      const timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2)
      return () => clearTimeout(timeout)
    }

    if (deleting && charIndex === 0) {
      setDeleting(false)
      setWordIndex((w) => (w + 1) % words.length)
    }
  }, [charIndex, deleting, wordIndex, words, speed, pause])

  useEffect(() => {
    setDisplayed(words[wordIndex].slice(0, charIndex))
  }, [charIndex, wordIndex, words])

  return displayed
}

const roles = ['Web Developer', 'React Specialist', 'WordPress Expert', 'Shopify Developer']

const skills = [
  { icon: FaWordpress, label: 'WordPress', color: '#21759b' },
  { icon: FaShopify, label: 'Shopify', color: '#96bf48' },
  { icon: FaReact, label: 'React JS', color: '#61dafb' },
  { icon: SiReactnative, label: 'React Native', color: '#61dafb' },
  { icon: FaJs, label: 'JavaScript', color: '#f7df1e' },
  { icon: HiCode, label: 'Crocoblock', color: '#06b6d4' },
]

const stats = [
  { value: 500, suffix: '+', label: 'Projects Completed' },
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 100, suffix: '+', label: 'Happy Clients' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate' },
]

const Hero = () => {
  const typedText = useTypingEffect(roles, 80, 2200)
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <>
      <Helmet>
        <title>Rakib Adnan | Professional Web Developer</title>
        <meta name="description" content="Rakib Adnan - Professional Web Developer specializing in WordPress, Shopify, React JS, and React Native. 5+ years, 500+ projects." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden grid-bg">
        {/* Background blobs */}
        <div className="bg-blob w-96 h-96 bg-cyan-500/20 -top-32 -left-32" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
        <div className="bg-blob w-80 h-80 bg-blue-600/15 top-1/2 -right-20" style={{ borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }} />
        <div className="bg-blob w-64 h-64 bg-purple-600/10 bottom-20 left-1/4" style={{ borderRadius: '50%' }} />

        {/* Hero section */}
        <section className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text content */}
              <div className="order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="badge mb-4 inline-block">Available for Work</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-4"
                >
                  Hi, I&apos;m{' '}
                  <span className="text-gradient animate-glow">
                    Rakib Adnan
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-xl sm:text-2xl text-slate-300 mb-6 h-8 flex items-center gap-1"
                >
                  <span className="text-cyan-400 font-semibold">{typedText}</span>
                  <span className="typing-cursor text-cyan-400" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
                >
                  I build high-performance websites and web applications that help businesses grow online. With 5+ years of experience and 500+ projects delivered, I turn your vision into digital reality.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <a
                    href="mailto:support@agencyhandy.com"
                    className="btn-primary"
                  >
                    <FaEnvelope size={15} />
                    Hire Me
                  </a>
                  <Link
                    to="/projects"
                    className="btn-secondary"
                  >
                    View Projects
                    <FaArrowRight size={14} />
                  </Link>
                </motion.div>

                {/* Skills row */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="mt-10"
                >
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Tech Stack</p>
                  <div className="flex flex-wrap gap-3">
                    {skills.map(({ icon: Icon, label, color }) => (
                      <motion.div
                        key={label}
                        whileHover={{ y: -3, scale: 1.05 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/70 border border-white/5 hover:border-cyan-500/20 transition-all cursor-default"
                      >
                        <Icon size={16} style={{ color }} />
                        <span className="text-slate-300 text-xs font-medium">{label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Avatar / Image */}
              <div className="order-1 lg:order-2 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  {/* Outer ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 70%, #06b6d4 100%)',
                      padding: '2px',
                      borderRadius: '50%',
                    }}
                  />

                  {/* Floating animation wrapper */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative z-10"
                  >
                    {/* Avatar container */}
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                      {/* Glow rings */}
                      <div className="absolute inset-4 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                      <div className="absolute inset-8 rounded-full border border-blue-500/15" />

                      {/* Main circle */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-purple-600/20 backdrop-blur-sm border border-cyan-500/20 shadow-2xl shadow-cyan-500/20">
                        {/* Profile image or placeholder */}
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center overflow-hidden">
                          <div className="text-center">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/30">
                              <span className="text-3xl sm:text-4xl font-black text-white">RA</span>
                            </div>
                            <p className="text-cyan-400 text-sm font-semibold">Rakib Adnan</p>
                            <p className="text-slate-500 text-xs">Web Developer</p>
                          </div>
                        </div>
                      </div>

                      {/* Floating badges */}
                      <motion.div
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-4 -right-4 bg-dark-800 border border-cyan-500/20 rounded-xl px-3 py-2 shadow-xl"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-xs text-slate-300 font-medium">Available</span>
                        </div>
                      </motion.div>

                      <motion.div
                        animate={{ y: [5, -5, 5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute -bottom-4 -left-4 bg-dark-800 border border-blue-500/20 rounded-xl px-3 py-2 shadow-xl"
                      >
                        <div className="flex items-center gap-2">
                          <FaReact className="text-cyan-400" size={14} />
                          <span className="text-xs text-slate-300 font-medium">React Expert</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="relative z-10 py-16 border-t border-cyan-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(({ value, suffix, label }, i) => (
                <AnimatedSection key={label} delay={i * 0.1} className="text-center">
                  <div className="glass-card p-6">
                    <div className="text-3xl sm:text-4xl font-black text-gradient mb-2">
                      {statsInView ? (
                        <CountUp end={value} duration={2} delay={i * 0.2} />
                      ) : '0'}
                      <span>{suffix}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-cyan-500/60 to-transparent"
          />
        </motion.div>
      </div>
    </>
  )
}

export default Hero
