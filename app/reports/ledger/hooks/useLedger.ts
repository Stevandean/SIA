// @ts-nocheck
"use client"

import { useQuery } from "@tanstack/react-query"

export function useLedger() {
  const query = useQuery({
    queryKey: ["general-ledger"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=general-ledger")
      if (!res.ok) throw new Error("Gagal mengambil data buku besar")
      return res.json()
    },
  })

  return {
    accounts: query.data?.accounts || [],
    isLoading: query.isLoading,
    error: query.error,
  }
}
