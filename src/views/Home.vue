<template>
  <main class="home-main">
    <!-- Hero Section -->
    <section class="section hero-section">
      <MainBanner @showRules="openRulesModal" />
    </section>



  <!-- Services Section -->
  <ServicesSection />

  <!-- About Section -->
  <AboutSection />

  <!-- Featured Projects Section -->
  <FeaturedProjectsSection />

  <!-- Hablemos Section -->
  <HablemosSection />



    <!-- Footer -->
    <section class="section footer-section">
      <Footer_ />
    </section>

    <!-- Modal de reglas -->
    <RulesModal
      :isVisible="showRulesModal"
      @close="closeRulesModal"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MainBanner from '@/components/MainBanner.vue';
import ServicesSection from '@/components/ServicesSection.vue';
import AboutSection from '@/components/AboutSection.vue';
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection.vue';
import HablemosSection from '@/components/HablemosSection.vue';
import Footer_ from "@/components/Footer_.vue";
import RulesModal from '@/components/RulesModal.vue';

// Estado del modal de reglas
const showRulesModal = ref(false)

const openRulesModal = () => {
  showRulesModal.value = true
}

const closeRulesModal = () => {
  showRulesModal.value = false
}

// Impact metrics movidos o eliminados (no usados actualmente)

// Services data moved to ServicesSection component

// (Expertise y techStack movidos al componente AboutSection)

// Projects moved to FeaturedProjectsSection component

// Intersection Observer para animaciones
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, observerOptions)

  // Observar elementos para animaciones
  setTimeout(() => {
    const animatedElements = document.querySelectorAll('.impact-metric, .service-card, .project-card')
    animatedElements.forEach((el) => observer.observe(el))

    // Animar contadores inmediatamente
    animateCounters()
  }, 500)
})

// Función para animar contadores
const animateCounters = () => {
  const counters = document.querySelectorAll('.metric-number')

  counters.forEach((counter, index) => {
    const target = parseInt(counter.getAttribute('data-target') || '0')
    const duration = 2500 // 2.5 segundos
    const delay = index * 200 // Delay escalonado
    let current = 0
    const step = target / (duration / 16) // 60fps

    setTimeout(() => {
      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          counter.textContent = target.toLocaleString() // Formato con separadores
          clearInterval(timer)
        } else {
          counter.textContent = Math.floor(current).toLocaleString()
        }
      }, 16)
    }, delay)
  })
}

defineOptions({
  name: 'HomeView',
});

// Expose variables to template
defineExpose({
  showRulesModal,
  openRulesModal,
  closeRulesModal
});

</script>

<style scoped>
/* --- LAYOUT PRINCIPAL --- */
.home-main {
  width: 100%;
  min-height: 100vh;
  background: var(--primary-dark);
  color: #dfe7ef;
  position: relative;
  overflow-x: hidden;
}

.home-main::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 65% 25%, rgba(90,120,255,0.08), transparent 60%),
    radial-gradient(circle at 15% 75%, rgba(0,210,255,0.06), transparent 65%),
    radial-gradient(circle at 85% 80%, rgba(150,110,255,0.05), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.home-main::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 140px),
    repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 140px);
  mask: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.45) 15%, rgba(0,0,0,.75) 55%, rgba(0,0,0,.45) 85%, transparent 100%);
  opacity: 0.3;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 0;
}

.section {
  position: relative;
  z-index: 1;
  width: 100%;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 3.2rem;
}

/* --- SECCIONES ESPECÍFICAS --- */
.hero-section {
  padding: 0;
}

.impact-metrics-section {
  padding: 80px 0;
  background: linear-gradient(135deg, rgba(0,210,255,0.03) 0%, rgba(138,130,255,0.02) 100%);
}

.services-section {
  padding: 120px 0;
}

.about-section {
  padding: 120px 0;
}

.projects-section {
  padding: 120px 0;
}

.contact-section {
  padding: 120px 0;
}

.footer-section {
  padding: 0;
  margin-top: 60px;
}

/* --- HEADERS DE SECCIÓN --- */
.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-badge {
  display: inline-block;
  letter-spacing: 0.13em;
  font-size: 11px;
  font-weight: 600;
  padding: 8px 20px 9px;
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.14);
  backdrop-filter: blur(8px);
  text-transform: uppercase;
  margin-bottom: 24px;
  color: #c9d6e4;
}

