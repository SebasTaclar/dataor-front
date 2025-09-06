<template>
  <section id="proyectos" class="featured-projects">
    <div class="fp-container">
      <header class="fp-header">
        <span class="fp-badge">PROYECTOS DESTACADOS</span>
        <h2 class="fp-title">Impacto tangible impulsado por datos</h2>
        <p class="fp-subtitle">Algunas historias recientes donde combinamos ingeniería, analítica y producto para generar ventajas competitivas.</p>
      </header>
      <div class="simple-projects-grid">
        <article v-for="p in projects" :key="p.id" class="simple-project-card" :class="{'in-view': inViewIds.has(p.id)}" ref="cards">
          <div class="spc-banner">
            <div class="spc-banner-inner">
              <span class="spc-icon" aria-hidden="true">{{ p.icon }}</span>
              <h3 class="spc-banner-title">{{ p.bannerTitle }}</h3>
            </div>
          </div>
          <div class="spc-body">
            <h4 class="spc-title">{{ p.title }}</h4>
            <span class="spc-underline"></span>
            <p class="spc-desc">{{ p.description }}</p>
            <ul v-if="p.points?.length" class="spc-points">
              <li v-for="pt in p.points" :key="pt">{{ pt }}</li>
            </ul>
            <div v-if="p.tags?.length" class="spc-tags">
              <span v-for="t in p.tags" :key="t" class="spc-tag">{{ t }}</span>
            </div>
            <div v-if="p.link" class="spc-link-slot">
              <a :href="p.link" class="spc-link" target="_blank" rel="noopener">Ver proyecto →</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'

interface SimpleProject { id:number; bannerTitle:string; title:string; description:string; icon:string; points?:string[]; tags?:string[]; link?:string }

const projects = reactive<SimpleProject[]>([
  { id:1, bannerTitle:'Página de Torneos', title:'Plataforma de Gestión de Torneos', description:'Inscripción online, cuadros automáticos, ranking en vivo y pagos integrados para agilizar toda la operación.', icon:'🏆', points:['Inscripciones en tiempo real','Generador de fixtures','Resultados y estadísticas','Notificaciones automáticas'],  link:'https://victorious-river-0b75df50f.1.azurestaticapps.net/' },
  { id:2, bannerTitle:'Gestión de Herramientas', title:'Control de Construcción & Costos', description:'Seguimiento de avance físico vs plan, desvíos de presupuesto y alertas tempranas basadas en datos IoT.', icon:'🏗️', points:['Curva S dinámica','Reportes automáticos','Integración sensores','Dashboard ejecutivo'], link:'https://www.aypspa.net/' },
  { id:3, bannerTitle:'CDAs', title:'Gestión de Centros de Diagnóstico', description:'Agenda, inspecciones, emisión de certificados y trazabilidad regulatoria centralizados en un solo sistema.', icon:'🛠️', points:['Turnos inteligentes','Workflow de inspección','Firma y certificados','Indicadores normativos'], link:'https://cdadm.netlify.app/' },
  { id:4, bannerTitle:'Fondos Digitales', title:'Plataforma de Inversión Digital', description:'Sistema integral para gestión de fondos, análisis de riesgo y seguimiento de portafolios con herramientas avanzadas de analítica.', icon:'💰', points:['Dashboard de inversiones','Análisis de riesgo automático','Reportes regulatorios','API de integración'], link:'https://zealous-beach-0447ece0f.2.azurestaticapps.net/' },
  { id:5, bannerTitle:'Agencia de Talentos', title:'Sistema de Gestión de Talento', description:'Plataforma end-to-end para reclutamiento, evaluación y seguimiento de candidatos con IA para matching automático.', icon:'👥', points:['Portal de candidatos','Matching automático con IA','Evaluaciones digitales','Dashboard de recruiters'], link:'https://sdagencia.netlify.app/' },
  { id:6, bannerTitle:'Tercerización Industrial', title:'Sistema de Gestión de Producción', description:'Empresa especializada en tercerización de procesos de producción, ensamble y producto terminado con trazabilidad completa.', icon:'🏭', points:['Control de líneas de producción','Trazabilidad de productos','Gestión de ensamble','Reportes de calidad'], link:'https://orange-beach-00270290f.1.azurestaticapps.net/' }
])

const inViewIds = reactive<Set<number>>(new Set())
const cards = ref<HTMLElement[] | null>(null)

onMounted(async () => {
  await nextTick()
  cards.value = Array.from(document.querySelectorAll('.simple-project-card')) as HTMLElement[]
  const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) inViewIds.add(Number((e.target as HTMLElement).dataset.pid)) }) }, { threshold: .35 })
  cards.value.forEach((el,i)=>{ el.dataset.pid = String(projects[i].id); observer.observe(el) })
})
</script>

<style scoped>
/* Base se mantiene */
.featured-projects { padding: 130px 0 120px; position:relative; }
.fp-container { max-width: 1500px; margin:0 auto; padding:0 clamp(1.4rem,4vw,4rem); }
.fp-header { text-align:center; max-width:1000px; margin:0 auto 3.2rem; }
.fp-badge { display:inline-block; font-size:1.15rem; letter-spacing:.2em; font-weight:600; padding:7px 18px 8px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.14); color:#d3dde6; margin:0 0 1.1rem; }
.fp-title { font-size:clamp(1.9rem,3.3vw,2.6rem); line-height:1.15; font-weight:700; margin:0 0 1.2rem; background:linear-gradient(90deg,#fff,#d9e6f5); -webkit-background-clip:text; background-clip:text; color:transparent; }
.fp-subtitle { font-size:1rem; line-height:1.55; color:#c4d0da; max-width:740px; margin:0 auto; }

.simple-projects-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1.6rem 1.8rem; }
/* Fondo estilo AboutSection highlight */
.simple-project-card { background:linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.1); border-radius:26px; overflow:hidden; display:flex; flex-direction:column; transform:translateY(26px); opacity:0; backdrop-filter:blur(14px); transition:opacity .55s ease, transform .55s ease, background .55s ease, border-color .45s ease; position:relative; }
.simple-project-card:before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 18% 15%,rgba(255,255,255,0.18),transparent 70%); opacity:.35; mix-blend-mode:overlay; pointer-events:none; }
.simple-project-card.in-view { transform:translateY(0); opacity:1; }
.simple-project-card:hover { background:linear-gradient(150deg,rgba(255,255,255,0.1),rgba(255,255,255,0.035)); border-color:rgba(255,255,255,0.25); }

.spc-banner { position:relative; padding:.9rem 1.15rem .15rem; min-height:70px; display:flex; align-items:flex-end; }
.spc-banner-inner { position:relative; z-index:1; display:flex; flex-direction:row; align-items:center; gap:.65rem; }
.spc-icon { font-size:1.55rem; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.45)); }
.spc-banner-title { font-size:1.02rem; font-weight:650; color:#fff; margin:0; letter-spacing:.4px; }
.spc-body { padding:.4rem 1.15rem 1.1rem; flex:1; display:flex; flex-direction:column; }
.spc-title { font-size:.95rem; font-weight:650; margin:0 0 .5rem; color:#fff; letter-spacing:.4px; }
.spc-underline { width:30px; height:2px; background:linear-gradient(90deg,#00d2ff,#8a82ff); border-radius:2px; display:block; margin:0 0 .6rem; }
.spc-desc { font-size:.74rem; line-height:1.45; color:#d2dbe2; margin:0 0 .65rem; }
.spc-points { list-style:none; margin:0 0 .8rem; padding:0; display:flex; flex-direction:column; gap:.38rem; }
.spc-points li { font-size:.62rem; letter-spacing:.3px; color:#c2cdda; position:relative; padding-left:.85rem; }
.spc-points li:before { content:'•'; position:absolute; left:0; top:0; color:#6bc5ff; font-weight:700; }
.spc-tags { margin-top:auto; display:flex; flex-wrap:wrap; gap:.4rem; }
.spc-tag { font-size:.48rem; letter-spacing:.28em; font-weight:600; padding:.36rem .58rem .32rem; border-radius:999px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.18); color:#e7f3ff; text-transform:uppercase; }
.spc-link-slot { margin-top:.9rem; }
.spc-link { font-size:.58rem; font-weight:650; letter-spacing:.22em; text-transform:uppercase; text-decoration:none; color:#8fd4ff; display:inline-flex; align-items:center; gap:.35rem; position:relative; }
.spc-link:after { content:""; position:absolute; left:0; bottom:-2px; width:100%; height:1px; background:linear-gradient(90deg,#00d2ff,#8a82ff); transform:scaleX(.45); transform-origin:left; transition:.4s ease; }
.spc-link:hover:after { transform:scaleX(1); }

@media (max-width:640px){
  .simple-projects-grid { gap:1.15rem 1rem; }
  .simple-project-card { border-radius:22px; }
  .spc-banner { min-height:64px; padding:.75rem 1rem .1rem; }
  .spc-banner-title { font-size:.95rem; }
  .spc-title { font-size:.88rem; }
  .spc-desc { font-size:.68rem; }
  .spc-points li { font-size:.56rem; }
  .spc-link { font-size:.52rem; }
}
</style>
