<template>
  <Transition name="fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useLoading } from '@/composables/useLoading'

defineOptions({
  name: 'SpinnerComponent',
});

const { isLoading } = useLoading()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid #fff;
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