/* Badge más grande solo en la sección de servicios */
.services-section .section-badge {
  font-size: 24px;
  padding: 11px 30px 12px;
  letter-spacing: 0.18em;
  font-weight: 650;
}

.section-title {
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  font-weight: 750;
  line-height: 1.1;
  margin: 0 0 24px;
  color: #eef4f9;
}

.section-subtitle {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #c3cfd8;
  max-width: 640px;
  margin: 0 auto;
}

/* --- IMPACT METRICS --- */
.impact-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.impact-metric {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 90%);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  backdrop-filter: blur(16px);
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.impact-metric:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(0,210,255,0.3);
  background: linear-gradient(165deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 90%);
  box-shadow: 0 20px 40px rgba(0,210,255,0.1);
}

.metric-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #00d2ff 0%, #5fb2ff 50%, #8a82ff 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(0,210,255,0.2);
}

.metric-content {
  flex: 1;
}

.metric-number {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  background: linear-gradient(120deg, #00d2ff, #8a82ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.metric-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.metric-description {
  font-size: 0.9rem;
  color: #c3cfd8;
  line-height: 1.4;
}

/* --- SERVICIOS --- */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.service-card {
  background: linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 90%);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 40px 32px;
  backdrop-filter: blur(12px);
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease-out forwards;
}

.service-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255,255,255,0.25);
  background: linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 90%);
}

.service-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255,255,255,0.25);
  background: linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 90%);
}

.service-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #00d2ff 0%, #5fb2ff 50%, #8a82ff 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 28px;
}

.service-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 16px;
  color: #fff;
}

.service-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #c3cfd8;
  margin-bottom: 24px;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.service-features li {
  font-size: 0.9rem;
  color: #a8b7c5;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: relative;
  padding-left: 20px;
}

.service-features li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #00d2ff;
  font-weight: bold;
}

.service-features li:last-child {
  border-bottom: none;
}

/* --- ABOUT SECTION --- */
.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

.about-text .section-badge {
  margin-bottom: 20px;
}

.about-text .section-title {
  text-align: left;
  margin-bottom: 32px;
}

.about-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #c3cfd8;
  margin-bottom: 48px;
}

.expertise-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.expertise-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.expertise-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.expertise-item h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: #fff;
}

.expertise-item p {
  font-size: 1rem;
  color: #a8b7c5;
  margin: 0;
  line-height: 1.5;
}

.tech-stack {
  background: linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 90%);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 40px;
  backdrop-filter: blur(12px);
}

.tech-category {
  margin-bottom: 32px;
}

.tech-category:last-child {
  margin-bottom: 0;
}

.tech-category h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
}

.tech-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-item {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.85rem;
  color: #c3cfd8;
  font-weight: 500;
}

/* --- PROJECTS SECTION --- */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 32px;
}

.project-card {
  background: linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 90%);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 40px 32px;
  backdrop-filter: blur(12px);
  transition: all 0.4s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255,255,255,0.25);
}

.project-header {
  margin-bottom: 20px;
}

.project-industry {
  background: linear-gradient(120deg, #00d2ff, #8a82ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.project-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 8px 0 0;
  color: #fff;
}

.project-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #c3cfd8;
  margin-bottom: 32px;
}

.project-metrics {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.project-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #00d2ff;
}

.metric-label {
  font-size: 0.85rem;
  color: #a8b7c5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 0.8rem;
  color: #c3cfd8;
}

/* --- CONTACT SECTION --- */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

.contact-info .section-badge {
  margin-bottom: 20px;
}

.contact-info .section-title {
  text-align: left;
  margin-bottom: 32px;
}

.contact-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #c3cfd8;
  margin-bottom: 40px;
}

.contact-benefits {
  margin-bottom: 40px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 1rem;
  color: #c3cfd8;
}

.benefit-check {
  color: #00d2ff;
  font-weight: bold;
  font-size: 1.1rem;
}

.contact-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* --- FORMULARIO --- */
.contact-form-container {
  background: linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 90%);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 40px;
  backdrop-filter: blur(12px);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #c3cfd8;
}

