export type FuncoinKind = "earn" | "spend"
export type FuncoinPaymentStatus = "created" | "paid" | "failed"

export interface FuncoinPricing {
  baseCurrency: string
  pricePerCoin: number
}

export interface FuncoinPriceUpdateInput {
  pricePerCoin: number
}

export interface FuncoinCategory {
  id: string
  code: string
  name: string
  kind: FuncoinKind
  description?: string | null
  isActive: boolean
  sortOrder: number
}

export interface FuncoinCategoryListResponse {
  categories: FuncoinCategory[]
  total: number
}

export interface FuncoinCategoryCreateInput {
  code: string
  name: string
  kind: FuncoinKind
  description?: string
  isActive?: boolean
  sortOrder?: number
}

export interface FuncoinCategoryUpdateInput {
  name?: string
  kind?: FuncoinKind
  description?: string
  isActive?: boolean
  sortOrder?: number
}

export interface FuncoinTransaction {
  id: string
  userId: string
  kind: FuncoinKind
  categoryCode: string
  categoryName: string
  categoryKind: FuncoinKind
  coins: number
  balanceAfter: number
  referenceType?: string | null
  referenceId?: string | null
  referenceTitle?: string | null
  paymentMethod?: string | null
  paymentStatus?: string | null
  paymentReference?: string | null
  notes?: string | null
  meta?: Record<string, unknown> | null
  status: string
  createdAt: string
  updatedAt: string
}

export interface FuncoinTransactionCreateInput {
  userId: string
  kind: FuncoinKind
  categoryCode: string
  coins: number
  referenceType?: string
  referenceId?: string
  referenceTitle?: string
  paymentMethod?: string
  paymentStatus?: string
  paymentReference?: string
  notes?: string
  meta?: Record<string, unknown>
}

export interface FuncoinTransactionCreateResponse {
  id: string
  userId: string
  kind: FuncoinKind
  categoryCode: string
  categoryName: string
  categoryKind: FuncoinKind
  coins: number
  balanceAfter: number
  referenceType?: string | null
  referenceId?: string | null
  referenceTitle?: string | null
  paymentMethod?: string | null
  paymentStatus?: string | null
  paymentReference?: string | null
  notes?: string | null
  meta?: Record<string, unknown> | null
  status: string
  createdAt: string
  updatedAt: string
}

export interface FuncoinTransactionListResponse {
  transactions: FuncoinTransaction[]
  total: number
  skip: number
  limit: number
}

export interface FuncoinTransactionQueryParams {
  user_id?: string
  kind?: FuncoinKind
  skip?: number
  limit?: number
}

export interface FuncoinAdminPurchase {
  id: string
  userId: string
  userName?: string | null
  userEmail?: string | null
  coins: number
  amountInr: number
  razorpayOrderId: string
  razorpayPaymentId?: string | null
  razorpaySignature?: string | null
  status: FuncoinPaymentStatus
  createdAt: string
  updatedAt: string
}

export interface FuncoinAdminPurchaseListResponse {
  purchases: FuncoinAdminPurchase[]
  total: number
  skip: number
  limit: number
}

export interface FuncoinAdminPurchaseQueryParams {
  username?: string
  status?: FuncoinPaymentStatus
  fromDate?: string
  toDate?: string
  sortBy?: "createdAt" | "amountInr"
  sortOrder?: "asc" | "desc"
  skip?: number
  limit?: number
}
