<template>
  <section id="contacto" class="hablemos-section">
    <div class="hbl-container">
      <!-- Alias para enlaces existentes (#hablemos) -->
      <span id="hablemos" class="hbl-anchor" aria-hidden="true"></span>

      <header class="hbl-header">
        <span class="hbl-badge">HABLEMOS</span>
        <h2 class="hbl-title">¿Listo para construir algo con nosotros?</h2>
        <p class="hbl-intro">Una conversación corta, cero fricción: saldrás con claridad, próximos pasos y valor accionable.</p>
      </header>

      <div class="hbl-single">
        <div class="hbl-card">
          <h3 class="hbl-card-title">¿Qué obtienes al contactarnos?</h3>

          <ul class="hbl-benefits">
            <li><strong>Demo gratuito</strong> de 30 minutos con tu caso real</li>
            <li><strong>Diagnóstico rápido</strong> de tu situación actual y oportunidades</li>
            <li><strong>Propuesta técnica</strong> con timeline y presupuesto estimado</li>
            <li><strong>Primer entregable</strong> definido para generar valor inmediato</li>
          </ul>

          <p class="hbl-note">
            Sin compromisos. Respuesta típica: <strong>24–48h</strong>. Si tu proyecto es urgente, te priorizamos.
          </p>

          <div class="hbl-cta-group">
            <a
              class="hbl-cta primary"
              :href="whatsAppHref"
              target="_blank"
              rel="noopener"
            >
              Solicitar demo gratuito
            </a>
            <a class="hbl-cta ghost" href="#servicios">Ver servicios</a>
          </div>

          <div class="hbl-contact">
            <span class="hbl-contact-text">
              Línea directa: <strong>+57 310 769 5856</strong>
            </span>
            <a
              class="hbl-link"
              href="https://www.instagram.com/dataor52?igsh=MWV3MHB3aTB5N3pwNA=="
              target="_blank"
              rel="noopener"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue'

const whatsAppHref =
  'https://wa.me/573107695856?text=' +
  encodeURIComponent(
    'Hola, quiero solicitar un demo gratuito. Mi objetivo es: [describe tu proyecto].\n' +
      'Mi empresa: [opcional].\n' +
      'Disponibilidad para demo: [día/hora preferido].'
  )

let observer: IntersectionObserver | null = null

onMounted(async () => {
  await nextTick()
  const cards = Array.from(document.querySelectorAll('.hbl-card')) as HTMLElement[]
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('in-view'))
    return
  }
  observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer?.unobserve(e.target) } })
  }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' })
  cards.forEach(c => observer?.observe(c))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.hablemos-section { padding:60px 0 70px; --accent-start: var(--primary-blue); --accent-end: var(--dark-blue); --accent-hover: var(--tertiary-blue); }
