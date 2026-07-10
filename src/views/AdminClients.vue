<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <!-- Header con navegación -->
      <div class="dashboard-header">
        <h1>Gestión de Clientes</h1>
        <div class="admin-nav-buttons">
          <RouterLink to="/admin/clientes" class="nav-btn active">Clientes</RouterLink>
          <RouterLink to="/admin/cotizaciones" class="nav-btn">Cotizaciones</RouterLink>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="error = null" class="close-error">×</button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        <p>{{ successMessage }}</p>
        <button @click="successMessage = null" class="close-success">×</button>
      </div>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <!-- Botón para crear/desplegar formulario -->
        <div class="create-button-container">
          <button @click="toggleFormVisibility" class="create-toggle-btn">
            {{ showForm ? '✖️ Cancelar' : '➕ Crear Cliente' }}
          </button>
        </div>

        <!-- Formulario para Nuevo Cliente (Colapsable) -->
        <div v-show="showForm" class="new-project-section">
          <div class="section-head">
            <h3>{{ editingClient ? '✏️ Editar Cliente' : '➕ Agregar Nuevo Cliente' }}</h3>
          </div>
          <form @submit.prevent="saveClient" class="new-project-form">
            <div class="form-grid">
              <input v-model="clientForm.name" type="text" placeholder="Nombre del contacto" required
                class="form-input" />
              <input v-model="clientForm.companyName" type="text" placeholder="Nombre de la empresa" required
                class="form-input" />
              <input v-model="clientForm.email" type="email" placeholder="Email" required class="form-input" />
              <input v-model="clientForm.phone" type="tel" placeholder="Teléfono" required class="form-input" />
              <input v-model="clientForm.country" type="text" placeholder="País" required class="form-input" />
              <input v-model="clientForm.monthlyAmount" type="number" step="0.01" placeholder="Monto mensual"
                class="form-input" />
              <input v-model="clientForm.paymentDayMonth" type="number" min="1" max="31"
                placeholder="Día de pago del mes (1-31)" class="form-input" />
              <label class="form-toggle">
                <input v-model="clientForm.hasPaid" type="checkbox" />
                <span>{{ clientForm.hasPaid ? 'Pagado' : 'No pagado' }}</span>
              </label>
              <label class="form-toggle">
                <input v-model="clientForm.isActive" type="checkbox" />
                <span>Cliente activo</span>
              </label>
              <textarea v-model="clientForm.notes" placeholder="Notas" class="form-input" rows="3"
                style="grid-column: 1 / -1;"></textarea>
              <div class="form-files-section" style="grid-column: 1 / -1;">
                <label class="form-files-label">
                  📎 Archivos (opcional)
                </label>
                <input ref="fileInputRef" type="file" multiple class="form-files-input"
                  @change="handleFilesSelect" />
                <button type="button" class="form-files-btn" @click="fileInputRef?.click()">
                  Seleccionar archivos
                </button>
                <div v-if="pendingFiles.length > 0" class="pending-files-list">
                  <div v-for="(file, index) in pendingFiles" :key="index" class="pending-file-item">
                    <span class="pending-file-name">📄 {{ file.name }}</span>
                    <button type="button" class="pending-file-remove" @click="removePendingFile(index)">✕</button>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="add-btn">
                  {{ editingClient ? 'Actualizar' : 'Agregar' }}
                </button>
                <button v-if="editingClient" @click="cancelEdit" type="button" class="cancel-btn">
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Lista de Clientes -->
        <div class="projects-panels">
          <div class="panel projects-professional main-projects">
            <div class="panel-header">
              <div>
                <h4>📋 Lista de Clientes</h4>
                <div class="project-counter">{{ clients.length }} clientes registrados</div>
              </div>
              <div class="revenue-summary">
                <small class="revenue-label">💰 Ingresos Mensuales:</small>
                <strong class="revenue-value">${{ calculateMonthlyRevenue().toLocaleString('es-CO', {
                  minimumFractionDigits: 0
                }) }}</strong>
              </div>
            </div>

            <div v-if="loading" class="loading-state">
              <p>Cargando clientes...</p>
            </div>

            <div v-else class="clients-table-wrapper">
              <table v-if="clients.length > 0" class="clients-table">
                <thead>
                  <tr>
                    <th style="width: 12%">Nombre</th>
                    <th style="width: 9%">Empresa</th>
                    <th style="width: 14%">Email</th>
                    <th style="width: 8%">Teléfono</th>
                    <th style="width: 6%">País</th>
                    <th style="width: 6%">Estado</th>
                    <th style="width: 6%">Pago</th>
                    <th style="width: 8%">Monto Mensual</th>
                    <th style="width: 6%">Día de Pago</th>
                    <th style="width: 7%">Notas</th>
                    <th style="width: 8%">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="client in sortedClients" :key="client.id" class="client-row"
                    :class="{ 'is-editing': inlineEditingId === client.id, 'is-inactive': !client.isActive }">
                    <td class="td-name" :title="client.name">
                      <template v-if="inlineEditingId === client.id">
                        <input v-model="inlineEditingData!.name" type="text" class="edit-input" />
                      </template>
                      <template v-else>
                        {{ client.name }}
                      </template>
                    </td>
                    <td class="td-company" :title="client.companyName">
                      <template v-if="inlineEditingId === client.id">
                        <input v-model="inlineEditingData!.companyName" type="text" class="edit-input" />
                      </template>
                      <template v-else>
                        {{ client.companyName }}
                      </template>
                    </td>
                    <td class="td-email" :title="client.email">
                      <template v-if="inlineEditingId === client.id">
                        <input v-model="inlineEditingData!.email" type="email" class="edit-input" />
                      </template>
                      <template v-else>
                        {{ client.email }}
                      </template>
                    </td>
                    <td>
                      <template v-if="inlineEditingId === client.id">
                        <input v-model="inlineEditingData!.phone" type="tel" class="edit-input" />
                      </template>
                      <template v-else>
                        {{ client.phone }}
                      </template>
                    </td>
                    <td>
                      <template v-if="inlineEditingId === client.id">
                        <input v-model="inlineEditingData!.country" type="text" class="edit-input" />
                      </template>
                      <template v-else>
                        {{ client.country }}
                      </template>
                    </td>
                    <td class="td-status">
                      <template v-if="inlineEditingId === client.id">
                        <label class="status-toggle">
                          <input v-model="inlineEditingData!.isActive" type="checkbox" />
                          <span>{{ inlineEditingData!.isActive ? 'Activo' : 'Inactivo' }}</span>
                        </label>
                      </template>
                      <template v-else>
                        <span class="status-badge" :class="client.isActive ? 'status-active' : 'status-inactive'">
                          {{ client.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </template>
                    </td>
                    <td class="td-payment-status">
                      <template v-if="inlineEditingId === client.id">
                        <label class="status-toggle">
                          <input v-model="inlineEditingData!.hasPaid" type="checkbox" />
                          <span>{{ inlineEditingData!.hasPaid ? 'Pagado' : 'No pagado' }}</span>
                        </label>
                      </template>
                      <template v-else>
                        <span class="status-badge" :class="client.hasPaid ? 'status-active' : 'status-inactive'">
                          {{ client.hasPaid ? 'Pagado' : 'No pagado' }}
                        </span>
                      </template>
                    </td>
                    <td class="td-amount">
                      <template v-if="inlineEditingId === client.id">
                        <input v-model.number="inlineEditingData!.monthlyAmount" type="number" step="0.01"
                          class="edit-input" />
                      </template>
                      <template v-else>
                        {{ client.monthlyAmount ? `$${client.monthlyAmount.toLocaleString('es-CO')}` : '-' }}
                      </template>
                    </td>
                    <td class="td-payment-day">
                      <template v-if="inlineEditingId === client.id">
                        <input v-model.number="inlineEditingData!.paymentDayMonth" type="number" min="1" max="31"
                          class="edit-input" />
                      </template>
                      <template v-else>
                        {{ client.paymentDayMonth ? `Día ${client.paymentDayMonth}` : '-' }}
                      </template>
                    </td>
                    <td class="td-notes">
                      <template v-if="inlineEditingId === client.id">
                        <button @click="openEditNotesModal(client)" class="notes-edit-btn" title="Editar notas">
                          ✏️ {{ inlineEditingData!.notes ? 'Editar notas' : 'Agregar notas' }}
                        </button>
                      </template>
                      <template v-else>
                        <div v-if="client.notes" class="notes-cell" :title="client.notes">
                          <span class="notes-preview">{{ truncateNotes(client.notes, 50) }}</span>
                          <button @click="openNotesModal(client)" class="notes-expand-btn"
                            title="Ver notas completas">📖</button>
                        </div>
                        <span v-else class="notes-empty">-</span>
                      </template>
                    </td>
                    <td class="td-actions">
                      <template v-if="inlineEditingId === client.id">
                        <button @click="saveInlineEditBatch(client.id)" class="action-btn save-btn"
                          title="Guardar">✅</button>
                        <button @click="cancelInlineEdit" class="action-btn cancel-btn" title="Cancelar">❌</button>
                      </template>
                      <template v-else>
                        <button @click="openFilesModal(client)"
                          class="action-btn files-btn" :class="{ 'has-files': client.files && client.files.length > 0 }" title="Archivos">📎</button>
                        <button @click="startInlineEdit(client)" class="action-btn edit-btn"
                          title="Editar inline">✏️</button>
                        <button @click="confirmDelete(client)" class="action-btn delete-btn"
                          title="Eliminar">🗑️</button>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Mensaje cuando no hay clientes -->
              <div v-else class="empty-projects">
                <div class="empty-icon">📁</div>
                <h5>No hay clientes registrados</h5>
                <p>Utiliza el formulario de arriba para agregar tu primer cliente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirm Modal -->
  <ConfirmModal ref="confirmModal" />

  <!-- Notes Modal -->
  <div v-if="showNotesModal" class="modal-overlay" @click="closeNotesModal">
    <div class="modal-content notes-modal" @click.stop>
      <div class="modal-header">
        <h3>📝 Notas del Cliente: {{ selectedClientForNotes?.name }}</h3>
        <button class="modal-close" @click="closeNotesModal">✕</button>
      </div>
      <div class="modal-body">
        <p class="notes-full-text">{{ selectedClientForNotes?.notes }}</p>
      </div>
      <div class="modal-footer">
        <button @click="closeNotesModal" class="modal-btn modal-btn-primary">Cerrar</button>
      </div>
    </div>
  </div>

  <!-- Edit Notes Modal -->
  <div v-if="showEditNotesModal" class="modal-overlay" @click="closeEditNotesModal">
    <div class="modal-content notes-modal" @click.stop>
      <div class="modal-header">
        <h3>✏️ Editar Notas: {{ editingNotesClient?.name }}</h3>
        <button class="modal-close" @click="closeEditNotesModal">✕</button>
      </div>
      <div class="modal-body">
        <textarea v-model="editingNotesText" class="edit-notes-textarea" rows="8"
          placeholder="Escribe las notas del cliente..."></textarea>
      </div>
      <div class="modal-footer">
        <button @click="closeEditNotesModal" class="modal-btn modal-btn-secondary">Cancelar</button>
        <button @click="saveEditNotes" class="modal-btn modal-btn-primary">Guardar</button>
      </div>
    </div>
  </div>

  <!-- Files Modal -->
  <div v-if="showFilesModal" class="modal-overlay" @click="closeFilesModal">
    <div class="modal-content files-modal" @click.stop>
      <div class="modal-header">
        <h3>📁 Archivos de: {{ selectedClientForFiles?.name }}</h3>
        <button class="modal-close" @click="closeFilesModal">✕</button>
      </div>
      <div class="modal-body">
        <div v-if="selectedClientForFiles?.files && selectedClientForFiles.files.length > 0" class="files-list">
          <div v-for="file in selectedClientForFiles.files" :key="file.key" class="file-item">
            <span class="file-icon">{{ file.type?.startsWith('image/') ? '🖼️' : '📄' }}</span>
            <span class="file-name" :title="file.name">{{ file.name }}</span>
            <div class="file-actions">
              <button @click="previewFile(file)" class="file-action-btn preview-btn"
                title="Ver archivo">👁️</button>
              <button @click="openFileExternal(file.url)" class="file-action-btn open-btn"
                title="Abrir en nueva pestaña">🔗</button>
              <button @click="downloadFile(file.url)" class="file-action-btn download-btn"
                title="Descargar">⬇️</button>
              <button @click="confirmDeleteFile(selectedClientForFiles!.id, file.key)"
                class="file-action-btn delete-btn" title="Eliminar">🗑️</button>
            </div>
          </div>
        </div>
        <div v-else class="no-files-message">
          <p>No hay archivos adjuntos</p>
        </div>

        <div class="add-files-section">
          <input ref="modalFileInputRef" type="file" multiple class="form-files-input"
            @change="handleModalFilesSelect" />
          <button type="button" class="form-files-btn" @click="modalFileInputRef?.click()">
            + Agregar archivos
          </button>
          <div v-if="modalPendingFiles.length > 0" class="pending-files-list">
            <div v-for="(file, index) in modalPendingFiles" :key="index" class="pending-file-item">
              <span class="pending-file-name">📄 {{ file.name }}</span>
              <button type="button" class="pending-file-remove" @click="removeModalPendingFile(index)">✕</button>
            </div>
            <button @click="uploadFilesToClient(selectedClientForFiles!.id)" class="modal-btn modal-btn-primary"
              :disabled="uploadingFiles">
              {{ uploadingFiles ? 'Subiendo...' : 'Subir archivos' }}
            </button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="closeFilesModal" class="modal-btn modal-btn-primary">Cerrar</button>
      </div>
    </div>
  </div>

  <!-- File Preview Modal -->
  <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
    <div class="modal-content preview-modal" @click.stop>
      <div class="modal-header">
        <h3>👁️ {{ previewFileData?.name }}</h3>
        <button class="modal-close" @click="closePreviewModal">✕</button>
      </div>
      <div class="modal-body preview-body">
        <img v-if="previewFileData?.type?.startsWith('image/')" :src="previewFileData.url"
          :alt="previewFileData.name" class="preview-image" />
        <iframe v-else-if="previewFileData?.type === 'application/pdf'" :src="previewFileData.url"
          class="preview-pdf" frameborder="0"></iframe>
        <div v-else class="preview-not-supported">
          <p>Vista previa no disponible para este tipo de archivo.</p>
          <button @click="openFileExternal(previewFileData!.url)" class="modal-btn modal-btn-primary">
            Abrir en nueva pestaña
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="openFileExternal(previewFileData!.url)" class="modal-btn modal-btn-secondary">
          Abrir en pestaña
        </button>
        <button @click="downloadFile(previewFileData!.url)" class="modal-btn modal-btn-secondary">
          Descargar
        </button>
        <button @click="closePreviewModal" class="modal-btn modal-btn-primary">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClients } from '@/composables/useClients'
import type { Client, StoredFile } from '@/types/ClientType'
import { authService } from '@/services/api/authService'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const { clients, loading, loadClients, createClient, updateClient, deleteClient, addClientFiles, deleteClientFile } = useClients()

const confirmModal = ref<InstanceType<typeof ConfirmModal>>()

const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const editingClient = ref<Client | null>(null)
const inlineEditingId = ref<number | null>(null)
const inlineEditingData = ref<Partial<Client> | null>(null)
const showForm = ref(false)
const showNotesModal = ref(false)
const selectedClientForNotes = ref<Client | null>(null)
const showEditNotesModal = ref(false)
const editingNotesClient = ref<Client | null>(null)
const editingNotesText = ref('')

const pendingFiles = ref<File[]>([])
const showFilesModal = ref(false)
const selectedClientForFiles = ref<Client | null>(null)
const uploadingFiles = ref(false)
const modalPendingFiles = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const modalFileInputRef = ref<HTMLInputElement | null>(null)

const showPreviewModal = ref(false)
const previewFileData = ref<StoredFile | null>(null)

const sortedClients = computed(() => {
  return [...clients.value].sort((firstClient, secondClient) => {
    const firstInactive = firstClient.isActive === false ? 1 : 0
    const secondInactive = secondClient.isActive === false ? 1 : 0

    if (firstInactive !== secondInactive) {
      return firstInactive - secondInactive
    }

    return firstClient.name.localeCompare(secondClient.name, 'es', { sensitivity: 'base' })
  })
})

const clientForm = ref({
  name: '',
  companyName: '',
  email: '',
  phone: '',
  country: '',
  monthlyAmount: undefined as number | undefined,
  paymentDayMonth: undefined as number | undefined,
  hasPaid: false,
  isActive: true,
  notes: '',
})

// Verificar autenticación
onMounted(async () => {
  if (!authService.isAuthenticated() || authService.getUserRole() !== 'admin') {
    router.push('/')
    return
  }

  // Cargar clientes
  const result = await loadClients()
  if (!result.success) {
    error.value = result.message
  }
})

// Métodos
const toggleFormVisibility = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    resetForm()
  }
}

