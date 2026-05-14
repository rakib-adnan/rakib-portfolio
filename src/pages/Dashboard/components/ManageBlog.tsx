// @ts-nocheck
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import toast from 'react-hot-toast'
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiPhotograph,
  HiLink,
  HiEye,
  HiEyeOff,
  HiDocumentText,
} from 'react-icons/hi'
import {
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '../../../services/portfolioApi'
import { useStorage } from '../../../hooks/useStorage'

const CATEGORIES = ['WordPress', 'Shopify', 'React', 'React Native', 'JavaScript', 'Tutorial', 'General']

const toastStyle = {
  style: {
    background: '#0a0f1e',
    color: '#f1f5f9',
    border: '1px solid rgba(6, 182, 212, 0.2)',
  },
}

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const formatDate = (ts) => {
  if (!ts) return '—'
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
}

const BlogModal = ({ blog, onClose }) => {
  const isEditing = Boolean(blog?.id)
  const [addBlog, { isLoading: adding }] = useAddBlogMutation()
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation()
  const { uploadFile, uploading, progress } = useStorage()

  const [title, setTitle] = useState(blog?.title || '')
  const [slug, setSlug] = useState(blog?.slug || '')
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '')
  const [content, setContent] = useState(blog?.content || '')
  const [category, setCategory] = useState(blog?.category || '')
  const [tags, setTags] = useState((blog?.tags || []).join(', '))
  const [isPublished, setIsPublished] = useState(blog?.isPublished || false)
  const [featuredImage, setFeaturedImage] = useState(blog?.featuredImage || '')
  const [useFileUpload, setUseFileUpload] = useState(false)
  const fileInputRef = useRef(null)

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    if (!isEditing || !blog?.slug) {
      setSlug(generateSlug(e.target.value))
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadFile(file)
      setFeaturedImage(url)
      toast.success('Image uploaded!', toastStyle)
    } catch {
      toast.error('Image upload failed.', toastStyle)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required', toastStyle)
      return
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim(),
      content,
      featuredImage,
      category,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      isPublished,
    }

    try {
      if (isEditing) {
        await updateBlog({ id: blog.id, ...payload }).unwrap()
        toast.success('Blog post updated!', toastStyle)
      } else {
        await addBlog(payload).unwrap()
        toast.success('Blog post created!', toastStyle)
      }
      onClose()
    } catch {
      toast.error('Something went wrong. Check Firebase config.', toastStyle)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative glass-card p-6 w-full max-w-3xl max-h-[92vh] overflow-y-auto z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">
            {isEditing ? 'Edit Blog Post' : 'New Blog Post'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <HiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Title *</label>
            <input
              type="text"
              placeholder="Blog post title"
              value={title}
              onChange={handleTitleChange}
              className="form-input"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Slug</label>
            <input
              type="text"
              placeholder="auto-generated-from-title"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="form-input font-mono text-sm"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Featured Image</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setUseFileUpload(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  !useFileUpload
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-cyan-500/20'
                }`}
              >
                <HiLink size={12} /> URL
              </button>
              <button
                type="button"
                onClick={() => setUseFileUpload(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  useFileUpload
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-cyan-500/20'
                }`}
              >
                <HiPhotograph size={12} /> Upload
              </button>
            </div>
            {!useFileUpload ? (
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="form-input"
              />
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full form-input text-left text-slate-500 hover:border-cyan-500/30 flex items-center gap-2 disabled:opacity-60"
                >
                  <HiPhotograph size={16} />
                  {uploading ? `Uploading... ${progress}%` : 'Choose image file...'}
                </button>
                {uploading && (
                  <div className="mt-2">
                    <div className="skill-bar">
                      <div className="skill-bar-fill transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}
            {featuredImage && (
              <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-cyan-500/10">
                <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Category + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                style={{ background: '#0a0f1e' }}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: '#0a0f1e' }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="react, wordpress, tips"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Excerpt</label>
            <textarea
              rows={2}
              placeholder="Brief summary of the post..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="form-input resize-none"
            />
          </div>

          {/* Rich text content */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Content</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              theme="snow"
              placeholder="Write your blog post content here..."
            />
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-dark-700/50 border border-white/5">
            <div>
              <p className="text-white text-sm font-medium">
                {isPublished ? 'Published' : 'Draft'}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {isPublished ? 'Visible to public on /blog' : 'Only visible in dashboard'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isPublished
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-dark-700/80 text-slate-400 border border-white/10 hover:border-cyan-500/20'
              }`}
            >
              {isPublished ? <HiEye size={16} /> : <HiEyeOff size={16} />}
              {isPublished ? 'Published' : 'Set Published'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={adding || updating || uploading}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {adding || updating ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const ManageBlog = () => {
  const { data: blogs = [], isLoading } = useGetBlogsQuery()
  const [deleteBlog, { isLoading: deleting }] = useDeleteBlogMutation()
  const [modalBlog, setModalBlog] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleAdd = () => {
    setModalBlog(null)
    setShowModal(true)
  }

  const handleEdit = (blog) => {
    setModalBlog(blog)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return
    try {
      await deleteBlog(id).unwrap()
      toast.success('Blog post deleted', toastStyle)
    } catch {
      toast.error('Error deleting post. Check Firebase config.', toastStyle)
    }
  }

  const published = blogs.filter((b) => b.isPublished).length
  const drafts = blogs.length - published

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Manage Blog</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {blogs.length} posts &middot; {published} published &middot; {drafts} drafts
          </p>
        </div>
        <button onClick={handleAdd} className="btn-primary py-2 px-4 text-sm">
          <HiPlus size={16} />
          New Post
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-16 animate-pulse" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiDocumentText size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-2">No blog posts yet</p>
          <p className="text-slate-600 text-sm">Create your first blog post to share your knowledge</p>
          <button onClick={handleAdd} className="btn-primary mt-4 text-sm py-2 px-4">
            <HiPlus size={14} />
            New Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-lg bg-dark-700/80 flex-shrink-0 overflow-hidden">
                {blog.featuredImage ? (
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiDocumentText size={20} className="text-slate-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{blog.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {blog.category && (
                    <span className="badge text-xs py-0">{blog.category}</span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      blog.isPublished
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-slate-500 text-xs">{formatDate(blog.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {blog.isPublished && (
                  <a
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/10 hover:border-blue-500/30 flex items-center justify-center text-blue-400 transition-all"
                    title="View post"
                  >
                    <HiEye size={14} />
                  </a>
                )}
                <button
                  onClick={() => handleEdit(blog)}
                  className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/10 hover:border-cyan-500/30 flex items-center justify-center text-cyan-400 transition-all"
                >
                  <HiPencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  disabled={deleting}
                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 flex items-center justify-center text-red-400 transition-all"
                >
                  <HiTrash size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <BlogModal
            blog={modalBlog}
            onClose={() => {
              setShowModal(false)
              setModalBlog(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageBlog
