import prisma from "@/lib/prisma"
import { createCreditRevenueJournal } from "@/lib/auto-journal"
import { createAuditTrail } from "../auditService"
import { CreditRevenueData, UserSession } from "@/types/revenue"

export async function getAllCreditRevenues() {
  return prisma.creditRevenue.findMany({
    include: { customer: true, payments: true },
    orderBy: { date: "desc" },
  })
}

export async function createCreditRevenue(data: CreditRevenueData, user: UserSession) {
  const creditRevenue = await prisma.creditRevenue.create({
    data: {
      date: new Date(data.date),
      customerId: data.customerId,
      amount: parseFloat(String(data.amount)),
      dueDate: new Date(data.dueDate),
      description: data.description || "Penjualan Kredit",
      status: "UNPAID",
    },
    include: { customer: true },
  })

  const journal = await createCreditRevenueJournal(creditRevenue)
  await prisma.creditRevenue.update({
    where: { id: creditRevenue.id },
    data: { journalId: journal.id },
  })

  await createAuditTrail(
    user.id,
    "CREATE",
    "credit_revenues",
    creditRevenue.id,
    `Penjualan kredit ke ${creditRevenue.customer.name}`
  )

  return { creditRevenue, journal }
}
