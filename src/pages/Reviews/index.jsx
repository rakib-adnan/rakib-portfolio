import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useGetReviewsQuery } from '../../services/portfolioApi'
import SectionTitle from '../../components/common/SectionTitle'
import AnimatedSection from '../../components/common/AnimatedSection'

// Demo reviews for when Firebase isn't configured
const demoReviews = [
  {
    id: '1',
    name: 'Michael Thompson',
    role: 'CEO',
    company: 'TechVenture Inc.',
    rating: 5,
    text: 'Rakib delivered our e-commerce platform ahead of schedule and beyond expectations. The WordPress site he built handles thousands of daily visitors seamlessly. His attention to detail and communication throughout the project were exceptional.',
    avatar: '',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'StyleShop',
    rating: 5,
    text: 'Outstanding Shopify development! Our new store has seen a 40% increase in conversions since launch. Rakib understood our brand perfectly and implemented features we didn\'t even know we needed. Highly recommended!',
    avatar: '',
  },
  {
    id: '3',
    name: 'Ahmed Al-Hassan',
    role: 'Startup Founder',
    company: 'LaunchPad Tech',
    rating: 5,
    text: 'We hired Rakib to build our React dashboard and he completely transformed our product. Clean code, fast performance, and great UX. He\'s become our go-to developer for all web projects.',
    avatar: '',
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    role: 'E-commerce Manager',
    company: 'Beauty Direct',
    rating: 5,
    text: 'Rakib rebuilt our WooCommerce store using Crocoblock and the results were incredible. Page load times dropped by 60% and our SEO rankings improved significantly. Professional, reliable, and talented.',
    avatar: '',
  },
  {
    id: '5',
    name: 'David Chen',
    role: 'Product Manager',
    company: 'FitLife App',
    rating: 5,
    text: 'The React Native app Rakib built for us exceeded all expectations. Cross-platform, smooth animations, and robust backend integration. Our users absolutely love it. Will definitely work with him again.',
    avatar: '',
  },
  {
    id: '6',
    name: 'Lisa Williams',
    role: 'Owner',
    company: 'Crafty Studio',
    rating: 5,
    text: 'I\'ve worked with many developers over the years, but Rakib stands out for his professionalism and quality of work. My Shopify store is beautiful and highly functional. Worth every penny!',
    avatar: '',
  },
]

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        size={14}
        className={star <= rating ? 'star-filled' : 'star-empty'}
      />
    ))}
  </div>
)

const ReviewCard = ({ review }) => {
  const initials = review.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="glass-card p-6 h-full flex flex-col select-none">
      {/* Quote icon */}
      <FaQuoteLeft className="text-cyan-500/30 mb-4" size={28} />

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={review.rating || 5} />
      </div>

      {/* Review text */}
      <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{review.name}</p>
          <p className="text-slate-500 text-xs">
            {review.role}
            {review.company ? ` @ ${review.company}` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

const Reviews = () => {
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  const { data: firebaseReviews, isLoading } = useGetReviewsQuery()
  const reviews = (firebaseReviews && firebaseReviews.length > 0) ? firebaseReviews : demoReviews

  // Summary stats
  const avgRating = (
    reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length
  ).toFixed(1)

  return (
    <>
      <Helmet>
        <title>Reviews | Rakib Adnan - Web Developer</title>
        <meta name="description" content="Client testimonials and reviews for Rakib Adnan - Professional Web Developer with 100+ happy clients." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden grid-bg">
        <div className="bg-blob w-80 h-80 bg-cyan-500/10 top-32 -left-20" style={{ borderRadius: '50%' }} />
        <div className="bg-blob w-64 h-64 bg-purple-600/10 bottom-20 right-10" style={{ borderRadius: '50%' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding pt-32">
          <SectionTitle
            subtitle="Testimonials"
            title="What Clients Say"
            description="Real feedback from clients I've had the pleasure of working with around the world."
          />

          {/* Rating summary */}
          <AnimatedSection variant="fadeUp" delay={0.1} className="mb-14">
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { value: avgRating, label: 'Average Rating', sub: 'Out of 5.0' },
                { value: `${reviews.length}+`, label: 'Total Reviews', sub: 'From clients worldwide' },
                { value: '100%', label: 'Would Recommend', sub: 'To their network' },
              ].map(({ value, label, sub }) => (
                <div key={label} className="glass-card px-8 py-5 text-center min-w-[140px]">
                  <div className="text-3xl font-black text-gradient mb-1">{value}</div>
                  <div className="text-white text-sm font-medium">{label}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Swiper Carousel */}
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatedSection variant="fadeUp" delay={0.2} className="relative">
              {/* Custom nav buttons */}
              <button
                ref={prevRef}
                className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800 border border-cyan-500/20 flex items-center justify-center text-cyan-400 hover:border-cyan-500/50 hover:bg-dark-700 transition-all"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                ref={nextRef}
                className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800 border border-cyan-500/20 flex items-center justify-center text-cyan-400 hover:border-cyan-500/50 hover:bg-dark-700 transition-all"
              >
                <FaChevronRight size={14} />
              </button>

              <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current
                  swiper.params.navigation.nextEl = nextRef.current
                }}
                loop
                className="pb-14"
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review.id} className="h-auto">
                    <ReviewCard review={review} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </AnimatedSection>
          )}

          {/* CTA */}
          <AnimatedSection variant="fadeUp" delay={0.3} className="mt-14 text-center">
            <div className="glass-card p-10 max-w-xl mx-auto">
              <h3 className="text-white font-bold text-xl mb-3">Want to Work Together?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Join 100+ satisfied clients. Let&apos;s build something amazing together.
              </p>
              <a href="mailto:support@agencyhandy.com" className="btn-primary inline-flex">
                Start a Project
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  )
}

export default Reviews