const saveClient = async () => {
  try {
    if (editingClient.value) {
      // Actualizar cliente existente (JSON)
      const result = await updateClient(editingClient.value.id, clientForm.value)
      if (result.success) {
        // Si hay archivos pendientes, subirlos por separado
        if (pendingFiles.value.length > 0) {
          const uploadResult = await addClientFiles(editingClient.value.id, pendingFiles.value)
          if (!uploadResult.success) {
            error.value = uploadResult.message
          }
        }
        successMessage.value = 'Cliente actualizado exitosamente'
        resetForm()
      } else {
        error.value = result.message
      }
    } else {
      // Crear nuevo cliente (multipart: campos + archivos)
      const formData = new FormData()
      formData.append('name', clientForm.value.name)
      formData.append('companyName', clientForm.value.companyName)
      formData.append('email', clientForm.value.email)
      formData.append('phone', clientForm.value.phone)
      formData.append('country', clientForm.value.country)
      if (clientForm.value.monthlyAmount !== undefined) {
        formData.append('monthlyAmount', clientForm.value.monthlyAmount.toString())
      }
      if (clientForm.value.paymentDayMonth !== undefined) {
        formData.append('paymentDayMonth', clientForm.value.paymentDayMonth.toString())
      }
      formData.append('hasPaid', clientForm.value.hasPaid.toString())
      formData.append('isActive', clientForm.value.isActive.toString())
      if (clientForm.value.notes) {
        formData.append('notes', clientForm.value.notes)
      }
      pendingFiles.value.forEach((file) => {
        formData.append('files', file)
      })

      const result = await createClient(formData)
      if (result.success) {
        successMessage.value = 'Cliente creado exitosamente'
        resetForm()
      } else {
        error.value = result.message
      }
    }

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al guardar cliente'
  }
}

