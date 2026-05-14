import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const PageLoader = ({ onComplete }) => {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        if (c >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setDone(true)
            setTimeout(onComplete, 600)
          }, 200)
          return 100
        }
        return c + Math.floor(Math.random() * 8) + 3
      })
    }, 40)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#030712' }}
        >
          {/* Animated background blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-96 h-96 rounded-full -top-20 -left-20"
              style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' }}
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute w-80 h-80 rounded-full -bottom-10 -right-10"
              style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-12 text-center"
          >
            <motion.div
              animate={{ boxShadow: ['0 0 20px rgba(6,182,212,0.3)', '0 0 60px rgba(6,182,212,0.6)', '0 0 20px rgba(6,182,212,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
            >
              <span className="text-3xl font-black text-white">RA</span>
            </motion.div>
            <p className="text-slate-400 text-sm tracking-[0.3em] uppercase">Rakib Adnan</p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 w-64"
          >
            {/* Track */}
            <div className="h-px bg-slate-800 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(count, 100)}%`,
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                  boxShadow: '0 0 10px rgba(6,182,212,0.8)',
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-xs tracking-widest">Loading</span>
              <span className="text-cyan-400 text-xs font-mono tabular-nums">{Math.min(count, 100)}%</span>
            </div>
          </motion.div>

          {/* Scanning dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 flex gap-2 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PageLoader