.form-group input,
.form-group textarea {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 16px;
  font-size: 1rem;
  color: #fff;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #00d2ff;
  background: rgba(255,255,255,0.08);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-submit {
  background: linear-gradient(120deg, #00d2ff 0%, #30c7ff 28%, #5fb2ff 58%, #8a82ff 100%);
  border: none;
  color: #fff;
  padding: 18px 40px;
  border-radius: 48px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;
}

.form-submit:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

/* --- BOTONES CTA --- */
.cta {
  position: relative;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  border: none;
  border-radius: 50px;
  padding: 20px 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  overflow: hidden;
  min-width: 200px;
}

.cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.cta:hover::before {
  transform: translateX(100%);
}

.cta--primary {
  background: linear-gradient(135deg, #00d2ff 0%, #30c7ff 30%, #5fb2ff 60%, #8a82ff 100%);
  color: #fff;
  box-shadow:
    0 8px 32px rgba(0,210,255,0.3),
    0 4px 16px rgba(138,130,255,0.2),
    inset 0 1px 0 rgba(255,255,255,0.2);
  animation: pulse-glow 3s infinite;
}

.cta--primary:hover {
  transform: translateY(-4px) scale(1.02);
  filter: brightness(1.1);
  box-shadow:
    0 12px 40px rgba(0,210,255,0.4),
    0 6px 20px rgba(138,130,255,0.3),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.cta--primary:active {
  transform: translateY(-2px) scale(0.98);
}

.cta--ghost {
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.2);
  color: #d9e5ee;
  backdrop-filter: blur(8px);
  position: relative;
}

.cta--ghost::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: linear-gradient(135deg, rgba(0,210,255,0.1), rgba(138,130,255,0.1));
  border-radius: 48px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cta--ghost:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-color: rgba(0,210,255,0.4);
  transform: translateY(-2px);
}

.cta--ghost:hover::after {
  opacity: 1;
}

/* Animación de pulso para botones primarios */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow:
      0 8px 32px rgba(0,210,255,0.3),
      0 4px 16px rgba(138,130,255,0.2),
      inset 0 1px 0 rgba(255,255,255,0.2);
  }
  50% {
    box-shadow:
      0 12px 40px rgba(0,210,255,0.5),
      0 6px 20px rgba(138,130,255,0.4),
      inset 0 1px 0 rgba(255,255,255,0.3);
  }
}

/* --- RESPONSIVE --- */
@media (max-width: 1100px) {
  .about-content,
  .contact-content {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .container {
    padding: 0 2.4rem;
  }
}

@media (max-width: 768px) {
  .services-section,
  .about-section,
  .projects-section,
  .contact-section {
    padding: 80px 0;
  }

  .section-header {
    margin-bottom: 60px;
  }

  .services-grid,
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .about-content,
  .contact-content {
    gap: 40px;
  }

  .project-metrics {
    justify-content: center;
  }

  .contact-buttons {
    justify-content: center;
  }

  .cta {
    padding: 18px 36px;
    font-size: 0.9rem;
    min-width: 180px;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 1.6rem;
  }

  .services-section,
  .about-section,
  .projects-section,
  .contact-section {
    padding: 60px 0;
  }

  .service-card,
  .project-card,
  .contact-form-container,
  .tech-stack {
    padding: 32px 24px;
  }

  .expertise-list {
    gap: 24px;
  }

  .expertise-item {
    gap: 16px;
  }

  .cta {
    padding: 16px 28px;
    font-size: 0.85rem;
    min-width: 160px;
  }

  .impact-metrics-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .impact-metric {
    padding: 24px;
  }

  .metric-icon {
    width: 60px;
    height: 60px;
    font-size: 2.5rem;
  }
}

/* --- ANIMACIONES --- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0,210,255,0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(0,210,255,0.4);
  }
}

/* Animaciones de entrada con delay */
.impact-metric:nth-child(1) { animation-delay: 0.1s; }
.impact-metric:nth-child(2) { animation-delay: 0.2s; }
.impact-metric:nth-child(3) { animation-delay: 0.3s; }
.impact-metric:nth-child(4) { animation-delay: 0.4s; }

.service-card:nth-child(1) { animation-delay: 0.1s; }
.service-card:nth-child(2) { animation-delay: 0.2s; }
.service-card:nth-child(3) { animation-delay: 0.3s; }
.service-card:nth-child(4) { animation-delay: 0.4s; }

/* Efectos hover mejorados */
.service-card:hover .service-icon {
  animation: pulse 2s infinite;
}

.impact-metric:hover .metric-icon {
  animation: glow 2s infinite;
}

.metric-number:hover {
  animation: countUp 0.3s ease-out;
}

/* Clase para elementos animados */
.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
</style>
