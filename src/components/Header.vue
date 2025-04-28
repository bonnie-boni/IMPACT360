<template>
  <div :class="['header', { 'header--scrolled': isScrolled }]">
    <!-- Mobile Menu Toggle Button -->
    <button class="mobile-menu-toggle" @click="toggleMobileMenu">
      <span>{{ mobileMenuOpen ? '✖' : '☰' }}</span>
    </button>

    <!-- Logo -->
    <div class="nav__logo">
      <img src="../assets/logo.png" alt="Impact logo" />
    </div>

    <!-- Navigation Menu -->
    <div :class="['nav__menu', { 'nav__menu--open': mobileMenuOpen }]">
      <ul>
        <li><router-link to="/" @click="closeMobileMenu">Home</router-link></li>
        <li><router-link to="/about" @click="closeMobileMenu">About</router-link></li>
        <li><router-link to="/events" @click="closeMobileMenu">Events</router-link></li>
        <li><router-link to="/i3-launchpad" @click="closeMobileMenu">I3 LAUNCHPAD</router-link></li>
        <li><router-link to="/blog" @click="closeMobileMenu">Blog</router-link></li>
        <li><router-link to="/contact" @click="closeMobileMenu">Contact</router-link></li>
      </ul>
    </div>
  <!-- Mobile Menu Dropdown -->
  <div v-if="mobileMenuOpen" class="mobile-menu-dropdown">
      <ul>
        <li><router-link to="/" @click="closeMobileMenu">Home</router-link></li>
        <li><router-link to="/about" @click="closeMobileMenu">About</router-link></li>
        <li><router-link to="/events" @click="closeMobileMenu">Events</router-link></li>
        <li><router-link to="/i3-launchpad" @click="closeMobileMenu">I3 LAUNCHPAD</router-link></li>
        <li><router-link to="/blog" @click="closeMobileMenu">Blog</router-link></li>
        <li><router-link to="/contact" @click="closeMobileMenu">Contact</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'Header',
  setup() {
    const isScrolled = ref(false);
    const mobileMenuOpen = ref(false);

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 10; // Add transparency when scrolled more than 10px
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return { isScrolled, mobileMenuOpen, toggleMobileMenu, closeMobileMenu };
  },
};
</script>

<style scoped>
/* Base styles */
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  text-decoration: none;
  list-style: none;
  font-family: sans-serif;
  transition: all 0.2s ease-in-out;
  color: black;
}

/* Header styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 70px;
  border-radius: 10px;
  transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.header--scrolled {
  background-color: rgba(255, 255, 255, 0.9); /* Transparent white */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Lighter shadow */
  backdrop-filter: blur(10px); /* Optional: Adds a blur effect */
}

/* Logo styles */
.nav__logo img {
  width: 150px;
  padding: 1rem;
}

/* Navigation menu styles */
.nav__menu {
  display: flex;
  list-style: none;
  justify-content: space-between;
  padding: 1rem 2rem;
  gap: 0.5rem;
  text-decoration: none;
}

.nav__menu ul {
  display: flex;
  gap: 1rem;
}

.nav__menu ul li {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: black;
  transition: all 0.5s ease-in-out;
}

::v-deep(.nav__menu ul li:hover ){
  color: #2e6dea;
  /* opacity: 0.8; */
  cursor: pointer;
}

/* Mobile menu toggle button */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin: 0 1rem;
}

.mobile-menu-toggle span {
  font-size: 24px;
}

/* Mobile menu styles */
.nav__menu--open {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 70px;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.nav__menu--open ul {
  flex-direction: column;
  gap: 0.5rem;
}

.nav__menu--open ul li {
  padding: 0.5rem 1rem;
  text-align: left;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .nav__menu {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }
  /* Mobile menu dropdown styles */
.mobile-menu-dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 70px;
  left: 0px;
  width: 20;
  border-radius: 2%;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 1000;
}

.mobile-menu-dropdown ul {
  flex-direction: column;
  gap: 0.5rem;
}
.mobile-menu-dropdown ul li {
  padding: 0.5rem 1rem;
  text-align: left;
}

.nav__logo img{
  width: 100px;
  padding: 0.5rem;
}
}
</style>