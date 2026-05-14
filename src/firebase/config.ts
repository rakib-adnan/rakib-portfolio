// @ts-nocheck
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD8zXd2hsF-hV16glXJ4mZLJA8-DczZ5-Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rakib-portfolio-81b46.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rakib-portfolio-81b46",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rakib-portfolio-81b46.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "830775401477",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:830775401477:web:05186ee30da8ef6b2d106c",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default app
