// @ts-nocheck
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

/**
 * Hook untuk fetch dan membuat pembayaran piutang
 */
export function useReceivablePayments() {
  const queryClient = useQueryClient()

  // Fetch credit revenues (piutang)
  const creditRevenuesQuery = useQuery({
    queryKey: ["credit-revenues"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=credit-revenues")
      if (!res.ok) throw new Error("Gagal memuat data piutang")
      return res.json()
    },
  })

  // Fetch payments
  const paymentsQuery = useQuery({
    queryKey: ["receivable-payments"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=receivable-payments")
      if (!res.ok) throw new Error("Gagal memuat data pembayaran")
      return res.json()
    },
  })

  // Create new payment
  const createPayment = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/backend?endpoint=receivable-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Gagal mencatat pembayaran")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["receivable-payments"])
      queryClient.invalidateQueries(["credit-revenues"])
      queryClient.invalidateQueries(["dashboard"])
      queryClient.invalidateQueries(["journal-entries"])
      queryClient.invalidateQueries(["general-ledger"])
      toast.success("Pembayaran piutang berhasil dicatat!")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    creditRevenues: creditRevenuesQuery.data?.creditRevenues || [],
    payments: paymentsQuery.data?.payments || [],
    isLoading:
      creditRevenuesQuery.isLoading || paymentsQuery.isLoading,
    createPayment,
  }
}
