import prisma from "@/lib/prisma"
import { createReceivablePaymentJournal } from "@/lib/auto-journal"
import { createAuditTrail } from "../auditService"
import { ReceivablePaymentData, UserSession } from "@/types/revenue"

export async function getAllReceivablePayments() {
  return prisma.receivablePayment.findMany({
    include: {
      creditRevenue: { include: { customer: true } },
    },
    orderBy: { date: "desc" },
  })
}

export async function createReceivablePayment(data: ReceivablePaymentData, user: UserSession) {
  const creditRevenue = await prisma.creditRevenue.findUnique({
    where: { id: data.creditId },
    include: { customer: true },
  })

  if (!creditRevenue) throw new Error("Piutang tidak ditemukan")

  const remainingAmount = creditRevenue.amount - creditRevenue.paidAmount
  const paymentAmount = parseFloat(String(data.amount))
  if (paymentAmount > remainingAmount)
    throw new Error("Jumlah pembayaran melebihi sisa piutang")

  const payment = await prisma.receivablePayment.create({
    data: {
      creditId: data.creditId,
      date: new Date(data.date),
      amount: paymentAmount,
      description: data.description || "Pembayaran Piutang",
    },
  })

  const journal = await createReceivablePaymentJournal(payment, creditRevenue)
  await prisma.receivablePayment.update({
    where: { id: payment.id },
    data: { journalId: journal.id },
  })

  const newPaidAmount = creditRevenue.paidAmount + paymentAmount
  const newStatus = newPaidAmount >= creditRevenue.amount ? "PAID" : "PARTIAL"

  await prisma.creditRevenue.update({
    where: { id: data.creditId },
    data: { paidAmount: newPaidAmount, status: newStatus },
  })

  await createAuditTrail(
    user.id,
    "CREATE",
    "receivable_payments",
    payment.id,
    `Pembayaran piutang dari ${creditRevenue.customer.name}`
  )

  return { payment, journal }
}