const cancelEdit = () => {
  editingClient.value = null
  resetForm()
}

const confirmDelete = async (client: Client) => {
  if (!confirmModal.value) return

  const confirmed = await confirmModal.value.open({
    title: 'Eliminar Cliente',
    message: `¿Estás seguro de que deseas eliminar el cliente "${client.name}"? Esta acción no puede revertirse.`,
    confirmText: 'Eliminar'
  })

  if (confirmed) {
    const result = await deleteClient(client.id)
    if (result.success) {
      successMessage.value = 'Cliente eliminado exitosamente'
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    } else {
      error.value = result.message
    }
  }
}

const resetForm = () => {
  clientForm.value = {
    name: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    monthlyAmount: undefined,
    paymentDayMonth: undefined,
    hasPaid: false,
    isActive: true,
    notes: '',
  }
  editingClient.value = null
  pendingFiles.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const startInlineEdit = (client: Client) => {
  inlineEditingId.value = client.id
  inlineEditingData.value = {
    name: client.name,
    companyName: client.companyName,
    email: client.email,
    phone: client.phone,
    country: client.country,
    monthlyAmount: client.monthlyAmount,
    paymentDayMonth: client.paymentDayMonth,
    hasPaid: client.hasPaid,
    isActive: client.isActive,
    notes: client.notes,
  }
}

const cancelInlineEdit = () => {
  inlineEditingId.value = null
  inlineEditingData.value = null
}

const saveInlineEditBatch = async (clientId: number) => {
  try {
    if (!inlineEditingData.value) return

    const result = await updateClient(clientId, inlineEditingData.value)
    if (result.success) {
      successMessage.value = 'Cliente actualizado exitosamente'
      inlineEditingId.value = null
      inlineEditingData.value = null
      setTimeout(() => {
        successMessage.value = null
      }, 2000)
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al actualizar'
  }
}

const calculateMonthlyRevenue = (): number => {
  return clients.value.reduce((total, client) => {
    if (client.isActive === false) return total
    return total + (Number(client.monthlyAmount) || 0)
  }, 0)
}

const truncateNotes = (text: string, maxLength: number): string => {
  if (!text) return '-'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const openNotesModal = (client: Client) => {
  selectedClientForNotes.value = client
  showNotesModal.value = true
}

const closeNotesModal = () => {
  showNotesModal.value = false
  selectedClientForNotes.value = null
}

const openEditNotesModal = (client: Client) => {
  editingNotesClient.value = client
  editingNotesText.value = inlineEditingData.value?.notes ?? client.notes ?? ''
  showEditNotesModal.value = true
}

const closeEditNotesModal = () => {
  showEditNotesModal.value = false
  editingNotesClient.value = null
  editingNotesText.value = ''
}

const saveEditNotes = () => {
  if (inlineEditingData.value) {
    inlineEditingData.value.notes = editingNotesText.value
  }
  closeEditNotesModal()
}

// Métodos de archivos
const handleFilesSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    pendingFiles.value = [...pendingFiles.value, ...Array.from(target.files)]
    target.value = ''
  }
}

const removePendingFile = (index: number) => {
  pendingFiles.value.splice(index, 1)
}

const openFilesModal = (client: Client) => {
  selectedClientForFiles.value = client
  modalPendingFiles.value = []
  showFilesModal.value = true
}

const closeFilesModal = () => {
  showFilesModal.value = false
  selectedClientForFiles.value = null
  modalPendingFiles.value = []
  if (modalFileInputRef.value) {
    modalFileInputRef.value.value = ''
  }
}

const handleModalFilesSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    modalPendingFiles.value = [...modalPendingFiles.value, ...Array.from(target.files)]
    target.value = ''
  }
}

