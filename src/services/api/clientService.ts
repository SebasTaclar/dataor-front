import { apiClient, type ApiResponse } from './apiConfig'
import type { Client } from '@/types/ClientType'

// Interfaz para la respuesta de lista de clientes
export interface ClientListResponse {
  count: number
  clients: Client[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

// Interfaz para crear un nuevo cliente
export interface CreateClientRequest {
  name: string
  email: string
  phone: string
  country: string
  companyName?: string
  notes?: string
  monthlyAmount?: number
  paymentDayMonth?: number
  hasPaid?: boolean
  isActive?: boolean
}

// Interfaz para actualizar un cliente
export interface UpdateClientRequest {
  name?: string
  email?: string
  phone?: string
  country?: string
  companyName?: string
  notes?: string
  monthlyAmount?: number
  paymentDayMonth?: number
  hasPaid?: boolean
  isActive?: boolean
}

// Interfaz para opciones de paginación
export interface ClientQueryOptions {
  page?: number
  limit?: number
  search?: string
}

class ClientService {
  /**
   * Obtiene todos los clientes con paginación y búsqueda
   */
  async getAllClients(options?: ClientQueryOptions): Promise<ApiResponse<ClientListResponse>> {
    const params = new URLSearchParams()
    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    if (options?.search) params.append('search', options.search)

    const queryString = params.toString()
    const endpoint = queryString ? `/clients?${queryString}` : '/clients'
    return await apiClient.get<ClientListResponse>(endpoint)
  }

  /**
   * Obtiene un cliente por ID
   */
  async getClientById(clientId: number): Promise<ApiResponse<Client>> {
    return await apiClient.get<Client>(`/clients/${clientId}`)
  }

  /**
   * Crea un nuevo cliente (multipart: campos + archivos)
   */
  async createClient(formData: FormData): Promise<ApiResponse<Client>> {
    return await apiClient.post<Client>('/clients', formData)
  }

  /**
   * Actualiza un cliente existente
   */
  async updateClient(
    clientId: number,
    clientData: UpdateClientRequest,
  ): Promise<ApiResponse<Client>> {
    return await apiClient.patch<Client>(`/clients/${clientId}`, clientData)
  }

  /**
   * Elimina un cliente
   */
  async deleteClient(clientId: number): Promise<ApiResponse<null>> {
    return await apiClient.delete<null>(`/clients/${clientId}`)
  }

  /**
   * Sube la foto de un cliente
   */
  async uploadClientPhoto(
    clientId: number,
    photoFile: File,
  ): Promise<ApiResponse<{ photoUrl: string }>> {
    const formData = new FormData()
    formData.append('photoFile', photoFile)

    return await apiClient.post<{ photoUrl: string }>(`/clients/${clientId}/photo`, formData)
  }

  /**
   * Elimina la foto de un cliente
   */
  async deleteClientPhoto(clientId: number): Promise<ApiResponse<null>> {
    return await apiClient.delete<null>(`/clients/${clientId}/photo`)
  }

  /**
   * Agrega archivos a un cliente existente
   */
  async addClientFiles(clientId: number, files: File[]): Promise<ApiResponse<Client>> {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    return await apiClient.post<Client>(`/files/clients/${clientId}`, formData)
  }

  /**
   * Elimina un archivo de un cliente
   */
  async deleteClientFile(clientId: number, fileKey: string): Promise<ApiResponse<Client>> {
    return await apiClient.delete<Client>(`/files/clients/${clientId}/${fileKey}`)
  }
}

// Instancia única del servicio
export const clientService = new ClientService()
