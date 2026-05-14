// @ts-nocheck
import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  FaWordpress, FaReact, FaShopify, FaJs, FaArrowRight, FaEnvelope,
  FaDownload, FaGithub, FaPhone, FaWhatsapp, FaStar, FaQuoteLeft,
  FaChevronLeft, FaChevronRight, FaBriefcase, FaGraduationCap,
  FaExternalLinkAlt, FaMapMarkerAlt, FaLinkedin, FaPaperPlane,
  FaTimes, FaSearchPlus,
} from 'react-icons/fa'
import { SiReact as SiReactnative } from 'react-icons/si'
import {
  HiCode, HiOutlineExternalLink, HiSearch, HiCalendar, HiArrowRight,
  HiCheckCircle, HiSparkles, HiDeviceMobile, HiTemplate, HiChartBar,
} from 'react-icons/hi'
import {
  useGetProjectsQuery,
  useGetReviewsQuery,
  useGetBlogsQuery,
  useSendMessageMutation,
  useGetSiteSettingsQuery,
  useGetGalleryQuery,
} from '../../services/portfolioApi'
import SectionTitle from '../../components/common/SectionTitle'

// ─── Typing animation hook ────────────────────────────────────────────────────
const useTypingEffect = (words, speed = 100, pause = 2000) => {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]
    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), speed)
      return () => clearTimeout(t)
    }
    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), speed / 2)
      return () => clearTimeout(t)
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

// ─── Static data ─────────────────────────────────────────────────────────────
const roles = ['Web Developer', 'React Specialist', 'WordPress Expert', 'Shopify Developer']

