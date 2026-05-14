import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'
import { FaStar } from 'react-icons/fa'
import {
  useGetReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '../../../services/portfolioApi'

const toastStyle = {
  style: {
    background: '#0a0f1e',
    color: '#f1f5f9',
    border: '1px solid rgba(6, 182, 212, 0.2)',
  },
}

const StarSelector = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="transition-transform hover:scale-110"
      >
        <FaStar size={20} className={star <= value ? 'text-yellow-400' : 'text-slate-600'} />
      </button>
    ))}
  </div>
)

const ReviewModal = ({ review, onClose }) => {
  const isEditing = Boolean(review?.id)
  const [rating, setRating] = useState(review?.rating || 5)
  const [addReview, { isLoading: adding }] = useAddReviewMutation()
  const [updateReview, { isLoading: updating }] = useUpdateReviewMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: isEditing
      ? {
          name: review.name,
          role: review.role || '',
          company: review.company || '',
          text: review.text,
          avatar: review.avatar || '',
        }
      : {},
  })

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, rating }
      if (isEditing) {
        await updateReview({ id: review.id, ...payload }).unwrap()
        toast.success('Review updated!', toastStyle)
      } else {
        await addReview(payload).unwrap()
        toast.success('Review added!', toastStyle)
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
            {isEditing ? 'Edit Review' : 'Add New Review'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Name *</label>
              <input
                type="text"
                placeholder="Client name"
                {...register('name', { required: 'Name is required' })}
                className={`form-input ${errors.name ? 'border-red-500/50' : ''}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1.5">Role</label>
              <input
                type="text"
                placeholder="CEO, Manager..."
                {...register('role')}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Company</label>
            <input
              type="text"
              placeholder="Company name"
              {...register('company')}
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Rating *</label>
            <StarSelector value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Review Text *</label>
            <textarea
              rows={4}
              placeholder="Client's testimonial..."
              {...register('text', { required: 'Review text is required', minLength: { value: 20, message: 'Too short' } })}
              className={`form-input resize-none ${errors.text ? 'border-red-500/50' : ''}`}
            />
            {errors.text && <p className="text-red-400 text-xs mt-1">{errors.text.message}</p>}
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1.5">Avatar URL</label>
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              {...register('avatar')}
              className="form-input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={adding || updating}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {adding || updating ? 'Saving...' : isEditing ? 'Update' : 'Add Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const ManageReviews = () => {
  const { data: reviews = [], isLoading } = useGetReviewsQuery()
  const [deleteReview] = useDeleteReviewMutation()
  const [modalReview, setModalReview] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return
    try {
      await deleteReview(id).unwrap()
      toast.success('Review deleted', toastStyle)
    } catch {
      toast.error('Error. Check Firebase config.', toastStyle)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Manage Reviews</h1>
          <p className="text-slate-400 text-sm mt-0.5">{reviews.length} reviews</p>
        </div>
        <button
          onClick={() => { setModalReview(null); setShowModal(true) }}
          className="btn-primary py-2 px-4 text-sm"
        >
          <HiPlus size={16} />
          Add Review
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="glass-card h-20 animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaStar size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-2">No reviews yet</p>
          <button onClick={() => { setModalReview(null); setShowModal(true) }} className="btn-primary mt-4 text-sm py-2 px-4">
            <HiPlus size={14} /> Add Review
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const initials = review.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            return (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{review.name}</p>
                  <p className="text-slate-500 text-xs">
                    {review.role}{review.company ? ` @ ${review.company}` : ''}
                  </p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar key={s} size={10} className={s <= (review.rating || 5) ? 'text-yellow-400' : 'text-slate-600'} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-xs hidden sm:block max-w-[200px] truncate">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setModalReview(review); setShowModal(true) }}
                    className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/10 hover:border-cyan-500/30 flex items-center justify-center text-cyan-400 transition-all"
                  >
                    <HiPencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 flex items-center justify-center text-red-400 transition-all"
                  >
                    <HiTrash size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <ReviewModal
            review={modalReview}
            onClose={() => { setShowModal(false); setModalReview(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageReviews
