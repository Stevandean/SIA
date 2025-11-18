// @ts-nocheck
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

/**
 * Hook untuk mengambil dan menambah data customer
 */
export function useCustomers() {
  const queryClient = useQueryClient()

  // Fetch data customer
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/backend?endpoint=customers")
      if (!res.ok) throw new Error("Gagal memuat data customer")
      return res.json()
    },
  })

  // Tambah customer baru
  const createCustomer = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/backend?endpoint=customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Gagal menambahkan customer")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"])
      toast.success("Customer berhasil ditambahkan!")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    customers: customersQuery.data?.customers || [],
    isLoading: customersQuery.isLoading,
    createCustomer,
  }
}
