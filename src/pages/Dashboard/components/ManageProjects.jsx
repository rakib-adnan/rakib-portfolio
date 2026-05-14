import { useState } from 'react'
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
} from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '../../../services/portfolioApi'

const CATEGORIES = ['WordPress', 'Shopify', 'React', 'React Native', 'JavaScript', 'Other']

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

  const {
    register,
    handleSubmit,
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
          tags: (project.tags || []).join(', '),
        }
      : {},
  })

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
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

          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register('image')}
              className="form-input"
            />
          </div>

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

          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="React, Firebase, Tailwind"
              {...register('tags')}
              className="form-input"
            />
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
              disabled={adding || updating}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {adding || updating ? 'Saving...' : isEditing ? 'Update Project' : 'Add Project'}
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
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-16 animate-pulse" />
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
        <div className="space-y-3">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-lg bg-dark-700/80 flex-shrink-0 overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiCode size={20} className="text-slate-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{project.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="badge text-xs py-0">{project.category}</span>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="text-slate-500 hover:text-cyan-400 transition-colors">
                      <HiExternalLink size={13} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-300 transition-colors">
                      <FaGithub size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(project)}
                  className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/10 hover:border-cyan-500/30 flex items-center justify-center text-cyan-400 transition-all"
                >
                  <HiPencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
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
