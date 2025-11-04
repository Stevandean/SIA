const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create Users
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@accounting.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@accounting.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  const kasir = await prisma.user.upsert({
    where: { email: 'kasir@accounting.com' },
    update: {},
    create: {
      name: 'Kasir User',
      email: 'kasir@accounting.com',
      password: await bcrypt.hash('kasir123', 10),
      role: 'KASIR'
    }
  })

  console.log('Users created:', { admin, kasir })

  // Create Indonesian Chart of Accounts (COA)
  const accounts = [
    // ASSET (1xx)
    { code: '101', name: 'Kas', type: 'ASSET' },
    { code: '102', name: 'Piutang Usaha', type: 'ASSET' },
    { code: '103', name: 'Persediaan Barang', type: 'ASSET' },
    { code: '104', name: 'Perlengkapan', type: 'ASSET' },
    { code: '111', name: 'Peralatan', type: 'ASSET' },
    { code: '112', name: 'Akumulasi Penyusutan Peralatan', type: 'ASSET' },
    
    // LIABILITY (2xx)
    { code: '201', name: 'Utang Usaha', type: 'LIABILITY' },
    { code: '202', name: 'Utang Gaji', type: 'LIABILITY' },
    { code: '203', name: 'Utang Bank', type: 'LIABILITY' },
    
    // EQUITY (3xx)
    { code: '301', name: 'Modal Pemilik', type: 'EQUITY' },
    { code: '302', name: 'Prive', type: 'EQUITY' },
    { code: '303', name: 'Laba Ditahan', type: 'EQUITY' },
    
    // REVENUE (4xx)
    { code: '401', name: 'Pendapatan Penjualan', type: 'REVENUE' },
    { code: '402', name: 'Pendapatan Lain-lain', type: 'REVENUE' },
    
    // EXPENSE (5xx)
    { code: '501', name: 'Beban Gaji', type: 'EXPENSE' },
    { code: '502', name: 'Beban Listrik', type: 'EXPENSE' },
    { code: '503', name: 'Beban Sewa', type: 'EXPENSE' },
    { code: '504', name: 'Beban Penyusutan', type: 'EXPENSE' },
    { code: '505', name: 'Beban Lain-lain', type: 'EXPENSE' }
  ]

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { code: account.code },
      update: {},
      create: account
    })
  }

  console.log('Chart of Accounts created:', accounts.length, 'accounts')

  // Create Sample Customers
  const customers = [
    { name: 'PT Maju Jaya', phone: '081234567890', address: 'Jl. Sudirman No. 123, Jakarta' },
    { name: 'CV Berkah Selalu', phone: '082345678901', address: 'Jl. Gatot Subroto No. 45, Bandung' },
    { name: 'Toko Sejahtera', phone: '083456789012', address: 'Jl. Ahmad Yani No. 67, Surabaya' },
    { name: 'UD Mandiri', phone: '084567890123', address: 'Jl. Diponegoro No. 89, Semarang' }
  ]

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer
    })
  }

  console.log('Sample customers created:', customers.length, 'customers')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
