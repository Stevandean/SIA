// @ts-nocheck
"use client"

import React, { useState } from "react"
import Sidebar from "@/components/layouts/sidebar"
import { useCreditRevenue } from "./hooks/useCreditRevenue"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export default function CreditRevenuePage() {
  const { creditRevenues, customers, isLoading, createCreditRevenue } =
    useCreditRevenue()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    customerId: "",
    amount: "",
    dueDate: "",
    description: "Penjualan Kredit",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createCreditRevenue.mutate(formData, {
      onSuccess: () => {
        setIsDialogOpen(false)
        setFormData({
          date: new Date().toISOString().split("T")[0],
          customerId: "",
          amount: "",
          dueDate: "",
          description: "Penjualan Kredit",
        })
      },
    })
  }

  const getStatusBadge = (status) => {
    const variants = {
      UNPAID: "destructive",
      PARTIAL: "warning",
      PAID: "default",
    }
    const labels = {
      UNPAID: "Belum Bayar",
      PARTIAL: "Sebagian",
      PAID: "Lunas",
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
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
            <h1 className="text-3xl font-bold text-gray-900">Penjualan Kredit</h1>
            <p className="text-gray-500 mt-1">
              Transaksi penjualan secara kredit
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
                <DialogTitle>Penjualan Kredit</DialogTitle>
                <DialogDescription>
                  Buat transaksi penjualan kredit baru
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
                  <Label>Customer</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, customerId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label>Jatuh Tempo</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Deskripsi</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createCreditRevenue.isPending}>
                    {createCreditRevenue.isPending
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
            <CardTitle>Daftar Penjualan Kredit</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Terbayar</TableHead>
                  <TableHead className="text-right">Sisa</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500"
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : creditRevenues.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500"
                    >
                      Belum ada transaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  creditRevenues.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{formatDate(t.date)}</TableCell>
                      <TableCell>{t.customer?.name}</TableCell>
                      <TableCell>{formatDate(t.dueDate)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(t.paidAmount)}
                      </TableCell>
                      <TableCell className="text-right text-orange-600">
                        {formatCurrency(t.amount - t.paidAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(t.status)}</TableCell>
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
