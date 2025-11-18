// @ts-nocheck
"use client"

import React from "react"
import Sidebar from "@/components/layouts/sidebar"
import { useDashboard } from "./hooks/useDashboard"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingUp, CreditCard, DollarSign } from "lucide-react"

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard()

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

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading dashboard...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* WRAPPER UTAMA */}
      <main className="flex-1 overflow-y-auto p-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview siklus pendapatan</p>
        </div>

        {/* GRID STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <Card className="p-5 border border-gray-200 shadow-sm rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Pendapatan</p>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(dashboard?.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Akumulasi pendapatan
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
            </div>
          </Card>

          {/* CARD 2 */}
          <Card className="p-5 border border-gray-200 shadow-sm rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Piutang Outstanding</p>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(dashboard?.outstandingReceivables)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Belum terbayar
                </p>
              </div>
              <CreditCard className="w-5 h-5 text-orange-600 mt-1" />
            </div>
          </Card>

          {/* CARD 3 */}
          <Card className="p-5 border border-gray-200 shadow-sm rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Kas Masuk</p>
                <p className="text-2xl font-bold mt-2">
                  {formatCurrency(dashboard?.totalCashIn)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Akumulasi kas
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-blue-600 mt-1" />
            </div>
          </Card>

        </div>

        {/* TABEL TRANSAKSI */}
        <Card className="mt-8 border border-gray-200 shadow-sm rounded-xl">
          <div className="p-5 pb-0">
            <CardTitle className="text-lg font-semibold">Transaksi Terbaru</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">
              10 transaksi terakhir
            </CardDescription>
          </div>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Tanggal</TableHead>
                  <TableHead className="px-6">Customer</TableHead>
                  <TableHead className="px-6">Deskripsi</TableHead>
                  <TableHead className="px-6 text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dashboard?.recentTransactions?.length ? (
                  dashboard.recentTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="px-6">{formatDate(t.date)}</TableCell>
                      <TableCell className="px-6">{t.customer?.name || "-"}</TableCell>
                      <TableCell className="px-6">{t.description}</TableCell>
                      <TableCell className="px-6 text-right font-medium">
                        {formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell 
                      colSpan={4} 
                      className="text-center text-gray-500 py-6"
                    >
                      Tidak ada transaksi terbaru
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}
