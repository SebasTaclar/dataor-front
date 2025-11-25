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
              <input
                v-model="clientForm.name"
                type="text"
                placeholder="Nombre del contacto"
                required
                class="form-input"
              />
              <input
                v-model="clientForm.companyName"
                type="text"
                placeholder="Nombre de la empresa"
                required
                class="form-input"
              />
              <input
                v-model="clientForm.email"
                type="email"
                placeholder="Email"
                required
                class="form-input"
              />
              <input
                v-model="clientForm.phone"
                type="tel"
                placeholder="Teléfono"
                required
                class="form-input"
              />
              <input
                v-model="clientForm.country"
                type="text"
                placeholder="País"
                required
                class="form-input"
              />
              <input
                v-model="clientForm.monthlyAmount"
                type="number"
                step="0.01"
                placeholder="Monto mensual"
                class="form-input"
              />
              <input
                v-model="clientForm.paymentDayMonth"
                type="number"
                min="1"
                max="31"
                placeholder="Día de pago del mes (1-31)"
                class="form-input"
              />
              <textarea
                v-model="clientForm.notes"
                placeholder="Notas"
                class="form-input"
                rows="3"
                style="grid-column: 1 / -1;"
              ></textarea>
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
                  <strong class="revenue-value">${{ calculateMonthlyRevenue().toLocaleString('es-CO', { minimumFractionDigits: 0 }) }}</strong>
                </div>
              </div>

              <div v-if="loading" class="loading-state">
                <p>Cargando clientes...</p>
              </div>

              <div v-else class="clients-table-wrapper">
                <table v-if="clients.length > 0" class="clients-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Empresa</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>País</th>
                      <th>Monto Mensual</th>
                      <th>Día de Pago</th>
                      <th>Notas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="client in clients" :key="client.id" class="client-row" :class="{ 'is-editing': inlineEditingId === client.id }">
                      <td class="td-name">
                        <template v-if="inlineEditingId === client.id">
                          <input v-model="inlineEditingData!.name" type="text" class="edit-input" />
                        </template>
                        <template v-else>
                          {{ client.name }}
                        </template>
                      </td>
                      <td>
                        <template v-if="inlineEditingId === client.id">
                          <input v-model="inlineEditingData!.companyName" type="text" class="edit-input" />
                        </template>
                        <template v-else>
                          {{ client.companyName }}
                        </template>
                      </td>
                      <td>
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
                      <td class="td-amount">
                        <template v-if="inlineEditingId === client.id">
                          <input v-model.number="inlineEditingData!.monthlyAmount" type="number" step="0.01" class="edit-input" />
                        </template>
                        <template v-else>
                          {{ client.monthlyAmount ? `$${client.monthlyAmount.toLocaleString('es-CO')}` : '-' }}
                        </template>
                      </td>
                      <td class="td-payment-day">
                        <template v-if="inlineEditingId === client.id">
                          <input v-model.number="inlineEditingData!.paymentDayMonth" type="number" min="1" max="31" class="edit-input" />
                        </template>
                        <template v-else>
                          {{ client.paymentDayMonth ? `Día ${client.paymentDayMonth}` : '-' }}
                        </template>
                      </td>
                      <td class="td-notes">
                        <template v-if="inlineEditingId === client.id">
                          <input v-model="inlineEditingData!.notes" type="text" class="edit-input" />
                        </template>
                        <template v-else>
                          {{ client.notes || '-' }}
                        </template>
                      </td>
                      <td class="td-actions">
                        <template v-if="inlineEditingId === client.id">
                          <button @click="saveInlineEditBatch(client.id)" class="action-btn save-btn" title="Guardar">✅</button>
                          <button @click="cancelInlineEdit" class="action-btn cancel-btn" title="Cancelar">❌</button>
                        </template>
                        <template v-else>
                          <button @click="startInlineEdit(client)" class="action-btn edit-btn" title="Editar inline">✏️</button>
                          <button @click="confirmDelete(client)" class="action-btn delete-btn" title="Eliminar">🗑️</button>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClients } from '@/composables/useClients'
import type { Client } from '@/types/ClientType'
import { authService } from '@/services/api/authService'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const { clients, loading, loadClients, createClient, updateClient, deleteClient } = useClients()

const confirmModal = ref<InstanceType<typeof ConfirmModal>>()

const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const editingClient = ref<Client | null>(null)
const inlineEditingId = ref<number | null>(null)
const inlineEditingData = ref<Partial<Client> | null>(null)
const showForm = ref(false)

const clientForm = ref({
  name: '',
  companyName: '',
  email: '',
  phone: '',
  country: '',
  monthlyAmount: undefined as number | undefined,
  paymentDayMonth: undefined as number | undefined,
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
      // Actualizar cliente existente
      const result = await updateClient(editingClient.value.id, clientForm.value)
      if (result.success) {
        successMessage.value = 'Cliente actualizado exitosamente'
        resetForm()
      } else {
        error.value = result.message
      }
    } else {
      // Crear nuevo cliente
      const result = await createClient(clientForm.value)
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
    notes: '',
  }
  editingClient.value = null
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
    return total + (Number(client.monthlyAmount) || 0)
  }, 0)
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
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.td-notes {
  font-size: 0.85rem;
  color: #94a3b8;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.td-actions {
  display: flex;
  gap: 0.5rem;
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

</style>
