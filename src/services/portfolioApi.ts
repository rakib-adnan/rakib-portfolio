// @ts-nocheck
export const DEFAULT_PAGES = [
  { id: 'home',     name: 'Home',     slug: '/',         showInHeader: true,  showInFooter: false, isBuiltIn: true,  order: 0 },
  { id: 'about',    name: 'About',    slug: '/about',    showInHeader: false, showInFooter: true,  isBuiltIn: true,  order: 1 },
  { id: 'projects', name: 'Projects', slug: '/projects', showInHeader: true,  showInFooter: true,  isBuiltIn: true,  order: 2 },
  { id: 'reviews',  name: 'Reviews',  slug: '/reviews',  showInHeader: false, showInFooter: true,  isBuiltIn: true,  order: 3 },
  { id: 'blog',     name: 'Blog',     slug: '/blog',     showInHeader: false, showInFooter: true,  isBuiltIn: true,  order: 4 },
  { id: 'gallery',  name: 'Gallery',  slug: '/gallery',  showInHeader: false, showInFooter: true,  isBuiltIn: true,  order: 5 },
  { id: 'contact',  name: 'Contact',  slug: '/contact',  showInHeader: true,  showInFooter: true,  isBuiltIn: true,  order: 6 },
]

import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  getDoc,
  setDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Projects', 'Reviews', 'Messages', 'Hero', 'Blogs', 'Gallery', 'Settings', 'Pages'],
  endpoints: (builder) => ({
    // ─── PROJECTS ───────────────────────────────────────────────
    getProjects: builder.query({
      async queryFn() {
        try {
          const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
          const snapshot = await getDocs(q)
          const projects = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          return { data: projects }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Projects'],
    }),

    addProject: builder.mutation({
      async queryFn(project) {
        try {
          const docRef = await addDoc(collection(db, 'projects'), {
            ...project,
            createdAt: serverTimestamp(),
          })
          return { data: { id: docRef.id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Projects'],
    }),

    updateProject: builder.mutation({
      async queryFn({ id, ...project }) {
        try {
          await updateDoc(doc(db, 'projects', id), {
            ...project,
            updatedAt: serverTimestamp(),
          })
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Projects'],
    }),

    deleteProject: builder.mutation({
      async queryFn(id) {
        try {
          await deleteDoc(doc(db, 'projects', id))
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Projects'],
    }),

    // ─── REVIEWS ────────────────────────────────────────────────
    getReviews: builder.query({
      async queryFn() {
        try {
          const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
          const snapshot = await getDocs(q)
          const reviews = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          return { data: reviews }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Reviews'],
    }),

    addReview: builder.mutation({
      async queryFn(review) {
        try {
          const docRef = await addDoc(collection(db, 'reviews'), {
            ...review,
            createdAt: serverTimestamp(),
          })
          return { data: { id: docRef.id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Reviews'],
    }),

    updateReview: builder.mutation({
      async queryFn({ id, ...review }) {
        try {
          await updateDoc(doc(db, 'reviews', id), {
            ...review,
            updatedAt: serverTimestamp(),
          })
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Reviews'],
    }),

    deleteReview: builder.mutation({
      async queryFn(id) {
        try {
          await deleteDoc(doc(db, 'reviews', id))
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Reviews'],
    }),

    // ─── CONTACT MESSAGES ───────────────────────────────────────
    getMessages: builder.query({
      async queryFn() {
        try {
          const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
          const snapshot = await getDocs(q)
          const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          return { data: messages }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Messages'],
    }),

    sendMessage: builder.mutation({
      async queryFn(message) {
        try {
          const docRef = await addDoc(collection(db, 'messages'), {
            ...message,
            read: false,
            createdAt: serverTimestamp(),
          })
          return { data: { id: docRef.id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Messages'],
    }),

    markMessageRead: builder.mutation({
      async queryFn(id) {
        try {
          await updateDoc(doc(db, 'messages', id), { read: true })
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Messages'],
    }),

    deleteMessage: builder.mutation({
      async queryFn(id) {
        try {
          await deleteDoc(doc(db, 'messages', id))
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Messages'],
    }),

    // ─── HERO CONTENT ────────────────────────────────────────────
    getHero: builder.query({
      async queryFn() {
        try {
          const docRef = doc(db, 'settings', 'hero')
          const snapshot = await getDoc(docRef)
          if (snapshot.exists()) {
            return { data: { id: snapshot.id, ...snapshot.data() } }
          }
          // Return defaults if not set
          return {
            data: {
              name: 'Rakib Adnan',
              title: 'Web Developer | React Specialist | WordPress Expert',
              bio: 'I build high-performance websites and web applications that help businesses grow online. With 5+ years of experience and 500+ projects delivered, I turn ideas into digital reality.',
              profileImage: '',
              cvUrl: '',
            },
          }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Hero'],
    }),

    updateHero: builder.mutation({
      async queryFn(heroData) {
        try {
          await setDoc(doc(db, 'settings', 'hero'), {
            ...heroData,
            updatedAt: serverTimestamp(),
          })
          return { data: heroData }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Hero'],
    }),

    // ─── BLOGS ──────────────────────────────────────────────────
    getBlogs: builder.query({
      async queryFn() {
        try {
          const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
          const snapshot = await getDocs(q)
          const blogs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          return { data: blogs }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Blogs'],
    }),

    getBlogBySlug: builder.query({
      async queryFn(slug) {
        try {
          const q = query(collection(db, 'blogs'), where('slug', '==', slug))
          const snapshot = await getDocs(q)
          if (snapshot.empty) {
            return { error: { message: 'Blog post not found' } }
          }
          const d = snapshot.docs[0]
          return { data: { id: d.id, ...d.data() } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Blogs'],
    }),

    addBlog: builder.mutation({
      async queryFn(blog) {
        try {
          const docRef = await addDoc(collection(db, 'blogs'), {
            ...blog,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
          return { data: { id: docRef.id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Blogs'],
    }),

    updateBlog: builder.mutation({
      async queryFn({ id, ...blog }) {
        try {
          await updateDoc(doc(db, 'blogs', id), {
            ...blog,
            updatedAt: serverTimestamp(),
          })
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Blogs'],
    }),

    deleteBlog: builder.mutation({
      async queryFn(id) {
        try {
          await deleteDoc(doc(db, 'blogs', id))
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Blogs'],
    }),

    // ─── GALLERY ────────────────────────────────────────────────
    getGallery: builder.query({
      async queryFn() {
        try {
          const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
          const snapshot = await getDocs(q)
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          return { data: items }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Gallery'],
    }),

    addGalleryItem: builder.mutation({
      async queryFn(item) {
        try {
          const docRef = await addDoc(collection(db, 'gallery'), {
            ...item,
            createdAt: serverTimestamp(),
          })
          return { data: { id: docRef.id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Gallery'],
    }),

    deleteGalleryItem: builder.mutation({
      async queryFn(id) {
        try {
          await deleteDoc(doc(db, 'gallery', id))
          return { data: { id } }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Gallery'],
    }),

    // ─── SITE SETTINGS ──────────────────────────────────────────
    getSiteSettings: builder.query({
      async queryFn() {
        try {
          const docRef = doc(db, 'settings', 'site')
          const snapshot = await getDoc(docRef)
          if (snapshot.exists()) {
            return { data: { id: snapshot.id, ...snapshot.data() } }
          }
          return {
            data: {
              name: 'Rakib Adnan',
              tagline: 'Web Developer',
              logo: '',
              heroTitle: 'Hi, I\'m Rakib Adnan',
              heroSubtitle: 'Web Developer | React Specialist | WordPress Expert',
              heroBio: 'I build high-performance websites and web applications that help businesses grow online. With 5+ years of experience and 500+ projects delivered, I turn your vision into digital reality.',
              cvUrl: '',
              profileImage: '',
              services: [],
              socialLinks: {
                github: 'https://github.com/rakib-adnan',
                linkedin: 'https://linkedin.com/in/rakibadnan',
                whatsapp: '8801601566785',
              },
            },
          }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Settings'],
    }),

    updateSiteSettings: builder.mutation({
      async queryFn(settingsData) {
        try {
          await setDoc(doc(db, 'settings', 'site'), {
            ...settingsData,
            updatedAt: serverTimestamp(),
          }, { merge: true })
          return { data: settingsData }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Settings'],
    }),

    // ─── PAGES ──────────────────────────────────────────────────
    getPages: builder.query({
      async queryFn() {
        try {
          const docRef = doc(db, 'settings', 'pages')
          const snapshot = await getDoc(docRef)
          if (snapshot.exists()) {
            return { data: snapshot.data().pages || DEFAULT_PAGES }
          }
          return { data: DEFAULT_PAGES }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      providesTags: ['Pages'],
    }),

    updatePages: builder.mutation({
      async queryFn(pages) {
        try {
          await setDoc(doc(db, 'settings', 'pages'), {
            pages,
            updatedAt: serverTimestamp(),
          })
          return { data: pages }
        } catch (e) {
          return { error: { message: e.message } }
        }
      },
      invalidatesTags: ['Pages'],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessageReadMutation,
  useDeleteMessageMutation,
  useGetHeroQuery,
  useUpdateHeroMutation,
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetGalleryQuery,
  useAddGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
  useGetPagesQuery,
  useUpdatePagesMutation,
} = portfolioApi
