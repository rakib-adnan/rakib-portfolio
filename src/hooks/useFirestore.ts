// @ts-nocheck
import { useState } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getAll = async (orderField = 'createdAt') => {
    setLoading(true)
    setError(null)
    try {
      const q = query(collection(db, collectionName), orderBy(orderField, 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const getById = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const snap = await getDoc(doc(db, collectionName, id))
      if (snap.exists()) return { id: snap.id, ...snap.data() }
      return null
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const add = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      })
      return { id: docRef.id }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const update = async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      })
      return { id }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteDoc(doc(db, collectionName, id))
      return { id }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const upsert = async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      await setDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: serverTimestamp(),
      })
      return { id }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, getAll, getById, add, update, remove, upsert }
}
