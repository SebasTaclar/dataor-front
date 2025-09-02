<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <!-- Header -->
      <!-- Header -->
      <div class="dashboard-header">
        <h1>Panel de Administración</h1>

      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="error = null" class="close-error">×</button>
      </div>



      <!-- Dashboard Content -->
      <div v-else class="dashboard-content">
        <!-- Company Static Stats (Hardcoded) -->
        <div class="company-stats-section">
          <div class="section-head">
            <h2>📈 Visión General Empresa (Estático)</h2>
            <p>Datos de ejemplo para proyectos y equipo (placeholder)</p>
          </div>
          <div class="company-stats-grid">
            <div class="cstat-card total-projects">
              <div class="cstat-icon">🗂️</div>
              <div class="cstat-content">
                <h4>Proyectos Totales</h4>
                <p class="cstat-number">{{ companyStats.totalProjects }}</p>
                <small>{{ companyStats.completedProjects }} completados</small>
              </div>
            </div>
            <div class="cstat-card employees">
              <div class="cstat-icon">👥</div>
              <div class="cstat-content">
                <h4>Empleados</h4>
                <p class="cstat-number">{{ companyStats.employees }}</p>
                <small>{{ companyStats.hiringOpenings }} vacantes abiertas</small>
              </div>
            </div>
            <div class="cstat-card in-progress">
              <div class="cstat-icon">⚙️</div>
              <div class="cstat-content">
                <h4>En Progreso</h4>
                <p class="cstat-number">{{ companyStats.inProgress }}</p>
                <small>{{ companyStats.thisQuarterDeliveries }} entregas este trimestre</small>
              </div>
            </div>
            <div class="cstat-card future">
              <div class="cstat-icon">🚀</div>
              <div class="cstat-content">
                <h4>Proyectos Futuros</h4>
                <p class="cstat-number">{{ companyStats.future }}</p>
                <small>{{ companyStats.discoveryStage }} en discovery</small>
              </div>
            </div>
          </div>

          <div class="projects-panels">
            <div class="panel mini-chart">
              <h4>Tendencia de Proyectos (Mock)</h4>
              <div class="sparkline">
                <div v-for="(v,i) in mockTrend" :key="i" class="bar" :style="{ height: v + '%'}"></div>
              </div>
              <ul class="legend">
                <li><span class="dot completed"></span>Completados</li>
                <li><span class="dot inprogress"></span>En Progreso</li>
                <li><span class="dot future"></span>Futuros</li>
              </ul>
            </div>
            <div class="panel projects-table-panel">
              <h4>Proyectos (Top 6 Demo)</h4>
              <table class="projects-table">
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Estado</th>
                    <th>Responsable</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in projectListComputed" :key="p.id">
                    <td class="p-name">{{ p.name }}</td>
                    <td><span :class="'p-badge status-' + p.status">{{ p.statusLabel }}</span></td>
                    <td class="p-owner">{{ p.owner }}</td>
                    <td class="p-eta">{{ p.eta }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="panel focus-panel">
              <h4>Enfoque Actual</h4>
              <ul class="focus-list">
                <li v-for="f in focusItems" :key="f.label">
                  <span class="fi-label">{{ f.label }}</span>
                  <span class="fi-badge" :class="'prio-' + f.prio">{{ f.prio.toUpperCase() }}</span>
                </li>
              </ul>
              <p class="note">Estos datos son demostrativos y no representan métricas reales.</p>
            </div>
          </div>
        </div>








        </div>




      </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminPurchases } from '@/composables/useAdminPurchases'
import { useNumbersAvailability } from '@/composables/useNumbersAvailability'
import { authService } from '@/services/api/authService'
import { useRouter } from 'vue-router'

const router = useRouter()

// Verificar permisos de administrador
if (!authService.isAdmin()) {
  router.push('/')
}

// Admin purchases composable
const {
  isLoading: isLoadingPurchases,
  error,
  purchases,
  purchasesByStatus,
  stats,
  getAllPurchases
} = useAdminPurchases()

// Numbers availability composable
const {
  refreshTakenNumbers,
} = useNumbersAvailability()

// Estado local
const selectedStatus = ref<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('ALL')
const isRefreshingWallpapers = ref(false)

