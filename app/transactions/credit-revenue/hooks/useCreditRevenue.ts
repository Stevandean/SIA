// @ts-nocheck
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

/**
 * Hook untuk mengambil & menambah data penjualan kredit
 */
export function useCreditRevenue() {
  const queryClient = useQueryClient()

  // Fetch credit revenues
  const creditRevenuesQuery = useQuery({
    queryKey: ["credit-revenues"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=credit-revenues")
      if (!res.ok) throw new Error("Gagal memuat data penjualan kredit")
      return res.json()
    },
  })

  // Fetch customers
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=customers")
      if (!res.ok) throw new Error("Gagal memuat data customer")
      return res.json()
    },
  })

  // Create new credit revenue
  const createCreditRevenue = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/backend?endpoint=credit-revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Gagal membuat transaksi kredit")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["credit-revenues"])
      queryClient.invalidateQueries(["dashboard"])
      queryClient.invalidateQueries(["journal-entries"])
      queryClient.invalidateQueries(["general-ledger"])
      toast.success("Transaksi kredit berhasil dibuat!")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    creditRevenues: creditRevenuesQuery.data?.creditRevenues || [],
    customers: customersQuery.data?.customers || [],
    isLoading:
      creditRevenuesQuery.isLoading || customersQuery.isLoading,
    createCreditRevenue,
  }
}
