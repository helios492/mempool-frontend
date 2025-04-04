'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import LoadingSpinner from '../components/ui/loading-spinner'
import AlertToast from '../components/ui/alertToast'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [showToast, setShowToast] = useState({ type: "", message: "" })

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) return setStatus('error')

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}auth/verify`, { token })
      .then(() => {
        setStatus('success')
        setShowToast({ type: "success", message: "Successfully Created your account" })
        setTimeout(() => router.replace('/'), 1000)
      })
      .catch(() => setStatus('error'))
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying..." />
      </div>
    )
  }
  if (status === 'success')
    return (
      <div>
        <div className='flex items-center justify-center h-screen'>Email verified! Redirecting to login...</div>
        {showToast.message && (
          <AlertToast message={showToast.message} type={showToast.type as 'success' | 'error' | 'info'} />
        )}
      </div>
    )
  return <div className='flex items-center justify-center h-screen'>Verification failed. Please try again.</div>
}
