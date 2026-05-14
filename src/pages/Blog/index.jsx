import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { HiCalendar, HiTag, HiArrowRight, HiSearch } from 'react-icons/hi'
import { useGetBlogsQuery } from '../../services/portfolioApi'
import SectionTitle from '../../components/common/SectionTitle'
import AnimatedSection from '../../components/common/AnimatedSection'

const formatDate = (ts) => {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const BlogCard = ({ post, index }) => (
  <AnimatedSection delay={index * 0.08}>
    <Link to={`/blog/${post.slug}`} className="block blog-card group h-full">
      {/* Featured Image */}
      <div className="relative w-full h-48 bg-dark-700/80 overflow-hidden">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
            <span className="text-4xl font-black text-gradient opacity-30">{post.title?.[0] || 'B'}</span>
          </div>
        )}
        {post.category && (
          <span className="absolute top-3 left-3 badge text-xs">{post.category}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <HiCalendar size={12} />
            {formatDate(post.createdAt)}
          </div>
          <span className="flex items-center gap-1 text-cyan-400 text-xs font-medium group-hover:gap-2 transition-all">
            Read More <HiArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  </AnimatedSection>
)

const Blog = () => {
  const { data: allBlogs = [], isLoading } = useGetBlogsQuery()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const publishedBlogs = allBlogs.filter((b) => b.isPublished)

  const categories = ['All', ...Array.from(new Set(publishedBlogs.map((b) => b.category).filter(Boolean)))]

  const filtered = publishedBlogs.filter((b) => {
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory
    const matchesSearch =
      !searchQuery ||
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Helmet>
        <title>Blog | Rakib Adnan - Web Developer</title>
        <meta
          name="description"
          content="Articles and tutorials on WordPress, Shopify, React JS, React Native and web development by Rakib Adnan."
        />
        <meta property="og:title" content="Blog | Rakib Adnan - Web Developer" />
        <meta property="og:description" content="Articles and tutorials on WordPress, Shopify, React JS, React Native and web development." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden mesh-bg">
        <div className="bg-blob w-80 h-80 bg-cyan-500/10 top-20 right-0" style={{ borderRadius: '50%' }} />
        <div className="bg-blob w-72 h-72 bg-blue-600/10 bottom-20 left-0" style={{ borderRadius: '50%' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding pt-32">
          <SectionTitle
            subtitle="Blog"
            title="Thoughts & Tutorials"
            description="Web development articles, tips, and tutorials to help you build better digital experiences."
          />

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>

            {/* Category filters */}
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
          </div>

          {/* Blog grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="blog-card h-72 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-dark-800/80 border border-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <HiTag size={28} className="text-slate-600" />
              </div>
              <p className="text-slate-400 mb-1">No articles found</p>
              <p className="text-slate-600 text-sm">
                {searchQuery ? 'Try a different search term' : 'Check back soon for new content!'}
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Blog
