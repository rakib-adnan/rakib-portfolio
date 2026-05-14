import { type ReactNode, Suspense, lazy, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CanvasBg from './components/common/CanvasBg'
import AppLoader from './components/common/PageLoader'
import Dashboard, { ProtectedRoute, DashboardOverview } from './pages/Dashboard/index'
import Login from './pages/Dashboard/Login'

// Lazy-loaded pages
const Home        = lazy(() => import('./pages/Home'))
const About       = lazy(() => import('./pages/About'))
const Projects    = lazy(() => import('./pages/Projects'))
const Reviews     = lazy(() => import('./pages/Reviews'))
const Contact     = lazy(() => import('./pages/Contact'))
const Blog        = lazy(() => import('./pages/Blog'))
const BlogPost    = lazy(() => import('./pages/Blog/Post'))

const ManageProjects = lazy(() => import('./pages/Dashboard/components/ManageProjects'))
const ManageReviews  = lazy(() => import('./pages/Dashboard/components/ManageReviews'))
const ManageContact  = lazy(() => import('./pages/Dashboard/components/ManageContact'))
const ManageHero     = lazy(() => import('./pages/Dashboard/components/ManageHero'))
const ManageBlog     = lazy(() => import('./pages/Dashboard/components/ManageBlog'))
const ManageGallery  = lazy(() => import('./pages/Dashboard/components/ManageGallery'))
const ManageSettings = lazy(() => import('./pages/Dashboard/components/ManageSettings'))

// Suspense fallback
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#030712' }}>
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          className="w-2 h-2 rounded-full bg-cyan-400"
        />
      ))}
    </div>
  </div>
)

// Fade transition for non-home pages only
const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Public layout — canvas bg lives here so it spans all pages
const PublicLayout = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#030712' }}>
      <CanvasBg />
      <Navbar />
      <Suspense fallback={<SuspenseFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Home: no PageTransition — avoids opacity:0 causing blank scroll */}
            <Route path="/" element={<Home />} />

            {/* Other pages: subtle fade transition */}
            <Route path="/about"       element={<PageTransition><About /></PageTransition>} />
            <Route path="/projects"    element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/reviews"     element={<PageTransition><Reviews /></PageTransition>} />
            <Route path="/contact"     element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/blog"        element={<PageTransition><Blog /></PageTransition>} />
            <Route path="/blog/:slug"  element={<PageTransition><BlogPost /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </div>
  )
}

// Routing root — separates dashboard from public site
const AppRoutes = () => {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  if (isDashboard) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
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
            <Route index            element={<DashboardOverview />} />
            <Route path="projects"  element={<ManageProjects />} />
            <Route path="reviews"   element={<ManageReviews />} />
            <Route path="messages"  element={<ManageContact />} />
            <Route path="hero"      element={<ManageHero />} />
            <Route path="blog"      element={<ManageBlog />} />
            <Route path="gallery"   element={<ManageGallery />} />
            <Route path="settings"  element={<ManageSettings />} />
          </Route>
        </Routes>
      </Suspense>
    )
  }

  return <PublicLayout />
}

const App = () => {
  const [loaded, setLoaded] = useState(false)

  return (
    <BrowserRouter>
      {!loaded && <AppLoader onComplete={() => setLoaded(true)} />}
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
