// @ts-nocheck
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  FaWordpress, FaReact, FaShopify, FaJs, FaDownload, FaBriefcase, FaGraduationCap,
} from 'react-icons/fa'
import { SiReact as SiReactnative } from 'react-icons/si'
import { HiCode, HiSparkles } from 'react-icons/hi'
import SectionTitle from '../../components/common/SectionTitle'
import { useGetAboutContentQuery, useGetSiteSettingsQuery } from '../../services/portfolioApi'

const iconMap = {
  WordPress: FaWordpress, Shopify: FaShopify, 'React JS': FaReact,
  'React Native': SiReactnative, JavaScript: FaJs, Crocoblock: HiCode,
  'Brick Builder': HiCode,
}

const SkillBar = ({ label, percent, color }) => {
  const Icon = iconMap[label] || HiCode
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color }} />
          <span className="text-slate-300 text-sm font-medium">{label}</span>
        </div>
        <span className="text-cyan-400 text-sm font-bold">{percent}%</span>
      </div>
      <div className="skill-bar">
        <div className="skill-bar-fill animate-progress" style={{ width: `${percent}%`, background: color ? `linear-gradient(90deg, ${color}99, ${color})` : undefined }} />
      </div>
    </div>
  )
}

const About = () => {
  const { data: about } = useGetAboutContentQuery()
  const { data: settings } = useGetSiteSettingsQuery()

  const bio = about?.bio || settings?.heroBio || "I'm Rakib Adnan, a professional web developer based in Bangladesh with over 5 years of hands-on experience building websites and web applications."
  const skills = about?.skills || []
  const experience = about?.experience || []
  const cvUrl = settings?.cvUrl || '#'
  const profileImage = settings?.profileImage || ''
  const name = settings?.name || 'Rakib Adnan'

  return (
    <>
      <Helmet>
        <title>About | {name}</title>
        <meta name="description" content={`Learn about ${name} - a professional web developer with 5+ years experience.`} />
      </Helmet>

      <div className="min-h-screen relative z-10 py-24 px-4" style={{ backgroundColor: '#030712' }}>
        <div className="bg-blob w-80 h-80 bg-cyan-500/15 top-20 -right-20" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
        <div className="bg-blob w-72 h-72 bg-blue-600/10 bottom-20 -left-10" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />

        <div className="relative z-10 max-w-7xl mx-auto pt-8">
          <SectionTitle
            subtitle="About Me"
            title="Passionate Developer & Problem Solver"
            description="I craft beautiful, high-performance digital experiences with a focus on clean code and exceptional user experience."
          />

          {/* Bio + Image */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative">
              <div className="glass-card p-2 max-w-sm mx-auto lg:mx-0">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                  <div className="text-center relative z-10">
                    {profileImage ? (
                      <img src={profileImage} alt={name} className="w-full h-full object-cover absolute inset-0 rounded-xl" />
                    ) : (
                      <>
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/40">
                          <span className="text-5xl font-black text-white">RA</span>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-1">{name}</h3>
                        <p className="text-cyan-400 text-sm">Full Stack Web Developer</p>
                      </>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 w-16 h-16 border border-cyan-500/10 rounded-xl rotate-45" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 border border-blue-500/10 rounded-lg -rotate-12" />
                </div>
              </div>
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

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Building <span className="text-gradient">Digital Solutions</span> Since 2020
              </h3>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>{bio}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: 'Name',       value: name },
                  { label: 'Email',      value: 'rakibadnan796@gmail.com' },
                  { label: 'Experience', value: '5+ Years' },
                  { label: 'Projects',   value: '500+ Completed' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</span>
                    <span className="text-slate-200 text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="mailto:rakibadnan796@gmail.com" className="btn-primary">Hire Me</a>
                <a href={cvUrl} target={cvUrl !== '#' ? '_blank' : undefined} rel="noopener noreferrer" className="btn-secondary">
                  <FaDownload size={14} />
                  Download CV
                </a>
              </div>
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-20">
              <SectionTitle subtitle="Skills" title="My Technical Skills" description="Technologies and tools I use to bring projects to life" />
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-2">
                {skills.map((sk) => (
                  <SkillBar key={sk.label} {...sk} />
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <SectionTitle subtitle="Experience" title="My Professional Journey" />
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-transparent" />
                <div className="space-y-8">
                  {experience.map((item, i) => {
                    const Icon = i === experience.length - 1 ? FaGraduationCap : FaBriefcase
                    return (
                      <div key={i} className="relative pl-20">
                        <div className="absolute left-4 top-3 w-8 h-8 -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 z-10">
                          <Icon size={14} className="text-white" />
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
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default About
