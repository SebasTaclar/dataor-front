import html2pdf from 'html2pdf.js'
import type { Quote } from '@/types/QuotationType'

interface QuotationPdfData {
  quotation: Quote
  logoUrl?: string
}

export const generateQuotationHtml = (data: QuotationPdfData): string => {
  const { quotation, logoUrl = '/images/logo2.jpeg' } = data

  // Formatear fecha
  const createdDate = new Date(quotation.createdAt || new Date())
  const formattedDate = createdDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  // Calcular total
  const total = quotation.services?.reduce((sum, service) => {
    const amount = typeof service.amount === 'string' ? parseFloat(service.amount) : service.amount
    const value = typeof service.value === 'string' ? parseFloat(service.value) : service.value
    return sum + (amount || value || 0)
  }, 0) || quotation.totalAmount || 0

  // HTML del PDF - Optimizado para una página
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 0; margin: 0; font-size: 13px; line-height: 1.3;">
      <!-- Header con onda azul -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); position: relative; padding: 20px 15px 12px; margin: 0; clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1;">
            <img src="${logoUrl}" alt="DataOR Logo" style="height: 40px; margin-bottom: 3px;">
            <h1 style="color: white; margin: 0; font-size: 18px; font-weight: bold;">DataOR</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 1px 0 0; font-size: 9px;">DESARROLLO DE SOFTWARE</p>
          </div>
          <div style="text-align: right; color: white; white-space: nowrap;">
            <p style="margin: 0 0 2px 0; font-size: 11px; font-weight: bold;">${formattedDate}</p>
            <p style="margin: 0; font-size: 10px; opacity: 0.8;">Cotización #${quotation.id}</p>
          </div>
        </div>
      </div>

      <!-- Cliente info -->
      <div style="margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #666; font-size: 10px;">CLIENTE:</p>
        <p style="margin: 2px 0 0; color: #0f172a; font-size: 12px; font-weight: bold;">${quotation.clientName || 'N/A'}</p>
      </div>

      <!-- Tabla de servicios -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px;">
        <thead>
          <tr style="background-color: #0f172a; color: white;">
            <th style="padding: 6px 5px; text-align: left; font-size: 10px; font-weight: bold;">SERVICIO</th>
            <th style="padding: 6px 5px; text-align: left; font-size: 10px; font-weight: bold;">DESCRIPCIÓN</th>
            <th style="padding: 6px 5px; text-align: center; font-size: 10px; font-weight: bold;">FACTURACIÓN</th>
            <th style="padding: 6px 5px; text-align: right; font-size: 10px; font-weight: bold;">VALOR</th>
          </tr>
        </thead>
        <tbody>
          ${quotation.services
            ?.map(
              (service, index) => `
            <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background-color: #fafbfc;' : ''}">
              <td style="padding: 5px; font-size: 11px; color: #0f172a; font-weight: 500;">${service.serviceName || service.name || 'N/A'}</td>
              <td style="padding: 5px; font-size: 10px; color: #555;">${service.description || 'N/A'}</td>
              <td style="padding: 5px; font-size: 10px; color: #666; text-align: center; text-transform: uppercase;">${service.billingType || 'N/A'}</td>
              <td style="padding: 5px; font-size: 11px; color: #0f172a; font-weight: 600; text-align: right;">$${((service.amount || service.value || 0) as number).toLocaleString('es-ES')}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <!-- Notas - Reducido -->
      <div style="background-color: #f0f4f8; padding: 8px; border-left: 3px solid #667eea; margin-bottom: 10px; border-radius: 2px; font-size: 10px;">
        <p style="margin: 0 0 4px 0; color: #0f172a; font-weight: bold; font-size: 10px;">NOTAS:</p>
        <ul style="margin: 0; padding-left: 14px; color: #555; line-height: 1.3;">
          <li style="margin-bottom: 2px; font-size: 10px;">Tras aprobar el contenido, coordinaremos con ustedes si realizamos nosotros la publicación o les entregamos el material.</li>
          <li style="margin-bottom: 2px; font-size: 10px;">Buscamos fortalecer la credibilidad digital mediante contenido estratégico. Es un trabajo conjunto para construir una presencia sólida.</li>
          <li style="font-size: 10px;">Válida por 15 días. La fecha de ejecución se coordinará según disponibilidad.</li>
        </ul>
      </div>

      <!-- Total - Más formal y compacto -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
        <div style="background-color: #f3f4f6; border: 2px solid #0f172a; padding: 6px 12px; border-radius: 4px; text-align: center;">
          <p style="margin: 0; font-size: 9px; color: #666; font-weight: 600;">TOTAL COTIZACIÓN</p>
          <p style="margin: 3px 0 0; font-size: 16px; font-weight: bold; color: #0f172a;">$${total.toLocaleString('es-ES')}</p>
        </div>
      </div>

      <!-- Footer - Compacto -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 6px; font-size: 10px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 6px;">
          <div>
            <p style="margin: 0 0 3px 0; color: #0f172a; font-weight: bold; font-size: 10px;">CONTACTO</p>
            <p style="margin: 1px 0; font-size: 9px; color: #555;">dataor52@gmail.com</p>
            <p style="margin: 1px 0; font-size: 9px; color: #555;">www.dataor.org</p>
          </div>
          <div>
            <p style="margin: 0 0 3px 0; color: #0f172a; font-weight: bold; font-size: 10px;">TELÉFONOS</p>
            <p style="margin: 1px 0; font-size: 9px; color: #555;">+57 310 769 5856</p>
            <p style="margin: 1px 0; font-size: 9px; color: #555;">+57 310 360 8519</p>
          </div>
        </div>
        <div style="text-align: center; padding-top: 4px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 8px; color: #999;">DataOR © 2024 | Desarrollo de Software</p>
        </div>
      </div>
    </div>
  `

  return htmlContent
}

export const generateQuotationPdf = async (data: QuotationPdfData) => {
  const htmlContent = generateQuotationHtml(data)
  const { quotation } = data

  // Formatear fecha para el nombre del archivo
  const createdDate = new Date(quotation.createdAt || new Date())
  const formattedDate = createdDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  // Opciones para html2pdf - Optimizadas para una página
  const options = {
    margin: [4, 4, 4, 4],
    filename: `cotizacion-${quotation.id}-${formattedDate.replace(/\s+/g, '-')}.pdf`,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, logging: false, allowTaint: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'avoid-all' }
  }

  try {
    // Crear un elemento temporal para contener el HTML
    const element = document.createElement('div')
    element.innerHTML = htmlContent

    html2pdf().set(options).from(element).save()
  } catch (error) {
    console.error('Error generando PDF:', error)
    throw new Error('Error al generar el PDF de la cotización')
  }
}

export const getQuotationPreviewHtml = (data: QuotationPdfData): string => {
  const htmlContent = generateQuotationHtml(data)
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 10px; background: #f5f5f5; }
        .preview-container {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
          background: white;
          padding: 0;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .content { padding: 10px; }
      </style>
    </head>
    <body>
      <div class="preview-container">
        <div class="content">
          ${htmlContent}
        </div>
      </div>
    </body>
    </html>
  `
}
