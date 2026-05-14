import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

const services = [
  'WordPress Development',
  'Shopify Development',
  'React JS Development',
  'React Native',
  'Crocoblock',
  'Brick Builder',
]

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/rakibadnan', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/rakibadnan', label: 'LinkedIn' },
  { icon: FaWhatsapp, href: 'https://wa.me/8801601566785', label: 'WhatsApp' },
  { icon: FaEnvelope, href: 'mailto:rakibadnan796@gmail.com', label: 'Email' },
]

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative border-t border-cyan-500/10" style={{ background: 'rgba(3,7,18,0.98)' }}>
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand / Bio */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow flex-shrink-0">
                <span className="text-white font-black text-sm tracking-tight">RA</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-white">Rakib Adnan</span>
                <span className="text-xs text-cyan-400/70 font-medium tracking-widest uppercase">Web Developer</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Professional web developer specializing in WordPress, Shopify, React JS &amp; React Native. Crafting fast, beautiful digital experiences since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-4 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 inline-block rounded" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-4 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 inline-block rounded" />
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-slate-400 text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-500/40 flex-shrink-0" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-4 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 inline-block rounded" />
              Contact
            </h4>
            <ul className="space-y-3 mb-5">
              <li>
                <a
                  href="mailto:rakibadnan796@gmail.com"
                  className="flex items-start gap-3 text-slate-400 hover:text-cyan-400 transition-colors text-sm group"
                >
                  <FaEnvelope size={14} className="mt-0.5 flex-shrink-0 text-cyan-500/60 group-hover:text-cyan-400 transition-colors" />
                  rakibadnan796@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8801601566785"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-slate-400 hover:text-cyan-400 transition-colors text-sm group"
                >
                  <FaWhatsapp size={14} className="mt-0.5 flex-shrink-0 text-cyan-500/60 group-hover:text-cyan-400 transition-colors" />
                  +8801601566785
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3 text-slate-400 text-sm">
                  <FaMapMarkerAlt size={14} className="mt-0.5 flex-shrink-0 text-cyan-500/60" />
                  Bangladesh
                </span>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-lg bg-dark-800/80 border border-cyan-500/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2024 Rakib Adnan. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
            aria-label="Scroll to top"
          >
            <HiArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