.hbl-container { max-width:1400px; margin:0 auto; padding:0 clamp(1.2rem,4vw,3.6rem); }
.hbl-anchor { display:block; position:relative; top:-88px; height:1px; width:1px; }
.hbl-header { text-align:center; max-width:900px; margin:0 auto 2.1rem; }
.hbl-badge { display:inline-block; font-size:1.05rem; letter-spacing:.15em; font-weight:600; padding:6px 16px 7px; border-radius:999px; background:var(--bg-secondary); border:1px solid var(--border-primary); backdrop-filter: var(--backdrop-blur); color:var(--text-secondary); margin:0 0 1.1rem; }
.hbl-title { font-size:clamp(1.9rem,3.3vw,2.6rem); line-height:1.15; font-weight:700; margin:0 0 1.1rem; background:linear-gradient(90deg,var(--text-primary),rgba(255,255,255,0.85)); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hbl-intro { font-size:1rem; line-height:1.55; color:var(--text-muted); margin:0 auto; max-width:640px; }

.hbl-single { display:grid; grid-template-columns:minmax(0, 820px); justify-content:center; }
.hbl-card { position:relative; background:var(--bg-secondary); border:1px solid var(--border-secondary); border-radius:24px; padding:1.6rem 1.5rem 1.75rem; backdrop-filter:var(--backdrop-blur); overflow:hidden; display:flex; flex-direction:column; gap:1.15rem; transform:translateY(26px); opacity:0; transition:opacity .6s ease, transform .6s ease, background .45s ease, border-color .4s ease; }
.hbl-card:before { display:none; }
.hbl-card:hover { background:var(--bg-tertiary); border-color:var(--border-primary); }
.hbl-card.in-view { transform:translateY(0); opacity:1; }
.hbl-card-title { margin:0 0 .4rem; font-size:1.05rem; font-weight:680; letter-spacing:.4px; color:var(--text-primary); }
.hbl-benefits { list-style:none; margin:0 0 1rem; padding:0; display:flex; flex-direction:column; gap:.65rem; }
.hbl-benefits li { font-size:.88rem; letter-spacing:.2px; color:var(--text-secondary); position:relative; padding-left:1rem; line-height:1.5; }
.hbl-benefits li:before { content:"✓"; position:absolute; left:0; top:0; color:var(--secondary-blue); font-weight:700; }
.hbl-benefits strong { color:var(--text-primary); font-weight:680; }
.hbl-note { margin:0; font-size:.82rem; line-height:1.55; color:var(--text-muted); }
.hbl-note strong { color:var(--text-primary); font-weight:650; }
.hbl-cta-group { display:flex; flex-wrap:wrap; gap:.8rem; }
.hbl-cta { font-size:.7rem; letter-spacing:.25em; font-weight:650; padding:.85rem 1.25rem .8rem; border-radius:18px; cursor:pointer; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#e6f0f9; text-transform:uppercase; transition:.45s ease; }
.hbl-cta.primary { background:linear-gradient(125deg,var(--accent-start),var(--accent-end)); border-color:rgba(255,255,255,0.15); color:#fff; }
.hbl-cta.primary:hover { background:linear-gradient(125deg,var(--accent-hover),var(--accent-end)); filter:brightness(1.05); }
.hbl-cta.ghost:hover { background:rgba(255,255,255,0.1); }
.hbl-cta.primary:hover { filter:brightness(1.12); }

.hbl-cta { text-decoration:none; display:inline-flex; align-items:center; justify-content:center; }
.hbl-cta.ghost { background:transparent; border-color:var(--border-primary); color:var(--text-primary); }
.hbl-cta.ghost:hover { background:var(--bg-tertiary); }

@media (max-width:780px){
  .hbl-card { padding:1.35rem 1.25rem 1.5rem; border-radius:22px; }
  .hbl-card-title { font-size:.95rem; }
  .hbl-cta { font-size:.62rem; padding:.75rem 1rem .7rem; }
  .hbl-title { font-size:clamp(1.9rem,7vw,2.3rem); }
}

.hbl-contact { display:flex; flex-wrap:wrap; gap:.7rem; align-items:center; }
.hbl-contact-text { font-size:.66rem; letter-spacing:.08em; color:var(--text-secondary); background:var(--bg-tertiary); padding:.55rem .75rem; border:1px solid var(--border-secondary); border-radius:14px; display:inline-flex; gap:.35rem; align-items:center; }
.hbl-contact-text strong { font-weight:650; color:var(--text-primary); letter-spacing:.06em; }
.hbl-link { font-size:.66rem; letter-spacing:.18em; text-transform:uppercase; font-weight:650; color:var(--text-primary); text-decoration:none; padding:.65rem 1rem .6rem; border-radius:16px; border:1px solid var(--border-secondary); background:transparent; transition:.35s ease; }
.hbl-link:hover { background:var(--bg-tertiary); border-color:var(--border-primary); }

@media (max-width:780px){
  .hbl-contact { flex-direction:column; align-items:stretch; }
  .hbl-link { justify-content:center; text-align:center; }
  .hbl-contact-text { width:100%; justify-content:center; }
}
</style>
