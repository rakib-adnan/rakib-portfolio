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
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Projects', 'Reviews', 'Messages', 'Hero'],
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
} = portfolioApi
