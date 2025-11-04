import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import {
  createCashRevenueJournal,
  createCreditRevenueJournal,
  createReceivablePaymentJournal,
  createOtherIncomeJournal
} from '@/lib/auto-journal'

// Helper to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Auth checker
async function checkAuth(requiredRole = null) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return { error: 'Unauthorized', status: 401 }
  }
  
  if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'ADMIN') {
    return { error: 'Forbidden', status: 403 }
  }
  
  return { user: session.user }
}

// Create audit trail
async function createAuditTrail(userId, action, entity, entityId, description) {
  await prisma.auditTrail.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      description
    }
  })
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    const authCheck = await checkAuth()
    
    if (authCheck.error) {
      return handleCORS(NextResponse.json({ error: authCheck.error }, { status: authCheck.status }))
    }

    // Dashboard KPI
    if (endpoint === 'dashboard') {
      const totalRevenue = await prisma.$queryRaw`
        SELECT COALESCE(SUM(credit), 0) as total 
        FROM journal_lines jl
        INNER JOIN accounts a ON jl."accountId" = a.id
        WHERE a.type = 'REVENUE'
      `
      
      const outstandingReceivables = await prisma.creditRevenue.aggregate({
        where: { status: { not: 'PAID' } },
        _sum: { amount: true, paidAmount: true }
      })
      
      const totalCashIn = await prisma.$queryRaw`
        SELECT COALESCE(SUM(debit), 0) as total 
        FROM journal_lines jl
        INNER JOIN accounts a ON jl."accountId" = a.id
        WHERE a.code = '101'
      `
      
      const recentTransactions = await prisma.cashRevenue.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        include: { customer: true }
      })
      
      return handleCORS(NextResponse.json({
        totalRevenue: Number(totalRevenue[0]?.total || 0),
        outstandingReceivables: Number((outstandingReceivables._sum.amount || 0) - (outstandingReceivables._sum.paidAmount || 0)),
        totalCashIn: Number(totalCashIn[0]?.total || 0),
        recentTransactions
      }))
    }

    // Customers
    if (endpoint === 'customers') {
      const customers = await prisma.customer.findMany({
        orderBy: { name: 'asc' }
      })
      return handleCORS(NextResponse.json({ customers }))
    }

    // Accounts (COA)
    if (endpoint === 'accounts') {
      const accounts = await prisma.account.findMany({
        orderBy: { code: 'asc' }
      })
      return handleCORS(NextResponse.json({ accounts }))
    }

    // Cash Revenues
    if (endpoint === 'cash-revenues') {
      const cashRevenues = await prisma.cashRevenue.findMany({
        include: { customer: true },
        orderBy: { date: 'desc' }
      })
      return handleCORS(NextResponse.json({ cashRevenues }))
    }

    // Credit Revenues
    if (endpoint === 'credit-revenues') {
      const creditRevenues = await prisma.creditRevenue.findMany({
        include: { 
          customer: true,
          payments: true
        },
        orderBy: { date: 'desc' }
      })
      return handleCORS(NextResponse.json({ creditRevenues }))
    }

    // Receivable Payments
    if (endpoint === 'receivable-payments') {
      const payments = await prisma.receivablePayment.findMany({
        include: {
          creditRevenue: {
            include: { customer: true }
          }
        },
        orderBy: { date: 'desc' }
      })
      return handleCORS(NextResponse.json({ payments }))
    }

    // Other Incomes
    if (endpoint === 'other-incomes') {
      const otherIncomes = await prisma.otherIncome.findMany({
        orderBy: { date: 'desc' }
      })
      return handleCORS(NextResponse.json({ otherIncomes }))
    }

    // Journal Entries
    if (endpoint === 'journal-entries') {
      const journalEntries = await prisma.journalEntry.findMany({
        include: {
          lines: {
            include: { account: true }
          }
        },
        orderBy: { date: 'desc' }
      })
      return handleCORS(NextResponse.json({ journalEntries }))
    }

    // General Ledger
    if (endpoint === 'general-ledger') {
      const accountId = searchParams.get('accountId')
      
      if (accountId) {
        // Get ledger for specific account with running balance
        const account = await prisma.account.findUnique({
          where: { id: accountId }
        })
        
        const entries = await prisma.journalLine.findMany({
          where: { accountId },
          include: {
            journalEntry: true,
            account: true
          },
          orderBy: { createdAt: 'asc' }
        })
        
        let balance = 0
        const ledgerEntries = entries.map(entry => {
          const debit = entry.debit || 0
          const credit = entry.credit || 0
          
          // For asset, expense: debit increases, credit decreases
          // For liability, equity, revenue: credit increases, debit decreases
          if (['ASSET', 'EXPENSE'].includes(account.type)) {
            balance += (debit - credit)
          } else {
            balance += (credit - debit)
          }
          
          return {
            ...entry,
            balance
          }
        })
        
        return handleCORS(NextResponse.json({ 
          account,
          ledgerEntries,
          currentBalance: balance
        }))
      } else {
        // Get all accounts with their balances
        const accounts = await prisma.account.findMany({
          orderBy: { code: 'asc' }
        })
        
        const accountsWithBalances = await Promise.all(
          accounts.map(async (account) => {
            const entries = await prisma.journalLine.findMany({
              where: { accountId: account.id }
            })
            
            let balance = 0
            entries.forEach(entry => {
              const debit = entry.debit || 0
              const credit = entry.credit || 0
              
              if (['ASSET', 'EXPENSE'].includes(account.type)) {
                balance += (debit - credit)
              } else {
                balance += (credit - debit)
              }
            })
            
            return {
              ...account,
              balance
            }
          })
        )
        
        return handleCORS(NextResponse.json({ accounts: accountsWithBalances }))
      }
    }

    // Audit Trail
    if (endpoint === 'audit-trail') {
      const auditTrail = await prisma.auditTrail.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100
      })
      return handleCORS(NextResponse.json({ auditTrail }))
    }

    return handleCORS(NextResponse.json({ error: 'Endpoint not found' }, { status: 404 }))
  } catch (error) {
    console.error('GET Error:', error)
    return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    const authCheck = await checkAuth()
    
    if (authCheck.error) {
      return handleCORS(NextResponse.json({ error: authCheck.error }, { status: authCheck.status }))
    }

    const body = await request.json()

    // Create Cash Revenue
    if (endpoint === 'cash-revenue') {
      const cashRevenue = await prisma.cashRevenue.create({
        data: {
          date: new Date(body.date),
          customerId: body.customerId || null,
          amount: parseFloat(body.amount),
          description: body.description
        },
        include: { customer: true }
      })

      // Create auto-journal
      const journal = await createCashRevenueJournal(cashRevenue)
      
      // Update with journal ID
      await prisma.cashRevenue.update({
        where: { id: cashRevenue.id },
        data: { journalId: journal.id }
      })

      await createAuditTrail(
        authCheck.user.id,
        'CREATE',
        'cash_revenues',
        cashRevenue.id,
        `Transaksi kas ${body.description}`
      )

      return handleCORS(NextResponse.json({ 
        cashRevenue,
        journal,
        message: 'Transaksi kas berhasil dibuat' 
      }))
    }

    // Create Credit Revenue
    if (endpoint === 'credit-revenue') {
      const creditRevenue = await prisma.creditRevenue.create({
        data: {
          date: new Date(body.date),
          customerId: body.customerId,
          amount: parseFloat(body.amount),
          dueDate: new Date(body.dueDate),
          description: body.description || 'Penjualan Kredit',
          status: 'UNPAID'
        },
        include: { customer: true }
      })

      // Create auto-journal
      const journal = await createCreditRevenueJournal(creditRevenue)
      
      await prisma.creditRevenue.update({
        where: { id: creditRevenue.id },
        data: { journalId: journal.id }
      })

      await createAuditTrail(
        authCheck.user.id,
        'CREATE',
        'credit_revenues',
        creditRevenue.id,
        `Penjualan kredit ke ${creditRevenue.customer.name}`
      )

      return handleCORS(NextResponse.json({ 
        creditRevenue,
        journal,
        message: 'Transaksi kredit berhasil dibuat' 
      }))
    }

    // Create Receivable Payment
    if (endpoint === 'receivable-payment') {
      const creditRevenue = await prisma.creditRevenue.findUnique({
        where: { id: body.creditId },
        include: { customer: true }
      })

      if (!creditRevenue) {
        return handleCORS(NextResponse.json({ error: 'Piutang tidak ditemukan' }, { status: 404 }))
      }

      const remainingAmount = creditRevenue.amount - creditRevenue.paidAmount
      const paymentAmount = parseFloat(body.amount)

      if (paymentAmount > remainingAmount) {
        return handleCORS(NextResponse.json({ 
          error: 'Jumlah pembayaran melebihi sisa piutang' 
        }, { status: 400 }))
      }

      const payment = await prisma.receivablePayment.create({
        data: {
          creditId: body.creditId,
          date: new Date(body.date),
          amount: paymentAmount,
          description: body.description || 'Pembayaran Piutang'
        }
      })

      // Create auto-journal
      const journal = await createReceivablePaymentJournal(payment, creditRevenue)
      
      await prisma.receivablePayment.update({
        where: { id: payment.id },
        data: { journalId: journal.id }
      })

      // Update credit revenue status
      const newPaidAmount = creditRevenue.paidAmount + paymentAmount
      const newStatus = newPaidAmount >= creditRevenue.amount ? 'PAID' : 'PARTIAL'
      
      await prisma.creditRevenue.update({
        where: { id: body.creditId },
        data: {
          paidAmount: newPaidAmount,
          status: newStatus
        }
      })

      await createAuditTrail(
        authCheck.user.id,
        'CREATE',
        'receivable_payments',
        payment.id,
        `Pembayaran piutang dari ${creditRevenue.customer.name}`
      )

      return handleCORS(NextResponse.json({ 
        payment,
        journal,
        message: 'Pembayaran piutang berhasil dicatat' 
      }))
    }

    // Create Other Income
    if (endpoint === 'other-income') {
      const otherIncome = await prisma.otherIncome.create({
        data: {
          date: new Date(body.date),
          description: body.description,
          amount: parseFloat(body.amount)
        }
      })

      // Create auto-journal
      const journal = await createOtherIncomeJournal(otherIncome)
      
      await prisma.otherIncome.update({
        where: { id: otherIncome.id },
        data: { journalId: journal.id }
      })

      await createAuditTrail(
        authCheck.user.id,
        'CREATE',
        'other_incomes',
        otherIncome.id,
        `Pendapatan lain: ${body.description}`
      )

      return handleCORS(NextResponse.json({ 
        otherIncome,
        journal,
        message: 'Pendapatan lain berhasil dicatat' 
      }))
    }

    // Create Customer
    if (endpoint === 'customer') {
      const customer = await prisma.customer.create({
        data: {
          name: body.name,
          phone: body.phone || null,
          address: body.address || null
        }
      })

      await createAuditTrail(
        authCheck.user.id,
        'CREATE',
        'customers',
        customer.id,
        `Customer baru: ${body.name}`
      )

      return handleCORS(NextResponse.json({ customer, message: 'Customer berhasil ditambahkan' }))
    }

    // Create Account (COA)
    if (endpoint === 'account') {
      if (authCheck.user.role !== 'ADMIN') {
        return handleCORS(NextResponse.json({ error: 'Only admin can create accounts' }, { status: 403 }))
      }

      const account = await prisma.account.create({
        data: {
          code: body.code,
          name: body.name,
          type: body.type
        }
      })

      await createAuditTrail(
        authCheck.user.id,
        'CREATE',
        'accounts',
        account.id,
        `Akun baru: ${body.code} - ${body.name}`
      )

      return handleCORS(NextResponse.json({ account, message: 'Akun berhasil ditambahkan' }))
    }

    // Manual Journal Entry
    if (endpoint === 'journal-entry') {
      if (authCheck.user.role !== 'ADMIN') {
        return handleCORS(NextResponse.json({ error: 'Only admin can create manual journals' }, { status: 403 }))
      }

      const totalDebit = body.lines.reduce((sum, line) => sum + parseFloat(line.debit || 0), 0)
      const totalCredit = body.lines.reduce((sum, line) => sum + parseFloat(line.credit || 0), 0)

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return handleCORS(NextResponse.json({ 
          error: 'Debit dan kredit harus seimbang' 
        }, { status: 400 }))
      }

      const journalEntry = await prisma.journalEntry.create({
        data: {
          date: new Date(body.date),
          description: body.description,
          reference: body.reference || null,
          lines: {
            create: body.lines.map(line => ({
              accountId: line.accountId,
              debit: parseFloat(line.debit || 0),
              credit: parseFloat(line.credit || 0)
            }))
          }
        },
        include: {
          lines: {
            include: { account: true }
          }
        }
      })

      await createAuditTrail(
        authCheck.user.id,
        'CREATE',
        'journal_entries',
        journalEntry.id,
        `Jurnal manual: ${body.description}`
      )

      return handleCORS(NextResponse.json({ 
        journalEntry,
        message: 'Jurnal berhasil dicatat' 
      }))
    }

    return handleCORS(NextResponse.json({ error: 'Endpoint not found' }, { status: 404 }))
  } catch (error) {
    console.error('POST Error:', error)
    return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    const id = searchParams.get('id')
    const authCheck = await checkAuth()
    
    if (authCheck.error) {
      return handleCORS(NextResponse.json({ error: authCheck.error }, { status: authCheck.status }))
    }

    const body = await request.json()

    // Update Customer
    if (endpoint === 'customer') {
      const customer = await prisma.customer.update({
        where: { id },
        data: {
          name: body.name,
          phone: body.phone,
          address: body.address
        }
      })

      await createAuditTrail(
        authCheck.user.id,
        'UPDATE',
        'customers',
        customer.id,
        `Update customer: ${body.name}`
      )

      return handleCORS(NextResponse.json({ customer, message: 'Customer berhasil diupdate' }))
    }

    // Update Account
    if (endpoint === 'account') {
      if (authCheck.user.role !== 'ADMIN') {
        return handleCORS(NextResponse.json({ error: 'Only admin can update accounts' }, { status: 403 }))
      }

      const account = await prisma.account.update({
        where: { id },
        data: {
          code: body.code,
          name: body.name,
          type: body.type
        }
      })

      await createAuditTrail(
        authCheck.user.id,
        'UPDATE',
        'accounts',
        account.id,
        `Update akun: ${body.code} - ${body.name}`
      )

      return handleCORS(NextResponse.json({ account, message: 'Akun berhasil diupdate' }))
    }

    return handleCORS(NextResponse.json({ error: 'Endpoint not found' }, { status: 404 }))
  } catch (error) {
    console.error('PUT Error:', error)
    return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    const id = searchParams.get('id')
    const authCheck = await checkAuth()
    
    if (authCheck.error) {
      return handleCORS(NextResponse.json({ error: authCheck.error }, { status: authCheck.status }))
    }

    if (authCheck.user.role !== 'ADMIN') {
      return handleCORS(NextResponse.json({ error: 'Only admin can delete' }, { status: 403 }))
    }

    // Delete Customer
    if (endpoint === 'customer') {
      await prisma.customer.delete({ where: { id } })

      await createAuditTrail(
        authCheck.user.id,
        'DELETE',
        'customers',
        id,
        'Delete customer'
      )

      return handleCORS(NextResponse.json({ message: 'Customer berhasil dihapus' }))
    }

    // Delete Account
    if (endpoint === 'account') {
      await prisma.account.delete({ where: { id } })

      await createAuditTrail(
        authCheck.user.id,
        'DELETE',
        'accounts',
        id,
        'Delete akun'
      )

      return handleCORS(NextResponse.json({ message: 'Akun berhasil dihapus' }))
    }

    return handleCORS(NextResponse.json({ error: 'Endpoint not found' }, { status: 404 }))
  } catch (error) {
    console.error('DELETE Error:', error)
    return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
  }
}