// Winner game state
const isGameStarted = ref(false)
const currentAttempt = ref(0)
const attempts = ref<(number | null)[]>([null, null, null, null, null])
const winnerNumber = ref<number | null>(null)
const isGameComplete = ref(false)
const isGameRunning = ref(false)
const isProcessingAttempt = ref(false)
const isShowingSpinEffect = ref(false)
const spinningNumbers = ref<(number | null)[]>([null, null, null, null, null])

// ================== MOCK COMPANY DASHBOARD (Hardcoded) ==================
const companyStats = ref({
  totalProjects: 32,
  completedProjects: 18,
  employees: 14,
  hiringOpenings: 3,
  inProgress: 9,
  thisQuarterDeliveries: 5,
  future: 12,
  discoveryStage: 4
})

interface ProjectRow { id:number; name:string; status:'completed'|'inprogress'|'paused'|'future'; owner:string; eta:string }
const projectList = ref<ProjectRow[]>([
  { id:1, name:'Plataforma Data Lake', status:'inprogress', owner:'María', eta:'Oct 2025' },
  { id:2, name:'API Facturación v2', status:'completed', owner:'Carlos', eta:'Ago 2025' },
  { id:3, name:'Módulo IA Recomendador', status:'inprogress', owner:'Lucía', eta:'Nov 2025' },
  { id:4, name:'Portal Clientes NextGen', status:'future', owner:'(Asignar)', eta:'Q1 2026' },
  { id:5, name:'Migración Monolito', status:'paused', owner:'Diego', eta:'En revisión' },
  { id:6, name:'Pipeline Streaming', status:'completed', owner:'Elena', eta:'Jul 2025' },
])
const statusLabels:Record<string,string> = { completed:'Completado', inprogress:'En Progreso', paused:'En Pausa', future:'Futuro' }
const projectListComputed = computed(()=> projectList.value.map(p=> ({ ...p, statusLabel: statusLabels[p.status] || p.status })))
// Ajustar template para usar projectListComputed si se necesitara evolución; por simplicidad usamos projectList y transformamos en render
const focusItems = ref([
  { label:'Optimizar costos cloud', prio:'alta' },
  { label:'Reducir tiempo onboarding datos', prio:'media' },
  { label:'Pipelines CI/CD analítica', prio:'alta' },
  { label:'Discovery portal clientes', prio:'media' },
  { label:'Definir KPIs producto IA', prio:'baja' },
])
const mockTrend = ref([55,68,60,74,62,80,77,83,70,88,91,86])

// Compras filtradas
const filteredPurchases = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return purchases.value
  }
  return purchasesByStatus.value[selectedStatus.value] || []
})

// Números elegibles para el sorteo (solo aprobados)
const eligibleNumbers = computed(() => {
  const approvedPurchases = purchasesByStatus.value.APPROVED || []
  const numbers: number[] = []

  approvedPurchases.forEach(purchase => {
    if (purchase.wallpaperNumbers && Array.isArray(purchase.wallpaperNumbers)) {
      numbers.push(...purchase.wallpaperNumbers)
    }
  })

  return Array.from(new Set(numbers)).sort((a, b) => a - b) // Remove duplicates and sort
})

// Encontrar la compra ganadora
const winnerPurchase = computed(() => {
  if (!winnerNumber.value) return null

  const approvedPurchases = purchasesByStatus.value.APPROVED || []
  return approvedPurchases.find(purchase =>
    purchase.wallpaperNumbers && purchase.wallpaperNumbers.includes(winnerNumber.value!)
  )
})

