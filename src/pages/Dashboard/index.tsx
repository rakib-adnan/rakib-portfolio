// @ts-nocheck
import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiMenu,
  HiX,
  HiViewGrid,
  HiCollection,
  HiStar,
  HiMail,
  HiPhotograph,
  HiLogout,
  HiCode,
  HiChevronRight,
  HiDocumentText,
  HiCog,
} from 'react-icons/hi'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

const sidebarLinks = [
  { to: '/dashboard', label: 'Overview', icon: HiViewGrid, end: true },
  { to: '/dashboard/projects', label: 'Projects', icon: HiCollection },
  { to: '/dashboard/reviews', label: 'Reviews', icon: HiStar },
  { to: '/dashboard/messages', label: 'Messages', icon: HiMail },
  { to: '/dashboard/hero', label: 'Hero Content', icon: HiPhotograph },
  { to: '/dashboard/blog', label: 'Blog Posts', icon: HiDocumentText },
  { to: '/dashboard/gallery', label: 'Gallery', icon: HiPhotograph },
  { to: '/dashboard/settings', label: 'Settings', icon: HiCog },
]

// Protected Route wrapper
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/dashboard/login" replace />
  }

  return children
}

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully', {
      style: {
        background: '#0a0f1e',
        color: '#f1f5f9',
        border: '1px solid rgba(6, 182, 212, 0.2)',
      },
    })
    navigate('/dashboard/login')
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-800/95 backdrop-blur-md border-r border-cyan-500/10
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-cyan-500/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">RA</span>
              </div>
              <span className="text-white font-semibold text-sm">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <HiX size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {sidebarLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `sidebar-link group ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium flex-1">{label}</span>
                  <HiChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </div>
          </nav>

          {/* User info + logout */}
          <div className="p-4 border-t border-cyan-500/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{user?.email}</p>
                <p className="text-slate-500 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <HiLogout size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-dark-800/50 border-b border-cyan-500/10 flex items-center px-4 gap-4 sticky top-0 z-30 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <HiMenu size={22} />
          </button>
          <div className="flex-1" />
          <a
            href="/"
            className="text-slate-400 hover:text-cyan-400 text-sm transition-colors flex items-center gap-1.5"
          >
            <HiCode size={16} />
            View Portfolio
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Default dashboard overview
export const DashboardOverview = () => {
  const { user } = useAuth()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
        <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: '500+', color: 'cyan', icon: HiCollection },
          { label: 'Client Reviews', value: '100+', color: 'blue', icon: HiStar },
          { label: 'New Messages', value: '—', color: 'purple', icon: HiMail },
          { label: 'Years Active', value: '5+', color: 'green', icon: HiViewGrid },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">{label}</span>
              <Icon size={18} className="text-cyan-400/60" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-white font-semibold mb-3">Quick Links</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sidebarLinks.slice(1).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 p-3 rounded-lg bg-dark-700/50 hover:bg-dark-700 border border-white/5 hover:border-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-all text-sm"
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
