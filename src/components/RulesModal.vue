<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="rules-overlay"
      role="presentation"
      @click.self="emitClose"
      @keydown.esc.prevent="emitClose"
      tabindex="-1"
    >
      <div class="rules-modal" role="dialog" aria-modal="true" aria-labelledby="rulesTitle">
        <button class="rules-close" type="button" @click="emitClose" aria-label="Cerrar">×</button>

        <header class="rules-header">
          <span class="rules-badge">INFO</span>
          <h3 id="rulesTitle" class="rules-title">Cómo trabajamos y qué puedes esperar</h3>
          <p class="rules-subtitle">
            Transparencia desde el minuto uno: alcance claro, entregables medibles y avances visibles.
          </p>
        </header>

        <div class="rules-body">
          <div class="rules-section">
            <h4 class="rules-h">Reglas de juego (para que todo fluya)</h4>
            <ul class="rules-list">
              <li><strong>Objetivo + métrica</strong>: definimos qué decisión mejora y cómo se mide.</li>
              <li><strong>Iteraciones cortas</strong>: entregamos valor por semanas, no por meses.</li>
              <li><strong>Sin caja negra</strong>: documentamos y transferimos conocimiento.</li>
              <li><strong>Control de alcance</strong>: cambios sí, sorpresas no (priorizamos con datos).</li>
            </ul>
          </div>

          <div class="rules-divider" aria-hidden="true"></div>

          <div class="rules-section">
            <h4 class="rules-h">Qué traer a la conversación</h4>
            <ul class="rules-list">
              <li>Un ejemplo real del problema (reporte, Excel, flujo, pantalla).</li>
              <li>Fuentes de datos y acceso (ERP/CRM, BD, APIs, archivos).</li>
              <li>Quién usa el resultado y cada cuánto (operación, dirección, clientes).</li>
              <li>Cómo se ve el éxito en 30 días (una métrica concreta).</li>
            </ul>
          </div>
        </div>

        <footer class="rules-footer">
          <button class="rules-btn" type="button" @click="emitClose">Entendido</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ isVisible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

function emitClose() {
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (!props.isVisible) return
  if (e.key === 'Escape') emitClose()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.rules-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  backdrop-filter: var(--backdrop-blur);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 6vh 1.2rem;
  z-index: 10000;
  overflow-y: auto;
}

.rules-modal {
  width: 100%;
  max-width: 720px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  backdrop-filter: var(--backdrop-blur);
  box-shadow: 0 18px 50px -18px var(--shadow-primary);
  position: relative;
  padding: 1.6rem 1.5rem 1.25rem;
}

.rules-close {
  position: absolute;
  top: 10px;
  right: 12px;
  border: 1px solid var(--border-secondary);
  background: transparent;
  color: var(--text-primary);
  width: 36px;
  height: 36px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.35rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.rules-close:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-primary);
}

.rules-header {
  text-align: left;
  padding-right: 2.2rem;
  margin-bottom: 1.1rem;
}

.rules-badge {
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  font-weight: 650;
  padding: 0.45rem 0.8rem 0.42rem;
  border-radius: 999px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.rules-title {
  margin: 0 0 0.45rem;
  font-size: 1.2rem;
  font-weight: 720;
  letter-spacing: 0.2px;
  color: var(--text-primary);
}

.rules-subtitle {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.rules-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rules-section {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 18px;
  padding: 1.05rem 1rem;
}

.rules-h {
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 650;
  color: var(--text-secondary);
}

.rules-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.rules-list li {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
  opacity: 0.92;
  position: relative;
  padding-left: 1rem;
}

.rules-list li:before {
  content: '•';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--secondary-blue);
}

.rules-list strong {
  font-weight: 700;
}

.rules-divider {
  height: 1px;
  width: 100%;
  background: var(--border-secondary);
  opacity: 0.9;
}

.rules-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.rules-btn {
  border: 1px solid var(--border-primary);
  background: linear-gradient(125deg, var(--primary-blue), var(--dark-blue));
  color: #fff;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 650;
  padding: 0.85rem 1.2rem 0.8rem;
  border-radius: 16px;
  cursor: pointer;
  transition: filter 0.35s ease;
}

.rules-btn:hover {
  filter: brightness(1.08);
}

@media (max-width: 640px) {
  .rules-modal {
    padding: 1.35rem 1.1rem 1.1rem;
    border-radius: 20px;
  }

  .rules-title {
    font-size: 1.05rem;
  }

  .rules-list li {
    font-size: 0.86rem;
  }

  .rules-footer {
    justify-content: stretch;
  }

  .rules-btn {
    width: 100%;
  }
}
</style>
