# Sistem Informasi Akuntansi - Siklus Pendapatan

Aplikasi web akuntansi lengkap (full-stack) yang fokus pada siklus pendapatan (revenue cycle) dengan sistem pencatatan akuntansi berpasangan (double-entry bookkeeping).

## 🚀 Fitur Utama

### 1. Transaksi Pendapatan
- **Kas Tunai** - Penerimaan kas dari penjualan tunai
- **Penjualan Kredit** - Transaksi penjualan dengan sistem kredit
- **Pembayaran Piutang** - Penerimaan pembayaran dari customer
- **Pendapatan Lain** - Pendapatan di luar penjualan (bunga, sewa, dll)

### 2. Sistem Jurnal Otomatis
- Auto-journal engine dengan double-entry bookkeeping
- Posting otomatis ke buku besar
- Jurnal tergenerate untuk setiap transaksi

### 3. Master Data
- Customer Management (CRUD)
- Chart of Accounts (COA) - Standar Indonesia
- Account types: Asset, Liability, Equity, Revenue, Expense

### 4. Laporan & Buku Besar
- Jurnal Umum (Journal Entries)
- Buku Besar (General Ledger) dengan saldo berjalan
- Dashboard dengan KPI real-time

### 5. Keamanan & Audit
- Autentikasi dengan NextAuth
- Role-based access control (Admin & Kasir)
- Audit trail untuk semua aktivitas
- Protected routes dengan middleware

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Data Fetching**: TanStack Query
- **Validation**: Zod
- **Charts**: Recharts

## 📦 Struktur Database

### Tables
- `users` - User dengan role-based access
- `customers` - Master customer
- `accounts` - Chart of Accounts (COA)
- `journal_entries` - Header jurnal
- `journal_lines` - Detail jurnal (debit/credit)
- `cash_revenues` - Transaksi kas tunai
- `credit_revenues` - Transaksi penjualan kredit
- `receivable_payments` - Pembayaran piutang
- `other_incomes` - Pendapatan lain-lain
- `audit_trails` - Log audit

### Chart of Accounts (Indonesian Standard)
- **100s** - Asset (Kas, Piutang, Persediaan, dll)
- **200s** - Liability (Utang Usaha, Utang Bank, dll)
- **300s** - Equity (Modal, Laba Ditahan, dll)
- **400s** - Revenue (Pendapatan Penjualan, Pendapatan Lain)
- **500s** - Expense (Beban Gaji, Listrik, Sewa, dll)

## 🎯 Demo Credentials

### Admin (Full Access)
- Email: `admin@accounting.com`
- Password: `admin123`

### Kasir (Transaction Access)
- Email: `kasir@accounting.com`
- Password: `kasir123`

## 💻 Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL
- Yarn

### 1. Install Dependencies
```bash
yarn install
```

### 2. Setup Database
```bash
# Start PostgreSQL
sudo service postgresql start

# Create database
sudo -u postgres psql -c "CREATE DATABASE accounting_db;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### 3. Setup Environment
Update `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/accounting_db?schema=public"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run Migration & Seed
```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

### 5. Start Development Server
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Transactions
- `GET /api/backend?endpoint=cash-revenues` - Get cash revenues
- `POST /api/backend?endpoint=cash-revenue` - Create cash revenue
- `GET /api/backend?endpoint=credit-revenues` - Get credit revenues
- `POST /api/backend?endpoint=credit-revenue` - Create credit revenue
- `POST /api/backend?endpoint=receivable-payment` - Create payment
- `POST /api/backend?endpoint=other-income` - Create other income

### Master Data
- `GET /api/backend?endpoint=customers` - Get customers
- `POST /api/backend?endpoint=customer` - Create customer
- `GET /api/backend?endpoint=accounts` - Get COA

### Reports
- `GET /api/backend?endpoint=journal-entries` - Get journal entries
- `GET /api/backend?endpoint=general-ledger` - Get general ledger
- `GET /api/backend?endpoint=dashboard` - Get dashboard KPIs

## 🎨 UI Features

- **Responsive Design** - Mobile-friendly interface
- **Professional UI** - Clean, minimalist design with Shadcn components
- **Real-time Updates** - TanStack Query for data synchronization
- **Interactive Forms** - Dialog-based transaction forms
- **Data Tables** - Searchable, filterable tables
- **Dashboard Charts** - Visual KPIs with Recharts

## 🔐 Role-Based Access

### Admin
- Full access to all features
- Can create manual journal entries
- Manage master data (customers, COA)
- View all reports and audit trail

### Kasir
- Create transactions (cash, credit, payment, other income)
- View basic reports
- Limited to transaction modules

## 🧪 Testing

Manual testing with curl:
```bash
# Test authentication (should return unauthorized)
curl -X GET "http://localhost:3000/api/backend?endpoint=accounts"
```

## 📖 Auto-Journal Logic

### Cash Revenue Transaction
```
Debit:  Kas (101)
Credit: Pendapatan Penjualan (401)
```

### Credit Revenue Transaction
```
Debit:  Piutang Usaha (102)
Credit: Pendapatan Penjualan (401)
```

### Receivable Payment
```
Debit:  Kas (101)
Credit: Piutang Usaha (102)
```

### Other Income
```
Debit:  Kas (101)
Credit: Pendapatan Lain-lain (402)
```

## 🚢 Deployment

### For Vercel Deployment
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Use Neon, Supabase, or Vercel Postgres for database

### Environment Variables for Production
```env
DATABASE_URL="your-production-postgres-url"
NEXTAUTH_SECRET="generate-secure-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 📝 License

MIT

## 👨‍💻 Developer

Built with ❤️ using Next.js and modern web technologies.
