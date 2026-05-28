<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <!-- Header con navegación -->
      <div class="dashboard-header">
        <h1>Gestión de Cotizaciones</h1>
        <div class="admin-nav-buttons">
          <RouterLink to="/admin/clientes" class="nav-btn">Clientes</RouterLink>
          <RouterLink to="/admin/cotizaciones" class="nav-btn active">Cotizaciones</RouterLink>
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
            {{ showForm ? '✖️ Cancelar' : '➕ Crear Cotización' }}
          </button>
        </div>

        <!-- Formulario para Nueva Cotización (Colapsable) -->
        <div v-show="showForm" class="new-project-section">
          <div class="section-head">
            <h3>{{ editingQuotation ? '✏️ Editar Cotización' : '➕ Crear Nueva Cotización' }}</h3>
          </div>
          <form @submit.prevent="saveQuotation" class="new-project-form">
            <div class="form-grid">
              <select v-model="quotationForm.clientId" class="form-select" required>
                <option :value="0">Seleccionar cliente</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }} - {{ client.companyName }}
                </option>
              </select>
              <select v-model="quotationForm.billingType" class="form-select" required>
                <option value="">Tipo de facturación</option>
                <option v-for="(label, type) in billingTypeLabels" :key="type" :value="type">
                  {{ label }}
                </option>
              </select>
              <select v-model="quotationForm.currency" class="form-select" required>
                <option v-for="(label, code) in currencyLabels" :key="code" :value="code">
                  {{ label }}
                </option>
              </select>
            </div>

            <!-- Servicios de la cotización -->
            <div class="items-section">
              <h4>📝 Servicios de la Cotización</h4>
              <div v-for="(service, index) in quotationForm.services" :key="index" class="item-row">
                <input
                  v-model="service.serviceName"
                  type="text"
                  placeholder="Nombre del servicio"
                  required
                  class="form-input"
                />
                <input
                  v-model="service.description"
                  type="text"
                  placeholder="Descripción"
                  class="form-input"
                />
                <input
                  :value="formatAmountInput(service.amount)"
                  @input="updateServiceAmount(service, $event)"
                  type="text"
                  inputmode="numeric"
                  placeholder="Monto"
                  min="0"
                  required
                  class="form-input"
                />
                <button
                  v-if="quotationForm.services.length > 1"
                  @click="removeService(index)"
                  type="button"
                  class="remove-item-btn"
                  title="Eliminar servicio"
                >
                  🗑️
                </button>
              </div>
              <button @click="addService" type="button" class="add-item-btn">
                ➕ Agregar Servicio
              </button>
            </div>

            <div class="form-actions">
              <button type="submit" class="add-btn">
                {{ editingQuotation ? 'Actualizar Cotización' : 'Crear Cotización' }}
              </button>
              <button v-if="editingQuotation" @click="cancelEdit" type="button" class="cancel-btn">
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Cotizaciones -->
        <div class="projects-panels">
            <div class="panel projects-professional main-projects">
              <div class="panel-header">
                <h4>📋 Lista de Cotizaciones</h4>
                <div class="project-counter">{{ quotations.length }} cotizaciones</div>
              </div>

              <div v-if="loading" class="loading-state">
                <p>Cargando cotizaciones...</p>
              </div>

              <div v-else class="quotations-table-wrapper">
                <table v-if="quotations.length > 0" class="quotations-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Servicios</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="quotation in quotations" :key="quotation.id" class="quotation-row" :class="{ 'is-editing': inlineEditingId === quotation.id }">
                      <td class="td-id">#{{ quotation.id }}</td>
                      <td class="td-client">
                        <template v-if="inlineEditingId === quotation.id && inlineEditingData">
                          <div class="client-search-container">
                            <input
                              v-model="clientSearchQuery"
                              type="text"
                              class="edit-input search-input"
                              placeholder="Buscar cliente..."
                              @focus="showClientDropdown = true"
                              @blur="hideClientDropdown"
                              @input="updateClientSearch(clientSearchQuery)"
                            />
                            <div v-if="showClientDropdown && clientSearchResults.length > 0" class="dropdown-menu">
                              <div
                                v-for="client in clientSearchResults"
                                :key="client.id"
                                class="dropdown-item"
                                @click="selectClient(client)"
                              >
                                {{ client.name }}
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          {{ quotation.clientName || 'N/A' }}
                        </template>
                      </td>
                      <td class="td-services">
                        <template v-if="inlineEditingId === quotation.id && inlineEditingData && inlineEditingData.services">
                          <div class="services-edit-list">
                            <div v-for="(service, idx) in inlineEditingData.services" :key="idx" class="service-edit-row">
                              <input
                                v-model="service.serviceName"
                                type="text"
                                placeholder="Nombre"
                                class="service-input service-name-input"
                              />
                              <input
                                v-model="service.description"
                                type="text"
                                placeholder="Descripción"
                                class="service-input service-desc-input"
                              />
                              <input
                                :value="formatAmountInput(service.amount)"
                                @input="updateInlineServiceAmount(service, $event)"
                                type="text"
                                inputmode="numeric"
                                placeholder="Monto"
                                min="0"
                                class="service-input service-amount-input"
                              />
                              <input
                                v-model="service.billingType"
                                type="text"
                                placeholder="Facturación"
                                class="service-input service-billing-input"
                                title="Tipo de facturación (ej: monthly, annual, onetime)"
                              />
                              <button
                                v-if="inlineEditingData && inlineEditingData.services && inlineEditingData.services.length > 1"
                                @click="removeServiceFromEdit(idx)"
                                type="button"
                                class="remove-service-btn"
                                title="Eliminar servicio"
                              >
                                ✕
                              </button>
                            </div>
                            <button
                              @click="addServiceToEdit"
                              type="button"
                              class="add-service-btn"
                            >
                              ➕ Servicio
                            </button>
                          </div>
                        </template>
                        <template v-else>
                          <div class="services-list">
                            <div v-for="(service, idx) in quotation.services" :key="idx" class="service-item">
                              <span class="service-name">{{ service.name || service.serviceName || 'Sin nombre' }}</span>
                              <span class="service-value">{{ formatCurrencyAmount(service.value || service.amount || 0, quotation.currency || quotationForm.currency) }}</span>
                              <span v-if="service.billingType" class="service-billing">{{ service.billingType }}</span>
                            </div>
                          </div>
                        </template>
                      </td>
                      <td class="td-total"><strong>{{ formatCurrencyAmount(getServiceTotal(inlineEditingId === quotation.id && inlineEditingData ? inlineEditingData : quotation), quotation.currency || quotationForm.currency) }}</strong></td>
                      <td class="td-actions">
                        <template v-if="inlineEditingId === quotation.id">
                          <button @click="saveInlineEditBatch(quotation.id)" class="action-btn save-btn" title="Guardar">✅</button>
                          <button @click="cancelInlineEdit" class="action-btn cancel-btn" title="Cancelar">❌</button>
                        </template>
                        <template v-else>
                          <button @click="generatePdf(quotation)" class="action-btn pdf-btn" title="Descargar PDF">📄</button>
                          <button @click="startInlineEdit(quotation)" class="action-btn edit-btn" title="Editar">✏️</button>
                          <button @click="confirmDelete(quotation)" class="action-btn delete-btn" title="Eliminar">🗑️</button>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Mensaje cuando no hay cotizaciones -->
                <div v-else class="empty-projects">
                  <div class="empty-icon">📁</div>
                  <h5>No hay cotizaciones registradas</h5>
                  <p>Utiliza el formulario de arriba para crear tu primera cotización</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal ref="confirmModal" />

    <!-- PDF Preview Modal -->
    <QuotationPdfPreviewModal ref="pdfPreviewModal" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotations } from '@/composables/useQuotations'
