// @ts-nocheck
"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

/**
 * Hook untuk mengambil & menambah data transaksi kas tunai
 */
export function useCashRevenue() {
  const queryClient = useQueryClient()

  const cashRevenuesQuery = useQuery({
    queryKey: ["cash-revenues"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=cash-revenues")
      if (!res.ok) throw new Error("Gagal memuat data transaksi kas")
      return res.json()
    },
  })

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=customers")
      if (!res.ok) throw new Error("Gagal memuat data pelanggan")
      return res.json()
    },
  })

  const createCashRevenue = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/backend?endpoint=cash-revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Gagal menambahkan transaksi kas")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cash-revenues"])
      queryClient.invalidateQueries(["dashboard"])
      queryClient.invalidateQueries(["journal-entries"])
      queryClient.invalidateQueries(["general-ledger"])
      toast.success("Transaksi kas berhasil dibuat!")
    },
    onError: (err) => toast.error(err.message),
  })

  return {
    cashRevenues: cashRevenuesQuery.data?.cashRevenues || [],
    customers: customersQuery.data?.customers || [],
    isLoading:
      cashRevenuesQuery.isLoading || customersQuery.isLoading,
    createCashRevenue,
  }
}
