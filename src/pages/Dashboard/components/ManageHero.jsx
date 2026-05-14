import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiSave, HiPhotograph } from 'react-icons/hi'
import { useGetHeroQuery, useUpdateHeroMutation } from '../../../services/portfolioApi'

const toastStyle = {
  style: {
    background: '#0a0f1e',
    color: '#f1f5f9',
    border: '1px solid rgba(6, 182, 212, 0.2)',
  },
}

const ManageHero = () => {
  const { data: hero, isLoading } = useGetHeroQuery()
  const [updateHero, { isLoading: saving }] = useUpdateHeroMutation()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm()

  useEffect(() => {
    if (hero) {
      reset({
        name: hero.name || 'Rakib Adnan',
        title: hero.title || 'Web Developer | React Specialist | WordPress Expert',
        bio: hero.bio || '',
        profileImage: hero.profileImage || '',
        cvUrl: hero.cvUrl || '',
      })
    }
  }, [hero, reset])

  const profileImage = watch('profileImage')

  const onSubmit = async (data) => {
    try {
      await updateHero(data).unwrap()
      toast.success('Hero content updated!', toastStyle)
      reset(data) // clear dirty state
    } catch {
      toast.error('Error saving. Check Firebase config.', toastStyle)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <div key={i} className="glass-card h-14 animate-pulse" />)}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Manage Hero Content</h1>
        <p className="text-slate-400 text-sm mt-0.5">Update your homepage hero section</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5">
          <div className="glass-card p-6 space-y-5">
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">
                Display Name <span className="text-cyan-500">*</span>
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className={`form-input ${errors.name ? 'border-red-500/50' : ''}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">
                Title / Roles <span className="text-cyan-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Web Developer | React Specialist"
                {...register('title', { required: 'Title is required' })}
                className={`form-input ${errors.title ? 'border-red-500/50' : ''}`}
              />
              <p className="text-slate-600 text-xs mt-1">Separate roles with &quot;|&quot; for typing animation</p>
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Bio / Description</label>
              <textarea
                rows={4}
                placeholder="A short intro about yourself..."
                {...register('bio')}
                className="form-input resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Profile Image URL</label>
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="https://example.com/your-photo.jpg"
                  {...register('profileImage')}
                  className="form-input flex-1"
                />
              </div>
              <p className="text-slate-600 text-xs mt-1">
                Use an externally hosted image URL (e.g., from Imgur, Cloudinary, etc.)
              </p>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1.5">CV / Resume URL</label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                {...register('cvUrl')}
                className="form-input"
              />
              <p className="text-slate-600 text-xs mt-1">
                Link to your Google Drive, Dropbox, or other hosted CV file
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !isDirty}
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div>
          <h3 className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-widest">Preview</h3>
          <div className="glass-card p-5">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/30">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <HiPhotograph size={24} className="text-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Profile image preview</p>
              <p className="text-slate-400 text-xs">
                {profileImage ? 'Image URL set' : 'No image URL set — initials will be shown'}
              </p>
            </div>
          </div>

          <div className="mt-4 glass-card p-4">
            <h4 className="text-slate-400 text-xs uppercase tracking-widest mb-2">Tips</h4>
            <ul className="text-slate-500 text-xs space-y-2">
              <li>• Use a square image (1:1 ratio) for best results</li>
              <li>• Minimum recommended size: 400x400px</li>
              <li>• Separate typing roles with the pipe &quot;|&quot; character</li>
              <li>• CV URL should link to a publicly accessible file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageHero
