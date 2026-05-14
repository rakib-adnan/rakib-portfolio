import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { FaLock, FaEnvelope, FaCode, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

const Login = () => {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  if (user) return <Navigate to="/dashboard" replace />

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password)
      toast.success('Welcome back!', {
        style: {
          background: '#0a0f1e',
          color: '#f1f5f9',
          border: '1px solid rgba(6, 182, 212, 0.2)',
        },
      })
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message, {
        style: {
          background: '#0a0f1e',
          color: '#f1f5f9',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Login | Rakib Adnan</title>
      </Helmet>

      <div className="min-h-screen bg-dark-900 grid-bg flex items-center justify-center px-4">
        {/* Background blobs */}
        <div className="fixed w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl -top-20 -left-20 pointer-events-none" />
        <div className="fixed w-64 h-64 rounded-full bg-blue-600/10 blur-3xl bottom-20 -right-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                <FaCode className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-white">Dashboard Login</h1>
              <p className="text-slate-400 text-sm mt-1">Sign in to manage your portfolio</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email */}
              <div className="mb-5">
                <label className="block text-slate-400 text-sm mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email',
                      },
                    })}
                    className={`form-input pl-10 ${errors.email ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-slate-400 text-sm mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-slate-600 text-xs mt-6">
              Protected admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Login