// Métodos
const refreshData = async () => {
  try {
    isRefreshingWallpapers.value = true

    // Refrescar compras y wallpapers en paralelo
    await Promise.all([
      getAllPurchases(),
      refreshTakenNumbers()
    ])

  } catch (error) {
    console.error('❌ Error actualizando datos:', error)
  } finally {
    isRefreshingWallpapers.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status: string) => {
  const statusMap = {
    'PENDING': 'Pendiente',
    'APPROVED': 'Aprobada',
    'REJECTED': 'Rechazada',
    'CANCELLED': 'Cancelada'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// Winner game methods
const startWinnerGame = () => {
  if (eligibleNumbers.value.length === 0) return

  // Check if we have enough numbers for a complete game (at least 5 unique numbers recommended)
  if (eligibleNumbers.value.length < 5) {
    // Still allow the game but show a warning in console
    console.warn(`⚠️ Solo hay ${eligibleNumbers.value.length} números elegibles. Se pueden repetir números en los intentos.`)
  }

  isGameStarted.value = true
  isGameRunning.value = true
  currentAttempt.value = 0
  attempts.value = [null, null, null, null, null]
  winnerNumber.value = null
  isGameComplete.value = false
  isShowingSpinEffect.value = false
  spinningNumbers.value = [null, null, null, null, null]

  // Pre-select the winner number (will be revealed on 5th attempt)
  const randomIndex = Math.floor(Math.random() * eligibleNumbers.value.length)
  winnerNumber.value = eligibleNumbers.value[randomIndex]
}

const nextAttempt = async () => {
  if (currentAttempt.value >= 5 || isProcessingAttempt.value) return

  isProcessingAttempt.value = true
  currentAttempt.value++

  // Get numbers that have already been used in previous attempts
  const usedNumbers = attempts.value.filter(num => num !== null) as number[]

  // Start spinning effect
  isShowingSpinEffect.value = true

  // Spin numbers for dramatic effect (2 seconds)
  const spinDuration = 2000
  const spinInterval = 100
  const spinTimes = spinDuration / spinInterval

  // Create a pool of available numbers for spinning effect (excluding used ones and winner)
  const availableForSpinning = eligibleNumbers.value.filter(num =>
    num !== winnerNumber.value && !usedNumbers.includes(num)
  )

  for (let i = 0; i < spinTimes; i++) {
    // If we have available unique numbers, use them; otherwise use all eligible except winner
    const spinPool = availableForSpinning.length > 0 ? availableForSpinning :
                     eligibleNumbers.value.filter(num => num !== winnerNumber.value)

    if (spinPool.length > 0) {
      const randomIndex = Math.floor(Math.random() * spinPool.length)
      spinningNumbers.value[currentAttempt.value - 1] = spinPool[randomIndex]
    }
    await new Promise(resolve => setTimeout(resolve, spinInterval))
  }

  // Stop spinning effect
  isShowingSpinEffect.value = false

  if (currentAttempt.value === 5) {
    // Reveal the winner on 5th attempt
    attempts.value[4] = winnerNumber.value
    isGameComplete.value = true
    isGameRunning.value = false
  } else {
    // Generate a random number from eligible numbers (excluding winner and previously used numbers)
    let randomNumber
    let availableNumbers = eligibleNumbers.value.filter(num =>
      num !== winnerNumber.value && !usedNumbers.includes(num)
    )

    // If we don't have enough unique numbers (excluding the winner),
    // allow previously used numbers but still exclude the winner
    if (availableNumbers.length === 0) {
      availableNumbers = eligibleNumbers.value.filter(num => num !== winnerNumber.value)
    }

    // Select a random number from available numbers
    if (availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length)
      randomNumber = availableNumbers[randomIndex]
    } else {
      // Fallback: use any eligible number except the winner
      do {
        const randomIndex = Math.floor(Math.random() * eligibleNumbers.value.length)
        randomNumber = eligibleNumbers.value[randomIndex]
      } while (randomNumber === winnerNumber.value && eligibleNumbers.value.length > 1)
    }

    attempts.value[currentAttempt.value - 1] = randomNumber
  }

  isProcessingAttempt.value = false
}

const resetGame = () => {
  isGameStarted.value = false
  currentAttempt.value = 0
  attempts.value = [null, null, null, null, null]
  winnerNumber.value = null
  isGameComplete.value = false
  isGameRunning.value = false
  isProcessingAttempt.value = false
  isShowingSpinEffect.value = false
  spinningNumbers.value = [null, null, null, null, null]
}

// Cargar datos al montar el componente
onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.admin-dashboard {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  margin-top: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.dashboard-header p {
  font-size: 1.1rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
}

.refresh-btn {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.loading-state {
  text-align: center;
  padding: 4rem 0;
  color: #cbd5e1;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(96, 165, 250, 0.3);
  border-top: 4px solid #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 1.2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  min-height: auto;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 8px 25px rgba(96, 165, 250, 0.2);
}

.stat-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

.stat-card.revenue .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-card.wallpapers .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-card.pending .stat-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.stat-content h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.3rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
}

/* Winner Selection Styles */
.winner-selection-section {
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.winner-header {
  text-align: center;
  margin-bottom: 2rem;
}

.winner-header h3 {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.winner-header p {
  color: #cbd5e1;
  font-size: 1rem;
}

.winner-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  gap: 2rem;
}

.eligible-numbers,
.total-revenue {
  text-align: center;
  background: rgba(15, 23, 42, 0.4);
  padding: 1rem;
  border-radius: 12px;
  flex: 1;
}

.stat-label {
  display: block;
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: #60a5fa;
  font-size: 1.5rem;
  font-weight: 700;
}

.winner-game-container {
  text-align: center;
}

.game-start {
  padding: 2rem;
}

.start-game-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.start-game-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

.start-game-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
  transform: none;
}

.game-hint {
  color: #94a3b8;
  font-style: italic;
}

.warning-text {
  color: #f59e0b;
  font-weight: 600;
}

.success-text {
  color: #10b981;
  font-weight: 600;
}

.game-active {
  padding: 2rem;
}

.attempts-container h4 {
  color: #ffffff;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.attempts-display {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.attempt-number {
  width: 80px;
  height: 80px;
  background: rgba(15, 23, 42, 0.6);
  border: 2px solid #475569;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.attempt-number.current {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  animation: pulse 2s infinite;
}

.attempt-number.revealed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.2);
  color: #ffffff;
}

.attempt-number.spinning {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.2);
  color: #ffffff;
  animation: spin-effect 0.1s linear infinite;
  transform-origin: center;
}