const removeModalPendingFile = (index: number) => {
  modalPendingFiles.value.splice(index, 1)
}

const downloadFile = (url: string) => {
  window.open(url, '_blank')
}

const openFileExternal = (url: string) => {
  window.open(url, '_blank')
}

const previewFile = (file: StoredFile) => {
  previewFileData.value = file
  showPreviewModal.value = true
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewFileData.value = null
}

const confirmDeleteFile = async (clientId: number, fileKey: string) => {
  if (!confirmModal.value) return

  const confirmed = await confirmModal.value.open({
    title: 'Eliminar Archivo',
    message: '¿Estás seguro que deseas eliminar este archivo? Esta acción no puede revertirse.',
    confirmText: 'Eliminar'
  })

  if (confirmed) {
    const result = await deleteClientFile(clientId, fileKey)
    if (result.success) {
      successMessage.value = 'Archivo eliminado exitosamente'
      // Actualizar el cliente seleccionado en el modal
      if (selectedClientForFiles.value && selectedClientForFiles.value.id === clientId) {
        selectedClientForFiles.value = result.data ?? null
      }
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    } else {
      error.value = result.message
    }
  }
}

const uploadFilesToClient = async (clientId: number) => {
  if (modalPendingFiles.value.length === 0) return

  uploadingFiles.value = true
  const result = await addClientFiles(clientId, modalPendingFiles.value)
  uploadingFiles.value = false

  if (result.success) {
    successMessage.value = 'Archivos agregados exitosamente'
    selectedClientForFiles.value = result.data ?? null
    modalPendingFiles.value = []
    if (modalFileInputRef.value) {
      modalFileInputRef.value.value = ''
    }
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } else {
    error.value = result.message
  }
}
</script>

