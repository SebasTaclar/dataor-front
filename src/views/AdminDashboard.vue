<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
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
        <!-- Formulario para Nuevo Proyecto -->
        <div class="new-project-section">
          <div class="section-head">
            <h3>➕ Agregar Nuevo Proyecto</h3>
          </div>
          <form @submit.prevent="addNewProject" class="new-project-form">
            <div class="form-row">
              <input
                v-model="newProject.name"
                type="text"
                placeholder="Nombre del proyecto"
                required
                class="form-input"
              />
              <input
                v-model="newProject.focus"
                type="text"
                placeholder="Enfoque (ej: Frontend, Backend, IA)"
                required
                class="form-input"
              />
              <select v-model="newProject.status" class="form-select" required>
                <option value="">Seleccionar estado</option>
                <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <button type="submit" class="add-btn">Agregar</button>
            </div>
          </form>
        </div>

        <!-- Company Dynamic Stats -->
        <div class="company-stats-section">
          <div class="section-head">
            <h2>📈 Visión General de Proyectos</h2>
            <p>Estadísticas en tiempo real basadas en los proyectos actuales</p>
          </div>
          <div class="company-stats-grid">
            <div class="cstat-card total-projects">
              <div class="cstat-icon">🗂️</div>
              <div class="cstat-content">
                <h4>Proyectos Totales</h4>
                <p class="cstat-number">{{ projectStats.total }}</p>
                <small>{{ projectStats.completed }} completados</small>
              </div>
            </div>
            <div class="cstat-card demo">
              <div class="cstat-icon">🎯</div>
              <div class="cstat-content">
                <h4>En Demo</h4>
                <p class="cstat-number">{{ projectStats.demo }}</p>
                <small>Listos para mostrar</small>
              </div>
            </div>
            <div class="cstat-card in-progress">
              <div class="cstat-icon">⚙️</div>
              <div class="cstat-content">
                <h4>En Ejecución</h4>
                <p class="cstat-number">{{ projectStats.inProgress }}</p>
                <small>Actualmente desarrollando</small>
              </div>
            </div>
            <div class="cstat-card future">
              <div class="cstat-icon">🚀</div>
              <div class="cstat-content">
                <h4>Futuros</h4>
                <p class="cstat-number">{{ projectStats.future }}</p>
                <small>{{ projectStats.projection }} proyecciones</small>
              </div>
            </div>
          </div>

          <div class="projects-panels">
            <!-- Lista profesional de proyectos - Espacio ampliado -->
            <div class="panel projects-professional main-projects">
              <div class="panel-header">
                <h4>🚀 Gestión de Proyectos</h4>
                <div class="project-counter">{{ projectList.length }} proyectos activos</div>
              </div>
              <div class="projects-grid">
                <div v-for="project in projectList" :key="project.id" class="project-card">
                  <div class="project-main">
                    <div class="project-info">
                      <h5 class="project-name">{{ project.name }}</h5>
                      <p class="project-focus">{{ project.focus }}</p>
                    </div>
                    <div class="project-actions">
                      <select
                        class="status-dropdown"
                        v-model="project.status"
                        :class="`status-${project.status}`"
                      >
                        <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">
                          {{ opt.label }}
                        </option>
                      </select>
                      <button
                        @click="removeProject(project.id)"
                        class="delete-btn"
                        title="Eliminar proyecto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div class="project-footer">
                    <div class="status-indicator" :class="`indicator-${project.status}`">
                      <span class="status-dot"></span>
                      {{ getStatusLabel(project.status) }}
                    </div>
                    <div class="project-id">#{{ project.id }}</div>
                  </div>
                </div>

                <!-- Mensaje cuando no hay proyectos -->
                <div v-if="projectList.length === 0" class="empty-projects">
                  <div class="empty-icon">📁</div>
                  <h5>No hay proyectos aún</h5>
                  <p>Utiliza el formulario de arriba para agregar tu primer proyecto</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de distribución por estados - Movido abajo -->
          <div class="distribution-section">

            <!-- Nueva gráfica de barras horizontal -->
            <div class="panel hbar-chart">
              <h4>📊 Barras Horizontales (tope 20)</h4>
              <div class="hbar-list">
                <div class="hbar-row" v-for="item in chartData" :key="item.status">
                  <span class="hbar-label">{{ item.label }}</span>
                  <div class="hbar-track">
                    <div class="hbar-fill" :class="`hbar-${item.status}`" :style="{ width: item.percentage + '%' }"></div>
                  </div>
                  <span class="hbar-value">{{ item.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { authService } from '@/services/api/authService'
import { useRouter } from 'vue-router'

const router = useRouter()

// Verificar permisos de administrador
if (!authService.isAdmin()) {
  router.push('/')
}

// Estado para manejar errores
const error = ref<string | null>(null)

// ================== COMPANY DASHBOARD ==================
type ProjectStatus = 'demo' | 'inprogress' | 'completed' | 'paused' | 'future' | 'projection'

const STATUS_OPTIONS: Array<{ value: ProjectStatus; label: string }> = [
  { value: 'demo', label: 'Demo' },
  { value: 'inprogress', label: 'En ejecución' },
  { value: 'completed', label: 'Terminado' },
  { value: 'paused', label: 'En pausa' },
  { value: 'future', label: 'Backlog' },
  { value: 'projection', label: 'Proyección' },
]

const STORAGE_KEY = 'adminDashboard.projects'

interface ProjectRow {
  id: number
  name: string
  status: ProjectStatus
  focus: string
}

const projectList = ref<ProjectRow[]>([
  // Lista vacía para empezar limpio
])

// Formulario para nuevo proyecto
const newProject = ref({
  name: '',
  focus: '',
  status: '' as ProjectStatus | ''
})

// Estadísticas dinámicas basadas en projectList
const projectStats = computed(() => {
  const stats = {
    total: projectList.value.length,
    completed: 0,
    demo: 0,
    inProgress: 0,
    future: 0,
    projection: 0,
    paused: 0
  }

  projectList.value.forEach(p => {
    switch(p.status) {
      case 'completed': stats.completed++; break
      case 'demo': stats.demo++; break
      case 'inprogress': stats.inProgress++; break
      case 'future': stats.future++; break
      case 'projection': stats.projection++; break
      case 'paused': stats.paused++; break
    }
  })

  return stats
})

// Datos para el gráfico de distribución
const chartData = computed(() => {
  const totalProjects = projectList.value.length

  // Si no hay proyectos, retornar datos vacíos
  if (totalProjects === 0) {
    return [
      { status: 'demo', label: 'Demo', count: 0, percentage: 0 },
      { status: 'inprogress', label: 'Ejecución', count: 0, percentage: 0 },
      { status: 'completed', label: 'Terminados', count: 0, percentage: 0 },
      { status: 'paused', label: 'Pausados', count: 0, percentage: 0 },
      { status: 'future', label: 'Futuros', count: 0, percentage: 0 }
    ]
  }

  // Usar tope fijo de 20 (20 = 100% altura)
  const MAX_BAR = 20
  const getVisualPercentage = (count: number) => {
    if (count <= 0) return 0
    const clamped = Math.min(count, MAX_BAR)
    return (clamped / MAX_BAR) * 100
  }

  return [
    {
      status: 'demo',
      label: 'Demo',
      count: projectStats.value.demo,
      percentage: getVisualPercentage(projectStats.value.demo)
    },
    {
      status: 'inprogress',
      label: 'Ejecución',
      count: projectStats.value.inProgress,
      percentage: getVisualPercentage(projectStats.value.inProgress)
    },
    {
      status: 'completed',
      label: 'Terminados',
      count: projectStats.value.completed,
      percentage: getVisualPercentage(projectStats.value.completed)
    },
    {
      status: 'paused',
      label: 'Pausados',
      count: projectStats.value.paused,
      percentage: getVisualPercentage(projectStats.value.paused)
    },
    {
      status: 'future',
      label: 'Futuros',
      count: projectStats.value.future,
      percentage: getVisualPercentage(projectStats.value.future)
    }
  ]
})

// Función para obtener etiqueta de estado
const getStatusLabel = (status: ProjectStatus): string => {
  const option = STATUS_OPTIONS.find(opt => opt.value === status)
  return option?.label || status
}

// Función para agregar nuevo proyecto
const addNewProject = () => {
  if (!newProject.value.name || !newProject.value.focus || !newProject.value.status) {
    return
  }

  const maxId = Math.max(...projectList.value.map(p => p.id), 0)
  const newProj: ProjectRow = {
    id: maxId + 1,
    name: newProject.value.name,
    focus: newProject.value.focus,
    status: newProject.value.status as ProjectStatus
  }

  projectList.value.push(newProj)

  // Limpiar formulario
  newProject.value = {
    name: '',
    focus: '',
    status: ''
  }
}

// Función para eliminar proyecto
const removeProject = (projectId: number) => {
  const index = projectList.value.findIndex(p => p.id === projectId)
  if (index > -1) {
    projectList.value.splice(index, 1)
  }
}

// Persistencia en localStorage (proyectos completos)
onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved: ProjectRow[] = JSON.parse(raw)
      if (Array.isArray(saved) && saved.length > 0) {
        projectList.value = saved
      }
    }
  } catch { /* noop */ }
})

