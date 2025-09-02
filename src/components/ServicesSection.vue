<template>
  <section id="servicios" class="services-section">
    <div class="container">
      <div class="section-header">
        <span class="section-badge">NUESTROS SERVICIOS</span>
        <h2 class="section-title">Transformamos datos en decisiones que multiplican tus resultados</h2>
      </div>
      <div class="services-grid minimal-services">
        <div class="service-card simple">
          <div class="service-icon-circle"><span class="icon-emoji" aria-hidden="true">⚡</span></div>
          <h3 class="service-title simple-title">Desarrollo de<br>Software</h3>
          <div class="service-title-divider" aria-hidden="true"></div>
          <p class="service-description simple-desc">Creamos aplicaciones personalizadas, robustas y escalables adaptadas a las necesidades de tu negocio usando tecnología moderna.</p>
        </div>
        <div class="service-card simple">
          <div class="service-icon-circle"><span class="icon-emoji" aria-hidden="true">📊</span></div>
          <h3 class="service-title simple-title">Análisis y<br>Visualización de<br>Datos</h3>
          <div class="service-title-divider" aria-hidden="true"></div>
            <p class="service-description simple-desc">Convertimos datos en insights accionables mediante analítica avanzada y dashboards claros para decisiones estratégicas.</p>
        </div>
        <div class="service-card simple">
          <div class="service-icon-circle"><span class="icon-emoji" aria-hidden="true">🚀</span></div>
          <h3 class="service-title simple-title">Páginas Web<br>Modernas</h3>
          <div class="service-title-divider" aria-hidden="true"></div>
          <p class="service-description simple-desc">Sitios responsivos, rápidos y optimizados para SEO que potencian tu presencia digital y convierten mejor.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<!-- Componente estático sin lógica dinámica -->

<style scoped>
.services-section { padding: 120px 0; }
.services-section[aria-busy='true'] { opacity:.7; }
/* Padding lateral adaptable */
.services-section .container { padding-left:clamp(1rem,5vw,3.5rem); padding-right:clamp(1rem,5vw,3.5rem); }

/* Encabezado centrado */
.section-header { text-align:center; max-width:900px; margin:0 auto 3rem; padding:0 1rem; }
.section-header .section-title { font-size:clamp(1.9rem,3.3vw,2.6rem); line-height:1.15; font-weight:700; margin:0 0 1rem; letter-spacing:.5px; }
.section-header .section-subtitle { font-size:clamp(.95rem,1.4vw,1.05rem); color:#cfd7e0; margin:0; line-height:1.4; }
.section-header .section-badge { display:inline-block; font-size:1.12rem; letter-spacing:.15em; font-weight:600; padding:6px 16px 7px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.14); backdrop-filter:blur(6px); color:#d5dde6; margin:0 0 1.1rem; }

/* Grid adaptable */
.minimal-services { --svc-cols:3; display:grid; gap:3rem; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); }
@media (min-width: 1100px){ .minimal-services { grid-template-columns:repeat(var(--svc-cols),minmax(0,1fr)); } }

/* Card */
.service-card.simple { position:relative; background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.09); border-radius:24px; padding:4.2rem 1.1rem .8rem; backdrop-filter:blur(10px); box-shadow:0 4px 10px -2px rgba(0,0,0,0.4),0 10px 28px -10px rgba(0,0,0,0.45); overflow:hidden; animation:fadeUp .55s both ease-out; transition:transform .45s ease,box-shadow .45s ease,border-color .45s ease, background .45s ease; cursor:default; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:1.05rem; min-height:430px; }
.service-card.simple.in-view { transform:translateY(0); opacity:1; }
.service-card.simple:hover { transform:translateY(-6px); box-shadow:0 10px 20px -6px rgba(0,0,0,0.55),0 26px 46px -18px rgba(0,0,0,0.55); border-color:rgba(255,255,255,0.18); background:rgba(255,255,255,0.05); }
.service-card.simple:focus-visible { outline:none; }
.service-card.simple:focus-visible .focus-ring { opacity:1; transform:scale(1); }
.focus-ring { position:absolute; inset:0; border:2px solid hsla(var(--grad-hue),95%,70%,0.9); border-radius:inherit; padding:2px; box-shadow:0 0 0 4px rgba(255,255,255,0.08),0 0 0 8px rgba(0,0,0,0.55) inset; opacity:0; transform:scale(.92); transition:.4s ease; pointer-events:none; }

.service-icon-circle { width:66px; height:66px; border-radius:20px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; margin:0 0 1rem; position:relative; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1); }
.icon-emoji, .icon-component { font-size:26px; line-height:1; filter:drop-shadow(0 3px 4px rgba(0,0,0,0.45)); }

.simple-title { font-size:1.35rem; font-weight:650; line-height:1.25; letter-spacing:.4px; white-space:pre-line; color:#ffffff; margin:0 0 .75rem; text-align:center; text-transform:none; }
.service-title-divider { width:46%; height:2px; margin:0 auto .85rem; background:rgba(255,255,255,0.2); border-radius:2px; }
.simple-desc { font-size:.98rem; line-height:1.6; color:#d0d7df; letter-spacing:.3px; padding:0 .25rem; text-align:center; margin:0 auto 0; max-width:420px; opacity:.95; }

/* Skeleton */
.services-skeleton { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:3rem; }
.skeleton-card { position:relative; border:1px solid rgba(255,255,255,0.08); border-radius:28px; padding:2.4rem 2rem; background:linear-gradient(140deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)); overflow:hidden; }
.skeleton-card:after { content:""; position:absolute; inset:0; background:linear-gradient(110deg,transparent 0%,rgba(255,255,255,0.08) 45%,transparent 90%); animation:shimmer 1.6s linear infinite; }
.skeleton-icon { width:84px; height:84px; border-radius:26px; background:rgba(255,255,255,0.08); margin:0 0 1.8rem; }
.skeleton-line { height:12px; background:rgba(255,255,255,0.08); border-radius:6px; margin:0 0 14px; }
.skeleton-line.short { width:55%; }
.skeleton-line:not(.short) { width:100%; }

/* Empty state */
.empty { text-align:center; margin-top:2rem; color:#c8d5e3; }
.empty p { margin:0 0 .6rem; }

@keyframes shimmer { 0% { transform:translateX(-60%); } 100% { transform:translateX(60%); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
@media (min-width:1120px){ .minimal-services{ gap:3.4rem; } }
@media (max-width:640px){ .service-card.simple { padding:2.6rem .9rem 2.4rem; min-height:400px; } .service-icon-circle { width:54px; height:54px; margin-bottom:.85rem; } .simple-title { font-size:1.22rem; } .simple-desc { font-size:.9rem; max-width:100%; } }
</style>