<style scoped>
.admin-nav-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: rgba(255, 255, 255, 0.3);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  grid-column: 1 / -1;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.edit-btn {
  padding: 0.5rem 0.75rem;
  background: #ffc107;
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #ffb300;
  transform: scale(1.1);
}

.success-message {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
}

.close-success {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-success:hover {
  background: rgba(255, 255, 255, 0.3);
}

.client-details {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message p {
  color: #ef4444;
  margin: 0;
}

.close-error {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-input,
.form-select {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.2);
  color: #e2e8f0;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

.add-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.delete-btn {
  padding: 0.5rem 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 2rem 0;
}

.dashboard-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 6rem;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem;
  background: linear-gradient(90deg, #fff, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
}

.form-toggle,
.status-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #e2e8f0;
}

.form-toggle {
  grid-column: 1 / -1;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.45);
}

.form-toggle input,
.status-toggle input {
  width: 1rem;
  height: 1rem;
  accent-color: #60a5fa;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.status-active {
  background: rgba(16, 185, 129, 0.16);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.28);
}

.status-inactive {
  background: rgba(239, 68, 68, 0.14);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.28);
}

.client-row.is-inactive {
  opacity: 0.72;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.new-project-section {
  background: rgba(30, 41, 59, 0.55);
  border: 1px solid rgba(96, 165, 250, 0.18);
  padding: 2rem;
  border-radius: 18px;
  margin-bottom: 2rem;
}

.section-head h3,
.section-head h2 {
  margin: 0 0 1rem;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(90deg, #fff, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.new-project-form {
  width: 100%;
}

.company-stats-section {
  background: rgba(30, 41, 59, 0.55);
  border: 1px solid rgba(96, 165, 250, 0.18);
  padding: 2rem;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.company-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.cstat-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.cstat-card:hover {
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.1);
}

.cstat-icon {
  font-size: 2rem;
}

.cstat-content h4 {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.cstat-number {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #60a5fa;
}

.projects-panels {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.panel {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 300px;
  width: 100%;
}

.panel-header {
  background: rgba(15, 23, 42, 0.8);
  padding: 1.5rem;
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
}

.project-counter {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.projects-grid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 8px 24px rgba(96, 165, 250, 0.15);
  transform: translateY(-2px);
}

.project-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-info {
  flex: 1;
}

.project-name {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.project-focus {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.project-actions {
  display: flex;
  gap: 0.5rem;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(96, 165, 250, 0.1);
  font-size: 0.85rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #60a5fa;
}

.project-id {
  color: rgba(255, 255, 255, 0.6);
}

.empty-projects {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-projects h5 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.empty-projects p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.create-button-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
}

.create-toggle-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.create-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.create-toggle-btn:active {
  transform: translateY(0);
}

/* ==================== Estilos para Stats Compactos ==================== */
.compact-stats {
  display: flex;
  gap: 1.5rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  flex-wrap: wrap;
}

.cstat-card-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.cstat-card-mini:hover {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.4);
}

.cstat-icon-mini {
  font-size: 1.2rem;
}

.cstat-label-mini {
  font-size: 0.9rem;
  color: #e2e8f0;
  font-weight: 500;
}

/* ==================== Estilos para Tabla de Clientes ==================== */
.clients-table-wrapper {
  margin-top: 1.5rem;
  overflow-x: auto;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
}

.clients-table thead {
  background: rgba(102, 126, 234, 0.15);
  border-bottom: 2px solid rgba(102, 126, 234, 0.3);
}

.clients-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  color: #e2e8f0;
  letter-spacing: 0.5px;
}

.clients-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.clients-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.1);
}

.clients-table td {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.td-name {
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.td-company {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.td-email {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.td-amount {
  font-weight: 500;
  color: #4ade80;
}

.td-payment-day {
  font-weight: 500;
  color: #60a5fa;
  text-align: center;
}

.td-actions {
  display: flex;
  gap: 0.3rem;
}

.action-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.2rem;
  border-radius: 4px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.action-btn.edit-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.action-btn.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.action-btn.save-btn:hover {
  background: rgba(34, 197, 94, 0.2);
}

.action-btn.cancel-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.client-row.is-editing {
  background: rgba(102, 126, 234, 0.08);
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.6);
  border-radius: 4px;
  color: #e2e8f0;
  font-size: 0.95rem;
  font-family: inherit;
}

.edit-input:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 1);
  background: rgba(102, 126, 234, 0.3);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.revenue-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.revenue-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.revenue-value {
  font-size: 1.2rem;
  color: #22c55e;
  font-weight: 700;
}

/* ==================== Estilos para Notas ==================== */
.td-notes {
  font-size: 0.85rem;
  color: #94a3b8;
}

.notes-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.notes-preview {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.4;
}

.notes-empty {
  color: #64748b;
}

.notes-expand-btn {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #60a5fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notes-expand-btn:hover {
  background: rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.6);
  transform: scale(1.05);
}

/* ==================== Modal Styles ==================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.notes-modal {
  max-width: 700px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #e2e8f0;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.modal-body {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.notes-full-text {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.modal-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.edit-textarea {
  resize: vertical;
  min-height: 80px;
}

.edit-notes-textarea {
  width: 100%;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.95rem;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  min-height: 150px;
  transition: all 0.3s ease;
}

.edit-notes-textarea:focus {
  outline: none;
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.edit-notes-textarea::placeholder {
  color: #94a3b8;
}

.notes-edit-btn {
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #a5b4fc;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.notes-edit-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
  color: #c7d2fe;
}

.modal-btn-secondary {
  background: rgba(100, 116, 139, 0.3);
  color: #cbd5e1;
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.modal-btn-secondary:hover {
  background: rgba(100, 116, 139, 0.5);
  transform: translateY(-1px);
}

/* Estilos de archivos */
.form-files-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-files-label {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.form-files-input {
  display: none;
}

.form-files-btn {
  padding: 0.6rem 1rem;
  background: rgba(102, 126, 234, 0.15);
  border: 1px dashed rgba(102, 126, 234, 0.5);
  color: #a5b4fc;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.form-files-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.7);
  color: #c7d2fe;
}

.pending-files-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.pending-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(96, 165, 250, 0.15);
  border-radius: 6px;
}

.pending-file-name {
  color: #cbd5e1;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.pending-file-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.25rem;
  transition: transform 0.2s;
}

.pending-file-remove:hover {
  transform: scale(1.2);
}

.files-btn {
  padding: 0.5rem 0.75rem;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #a5b4fc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.files-btn:hover {
  background: rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
  transform: scale(1.1);
}

.action-btn.files-btn {
  padding: 0.2rem;
  font-size: 1rem;
}

.action-btn.files-btn.has-files {
  background: rgba(16, 185, 129, 0.25);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: #34d399;
  text-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
}

.action-btn.files-btn.has-files:hover {
  background: rgba(16, 185, 129, 0.4);
  border-color: rgba(16, 185, 129, 0.7);
  transform: scale(1.1);
}

.files-modal {
  max-width: 550px;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(96, 165, 250, 0.15);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.file-item:hover {
  border-color: rgba(96, 165, 250, 0.3);
}

.file-icon {
  font-size: 1.5rem;
}

.file-name {
  color: #e2e8f0;
  font-size: 0.9rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-actions {
  display: flex;
  gap: 0.4rem;
}

.file-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.file-action-btn.download-btn:hover {
  background: rgba(16, 185, 129, 0.2);
}

.file-action-btn.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.no-files-message {
  text-align: center;
  padding: 1.5rem;
  color: #94a3b8;
}

.no-files-message p {
  margin: 0;
}

.add-files-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(96, 165, 250, 0.15);
}

/* Botones de acción de archivos */
.file-action-btn.preview-btn:hover {
  background: rgba(96, 165, 250, 0.2);
}

.file-action-btn.open-btn:hover {
  background: rgba(16, 185, 129, 0.2);
}

/* Modal de preview */
.preview-modal {
  max-width: 85vw;
  max-height: 90vh;
}

.preview-body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  max-height: 65vh;
  overflow: auto;
}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
}

.preview-pdf {
  width: 100%;
  height: 60vh;
  border-radius: 8px;
}

.preview-not-supported {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.preview-not-supported p {
  margin-bottom: 1rem;
  font-size: 1rem;
}
</style>
