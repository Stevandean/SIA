// @ts-nocheck
"use client"

import React from "react"
import { useLedger } from "./hooks/useLedger"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LedgerPage() {
  const { accounts, isLoading, error } = useLedger()

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  const sections = [
    { key: "ASSET", label: "Aset" },
    { key: "LIABILITY", label: "Kewajiban" },
    { key: "EQUITY", label: "Ekuitas" },
    { key: "REVENUE", label: "Pendapatan" },
    { key: "EXPENSE", label: "Beban" },
  ]

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat data buku besar...
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Terjadi kesalahan saat memuat data.
      </div>
    )

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buku Besar</h1>
        <p className="text-gray-500 mt-1">
          Saldo akun real-time berdasarkan transaksi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(({ key, label }) => {
          const filteredAccounts = accounts.filter((a) => a.type === key)

          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-lg">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAccounts.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Tidak ada akun</p>
                ) : (
                  <div className="space-y-3">
                    {filteredAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-sm">{account.name}</p>
                          <p className="font-mono text-xs text-gray-500">
                            {account.code}
                          </p>
                        </div>
                        <p
                          className={`font-bold text-sm ${
                            account.balance >= 0
                              ? "text-green-700"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(account.balance || 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
