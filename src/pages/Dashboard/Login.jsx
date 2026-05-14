import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { useAuth } from '../../hooks/useAuth'

const toastStyle = (type = 'default') => ({
  style: {
    background: '#0a0f1e',
    color: '#f1f5f9',
    border: `1px solid ${type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`,
  },
})

const Login = () => {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSending, setResetSending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  if (user) return <Navigate to="/dashboard" replace />

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password)
      toast.success('Welcome back!', toastStyle())
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message, toastStyle('error'))
    }
  }

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast.error('Please enter your email address.', toastStyle('error'))
      return
    }
    setResetSending(true)
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      toast.success('Password reset email sent! Check your inbox.', toastStyle())
      setShowReset(false)
      setResetEmail('')
    } catch (err) {
      toast.error(err.message, toastStyle('error'))
    } finally {
      setResetSending(false)
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
                <span className="text-white font-black text-xl">RA</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Dashboard Login</h1>
              <p className="text-slate-400 text-sm mt-1">Sign in to manage your portfolio</p>
            </div>

            <AnimatePresence mode="wait">
              {!showReset ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
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
                  <div className="mb-3">
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

                  {/* Forgot Password */}
                  <div className="mb-6 text-right">
                    <button
                      type="button"
                      onClick={() => setShowReset(true)}
                      className="text-cyan-400/70 hover:text-cyan-400 text-xs transition-colors"
                    >
                      Forgot Password?
                    </button>
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
                </motion.form>
              ) : (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    type="button"
                    onClick={() => setShowReset(false)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-sm transition-colors mb-5"
                  >
                    <HiArrowLeft size={14} />
                    Back to Login
                  </button>

                  <h2 className="text-white font-semibold mb-1">Reset Password</h2>
                  <p className="text-slate-400 text-sm mb-5">Enter your email to receive a password reset link.</p>

                  <div className="mb-4">
                    <label className="block text-slate-400 text-sm mb-2">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input
                        type="email"
                        placeholder="admin@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="form-input pl-10"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={resetSending}
                    className="btn-primary w-full justify-center disabled:opacity-60"
                  >
                    {resetSending ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Reset Email'
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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
