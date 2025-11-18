// @ts-nocheck
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUsers() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users")
      if (!res.ok) throw new Error("Gagal mengambil data user")
      return res.json()
    },
    enabled: true, // biarkan true, kontrol akses dari page
  })

  const createOrUpdateUser = useMutation({
    mutationFn: async (data) => {
      const method = data.id ? "PUT" : "POST"
      const res = await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan data user")
      return result
    },
    onSuccess: (data) => {
      toast.success(data.message || "Data user berhasil disimpan")
      queryClient.invalidateQueries(["users"])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Gagal menghapus user")
      return data
    },
    onSuccess: () => {
      toast.success("User berhasil dihapus")
      queryClient.invalidateQueries(["users"])
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    createOrUpdateUser,
    deleteUser,
  }
}