import { useClients } from '@/composables/useClients'
import ConfirmModal from '@/components/ConfirmModal.vue'
import QuotationPdfPreviewModal from '@/components/QuotationPdfPreviewModal.vue'
import type { Quote, BillingType, QuoteService } from '@/types/QuotationType'
import { BILLING_TYPE_LABELS, CURRENCY_LABELS, CURRENCY_SYMBOLS, type CurrencyCode } from '@/types/QuotationType'
import { authService } from '@/services/api/authService'

const router = useRouter()
const { quotations, loading, loadQuotations, createQuotation, updateQuotation, deleteQuotation } = useQuotations()
const { clients, loadClients } = useClients()

const confirmModal = ref<InstanceType<typeof ConfirmModal>>()
const pdfPreviewModal = ref<InstanceType<typeof QuotationPdfPreviewModal>>()

const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const editingQuotation = ref<Quote | null>(null)
const inlineEditingId = ref<number | null>(null)
const inlineEditingData = ref<{
  clientName: string
  clientId: number
  currency: CurrencyCode
  services: Array<{ serviceName: string; description: string; amount: number; billingType?: string }>
} | null>(null)
const billingTypeLabels = BILLING_TYPE_LABELS
const currencyLabels = CURRENCY_LABELS
const showForm = ref(false)

// Client search
const clientSearchQuery = ref('')
const showClientDropdown = ref(false)

const quotationForm = ref({
  clientId: 0,
  billingType: 'monthly' as BillingType,
  currency: 'COP' as CurrencyCode,
  services: [
    { serviceName: '', description: '', amount: 0 }
  ],
})

// Verificar autenticación
onMounted(async () => {
  if (!authService.isAuthenticated() || authService.getUserRole() !== 'admin') {
    router.push('/')
    return
  }

  // Cargar cotizaciones y clientes
  await Promise.all([
    loadQuotations(),
    loadClients()
  ])
})

// Computed para filtrar clientes en búsqueda
const clientSearchResults = ref<typeof clients.value>([])

// Watcher para actualizar resultados de búsqueda
const updateClientSearch = (query: string) => {
  if (!query || query.trim() === '') {
    clientSearchResults.value = clients.value
  } else {
    clientSearchResults.value = clients.value.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(query.toLowerCase()))
    )
  }
}

const hideClientDropdown = () => {
  // Delay para permitir click en el dropdown antes de cerrarlo
  setTimeout(() => {
    showClientDropdown.value = false
  }, 200)
}

// Método para seleccionar cliente del dropdown
const selectClient = (client: typeof clients.value[0]) => {
  if (inlineEditingData.value) {
    inlineEditingData.value.clientName = client.name
    inlineEditingData.value.clientId = client.id
    clientSearchQuery.value = client.name
    showClientDropdown.value = false
  }
}

// Métodos
const toggleFormVisibility = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    resetForm()
  }
}

const addService = () => {
  quotationForm.value.services.push({
    serviceName: '',
    description: '',
    amount: 0
  })
}

const removeService = (index: number) => {
  quotationForm.value.services.splice(index, 1)
}

const saveQuotation = async () => {
  try {
    if (editingQuotation.value) {
      // Actualizar cotización existente
      const result = await updateQuotation(editingQuotation.value.id, quotationForm.value)
      if (result.success) {
        successMessage.value = 'Cotización actualizada exitosamente'
        resetForm()
      } else {
        error.value = result.message
      }
    } else {
      // Crear nueva cotización
      const result = await createQuotation(quotationForm.value)
      if (result.success) {
        successMessage.value = 'Cotización creada exitosamente'
        resetForm()
      } else {
        error.value = result.message
      }
    }

    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al guardar cotización'
  }
}

const cancelEdit = () => {
  editingQuotation.value = null
  resetForm()
}

const confirmDelete = async (quotation: Quote) => {
  if (!confirmModal.value) return

  const confirmed = await confirmModal.value.open({
    title: 'Eliminar Cotización',
    message: `¿Estás seguro de que deseas eliminar la cotización #${quotation.id}? Esta acción no puede revertirse.`,
    confirmText: 'Eliminar'
  })

  if (confirmed) {
    const result = await deleteQuotation(quotation.id)
    if (result.success) {
      successMessage.value = 'Cotización eliminada exitosamente'
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    } else {
      error.value = result.message
    }
  }
}

const resetForm = () => {
  quotationForm.value = {
    clientId: 0,
    billingType: 'monthly' as BillingType,
    currency: 'COP' as CurrencyCode,
    services: [
      { serviceName: '', description: '', amount: 0 }
    ],
  }
  editingQuotation.value = null
}

const cancelInlineEdit = () => {
  inlineEditingId.value = null
  inlineEditingData.value = null
}

const startInlineEdit = (quotation: Quote) => {
  inlineEditingId.value = quotation.id
  // Deep copy the quotation data to temp state
  inlineEditingData.value = {
    clientName: quotation.clientName || '',
    clientId: quotation.clientId,
    currency: (quotation.currency || 'COP') as CurrencyCode,
    services: quotation.services?.map(s => ({
      serviceName: s.serviceName || s.name || '',
      description: s.description || '',
      amount: s.amount || s.value || 0,
      billingType: s.billingType || ''
    })) || []
  }
  // Initialize client search
  clientSearchQuery.value = quotation.clientName || ''
  clientSearchResults.value = clients.value
}

const addServiceToEdit = () => {
  if (!inlineEditingData.value) return
  inlineEditingData.value.services = inlineEditingData.value.services || []
  inlineEditingData.value.services.push({
    serviceName: '',
    description: '',
    amount: 0,
    billingType: ''
  })
}

const removeServiceFromEdit = (index: number) => {
  if (!inlineEditingData.value?.services) return
  inlineEditingData.value.services.splice(index, 1)
}

