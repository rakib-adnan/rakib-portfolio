// @ts-nocheck
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiSave,
  HiPhotograph,
  HiPlus,
  HiTrash,
  HiUpload,
  HiLink,
  HiColorSwatch,
} from 'react-icons/hi'
import {
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
} from '../../../services/portfolioApi'
import { useStorage } from '../../../hooks/useStorage'

const toastStyle = {
  style: {
    background: '#0a0f1e',
    color: '#f1f5f9',
    border: '1px solid rgba(6, 182, 212, 0.2)',
  },
}

const serviceIconOptions = [
  'wordpress', 'shopify', 'react', 'mobile', 'seo', 'design', 'js', 'code',
]

const defaultServiceItem = { icon: 'code', title: '', desc: '', color: '#06b6d4' }

const ManageSettings = () => {
  const { data: settings, isLoading } = useGetSiteSettingsQuery()
  const [updateSiteSettings, { isLoading: saving }] = useUpdateSiteSettingsMutation()
  const { uploadFile, uploading, progress } = useStorage()

  const logoInputRef = useRef(null)
  const profileInputRef = useRef(null)
  const bgInputRef = useRef(null)

  // Form state
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [heroBio, setHeroBio] = useState('')
  const [cvUrl, setCvUrl] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [profileImageMode, setProfileImageMode] = useState('url')
  const [logoImage, setLogoImage] = useState('')
  const [logoMode, setLogoMode] = useState('url')
  const [services, setServices] = useState([])
  const [socialGithub, setSocialGithub] = useState('')
  const [socialLinkedin, setSocialLinkedin] = useState('')
  const [socialWhatsapp, setSocialWhatsapp] = useState('')
  const [pageBackgrounds, setPageBackgrounds] = useState({
    home:     { type: 'default', color: '#030712', image: '' },
    about:    { type: 'default', color: '#030712', image: '' },
    projects: { type: 'default', color: '#030712', image: '' },
    reviews:  { type: 'default', color: '#030712', image: '' },
    blog:     { type: 'default', color: '#030712', image: '' },
    gallery:  { type: 'default', color: '#030712', image: '' },
    contact:  { type: 'default', color: '#030712', image: '' },
  })
  const [activeBgPage, setActiveBgPage] = useState('home')
  const [bgUploadTarget, setBgUploadTarget] = useState(null)

  useEffect(() => {
    if (settings) {
      setName(settings.name || 'Rakib Adnan')
      setTagline(settings.tagline || 'Web Developer')
      setHeroBio(settings.heroBio || '')
      setCvUrl(settings.cvUrl || '')
      setProfileImage(settings.profileImage || '')
      setLogoImage(settings.logoImage || '')
      setServices(settings.services && settings.services.length > 0 ? settings.services : [])
      setSocialGithub(settings.socialLinks?.github || '')
      setSocialLinkedin(settings.socialLinks?.linkedin || '')
      setSocialWhatsapp(settings.socialLinks?.whatsapp || '')
      if (settings.pageBackgrounds) setPageBackgrounds(settings.pageBackgrounds)
    }
  }, [settings])

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadFile(file)
      setProfileImage(url)
      toast.success('Profile image uploaded!', toastStyle)
    } catch {
      toast.error('Image upload failed.', toastStyle)
    }
    e.target.value = ''
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadFile(file)
      setLogoImage(url)
      toast.success('Logo uploaded!', toastStyle)
    } catch {
      toast.error('Logo upload failed.', toastStyle)
    }
    e.target.value = ''
  }

  const handleBgImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadFile(file)
      setPageBackgrounds((prev) => ({
        ...prev,
        [activeBgPage]: { ...prev[activeBgPage], image: url, type: 'image' },
      }))
      toast.success('Background image uploaded!', toastStyle)
    } catch {
      toast.error('Upload failed.', toastStyle)
    }
    e.target.value = ''
  }

  const updateBg = (page, field, value) => {
    setPageBackgrounds((prev) => ({ ...prev, [page]: { ...prev[page], [field]: value } }))
  }

  const addService = () => {
    setServices((prev) => [...prev, { ...defaultServiceItem }])
  }

  const updateService = (index, field, value) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    )
  }

  const removeService = (index) => {
    setServices((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    try {
      await updateSiteSettings({
        name,
        tagline,
        heroBio,
        cvUrl,
        profileImage,
        logoImage,
        services,
        socialLinks: {
          github: socialGithub,
          linkedin: socialLinkedin,
          whatsapp: socialWhatsapp,
        },
        pageBackgrounds,
      }).unwrap()
      toast.success('Settings saved successfully!', toastStyle)
    } catch {
      toast.error('Error saving settings. Check Firebase config.', toastStyle)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card h-14 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Site Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your portfolio site settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <HiSave size={16} />
              Save Settings
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* ── Logo / Branding ──────────────────────────── */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Logo / Branding</h2>
            <p className="text-slate-500 text-xs mb-4">Upload your logo image for the navbar. If no logo is uploaded, the RA initials badge is shown.</p>
            <div className="flex gap-2 mb-3">
              <button type="button" onClick={() => setLogoMode('url')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${logoMode === 'url' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-cyan-500/20'}`}>
                <HiLink size={12} /> URL
              </button>
              <button type="button" onClick={() => setLogoMode('upload')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${logoMode === 'upload' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-cyan-500/20'}`}>
                <HiUpload size={12} /> Upload
              </button>
            </div>
            <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
            {logoMode === 'url' ? (
              <input type="url" value={logoImage} onChange={(e) => setLogoImage(e.target.value)}
                placeholder="https://example.com/logo.png" className="form-input" />
            ) : (
              <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploading}
                className="w-full form-input text-left text-slate-500 hover:border-cyan-500/30 flex items-center gap-2 disabled:opacity-60">
                <HiPhotograph size={16} />
                {uploading ? `Uploading... ${progress}%` : 'Choose logo image...'}
              </button>
            )}
            {logoImage && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-cyan-500/20 bg-dark-700 flex-shrink-0">
                  <img src={logoImage} alt="Logo" className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display='none' }} />
                </div>
                <div>
                  <p className="text-slate-300 text-xs font-medium">Logo set ✓</p>
                  <button type="button" onClick={() => setLogoImage('')} className="text-red-400 text-xs hover:text-red-300 mt-0.5">Remove</button>
                </div>
              </div>
            )}
          </div>

          {/* ── Page Backgrounds ─────────────────────────── */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-1 text-sm uppercase tracking-widest flex items-center gap-2">
              <HiColorSwatch size={15} className="text-cyan-400" />
              Page Backgrounds
            </h2>
            <p className="text-slate-500 text-xs mb-4">Set a custom background color or image for each page.</p>

            {/* Page tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.keys(pageBackgrounds).map((pg) => (
                <button key={pg} type="button" onClick={() => setActiveBgPage(pg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    activeBgPage === pg
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-cyan-500/20'
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>

            {/* Background type selector */}
            <div className="flex gap-2 mb-4">
              {['default', 'color', 'image'].map((t) => (
                <button key={t} type="button"
                  onClick={() => updateBg(activeBgPage, 'type', t)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                    pageBackgrounds[activeBgPage]?.type === t
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-dark-700/50 text-slate-400 border border-white/5'
                  }`}
                >
                  {t === 'default' ? 'Default Dark' : t === 'color' ? 'Custom Color' : 'Image'}
                </button>
              ))}
            </div>

            {pageBackgrounds[activeBgPage]?.type === 'color' && (
              <div className="flex items-center gap-3">
                <input type="color"
                  value={pageBackgrounds[activeBgPage]?.color || '#030712'}
                  onChange={(e) => updateBg(activeBgPage, 'color', e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer bg-transparent border-0"
                />
                <input type="text"
                  value={pageBackgrounds[activeBgPage]?.color || '#030712'}
                  onChange={(e) => updateBg(activeBgPage, 'color', e.target.value)}
                  placeholder="#030712"
                  className="form-input font-mono flex-1"
                />
              </div>
            )}

            {pageBackgrounds[activeBgPage]?.type === 'image' && (
              <div className="space-y-3">
                <input type="file" accept="image/*" ref={bgInputRef} onChange={handleBgImageUpload} className="hidden" />
                <button type="button" onClick={() => bgInputRef.current?.click()} disabled={uploading}
                  className="w-full form-input text-left text-slate-500 hover:border-cyan-500/30 flex items-center gap-2 disabled:opacity-60">
                  <HiPhotograph size={16} />
                  {uploading ? `Uploading... ${progress}%` : 'Upload background image...'}
                </button>
                <p className="text-slate-600 text-xs">— or paste a URL —</p>
                <input type="url"
                  value={pageBackgrounds[activeBgPage]?.image || ''}
                  onChange={(e) => updateBg(activeBgPage, 'image', e.target.value)}
                  placeholder="https://example.com/bg.jpg"
                  className="form-input text-sm"
                />
                {pageBackgrounds[activeBgPage]?.image && (
                  <div className="relative h-24 rounded-xl overflow-hidden border border-white/10">
                    <img src={pageBackgrounds[activeBgPage].image} alt="bg preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-medium capitalize">{activeBgPage} background</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {pageBackgrounds[activeBgPage]?.type === 'default' && (
              <p className="text-slate-600 text-xs py-2">
                Using the default dark background (#030712). Switch to "Custom Color" or "Image" to change it.
              </p>
            )}
          </div>

          {/* ── Identity ─────────────────────────────────── */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Identity</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rakib Adnan"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Tagline / Role</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Web Developer"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">Bio / About Text</label>
                <textarea
                  rows={4}
                  value={heroBio}
                  onChange={(e) => setHeroBio(e.target.value)}
                  placeholder="Tell visitors about yourself..."
                  className="form-input resize-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">CV / Resume URL</label>
                <input
                  type="url"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="form-input"
                />
                <p className="text-slate-600 text-xs mt-1">Link to your hosted CV (Google Drive, Dropbox, etc.)</p>
              </div>
            </div>
          </div>

          {/* ── Profile Image ─────────────────────────────── */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Profile Image</h2>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setProfileImageMode('url')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  profileImageMode === 'url'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-cyan-500/20'
                }`}
              >
                <HiLink size={12} /> URL
              </button>
              <button
                type="button"
                onClick={() => setProfileImageMode('upload')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  profileImageMode === 'upload'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-dark-700/50 text-slate-400 border border-white/5 hover:border-cyan-500/20'
                }`}
              >
                <HiUpload size={12} /> Upload
              </button>
            </div>

            {profileImageMode === 'url' ? (
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="form-input"
              />
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={logoInputRef}
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full form-input text-left text-slate-500 hover:border-cyan-500/30 flex items-center gap-2 disabled:opacity-60"
                >
                  <HiPhotograph size={16} />
                  {uploading ? `Uploading... ${progress}%` : 'Choose profile image...'}
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

            {profileImage && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/30 flex-shrink-0">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                <div>
                  <p className="text-slate-300 text-xs font-medium">Profile image set</p>
                  <button
                    type="button"
                    onClick={() => setProfileImage('')}
                    className="text-red-400 text-xs hover:text-red-300 transition-colors mt-0.5"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Services ──────────────────────────────────── */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-widest">Services</h2>
              <button
                type="button"
                onClick={addService}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
              >
                <HiPlus size={12} /> Add Service
              </button>
            </div>
            <p className="text-slate-500 text-xs mb-4">
              Leave empty to use default services. These will appear on the homepage.
            </p>

            <AnimatePresence>
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  className="p-4 rounded-xl bg-dark-700/50 border border-white/5 mb-3"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-xs font-medium">Service #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <HiTrash size={13} />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 text-xs mb-1">Title *</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateService(index, 'title', e.target.value)}
                        placeholder="e.g. WordPress Development"
                        className="form-input text-sm py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-xs mb-1">Icon Name</label>
                      <select
                        value={service.icon}
                        onChange={(e) => updateService(index, 'icon', e.target.value)}
                        className="form-input text-sm py-1.5"
                        style={{ background: '#0a0f1e' }}
                      >
                        {serviceIconOptions.map((ico) => (
                          <option key={ico} value={ico} style={{ background: '#0a0f1e' }}>{ico}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 text-xs mb-1">Description</label>
                      <input
                        type="text"
                        value={service.desc}
                        onChange={(e) => updateService(index, 'desc', e.target.value)}
                        placeholder="Short description of this service..."
                        className="form-input text-sm py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-xs mb-1">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={service.color || '#06b6d4'}
                          onChange={(e) => updateService(index, 'color', e.target.value)}
                          className="w-10 h-9 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={service.color || '#06b6d4'}
                          onChange={(e) => updateService(index, 'color', e.target.value)}
                          placeholder="#06b6d4"
                          className="form-input text-sm py-1.5 flex-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {services.length === 0 && (
              <div className="text-center py-6 text-slate-600 text-sm">
                No custom services added. Default services will be used.
              </div>
            )}
          </div>

          {/* ── Social Links ──────────────────────────────── */}
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">GitHub URL</label>
                <input
                  type="url"
                  value={socialGithub}
                  onChange={(e) => setSocialGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">LinkedIn URL</label>
                <input
                  type="url"
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1.5">WhatsApp Number</label>
                <input
                  type="text"
                  value={socialWhatsapp}
                  onChange={(e) => setSocialWhatsapp(e.target.value)}
                  placeholder="8801601566785 (with country code, no +)"
                  className="form-input"
                />
                <p className="text-slate-600 text-xs mt-1">Include country code without + (e.g. 8801601566785)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-4">Preview</h3>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/30 mx-auto mb-3">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-black text-xl">
                      {name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'RA'}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-white font-semibold">{name || 'Your Name'}</p>
              <p className="text-cyan-400 text-sm mt-0.5">{tagline || 'Your Tagline'}</p>
              {heroBio && (
                <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-3">{heroBio}</p>
              )}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-slate-400 text-xs uppercase tracking-widest mb-3">Tips</h3>
            <ul className="text-slate-500 text-xs space-y-2">
              <li>• Use a square profile image for best results</li>
              <li>• Keep bio under 200 characters for best display</li>
              <li>• Services will override the default 6 services</li>
              <li>• Leave services empty to use defaults</li>
              <li>• CV URL should be publicly accessible</li>
            </ul>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {saving ? 'Saving...' : (
              <>
                <HiSave size={16} />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageSettings
