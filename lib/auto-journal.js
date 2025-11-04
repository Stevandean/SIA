import prisma from './prisma'

/**
 * Auto-Journal Engine
 * Generates double-entry journal entries for transactions
 */

// Get account by code
export async function getAccountByCode(code) {
  return await prisma.account.findUnique({
    where: { code }
  })
}

/**
 * Create Cash Revenue Journal
 * Debit: Kas (101)
 * Credit: Pendapatan (401)
 */
export async function createCashRevenueJournal(transaction) {
  const kasAccount = await getAccountByCode('101')
  const pendapatanAccount = await getAccountByCode('401')

  if (!kasAccount || !pendapatanAccount) {
    throw new Error('Required accounts not found')
  }

  const journalEntry = await prisma.journalEntry.create({
    data: {
      date: transaction.date,
      description: transaction.description || 'Penerimaan Kas dari Penjualan',
      reference: `CASH-${transaction.id}`,
      refType: 'CASH_REVENUE',
      refId: transaction.id,
      lines: {
        create: [
          {
            accountId: kasAccount.id,
            debit: transaction.amount,
            credit: 0
          },
          {
            accountId: pendapatanAccount.id,
            debit: 0,
            credit: transaction.amount
          }
        ]
      }
    },
    include: {
      lines: {
        include: {
          account: true
        }
      }
    }
  })

  return journalEntry
}

/**
 * Create Credit Revenue Journal
 * Debit: Piutang Usaha (102)
 * Credit: Pendapatan (401)
 */
export async function createCreditRevenueJournal(transaction) {
  const piutangAccount = await getAccountByCode('102')
  const pendapatanAccount = await getAccountByCode('401')

  if (!piutangAccount || !pendapatanAccount) {
    throw new Error('Required accounts not found')
  }

  const journalEntry = await prisma.journalEntry.create({
    data: {
      date: transaction.date,
      description: transaction.description || 'Penjualan Kredit',
      reference: `CREDIT-${transaction.id}`,
      refType: 'CREDIT_REVENUE',
      refId: transaction.id,
      lines: {
        create: [
          {
            accountId: piutangAccount.id,
            debit: transaction.amount,
            credit: 0
          },
          {
            accountId: pendapatanAccount.id,
            debit: 0,
            credit: transaction.amount
          }
        ]
      }
    },
    include: {
      lines: {
        include: {
          account: true
        }
      }
    }
  })

  return journalEntry
}

/**
 * Create Receivable Payment Journal
 * Debit: Kas (101)
 * Credit: Piutang Usaha (102)
 */
export async function createReceivablePaymentJournal(payment, creditRevenue) {
  const kasAccount = await getAccountByCode('101')
  const piutangAccount = await getAccountByCode('102')

  if (!kasAccount || !piutangAccount) {
    throw new Error('Required accounts not found')
  }

  const journalEntry = await prisma.journalEntry.create({
    data: {
      date: payment.date,
      description: payment.description || `Pembayaran Piutang - ${creditRevenue.customer?.name}`,
      reference: `PAYMENT-${payment.id}`,
      refType: 'RECEIVABLE_PAYMENT',
      refId: payment.id,
      lines: {
        create: [
          {
            accountId: kasAccount.id,
            debit: payment.amount,
            credit: 0
          },
          {
            accountId: piutangAccount.id,
            debit: 0,
            credit: payment.amount
          }
        ]
      }
    },
    include: {
      lines: {
        include: {
          account: true
        }
      }
    }
  })

  return journalEntry
}

/**
 * Create Other Income Journal
 * Debit: Kas (101)
 * Credit: Pendapatan Lain-lain (402)
 */
export async function createOtherIncomeJournal(transaction) {
  const kasAccount = await getAccountByCode('101')
  const pendapatanLainAccount = await getAccountByCode('402')

  if (!kasAccount || !pendapatanLainAccount) {
    throw new Error('Required accounts not found')
  }

  const journalEntry = await prisma.journalEntry.create({
    data: {
      date: transaction.date,
      description: transaction.description || 'Pendapatan Lain-lain',
      reference: `OTHER-${transaction.id}`,
      refType: 'OTHER_INCOME',
      refId: transaction.id,
      lines: {
        create: [
          {
            accountId: kasAccount.id,
            debit: transaction.amount,
            credit: 0
          },
          {
            accountId: pendapatanLainAccount.id,
            debit: 0,
            credit: transaction.amount
          }
        ]
      }
    },
    include: {
      lines: {
        include: {
          account: true
        }
      }
    }
  })

  return journalEntry
}
