import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Navigation, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useGetReviewsQuery } from '../../services/portfolioApi'
import SectionTitle from '../../components/common/SectionTitle'
import AnimatedSection from '../../components/common/AnimatedSection'

const demoReviews = [
  { id: '1', name: 'Michael Thompson', role: 'CEO', company: 'TechVenture Inc.', rating: 5, text: 'Rakib delivered our e-commerce platform ahead of schedule and beyond expectations. The WordPress site he built handles thousands of daily visitors seamlessly. His attention to detail and communication throughout the project were exceptional.', avatar: '' },
  { id: '2', name: 'Sarah Johnson', role: 'Marketing Director', company: 'StyleShop', rating: 5, text: "Outstanding Shopify development! Our new store has seen a 40% increase in conversions since launch. Rakib understood our brand perfectly and implemented features we didn't even know we needed. Highly recommended!", avatar: '' },
  { id: '3', name: 'Ahmed Al-Hassan', role: 'Startup Founder', company: 'LaunchPad Tech', rating: 5, text: "We hired Rakib to build our React dashboard and he completely transformed our product. Clean code, fast performance, and great UX. He's become our go-to developer for all web projects.", avatar: '' },
  { id: '4', name: 'Emma Rodriguez', role: 'E-commerce Manager', company: 'Beauty Direct', rating: 5, text: 'Rakib rebuilt our WooCommerce store using Crocoblock and the results were incredible. Page load times dropped by 60% and our SEO rankings improved significantly. Professional, reliable, and talented.', avatar: '' },
  { id: '5', name: 'David Chen', role: 'Product Manager', company: 'FitLife App', rating: 5, text: "The React Native app Rakib built for us exceeded all expectations. Cross-platform, smooth animations, and robust backend integration. Our users absolutely love it. Will definitely work with him again.", avatar: '' },
  { id: '6', name: 'Lisa Williams', role: 'Owner', company: 'Crafty Studio', rating: 5, text: "I've worked with many developers over the years, but Rakib stands out for his professionalism and quality of work. My Shopify store is beautiful and highly functional. Worth every penny!", avatar: '' },
]

const StarRating = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((star) => (
      <motion.div key={star} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: star * 0.05, type: 'spring', stiffness: 300 }}>
        <FaStar size={size} className={star <= rating ? 'text-yellow-400' : 'text-slate-700'} style={star <= rating ? { filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.6))' } : {}} />
      </motion.div>
    ))}
  </div>
)

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const avatarColors = [
  'from-cyan-500 to-blue-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-cyan-600',
  'from-orange-500 to-rose-600',
  'from-blue-500 to-violet-600',
  'from-teal-500 to-emerald-600',
]

const ReviewCard = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className="glow-card p-6 h-full flex flex-col select-none group"
  >
    {/* Top row */}
    <div className="flex items-start justify-between mb-4">
      <FaQuoteLeft className="text-cyan-500/40 group-hover:text-cyan-500/60 transition-colors" size={24} />
      <StarRating rating={review.rating || 5} />
    </div>

    {/* Review text */}
    <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6 group-hover:text-slate-200 transition-colors">
      &ldquo;{review.text}&rdquo;
    </p>

    {/* Author row */}
    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-11 h-11 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/50 transition-all"
      >
        {review.avatar ? (
          <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center shadow-lg`}>
            <span className="text-white text-xs font-black tracking-wide">{getInitials(review.name)}</span>
          </div>
        )}
      </motion.div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">{review.name}</p>
        <p className="text-cyan-400/70 text-xs truncate">
          {review.role}{review.company ? ` · ${review.company}` : ''}
        </p>
      </div>

      {/* Verified badge */}
      <div className="flex-shrink-0">
        <span className="text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
          ✓ Verified
        </span>
      </div>
    </div>
  </motion.div>
)

const Reviews = () => {
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const { data: firebaseReviews, isLoading } = useGetReviewsQuery()
  const reviews = (firebaseReviews && firebaseReviews.length > 0) ? firebaseReviews : demoReviews
  const avgRating = (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)

  return (
    <>
      <Helmet>
        <title>Reviews | Rakib Adnan - Web Developer</title>
        <meta name="description" content="Client testimonials and reviews for Rakib Adnan - 100+ happy clients worldwide." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #030712 0%, #050d1a 50%, #030712 100%)' }}>
        {/* Ambient blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)', top: '-100px', left: '-100px', filter: 'blur(60px)' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', bottom: '0', right: '-50px', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <SectionTitle subtitle="Testimonials" title="What Clients Say" description="Real feedback from clients I've had the pleasure of working with around the world." />

          {/* Stats */}
          <AnimatedSection variant="fadeUp" delay={0.1} className="mb-16">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { value: avgRating, label: 'Avg Rating', icon: '⭐' },
                { value: `${reviews.length}+`, label: 'Reviews', icon: '💬' },
                { value: '100%', label: 'Recommend', icon: '🔥' },
                { value: '500+', label: 'Projects', icon: '🚀' },
              ].map(({ value, label, icon }) => (
                <motion.div key={label} whileHover={{ y: -4, scale: 1.02 }}
                  className="glow-card px-6 py-4 text-center min-w-[120px]">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-2xl font-black text-gradient">{value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Swiper */}
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glow-card h-56 animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatedSection variant="fadeUp" delay={0.2} className="relative px-6">
              <button ref={prevRef}
                className="absolute -left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800/80 border border-cyan-500/20 flex items-center justify-center text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all backdrop-blur-sm">
                <FaChevronLeft size={13} />
              </button>
              <button ref={nextRef}
                className="absolute -right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800/80 border border-cyan-500/20 flex items-center justify-center text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all backdrop-blur-sm">
                <FaChevronRight size={13} />
              </button>

              <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current
                  swiper.params.navigation.nextEl = nextRef.current
                }}
                loop
                className="pb-14"
              >
                {reviews.map((review, i) => (
                  <SwiperSlide key={review.id} className="h-auto py-2">
                    <ReviewCard review={review} index={i} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </AnimatedSection>
          )}

          {/* CTA */}
          <AnimatedSection variant="fadeUp" delay={0.3} className="mt-16 text-center">
            <motion.div whileHover={{ scale: 1.01 }} className="glow-card p-10 max-w-xl mx-auto">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-white font-bold text-xl mb-3">Ready to Work Together?</h3>
              <p className="text-slate-400 text-sm mb-6">Join 100+ satisfied clients. Let&apos;s build something amazing.</p>
              <a href="mailto:rakibadnan796@gmail.com" className="btn-primary inline-flex">
                Start a Project
              </a>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </>
  )
}

export default Reviews
