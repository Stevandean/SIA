export interface UserSession {
  id: string
  name?: string
  email?: string
  role?: "ADMIN" | "KASIR"
}

export interface BaseRevenueData {
  date: string
  description: string
  amount: number | string
}

export interface CashRevenueData extends BaseRevenueData {
  customerId?: string | null
}

export interface CreditRevenueData extends BaseRevenueData {
  customerId: string
  dueDate: string
}

export interface ReceivablePaymentData {
  creditId: string
  date: string
  amount: number | string
  description?: string
}

export interface OtherIncomeData extends BaseRevenueData {}
