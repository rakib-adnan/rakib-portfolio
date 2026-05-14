// @ts-nocheck
import { useState } from 'react'

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '401199539e13b04ab9501a0adc935709'

export const useStorage = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file) => {
    if (!IMGBB_API_KEY) {
      throw new Error('ImgBB API key not configured. Add VITE_IMGBB_API_KEY to your environment variables.')
    }

    setUploading(true)
    setProgress(30)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('key', IMGBB_API_KEY)

      setProgress(60)

      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setProgress(100)

      if (!data.success) throw new Error(data.error?.message || 'Upload failed')

      return data.data.url
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 500)
    }
  }

  return { uploadFile, uploading, progress }
}
