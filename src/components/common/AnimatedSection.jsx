import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
}

const AnimatedSection = ({
  children,
  className = '',
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  threshold = 0,
  once = true,
}) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
    rootMargin: '0px 0px -50px 0px',
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedSection
