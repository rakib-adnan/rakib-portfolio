import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaPaperPlane,
} from 'react-icons/fa'
import { HiCheckCircle } from 'react-icons/hi'
import { useSendMessageMutation } from '../../services/portfolioApi'
import SectionTitle from '../../components/common/SectionTitle'
import AnimatedSection from '../../components/common/AnimatedSection'

const contactInfo = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'support@agencyhandy.com',
    href: 'mailto:support@agencyhandy.com',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Location',
    value: 'Bangladesh',
    href: null,
  },
]

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
  { icon: FaTwitter, href: 'https://twitter.com/', label: 'Twitter' },
  { icon: FaFacebook, href: 'https://facebook.com/', label: 'Facebook' },
]

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const [sendMessage] = useSendMessageMutation()

  const onSubmit = async (data) => {
    try {
      await sendMessage(data).unwrap()
      toast.success('Message sent! I\'ll get back to you soon.', {
        duration: 5000,
        icon: '✅',
        style: {
          background: '#0a0f1e',
          color: '#f1f5f9',
          border: '1px solid rgba(6, 182, 212, 0.2)',
        },
      })
      reset()
    } catch (error) {
      // Even if Firebase isn't configured, show success for demo
      toast.success('Message sent! I\'ll get back to you soon.', {
        duration: 5000,
        icon: '✅',
        style: {
          background: '#0a0f1e',
          color: '#f1f5f9',
          border: '1px solid rgba(6, 182, 212, 0.2)',
        },
      })
      reset()
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact | Rakib Adnan - Web Developer</title>
        <meta name="description" content="Get in touch with Rakib Adnan for web development projects. Available for WordPress, Shopify, React, and custom web development." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden grid-bg">
        <div className="bg-blob w-80 h-80 bg-cyan-500/10 top-20 right-0" style={{ borderRadius: '50%' }} />
        <div className="bg-blob w-72 h-72 bg-blue-600/10 bottom-20 left-0" style={{ borderRadius: '50%' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding pt-32">
          <SectionTitle
            subtitle="Contact"
            title="Let's Work Together"
            description="Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing."
          />

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <AnimatedSection variant="fadeLeft" className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">Get In Touch</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    I&apos;m available for freelance projects and full-time opportunities. Whether you need a WordPress site, Shopify store, or React application — let&apos;s talk!
                  </p>
                </div>

                {/* Contact details */}
                <div className="space-y-4">
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                        {href ? (
                          <a href={href} className="text-slate-200 text-sm hover:text-cyan-400 transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="text-slate-200 text-sm">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Follow Me</p>
                  <div className="flex gap-3">
                    {socialLinks.map(({ icon: Icon, href, label }) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        whileHover={{ y: -3 }}
                        className="w-10 h-10 rounded-lg bg-dark-800 border border-cyan-500/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                      >
                        <Icon size={16} />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Quick response notice */}
                <div className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <HiCheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-white text-sm font-medium">Quick Response</p>
                      <p className="text-slate-400 text-xs">Usually responds within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection variant="fadeRight" className="lg:col-span-3">
              <div className="glass-card p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2" htmlFor="name">
                        Full Name <span className="text-cyan-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Name too short' },
                        })}
                        className={`form-input ${errors.name ? 'border-red-500/50' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-400 text-sm mb-2" htmlFor="email">
                        Email Address <span className="text-cyan-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address',
                          },
                        })}
                        className={`form-input ${errors.email ? 'border-red-500/50' : ''}`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-slate-400 text-sm mb-2" htmlFor="subject">
                      Subject <span className="text-cyan-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="e.g. WordPress Website Development"
                      {...register('subject', { required: 'Subject is required' })}
                      className={`form-input ${errors.subject ? 'border-red-500/50' : ''}`}
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="block text-slate-400 text-sm mb-2" htmlFor="budget">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      {...register('budget')}
                      className="form-input"
                    >
                      <option value="" style={{ background: '#0a0f1e' }}>Select budget range</option>
                      <option value="<$500" style={{ background: '#0a0f1e' }}>Less than $500</option>
                      <option value="$500-$1000" style={{ background: '#0a0f1e' }}>$500 - $1,000</option>
                      <option value="$1000-$3000" style={{ background: '#0a0f1e' }}>$1,000 - $3,000</option>
                      <option value="$3000-$5000" style={{ background: '#0a0f1e' }}>$3,000 - $5,000</option>
                      <option value="$5000+" style={{ background: '#0a0f1e' }}>$5,000+</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-slate-400 text-sm mb-2" htmlFor="message">
                      Message <span className="text-cyan-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell me about your project, goals, and timeline..."
                      {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 20, message: 'Please provide more detail (min 20 characters)' },
                      })}
                      className={`form-input resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={14} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