watch(projectList, (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}, { deep: true })
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

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* ================== COMPANY STATIC DASHBOARD (Hardcoded) ================== */
.new-project-section {
  background: rgba(30,41,59,0.55);
  border: 1px solid rgba(96,165,250,0.18);
  padding: 2rem;
  border-radius: 18px;
  margin-bottom: 2rem;
}

.new-project-section .section-head h3 {
  margin: 0 0 1rem;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(90deg,#fff,#cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.new-project-form {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr auto;
  gap: 1rem;
  align-items: end;
}

.form-input, .form-select {
  background: rgba(15,23,42,0.6);
  border: 1px solid rgba(96,165,250,0.2);
  color: #e2e8f0;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: rgba(96,165,250,0.6);
  box-shadow: 0 0 0 3px rgba(96,165,250,0.1);
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
  white-space: nowrap;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.company-stats-section {
  background: rgba(30,41,59,0.55);
  border: 1px solid rgba(96,165,250,0.18);
  padding: 2rem;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.company-stats-section .section-head h2 {
  margin: 0 0 .4rem;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(90deg,#fff,#cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.company-stats-section .section-head p {
  margin: 0;
  color: #94a3b8;
  font-size: .9rem;
}

.company-stats-grid {
  display: grid;
  gap: 1.2rem;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
}

.cstat-card {
  position: relative;
  background: linear-gradient(135deg,rgba(15,23,42,0.75),rgba(51,65,85,0.7));
  border: 1px solid rgba(96,165,250,0.18);
  border-radius: 16px;
  padding: 1.1rem 1rem 1.2rem;
  display: flex;
  gap: .9rem;
  align-items: flex-start;
  overflow: hidden;
  transition: .35s ease;
}

.cstat-card:before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 15%,rgba(96,165,250,0.25),transparent 60%);
  opacity: .55;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.cstat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(96,165,250,0.4);
  box-shadow: 0 10px 28px -6px rgba(0,0,0,0.45);
}

.cstat-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  background: linear-gradient(135deg,#3b82f6,#1d4ed8);
  box-shadow: 0 4px 14px -3px rgba(59,130,246,0.55);
  flex-shrink: 0;
}

.cstat-card.demo .cstat-icon {
  background: linear-gradient(135deg,#6366f1,#4f46e5);
  box-shadow: 0 4px 14px -3px rgba(99,102,241,0.55);
}.cstat-card.in-progress .cstat-icon {
  background: linear-gradient(135deg,#f59e0b,#b45309);
  box-shadow: 0 4px 14px -3px rgba(245,158,11,0.55);
}

.cstat-card.future .cstat-icon {
  background: linear-gradient(135deg,#10b981,#059669);
  box-shadow: 0 4px 14px -3px rgba(16,185,129,0.55);
}

.cstat-content h4 {
  margin: 0 0 .25rem;
  font-size: .78rem;
  letter-spacing: .12em;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
}

.cstat-number {
  margin: 0 0 .15rem;
  font-size: 1.55rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.05;
}

.cstat-content small {
  font-size: .65rem;
  letter-spacing: .08em;
  color: #9ca9b7;
}

.projects-panels {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Área principal de proyectos ampliada */
.main-projects {
  min-height: 600px;
}

.main-projects .projects-grid {
  max-height: 550px;
}

/* Gráfico de distribución */
.stats-chart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.distribution-chart {
  position: relative;
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 0.75rem;
  min-height: 220px;
  padding: 0.5rem 0.5rem 1.25rem;
  margin-top: 1rem;
}

.y-guides {
  position: relative;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  align-items: end;
  color: #64748b;
  font-size: 0.7rem;
  letter-spacing: .04em;
}

.y-guides span {
  position: relative;
}

.y-guides span::after {
  content: "";
  position: absolute;
  left: 3.2rem;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
  background: linear-gradient(90deg, rgba(148,163,184,0.25), rgba(148,163,184,0.08));
}

.chart-items {
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  gap: 1rem;
  position: relative;
}

.chart-items::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  height: 2px;
  background: rgba(148,163,184,0.25);
  border-radius: 2px;
}

.chart-item {
  min-width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-value {
  position: absolute;
  top: -18px;
  background: rgba(15,23,42,0.85);
  border: 1px solid rgba(148,163,184,0.35);
  color: #e2e8f0;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.chart-bar {
  width: 100%;
  min-height: 6px;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 10px rgba(0,0,0,0.25);
}

.chart-bar:hover {
  transform: scaleY(1.08) translateY(-2px);
  filter: brightness(1.1);
}

/* Barras con 0 proyectos no tendrán altura mínima */
.chart-item[data-count="0"] .chart-bar {
  min-height: 0px !important;
  opacity: 0.2;
}

.chart-demo .chart-bar { background: linear-gradient(180deg, #818cf8, #6366f1); }
.chart-inprogress .chart-bar { background: linear-gradient(180deg, #60a5fa, #3b82f6); }
.chart-completed .chart-bar { background: linear-gradient(180deg, #34d399, #10b981); }
.chart-paused .chart-bar { background: linear-gradient(180deg, #fbbf24, #f59e0b); }
.chart-future .chart-bar { background: linear-gradient(180deg, #fb7185, #f43f5e); }

.chart-label {
  font-size: 0.7rem;
  color: #94a3b8;
  text-align: center;
  font-weight: 600;
}

.chart-count {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
}

/* Gestión profesional de proyectos */
.projects-professional {
  overflow: hidden;
}

/* ===== Horizontal Bar Chart ===== */
.hbar-chart {
  margin-top: 1rem;
}

.hbar-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hbar-row {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  align-items: center;
  gap: 0.6rem;
}

.hbar-label {
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
}

.hbar-track {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(148,163,184,0.25);
  border-radius: 10px;
  height: 14px;
  overflow: hidden;
}

.hbar-fill {
  height: 100%;
  border-radius: 9px;
  transition: width .35s ease;
}

.hbar-demo { background: linear-gradient(90deg, #6366f1, #818cf8); }
.hbar-inprogress { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.hbar-completed { background: linear-gradient(90deg, #10b981, #34d399); }
.hbar-paused { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.hbar-future { background: linear-gradient(90deg, #f43f5e, #fb7185); }

.hbar-value {
  color: #e2e8f0;
  font-weight: 700;
  font-size: 0.9rem;
  text-align: right;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(96,165,250,0.15);
}

.panel-header h4 {
  margin: 0;
}

.project-counter {
  background: rgba(96,165,250,0.15);
  color: #60a5fa;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(96,165,250,0.25);
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.projects-grid::-webkit-scrollbar {
  width: 4px;
}

.projects-grid::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
  border-radius: 2px;
}

.projects-grid::-webkit-scrollbar-thumb {
  background: rgba(96,165,250,0.3);
  border-radius: 2px;
}

.project-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  border-color: rgba(96,165,250,0.3);
  background: rgba(255,255,255,0.06);
  transform: translateY(-1px);
}

.project-main {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.8rem;
}

.project-info h5 {
  margin: 0 0 0.3rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.project-focus {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.status-dropdown {
  background: rgba(15,23,42,0.7);
  border: 1px solid rgba(96,165,250,0.2);
  color: #e2e8f0;
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 120px;
  transition: all 0.3s ease;
}

.delete-btn {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.3);
  color: #ef4444;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 36px;
}

.delete-btn:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.5);
  transform: scale(1.05);
}

.delete-btn:active {
  transform: scale(0.95);
}

.status-dropdown:focus {
  outline: none;
  border-color: rgba(96,165,250,0.5);
  box-shadow: 0 0 0 2px rgba(96,165,250,0.1);
}

.status-demo { border-color: rgba(99,102,241,0.4); }
.status-inprogress { border-color: rgba(59,130,246,0.4); }
.status-completed { border-color: rgba(16,185,129,0.4); }
.status-paused { border-color: rgba(245,158,11,0.4); }
.status-future { border-color: rgba(244,63,94,0.4); }
.status-projection { border-color: rgba(14,165,233,0.4); }

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  border: 1px solid;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.indicator-demo {
  background: rgba(99,102,241,0.15);
  color: #818cf8;
  border-color: rgba(99,102,241,0.3);
}
.indicator-demo .status-dot { background: #6366f1; }

.indicator-inprogress {
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
  border-color: rgba(59,130,246,0.3);
}
.indicator-inprogress .status-dot { background: #3b82f6; }

.indicator-completed {
  background: rgba(16,185,129,0.15);
  color: #34d399;
  border-color: rgba(16,185,129,0.3);
}
.indicator-completed .status-dot { background: #10b981; }

.indicator-paused {
  background: rgba(245,158,11,0.15);
  color: #fbbf24;
  border-color: rgba(245,158,11,0.3);
}
.indicator-paused .status-dot { background: #f59e0b; }

.indicator-future {
  background: rgba(244,63,94,0.15);
  color: #fb7185;
  border-color: rgba(244,63,94,0.3);
}
.indicator-future .status-dot { background: #f43f5e; }

.indicator-projection {
  background: rgba(14,165,233,0.15);
  color: #38bdf8;
  border-color: rgba(14,165,233,0.3);
}
.indicator-projection .status-dot { background: #0ea5e9; }

.project-id {
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 600;
  background: rgba(255,255,255,0.05);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

/* Mensaje cuando no hay proyectos */
.empty-projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: #94a3b8;
  background: rgba(255,255,255,0.02);
  border: 2px dashed rgba(96,165,250,0.2);
  border-radius: 16px;
  margin: 1rem 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-projects h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #cbd5e1;
}

.empty-projects p {
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.5;
}

/* Sección de distribución abajo */
.distribution-section {
  margin-top: 1rem;
}

.distribution-section .panel {
  max-width: 600px;
  margin: 0 auto;
}.panel {
  background: rgba(15,23,42,0.55);
  border: 1px solid rgba(96,165,250,0.18);
  border-radius: 18px;
  padding: 1.2rem 1rem 1.3rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: .9rem;
}

.panel h4 {
  margin: 0 0 .2rem;
  font-size: .95rem;
  font-weight: 700;
  letter-spacing: .5px;
  color: #fff;
}

.focus-panel .focus-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: .55rem;
}

.focus-panel .focus-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  padding: .6rem .7rem;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.fi-label {
  font-size: .65rem;
  font-weight: 600;
  letter-spacing: .04em;
  color: #d7e2ec;
}

.fi-badge {
  font-size: .55rem;
  letter-spacing: .15em;
  font-weight: 700;
  padding: .32rem .55rem .28rem;
  border-radius: 12px;
  background: rgba(96,165,250,0.18);
  color: #60a5fa;
  border: 1px solid rgba(96,165,250,0.32);
}

.fi-badge.prio-alta {
  background: rgba(239,68,68,0.25);
  color: #ef4444;
  border-color: rgba(239,68,68,0.45);
}

.fi-badge.prio-media {
  background: rgba(245,158,11,0.25);
  color: #f59e0b;
  border-color: rgba(245,158,11,0.45);
}

.fi-badge.prio-baja {
  background: rgba(16,185,129,0.25);
  color: #10b981;
  border-color: rgba(16,185,129,0.45);
}

.focus-panel .note {
  margin: .7rem 0 0;
  font-size: .58rem;
  letter-spacing: .12em;
  color: #7e8b96;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 880px) {
  .projects-panels {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .add-btn {
    justify-self: start;
    width: fit-content;
  }

  .distribution-chart {
    height: 120px;
  }
}@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 1rem;
  }

  .dashboard-header h1 {
    font-size: 2rem;
  }

  .company-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .company-stats-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
}
</style>
