<template>
  <section id="nosotros" class="about-section">
    <div class="container">
      <div class="about-header">
        <span class="section-badge">QUIÉNES SOMOS</span>
        <h2 class="about-title">Impulsamos decisiones inteligentes con tecnología y datos</h2>
        <p class="about-intro header-intro">
          Somos un equipo multidisciplinario de ingenieros, científicos de datos y diseñadores que
          construyen soluciones tecnológicas centradas en resultados. Acompañamos a organizaciones
          en su evolución digital, reduciendo fricción, acelerando el time‑to‑value y generando
          ventajas competitivas sostenibles.
        </p>
      </div>
      <div class="about-grid">
        <div class="about-main">


          <div class="about-highlights">
            <div class="highlight" v-for="h in highlights" :key="h.title">
              <div class="icon">{{ h.icon }}</div>
              <div class="text">
                <h3>{{ h.title }}</h3>
                <p>{{ h.desc }}</p>
              </div>
            </div>
          </div>

          <div class="about-stats">
            <div class="stat" v-for="s in stats" :key="s.label" :class="{ animating: s.animating }">
              <span class="value">{{ formatValue(s) }}</span>
              <span class="label">{{ s.label }}</span>
            </div>
          </div>
          <p class="stats-footnote">Confianza respaldada por resultados reales.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const highlights = ref([
  { icon:'🎯', title:'Estrategia accionable', desc:'Traducimos retos de negocio en hojas de ruta claras y medibles.' },
  { icon:'⚙️', title:'Arquitecturas escalables', desc:'Diseños modulares, seguros y preparados para crecer contigo.' },
  { icon:'📊', title:'Inteligencia de datos', desc:'Desde ingesta y modelado hasta analítica avanzada y ML.' },
  { icon:'🤝', title:'Acompañamiento cercano', desc:'Colaboración continua con enfoque en transferencia de conocimiento.' }
])

interface StatItem {
  target: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
  current: number
  animated: boolean
  animating: boolean
}

const stats = ref<StatItem[]>([
  { target: 8, label: 'Años experiencia', suffix: '+', current: 0, animated:false, animating:false, duration: 800 },
  { target: 30, label: 'Ahorro promedio', suffix: '%', current: 0, animated:false, animating:false, duration: 900 },
  { target: 98, label: 'Satisfacción', prefix: '+', suffix: '%', current: 0, animated:false, animating:false, duration: 1000 }
])

let observer: IntersectionObserver | null = null
let wasVisible = false
const numberFormatter = new Intl.NumberFormat('es-ES')

function animate(stat: StatItem) {
  if (stat.animated) return
  stat.animated = true
  stat.animating = true
  const start = performance.now()
  const duration = stat.duration ?? 1000
  const from = 0
  const to = stat.target
  function step(now: number) {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    stat.current = from + (to - from) * eased
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      stat.current = to
      stat.animating = false
    }
  }
  requestAnimationFrame(step)
}

function formatValue(stat: StatItem) {
  return `${stat.prefix ?? ''}${numberFormatter.format(Math.round(stat.current))}${stat.suffix ?? ''}`
}

onMounted(() => {
  const targetEl = document.querySelector('.about-stats')
  if (!targetEl) return
  observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !wasVisible) {
        wasVisible = true
        stats.value.forEach(s => animate(s))
      } else if (!e.isIntersecting && wasVisible) {
        // Reset to allow re-animating when it re-enters
        wasVisible = false
  stats.value.forEach(s => { s.animated = false; s.animating=false; s.current = 0 })
      }
    })
  }, { threshold: 0.35 })
  observer.observe(targetEl)
})

onBeforeUnmount(() => observer?.disconnect())


</script>

<style scoped>
.about-section { padding:130px 0; }
.about-section .container { max-width:1400px; padding:0 clamp(1.2rem,4vw,3.6rem); margin:0 auto; }
.about-header { text-align:center; max-width:1050px; margin:0 auto 3.8rem; }
.about-grid { width:100%; max-width:1380px; margin:0 auto; display:block; }
.about-main { text-align:center; margin:0 auto; }
.about-intro { margin-left:auto; margin-right:auto; }
.about-highlights { justify-items:stretch; }
.about-highlights .highlight { text-align:left; }

.about-side { align-self:start; }

.section-badge { display:inline-block; font-size:1.12rem; letter-spacing:.15em; font-weight:600; padding:6px 16px 7px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.14); backdrop-filter:blur(6px); color:#d5dde6; margin:0 0 1.1rem; }
.about-title { font-size:clamp(1.9rem,3.3vw,2.6rem); line-height:1.15; font-weight:700; margin:0 0 1.2rem; letter-spacing:.5px; background:linear-gradient(90deg,#fff,#d9e4f3); -webkit-background-clip:text; background-clip:text; color:transparent; }
.about-intro { font-size:1.02rem; line-height:1.55; max-width:760px; color:#d3dde6; margin:0 auto 2.2rem; }
.about-intro.header-intro { margin-bottom:3.2rem; }

.about-highlights { display:grid; gap:1.6rem 1.8rem; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); justify-content:center; margin:0 auto 3.4rem; max-width:1380px; }
.highlight { display:flex; gap:1rem; padding:1.4rem 1.5rem 1.5rem; background:linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.1); border-radius:26px; backdrop-filter:blur(14px); transition:.45s ease, border-color .45s ease, transform .5s ease; position:relative; overflow:hidden; min-height:170px; }
.highlight:before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 18% 15%,rgba(255,255,255,0.18),transparent 70%); opacity:.4; mix-blend-mode:overlay; pointer-events:none; }
.highlight:hover { background:linear-gradient(150deg,rgba(255,255,255,0.1),rgba(255,255,255,0.035)); border-color:rgba(255,255,255,0.25); transform:translateY(-6px); }
.highlight .icon { font-size:1.75rem; width:54px; height:54px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:18px; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.45)); }
.highlight h3 { font-size:1.12rem; margin:0 0 .45rem; font-weight:680; letter-spacing:.4px; color:#fff; line-height:1.25; }
.highlight p { font-size:.84rem; margin:0; line-height:1.45; color:#cfd7df; letter-spacing:.28px; }

.about-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); justify-content:center; gap:1.6rem; margin:0 auto 2.2rem; max-width:1380px; }
.stat { padding:2rem 1.5rem 1.9rem; text-align:center; background:linear-gradient(165deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025)); border:1px solid rgba(255,255,255,0.1); border-radius:30px; position:relative; overflow:hidden; transition:.5s ease; backdrop-filter:blur(12px); min-height:180px; }
.stat:before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 30% 25%,rgba(255,255,255,0.18),transparent 70%); opacity:.55; mix-blend-mode:overlay; pointer-events:none; }
.stat:after { content:""; position:absolute; inset:0; background:linear-gradient(120deg,rgba(255,255,255,0.18),rgba(255,255,255,0) 55%); opacity:0; transition:.6s ease; mix-blend-mode:overlay; }
.stat:hover { border-color:rgba(255,255,255,0.28); background:linear-gradient(165deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03)); transform:translateY(-6px); }
.stat:hover:after { opacity:.6; }
.stat .value { display:block; font-size:clamp(1.9rem,2.7vw,2.25rem); font-weight:720; letter-spacing:.5px; color:#fff; margin:0 0 .55rem; transition:transform .6s cubic-bezier(.22,1.4,.36,1), filter .6s; }
.stat.animating .value { animation:pulseCount 0.85s ease-in-out .15s infinite alternate; }
.stat .label { font-size:.7rem; text-transform:uppercase; letter-spacing:.23em; color:#d0dae3; font-weight:600; opacity:.9; }
.stats-footnote { font-size:.78rem; letter-spacing:.3px; color:#9fb1c4; margin:0 auto 0; opacity:.85; }

.about-side { display:flex; flex-direction:column; gap:2.6rem; }
.pillar-box, .stack-box { padding:1.9rem 1.6rem 2.1rem; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.025); border-radius:22px; backdrop-filter:blur(8px); box-shadow:0 4px 14px -4px rgba(0,0,0,0.4); }
.pillar-box h3, .stack-box h3 { margin:0 0 1.1rem; font-size:.95rem; font-weight:650; letter-spacing:.5px; color:#fff; }
.pillar-box ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.55rem; }
.pillar-box li { font-size:.78rem; line-height:1.35; letter-spacing:.4px; color:#d2dbe3; position:relative; padding-left:1rem; }
.pillar-box li:before { content:"•"; position:absolute; left:0; top:0; color:#77c3ff; }

.stack-groups { display:flex; flex-direction:column; gap:1.4rem; }
.stack-group h4 { margin:0 0 .6rem; font-size:.78rem; font-weight:640; letter-spacing:.4px; text-transform:uppercase; color:#cfd8e2; }
.tags { display:flex; flex-wrap:wrap; gap:.5rem; }
.tag { font-size:.65rem; letter-spacing:.5px; padding:.5rem .75rem .45rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:14px; color:#d9e4ef; backdrop-filter:blur(4px); }
.tag:hover { background:rgba(255,255,255,0.08); }

@media (max-width:1100px){
  .about-header { margin-bottom:2.6rem; }
  .about-highlights { gap:1.4rem 1.5rem; }
  .about-stats { gap:1.4rem; }
  .stat { min-height:160px; padding:1.6rem 1.2rem 1.5rem; }
}
@media (max-width:900px){
  .about-highlights { gap:1.25rem 1.25rem; }
  .about-stats { gap:1.1rem; }
  .stat { min-height:150px; }
}
@media (max-width:620px){
  .about-section { padding:90px 0; }
  .about-highlights { margin-bottom:2.4rem; }
  .about-title { font-size:clamp(1.9rem,7vw,2.3rem); }
  .about-intro { font-size:.95rem; }
  .highlight { padding:1.1rem 1.1rem 1.2rem; border-radius:20px; }
  .highlight .icon { width:46px; height:46px; font-size:1.55rem; }
  .highlight h3 { font-size:1rem; }
  .highlight p { font-size:.74rem; }
  .stat { padding:1.45rem 1rem 1.3rem; border-radius:24px; }
  .stat .value { font-size:1.7rem; }
  .stat .label { font-size:.6rem; }
}

@keyframes pulseCount { from { transform:translateY(0) scale(0.95); filter:brightness(1); } to { transform:translateY(-2px) scale(1.04); filter:brightness(1.25); } }
</style>
