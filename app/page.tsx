// @ts-nocheck
"use client"

import { useSession } from "next-auth/react"
import LoginPage from "./auth/login/page"
import DashboardPage from "./dashboard/page"

export default function App() {
  const { data: session, status } = useSession()

  // Loading screen
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa sesi pengguna...</p>
        </div>
      </div>
    )
  }

  // Jika belum login → ke halaman login
  if (!session) {
    return <LoginPage />
  }

  // Jika sudah login → render dashboard utama
  return <DashboardPage />
}
