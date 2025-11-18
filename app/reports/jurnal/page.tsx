// @ts-nocheck
"use client"

import React from "react"
import { useJournalEntries } from "./hooks/useJournalEntries"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function JournalPage() {
  const { journalEntries, isLoading, error } = useJournalEntries()

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat jurnal umum...
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Gagal memuat data jurnal.
      </div>
    )

  return (
    <main className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Jurnal Umum</h1>
        <p className="text-gray-500 mt-1">
          Daftar jurnal otomatis dari seluruh transaksi sistem
        </p>
      </div>

      <div className="space-y-4">
        {journalEntries.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">Belum ada jurnal</p>
            </CardContent>
          </Card>
        ) : (
          journalEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{entry.description}</CardTitle>
                    <CardDescription>
                      {formatDate(entry.date)} • Ref: {entry.reference || "-"}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{entry.refType || "MANUAL"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Akun</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Kredit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entry.lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="font-mono text-sm">
                          {line.account.code}
                        </TableCell>
                        <TableCell>{line.account.name}</TableCell>
                        <TableCell className="text-right">
                          {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          entry.lines.reduce((sum, line) => sum + line.debit, 0)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          entry.lines.reduce((sum, line) => sum + line.credit, 0)
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
