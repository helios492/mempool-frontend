'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user } = useAuth()
  console.log("useruser", user)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/folders')
    } else {
      router.replace('/login')
    }
  }, [user])

  return null
}
