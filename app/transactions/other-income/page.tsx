// @ts-nocheck
"use client"

import React, { useState } from "react"
import Sidebar from "@/components/layouts/sidebar"
import { useOtherIncomes } from "./hooks/useOtherIncomes"

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

export default function OtherIncomePage() {
  const { otherIncomes, isLoading, createOtherIncome } = useOtherIncomes()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    description: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createOtherIncome.mutate(formData, {
      onSuccess: () => {
        setIsDialogOpen(false)
        setFormData({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          description: "",
        })
      },
    })
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0)

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pendapatan Lain-lain
            </h1>
            <p className="text-gray-500 mt-1">
              Catat pendapatan di luar penjualan utama
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Transaksi Baru
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pendapatan Lain-lain</DialogTitle>
                <DialogDescription>
                  Catat pendapatan di luar penjualan (bunga, sewa, dll)
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Jumlah (Rp)</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label>Deskripsi</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    placeholder="Pendapatan bunga, sewa, dll"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createOtherIncome.isPending}>
                    {createOtherIncome.isPending
                      ? "Menyimpan..."
                      : "Simpan"}
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
            <CardTitle>Daftar Pendapatan Lain-lain</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
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
                ) : otherIncomes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500"
                    >
                      Belum ada transaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  otherIncomes.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>{formatDate(income.date)}</TableCell>
                      <TableCell>{income.description}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(income.amount)}
                      </TableCell>
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
