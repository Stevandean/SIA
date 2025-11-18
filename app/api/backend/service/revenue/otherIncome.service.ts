import prisma from "@/lib/prisma"
import { createOtherIncomeJournal } from "@/lib/auto-journal"
import { createAuditTrail } from "../auditService"
import { OtherIncomeData, UserSession } from "@/types/revenue"

export async function getAllOtherIncomes() {
  return prisma.otherIncome.findMany({
    orderBy: { date: "desc" },
  })
}

export async function createOtherIncome(data: OtherIncomeData, user: UserSession) {
  const otherIncome = await prisma.otherIncome.create({
    data: {
      date: new Date(data.date),
      description: data.description,
      amount: parseFloat(String(data.amount)),
    },
  })

  const journal = await createOtherIncomeJournal(otherIncome)
  await prisma.otherIncome.update({
    where: { id: otherIncome.id },
    data: { journalId: journal.id },
  })

  await createAuditTrail(
    user.id,
    "CREATE",
    "other_incomes",
    otherIncome.id,
    `Pendapatan lain: ${data.description}`
  )

  return { otherIncome, journal }
}
