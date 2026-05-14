import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaEnvelope,
  FaCode,
} from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
  { icon: FaTwitter, href: 'https://twitter.com/', label: 'Twitter' },
  { icon: FaFacebook, href: 'https://facebook.com/', label: 'Facebook' },
  { icon: FaEnvelope, href: 'mailto:support@agencyhandy.com', label: 'Email' },
]

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Contact', to: '/contact' },
]

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative border-t border-cyan-500/10 bg-dark-800/50">
      {/* Glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <FaCode className="text-white text-sm" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-white">Rakib</span>
                <span className="text-xs text-cyan-400 font-medium tracking-widest uppercase">Adnan</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Professional Web Developer specializing in WordPress, Shopify, and React. Crafting digital experiences since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Get In Touch</h4>
            <a
              href="mailto:support@agencyhandy.com"
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors block mb-4"
            >
              support@agencyhandy.com
            </a>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-lg bg-dark-700/80 border border-cyan-500/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Rakib Adnan. All rights reserved.
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
