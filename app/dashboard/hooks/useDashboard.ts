// @ts-nocheck
"use client"

import { useQuery } from "@tanstack/react-query"

/**
 * Hook untuk mengambil data ringkasan dashboard
 */
export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=dashboard")
      if (!res.ok) throw new Error("Gagal mengambil data dashboard")
      return res.json()
    },
  })
}
