'use client'

import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  DollarSign,
  Wallet,
  Users,
  BookOpen,
  FileText,
  History,
  LogOut,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  CircleDollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Login berhasil!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <CircleDollarSign className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Sistem Informasi Akuntansi</CardTitle>
          <CardDescription>Siklus Pendapatan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@accounting.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700">Admin: admin@accounting.com / admin123</p>
            <p className="text-xs text-blue-700">Kasir: kasir@accounting.com / kasir123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardContent() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch dashboard data
  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=dashboard')
      if (!res.ok) throw new Error('Failed to fetch dashboard')
      return res.json()
    }
  })

  // Fetch customers
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=customers')
      if (!res.ok) throw new Error('Failed to fetch customers')
      return res.json()
    }
  })

  // Fetch accounts
  const { data: accountsData } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=accounts')
      if (!res.ok) throw new Error('Failed to fetch accounts')
      return res.json()
    }
  })

  // Fetch transactions
  const { data: cashRevenues } = useQuery({
    queryKey: ['cash-revenues'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=cash-revenues')
      if (!res.ok) throw new Error('Failed to fetch cash revenues')
      return res.json()
    }
  })

  const { data: creditRevenues } = useQuery({
    queryKey: ['credit-revenues'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=credit-revenues')
      if (!res.ok) throw new Error('Failed to fetch credit revenues')
      return res.json()
    }
  })

  const { data: receivablePayments } = useQuery({
    queryKey: ['receivable-payments'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=receivable-payments')
      if (!res.ok) throw new Error('Failed to fetch payments')
      return res.json()
    }
  })

  const { data: otherIncomes } = useQuery({
    queryKey: ['other-incomes'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=other-incomes')
      if (!res.ok) throw new Error('Failed to fetch other incomes')
      return res.json()
    }
  })

  const { data: journalEntries } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=journal-entries')
      if (!res.ok) throw new Error('Failed to fetch journal entries')
      return res.json()
    }
  })

  const { data: generalLedger } = useQuery({
    queryKey: ['general-ledger'],
    queryFn: async () => {
      const res = await fetch('/api/backend?endpoint=general-ledger')
      if (!res.ok) throw new Error('Failed to fetch general ledger')
      return res.json()
    }
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <CircleDollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">SIA Revenue</h2>
              <p className="text-xs text-gray-500">Accounting System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Transaksi</p>
          </div>

          <button
            onClick={() => setActiveTab('cash-revenue')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'cash-revenue' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Receipt className="w-5 h-5" />
            <span className="font-medium">Kas Tunai</span>
          </button>

          <button
            onClick={() => setActiveTab('credit-revenue')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'credit-revenue' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Penjualan Kredit</span>
          </button>

          <button
            onClick={() => setActiveTab('receivable-payment')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'receivable-payment' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Bayar Piutang</span>
          </button>

          <button
            onClick={() => setActiveTab('other-income')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'other-income' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Wallet className="w-5 h-5" />
            <span className="font-medium">Pendapatan Lain</span>
          </button>

          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Master Data</p>
              </div>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'customers' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Customer</span>
              </button>

              <button
                onClick={() => setActiveTab('accounts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'accounts' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Chart of Accounts</span>
              </button>
            </>
          )}

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Laporan</p>
          </div>

          <button
            onClick={() => setActiveTab('journal')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'journal' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Jurnal Umum</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'ledger' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Buku Besar</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {session?.user?.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500">{session?.user?.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <DashboardTab
              dashboard={dashboard}
              loadingDashboard={loadingDashboard}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'cash-revenue' && (
            <CashRevenueTab
              customers={customersData?.customers || []}
              cashRevenues={cashRevenues?.cashRevenues || []}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'credit-revenue' && (
            <CreditRevenueTab
              customers={customersData?.customers || []}
              creditRevenues={creditRevenues?.creditRevenues || []}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'receivable-payment' && (
            <ReceivablePaymentTab
              creditRevenues={creditRevenues?.creditRevenues || []}
              payments={receivablePayments?.payments || []}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'other-income' && (
            <OtherIncomeTab
              otherIncomes={otherIncomes?.otherIncomes || []}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'customers' && isAdmin && (
            <CustomersTab
              customers={customersData?.customers || []}
            />
          )}
          {activeTab === 'accounts' && isAdmin && (
            <AccountsTab
              accounts={accountsData?.accounts || []}
            />
          )}
          {activeTab === 'journal' && (
            <JournalTab
              journalEntries={journalEntries?.journalEntries || []}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'ledger' && (
            <LedgerTab
              accounts={generalLedger?.accounts || []}
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function DashboardTab({ dashboard, loadingDashboard, formatCurrency, formatDate }) {
  if (loadingDashboard) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview siklus pendapatan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pendapatan</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(dashboard?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Akumulasi pendapatan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Piutang Outstanding</CardTitle>
            <CreditCard className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(dashboard?.outstandingReceivables || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Belum terbayar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Kas Masuk</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(dashboard?.totalCashIn || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Akumulasi kas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
          <CardDescription>10 transaksi terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard?.recentTransactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.customer?.name || '-'}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function CashRevenueTab({ customers, cashRevenues, formatCurrency, formatDate }) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    amount: '',
    description: ''
  })

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/backend?endpoint=cash-revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create transaction')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cash-revenues'])
      queryClient.invalidateQueries(['dashboard'])
      queryClient.invalidateQueries(['journal-entries'])
      queryClient.invalidateQueries(['general-ledger'])
      toast.success('Transaksi kas berhasil dibuat')
      setIsDialogOpen(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        customerId: '',
        amount: '',
        description: ''
      })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaksi Kas Tunai</h1>
          <p className="text-gray-500 mt-1">Penerimaan kas dari penjualan tunai</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Transaksi Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaksi Kas Tunai</DialogTitle>
              <DialogDescription>Buat transaksi penerimaan kas baru</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Customer (Opsional)</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tanpa Customer</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Jumlah (Rp)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Penjualan tunai"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashRevenues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    Belum ada transaksi
                  </TableCell>
                </TableRow>
              ) : (
                cashRevenues.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.customer?.name || '-'}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function CreditRevenueTab({ customers, creditRevenues, formatCurrency, formatDate }) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    amount: '',
    dueDate: '',
    description: 'Penjualan Kredit'
  })

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/backend?endpoint=credit-revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create transaction')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['credit-revenues'])
      queryClient.invalidateQueries(['dashboard'])
      queryClient.invalidateQueries(['journal-entries'])
      queryClient.invalidateQueries(['general-ledger'])
      toast.success('Transaksi kredit berhasil dibuat')
      setIsDialogOpen(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        customerId: '',
        amount: '',
        dueDate: '',
        description: 'Penjualan Kredit'
      })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const getStatusBadge = (status) => {
    const variants = {
      UNPAID: 'destructive',
      PARTIAL: 'warning',
      PAID: 'default'
    }
    const labels = {
      UNPAID: 'Belum Bayar',
      PARTIAL: 'Sebagian',
      PAID: 'Lunas'
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Penjualan Kredit</h1>
          <p className="text-gray-500 mt-1">Transaksi penjualan secara kredit</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Transaksi Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Penjualan Kredit</DialogTitle>
              <DialogDescription>Buat transaksi penjualan kredit baru</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Jumlah (Rp)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label>Jatuh Tempo</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Penjualan Kredit</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Terbayar</TableHead>
                <TableHead className="text-right">Sisa</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditRevenues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    Belum ada transaksi
                  </TableCell>
                </TableRow>
              ) : (
                creditRevenues.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.customer?.name}</TableCell>
                    <TableCell>{formatDate(transaction.dueDate)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(transaction.paidAmount)}
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      {formatCurrency(transaction.amount - transaction.paidAmount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function ReceivablePaymentTab({ creditRevenues, payments, formatCurrency, formatDate }) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    creditId: '',
    amount: '',
    description: 'Pembayaran Piutang'
  })

  const unpaidCredits = creditRevenues.filter((c) => c.status !== 'PAID')
  const selectedCredit = creditRevenues.find((c) => c.id === formData.creditId)
  const remainingAmount = selectedCredit ? selectedCredit.amount - selectedCredit.paidAmount : 0

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/backend?endpoint=receivable-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create payment')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['receivable-payments'])
      queryClient.invalidateQueries(['credit-revenues'])
      queryClient.invalidateQueries(['dashboard'])
      queryClient.invalidateQueries(['journal-entries'])
      queryClient.invalidateQueries(['general-ledger'])
      toast.success('Pembayaran piutang berhasil dicatat')
      setIsDialogOpen(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        creditId: '',
        amount: '',
        description: 'Pembayaran Piutang'
      })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pembayaran Piutang</h1>
          <p className="text-gray-500 mt-1">Penerimaan pembayaran piutang dari customer</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Bayar Piutang
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pembayaran Piutang</DialogTitle>
              <DialogDescription>Catat pembayaran piutang dari customer</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Piutang</Label>
                <Select
                  value={formData.creditId}
                  onValueChange={(value) => setFormData({ ...formData, creditId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih piutang" />
                  </SelectTrigger>
                  <SelectContent>
                    {unpaidCredits.map((credit) => (
                      <SelectItem key={credit.id} value={credit.id}>
                        {credit.customer?.name} - {formatCurrency(credit.amount - credit.paidAmount)} (Sisa)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCredit && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Detail Piutang</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Total: {formatCurrency(selectedCredit.amount)}
                  </p>
                  <p className="text-xs text-blue-700">
                    Terbayar: {formatCurrency(selectedCredit.paidAmount)}
                  </p>
                  <p className="text-xs font-medium text-blue-900 mt-1">
                    Sisa: {formatCurrency(remainingAmount)}
                  </p>
                </div>
              )}
              <div>
                <Label>Jumlah Bayar (Rp)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  max={remainingAmount}
                  step="0.01"
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah Bayar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    Belum ada pembayaran
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>{payment.creditRevenue?.customer?.name}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function OtherIncomeTab({ otherIncomes, formatCurrency, formatDate }) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: ''
  })

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/backend?endpoint=other-income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create transaction')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['other-incomes'])
      queryClient.invalidateQueries(['dashboard'])
      queryClient.invalidateQueries(['journal-entries'])
      queryClient.invalidateQueries(['general-ledger'])
      toast.success('Pendapatan lain berhasil dicatat')
      setIsDialogOpen(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: ''
      })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pendapatan Lain-lain</h1>
          <p className="text-gray-500 mt-1">Pendapatan di luar penjualan</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Transaksi Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pendapatan Lain-lain</DialogTitle>
              <DialogDescription>Catat pendapatan di luar penjualan</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Jumlah (Rp)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Pendapatan bunga, sewa, dll"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pendapatan Lain</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherIncomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    Belum ada transaksi
                  </TableCell>
                </TableRow>
              ) : (
                otherIncomes.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell>{formatDate(income.date)}</TableCell>
                    <TableCell>{income.description}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(income.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function CustomersTab({ customers }) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/backend?endpoint=customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to create customer')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
      toast.success('Customer berhasil ditambahkan')
      setIsDialogOpen(false)
      setFormData({ name: '', phone: '', address: '' })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Master Customer</h1>
          <p className="text-gray-500 mt-1">Kelola data customer</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Customer</DialogTitle>
              <DialogDescription>Tambahkan customer baru ke sistem</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nama Customer</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Telepon</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <Label>Alamat</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Alamat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    Belum ada customer
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>{customer.address || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function AccountsTab({ accounts }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
        <p className="text-gray-500 mt-1">Daftar akun akuntansi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map((type) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-lg">
                {type === 'ASSET' && 'Aset'}
                {type === 'LIABILITY' && 'Kewajiban'}
                {type === 'EQUITY' && 'Ekuitas'}
                {type === 'REVENUE' && 'Pendapatan'}
                {type === 'EXPENSE' && 'Beban'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accounts
                  .filter((a) => a.type === type)
                  .map((account) => (
                    <div key={account.id} className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-gray-500">{account.code}</span>
                      <span>{account.name}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function JournalTab({ journalEntries, formatCurrency, formatDate }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Jurnal Umum</h1>
        <p className="text-gray-500 mt-1">Daftar jurnal otomatis dari transaksi</p>
      </div>

      <div className="space-y-4">
        {journalEntries.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">Belum ada jurnal</p>
            </CardContent>
          </Card>
        ) : (
          journalEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{entry.description}</CardTitle>
                    <CardDescription>
                      {formatDate(entry.date)} • Ref: {entry.reference || '-'}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{entry.refType || 'MANUAL'}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Akun</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Kredit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entry.lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="font-mono text-sm">
                          {line.account.code}
                        </TableCell>
                        <TableCell>{line.account.name}</TableCell>
                        <TableCell className="text-right">
                          {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          entry.lines.reduce((sum, line) => sum + line.debit, 0)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          entry.lines.reduce((sum, line) => sum + line.credit, 0)
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function LedgerTab({ accounts, formatCurrency }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buku Besar</h1>
        <p className="text-gray-500 mt-1">Saldo akun real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map((type) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-lg">
                {type === 'ASSET' && 'Aset'}
                {type === 'LIABILITY' && 'Kewajiban'}
                {type === 'EQUITY' && 'Ekuitas'}
                {type === 'REVENUE' && 'Pendapatan'}
                {type === 'EXPENSE' && 'Beban'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accounts
                  .filter((a) => a.type === type)
                  .map((account) => (
                    <div key={account.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{account.name}</p>
                        <p className="font-mono text-xs text-gray-500">{account.code}</p>
                      </div>
                      <p className="font-bold text-sm">
                        {formatCurrency(account.balance || 0)}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

  return <DashboardContent />
}
