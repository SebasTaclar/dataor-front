<template>
 <section class="hero" id="inicio">
        <div class="hero-layout">
            <div class="hero-copy" data-aos="fade-right">
                <!-- <div class="eyebrow">PLATAFORMA DATA · SOFTWARE · IA</div> -->
                <h1>Impulsa tu negocio con datos accionables y software escalable</h1>
                <p class="hero-lead">Diseñamos soluciones de analítica, desarrollo y arquitectura digital que aceleran decisiones, optimizan procesos y generan ventajas competitivas reales.</p>
          <div class="hero-actions">
          <a href="#servicios" class="cta-large">Ver soluciones</a>
          <a href="#contacto" class="btn-ghost">Hablemos</a>
        </div>
                <div class="badges">
                    <span class="badge">Analytics</span>
                    <span class="badge">Arquitectura</span>
                    <span class="badge">Automatización</span>
                    <span class="badge">IA</span>
                </div>
            </div>
            <div class="hero-panel" data-aos="fade-left" data-aos-delay="150">
                <div class="metrics-card">
                    <div class="panel-title">Resultados Comprobados</div>
                    <div class="metrics-grid">
                        <div class="metric">
                            <h4>Clientes</h4>
                            <div class="value">25+</div>
                            <small>Empresas activas</small>
                        </div>
                        <div class="metric">
                            <h4>ROI Promedio</h4>
                            <div class="value">240%</div>
                            <small>En 12 meses</small>
                        </div>
                        <div class="metric">
                            <h4>Uptime</h4>
                            <div class="value">99.8%</div>
                            <small>Sistemas críticos</small>
                        </div>
                        <div class="metric">
                            <h4>Reducción</h4>
                            <div class="value">-45%</div>
                            <small>Tiempo procesos</small>
                        </div>
                    </div>
                    <div>
                        <h4 style="font-size:.75rem; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:rgba(255,255,255,.7); margin-bottom:.4rem;">Rendimiento Actual</h4>
                        <div class="activity-bars" aria-hidden="true">
                          <span v-for="(b,i) in barCount" :key="i" class="activity-bar" :style="barAnimStyle(i)"></span>
                        </div>
                        <div class="note" style="margin-top:.6rem;">Datos basados en proyectos implementados en 2024</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Simulación barras actividad
const barCount = 8
const barAnimStyle = (i: number) => {
  const min = 0.25 + ((i * 7) % 10) / 100
  const max = 0.55 + ((i * 11) % 30) / 100
  return { '--delay': `${(i * 0.28).toFixed(2)}s`, '--min': min.toFixed(2), '--max': max.toFixed(2) }
}
</script>

<style scoped>


.hero {
        position: relative;
        min-height: 92vh;
        display: flex;
        align-items: stretch;
        background: linear-gradient(120deg,#0A0E1A 0%,#111F3C 55%,#162B52 100%);
        padding-top: 90px; /* espacio bajo header */
        overflow: hidden;
        isolation: isolate;
    }
    .hero:before, .hero:after {
        content:""; position:absolute; inset:0; pointer-events:none;
    }
    .hero:before { background:
        radial-gradient(circle at 18% 30%,rgba(0,210,255,.18),transparent 60%),
        radial-gradient(circle at 85% 70%,rgba(139,92,246,.15),transparent 65%);
        mix-blend-mode:screen; }
    .hero:after { background:linear-gradient(180deg,rgba(10,14,26,0) 0%,rgba(10,14,26,.85) 110%); }
    /* Mantener la sección hero estática (sin parallax) */
    .hero { transform: none !important; will-change: auto; }
    .hero-layout { width:100%; max-width:1500px; margin:0 auto; display:grid; grid-template-columns: minmax(320px,1fr) minmax(380px,520px); gap:3.5rem; padding:2.5rem clamp(1.5rem,4vw,4rem) 4rem; position:relative; z-index:2; }
    .hero-copy { display:flex; flex-direction:column; justify-content:center; }
    .eyebrow { font-size:.8rem; letter-spacing:2px; font-weight:600; text-transform:uppercase; color:var(--accent-cyan); background:rgba(255,255,255,.06); padding:.5rem .9rem; border:1px solid rgba(255,255,255,.15); width:fit-content; border-radius:40px; backdrop-filter:blur(8px); margin-bottom:1.4rem; }
    .hero-copy h1 { font-size:clamp(2.4rem,4.6vw,3.6rem); line-height:1.08; font-weight:800; letter-spacing:-.5px; background:linear-gradient(90deg,#ffffff 0%,#dff8ff 60%,#a4dfff 100%); -webkit-background-clip:text; background-clip:text; color:transparent; margin-bottom:1.4rem; }
    .hero-copy h1 .accent { background:var(--gradient-secondary); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .hero-lead { font-size:1.15rem; max-width:60ch; color:rgba(255,255,255,.82); margin-bottom:2.1rem; line-height:1.6; }
    .hero-actions { display:flex; flex-wrap:wrap; gap:1rem; margin-bottom:2.2rem; }
  .cta-large, .btn-ghost { background:rgba(255,255,255,.085); border:1px solid rgba(255,255,255,.22); color:#e9f5ff; font-size:.95rem; font-weight:600; padding:.85rem 1.65rem; border-radius:42px; cursor:pointer; display:inline-block; letter-spacing:.5px; position:relative; text-decoration:none; box-shadow:0 2px 10px -4px rgba(255,255,255,.18),0 0 0 1px rgba(255,255,255,.05); backdrop-filter:blur(6px); transition:background .35s ease, box-shadow .4s ease, color .3s ease, transform .35s ease; }
  .cta-large:before, .btn-ghost:before { content:""; position:absolute; inset:0; border-radius:inherit; background:linear-gradient(140deg,rgba(255,255,255,.55),rgba(255,255,255,0) 65%); opacity:.18; pointer-events:none; mix-blend-mode:overlay; }
  .cta-large:hover, .btn-ghost:hover { background:rgba(255,255,255,.15); color:#ffffff; box-shadow:0 6px 20px -8px rgba(255,255,255,.35); transform:translateY(-3px); }
  .cta-large:active, .btn-ghost:active { transform:translateY(-1px); box-shadow:0 3px 10px -4px rgba(255,255,255,.25); }
  .cta-large:focus-visible, .btn-ghost:focus-visible { outline:2px solid rgba(140,210,255,.85); outline-offset:2px; }
    .badges { display:flex; flex-wrap:wrap; gap:.7rem; }
    .badge { font-size:.7rem; letter-spacing:1px; font-weight:600; text-transform:uppercase; padding:.45rem .75rem; background:rgba(255,255,255,.08); color:var(--accent-cyan); border:1px solid rgba(255,255,255,.15); border-radius:6px; backdrop-filter:blur(6px); }
    .hero-panel { position:relative; display:flex; align-items:center; justify-content:center; }
    .metrics-card { position:relative; width:100%; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.15); border-radius:28px; padding:2.2rem 2rem 2.6rem; backdrop-filter:blur(14px); box-shadow:0 10px 40px -10px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.05); overflow:hidden; }
    .metrics-card:before { content:""; position:absolute; inset:0; background: radial-gradient(circle at 25% 20%,rgba(255,255,255,.35),rgba(255,255,255,0) 60%), linear-gradient(140deg,rgba(0,210,255,.25),rgba(139,92,246,.25)); mix-blend-mode:overlay; opacity:.55; }
    .metrics-grid { display:grid; grid-template-columns:repeat(2,minmax(120px,1fr)); gap:1.4rem 1.2rem; margin-bottom:1.8rem; }
    .metric { padding:.85rem .9rem 1rem; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); border-radius:16px; position:relative; overflow:hidden; }
    .metric h4 { font-size:.72rem; font-weight:600; letter-spacing:1px; color:rgba(255,255,255,.65); text-transform:uppercase; margin-bottom:.45rem; }
    .metric .value { font-size:1.45rem; font-weight:700; background:linear-gradient(90deg,#fff,#b8f4ff); -webkit-background-clip:text; background-clip:text; color:transparent; letter-spacing:.5px; }
    .metric small { display:block; font-size:.65rem; color:rgba(255,255,255,.55); margin-top:.2rem; }
    .panel-title { font-size:.85rem; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:rgba(255,255,255,.75); margin-bottom:1rem; }
  /* Barras actividad nuevas */
  .activity-bars { display:flex; align-items:flex-end; gap:12px; height:60px; margin-top:.35rem; }
  .activity-bar { --min:.3; --max:.9; flex:1; height:100%; background:linear-gradient(180deg,#7adfff 0%,#55caff 55%,#7bb5ff 100%); border-radius:8px 8px 4px 4px; position:relative; overflow:hidden; animation:pulseBar 3.8s ease-in-out infinite; animation-delay:var(--delay); transform-origin:bottom; box-shadow:0 6px 18px -8px rgba(0,210,255,.4),0 0 0 1px rgba(255,255,255,.07); }
  .activity-bar:after { content:""; position:absolute; inset:0; background:linear-gradient(140deg,rgba(255,255,255,.55),rgba(255,255,255,0) 65%); mix-blend-mode:overlay; opacity:.35; }
  @keyframes pulseBar { 0% { transform:scaleY(var(--min)); filter:brightness(.95);} 45% { transform:scaleY(var(--max)); filter:brightness(1.07);} 55% { transform:scaleY(calc(var(--max) - .12)); } 100% { transform:scaleY(var(--min)); filter:brightness(.92);} }
    .note { font-size:.7rem; color:rgba(255,255,255,.55); letter-spacing:.5px; }
    @media (max-width: 960px){
        .hero-layout { grid-template-columns: 1fr; padding:2.5rem 2rem 4rem; }
        .hero-panel { order:-1; }
        .metrics-card { margin:0 auto 1.5rem; max-width:600px; }
        .hero { min-height: auto; }
        .hero-actions { justify-content:flex-start; }
    }
    @media (max-width: 560px){
        .hero-copy h1 { font-size:clamp(2.1rem,9.5vw,2.7rem); }
        .hero-lead { font-size:1.02rem; }
        .metrics-grid { grid-template-columns:repeat(2,minmax(110px,1fr)); }
        .hero-actions { flex-direction:column; }
        .cta-large, .btn-ghost { width:100%; justify-content:center; }
    }
/* --- LAYOUT BASE --- */
.hero { position: relative; padding: 118px 0 88px; overflow: hidden; background: var(--primary-dark); color: #dfe7ef; }
.hero__inner { max-width: 1320px; margin: 0 auto; padding: 0 clamp(1.25rem,5vw,4.75rem); display: grid; grid-template-columns: 1fr 0.95fr; gap: 60px; }
.hero__content { position: relative; z-index: 2; }

/* --- BADGE --- */
.hero__badge { display: inline-block; letter-spacing: .13em; font-size: 11px; font-weight: 600; padding: 8px 20px 9px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(8px); text-transform: uppercase; margin-bottom: 30px; color: #c9d6e4; position:relative; overflow:hidden; }
.hero__badge:after { content:""; position:absolute; inset:0; background: linear-gradient(90deg, rgba(255,255,255,0.32), rgba(255,255,255,0) 45%); mix-blend-mode:overlay; opacity:.25; }

/* --- TITULO --- */
.hero__title { font-size: clamp(2.95rem, 4.9vw, 4.7rem); line-height: 1.055; font-weight: 820; letter-spacing: -.65px; margin: 0 0 34px; color:#eef4f9; }
.title-line { display:inline-block; }
.gradient-text { background: linear-gradient(95deg,#00caff 0%, #12d4ff 18%, #39c3ff 42%, #5aaefc 62%, #7e9bff 82%, #9a7bff 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 10px rgba(0,210,255,.28)); }

/* --- SUBTITULO --- */
.hero__subtitle { font-size: 1.02rem; max-width: 640px; line-height: 1.58; color: #c3cfd8; margin-bottom: 40px; font-weight:500; }

/* --- ACCIONES --- */
.hero__actions { display: flex; align-items: center; gap: 22px; margin-bottom: 36px; flex-wrap: wrap; }
.cta { position: relative; font-weight: 600; font-size: .95rem; letter-spacing: .4px; cursor: pointer; }
.cta--primary { background: linear-gradient(110deg,#02e2ff 0%, #14c8ff 30%, #3f96ff 60%, #6a55ff 100%); border: none; color: #fff; padding: 18px 40px; border-radius: 48px; font-weight:600; position:relative; overflow:hidden; box-shadow: 0 6px 24px -6px rgba(2,198,255,.55), 0 8px 30px -12px rgba(106,85,255,.45); transition: transform .25s ease, box-shadow .35s ease, filter .35s ease; }
.cta--primary:before { content:''; position:absolute; inset:0; background: radial-gradient(circle at 32% 38%, rgba(255,255,255,0.6), rgba(255,255,255,0) 68%); opacity:.5; mix-blend-mode:overlay; }
.cta--primary:hover { transform: translateY(-3px); filter: brightness(1.07); }
.cta--primary:active { transform: translateY(-1px); }
.cta--primary:focus-visible { outline:2px solid #63caff; outline-offset:3px; }
.cta--ghost { background: rgba(255,255,255,0.04); border:1px solid rgba(80,165,255,0.35); padding: 17px 38px; border-radius: 46px; color:#d3e4f2; backdrop-filter: blur(5px); transition:.35s; font-weight:600; position:relative; }
.cta--ghost:before { content:""; position:absolute; inset:0; background: linear-gradient(150deg, rgba(120,200,255,0.28), rgba(120,200,255,0) 60%); opacity:.22; }
.cta--ghost:hover { background: rgba(90,170,255,0.10); color:#ffffff; border-color:rgba(120,200,255,0.55); box-shadow:0 4px 18px -6px rgba(80,165,255,.45); }
.cta--ghost:focus-visible { outline:2px solid #4ab8ff; outline-offset:3px; }

/* --- TAGS --- */
.hero__tags { list-style:none; display:flex; flex-wrap:wrap; gap:12px; padding:0; margin:0; }
.tag { font-size:.63rem; letter-spacing:.14em; text-transform:uppercase; padding:6px 13px 7px; border-radius:8px; background:linear-gradient(145deg, rgba(0,225,255,0.08) 0%, rgba(110,90,255,0.08) 100%); color:#a8c4d6; border:1px solid rgba(70,170,255,0.38); font-weight:600; position:relative; overflow:hidden; backdrop-filter: blur(4px); transition:.35s; }
.tag:after { content:""; position:absolute; inset:0; background: linear-gradient(130deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 65%); opacity:.12; }
.tag:hover { color:#ffffff; border-color:rgba(110,180,255,0.75); background:linear-gradient(145deg, rgba(0,225,255,0.18) 0%, rgba(110,90,255,0.18) 100%); box-shadow:0 4px 14px -6px rgba(0,210,255,.4); }

/* --- PANEL MÉTRICAS --- */
.metrics { position: relative; z-index: 2; background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 65%); border:1px solid rgba(255,255,255,0.10); border-radius:34px; padding:42px 46px 40px; backdrop-filter: blur(20px); display:flex; flex-direction:column; gap:30px; box-shadow:0 16px 60px -28px rgba(0,0,0,.65), 0 4px 26px -14px rgba(0,0,0,.55); }
.metrics:before { content:""; position:absolute; inset:0; border-radius:inherit; padding:1px; background: linear-gradient(140deg, rgba(120,180,255,0.35), rgba(0,200,255,0) 60%, rgba(150,110,255,0.35)); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity:.35; pointer-events:none; }
.metrics__header { font-size:.74rem; letter-spacing:.14em; font-weight:600; color:#d0dbe7; }
.metrics__grid { display:grid; grid-template-columns:repeat(2,1fr); gap:22px 28px; }
.metric-card { position:relative; padding:20px 18px 18px; border:1px solid rgba(255,255,255,0.12); border-radius:20px; background:linear-gradient(170deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.018) 90%); min-height:110px; display:flex; flex-direction:column; justify-content:space-between; transition: border-color .4s ease, background .4s ease, transform .4s ease; overflow:hidden; }
.metric-card:after { content:""; position:absolute; inset:0; background: radial-gradient(circle at 75% 25%, rgba(255,255,255,0.3), transparent 70%); opacity:0; transition:.6s; }
.metric-card:hover { border-color: rgba(255,255,255,0.28); background:linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 90%); transform:translateY(-4px); }
.metric-card:hover:after { opacity:.55; }
.metric-card__label { font-size:.64rem; letter-spacing:.14em; font-weight:600; color:#a8b7c5; }
.metric-card__value { font-size:1.7rem; font-weight:700; display:flex; align-items:flex-end; gap:2px; color:#fff; }
.metric-card__value span:first-child { font-size:1.05rem; font-weight:600; }
.metric-card__hint { font-size:.6rem; letter-spacing:.1em; color:#8899aa; font-weight:500; }

/* --- ACTIVIDAD --- */
.activity { display:flex; flex-direction:column; gap:14px; }
.activity__bars { display:flex; align-items:flex-end; gap:10px; height:54px; }
.bar { flex:1; max-width:62px; height: var(--h); background: linear-gradient(180deg,#7adfff 0%, #52d2ff 45%, #73b4ff 90%); border-radius:6px; position:relative; overflow:hidden; animation: rise 3.4s ease-in-out infinite; animation-delay:var(--d); box-shadow:0 4px 16px -6px rgba(0,216,255,.35),0 0 0 1px rgba(255,255,255,0.10); }
.bar:after { content:''; position:absolute; inset:0; background: linear-gradient(140deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%); mix-blend-mode:overlay; opacity:.45; }
@keyframes rise { 0%,100% { transform: translateY(8%); opacity:.85;} 50% { transform: translateY(-8%); opacity:1;} }
.activity__caption { font-size:.6rem; letter-spacing:.08em; text-transform:uppercase; color:#7d93a5; }

/* --- PARTICULAS Y DECORACION --- */
.hero:before { content:""; position:absolute; inset:0; background: radial-gradient(circle at 65% 25%, rgba(90,120,255,0.12), transparent 60%), radial-gradient(circle at 15% 75%, rgba(0,210,255,0.10), transparent 65%); pointer-events:none; }
.hero:after { content:""; position:absolute; inset:0; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 140px), repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 140px); mask: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 15%, rgba(0,0,0,.85) 55%, transparent 100%); opacity:.32; mix-blend-mode:overlay; pointer-events:none; }
.hero__bg-particles { position:absolute; inset:0; pointer-events:none; overflow:hidden; filter: blur(1px); }
.particle { position:absolute; background: radial-gradient(circle at 30% 30%, #3fdfff 0%, #0b5f75 70%, transparent 100%); border-radius:50%; opacity:.22; animation: float 7.2s linear infinite; }
@keyframes float { 0% { transform: translate3d(0,0,0) scale(.9); opacity:.12;} 50% { opacity:.45; } 100% { transform: translate3d(0,-50px,0) scale(1); opacity:.08;} }

/* --- ANIMACION REVEAL --- */
.reveal { opacity:0; transform: translateY(26px); animation: fadeUp .85s cubic-bezier(.16,.8,.24,1) forwards; animation-delay: calc(var(--i) * 120ms); }
@keyframes fadeUp { to { opacity:1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .reveal { animation:none; opacity:1; transform:none;} }

/* --- RESPONSIVE --- */
@media (max-width: 1100px) { .hero__inner { grid-template-columns: 1fr; padding:0 clamp(1rem,4.6vw,2.4rem); } .metrics { order: 2; margin-top: 42px; } .hero__content { order: 1; } }
@media (max-width: 640px) { .hero { padding: 116px 0 72px; } .hero__title { font-size: clamp(2.3rem, 9.2vw, 3.2rem); } .hero__actions { gap:16px; } .cta--primary { padding:15px 30px; } .cta--ghost { padding:14px 28px; } .metrics { padding:34px 30px 30px; border-radius:28px; } .metrics__grid { grid-template-columns: 1fr 1fr; gap:16px 18px; } .metric-card { min-height:96px; } .hero__badge { margin-bottom:20px; } .activity__bars { height:44px; } }
</style>
<!-- CSS legado eliminado -->

/* Responsive para la galería horizontal */
@media (max-width: 1024px) {
  .horizontal-gallery {
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 2rem 3rem;
  }

  .gallery-image-item {
    flex: 1 1 calc(50% - 0.75rem);
    min-width: calc(50% - 0.75rem);
  }

  .image-wrapper {
    height: 350px;
  }

  .gallery-header h1 {
    font-size: 3rem;
  }

  .gallery-nav-arrow {
    width: 50px;
    height: 50px;
  }

  .gallery-prev {
    left: 1rem;
  }

  .gallery-next {
    right: 1rem;
  }
}

@media (max-width: 768px) {
  .gallery-header h1 {
    font-size: 2.5rem;
  }

  .horizontal-gallery {
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    gap: 1.5rem;
    padding: 2rem 1rem;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scroll-snap-type: x mandatory;
  }

  .gallery-image-item {
    flex: 0 0 85vw !important;
    min-width: 85vw !important;
    max-width: 85vw !important;
    scroll-snap-align: center;
  }

  .image-wrapper {
    height: 300px;
  }

  .moto-gallery-section {
    padding: 3rem 0;
  }

  .gallery-container {
    padding: 0;
  }

  .gallery-nav-arrow {
    width: 45px;
    height: 45px;
  }

  .gallery-nav-arrow svg {
    width: 20px;
    height: 20px;
  }

  .gallery-prev {
    left: 0.5rem;
  }

  .gallery-next {
    right: 0.5rem;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {
  .gallery-header h1 {
    font-size: 2rem;
    line-height: 1.2;
    padding: 0 1rem;
  }

  .horizontal-gallery {
    padding: 1rem 0.5rem;
    gap: 1rem;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scroll-snap-type: x mandatory;
  }

  .gallery-image-item {
    flex: 0 0 90vw !important;
    min-width: 90vw !important;
    max-width: 90vw !important;
    scroll-snap-align: center;
  }

  .image-wrapper {
    height: 250px;
  }

  .moto-gallery-section {
    padding: 2rem 0;
  }

  .gallery-nav-arrow {
    width: 40px;
    height: 40px;
  }

  .gallery-nav-arrow svg {
    width: 18px;
    height: 18px;
  }

  .gallery-prev {
    left: 0.25rem;
  }

  .gallery-next {
    right: 0.25rem;
  }
}

/* Nueva sección de contenido debajo de la galería */
.content-section {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  backdrop-filter: blur(20px);
  padding: 4rem 0;
  margin: 2rem 0;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  color: white;
}

/* Estilos específicos para el contenido */
.content-section .verification-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
}

.content-section .main-title h1 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.content-section .highlight {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-section .description {
  margin-bottom: 3rem;
}

.content-section .description p {
  font-size: 1.2rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.content-section .action-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.content-section .stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

/* Ajustar el contenedor principal para dar espacio a la galería */
.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Contenido izquierdo */
.hero-content {
  color: white;
}

.verification-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.verification-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}

.verification-text {
  color: #22c55e;
}

.main-title {
  margin-bottom: 1.5rem;
}

.main-title h1 {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.highlight {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.description {
  margin: 0 auto 2rem auto;
  text-align: center;
}

.description p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 0 auto 3rem auto;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 400px;
}

.btn-primary {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(148, 163, 184, 0.1);
  border-color: #94a3b8;
  color: white;
}

/* Controles de demo */
.demo-controls {
  display: flex;
  gap: 0.8rem;
  margin: 1rem auto 0 auto;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 600px;
}

.btn-demo {
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.3);
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-demo:hover {
  background: rgba(96, 165, 250, 0.2);
  border-color: #60a5fa;
  transform: translateY(-1px);
}

/* Estadísticas */
.stats-section {
  display: grid;
  /* 2 columnas para centrar las dos tarjetas en desktop */
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 0 auto 2rem auto;
  max-width: 800px;
  justify-content: center;
}

.stat-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #94a3b8;
}

/* Tip */
.tip-section {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 1rem;
}

.tip-section p {
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
}

/* Producto lado derecho */
.hero-product {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.product-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.nav-btn {
  width: 50px;
  height: 50px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  transform: scale(1.1);
}

.nav-btn svg {
  width: 20px;
  height: 20px;
}

.product-showcase {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(51, 65, 85, 0.2) 100%);
  border: 1px solid rgba(51, 65, 85, 0.3);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
}

.product-label {
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.product-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.product-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.product-image {
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

/* Indicadores */
.product-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(148, 163, 184, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  transform: scale(1.2);
}

/* Elementos decorativos */
.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
  bottom: 20%;
  left: 5%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  top: 50%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* estilos antiguos eliminados */
