<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button @click="close" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button @click="close" class="btn btn-cancel">Cancelar</button>
          <button @click="confirm" class="btn btn-confirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
}

const isOpen = ref(false)
const title = ref('')
const message = ref('')
const confirmText = ref('Confirmar')
let resolvePromise: ((value: boolean) => void) | null = null

const open = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    title.value = options.title
    message.value = options.message
    confirmText.value = options.confirmText || 'Confirmar'
    resolvePromise = resolve
    isOpen.value = true
  })
}

const confirm = () => {
  if (resolvePromise) {
    resolvePromise(true)
  }
  close()
}

const close = () => {
  isOpen.value = false
  if (resolvePromise) {
    resolvePromise(false)
  }
  resolvePromise = null
}

defineExpose({
  open,
  close,
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--app-bg-primary);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
}

.modal-header h3 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.2rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s ease;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.modal-body {
  padding: 1.5rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(102, 126, 234, 0.2);
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-confirm:active {
  transform: translateY(0);
}
</style>
