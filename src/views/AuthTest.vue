<template>
  <div class="auth-test">
    <div class="container">
      <h1>Test de Autenticación</h1>

      <div class="auth-info">
        <h3>Estado Actual:</h3>
        <div class="info-card">
          <p><strong>Autenticado:</strong> {{ auth.isAuthenticated() ? '✅ Sí' : '❌ No' }}</p>
          <p><strong>Rol:</strong> {{ auth.getUserRole() || 'No definido' }}</p>
          <p><strong>Usuario:</strong> {{ auth.getCurrentUser()?.name || 'No hay usuario' }}</p>
          <p><strong>Token:</strong> {{ auth.getToken() ? '✅ Presente' : '❌ Ausente' }}</p>
          <p><strong>Es Admin:</strong> {{ auth.getUserRole() === 'admin' ? '✅ Sí' : '❌ No' }}</p>
        </div>

        <div class="actions">
          <button @click="testLogin" class="btn btn-primary">Simular Login Admin</button>
          <button @click="logout" class="btn btn-secondary">Logout</button>
          <button @click="goToClients" class="btn btn-success" :disabled="!canAccessClients">
            Ir a Clientes
          </button>
        </div>

        <div v-if="message" class="message" :class="messageType">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api/authService'

const router = useRouter()
const auth = authService

const message = ref('')
const messageType = ref('info')

const canAccessClients = computed(() => {
  return auth.isAuthenticated() && auth.getUserRole() === 'admin'
})

const testLogin = () => {
  // Simular un token de admin para testing
  const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJBZG1pbmlzdHJhZG9yIiwiZXhwIjoxNzM3NTk5OTk5fQ.test-signature'

  localStorage.setItem('token', mockToken)
  message.value = 'Token de admin creado. Refresca la página para ver los cambios.'
  messageType.value = 'success'
}

const logout = () => {
  auth.logout()
  message.value = 'Logout exitoso'
  messageType.value = 'info'
}

const goToClients = () => {
  if (canAccessClients.value) {
    router.push('/admin/clientes')
  } else {
    message.value = 'No tienes permisos para acceder a la sección de clientes'
    messageType.value = 'error'
  }
}
</script>

<style scoped>
.auth-test {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.container {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-primary);
}

h1 {
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 2rem;
}

h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.info-card {
  background: var(--bg-tertiary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-secondary);
  margin-bottom: 2rem;
}

.info-card p {
  margin: 0.5rem 0;
  color: var(--text-primary);
  font-family: monospace;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
}

.btn-secondary {
  background: var(--text-muted);
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.message {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style>
