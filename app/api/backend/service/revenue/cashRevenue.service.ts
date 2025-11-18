import prisma from "@/lib/prisma"
import { createCashRevenueJournal } from "@/lib/auto-journal"
import { createAuditTrail } from "../auditService"
import { CashRevenueData, UserSession } from "@/types/revenue"

export async function getAllCashRevenues() {
  return prisma.cashRevenue.findMany({
    include: { customer: true },
    orderBy: { date: "desc" },
  })
}

export async function createCashRevenue(data: CashRevenueData, user: UserSession) {
  const cashRevenue = await prisma.cashRevenue.create({
    data: {
      date: new Date(data.date),
      customerId: data.customerId || null,
      amount: parseFloat(String(data.amount)),
      description: data.description,
    },
    include: { customer: true },
  })

  const journal = await createCashRevenueJournal(cashRevenue)
  await prisma.cashRevenue.update({
    where: { id: cashRevenue.id },
    data: { journalId: journal.id },
  })

  await createAuditTrail(
    user.id,
    "CREATE",
    "cash_revenues",
    cashRevenue.id,
    `Transaksi kas ${data.description}`
  )

  return { cashRevenue, journal }
}
