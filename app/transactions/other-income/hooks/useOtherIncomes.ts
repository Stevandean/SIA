// @ts-nocheck
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

/**
 * Hook untuk fetch dan mencatat pendapatan lain-lain
 */
export function useOtherIncomes() {
  const queryClient = useQueryClient()

  // Fetch other incomes
  const otherIncomesQuery = useQuery({
    queryKey: ["other-incomes"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=other-incomes")
      if (!res.ok) throw new Error("Gagal memuat data pendapatan lain-lain")
      return res.json()
    },
  })

  // Create new other income
  const createOtherIncome = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/backend?endpoint=other-income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Gagal mencatat pendapatan lain-lain")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["other-incomes"])
      queryClient.invalidateQueries(["dashboard"])
      queryClient.invalidateQueries(["journal-entries"])
      queryClient.invalidateQueries(["general-ledger"])
      toast.success("Pendapatan lain-lain berhasil dicatat!")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    otherIncomes: otherIncomesQuery.data?.otherIncomes || [],
    isLoading: otherIncomesQuery.isLoading,
    createOtherIncome,
  }
}
