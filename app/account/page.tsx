// @ts-nocheck
"use client"

import React from "react"
import { useAccounts } from "./hooks/useAccounts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AccountsPage() {
  const { accounts, isLoading, error } = useAccounts()

  const types = [
    { key: "ASSET", label: "Aset" },
    { key: "LIABILITY", label: "Kewajiban" },
    { key: "EQUITY", label: "Ekuitas" },
    { key: "REVENUE", label: "Pendapatan" },
    { key: "EXPENSE", label: "Beban" },
  ]

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat data akun...
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Terjadi kesalahan saat memuat akun.
      </div>
    )

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
        <p className="text-gray-500 mt-1">Daftar akun akuntansi perusahaan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map(({ key, label }) => {
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
                  <div className="space-y-2">
                    {filteredAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="font-mono text-gray-500 w-16">
                          {account.code}
                        </span>
                        <span className="truncate">{account.name}</span>
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
