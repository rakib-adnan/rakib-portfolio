// @ts-nocheck
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiSave, HiPlus, HiTrash } from 'react-icons/hi'
import { useGetAboutContentQuery, useUpdateAboutContentMutation } from '../../../services/portfolioApi'

const toastStyle = {
  style: { background: '#0a0f1e', color: '#f1f5f9', border: '1px solid rgba(6,182,212,0.2)' },
}

const ManageAbout = () => {
  const { data: remote, isLoading } = useGetAboutContentQuery()
  const [updateAbout, { isLoading: saving }] = useUpdateAboutContentMutation()

  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState([])
  const [experience, setExperience] = useState([])

  useEffect(() => {
    if (!remote) return
    setBio(remote.bio || '')
    setSkills(remote.skills || [])
    setExperience(remote.experience || [])
  }, [remote])

  const handleSave = async () => {
    try {
      await updateAbout({ bio, skills, experience }).unwrap()
      toast.success('About content saved!', toastStyle)
    } catch {
      toast.error('Failed to save.', toastStyle)
    }
  }

  // ── Skills helpers ─────────────────────────────────────────────
  const addSkill = () => setSkills(s => [...s, { label: '', percent: 80, color: '#06b6d4' }])
  const updateSkill = (i, field, val) => setSkills(s => s.map((sk, idx) => idx === i ? { ...sk, [field]: val } : sk))
  const removeSkill = (i) => setSkills(s => s.filter((_, idx) => idx !== i))

  // ── Experience helpers ─────────────────────────────────────────
  const addExp = () => setExperience(e => [...e, { year: '', role: '', company: '', description: '' }])
  const updateExp = (i, field, val) => setExperience(e => e.map((ex, idx) => idx === i ? { ...ex, [field]: val } : ex))
  const removeExp = (i) => setExperience(e => e.filter((_, idx) => idx !== i))

  if (isLoading) return (
    <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="glass-card h-16 animate-pulse" />)}</div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">About Page</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage bio, skills and experience shown on the About page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
          <HiSave size={15} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Bio */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold mb-4">Bio / About Text</h2>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={5}
            placeholder="Write your bio here…"
            className="form-input w-full resize-none"
          />
        </div>

        {/* Skills */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Skills</h2>
            <button onClick={addSkill} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-dark-700 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-all">
              <HiPlus size={14} /> Add Skill
            </button>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {skills.map((sk, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  className="flex items-center gap-3">
                  <input
                    type="color"
                    value={sk.color || '#06b6d4'}
                    onChange={e => updateSkill(i, 'color', e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-white/10 bg-transparent flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={sk.label}
                    onChange={e => updateSkill(i, 'label', e.target.value)}
                    placeholder="Skill name"
                    className="form-input text-sm py-2 flex-1"
                  />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="range"
                      min={0} max={100}
                      value={sk.percent}
                      onChange={e => updateSkill(i, 'percent', Number(e.target.value))}
                      className="w-24 accent-cyan-500"
                    />
                    <span className="text-cyan-400 text-sm font-bold w-10 text-right">{sk.percent}%</span>
                  </div>
                  <button onClick={() => removeSkill(i)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
                    <HiTrash size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {skills.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No skills yet. Add one above.</p>}
          </div>
        </div>

        {/* Experience */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Experience / Timeline</h2>
            <button onClick={addExp} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-dark-700 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-all">
              <HiPlus size={14} /> Add Entry
            </button>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {experience.map((ex, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  className="glass-card p-4 border border-cyan-500/10">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={ex.year}
                      onChange={e => updateExp(i, 'year', e.target.value)}
                      placeholder="2022 – Present"
                      className="form-input text-sm py-2"
                    />
                    <input
                      type="text"
                      value={ex.company}
                      onChange={e => updateExp(i, 'company', e.target.value)}
                      placeholder="Company name"
                      className="form-input text-sm py-2"
                    />
                  </div>
                  <input
                    type="text"
                    value={ex.role}
                    onChange={e => updateExp(i, 'role', e.target.value)}
                    placeholder="Job title / Role"
                    className="form-input text-sm py-2 w-full mb-3"
                  />
                  <div className="flex gap-3">
                    <textarea
                      value={ex.description}
                      onChange={e => updateExp(i, 'description', e.target.value)}
                      placeholder="Description of responsibilities…"
                      rows={2}
                      className="form-input text-sm py-2 flex-1 resize-none"
                    />
                    <button onClick={() => removeExp(i)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 mt-1">
                      <HiTrash size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {experience.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No entries yet. Add one above.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageAbout
