// @ts-nocheck
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiPlus, HiTrash, HiSave, HiMenuAlt2, HiTemplate } from 'react-icons/hi'
import { FaGlobe } from 'react-icons/fa'
import { useGetPagesQuery, useUpdatePagesMutation } from '../../../services/portfolioApi'

const toastStyle = {
  style: { background: '#0a0f1e', color: '#f1f5f9', border: '1px solid rgba(6,182,212,0.2)' },
}

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
      checked ? 'bg-cyan-500' : 'bg-slate-700'
    }`}
    title={label}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
)

const ManagePages = () => {
  const { data: remotePages, isLoading } = useGetPagesQuery()
  const [updatePages, { isLoading: saving }] = useUpdatePagesMutation()
  const [pages, setPages] = useState([])

  useEffect(() => {
    if (remotePages) setPages(remotePages)
  }, [remotePages])

  const update = (id, field, value) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const addCustomPage = () => {
    const newPage = {
      id: `custom_${Date.now()}`,
      name: 'New Page',
      slug: '/new-page',
      showInHeader: false,
      showInFooter: true,
      isBuiltIn: false,
      order: pages.length,
    }
    setPages((prev) => [...prev, newPage])
  }

  const removePage = (id) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSave = async () => {
    try {
      await updatePages(pages).unwrap()
      toast.success('Pages saved!', toastStyle)
    } catch {
      toast.error('Failed to save pages.', toastStyle)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card h-16 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Pages</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Control which pages show in the header navigation and footer
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addCustomPage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-dark-700 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-all"
          >
            <HiPlus size={15} />
            Add Page
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            <HiSave size={15} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <HiMenuAlt2 size={14} className="text-cyan-400" />
          <span>Show in Header (Navbar)</span>
        </div>
        <div className="flex items-center gap-2">
          <HiTemplate size={14} className="text-blue-400" />
          <span>Show in Footer</span>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {pages.map((page) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-4">
                {/* Page icon */}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <FaGlobe size={14} className="text-cyan-400" />
                </div>

                {/* Name + slug */}
                {page.isBuiltIn ? (
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{page.name}</p>
                    <p className="text-slate-500 text-xs font-mono">{page.slug}</p>
                  </div>
                ) : (
                  <div className="flex-1 flex gap-3 min-w-0">
                    <input
                      type="text"
                      value={page.name}
                      onChange={(e) => update(page.id, 'name', e.target.value)}
                      placeholder="Page name"
                      className="form-input text-sm py-1.5 flex-1"
                    />
                    <input
                      type="text"
                      value={page.slug}
                      onChange={(e) => update(page.id, 'slug', e.target.value)}
                      placeholder="/slug or https://..."
                      className="form-input text-sm py-1.5 flex-1 font-mono"
                    />
                  </div>
                )}

                {/* Toggles */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <HiMenuAlt2 size={14} className="text-cyan-400/60" />
                    <Toggle
                      checked={page.showInHeader}
                      onChange={(v) => update(page.id, 'showInHeader', v)}
                      label="Show in Header"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <HiTemplate size={14} className="text-blue-400/60" />
                    <Toggle
                      checked={page.showInFooter}
                      onChange={(v) => update(page.id, 'showInFooter', v)}
                      label="Show in Footer"
                    />
                  </div>
                </div>

                {/* Delete (custom only) */}
                {!page.isBuiltIn && (
                  <button
                    onClick={() => removePage(page.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                  >
                    <HiTrash size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
        <p className="text-slate-500 text-xs leading-relaxed">
          <span className="text-cyan-400 font-medium">Header</span> toggle = page link appears in the top navigation bar.{' '}
          <span className="text-blue-400 font-medium">Footer</span> toggle = page link appears in the site footer.
          Custom pages can point to any URL (internal slug like <code className="text-cyan-400">/portfolio</code> or external URL like <code className="text-cyan-400">https://...</code>).
        </p>
      </div>
    </div>
  )
}

export default ManagePages
