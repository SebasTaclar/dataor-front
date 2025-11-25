<template>
  <td :class="['inline-edit-cell', `type-${type}`, { 'is-editing': isEditing && editMode }]">
    <div v-if="!editMode || !isEditing" class="cell-view">
      <span v-if="displayValue">{{ displayValue }}</span>
      <span v-else class="empty-value">-</span>
    </div>
    <input
      v-else
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :step="type === 'number' ? step : undefined"
      :min="type === 'number' ? min : undefined"
      :max="type === 'number' ? max : undefined"
      class="cell-input"
      @blur="saveEdit"
      @keydown.enter="saveEdit"
      @keydown.escape="cancelEdit"
    />
  </td>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

interface Props {
  modelValue: string | number | null | undefined
  type?: 'text' | 'email' | 'tel' | 'number'
  step?: string | number
  min?: string | number
  max?: string | number
  formatter?: (value: string | number | null | undefined) => string
  editMode?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'save', value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  step: '1',
  editMode: false,
})

const emit = defineEmits<Emits>()

const isEditing = ref(false)
const inputRef = ref<HTMLInputElement>()
const originalValue = ref(props.modelValue)

const displayValue = computed(() => {
  if (props.formatter && props.modelValue) {
    return props.formatter(props.modelValue)
  }
  return props.modelValue || ''
})

watch(() => props.editMode, (newVal) => {
  if (newVal) {
    isEditing.value = true
    originalValue.value = props.modelValue
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  } else {
    isEditing.value = false
  }
})

const saveEdit = async () => {
  if (inputRef.value) {
    const newValue = props.type === 'number' ? parseFloat(inputRef.value.value) : inputRef.value.value
    emit('update:modelValue', newValue)
    emit('save', newValue)
  }
}

const cancelEdit = () => {
  emit('update:modelValue', originalValue.value!)
}

watch(() => props.modelValue, (newVal) => {
  originalValue.value = newVal
})
</script>

<style scoped>
.inline-edit-cell {
  padding: 0.5rem;
  cursor: default;
  transition: all 0.2s ease;
}

.inline-edit-cell.is-editing {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
}

.cell-view {
  padding: 0.25rem 0;
  min-height: 1.5rem;
  display: flex;
  align-items: center;
}

.empty-value {
  color: #94a3b8;
  font-style: italic;
}

.cell-input {
  width: 100%;
  padding: 0.5rem;
  background: rgba(102, 126, 234, 0.2);
  border: 2px solid rgba(102, 126, 234, 0.6);
  border-radius: 4px;
  color: #e2e8f0;
  font-size: 0.95rem;
  font-family: inherit;
}

.cell-input:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 1);
  background: rgba(102, 126, 234, 0.3);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>
