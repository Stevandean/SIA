// @ts-nocheck
"use client"

import React, { useState } from "react"
import Sidebar from "@/components/layouts/sidebar"
import { useCustomers } from "./hooks/useCustomers"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export default function CustomersPage() {
  const { customers, isLoading, createCustomer } = useCustomers()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createCustomer.mutate(formData, {
      onSuccess: () => {
        setIsDialogOpen(false)
        setFormData({ name: "", phone: "", address: "" })
      },
    })
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Master Customer</h1>
            <p className="text-gray-500 mt-1">Kelola data customer</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Customer
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Customer</DialogTitle>
                <DialogDescription>
                  Tambahkan customer baru ke sistem
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nama Customer</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Telepon</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <Label>Alamat</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Alamat lengkap"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createCustomer.isPending}>
                    {createCustomer.isPending ? "Menyimpan..." : "Simpan"}
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

        <Card>
          <CardHeader>
            <CardTitle>Daftar Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Alamat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500"
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500"
                    >
                      Belum ada customer
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.phone || "-"}</TableCell>
                      <TableCell>{customer.address || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
