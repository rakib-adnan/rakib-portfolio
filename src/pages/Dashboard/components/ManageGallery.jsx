import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiPhotograph,
  HiTrash,
  HiUpload,
  HiX,
  HiTag,
} from 'react-icons/hi'
import {
  useGetGalleryQuery,
  useAddGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from '../../../services/portfolioApi'
import { useStorage } from '../../../hooks/useStorage'

const toastStyle = {
  style: {
    background: '#0a0f1e',
    color: '#f1f5f9',
    border: '1px solid rgba(6, 182, 212, 0.2)',
  },
}

const CATEGORIES = ['WordPress', 'Shopify', 'React', 'React Native', 'UI/UX', 'Mobile', 'Other']

const ManageGallery = () => {
  const { data: gallery = [], isLoading } = useGetGalleryQuery()
  const [addGalleryItem, { isLoading: adding }] = useAddGalleryItemMutation()
  const [deleteGalleryItem, { isLoading: deleting }] = useDeleteGalleryItemMutation()
  const { uploadFile, uploading, progress } = useStorage()

  const [pendingFiles, setPendingFiles] = useState([])
  const [lightboxUrl, setLightboxUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const newPending = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      category: '',
    }))
    setPendingFiles((prev) => [...prev, ...newPending])
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const updatePending = (index, field, value) => {
    setPendingFiles((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const removePending = (index) => {
    setPendingFiles((prev) => {
      const copy = [...prev]
      URL.revokeObjectURL(copy[index].preview)
      copy.splice(index, 1)
      return copy
    })
  }

  const handleUploadAll = async () => {
    if (!pendingFiles.length) return
    let successCount = 0
    for (const item of pendingFiles) {
      try {
        const url = await uploadFile(item.file)
        await addGalleryItem({
          url,
          title: item.title,
          category: item.category,
        }).unwrap()
        successCount++
      } catch (err) {
        toast.error(`Failed to upload ${item.file.name}`, toastStyle)
      }
    }
    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded successfully!`, toastStyle)
      setPendingFiles([])
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return
    try {
      await deleteGalleryItem(id).unwrap()
      toast.success('Gallery item deleted', toastStyle)
    } catch {
      toast.error('Error deleting item. Check Firebase config.', toastStyle)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Manage Gallery</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {gallery.length} images in gallery
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary py-2 px-4 text-sm"
          disabled={uploading}
        >
          <HiUpload size={16} />
          Upload Images
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Pending uploads */}
      <AnimatePresence>
        {pendingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">
                Ready to Upload ({pendingFiles.length} image{pendingFiles.length !== 1 ? 's' : ''})
              </h3>
              <button
                onClick={handleUploadAll}
                disabled={uploading || adding}
                className="btn-primary py-1.5 px-4 text-sm disabled:opacity-60"
              >
                {uploading ? `Uploading... ${progress}%` : 'Upload All'}
              </button>
            </div>

            {/* Upload progress bar */}
            {uploading && (
              <div className="mb-4">
                <div className="skill-bar">
                  <div className="skill-bar-fill transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-slate-500 text-xs mt-1">{progress}% uploaded</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingFiles.map((item, index) => (
                <div key={index} className="relative bg-dark-700/50 rounded-xl overflow-hidden border border-white/5">
                  <button
                    onClick={() => removePending(index)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-dark-900/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <HiX size={14} />
                  </button>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.preview}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Title (optional)"
                      value={item.title}
                      onChange={(e) => updatePending(index, 'title', e.target.value)}
                      className="form-input text-sm py-1.5"
                    />
                    <select
                      value={item.category}
                      onChange={(e) => updatePending(index, 'category', e.target.value)}
                      className="form-input text-sm py-1.5"
                      style={{ background: '#0a0f1e' }}
                    >
                      <option value="">Category (optional)</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} style={{ background: '#0a0f1e' }}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card aspect-video animate-pulse" />
          ))}
        </div>
      ) : gallery.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiPhotograph size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-2">No images in gallery yet</p>
          <p className="text-slate-600 text-sm mb-4">Upload images to showcase your work</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary text-sm py-2 px-4"
          >
            <HiUpload size={14} />
            Upload Images
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative glass-card overflow-hidden"
            >
              <div
                className="aspect-video overflow-hidden cursor-pointer"
                onClick={() => setLightboxUrl(item.url)}
              >
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.title || 'Gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                    <HiPhotograph size={32} className="text-slate-600" />
                  </div>
                )}
              </div>

              {/* Info overlay */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {item.title && (
                      <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    )}
                    {item.category && (
                      <span className="badge text-xs py-0 mt-1 inline-flex items-center gap-1">
                        <HiTag size={9} />
                        {item.category}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting}
                    className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 flex items-center justify-center text-red-400 transition-all flex-shrink-0"
                    title="Delete"
                  >
                    <HiTrash size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-800/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              onClick={() => setLightboxUrl(null)}
            >
              <HiX size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxUrl}
              alt="Gallery preview"
              className="max-w-4xl w-full max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageGallery
