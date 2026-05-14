// @ts-nocheck
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  HiOutlineExternalLink,
  HiCode,
  HiSearch,
} from 'react-icons/hi'
import { FaGithub, FaWordpress, FaReact, FaShopify } from 'react-icons/fa'
import { useGetProjectsQuery } from '../../services/portfolioApi'
import SectionTitle from '../../components/common/SectionTitle'
import AnimatedSection from '../../components/common/AnimatedSection'

// Demo projects for when Firebase isn't configured
const demoProjects = [
  {
    id: '1',
    title: 'E-Commerce WordPress Store',
    description: 'Full-featured WooCommerce store with custom Crocoblock dynamic listings, advanced filters, and optimized checkout flow.',
    category: 'WordPress',
    image: '',
    liveUrl: '#',
    githubUrl: '',
    tags: ['WordPress', 'WooCommerce', 'Crocoblock'],
  },
  {
    id: '2',
    title: 'Shopify Fashion Brand',
    description: 'Custom Shopify theme with advanced product customization, upsell features, and optimized mobile experience.',
    category: 'Shopify',
    image: '',
    liveUrl: '#',
    githubUrl: '',
    tags: ['Shopify', 'Liquid', 'JavaScript'],
  },
  {
    id: '3',
    title: 'React SaaS Dashboard',
    description: 'Modern SaaS analytics dashboard built with React, Redux, and Recharts with real-time data visualization.',
    category: 'React',
    image: '',
    liveUrl: '#',
    githubUrl: '#',
    tags: ['React', 'Redux', 'Tailwind'],
  },
  {
    id: '4',
    title: 'Business Portfolio Website',
    description: 'Professional business portfolio built with Brick Builder on WordPress with advanced animations and SEO optimization.',
    category: 'WordPress',
    image: '',
    liveUrl: '#',
    githubUrl: '',
    tags: ['WordPress', 'Brick Builder', 'SEO'],
  },
  {
    id: '5',
    title: 'React Native Mobile App',
    description: 'Cross-platform mobile application for a fitness startup with real-time tracking, social features, and payment integration.',
    category: 'React Native',
    image: '',
    liveUrl: '#',
    githubUrl: '#',
    tags: ['React Native', 'Firebase', 'Redux'],
  },
  {
    id: '6',
    title: 'Multi-Vendor Shopify Store',
    description: 'Complex multi-vendor marketplace built on Shopify Plus with custom metafields, vendor dashboards, and commission system.',
    category: 'Shopify',
    image: '',
    liveUrl: '#',
    githubUrl: '',
    tags: ['Shopify Plus', 'Multi-Vendor', 'API'],
  },
]

const categories = ['All', 'WordPress', 'Shopify', 'React', 'React Native', 'JavaScript']

const categoryIcons = {
  WordPress: FaWordpress,
  Shopify: FaShopify,
  React: FaReact,
  'React Native': FaReact,
  JavaScript: HiCode,
}

const categoryColors = {
  WordPress: '#21759b',
  Shopify: '#96bf48',
  React: '#61dafb',
  'React Native': '#61dafb',
  JavaScript: '#f7df1e',
}

const ProjectCard = ({ project, index }) => {
  const IconComp = categoryIcons[project.category] || HiCode
  const color = categoryColors[project.category] || '#06b6d4'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="project-card group h-full flex flex-col">
        {/* Image / Placeholder */}
        <div className="relative aspect-video overflow-hidden bg-dark-700">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800">
              <div className="text-center">
                <IconComp size={40} style={{ color }} className="mx-auto mb-2 opacity-30" />
                <span className="text-slate-600 text-xs">{project.category}</span>
              </div>
            </div>
          )}

          {/* Overlay */}
          <div className="overlay rounded-none">
            <div className="flex items-center gap-4">
              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 transition-all"
                >
                  <HiOutlineExternalLink size={18} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-slate-700/60 border border-slate-600/40 flex items-center justify-center text-slate-300 hover:bg-slate-700/80 transition-all"
                >
                  <FaGithub size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="badge text-xs flex items-center gap-1.5">
              <IconComp size={11} style={{ color }} />
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-white font-semibold text-base mb-2 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {(project.tags || []).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-dark-700/80 text-slate-400 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const { data: firebaseProjects, isLoading } = useGetProjectsQuery()

  // Use Firebase data if available, otherwise demo data
  const allProjects = (firebaseProjects && firebaseProjects.length > 0)
    ? firebaseProjects
    : demoProjects

  const filtered = useMemo(() => {
    let list = allProjects
    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory)
    }
    if (search.trim()) {
      const s = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s) ||
          p.category?.toLowerCase().includes(s) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(s))
      )
    }
    return list
  }, [allProjects, activeCategory, search])

  return (
    <>
      <Helmet>
        <title>Projects | Rakib Adnan - Web Developer</title>
        <meta name="description" content="Browse 500+ projects by Rakib Adnan including WordPress, Shopify, React, and React Native applications." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden grid-bg">
        <div className="bg-blob w-72 h-72 bg-cyan-500/10 top-20 -right-10" style={{ borderRadius: '50%' }} />
        <div className="bg-blob w-64 h-64 bg-blue-600/10 bottom-40 -left-10" style={{ borderRadius: '50%' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding pt-32">
          <SectionTitle
            subtitle="Portfolio"
            title="My Recent Projects"
            description="A showcase of websites and applications I've built for clients worldwide."
          />

          {/* Filter + Search Bar */}
          <AnimatedSection variant="fadeUp" delay={0.1} className="mb-10">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input pl-9 py-2.5 text-sm"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card aspect-[4/3] animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filtered.map((project, i) => (
                    <ProjectCard key={project.id} project={project} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <HiSearch size={48} className="text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No projects found for &quot;{search}&quot;</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Projects
