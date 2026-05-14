import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useInView } from 'react-intersection-observer'
import {
  FaWordpress,
  FaReact,
  FaShopify,
  FaJs,
  FaDownload,
  FaBriefcase,
  FaGraduationCap,
} from 'react-icons/fa'
import { SiReact as SiReactnative } from 'react-icons/si'
import { HiCode, HiSparkles } from 'react-icons/hi'
import SectionTitle from '../../components/common/SectionTitle'
import AnimatedSection from '../../components/common/AnimatedSection'

const skills = [
  { label: 'WordPress', percent: 95, icon: FaWordpress, color: '#21759b' },
  { label: 'Shopify', percent: 92, icon: FaShopify, color: '#96bf48' },
  { label: 'React JS', percent: 88, icon: FaReact, color: '#61dafb' },
  { label: 'React Native', percent: 80, icon: SiReactnative, color: '#61dafb' },
  { label: 'JavaScript', percent: 90, icon: FaJs, color: '#f7df1e' },
  { label: 'Crocoblock', percent: 96, icon: HiCode, color: '#06b6d4' },
  { label: 'Brick Builder', percent: 85, icon: HiCode, color: '#8b5cf6' },
]

const experience = [
  {
    year: '2022 – Present',
    role: 'Senior Web Developer',
    company: 'Agency Handy',
    description: 'Leading development of complex WordPress and React projects, managing client relationships, and architecting scalable web solutions for businesses worldwide.',
    icon: FaBriefcase,
  },
  {
    year: '2021 – 2022',
    role: 'WordPress Developer',
    company: 'Freelance',
    description: 'Built 100+ custom WordPress websites using Elementor, Divi, and Crocoblock. Specialized in WooCommerce and performance optimization.',
    icon: FaBriefcase,
  },
  {
    year: '2020 – 2021',
    role: 'Junior Web Developer',
    company: 'Local Agency',
    description: 'Started professional career building websites with WordPress and learning modern JavaScript frameworks. Completed 50+ projects.',
    icon: FaGraduationCap,
  },
]

const SkillBar = ({ label, percent, icon: Icon, color, delay }) => {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="mb-5"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color }} />
          <span className="text-slate-300 text-sm font-medium">{label}</span>
        </div>
        <span className="text-cyan-400 text-sm font-bold">{percent}%</span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | Rakib Adnan - Web Developer</title>
        <meta name="description" content="Learn about Rakib Adnan - a professional web developer with 5+ years experience in WordPress, Shopify, React JS, and more." />
        <meta property="og:title" content="About | Rakib Adnan - Web Developer" />
        <meta property="og:description" content="Professional web developer from Bangladesh specializing in WordPress, Shopify, React JS, and React Native. 5+ years, 500+ projects." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="About | Rakib Adnan - Web Developer" />
        <meta name="twitter:description" content="Professional web developer from Bangladesh specializing in WordPress, Shopify, React JS, and React Native." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden grid-bg">
        {/* Background blobs */}
        <div className="bg-blob w-80 h-80 bg-cyan-500/15 top-20 -right-20" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
        <div className="bg-blob w-72 h-72 bg-blue-600/10 bottom-20 -left-10" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding pt-32">
          <SectionTitle
            subtitle="About Me"
            title="Passionate Developer & Problem Solver"
            description="I craft beautiful, high-performance digital experiences with a focus on clean code and exceptional user experience."
          />

          {/* Bio + Image */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <AnimatedSection variant="fadeLeft">
              <div className="relative">
                <div className="glass-card p-2 max-w-sm mx-auto lg:mx-0">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                    <div className="text-center relative z-10">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/40">
                        <span className="text-5xl font-black text-white">RA</span>
                      </div>
                      <h3 className="text-white font-bold text-xl mb-1">Rakib Adnan</h3>
                      <p className="text-cyan-400 text-sm">Full Stack Web Developer</p>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-16 h-16 border border-cyan-500/10 rounded-xl rotate-45" />
                    <div className="absolute bottom-4 left-4 w-10 h-10 border border-blue-500/10 rounded-lg -rotate-12" />
                  </div>
                </div>
                {/* Experience badge */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -right-4 lg:right-4 glass-card px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <HiSparkles className="text-yellow-400" size={18} />
                    <div>
                      <p className="text-white font-bold text-lg leading-none">5+</p>
                      <p className="text-slate-400 text-xs">Years Exp.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeRight">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Building <span className="text-gradient">Digital Solutions</span> Since 2020
                </h3>
                <div className="space-y-4 text-slate-400 leading-relaxed">
                  <p>
                    I&apos;m Rakib Adnan, a professional web developer based in Bangladesh with over 5 years of hands-on experience building websites and web applications that make a real difference for businesses.
                  </p>
                  <p>
                    My expertise spans across multiple technologies — from WordPress and Shopify for e-commerce and business websites, to React JS and React Native for modern web and mobile applications. I specialize in Crocoblock/JetEngine for advanced WordPress functionality and Brick Builder for pixel-perfect designs.
                  </p>
                  <p>
                    With 500+ successful projects completed and a 99% client satisfaction rate, I bring a results-driven approach to every project. I believe in clean code, performance optimization, and delivering projects on time.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Name', value: 'Rakib Adnan' },
                    { label: 'Email', value: 'rakibadnan796@gmail.com' },
                    { label: 'Experience', value: '5+ Years' },
                    { label: 'Projects', value: '500+ Completed' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</span>
                      <span className="text-slate-200 text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="mailto:rakibadnan796@gmail.com"
                    className="btn-primary"
                  >
                    Hire Me
                  </a>
                  <a
                    href="#"
                    className="btn-secondary"
                  >
                    <FaDownload size={14} />
                    Download CV
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Skills */}
          <div className="mb-20">
            <SectionTitle
              subtitle="Skills"
              title="My Technical Skills"
              description="Technologies and tools I use to bring projects to life"
            />
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
              {skills.map((skill, i) => (
                <SkillBar key={skill.label} {...skill} delay={i * 0.08} />
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div>
            <SectionTitle
              subtitle="Experience"
              title="My Professional Journey"
            />
            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-transparent" />

              <div className="space-y-8">
                {experience.map((item, i) => (
                  <AnimatedSection key={i} delay={i * 0.15} variant="fadeLeft">
                    <div className="relative pl-20">
                      {/* Icon */}
                      <div className="absolute left-4 top-3 w-8 h-8 -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-10">
                        <item.icon size={14} className="text-white" />
                      </div>

                      <div className="glass-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="text-white font-semibold text-lg">{item.role}</h4>
                          <span className="badge text-xs">{item.year}</span>
                        </div>
                        <p className="text-cyan-400 text-sm font-medium mb-2">{item.company}</p>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
