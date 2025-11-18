// @ts-nocheck
"use client"

import { useQuery } from "@tanstack/react-query"

export function useJournalEntries() {
  const query = useQuery({
    queryKey: ["journal-entries"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=journal-entries")
      if (!res.ok) throw new Error("Gagal mengambil data jurnal umum")
      return res.json()
    },
  })

  return {
    journalEntries: query.data?.journalEntries || [],
    isLoading: query.isLoading,
    error: query.error,
  }
}
