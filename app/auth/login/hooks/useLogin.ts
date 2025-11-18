// @ts-nocheck
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

/**
 * Hook khusus menangani login pengguna
 */
export function useLogin() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true)

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Login berhasil!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan saat login.")
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, loading }
}
