import { apiClient, type ApiResponse } from './apiConfig'
import type { Quote, CreateQuoteRequest, UpdateQuoteRequest } from '@/types/QuotationType'

// Interfaz para la respuesta de lista de cotizaciones
export interface QuoteListResponse {
  count: number
  quotes: Quote[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

// Interfaz para opciones de paginación
export interface QuoteQueryOptions {
  page?: number
  limit?: number
  search?: string
  clientId?: number
}

class QuotationService {
  /**
   * Obtiene todas las cotizaciones con paginación y búsqueda
   */
  async getAllQuotes(options?: QuoteQueryOptions): Promise<ApiResponse<QuoteListResponse>> {
    const params = new URLSearchParams()
    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    if (options?.search) params.append('search', options.search)
    if (options?.clientId) params.append('clientId', options.clientId.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/quotes?${queryString}` : '/quotes'
    return await apiClient.get<QuoteListResponse>(endpoint)
  }

  /**
   * Obtiene una cotización por ID
   */
  async getQuoteById(quoteId: number): Promise<ApiResponse<Quote>> {
    return await apiClient.get<Quote>(`/quotes/${quoteId}`)
  }

  /**
   * Obtiene todas las cotizaciones de un cliente específico
   */
  async getQuotesByClient(clientId: number, options?: Omit<QuoteQueryOptions, 'clientId'>): Promise<ApiResponse<QuoteListResponse>> {
    return this.getAllQuotes({ ...options, clientId })
  }

  /**
   * Crea una nueva cotización
   */
  async createQuote(quoteData: CreateQuoteRequest): Promise<ApiResponse<Quote>> {
    return await apiClient.post<Quote>('/quotes', quoteData)
  }

  /**
   * Actualiza una cotización existente
   */
  async updateQuote(
    quoteId: number,
    quoteData: UpdateQuoteRequest,
  ): Promise<ApiResponse<Quote>> {
    return await apiClient.patch<Quote>(`/quotes/${quoteId}`, quoteData)
  }

  /**
   * Elimina una cotización
   */
  async deleteQuote(quoteId: number): Promise<ApiResponse<null>> {
    return await apiClient.delete<null>(`/quotes/${quoteId}`)
  }
}

// Instancia única del servicio
export const quotationService = new QuotationService()
