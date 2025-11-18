// @ts-nocheck
"use client"

import React from "react"
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  DollarSign,
  Wallet,
  Users,
  UserCog,
  FileText,
  BookOpen,
  LogOut,
  CircleDollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

export default function Sidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isAdmin = session?.user?.role === "ADMIN"

  const NavButton = ({ href, label, icon: Icon }) => {
    const active = pathname === href
    return (
      <button
        onClick={() => router.push(href)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
          active
            ? "bg-sidebar-accent-foreground/8 text-sidebar-primary"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </button>
    )
  }

  return (
    <aside className="w-64 bg-[color:var(--sidebar-background)] border-r border-[color:var(--sidebar-border)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[color:var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <CircleDollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-[color:var(--sidebar-foreground)]">SIA Revenue</h2>
            <p className="text-xs text-[color:var(--sidebar-foreground)/70]">Accounting System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavButton href="/dashboard" label="Dashboard" icon={LayoutDashboard} />

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-semibold text-[color:var(--sidebar-foreground)/60] uppercase">Transaksi</p>
        </div>

        <NavButton href="/transactions/cash-revenue" label="Kas Tunai" icon={Receipt} />
        <NavButton href="/transactions/credit-revenue" label="Penjualan Kredit" icon={CreditCard} />
        <NavButton href="/transactions/receivable-payment" label="Bayar Piutang" icon={DollarSign} />
        <NavButton href="/transactions/other-income" label="Pendapatan Lain" icon={Wallet} />

        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-[color:var(--sidebar-foreground)/60] uppercase">Master Data</p>
            </div>

            <NavButton href="/customers" label="Customer" icon={Users} />
            <NavButton href="/users" label="Users" icon={UserCog} />

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-[color:var(--sidebar-foreground)/60] uppercase">Laporan</p>
            </div>

            <NavButton href="/reports/jurnal" label="Jurnal Umum" icon={FileText} />
            <NavButton href="/reports/ledger" label="Buku Besar" icon={BookOpen} />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[color:var(--sidebar-border)]">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {session?.user?.name?.charAt(0) || "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs text-[color:var(--sidebar-foreground)/70]">{session?.user?.role || ""}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