@keyframes spin-effect {
  0% {
    transform: rotateY(0deg) scale(1);
    background: rgba(245, 158, 11, 0.2);
  }
  25% {
    transform: rotateY(90deg) scale(1.1);
    background: rgba(239, 68, 68, 0.2);
  }
  50% {
    transform: rotateY(180deg) scale(1);
    background: rgba(139, 92, 246, 0.2);
  }
  75% {
    transform: rotateY(270deg) scale(1.1);
    background: rgba(34, 197, 94, 0.2);
  }
  100% {
    transform: rotateY(360deg) scale(1);
    background: rgba(245, 158, 11, 0.2);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.next-attempt-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-attempt-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.next-attempt-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.winner-reveal {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
  border-radius: 16px;
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.winner-announcement h2 {
  color: #10b981;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.winner-number-display {
  font-size: 4rem;
  font-weight: 900;
  color: #ffffff;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 20px;
  padding: 1rem 2rem;
  margin: 1rem 0;
  display: inline-block;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
  to { box-shadow: 0 0 30px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.6); }
}

.winner-details {
  margin-top: 2rem;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
}

.winner-details h4 {
  color: #60a5fa;
  margin-bottom: 1rem;
}

.winner-details p {
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.reset-game-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.reset-game-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.filter-section {
  margin-bottom: 3rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-section h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.refresh-btn {
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #047857, #065f46);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.refresh-btn span {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.status-filters {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.8rem 1.2rem;
  border: 2px solid rgba(96, 165, 250, 0.3);
  background: rgba(51, 65, 85, 0.6);
  color: #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-btn:hover {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}

.filter-btn.active {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border-color: #60a5fa;
  color: white;
}

.filter-btn.pending.active {
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-color: #f97316;
}

.filter-btn.approved.active {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
}

.filter-btn.rejected.active {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: #ef4444;
}

.filter-btn.cancelled.active {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  border-color: #6b7280;
}

.purchases-section h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.no-purchases {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(96, 165, 250, 0.1);
}

.purchases-table-container {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.purchases-table {
  width: 100%;
  border-collapse: collapse;
}

.purchases-table th {
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  font-weight: 700;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
  font-size: 0.9rem;
}

.purchases-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(96, 165, 250, 0.1);
  color: #cbd5e1;
  vertical-align: top;
}

.purchase-row:hover {
  background: rgba(96, 165, 250, 0.05);
}

.purchase-id {
  font-weight: 700;
  color: #60a5fa;
}

.buyer-name {
  font-weight: 600;
  color: #ffffff;
}

.buyer-email {
  font-size: 0.9rem;
  color: #94a3b8;
}

.buyer-contact {
  font-size: 0.9rem;
  color: #cbd5e1;
  font-weight: 500;
}

.wallpapers {
  max-width: 400px;
}

.wallpaper-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}

.wallpaper-tag {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.wallpaper-count {
  color: #94a3b8;
  font-size: 0.8rem;
}

.amount {
  font-weight: 700;
  color: #10b981;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.status-badge.approved {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-badge.cancelled {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.date {
  font-size: 0.9rem;
  color: #94a3b8;
  white-space: nowrap;
}

/* ================== COMPANY STATIC DASHBOARD (Hardcoded) ================== */
.company-stats-section { background:rgba(30,41,59,0.55); border:1px solid rgba(96,165,250,0.18); padding:2rem; border-radius:18px; display:flex; flex-direction:column; gap:2rem; }
.company-stats-section .section-head h2 { margin:0 0 .4rem; font-size:1.8rem; font-weight:700; background:linear-gradient(90deg,#fff,#cbd5e1); -webkit-background-clip:text; background-clip:text; color:transparent; }
.company-stats-section .section-head p { margin:0; color:#94a3b8; font-size:.9rem; }
.company-stats-grid { display:grid; gap:1.2rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
.cstat-card { position:relative; background:linear-gradient(135deg,rgba(15,23,42,0.75),rgba(51,65,85,0.7)); border:1px solid rgba(96,165,250,0.18); border-radius:16px; padding:1.1rem 1rem 1.2rem; display:flex; gap:.9rem; align-items:flex-start; overflow:hidden; transition:.35s ease; }
.cstat-card:before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 20% 15%,rgba(96,165,250,0.25),transparent 60%); opacity:.55; pointer-events:none; mix-blend-mode:overlay; }
.cstat-card:hover { transform:translateY(-4px); border-color:rgba(96,165,250,0.4); box-shadow:0 10px 28px -6px rgba(0,0,0,0.45); }
.cstat-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.35rem; background:linear-gradient(135deg,#3b82f6,#1d4ed8); box-shadow:0 4px 14px -3px rgba(59,130,246,0.55); flex-shrink:0; }
.cstat-card.employees .cstat-icon { background:linear-gradient(135deg,#ec4899,#db2777); box-shadow:0 4px 14px -3px rgba(236,72,153,0.55); }
.cstat-card.in-progress .cstat-icon { background:linear-gradient(135deg,#f59e0b,#b45309); box-shadow:0 4px 14px -3px rgba(245,158,11,0.55); }
.cstat-card.future .cstat-icon { background:linear-gradient(135deg,#10b981,#059669); box-shadow:0 4px 14px -3px rgba(16,185,129,0.55); }
.cstat-content h4 { margin:0 0 .25rem; font-size:.78rem; letter-spacing:.12em; font-weight:600; text-transform:uppercase; color:#94a3b8; }
.cstat-number { margin:0 0 .15rem; font-size:1.55rem; font-weight:700; color:#fff; line-height:1.05; }
.cstat-content small { font-size:.65rem; letter-spacing:.08em; color:#9ca9b7; }

.projects-panels { display:grid; gap:1.2rem; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); }
.panel { background:rgba(15,23,42,0.55); border:1px solid rgba(96,165,250,0.18); border-radius:18px; padding:1.2rem 1rem 1.3rem; position:relative; overflow:hidden; display:flex; flex-direction:column; gap:.9rem; }
.panel h4 { margin:0 0 .2rem; font-size:.95rem; font-weight:700; letter-spacing:.5px; color:#fff; }
.mini-chart .sparkline { display:flex; align-items:flex-end; gap:3px; height:90px; margin-top:.4rem; }
.mini-chart .sparkline .bar { flex:1; background:linear-gradient(180deg,#60a5fa,#2563eb); border-radius:4px 4px 2px 2px; transition:.3s ease; position:relative; }
.mini-chart .sparkline .bar:hover { filter:brightness(1.1); transform:translateY(-4px); }
.legend { list-style:none; display:flex; gap:.9rem; margin:.6rem 0 0; padding:0; flex-wrap:wrap; }
.legend li { font-size:.62rem; letter-spacing:.12em; color:#94a3b8; display:flex; align-items:center; gap:.35rem; }
.legend .dot { width:10px; height:10px; border-radius:50%; display:inline-block; }
.legend .dot.completed { background:#10b981; }
.legend .dot.inprogress { background:#3b82f6; }
.legend .dot.future { background:#f59e0b; }

.projects-table-panel { overflow:hidden; }
.projects-table { width:100%; border-collapse:collapse; font-size:.72rem; }
.projects-table th { text-align:left; padding:.6rem .65rem; background:rgba(30,41,59,0.6); font-weight:600; letter-spacing:.12em; font-size:.6rem; color:#93a3b6; text-transform:uppercase; border-bottom:1px solid rgba(96,165,250,0.18); }
.projects-table td { padding:.55rem .65rem; border-bottom:1px solid rgba(96,165,250,0.09); color:#d2dde7; }
.p-name { font-weight:600; color:#fff; }
.p-owner { color:#b9c6d3; font-size:.65rem; }
.p-eta { font-size:.65rem; color:#9ca9b7; }
.p-badge { display:inline-block; padding:.35rem .55rem .3rem; border-radius:14px; font-size:.55rem; letter-spacing:.12em; font-weight:600; text-transform:uppercase; background:rgba(96,165,250,0.15); color:#60a5fa; border:1px solid rgba(96,165,250,0.25); }
.p-badge.status-completed { background:rgba(16,185,129,0.2); color:#10b981; border-color:rgba(16,185,129,0.35); }
.p-badge.status-inprogress { background:rgba(59,130,246,0.22); color:#3b82f6; border-color:rgba(59,130,246,0.38); }
.p-badge.status-paused { background:rgba(234,179,8,0.22); color:#eab308; border-color:rgba(234,179,8,0.4); }
.p-badge.status-future { background:rgba(245,158,11,0.22); color:#f59e0b; border-color:rgba(245,158,11,0.4); }

.focus-panel .focus-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.55rem; }
.focus-panel .focus-list li { display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:.6rem .7rem; border-radius:12px; backdrop-filter:blur(4px); }
.fi-label { font-size:.65rem; font-weight:600; letter-spacing:.04em; color:#d7e2ec; }
.fi-badge { font-size:.55rem; letter-spacing:.15em; font-weight:700; padding:.32rem .55rem .28rem; border-radius:12px; background:rgba(96,165,250,0.18); color:#60a5fa; border:1px solid rgba(96,165,250,0.32); }
.fi-badge.prio-alta { background:rgba(239,68,68,0.25); color:#ef4444; border-color:rgba(239,68,68,0.45); }
.fi-badge.prio-media { background:rgba(245,158,11,0.25); color:#f59e0b; border-color:rgba(245,158,11,0.45); }
.fi-badge.prio-baja { background:rgba(16,185,129,0.25); color:#10b981; border-color:rgba(16,185,129,0.45); }
.focus-panel .note { margin:.7rem 0 0; font-size:.58rem; letter-spacing:.12em; color:#7e8b96; text-transform:uppercase; }

@media (max-width: 880px){
  .projects-panels { grid-template-columns:1fr; }
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .purchases-table-container {
    overflow-x: auto;
  }

  .purchases-table {
    min-width: 800px;
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 1rem;
  }

  .winner-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .attempts-display {
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .attempt-number {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }

  .winner-number-display {
    font-size: 3rem;
    padding: 0.8rem 1.5rem;
  }

  .winner-selection-section {
    padding: 1.5rem;
  }


  .dashboard-header h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .status-filters {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .attempts-display {
    gap: 0.5rem;
  }

  .attempt-number {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }

  .winner-number-display {
    font-size: 2.5rem;
    padding: 0.6rem 1rem;
  }

  .start-game-btn,
  .next-attempt-btn,
  .reset-game-btn {
    width: 100%;
    padding: 1rem;
  }

  .winner-header h3 {
    font-size: 1.5rem;
  }
}
</style>
