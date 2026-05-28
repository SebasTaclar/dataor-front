export type Client = {
  id: number
  name: string
  email: string
  phone: string
  country: string
  companyName?: string
  notes?: string
  monthlyAmount?: number
  paymentDayMonth?: number
  hasPaid?: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  photoFileName?: string
}
