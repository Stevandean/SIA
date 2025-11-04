'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { Inter } from 'next/font/google'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false
      }
    }
  }))

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" richColors />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
