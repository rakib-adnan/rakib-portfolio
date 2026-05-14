// @ts-nocheck
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiExternalLink,
  HiCode,
  HiPhotograph,
  HiLink,
  HiStar,
} from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '../../../services/portfolioApi'
import { useStorage } from '../../../hooks/useStorage'

const CATEGORIES = ['WordPress', 'Shopify', 'React', 'React Native', 'Other']

const toastStyle = {
  style: {
    background: '#0a0f1e',
    color: '#f1f5f9',
    border: '1px solid rgba(6, 182, 212, 0.2)',
  },
}

const ProjectModal = ({ project, onClose }) => {
  const isEditing = Boolean(project?.id)
  const [addProject, { isLoading: adding }] = useAddProjectMutation()
  const [updateProject, { isLoading: updating }] = useUpdateProjectMutation()
  const { uploadFile, uploading, progress } = useStorage()
  const [useFileUpload, setUseFileUpload] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(project?.image || '')
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: isEditing
      ? {
          title: project.title,
          description: project.description,
          category: project.category,
          image: project.image || '',
          liveUrl: project.liveUrl || '',
          githubUrl: project.githubUrl || '',
          technologies: (project.technologies || project.tags || []).join(', '),
          featured: project.featured || false,
        }
      : { featured: false },
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const onSubmit = async (data) => {
    try {
      let imageUrl = data.image || ''

      if (useFileUpload && fileInputRef.current?.files?.[0]) {
        imageUrl = await uploadFile(fileInputRef.current.files[0])
      }

      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        image: imageUrl,
        liveUrl: data.liveUrl || '',
        githubUrl: data.githubUrl || '',
        technologies: data.technologies
          ? data.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        tags: data.technologies
          ? data.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        featured: data.featured || false,
      }

      if (isEditing) {
        await updateProject({ id: project.id, ...payload }).unwrap()
        toast.success('Project updated!', toastStyle)
      } else {
        await addProject(payload).unwrap()
        toast.success('Project added!', toastStyle)
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
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Title *</label>
            <input
              type="text"
              placeholder="Project title"
              {...register('title', { required: 'Title is required' })}
              className={`form-input ${errors.title ? 'border-red-500/50' : ''}`}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Description *</label>
            <textarea
              rows={3}
              placeholder="Brief project description"
              {...register('description', { required: 'Description is required' })}
              className={`form-input resize-none ${errors.description ? 'border-red-500/50' : ''}`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Category *</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="form-input"
              style={{ background: '#0a0f1e' }}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ background: '#0a0f1e' }}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Image - toggle between file upload and URL */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Project Image</label>
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
                <HiPhotograph size={12} /> Upload File
              </button>
            </div>

            {!useFileUpload ? (
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register('image')}
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
                  className="w-full form-input text-left text-slate-500 hover:border-cyan-500/30 flex items-center gap-2"
                >
                  <HiPhotograph size={16} />
                  {fileInputRef.current?.files?.[0]?.name || 'Choose image file...'}
                </button>
                {uploading && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {previewUrl && (
              <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-cyan-500/10">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Technologies (comma separated)</label>
            <input
              type="text"
              placeholder="React, Firebase, Tailwind"
              {...register('technologies')}
              className="form-input"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Live URL</label>
              <input
                type="url"
                placeholder="https://..."
                {...register('liveUrl')}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                {...register('githubUrl')}
                className="form-input"
              />
            </div>
          </div>

          {/* Featured */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-5 rounded-full transition-colors ${
                    watch('featured') ? 'bg-cyan-500' : 'bg-dark-700 border border-white/10'
                  }`}
                />
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    watch('featured') ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-slate-300 text-sm">Mark as Featured</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adding || updating || uploading}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {adding || updating || uploading ? 'Saving...' : isEditing ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const ManageProjects = () => {
  const { data: projects = [], isLoading } = useGetProjectsQuery()
  const [deleteProject, { isLoading: deleting }] = useDeleteProjectMutation()
  const [modalProject, setModalProject] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleAdd = () => {
    setModalProject(null)
    setShowModal(true)
  }

  const handleEdit = (project) => {
    setModalProject(project)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProject(id).unwrap()
      toast.success('Project deleted', toastStyle)
    } catch {
      toast.error('Error deleting project. Check Firebase config.', toastStyle)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Manage Projects</h1>
          <p className="text-slate-400 text-sm mt-0.5">{projects.length} projects</p>
        </div>
        <button onClick={handleAdd} className="btn-primary py-2 px-4 text-sm">
          <HiPlus size={16} />
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card h-48 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiCode size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-2">No projects yet</p>
          <p className="text-slate-600 text-sm">Add your first project to showcase your work</p>
          <button onClick={handleAdd} className="btn-primary mt-4 text-sm py-2 px-4">
            <HiPlus size={14} />
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden group"
            >
              {/* Image */}
              <div className="relative w-full h-36 bg-dark-700/80 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiCode size={32} className="text-slate-600" />
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                    <HiStar size={10} />
                    Featured
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-white font-medium text-sm leading-snug line-clamp-1">{project.title}</p>
                  <span className="badge text-xs py-0 flex-shrink-0">{project.category}</span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">
                  {project.description}
                </p>

                {/* Tech tags */}
                {(project.technologies || project.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(project.technologies || project.tags || []).slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-dark-700/80 text-slate-400 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <HiExternalLink size={12} />
                      Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      <FaGithub size={11} />
                      GitHub
                    </a>
                  )}
                  <div className="flex-1" />
                  <button
                    onClick={() => handleEdit(project)}
                    className="w-7 h-7 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/10 hover:border-cyan-500/30 flex items-center justify-center text-cyan-400 transition-all"
                  >
                    <HiPencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting}
                    className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 flex items-center justify-center text-red-400 transition-all"
                  >
                    <HiTrash size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <ProjectModal
            project={modalProject}
            onClose={() => {
              setShowModal(false)
              setModalProject(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageProjects
