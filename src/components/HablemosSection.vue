<template>
  <section id="hablemos" class="hablemos-section">
    <div class="hbl-container">
      <header class="hbl-header">
        <span class="hbl-badge">HABLEMOS</span>
        <h2 class="hbl-title">¿Listo para construir algo con nosotros?</h2>
        <p class="hbl-intro">Cuéntanos tu reto y te devolvemos una primera visión técnica + un demo.</p>
      </header>

      <div class="hbl-grid">
        <div class="hbl-card big">
          <h3 class="hbl-card-title">Qué obtienes</h3>
          <ul class="hbl-points">
            <li>Diagnóstico rápido de situación actual</li>
            <li>3–5 ideas accionables priorizadas</li>
            <li>Primer mapa de arquitectura / flujo</li>
            <li>Estimación inicial de esfuerzo y ROI</li>
          </ul>
          <p>Únete a las empresas que ya han transformado su futuro con nuestras soluciones. Agenda tu consultoría gratuita y descubre el potencial ilimitado de tus datos.</p>
          <div class="hbl-cta-group">
            <button class="hbl-cta primary" @click="openSchedule">🚀 Agendar llamada</button>
            <div class="hbl-contact">
              <span class="hbl-contact-text">
                Contacto: <strong>+573107695856</strong>
              </span>
              <a
                class="whatsapp-btn"
                href="https://wa.me/573107695856?text=Hola%20quiero%20información%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener"
                aria-label="Escríbenos por WhatsApp"
              >
                <span class="wa-icon" aria-hidden="true">💬</span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <form class="hbl-card form" @submit.prevent="emitSubmit">
          <h3 class="hbl-card-title">Envíanos un mensaje</h3>
          <div class="hbl-field">
            <label>Nombre</label>
            <input v-model="form.name" required />
          </div>
            <div class="hbl-field">
            <label>Email</label>
            <input type="email" v-model="form.email" required />
          </div>
          <div class="hbl-field">
            <label>Empresa</label>
            <input v-model="form.company" />
          </div>
          <div class="hbl-field">
            <label>¿Cómo podemos ayudarte?</label>
            <textarea rows="3" v-model="form.message" required></textarea>
          </div>
          <button type="submit" class="hbl-submit">Enviar →</button>
        </form>
      </div>
    </div>

    <!-- Modal Agendar Llamada -->
    <div v-if="showSchedule" class="schedule-overlay" @keydown.esc="closeSchedule" tabindex="-1">
      <div class="schedule-modal" role="dialog" aria-modal="true" aria-labelledby="scheduleTitle">
        <button class="schedule-close" @click="closeSchedule" aria-label="Cerrar">×</button>
        <h3 id="scheduleTitle" class="schedule-title">Agendar una llamada</h3>
        <p class="schedule-desc">Déjanos tus datos y una preferencia horaria. Te contactaremos para confirmar.</p>
        <form class="schedule-form" @submit.prevent="submitSchedule">
          <div class="sch-field">
            <label>Nombre</label>
            <input v-model="scheduleForm.name" required />
          </div>
          <div class="sch-field">
            <label>Email</label>
            <input type="email" v-model="scheduleForm.email" required />
          </div>
          <div class="sch-field">
            <label>Preferencia horaria</label>
            <select v-model="scheduleForm.slot" required>
              <option value="" disabled>Selecciona</option>
              <option>Mañana (09:00 - 12:00)</option>
              <option>Mediodía (12:00 - 15:00)</option>
              <option>Tarde (15:00 - 18:00)</option>
            </select>
          </div>
          <div class="sch-field">
            <label>Notas opcionales</label>
            <textarea rows="3" v-model="scheduleForm.notes"></textarea>
          </div>
          <button type="submit" class="sch-submit">Confirmar solicitud →</button>
        </form>
        <p v-if="scheduleSuccess" class="schedule-success">Solicitud enviada. Te escribiremos pronto ✔</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

interface ContactForm { name:string; email:string; company:string; message:string }
const form = reactive<ContactForm>({ name:'', email:'', company:'', message:'' })

// Estado modal agendar llamada
const showSchedule = ref(false)
interface ScheduleForm { name:string; email:string; slot:string; notes:string }
const scheduleForm = reactive<ScheduleForm>({ name:'', email:'', slot:'', notes:'' })
const scheduleSuccess = ref(false)

