// @ts-nocheck
"use client"

import { useQuery } from "@tanstack/react-query"

export function useAccounts() {
  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=accounts")
      if (!res.ok) throw new Error("Gagal mengambil data akun")
      return res.json()
    },
  })

  return {
    accounts: accountsQuery.data?.accounts || [],
    isLoading: accountsQuery.isLoading,
    error: accountsQuery.error,
  }
}
