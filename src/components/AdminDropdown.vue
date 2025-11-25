<template>
  <div class="admin-dropdown" @mouseenter="showDropdown" @mouseleave="hideDropdown">
    <RouterLink to="/admin/clientes" class="dropdown-trigger">
      ⚙️ Panel Admin
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </RouterLink>

    <transition name="dropdown-fade">
      <div v-if="isOpen" class="dropdown-menu">
        <RouterLink to="/admin/clientes" class="dropdown-item" @click="closeDropdown">
          <span class="item-icon">👥</span>
          <span class="item-text">Clientes</span>
        </RouterLink>
        <RouterLink to="/admin/cotizaciones" class="dropdown-item" @click="closeDropdown">
          <span class="item-icon">📋</span>
          <span class="item-text">Cotizaciones</span>
        </RouterLink>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isOpen = ref(false)
let closeTimeout: number | null = null

const showDropdown = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  isOpen.value = true
}

const hideDropdown = () => {
  closeTimeout = window.setTimeout(() => {
    isOpen.value = false
  }, 200)
}

const closeDropdown = () => {
  isOpen.value = false
}
</script>

<style scoped>
.admin-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 8px;
  text-decoration: none;
}

.dropdown-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  display: inline-block;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 1000;
  border: 2px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.dropdown-item:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.item-icon {
  font-size: 1.2rem;
}

.item-text {
  font-size: 1rem;
}

/* Animación de transición */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.3s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Estilos para móvil */
@media (max-width: 768px) {
  .dropdown-menu {
    right: auto;
    left: 0;
  }
}
</style>
