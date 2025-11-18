// @ts-nocheck
"use client"

import React, { useState } from "react"
import Sidebar from "@/components/layouts/sidebar"
import { useReceivablePayments } from "./hooks/useReceivablePayments"

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
import { Plus } from "lucide-react"

export default function ReceivablePaymentsPage() {
  const { creditRevenues, payments, isLoading, createPayment } =
    useReceivablePayments()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    creditId: "",
    amount: "",
    description: "Pembayaran Piutang",
  })

  // Piutang yang belum lunas
  const unpaidCredits = creditRevenues.filter((c) => c.status !== "PAID")
  const selectedCredit = creditRevenues.find((c) => c.id === formData.creditId)
  const remainingAmount = selectedCredit
    ? selectedCredit.amount - selectedCredit.paidAmount
    : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    createPayment.mutate(formData, {
      onSuccess: () => {
        setIsDialogOpen(false)
        setFormData({
          date: new Date().toISOString().split("T")[0],
          creditId: "",
          amount: "",
          description: "Pembayaran Piutang",
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
              Pembayaran Piutang
            </h1>
            <p className="text-gray-500 mt-1">
              Penerimaan pembayaran piutang dari customer
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Bayar Piutang
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pembayaran Piutang</DialogTitle>
                <DialogDescription>
                  Catat pembayaran piutang dari customer
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
                  <Label>Piutang</Label>
                  <Select
                    value={formData.creditId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, creditId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih piutang" />
                    </SelectTrigger>
                    <SelectContent>
                      {unpaidCredits.map((credit) => (
                        <SelectItem key={credit.id} value={credit.id}>
                          {credit.customer?.name} -{" "}
                          {formatCurrency(
                            credit.amount - credit.paidAmount
                          )}{" "}
                          (Sisa)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCredit && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">
                      Detail Piutang
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Total: {formatCurrency(selectedCredit.amount)}
                    </p>
                    <p className="text-xs text-blue-700">
                      Terbayar: {formatCurrency(selectedCredit.paidAmount)}
                    </p>
                    <p className="text-xs font-medium text-blue-900 mt-1">
                      Sisa: {formatCurrency(remainingAmount)}
                    </p>
                  </div>
                )}

                <div>
                  <Label>Jumlah Bayar (Rp)</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    min="0"
                    max={remainingAmount}
                    step="0.01"
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
                  <Button type="submit" disabled={createPayment.isPending}>
                    {createPayment.isPending ? "Menyimpan..." : "Simpan"}
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
            <CardTitle>Riwayat Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Jumlah Bayar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500"
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500"
                    >
                      Belum ada pembayaran
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{formatDate(p.date)}</TableCell>
                      <TableCell>
                        {p.creditRevenue?.customer?.name}
                      </TableCell>
                      <TableCell>{p.description}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(p.amount)}
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
