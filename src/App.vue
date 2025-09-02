<template>
  <header :class="['header', { scrolled: isScrolled }]">
    <div class="nav-container">
      <nav class="navbar" aria-label="Principal">
      <!-- Logo y marca -->
      <RouterLink class="logo" to="/" @click="closeMobileMenu">
        <img src="/images/logo2.jpeg" alt="Data.Or Technological Services" class="logo-image-rounded" />
      </RouterLink>

      <!-- Navegación principal -->
      <div class="nav-menu desktop-nav">
        <RouterLink to="/" class="nav-link">Inicio</RouterLink>
        <a href="#servicios" class="nav-link">Servicios</a>
        <a href="#nosotros" class="nav-link">Nosotros</a>
        <a href="#proyectos" class="nav-link">Proyectos</a>
        <a href="#hablemos" class="nav-link">Contacto</a>
      </div>

      <!-- Controles de usuario -->
      <div class="nav-controls desktop-nav">
  <a href="#hablemos" class="btn demo-btn"><span class="demo-text">Solicita un<br>demo</span></a>
        <RouterLink v-if="!isLoggedIn" class="btn access-btn" to="/login">Acceder</RouterLink>
        <RouterLink v-if="isLoggedIn && isAdmin" class="btn admin-btn" to="/admin">⚙️ Panel Admin</RouterLink>
        <RouterLink v-if="isLoggedIn" @click="logout" class="btn logout-btn" to="/">Cerrar sesión</RouterLink>
        <div v-if="isLoggedIn" class="user-greeting">
          <span>{{ username }}</span>
        </div>
      </div>

  <!-- Menu hamburguesa para mobile -->
      <button class="hamburger-menu" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
  </button>

  <!-- Menu mobile desplegable -->
      <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="mobile-menu-content">
          <div class="mobile-nav-links">
            <RouterLink to="/" class="mobile-link" @click="closeMobileMenu">Inicio</RouterLink>
            <a href="#servicios" class="mobile-link" @click="closeMobileMenu">Servicios</a>
            <a href="#nosotros" class="mobile-link" @click="closeMobileMenu">Nosotros</a>
            <a href="#proyectos" class="mobile-link" @click="closeMobileMenu">Proyectos</a>
            <a href="#contacto" class="mobile-link" @click="closeMobileMenu">Contacto</a>
          </div>

          <div class="mobile-controls">
            <a href="#hablemos" class="mobile-btn demo-btn" @click="closeMobileMenu"><span class="demo-text">Solicita un<br>demo</span></a>
            <RouterLink v-if="!isLoggedIn" class="mobile-btn access-btn" to="/login" @click="closeMobileMenu">
              Acceder
            </RouterLink>
            <div v-if="isLoggedIn" class="mobile-user-greeting">
              <span>Hola, {{ username }}</span>
            </div>
            <RouterLink v-if="isLoggedIn && isAdmin" class="mobile-btn admin-btn" to="/admin" @click="closeMobileMenu">
              ⚙️ Panel Admin
            </RouterLink>
            <RouterLink v-if="isLoggedIn" @click="logout; closeMobileMenu()" class="mobile-btn logout-btn" to="/">
              Cerrar sesión
            </RouterLink>
          </div>
        </div>
      </div>
      </nav>
    </div>
  </header>

  <RouterView />

  <!-- Botones flotantes de redes sociales -->
  <SocialFloating />
  <div class="cursor-dot" ref="cursorDot" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { authService } from '@/services/api';
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue';
import router from './router';
import SocialFloating from '@/components/SocialFloating.vue';

const isLoggedIn = ref(false);
const username = ref('');
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const cursorDot = ref<HTMLDivElement|null>(null);
let dotRAF:number|undefined
let targetX = 0, targetY = 0
let currentX = 0, currentY = 0

// Verificar si el usuario es administrador
const isAdmin = computed(() => authService.isAdmin());

// Funciones para el menú hamburguesa
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const checkAuthStatus = () => {
  isLoggedIn.value = authService.isAuthenticated();
  if (isLoggedIn.value) {
    const currentUser = authService.getCurrentUser();
    username.value = currentUser?.name || '';
  } else {
    username.value = '';
  }
};

const logout = () => {
  authService.logout();
  isLoggedIn.value = false;
  username.value = '';
  router.push('/');
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  checkAuthStatus();
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  const move = (e:MouseEvent)=>{ targetX = e.clientX; targetY = e.clientY }
  window.addEventListener('mousemove', move, { passive:true })
  const animate=()=>{ currentX += (targetX - currentX)*0.18; currentY += (targetY - currentY)*0.18; if(cursorDot.value){ cursorDot.value.style.transform = `translate3d(${currentX}px,${currentY}px,0)` } dotRAF = requestAnimationFrame(animate) }
  dotRAF = requestAnimationFrame(animate)
  // accesibilidad: ocultar si user prefiere movimiento reducido
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches && cursorDot.value){ cursorDot.value.style.display='none' }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  if(dotRAF) cancelAnimationFrame(dotRAF)
});