const saveInlineEditBatch = async (quoteId: number) => {
  if (!inlineEditingData.value) return

  try {
    const updateData = {
      clientName: inlineEditingData.value.clientName,
      clientId: inlineEditingData.value.clientId,
      currency: inlineEditingData.value.currency,
      services: inlineEditingData.value.services || []
    }

    const result = await updateQuotation(quoteId, updateData)
    if (result.success) {
      // Update local quotation data
      const index = quotations.value.findIndex(q => q.id === quoteId)
      if (index !== -1) {
        quotations.value[index].clientName = inlineEditingData.value.clientName
        quotations.value[index].clientId = inlineEditingData.value.clientId
        quotations.value[index].currency = inlineEditingData.value.currency
        quotations.value[index].services = inlineEditingData.value.services.map((s: { serviceName: string; description: string; amount: number; billingType?: string }) => ({
          serviceName: s.serviceName,
          description: s.description,
          amount: s.amount,
          billingType: s.billingType
        })) as QuoteService[]
      }

      successMessage.value = 'Cotización actualizada exitosamente'
      setTimeout(() => {
        successMessage.value = null
      }, 2000)

      // Success - exit edit mode
      inlineEditingId.value = null
      inlineEditingData.value = null
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al actualizar'
  }
}

const getServiceTotal = (quote: Quote | { clientName?: string; clientId?: number; billingType?: string; currency?: CurrencyCode; services: Array<{ serviceName: string; description: string; amount: number }> }) => {
  // Si la API proporciona totalAmount, úsalo
  if ('totalAmount' in quote && quote.totalAmount) {
    return typeof quote.totalAmount === 'string' ? parseFloat(quote.totalAmount) : quote.totalAmount
  }
  // Si no, calcula sumando amount o value
  return quote.services.reduce((sum, svc) => {
    const valor = ('amount' in svc ? svc.amount : ('value' in (svc as Record<string, unknown>) ? (svc as Record<string, unknown>).value : 0)) || 0
    return sum + (typeof valor === 'string' ? parseFloat(valor as string) : (valor as number))
  }, 0)
}

const formatAmountInput = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return ''
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(/,/g, '.')) : value
  if (Number.isNaN(numericValue)) return ''
  return Math.trunc(numericValue).toLocaleString('es-CO')
}

const parseAmountInput = (value: string): number => {
  const numericValue = value.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.-]/g, '')
  const parsed = Number(numericValue)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0
}

const updateServiceAmount = (service: { amount: number }, event: Event) => {
  const target = event.target as HTMLInputElement
  service.amount = parseAmountInput(target.value)
  target.value = formatAmountInput(service.amount)
}

const updateInlineServiceAmount = (service: { amount: number }, event: Event) => {
  const target = event.target as HTMLInputElement
  service.amount = parseAmountInput(target.value)
  target.value = formatAmountInput(service.amount)
}

const formatCurrencyAmount = (value: number | string | undefined, currency: CurrencyCode = 'COP'): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : (value || 0)
  const symbol = CURRENCY_SYMBOLS[currency] || '$'
  const formattedNumber = Math.trunc(Number.isFinite(numericValue) ? numericValue : 0).toLocaleString('es-CO')
  return `${symbol} ${formattedNumber}`
}

const generatePdf = (quotation: Quote) => {
  if (!pdfPreviewModal.value) return
  pdfPreviewModal.value.open(quotation)
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

.items-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.items-section h4 {
  margin-bottom: 1rem;
  color: #fff;
}

.item-row {
  display: grid;
  grid-template-columns: minmax(220px, 1.25fr) minmax(340px, 2.2fr) minmax(130px, 0.7fr) auto;
  gap: 1rem;
  margin-bottom: 0.75rem;
  align-items: center;
}

.form-input.small {
  width: 100%;
}

.add-item-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-item-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.remove-item-btn {
  padding: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.remove-item-btn:hover {
  background: #c82333;
}

.totals-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.total-row {
  display: grid;
  grid-template-columns: 200px 200px;
  gap: 1rem;
  margin-bottom: 0.75rem;
  align-items: center;
}

.total-row label {
  font-weight: 600;
  color: #fff;
}

.total-row.final-total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.total-row.final-total label {
  font-size: 1.2rem;
  color: #4CAF50;
}

.total-row.final-total input {
  font-size: 1.2rem;
  font-weight: bold;
  background: rgba(76, 175, 80, 0.2);
}

.notes-section {
  margin-top: 2rem;
}

.notes-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #fff;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
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
}

.panel-header {
  background: rgba(15, 23, 42, 0.8);
  padding: 1.35rem 1.5rem;
  border-bottom: 1px solid rgba(96, 165, 250, 0.16);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: 0.2px;
}

.project-counter {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.14), rgba(102, 126, 234, 0.08));
  color: #bfdbfe;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(96, 165, 250, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
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

