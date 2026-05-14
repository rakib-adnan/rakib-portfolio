// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'
import {
  HiArrowLeft,
  HiCalendar,
  HiTag,
  HiClock,
  HiLink,
  HiMenu,
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { useGetBlogBySlugQuery, useGetBlogsQuery } from '../../services/portfolioApi'
import toast from 'react-hot-toast'

const formatDate = (ts) => {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const estimateReadTime = (content) => {
  if (!content) return '1 min read'
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min read`
}

// Extract headings from HTML content for table of contents
const extractHeadings = (html) => {
  if (!html || typeof document === 'undefined') return []
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const headings = tmp.querySelectorAll('h1, h2, h3')
  return Array.from(headings).map((h, i) => ({
    id: `heading-${i}`,
    text: h.textContent,
    level: parseInt(h.tagName[1]),
  }))
}

// Inject IDs into headings in the content
const injectHeadingIds = (html) => {
  if (!html) return html
  let counter = 0
  return html.replace(/<(h[123])(.*?)>/gi, (match, tag, attrs) => {
    return `<${tag}${attrs} id="heading-${counter++}">`
  })
}

const BlogPost = () => {
  const { slug } = useParams()
  const { data: post, isLoading, error } = useGetBlogBySlugQuery(slug)
  const { data: allBlogs = [] } = useGetBlogsQuery()
  const [tocOpen, setTocOpen] = useState(false)
  const contentRef = useRef(null)

  const relatedPosts = allBlogs
    .filter((b) => b.slug !== slug && b.isPublished)
    .slice(0, 3)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl font-black text-gradient mb-4">404</div>
          <h2 className="text-white text-xl font-semibold mb-2">Article Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/blog" className="btn-primary">
            <HiArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const sanitizedContent = DOMPurify.sanitize(post.content || '')
  const contentWithIds = injectHeadingIds(sanitizedContent)
  const headings = extractHeadings(sanitizedContent)
  const readTime = estimateReadTime(post.content)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied to clipboard!', {
        style: { background: '#0a0f1e', color: '#f1f5f9', border: '1px solid rgba(6, 182, 212, 0.2)' },
      })
    })
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${post.title} — ${window.location.href}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const scrollToHeading = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTocOpen(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Rakib Adnan Blog</title>
        <meta name="description" content={post.excerpt || `${post.title} - Rakib Adnan Blog`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        <div className="bg-blob w-80 h-80 bg-cyan-500/10 top-20 -right-20" style={{ borderRadius: '50%' }} />
        <div className="bg-blob w-72 h-72 bg-blue-600/10 bottom-40 -left-10" style={{ borderRadius: '50%' }} />

        {/* ── Full-width Hero Header ──────────────────────────────── */}
        <div className="relative w-full" style={{ minHeight: '420px' }}>
          {post.featuredImage ? (
            <div className="absolute inset-0">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/70 to-dark-900" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-dark-800 via-dark-850 to-dark-900">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10" />
            </div>
          )}

          {/* Header content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors text-sm group bg-dark-900/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-500/30"
              >
                <HiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Category badge */}
              {post.category && (
                <div className="flex items-center gap-2 mb-4">
                  <HiTag size={14} className="text-cyan-400" />
                  <span className="badge">{post.category}</span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Author */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
                    <span className="text-white text-xs font-black">RA</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none">Rakib Adnan</p>
                    <p className="text-slate-400 text-xs mt-0.5">Web Developer</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  {post.createdAt && (
                    <span className="flex items-center gap-1.5">
                      <HiCalendar size={14} />
                      {formatDate(post.createdAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <HiClock size={14} />
                    {readTime}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Main Content Area ───────────────────────────────────── */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex gap-8">
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-cyan-500/10"
                >
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-dark-700/80 text-slate-400 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Share buttons + TOC toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="text-slate-500 text-xs uppercase tracking-widest">Share:</span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700/50 border border-white/5 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all text-xs"
                >
                  <HiLink size={13} />
                  Copy Link
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/15 hover:border-green-500/30 text-green-400 hover:text-green-300 transition-all text-xs"
                >
                  <FaWhatsapp size={13} />
                  WhatsApp
                </button>
                {headings.length > 0 && (
                  <button
                    onClick={() => setTocOpen(!tocOpen)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700/50 border border-white/5 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all text-xs"
                  >
                    <HiMenu size={13} />
                    {tocOpen ? 'Hide' : 'Contents'}
                  </button>
                )}
              </motion.div>

              {/* Table of Contents */}
              {tocOpen && headings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card p-5 mb-8 border border-cyan-500/10"
                >
                  <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <HiMenu size={16} className="text-cyan-400" />
                    Table of Contents
                  </h3>
                  <ul className="space-y-1.5">
                    {headings.map((heading) => (
                      <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}>
                        <button
                          onClick={() => scrollToHeading(heading.id)}
                          className="text-slate-400 hover:text-cyan-400 text-sm transition-colors text-left leading-snug"
                        >
                          {heading.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Article content */}
              <motion.div
                ref={contentRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                />
              </motion.div>

              {/* Bottom share + back */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 pt-8 border-t border-cyan-500/10 flex flex-wrap items-center justify-between gap-4"
              >
                <Link to="/blog" className="btn-secondary inline-flex">
                  <HiArrowLeft size={16} />
                  Back to Blog
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm">Share this post:</span>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-700/50 border border-white/5 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all text-sm"
                  >
                    <HiLink size={14} />
                    Copy Link
                  </button>
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/15 hover:border-green-500/30 text-green-400 text-sm transition-all"
                  >
                    <FaWhatsapp size={14} />
                    WhatsApp
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Related Posts ───────────────────────────────────────── */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 pt-12 border-t border-cyan-500/10"
            >
              <h2 className="text-white font-bold text-2xl mb-8">Related Articles</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="block blog-card group"
                  >
                    <div className="relative w-full aspect-video bg-dark-700/80 overflow-hidden">
                      {related.featuredImage ? (
                        <img
                          src={related.featuredImage}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
                          <span className="text-4xl font-black text-gradient opacity-30">
                            {related.title?.[0] || 'B'}
                          </span>
                        </div>
                      )}
                      {related.category && (
                        <span className="absolute top-3 left-3 badge text-xs">{related.category}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-slate-500 text-xs mb-2 flex items-center gap-1">
                        <HiCalendar size={11} />
                        {formatDate(related.createdAt)}
                      </p>
                      <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-slate-400 text-xs mt-2 line-clamp-2">{related.excerpt}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          color: #f1f5f9;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
          scroll-margin-top: 100px;
        }
        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 { font-size: 1.625rem; border-bottom: 1px solid rgba(6, 182, 212, 0.15); padding-bottom: 0.5rem; }
        .blog-content h3 { font-size: 1.375rem; }
        .blog-content p {
          margin-bottom: 1.25rem;
          color: #cbd5e1;
          line-height: 1.8;
        }
        .blog-content a {
          color: #22d3ee;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .blog-content a:hover { color: #06b6d4; }
        .blog-content ul,
        .blog-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
          color: #cbd5e1;
        }
        .blog-content li { margin-bottom: 0.5rem; line-height: 1.7; }
        .blog-content ul li { list-style-type: disc; }
        .blog-content ol li { list-style-type: decimal; }
        .blog-content blockquote {
          border-left: 3px solid #06b6d4;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #94a3b8;
          font-style: italic;
          background: rgba(6, 182, 212, 0.05);
          padding: 1rem 1rem 1rem 1.25rem;
          border-radius: 0 8px 8px 0;
        }
        .blog-content code {
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.15);
          color: #22d3ee;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.875em;
          font-family: 'Fira Code', 'Cascadia Code', monospace;
        }
        .blog-content pre {
          background: #0a0f1e;
          border: 1px solid rgba(6, 182, 212, 0.15);
          border-radius: 8px;
          padding: 1.25rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        .blog-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: #e2e8f0;
          font-size: 0.875rem;
        }
        .blog-content img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1.5rem auto;
          border: 1px solid rgba(6, 182, 212, 0.1);
          display: block;
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid rgba(6, 182, 212, 0.15);
          margin: 2rem 0;
        }
        .blog-content strong { color: #f1f5f9; font-weight: 600; }
        .blog-content em { color: #94a3b8; }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
        }
        .blog-content th, .blog-content td {
          border: 1px solid rgba(6, 182, 212, 0.15);
          padding: 0.75rem 1rem;
          text-align: left;
        }
        .blog-content th {
          background: rgba(6, 182, 212, 0.1);
          color: #f1f5f9;
          font-weight: 600;
        }
        .blog-content td { color: #cbd5e1; }
      `}</style>
    </>
  )
}

export default BlogPost
