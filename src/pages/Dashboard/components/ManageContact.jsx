import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiMail, HiTrash, HiEye, HiX, HiCheckCircle } from 'react-icons/hi'
import {
  useGetMessagesQuery,
  useMarkMessageReadMutation,
  useDeleteMessageMutation,
} from '../../../services/portfolioApi'

const toastStyle = {
  style: {
    background: '#0a0f1e',
    color: '#f1f5f9',
    border: '1px solid rgba(6, 182, 212, 0.2)',
  },
}

const MessageModal = ({ message, onClose }) => (
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
      className="relative glass-card p-6 w-full max-w-lg z-10"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-lg">Message Details</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <HiX size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">From</p>
            <p className="text-white text-sm font-medium">{message.name}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Email</p>
            <a href={`mailto:${message.email}`} className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
              {message.email}
            </a>
          </div>
        </div>

        {message.budget && (
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Budget</p>
            <span className="badge">{message.budget}</span>
          </div>
        )}

        <div>
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Subject</p>
          <p className="text-slate-200 text-sm font-medium">{message.subject}</p>
        </div>

        <div>
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Message</p>
          <div className="bg-dark-700/50 rounded-lg p-4 border border-white/5">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
          </div>
        </div>

        {message.createdAt?.seconds && (
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Received</p>
            <p className="text-slate-400 text-sm">
              {new Date(message.createdAt.seconds * 1000).toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <a
            href={`mailto:${message.email}?subject=Re: ${message.subject}`}
            className="btn-primary flex-1 justify-center text-sm py-2"
          >
            <HiMail size={14} />
            Reply via Email
          </a>
          <button onClick={onClose} className="btn-secondary px-4 py-2 text-sm">
            Close
          </button>
        </div>
      </div>
    </motion.div>
  </div>
)

const ManageContact = () => {
  const { data: messages = [], isLoading } = useGetMessagesQuery()
  const [markRead] = useMarkMessageReadMutation()
  const [deleteMessage] = useDeleteMessageMutation()
  const [selectedMessage, setSelectedMessage] = useState(null)

  const unread = messages.filter((m) => !m.read).length

  const handleView = async (message) => {
    setSelectedMessage(message)
    if (!message.read) {
      try {
        await markRead(message.id).unwrap()
      } catch {
        // silent
      }
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      await deleteMessage(id).unwrap()
      toast.success('Message deleted', toastStyle)
    } catch {
      toast.error('Error. Check Firebase config.', toastStyle)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Contact Messages</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {messages.length} total
            {unread > 0 && <span className="ml-2 badge">{unread} unread</span>}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card h-16 animate-pulse" />)}
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiMail size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No messages yet</p>
          <p className="text-slate-600 text-sm mt-1">Messages from your contact form will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-4 flex items-center gap-4 transition-all ${
                !message.read ? 'border-cyan-500/20 bg-cyan-500/5' : ''
              }`}
            >
              {/* Unread indicator */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!message.read ? 'bg-cyan-400' : 'bg-transparent'}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${!message.read ? 'text-white' : 'text-slate-300'}`}>
                    {message.name}
                  </p>
                  {message.budget && (
                    <span className="badge text-xs py-0">{message.budget}</span>
                  )}
                </div>
                <p className="text-slate-500 text-xs truncate">{message.subject}</p>
              </div>

              <p className="text-slate-500 text-xs hidden sm:block truncate max-w-[200px]">
                {message.email}
              </p>

              {message.createdAt?.seconds && (
                <p className="text-slate-600 text-xs hidden md:block flex-shrink-0">
                  {new Date(message.createdAt.seconds * 1000).toLocaleDateString()}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleView(message)}
                  className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/10 hover:border-cyan-500/30 flex items-center justify-center text-cyan-400 transition-all"
                >
                  <HiEye size={14} />
                </button>
                {message.read && (
                  <HiCheckCircle size={14} className="text-green-500/60" />
                )}
                <button
                  onClick={() => handleDelete(message.id)}
                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 flex items-center justify-center text-red-400 transition-all"
                >
                  <HiTrash size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  )
}

export default ManageContact