const heroSkills = [
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

const aboutSkills = [
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

const defaultServices = [
  { icon: 'wordpress', title: 'WordPress Development', desc: 'Custom WordPress sites, WooCommerce stores, Crocoblock & Brick Builder', color: '#21759b' },
  { icon: 'shopify', title: 'Shopify Development', desc: 'Custom themes, apps, and store optimization for Shopify & Shopify Plus', color: '#96bf48' },
  { icon: 'react', title: 'React JS Development', desc: 'Modern web apps with React, Redux, RTK Query, and REST/GraphQL APIs', color: '#61dafb' },
  { icon: 'mobile', title: 'React Native Apps', desc: 'Cross-platform iOS & Android apps with React Native', color: '#06b6d4' },
  { icon: 'seo', title: 'SEO Optimization', desc: 'Technical SEO, on-page optimization, and performance improvements', color: '#f59e0b' },
  { icon: 'design', title: 'UI/UX Design', desc: 'Pixel-perfect designs with Figma, pixel-perfect implementations', color: '#8b5cf6' },
]

const serviceIconMap = {
  wordpress: FaWordpress,
  shopify: FaShopify,
  react: FaReact,
  mobile: HiDeviceMobile,
  seo: HiChartBar,
  design: HiTemplate,
  js: FaJs,
  code: HiCode,
}

const demoProjects = [
  {
    id: '1', title: 'E-Commerce WordPress Store',
    description: 'Full-featured WooCommerce store with custom Crocoblock dynamic listings, advanced filters, and optimized checkout flow.',
    category: 'WordPress', image: '', liveUrl: '#', githubUrl: '',
    tags: ['WordPress', 'WooCommerce', 'Crocoblock'],
  },
  {
    id: '2', title: 'Shopify Fashion Brand',
    description: 'Custom Shopify theme with advanced product customization, upsell features, and optimized mobile experience.',
    category: 'Shopify', image: '', liveUrl: '#', githubUrl: '',
    tags: ['Shopify', 'Liquid', 'JavaScript'],
  },
  {
    id: '3', title: 'React SaaS Dashboard',
    description: 'Modern SaaS analytics dashboard built with React, Redux, and Recharts with real-time data visualization.',
    category: 'React', image: '', liveUrl: '#', githubUrl: '#',
    tags: ['React', 'Redux', 'Tailwind'],
  },
  {
    id: '4', title: 'Business Portfolio Website',
    description: 'Professional business portfolio built with Brick Builder on WordPress with advanced animations and SEO optimization.',
    category: 'WordPress', image: '', liveUrl: '#', githubUrl: '',
    tags: ['WordPress', 'Brick Builder', 'SEO'],
  },
  {
    id: '5', title: 'React Native Mobile App',
    description: 'Cross-platform mobile application for a fitness startup with real-time tracking, social features, and payment integration.',
    category: 'React Native', image: '', liveUrl: '#', githubUrl: '#',
    tags: ['React Native', 'Firebase', 'Redux'],
  },
  {
    id: '6', title: 'Multi-Vendor Shopify Store',
    description: 'Complex multi-vendor marketplace built on Shopify Plus with custom metafields, vendor dashboards, and commission system.',
    category: 'Shopify', image: '', liveUrl: '#', githubUrl: '',
    tags: ['Shopify Plus', 'Multi-Vendor', 'API'],
  },
]

const demoReviews = [
  { id: '1', name: 'Michael Thompson', role: 'CEO', company: 'TechVenture Inc.', rating: 5, text: 'Rakib delivered our e-commerce platform ahead of schedule and beyond expectations. The WordPress site he built handles thousands of daily visitors seamlessly. His attention to detail and communication throughout the project were exceptional.', avatar: '' },
  { id: '2', name: 'Sarah Johnson', role: 'Marketing Director', company: 'StyleShop', rating: 5, text: "Outstanding Shopify development! Our new store has seen a 40% increase in conversions since launch. Rakib understood our brand perfectly and implemented features we didn't even know we needed. Highly recommended!", avatar: '' },
  { id: '3', name: 'Ahmed Al-Hassan', role: 'Startup Founder', company: 'LaunchPad Tech', rating: 5, text: "We hired Rakib to build our React dashboard and he completely transformed our product. Clean code, fast performance, and great UX. He's become our go-to developer for all web projects.", avatar: '' },
  { id: '4', name: 'Emma Rodriguez', role: 'E-commerce Manager', company: 'Beauty Direct', rating: 5, text: 'Rakib rebuilt our WooCommerce store using Crocoblock and the results were incredible. Page load times dropped by 60% and our SEO rankings improved significantly. Professional, reliable, and talented.', avatar: '' },
  { id: '5', name: 'David Chen', role: 'Product Manager', company: 'FitLife App', rating: 5, text: "The React Native app Rakib built for us exceeded all expectations. Cross-platform, smooth animations, and robust backend integration. Our users absolutely love it. Will definitely work with him again.", avatar: '' },
  { id: '6', name: 'Lisa Williams', role: 'Owner', company: 'Crafty Studio', rating: 5, text: "I've worked with many developers over the years, but Rakib stands out for his professionalism and quality of work. My Shopify store is beautiful and highly functional. Worth every penny!", avatar: '' },
]

const demoBlogPosts = [
  {
    id: 'b1', title: 'How to Build a High-Performance WordPress Site with Crocoblock',
    excerpt: 'Learn the best practices for building fast, SEO-optimized WordPress websites using Crocoblock JetEngine and JetSmartFilters.',
    category: 'WordPress', featuredImage: '', isPublished: true,
    slug: 'wordpress-crocoblock-guide', createdAt: new Date('2024-01-15'),
  },
  {
    id: 'b2', title: 'React vs React Native: Choosing the Right Framework for Your Project',
    excerpt: 'A comprehensive comparison of React and React Native to help you decide which technology is best suited for your next web or mobile project.',
    category: 'React', featuredImage: '', isPublished: true,
    slug: 'react-vs-react-native', createdAt: new Date('2024-02-20'),
  },
  {
    id: 'b3', title: 'Shopify Customization: Beyond the Default Theme',
    excerpt: 'Unlock the full potential of Shopify by customizing themes with Liquid, building custom sections, and optimizing the checkout experience.',
    category: 'Shopify', featuredImage: '', isPublished: true,
    slug: 'shopify-customization-guide', createdAt: new Date('2024-03-10'),
  },
]

const demoGallery = [
  { id: 'g1', title: 'E-Commerce WordPress Design', category: 'WordPress', url: '', gradient: 'from-blue-600 to-cyan-500' },
  { id: 'g2', title: 'Shopify Store UI', category: 'Shopify', url: '', gradient: 'from-green-600 to-emerald-400' },
  { id: 'g3', title: 'React Dashboard', category: 'React', url: '', gradient: 'from-cyan-500 to-blue-400' },
  { id: 'g4', title: 'Mobile App Screen', category: 'React Native', url: '', gradient: 'from-purple-600 to-pink-500' },
  { id: 'g5', title: 'Portfolio Design', category: 'UI/UX', url: '', gradient: 'from-orange-500 to-amber-400' },
  { id: 'g6', title: 'Business Website', category: 'WordPress', url: '', gradient: 'from-rose-600 to-pink-400' },
]

const projectCategories = ['All', 'WordPress', 'Shopify', 'React', 'React Native']

const categoryIcons = {
  WordPress: FaWordpress, Shopify: FaShopify, React: FaReact, 'React Native': FaReact, JavaScript: HiCode,
}

const categoryColors = {
  WordPress: '#21759b', Shopify: '#96bf48', React: '#61dafb', 'React Native': '#61dafb', JavaScript: '#f7df1e',
}

const avatarColors = [
  'from-cyan-500 to-blue-600', 'from-purple-500 to-pink-600', 'from-emerald-500 to-cyan-600',
  'from-orange-500 to-rose-600', 'from-blue-500 to-violet-600', 'from-teal-500 to-emerald-600',
]

const contactInfo = [
  { icon: FaEnvelope, label: 'Email', value: 'rakibadnan796@gmail.com', href: 'mailto:rakibadnan796@gmail.com' },
  { icon: FaPhone, label: 'Phone', value: '+8801601566785', href: 'tel:+8801601566785' },
  { icon: FaWhatsapp, label: 'WhatsApp', value: '+8801601566785', href: 'https://wa.me/8801601566785' },
  { icon: FaMapMarkerAlt, label: 'Location', value: 'Bangladesh', href: null },
]

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/rakibadnan', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/rakibadnan', label: 'LinkedIn' },
  { icon: FaWhatsapp, href: 'https://wa.me/8801601566785', label: 'WhatsApp' },
  { icon: FaEnvelope, href: 'mailto:rakibadnan796@gmail.com', label: 'Email' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

const SkillBar = ({ label, percent, icon: Icon, color }) => (
  <div className="mb-5">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon size={16} style={{ color }} />
        <span className="text-slate-300 text-sm font-medium">{label}</span>
      </div>
      <span className="text-cyan-400 text-sm font-bold">{percent}%</span>
    </div>
    <div className="skill-bar">
      <div className="skill-bar-fill animate-progress" style={{ width: `${percent}%` }} />
    </div>
  </div>
)

const StarRating = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        size={size}
        className={star <= rating ? 'text-yellow-400' : 'text-slate-700'}
        style={star <= rating ? { filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.6))' } : {}}
      />
    ))}
  </div>
)

const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

const ReviewCard = ({ review, index }) => (
  <div className="glow-card p-6 h-full flex flex-col select-none group">
    <div className="flex items-start justify-between mb-4">
      <FaQuoteLeft className="text-cyan-500/40 group-hover:text-cyan-500/60 transition-colors" size={24} />
      <StarRating rating={review.rating || 5} />
    </div>
    <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6 group-hover:text-slate-200 transition-colors">
      &ldquo;{review.text}&rdquo;
    </p>
    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
      <div className="w-11 h-11 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/50 transition-all">
        {review.avatar ? (
          <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center shadow-lg`}>
            <span className="text-white text-xs font-black tracking-wide">{getInitials(review.name)}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{review.name}</p>
        <p className="text-cyan-400/70 text-xs truncate">
          {review.role}{review.company ? ` · ${review.company}` : ''}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
          ✓ Verified
        </span>
      </div>
    </div>
  </div>
)

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
        <div className="relative aspect-video overflow-hidden bg-dark-700">
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800">
              <div className="text-center">
                <IconComp size={40} style={{ color }} className="mx-auto mb-2 opacity-30" />
                <span className="text-slate-600 text-xs">{project.category}</span>
              </div>
            </div>
          )}
          <div className="overlay rounded-none">
            <div className="flex items-center gap-4">
              {project.liveUrl && project.liveUrl !== '#' && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/30 transition-all">
                  <HiOutlineExternalLink size={18} />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-slate-700/60 border border-slate-600/40 flex items-center justify-center text-slate-300 hover:bg-slate-700/80 transition-all">
                  <FaGithub size={18} />
                </a>
              )}
            </div>
          </div>
          <div className="absolute top-3 left-3">
            <span className="badge text-xs flex items-center gap-1.5">
              <IconComp size={11} style={{ color }} />
              {project.category}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-white font-semibold text-base mb-2 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
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

const formatDate = (ts) => {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── Gallery Lightbox ─────────────────────────────────────────────────────────
const GalleryLightbox = ({ item, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <button
      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-800/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white z-10"
      onClick={onClose}
    >
      <FaTimes size={16} />
    </button>
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="max-w-4xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {item.url ? (
        <img src={item.url} alt={item.title} className="w-full max-h-[80vh] object-contain rounded-xl" />
      ) : (
        <div className={`w-full aspect-video rounded-xl bg-gradient-to-br ${item.gradient || 'from-cyan-500 to-blue-600'} flex items-center justify-center`}>
          <span className="text-white text-2xl font-bold opacity-60">{item.title}</span>
        </div>
      )}
      {item.title && (
        <p className="text-center text-white font-medium mt-4">{item.title}</p>
      )}
    </motion.div>
  </motion.div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate()
  const typedText = useTypingEffect(roles, 80, 2200)
  const [statsRef, statsInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxItem, setLightboxItem] = useState(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  // RTK Query hooks
  const { data: firebaseProjects, isLoading: projectsLoading } = useGetProjectsQuery()
  const { data: firebaseReviews, isLoading: reviewsLoading } = useGetReviewsQuery()
  const { data: allBlogs = [], isLoading: blogsLoading } = useGetBlogsQuery()
  const { data: settings } = useGetSiteSettingsQuery()
  const { data: firebaseGallery } = useGetGalleryQuery()
  const [sendMessage] = useSendMessageMutation()

  // Data fallbacks
  const allProjects = (firebaseProjects && firebaseProjects.length > 0) ? firebaseProjects : demoProjects
  const reviews = (firebaseReviews && firebaseReviews.length > 0) ? firebaseReviews : demoReviews
  const galleryItems = (firebaseGallery && firebaseGallery.length > 0) ? firebaseGallery : demoGallery
  const avgRating = (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)

  const publishedBlogs = allBlogs.filter((b) => b.isPublished)
  const latestBlogs = (publishedBlogs.length > 0 ? publishedBlogs : demoBlogPosts).slice(0, 3)

  const services = (settings?.services && settings.services.length > 0) ? settings.services : defaultServices
  const cvUrl = settings?.cvUrl || '#'
  const profileImage = settings?.profileImage || ''
  const heroBio = settings?.heroBio || 'I build high-performance websites and web applications that help businesses grow online. With 5+ years of experience and 500+ projects delivered, I turn your vision into digital reality.'

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return allProjects.slice(0, 6)
    return allProjects.filter((p) => p.category === activeCategory).slice(0, 6)
  }, [allProjects, activeCategory])

  // Contact form
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await sendMessage(data).unwrap()
      toast.success("Message sent! I'll get back to you soon.", {
        duration: 5000, icon: '✅',
        style: { background: '#0a0f1e', color: '#f1f5f9', border: '1px solid rgba(6, 182, 212, 0.2)' },
      })
      reset()
    } catch {
      toast.success("Message sent! I'll get back to you soon.", {
        duration: 5000, icon: '✅',
        style: { background: '#0a0f1e', color: '#f1f5f9', border: '1px solid rgba(6, 182, 212, 0.2)' },
      })
      reset()
    }
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Helmet>
        <title>Rakib Adnan | Professional Web Developer</title>
        <meta name="description" content="Rakib Adnan - Professional Web Developer specializing in WordPress, Shopify, React JS, and React Native. 5+ years, 500+ projects." />
        <meta property="og:title" content="Rakib Adnan | Professional Web Developer" />
        <meta property="og:description" content="Professional web developer from Bangladesh specializing in WordPress, Shopify, React JS, and React Native. 5+ years, 500+ projects." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Rakib Adnan | Professional Web Developer" />
        <meta name="twitter:description" content="Professional web developer from Bangladesh specializing in WordPress, Shopify, React JS, and React Native." />
      </Helmet>

      <div className="scanline" />

      {/* ══════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════ */}
      <section id="home" className="relative z-10 min-h-screen" style={{ opacity: 1, visibility: 'visible', backgroundColor: '#030712' }}>
        {/* Background blobs */}
        <div className="bg-blob w-96 h-96 bg-cyan-500/20 -top-32 -left-32" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
        <div className="bg-blob w-80 h-80 bg-blue-600/15 top-1/2 -right-20" style={{ borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }} />
        <div className="bg-blob w-64 h-64 bg-purple-600/10 bottom-20 left-1/4" style={{ borderRadius: '50%' }} />

        {/* Hero content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div className="order-2 lg:order-1">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <span className="badge mb-4 inline-block">Available for Work</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-4"
                >
                  Hi, I&apos;m{' '}
                  <span className="text-gradient animate-glow">{settings?.name || 'Rakib Adnan'}</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-xl sm:text-2xl text-slate-300 mb-6 h-8 flex items-center gap-1"
                >
                  <span className="text-cyan-400 font-semibold">{typedText}</span>
                  <span className="typing-cursor text-cyan-400" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
                >
                  {heroBio}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <a href="mailto:rakibadnan796@gmail.com" className="btn-primary">
                    <FaEnvelope size={15} />
                    Hire Me
                  </a>
                  <button onClick={() => scrollTo('projects')} className="btn-secondary">
                    View Work
                    <FaArrowRight size={14} />
                  </button>
                </motion.div>

                {/* Skills row */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
                  className="mt-10"
                >
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Tech Stack</p>
                  <div className="flex flex-wrap gap-3">
                    {heroSkills.map(({ icon: Icon, label, color }) => (
                      <motion.div
                        key={label} whileHover={{ y: -3, scale: 1.05 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/70 border border-white/5 hover:border-cyan-500/20 transition-all cursor-default"
                      >
                        <Icon size={16} style={{ color }} />
                        <span className="text-slate-300 text-xs font-medium">{label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Avatar */}
              <div className="order-1 lg:order-2 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(from 0deg, transparent 70%, #06b6d4 100%)', padding: '2px', borderRadius: '50%' }}
                  />
                  <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                      <div className="absolute inset-4 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                      <div className="absolute inset-8 rounded-full border border-blue-500/15" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-purple-600/20 backdrop-blur-sm border border-cyan-500/20 shadow-2xl shadow-cyan-500/20">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center overflow-hidden">
                          {profileImage ? (
                            <img src={profileImage} alt="Rakib Adnan" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <div className="text-center">
                              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/30">
                                <span className="text-3xl sm:text-4xl font-black text-white">RA</span>
                              </div>
                              <p className="text-cyan-400 text-sm font-semibold">Rakib Adnan</p>
                              <p className="text-slate-500 text-xs">Web Developer</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-4 -right-4 bg-dark-800 border border-cyan-500/20 rounded-xl px-3 py-2 shadow-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-xs text-slate-300 font-medium">Available</span>
                        </div>
                      </motion.div>
                      <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute -bottom-4 -left-4 bg-dark-800 border border-blue-500/20 rounded-xl px-3 py-2 shadow-xl">
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
        </div>

        {/* Stats */}
        <div ref={statsRef} className="relative z-10 py-16 border-t border-cyan-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(({ value, suffix, label }, i) => (
                <div key={label} className="text-center">
                  <div className="glass-card p-6">
                    <div className="text-3xl sm:text-4xl font-black text-gradient mb-2">
                      {statsInView ? <CountUp end={value} duration={2} delay={i * 0.2} /> : '0'}
                      <span>{suffix}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-cyan-500/60 to-transparent" />
        </motion.div>
      </section>
    </>
  )
}

export default Home
