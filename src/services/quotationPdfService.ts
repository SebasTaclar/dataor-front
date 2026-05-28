import html2pdf from 'html2pdf.js'
import type { Quote } from '@/types/QuotationType'

interface QuotationPdfData {
  quotation: Quote
  logoUrl?: string
}

export const generateQuotationHtml = (data: QuotationPdfData): string => {
  const { quotation, logoUrl = '/images/logo2.jpeg' } = data

  const currency = quotation.currency || 'COP'
  const currencySymbolMap: Record<string, string> = {
    COP: '$',
    USD: 'US$',
    EUR: '€',
    MXN: 'MX$',
  }
  const currencySymbol = currencySymbolMap[currency] || '$'

  const formatMoney = (value: number | string | undefined): string => {
    const numericValue = typeof value === 'string' ? Number(value) : value || 0
    return `${currencySymbol} ${Math.trunc(Number.isFinite(numericValue) ? numericValue : 0).toLocaleString('es-CO')}`
  }

  const normalizeText = (value: string | undefined): string => {
    if (!value) return 'N/A'
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  const safeClientName = normalizeText(quotation.clientName || quotation.client?.name || 'N/A')
  const safeCompanyName = normalizeText(quotation.client?.companyName || '')
  const safeEmail = normalizeText(quotation.client?.email || '')
  const safePhone = normalizeText(quotation.client?.phone || '')
  const safeCountry = normalizeText(quotation.client?.country || '')
  const billingTypeLabel = (quotation.billingType || quotation.services?.[0]?.billingType || 'monthly')
    .toString()
    .toUpperCase()

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

  const serviceRows = (quotation.services || [])
    .map((service, index) => {
      const serviceName = normalizeText(service.serviceName || service.name || 'N/A')
      const description = normalizeText(service.description || 'Sin descripción')
      const billing = normalizeText(service.billingType || billingTypeLabel)
      const amount = service.amount || service.value || 0

      return `
        <tr class="service-row ${index % 2 === 0 ? 'even' : 'odd'}">
          <td class="service-cell service-name">${serviceName}</td>
          <td class="service-cell service-description">${description}</td>
          <td class="service-cell service-billing">${billing}</td>
          <td class="service-cell service-amount">${formatMoney(amount)}</td>
        </tr>
      `
    })
    .join('')

  // HTML del PDF - Estructura formal y compacta
  const htmlContent = `
    <div class="quote-page">
      <style>
        *{box-sizing:border-box}
        body{margin:0}
        .quote-page{font-family: 'Helvetica Neue', Arial, sans-serif; color:#0f172a; background:#fff}
        /* Header */
        .top-bar{background:linear-gradient(90deg,#071034 0%,#0b2347 60%); padding:18px 20px; border-radius:10px}
        .top-inner{display:flex;justify-content:space-between;align-items:center}
        .brand{display:flex;gap:14px;align-items:center}
        .brand-logo{width:64px;height:64px;object-fit:contain;border-radius:8px;background:rgba(255,255,255,0.04);padding:6px}
        .brand-title{color:#fff;margin:0;font-size:20px;font-weight:800}
        .brand-sub{color:rgba(255,255,255,0.75);margin:0;font-size:10px}
        .meta{color:#cfe3ff;text-align:right}
        .meta .date{font-weight:700;font-size:12px}
        .meta .num{font-size:11px;opacity:0.85}
        /* Big title + client card */
        .hero{display:flex;justify-content:space-between;align-items:flex-start;margin:18px 0}
        .proposal-title{font-size:34px;line-height:1;margin:0;color:#0f172a}
        .proposal-accent{color:#1f6feb}
        .client-card{background:#fff;border-radius:12px;padding:12px 14px;border:1px solid #e6eefc;box-shadow:0 6px 18px rgba(13,60,120,0.06);width:260px}
        .client-card h4{margin:0;font-size:13px;color:#0f172a}
        .client-card p{margin:6px 0 0;color:#475569;font-size:11px}
        /* Services table */
        .services-wrap{margin-top:8px;border-radius:12px;overflow:hidden;border:1px solid #e6eefc}
        .services-header{background:#081235;color:#fff;padding:10px 14px;font-weight:700}
        .services-table{width:100%;border-collapse:collapse}
        .services-table th{padding:12px 14px;text-align:left;background:#081235;color:#fff;font-size:10px}
        .services-table th.center{text-align:center}
        .services-table th.right{text-align:right}
        .services-table td{padding:12px 14px;border-bottom:1px solid #f1f5fb;font-size:11px;color:#0f172a;vertical-align:top}
        .badge{display:inline-block;padding:4px 8px;border-radius:999px;font-size:9px;font-weight:700}
        .badge.pill{background:#e6f0ff;color:#1353c7;border:1px solid rgba(19,83,199,0.08)}
        .badge.month{background:#e8fff1;color:#0b6b3a;border:1px solid rgba(11,107,58,0.06)}
        .service-row.even{background:#fbfdff}
        /* Total card and notes */
        .notes-total{display:flex;gap:14px;margin-top:14px}
        .notes{flex:1;background:#f8fafc;padding:12px;border-radius:12px;border:1px solid #e6eefc}
        .notes h5{margin:0 0 8px;font-size:11px;color:#0f172a}
        .total-card{width:320px;background:#fff;border-radius:12px;padding:14px;border-left:6px solid #1f6feb;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;box-shadow:0 8px 22px rgba(15,37,78,0.06)}
        .total-label{font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase}
        .total-amount{margin-top:8px;font-size:28px;color:#0f172a;font-weight:900}
        .total-sub{font-size:10px;color:#64748b;margin-top:6px}
        /* Footer */
        .pdf-footer{margin-top:18px;padding-top:12px;border-top:1px solid #f1f5fb;display:flex;justify-content:space-between;align-items:center}
        .contact{font-size:10px;color:#475569}
        .brand-small{font-size:11px;color:#0f172a;font-weight:700}
      </style>

      <div class="top-bar">
        <div class="top-inner">
          <div class="brand">
            <img src="${logoUrl}" class="brand-logo" alt="logo">
            <div>
              <p class="brand-title">DataOR</p>
              <p class="brand-sub">Desarrollo de Software</p>
            </div>
          </div>
          <div class="meta">
            <div class="date">${formattedDate}</div>
            <div class="num">Cotización #${quotation.id}</div>
          </div>
        </div>
      </div>

      <div style="padding:12px 0 0 0">
        <div class="hero" style="padding:0 12px">
          <div>
            <h2 class="proposal-title">PROPUESTA <span class="proposal-accent">COMERCIAL</span></h2>
            <p style="margin:8px 0 0;color:#64748b;font-size:12px;max-width:560px">Soluciones digitales y desarrollo de software a la medida de tu negocio.</p>
          </div>
          <div class="client-card">
            <p style="margin:0;font-size:10px;color:#64748b">CLIENTE</p>
            <h4>${safeClientName}</h4>
            ${safeCompanyName ? `<p style="margin:6px 0 0;color:#475569;font-size:11px">${safeCompanyName}</p>` : ''}
          </div>
        </div>

        <div style="padding:0 12px">
          <div class="services-wrap">
            <div class="services-header">Servicios y valoración</div>
            <table class="services-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Descripción</th>
                  <th class="center">Modalidad</th>
                  <th class="right">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${serviceRows || `<tr><td colspan="4" style="padding:16px;text-align:center;color:#64748b">No hay servicios</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>

        <div style="padding:0 12px">
          <div class="notes-total">
            <div class="notes">
              <h5>Notas importantes</h5>
              <ul style="margin:8px 0 0;padding-left:16px;color:#475569;font-size:11px">
                <li>Tras aprobar el contenido, coordinaremos la entrega o publicación según acordado.</li>
                <li>Precios en ${currency}, impuestos incluidos (si aplica).</li>
                <li>Válida por 15 días desde la fecha de emisión.</li>
              </ul>
            </div>
            <div class="total-card">
              <div class="total-label">Total</div>
              <div class="total-amount">${formatMoney(total)}</div>
              <div class="total-sub">Precios en ${currency} · Impuestos incluidos</div>
            </div>
          </div>

          <div class="pdf-footer">
            <div class="contact">
              <div class="brand-small">DataOR · Desarrollo de Software</div>
              <div style="margin-top:6px">dataor52@gmail.com · www.dataor.org</div>
            </div>
            <div style="text-align:right;color:#64748b;font-size:10px">
              <div>Tel: +57 310 769 5856</div>
              <div>WhatsApp: +57 310 769 5856</div>
            </div>
          </div>
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