function openSchedule(){
  scheduleSuccess.value = false
  showSchedule.value = true
  setTimeout(()=>{
    const first = document.querySelector('.schedule-modal input') as HTMLElement | null
    first?.focus()
  },50)
}
function closeSchedule(){ showSchedule.value = false }
function submitSchedule(){
  // Aquí se podría llamar a una API real
  console.log('Schedule request:', { ...scheduleForm })
  scheduleSuccess.value = true
  // limpiar solo notas
  scheduleForm.notes = ''
  setTimeout(()=> closeSchedule(), 1800)
}

function emitSubmit(){
  console.log('Hablemos form:', { ...form })
}

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
.hablemos-section { padding:60px 0 70px; --accent-start:#404b55; --accent-end:#2a3239; --accent-hover:#4b5761; }
.hbl-container { max-width:1400px; margin:0 auto; padding:0 clamp(1.2rem,4vw,3.6rem); }
.hbl-header { text-align:center; max-width:900px; margin:0 auto 2.1rem; }
.hbl-badge { display:inline-block; font-size:1.05rem; letter-spacing:.15em; font-weight:600; padding:6px 16px 7px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.14); backdrop-filter:blur(6px); color:#d5dde6; margin:0 0 1.1rem; }
.hbl-title { font-size:clamp(1.9rem,3.3vw,2.6rem); line-height:1.15; font-weight:700; margin:0 0 1.1rem; background:linear-gradient(90deg,#fff,#d9e4f3); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hbl-intro { font-size:1rem; line-height:1.55; color:#c9d4dd; margin:0 auto; max-width:640px; }

.hbl-grid { display:grid; gap:1.8rem 2rem; grid-template-columns:repeat(auto-fit,minmax(310px,1fr)); align-items:start; }
.hbl-card { position:relative; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:1.6rem 1.5rem 1.75rem; backdrop-filter:blur(10px); overflow:hidden; display:flex; flex-direction:column; gap:1.15rem; transform:translateY(26px); opacity:0; transition:opacity .6s ease, transform .6s ease, background .45s ease, border-color .4s ease; }
.hbl-card:before { display:none; }
.hbl-card:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.22); }
.hbl-card.in-view { transform:translateY(0); opacity:1; }
.hbl-card-title { margin:0 0 .4rem; font-size:1.05rem; font-weight:680; letter-spacing:.4px; color:#fff; }
.hbl-points { list-style:none; margin:0 0 .6rem; padding:0; display:flex; flex-direction:column; gap:.55rem; }
.hbl-points li { font-size:.76rem; letter-spacing:.35px; color:#d2dbe2; position:relative; padding-left:1rem; }
.hbl-points li:before { content:"•"; position:absolute; left:0; top:0; color:#6bc5ff; }
.hbl-cta-group { display:flex; flex-wrap:wrap; gap:.8rem; }
.hbl-cta { font-size:.7rem; letter-spacing:.25em; font-weight:650; padding:.85rem 1.25rem .8rem; border-radius:18px; cursor:pointer; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#e6f0f9; text-transform:uppercase; transition:.45s ease; }
.hbl-cta.primary { background:linear-gradient(125deg,var(--accent-start),var(--accent-end)); border-color:rgba(255,255,255,0.15); color:#fff; }
.hbl-cta.primary:hover { background:linear-gradient(125deg,var(--accent-hover),var(--accent-end)); filter:brightness(1.05); }
.hbl-cta.ghost:hover { background:rgba(255,255,255,0.1); }
.hbl-cta.primary:hover { filter:brightness(1.12); }

.form { gap:.95rem; }
.hbl-field { display:flex; flex-direction:column; gap:.4rem; }
.hbl-field label { font-size:.65rem; letter-spacing:.18em; font-weight:600; color:#b8c4cf; text-transform:uppercase; }
.hbl-field input, .hbl-field textarea { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:14px; padding:.7rem .85rem; font-size:.72rem; color:#eaf2f9; font-family:inherit; resize:vertical; }
.hbl-field input:focus, .hbl-field textarea:focus { outline:none; border-color:#00bfff; }
.hbl-submit { margin-top:.4rem; font-size:.7rem; letter-spacing:.25em; font-weight:650; padding:.9rem 1.3rem .85rem; border-radius:18px; cursor:pointer; border:1px solid rgba(255,255,255,0.18); background:linear-gradient(125deg,var(--accent-start),var(--accent-end)); color:#fff; text-transform:uppercase; transition:.45s ease; }
.hbl-submit:hover { background:linear-gradient(125deg,var(--accent-hover),var(--accent-end)); filter:brightness(1.05); }

@media (max-width:780px){
  .hbl-grid { gap:1.4rem 1.4rem; }
  .hbl-card { padding:1.35rem 1.25rem 1.5rem; border-radius:22px; }
  .hbl-card-title { font-size:.95rem; }
  .hbl-points li { font-size:.68rem; }
  .hbl-cta { font-size:.62rem; padding:.75rem 1rem .7rem; }
  .hbl-submit { font-size:.62rem; }
  .hbl-title { font-size:clamp(1.9rem,7vw,2.3rem); }
}

/* Modal */
.schedule-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.55); backdrop-filter:blur(6px); display:flex; align-items:flex-start; justify-content:center; padding:5vh 1.2rem; z-index:1000; overflow-y:auto; }
.schedule-modal { width:100%; max-width:520px; background:rgba(24,30,38,0.92); border:1px solid rgba(255,255,255,0.12); border-radius:26px; padding:1.9rem 1.7rem 2.1rem; position:relative; box-shadow:0 18px 40px -8px rgba(0,0,0,0.55); animation:popIn .5s cubic-bezier(.22,1.15,.4,1); }
.schedule-close { position:absolute; top:10px; right:12px; background:transparent; border:none; color:#d3dde6; font-size:1.4rem; cursor:pointer; line-height:1; }
.schedule-title { margin:0 0 .6rem; font-size:1.2rem; font-weight:680; letter-spacing:.4px; color:#fff; }
.schedule-desc { margin:0 0 1.2rem; font-size:.78rem; line-height:1.45; color:#b8c4cf; }
.schedule-form { display:flex; flex-direction:column; gap:.85rem; }
.sch-field { display:flex; flex-direction:column; gap:.35rem; }
.sch-field label { font-size:.6rem; letter-spacing:.18em; font-weight:600; color:#95a5b2; text-transform:uppercase; }
.sch-field input, .sch-field textarea, .sch-field select { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:.65rem .75rem; font-size:.7rem; color:#e8f2f9; font-family:inherit; }
.sch-field input:focus, .sch-field textarea:focus, .sch-field select:focus { outline:none; border-color:#00bfff; }
.sch-submit { margin-top:.3rem; font-size:.66rem; letter-spacing:.24em; font-weight:650; padding:.85rem 1.2rem .8rem; border-radius:16px; cursor:pointer; border:1px solid rgba(255,255,255,0.18); background:linear-gradient(120deg,#00d2ff,#8a82ff); color:#fff; text-transform:uppercase; transition:.4s ease; }
.sch-submit { background:linear-gradient(125deg,var(--accent-start),var(--accent-end)); }
.sch-submit:hover { background:linear-gradient(125deg,var(--accent-hover),var(--accent-end)); filter:brightness(1.05); }
.schedule-success { margin:.9rem 0 0; font-size:.7rem; letter-spacing:.4px; color:#7fdca1; font-weight:600; }

@keyframes popIn { from { transform:translateY(18px) scale(.96); opacity:0; } to { transform:translateY(0) scale(1); opacity:1; } }

/* Contact / WhatsApp */
.hbl-contact { display:flex; flex-wrap:wrap; gap:.7rem; align-items:center; margin-top:.9rem; }
.hbl-contact-text { font-size:.62rem; letter-spacing:.08em; color:#c8d2db; background:rgba(255,255,255,0.05); padding:.55rem .75rem; border:1px solid rgba(255,255,255,0.12); border-radius:14px; display:inline-flex; gap:.35rem; align-items:center; }
.hbl-contact-text strong { font-weight:600; color:#fff; letter-spacing:.06em; }
.whatsapp-btn { position:relative; display:inline-flex; align-items:center; gap:.45rem; font-size:.6rem; font-weight:600; letter-spacing:.18em; text-transform:uppercase; padding:.65rem 1rem .6rem; border-radius:16px; border:1px solid rgba(37,211,102,0.4); color:#fff; background:linear-gradient(125deg,#128C7E,#075E54); text-decoration:none; transition:.4s ease; overflow:hidden; }
.whatsapp-btn:before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.18),transparent 70%); opacity:0; transition:.5s ease; }
.whatsapp-btn:hover { filter:brightness(1.1); border-color:rgba(37,211,102,0.55); }
.whatsapp-btn:hover:before { opacity:1; }
.wa-icon { font-size:.85rem; line-height:1; }
@media (max-width:780px){
  .hbl-contact { flex-direction:column; align-items:stretch; }
  .whatsapp-btn { justify-content:center; font-size:.58rem; }
  .hbl-contact-text { width:100%; justify-content:center; }
}
</style>
