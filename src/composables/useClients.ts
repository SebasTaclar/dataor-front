import { ref, type Ref } from 'vue'
import { clientService, type UpdateClientRequest, type ClientQueryOptions, type ClientListResponse } from '@/services/api/clientService'
import type { Client } from '@/types/ClientType'

export function useClients() {
  const clients: Ref<Client[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Cargar todos los clientes
   */
  const loadClients = async (options?: ClientQueryOptions): Promise<{ success: boolean; message: string }> => {
    try {
      loading.value = true
      error.value = null
      const response = await clientService.getAllClients(options)

      // Extraer el array de clientes de response.data.clients
      const data = response.data as unknown as ClientListResponse
      clients.value = data.clients || []

      return { success: true, message: 'Clientes cargados exitosamente' }
    } catch (err) {
      console.error('Error en loadClients:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al cargar clientes'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener un cliente por ID
   */
  const getClientById = async (
    clientId: number,
  ): Promise<{ success: boolean; message: string; data?: Client }> => {
    try {
      loading.value = true
      error.value = null
      const response = await clientService.getClientById(clientId)

      return {
        success: true,
        message: 'Cliente obtenido exitosamente',
        data: response.data,
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al obtener cliente'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear un nuevo cliente (multipart: campos + archivos)
   */
  const createClient = async (
    formData: FormData,
  ): Promise<{ success: boolean; message: string; data?: Client }> => {
    try {
      loading.value = true
      error.value = null

      const response = await clientService.createClient(formData)

      // Agregar el nuevo cliente a la lista local
      clients.value.push(response.data)

      return {
        success: true,
        message: 'Cliente creado exitosamente',
        data: response.data,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear cliente'
      error.value = errorMessage
      console.error('Error al crear cliente:', err)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar un cliente existente
   */
  const updateClient = async (
    clientId: number,
    clientData: UpdateClientRequest,
  ): Promise<{ success: boolean; message: string; data?: Client }> => {
    try {
      loading.value = true
      error.value = null

      const response = await clientService.updateClient(clientId, clientData)

      // Actualizar el cliente en la lista local
      const clientIndex = clients.value.findIndex((c) => c.id === clientId)
      if (clientIndex !== -1) {
        clients.value[clientIndex] = response.data
      }

      return {
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: response.data,
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al actualizar cliente'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar un cliente
   */
  const deleteClient = async (clientId: number): Promise<{ success: boolean; message: string }> => {
    try {
      loading.value = true
      error.value = null

      await clientService.deleteClient(clientId)

      // Remover el cliente de la lista local
      clients.value = clients.value.filter((c) => c.id !== clientId)

      return { success: true, message: 'Cliente eliminado exitosamente' }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al eliminar cliente'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Subir foto del cliente
   */
  const uploadClientPhoto = async (
    clientId: number,
    photoFile: File,
  ): Promise<{ success: boolean; photoUrl?: string; message: string }> => {
    try {
      loading.value = true
      error.value = null

      const response = await clientService.uploadClientPhoto(clientId, photoFile)

      // Actualizar el cliente en la lista local con la nueva foto
      const clientIndex = clients.value.findIndex((c) => c.id === clientId)
      if (clientIndex !== -1) {
        clients.value[clientIndex].photoFileName = response.data.photoUrl
      }

      return {
        success: true,
        photoUrl: response.data.photoUrl,
        message: 'Foto subida exitosamente',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir foto'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar foto del cliente
   */
  const deleteClientPhoto = async (
    clientId: number,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      loading.value = true
      error.value = null

      await clientService.deleteClientPhoto(clientId)

      // Actualizar el cliente en la lista local
      const clientIndex = clients.value.findIndex((c) => c.id === clientId)
      if (clientIndex !== -1) {
        clients.value[clientIndex].photoFileName = undefined
      }

      return { success: true, message: 'Foto eliminada exitosamente' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar foto'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Agregar archivos a un cliente existente
   */
  const addClientFiles = async (
    clientId: number,
    files: File[],
  ): Promise<{ success: boolean; message: string; data?: Client }> => {
    try {
      loading.value = true
      error.value = null

      const response = await clientService.addClientFiles(clientId, files)

      const clientIndex = clients.value.findIndex((c) => c.id === clientId)
      if (clientIndex !== -1) {
        clients.value[clientIndex] = response.data
      }

      return {
        success: true,
        message: 'Archivos agregados exitosamente',
        data: response.data,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al agregar archivos'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar un archivo de un cliente
   */
  const deleteClientFile = async (
    clientId: number,
    fileKey: string,
  ): Promise<{ success: boolean; message: string; data?: Client }> => {
    try {
      loading.value = true
      error.value = null

      const response = await clientService.deleteClientFile(clientId, fileKey)

      const clientIndex = clients.value.findIndex((c) => c.id === clientId)
      if (clientIndex !== -1) {
        clients.value[clientIndex] = response.data
      }

      return {
        success: true,
        message: 'Archivo eliminado exitosamente',
        data: response.data,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar archivo'
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  return {
    clients,
    loading,
    error,
    loadClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    uploadClientPhoto,
    deleteClientPhoto,
    addClientFiles,
    deleteClientFile,
  }
}