const route = useRoute();
watch(route, () => {
  checkAuthStatus();
});
</script>

<style scoped>
.cursor-dot { position:fixed; top:0; left:0; width:14px; height:14px; margin:-7px 0 0 -7px; border-radius:50%; pointer-events:none; z-index:4000; background:radial-gradient(circle at 30% 30%, #7df0ff, #32b8ff 55%, #0066ff 100%); mix-blend-mode:screen; filter:blur(0.5px) drop-shadow(0 0 8px rgba(70,190,255,.75)); transition:opacity .35s ease; }
@media (max-width:820px){ .cursor-dot { display:none; } }

/* Navbar interno (contenedor de elementos) */
.navbar {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 48px;
}

/* Línea solo por enlace (se elimina la barra global) */

/* (Estilos de logo removidos; ahora se usan clases globales en global.css) */

/* Navegación principal */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-left: auto;
  margin-right: 20px;
}

.nav-link {
  color: #fdfdfd;
  text-decoration: none;
  font-weight: 400;
  font-size: 15px;
  padding: 6px 0;
  position: relative;
  letter-spacing: .2px;
  transition: color .25s ease, text-shadow .35s ease;
}

.nav-link::after {content:"";position:absolute;left:50%;bottom:-6px;width:0;height:3px;background:linear-gradient(90deg,#00e4ff 0%,#4fdcff 20%,#60b8ff 45%,#4d8dff 70%,#7f7bff 100%);border-radius:3px;box-shadow:0 0 8px rgba(0,228,255,.65),0 0 18px rgba(127,123,255,.45);transition:width .35s ease,left .35s ease;opacity:.95}

.nav-link:hover {
  color: #d9e2ec;
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
}

.nav-link.active {
  color: #e6fbff;
  text-shadow: 0 0 6px rgba(0,228,255,.75), 0 0 14px rgba(127,123,255,.55);
}


.share-btn {
  background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%);
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(34, 211, 238, 0.3);
}

.share-btn:hover {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  box-shadow: 0 4px 15px rgba(34, 211, 238, 0.5);
  transform: translateY(-2px);
}

/* Controles de usuario */
.nav-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.demo-btn {
  position: relative;
  background: rgba(255,255,255,0.08);
  color: #f5f9fb;
  border-radius: 46px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid rgba(255,255,255,0.18);
  cursor: pointer;
  letter-spacing: .25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px -2px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05);
  transition: background .35s ease, box-shadow .35s ease, transform .28s ease, color .3s ease;
}

.demo-btn .demo-text {
  display: inline-block;
  text-align: center;
  line-height: 1.1;
}

.demo-btn::after { /* sutil brillo interior */
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(140deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 65%);
  opacity: .15;
  pointer-events: none;
}

.demo-btn:hover {
  background: rgba(255,255,255,0.14);
  box-shadow: 0 6px 20px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08);
  transform: translateY(-3px);
}

.demo-btn:active {
  transform: translateY(-1px);
  background: rgba(255,255,255,0.18);
  box-shadow: 0 3px 12px -4px rgba(0,0,0,0.6);
}

.access-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
}

.access-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.5);
  transform: translateY(-2px);
}

.logout-btn {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.logout-btn:hover {
  background: rgba(248, 113, 113, 0.2);
  border-color: rgba(248, 113, 113, 0.5);
  transform: translateY(-1px);
}

.admin-btn {
  background: linear-gradient(135deg, #4d0ee0 0%, #100325 100%);
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
}

.admin-btn:hover {
  background: linear-gradient(135deg, #5a0fdb 0%, #0b011b 100%);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
  transform: translateY(-2px);
}

.user-greeting {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

/* Menu hamburguesa */
.hamburger-menu {
  display: none;
  flex-direction: column;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  justify-content: space-around;
  align-items: center;
  z-index: 1001;
}

.hamburger-menu span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger-menu.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Menu mobile */
.mobile-menu {
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;
}

.mobile-menu.active {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-link {
  color: #e2e8f0;
  text-decoration: none;
  padding: 15px 20px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateY(-2px);
}

.mobile-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-btn {
  padding: 15px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.mobile-btn.access-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.mobile-btn.logout-btn {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.mobile-btn.admin-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.mobile-user-greeting {
  color: #e2e8f0;
  text-align: center;
  padding: 15px 20px;
  font-weight: 600;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    padding: .6rem 0;
  }

  .desktop-nav {
    display: none;
  }

  .hamburger-menu {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

}

@media (max-width: 480px) {
  .header {
    padding: .5rem 0;
  }
}

/* Quitar subrayado del link principal */
.link-navbar {
  text-decoration: none !important;
}

.link-navbar:hover {
  text-decoration: none !important;
}
</style>
