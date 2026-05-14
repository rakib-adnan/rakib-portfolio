// @ts-nocheck
import { motion } from 'framer-motion'

const SectionTitle = ({ subtitle, title, description, centered = true }) => {
  return (
    <div className={`mb-14 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <span className="badge mb-4 inline-block">{subtitle}</span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      <div className={`flex ${centered ? 'justify-center' : ''} mb-4`}>
        <div className="relative h-1 w-20 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 bg-white/30 blur-sm"
          />
        </div>
      </div>
      {description && (
        <p className={`text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionTitle
