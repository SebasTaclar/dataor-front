import { ref, computed } from 'vue'

const counter = ref(0)

export function useLoading() {
  const show = () => {
    counter.value++
  }

  const hide = () => {
    if (counter.value > 0) {
      counter.value--
    }
  }

  const isLoading = computed(() => counter.value > 0)

  return { show, hide, isLoading }
}
