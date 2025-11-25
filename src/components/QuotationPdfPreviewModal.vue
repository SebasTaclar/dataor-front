<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Vista Previa - Cotización #{{ quotation?.id }}</h2>
        <button @click="close" class="close-btn">✕</button>
      </div>

      <div class="modal-body">
        <iframe
          v-if="previewHtml"
          :srcdoc="previewHtml"
          class="preview-iframe"
          title="Vista previa de cotización"
        ></iframe>
      </div>

      <div class="modal-footer">
        <button @click="downloadPdf" class="download-btn">
          📥 Descargar PDF
        </button>
        <button @click="close" class="cancel-btn">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Quote } from '@/types/QuotationType'
import { generateQuotationPdf, getQuotationPreviewHtml } from '@/services/quotationPdfService'

const isOpen = ref(false)
const quotation = ref<Quote | null>(null)
const previewHtml = computed(() => {
  return quotation.value ? getQuotationPreviewHtml({ quotation: quotation.value }) : ''
})

const open = (quote: Quote) => {
  quotation.value = quote
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  quotation.value = null
}

const downloadPdf = async () => {
  if (!quotation.value) return

  try {
    await generateQuotationPdf({ quotation: quotation.value })
  } catch (error) {
    console.error('Error descargando PDF:', error)
    alert('Error al descargar el PDF')
  }
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 0.5rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1000px;
  max-height: 95vh;
  height: 95vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: rgba(15, 23, 42, 0.05);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #0f172a;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #0f172a;
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 1rem;
  background: #f5f5f5;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  background: white;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: rgba(15, 23, 42, 0.03);
  justify-content: flex-end;
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.cancel-btn {
  background: #e5e7eb;
  color: #333;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.cancel-btn:hover {
  background: #d1d5db;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 100vw;
    max-height: 100vh;
    height: 100vh;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-header h2 {
    font-size: 1rem;
  }

  .modal-body {
    padding: 0.5rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .download-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
