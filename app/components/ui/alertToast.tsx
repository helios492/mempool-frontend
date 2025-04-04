'use client'

import * as Toast from '@radix-ui/react-toast'
import { useState } from 'react'
import { cn } from '@/app/lib/utils' // optional utility

export default function AlertToast({
  message,
  type = 'info',
}: {
  message: string
  type?: 'success' | 'error' | 'info'
}) {
  const [open, setOpen] = useState(true)

  const colorMap = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }

  return (
    <Toast.Provider swipeDirection="left" duration={1500}>
      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className={cn(
          `rounded-md px-4 py-2 text-white shadow-lg transition-all
           data-[state=open]:animate-slide-in-from-right
           data-[state=closed]:animate-slide-out-to-left`,
          colorMap[type]
        )}
      >
        <Toast.Title className="text-sm font-medium">{message}</Toast.Title>
      </Toast.Root>

      <Toast.Viewport
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 outline-none"
      />
    </Toast.Provider>
  )
}
