<div align="center">

# 📘 Accounting Information System – Revenue Cycle  
**A Modern Full-Stack Accounting System for VapeLicious Malang**

![Status](https://img.shields.io/badge/status-development-blue)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css)
![ShadcnUI](https://img.shields.io/badge/Shadcn_UI-000000?style=flat)

**A complete revenue-cycle accounting system with automatic journals and double-entry bookkeeping.**

</div>

---

## 📖 Overview

This project is a **full-stack Accounting Information System** khusus untuk proses **Revenue Cycle**, dikembangkan untuk mendukung pengelolaan transaksi VapeLicious Malang secara modern, real-time, dan terintegrasi.

Aplikasi mencatat:

- Pendapatan tunai  
- Pendapatan kredit  
- Pembayaran piutang  
- Pendapatan lainnya  
- Jurnal umum otomatis  
- Buku besar real-time  
- Pengelolaan customer  
- Pengelolaan user (role-based access: Admin & Kasir)

Semua transaksi menghasilkan **double-entry journal** secara otomatis menggunakan **Prisma + PostgreSQL**.

---

## ✨ Features

### 🔐 Authentication & Authorization  
- NextAuth (Credential login)  
- Role-based access (Admin & Kasir)  
- Protected routes & server-side session validation  

### 💰 Revenue Cycle  
- Cash Revenue  
- Credit Revenue  
- Receivable Payments  
- Other Income  
- Auto-journal posting per transaksi  

### 📊 Accounting Modules  
- Journal Entry  
- Ledger (General Ledger)  
- COA (Account Number Master)  
- Audit Trail otomatis  

### 🧩 Master Data  
- Customer Management  
- User Management (Admin only)  

### 🖥️ Frontend  
- Next.js App Router  
- Shadcn UI Components  
- TailwindCSS  
- TanStack Query  
- Responsive minimal-modern UI  

### 🗄️ Backend  
- Prisma ORM  
- PostgreSQL  
- REST API modular dengan folder `/app/api`  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, React, TailwindCSS, Shadcn UI |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth Credentials |
| State / Fetching | TanStack Query |
| Validation | Zod |
| Deployment | Vercel + Neon/Supabase |

---

## 🚀 Installation & Setup

Semua langkah instalasi **jadi satu blok kode tanpa terputus** sesuai permintaan kamu.

```bash
# 1. Clone repository
git clone https://github.com/yourusername/accounting-system.git
cd accounting-system

# 2. Install dependencies
yarn install
# atau
npm install

# 3. Buat file .env
# (sesuaikan user, password, dan nama database PostgreSQL)
echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/accounting_db?schema=public\"
NEXTAUTH_SECRET=\"your-secret\"
NEXTAUTH_URL=\"http://localhost:3000\"" > .env

# 4. Generate Prisma Client
npx prisma generate

# 5. Run database migration
npx prisma migrate dev --name init

# 6. Jalankan development server
npm run dev
# atau
yarn dev

# Server berjalan di:
# http://localhost:3000
```
📦 Database Schema

Struktur database sepenuhnya menggunakan PostgreSQL dan dibangun dari Prisma schema berikut:

users
customers
- accounts (Chart of Accounts)
- journal_entries
- journal_lines
- cash_revenues
- credit_revenues
- receivable_payments
- other_incomes
- audit_trails

Semua tabel terhubung sesuai prinsip double-entry bookkeeping.

📚 System Modules
1. User Management (Admin Only)

- CRUD User
- Role-based Access (Admin / Kasir)

2. Customer Module
- Tambah customer
- Update & soft delete
- Digunakan sebagai referensi pendapatan

3. Revenue Modules

- Pendapatan Tunai
- Pendapatan Kredit
- Pembayaran Piutang
- Pendapatan Lainnya
- Auto-Journal

4. Journal & Ledger
- Jurnal Umum
- Buku Besar

🧪 Development
```
# buka prisma studio
npx prisma studio

# cek database
npx prisma db pull

# format schema
npx prisma format
```

📤 Deployment
Vercel Deployment Guide

- Push ke GitHub
- Deploy ke Vercel
- Set environment variable .env di dashboard
- Gunakan database PostgreSQL dari:
1. Neon
2. Supabase
3. Railway

👥 Authors

Stevandean – Full-Stack Developer

📜 License

- Private educational project.
- Use allowed for academic purposes or with permission.

<div align="center">

⭐ Star repository ini jika menurutmu bermanfaat!

</div>