@media (max-width: 768px) {
  .item-row {
    grid-template-columns: 1fr;
  }

  .total-row {
    grid-template-columns: 1fr;
  }
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

/* ==================== Estilos para Tabla de Cotizaciones ==================== */
.quotations-table-wrapper {
  margin-top: 1.5rem;
  padding: 0.9rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(96, 165, 250, 0.12);
  border-radius: 16px;
  box-shadow: 0 16px 30px rgba(2, 6, 23, 0.18);
}

.quotations-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(15, 23, 42, 0.48);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.quotations-table thead {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.18), rgba(118, 75, 162, 0.12));
  border-bottom: 1px solid rgba(102, 126, 234, 0.28);
}

.quotations-table th {
  padding: 0.95rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  color: #e2e8f0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.quotations-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.quotations-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), inset 0 -1px 0 rgba(102, 126, 234, 0.12);
}

.quotations-table td {
  padding: 1rem;
  font-size: 0.92rem;
  color: #cbd5e1;
  vertical-align: top;
}

.td-id {
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
}

.td-total {
  font-weight: 500;
  color: #4ade80;
  white-space: nowrap;
}

.td-client {
  font-weight: 500;
  color: #e2e8f0;
  max-width: 220px;
}

.td-billing {
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  width: fit-content;
}

.td-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  white-space: nowrap;
}

.action-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.25rem;
  border-radius: 4px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.action-btn.edit-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.action-btn.pdf-btn:hover {
  background: rgba(220, 38, 38, 0.2);
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

.quotation-row.is-editing {
  background: rgba(102, 126, 234, 0.12);
}

.client-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.service-item {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(120px, auto) auto;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.9rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid rgba(102, 126, 234, 0.16);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.035), rgba(102, 126, 234, 0.04));
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.12);
}

.service-item:last-child {
  border-bottom: none;
}

.service-name {
  color: #cbd5e1;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  line-height: 1.35;
}

.service-value {
  color: #22c55e;
  font-weight: 600;
  white-space: nowrap;
  text-align: right;
}

.service-billing {
  font-size: 0.75rem;
  color: #a5b4fc;
  background: rgba(102, 126, 234, 0.2);
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  white-space: nowrap;
}

.client-select {
  width: 100%;
  padding: 0.5rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 4px;
  color: #cbd5e1;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.client-select:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.5);
}

.client-select:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.8);
  background: rgba(102, 126, 234, 0.15);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.client-search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(102, 126, 234, 0.6);
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dropdown-item {
  padding: 0.5rem 0.75rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.dropdown-item:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #e2e8f0;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.edit-select {
  width: 100%;
  padding: 0.5rem;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.6);
  border-radius: 4px;
  color: #e2e8f0;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
}

.edit-select:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 1);
  background: rgba(102, 126, 234, 0.3);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.services-edit-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.service-edit-row {
  display: grid;
  grid-template-columns: minmax(160px, 1.1fr) minmax(260px, 2.1fr) minmax(120px, 0.75fr) minmax(150px, 0.95fr) auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(15, 23, 42, 0.16));
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
}

.service-input {
  padding: 0.55rem 0.7rem;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 0.85rem;
  font-family: inherit;
}

.service-input:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.8);
  background: rgba(102, 126, 234, 0.2);
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.service-name-input {
  min-width: 0;
}

.service-desc-input {
  min-width: 0;
  width: 100%;
}

.service-amount-input {
  min-width: 0;
  width: 100%;
  text-align: right;
}

.service-billing-input {
  min-width: 0;
  font-size: 0.75rem !important;
}

@media (max-width: 1024px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .quotations-table-wrapper {
    padding: 0.65rem;
  }

  .quotations-table {
    display: block;
    overflow-x: auto;
  }

  .td-client {
    max-width: 180px;
  }
}

@media (max-width: 768px) {
  .service-edit-row {
    grid-template-columns: 1fr;
  }

  .service-item {
    grid-template-columns: 1fr;
  }

  .quotations-table th,
  .quotations-table td {
    padding: 0.75rem 0.8rem;
  }

  .td-client {
    max-width: none;
  }
}

.remove-service-btn {
  padding: 0.3rem 0.5rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.remove-service-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.6);
}

.add-service-btn {
  padding: 0.5rem 1rem;
  background: rgba(34, 197, 94, 0.15);
  border: 1px dashed rgba(34, 197, 94, 0.5);
  color: #22c55e;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.add-service-btn:hover {
  background: rgba(34, 197, 94, 0.25);
  border-style: solid;
}

</style>
