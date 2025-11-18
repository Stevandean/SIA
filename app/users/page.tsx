// @ts-nocheck
"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/layouts/sidebar"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useUsers } from "./hooks/useUsers"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function UsersPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { users, isLoading, createOrUpdateUser, deleteUser } = useUsers()

  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "KASIR",
  })
  const [isEdit, setIsEdit] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    if (session.user.role !== "ADMIN") {
      toast.error("Akses ditolak — hanya admin yang dapat membuka halaman ini")
      router.push("/")
    }
  }, [session, status])

  const handleSubmit = (e) => {
    e.preventDefault()
    createOrUpdateUser.mutate(form, {
      onSuccess: () => {
        setForm({ id: "", name: "", email: "", password: "", role: "KASIR" })
        setIsEdit(false)
        setIsDialogOpen(false)
      },
    })
  }

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    })
    setIsEdit(true)
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return
    deleteUser.mutate(id)
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Akun</h1>
            <p className="text-gray-500 mt-1">Tambah, ubah, atau hapus akun pengguna.</p>
          </div>

          {/* Button + Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setIsEdit(false)
                  setForm({ id: "", name: "", email: "", password: "", role: "KASIR" })
                }}
              >
                Tambah Akun
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEdit ? "Edit Akun" : "Tambah Akun"}</DialogTitle>
                <DialogDescription>
                  {isEdit
                    ? "Ubah data pengguna yang sudah ada."
                    : "Tambah pengguna baru ke dalam sistem."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label>Nama</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={isEdit ? "(Kosongkan jika tidak diubah)" : ""}
                    required={!isEdit}
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(value) => setForm({ ...form, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="KASIR">Kasir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createOrUpdateUser.isPending}>
                    {createOrUpdateUser.isPending
                      ? "Menyimpan..."
                      : isEdit
                      ? "Simpan Perubahan"
                      : "Tambah Akun"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500 text-sm">Memuat data...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr className="text-left">
                      <th className="py-2 px-4">Nama</th>
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Role</th>
                      <th className="py-2 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-500 py-4">
                          Tidak ada pengguna
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="py-2 px-4">{user.name}</td>
                          <td className="py-2 px-4">{user.email}</td>
                          <td className="py-2 px-4">{user.role}</td>
                          <td className="py-2 px-4 flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:underline"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
