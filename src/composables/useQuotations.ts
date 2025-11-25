import { ref, type Ref } from 'vue'
import { quotationService, type QuoteQueryOptions, type QuoteListResponse } from '@/services/api/quotationService'
import type { Quote, CreateQuoteRequest, UpdateQuoteRequest, BillingType } from '@/types/QuotationType'

export function useQuotations() {
  const quotations: Ref<Quote[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Mapear datos de la API a estructura del frontend
   */
  const mapQuoteFromAPI = (apiQuote: Quote): Quote => {
    return {
      id: apiQuote.id,
      clientId: apiQuote.clientId,
      client: apiQuote.client,
      clientName: apiQuote.client?.name || apiQuote.clientName || 'N/A',
      services: apiQuote.services || [],
      totalAmount: apiQuote.totalAmount || 0,
      billingType: (apiQuote.services?.[0]?.billingType?.toLowerCase() || apiQuote.billingType || 'monthly') as BillingType,
      createdAt: apiQuote.createdAt,
      updatedAt: apiQuote.updatedAt,
    }
  }

  /**
   * Mapear datos del frontend al formato esperado por la API
   */
  const mapQuoteToAPI = (data: UpdateQuoteRequest): UpdateQuoteRequest => {
    if (!data.services) {
      return data
    }

    return {
      clientId: data.clientId,
      services: data.services.map((s: Record<string, unknown>) => ({
        name: (s.serviceName as string) || (s.name as string) || '',
        description: (s.description as string) || '',
        value: (s.amount as number) || (s.value as number) || 0,
        quantity: (s.quantity as number) || 1,
        billingType: (s.billingType as string) || '',
      })) as Record<string, unknown>[],
    } as UpdateQuoteRequest
  }

  /**
   * Cargar todas las cotizaciones
   */
  const loadQuotations = async (options?: QuoteQueryOptions): Promise<{ success: boolean; message: string }> => {
    try {
      loading.value = true
      error.value = null
      const response = await quotationService.getAllQuotes(options)

      // Extraer el array de cotizaciones de response.data.quotes
      const data = response.data as unknown as QuoteListResponse
      quotations.value = (data.quotes || []).map(mapQuoteFromAPI)

      return { success: true, message: 'Cotizaciones cargadas exitosamente' }
    } catch (err) {
      console.error('Error en loadQuotations:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al cargar cotizaciones'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Cargar cotizaciones de un cliente específico
   */
  const loadQuotationsByClient = async (
    clientId: number,
    options?: Omit<QuoteQueryOptions, 'clientId'>,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      loading.value = true
      error.value = null
      const response = await quotationService.getQuotesByClient(clientId, options)

      // Extraer el array de cotizaciones de response.data.quotes
      const data = response.data as unknown as QuoteListResponse
      quotations.value = (data.quotes || []).map(mapQuoteFromAPI)

      return { success: true, message: 'Cotizaciones del cliente cargadas exitosamente' }
    } catch (err) {
      console.error('Error en loadQuotationsByClient:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al cargar cotizaciones del cliente'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear una nueva cotización
   */
  const createQuotation = async (
    quotationData: CreateQuoteRequest,
  ): Promise<{ success: boolean; message: string; data?: Quote }> => {
    try {
      loading.value = true
      error.value = null

      // Mapear datos al formato esperado por la API
      const mappedData = {
        clientId: quotationData.clientId,
        services: (quotationData.services || []).map((s: Record<string, unknown>) => ({
          name: (s.serviceName as string) || (s.name as string) || '',
          description: (s.description as string) || '',
          value: (s.amount as number) || (s.value as number) || 0,
          quantity: (s.quantity as number) || 1,
          billingType: (s.billingType as string) || '',
        })),
      }

      const response = await quotationService.createQuote(mappedData as CreateQuoteRequest)

      // Agregar la nueva cotización a la lista local
      quotations.value.push(mapQuoteFromAPI(response.data))

      return {
        success: true,
        message: 'Cotización creada exitosamente',
        data: response.data,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear cotización'
      error.value = errorMessage
      console.error('Error al crear cotización:', err)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar una cotización existente
   */
  const updateQuotation = async (
    quotationId: number,
    quotationData: UpdateQuoteRequest,
  ): Promise<{ success: boolean; message: string; data?: Quote }> => {
    try {
      loading.value = true
      error.value = null

      // Mapear datos al formato esperado por la API
      const mappedData = mapQuoteToAPI(quotationData)
      const response = await quotationService.updateQuote(quotationId, mappedData)

      // Actualizar la cotización en la lista local
      const quotationIndex = quotations.value.findIndex((q) => q.id === quotationId)
      if (quotationIndex !== -1) {
        quotations.value[quotationIndex] = mapQuoteFromAPI(response.data)
      }

      return {
        success: true,
        message: 'Cotización actualizada exitosamente',
        data: response.data,
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al actualizar cotización'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar una cotización
   */
  const deleteQuotation = async (quotationId: number): Promise<{ success: boolean; message: string }> => {
    try {
      loading.value = true
      error.value = null

      await quotationService.deleteQuote(quotationId)

      // Remover la cotización de la lista local
      quotations.value = quotations.value.filter((q) => q.id !== quotationId)

      return { success: true, message: 'Cotización eliminada exitosamente' }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al eliminar cotización'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  return {
    quotations,
    loading,
    error,
    loadQuotations,
    loadQuotationsByClient,
    createQuotation,
    updateQuotation,
    deleteQuotation,
  }
}
