// Tipo de facturación
export type BillingType = 'monthly' | 'annual' | 'onetime' | 'MONTHLY' | 'ANNUAL' | 'ONETIME'

// Servicio dentro de una cotización
export interface QuoteService {
  id?: number
  name?: string
  serviceName?: string
  description?: string
  value?: number
  amount?: number
  quantity?: number
  billingType?: string
}

// Interfaz para cliente dentro de cotización
export interface QuoteClient {
  id: number
  name: string
  email: string
  phone: string
  country: string
  companyName: string
  notes?: string
  monthlyAmount?: number | null
  paymentDayMonth?: number | null
  createdAt?: string
  updatedAt?: string
}

// Interfaz principal de cotización (Quote)
export interface Quote {
  id: number
  clientId: number
  client?: QuoteClient
  clientName?: string // Para mostrar en la UI
  services: QuoteService[]
  totalAmount?: string | number
  billingType?: BillingType
  createdAt?: string
  updatedAt?: string
}

// Interfaz para crear una nueva cotización
export interface CreateQuoteRequest {
  clientId: number
  billingType: BillingType
  services: Omit<QuoteService, 'id'>[]
}

// Interfaz para actualizar una cotización
export interface UpdateQuoteRequest {
  clientId?: number
  billingType?: BillingType
  services?: Omit<QuoteService, 'id'>[]
}

// Labels en español para los tipos de facturación
export const BILLING_TYPE_LABELS: Record<string, string> = {
  monthly: 'Mensual',
  annual: 'Anual',
  onetime: 'Pago Único',
  MONTHLY: 'Mensual',
  ANNUAL: 'Anual',
  ONETIME: 'Pago Único',
}
