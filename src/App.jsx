import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { Suspense, lazy } from 'react'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ParticlesBg from './components/common/ParticlesBg'
import Dashboard, { ProtectedRoute, DashboardOverview } from './pages/Dashboard/index'
import Login from './pages/Dashboard/Login'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Reviews = lazy(() => import('./pages/Reviews'))
const Contact = lazy(() => import('./pages/Contact'))
const ManageProjects = lazy(() => import('./pages/Dashboard/components/ManageProjects'))
const ManageReviews = lazy(() => import('./pages/Dashboard/components/ManageReviews'))
const ManageContact = lazy(() => import('./pages/Dashboard/components/ManageContact'))
const ManageHero = lazy(() => import('./pages/Dashboard/components/ManageHero'))

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-900">
    <div className="text-center">
      <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  </div>
)

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Public layout (with Navbar + Footer + particles)
const PublicLayout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-dark-900 relative">
      <ParticlesBg />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </div>
  )
}

// App with nested routing
const AppRoutes = () => {
  const location = useLocation()

  // Check if current path is dashboard or login
  const isDashboard = location.pathname.startsWith('/dashboard')

  if (isDashboard) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/dashboard/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="messages" element={<ManageContact />} />
            <Route path="hero" element={<ManageHero />} />
          </Route>
        </Routes>
      </Suspense>
    )
  }

  return <PublicLayout />
}

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0a0f1e',
            color: '#f1f5f9',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: '8px',
            fontSize: '14px',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
