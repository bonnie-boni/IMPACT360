<template>
  <div :class="['header', { 'header--scrolled': isScrolled }]">
    <!-- Logo -->
    <div class="nav__logo">
      <img src="../assets/logo.png" alt="Impact logo" />
    </div>

    <!-- Desktop Navigation Menu (hidden on mobile) -->
    <nav class="desktop-nav">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/ongoingEvents">Ongoing Events</router-link></li>
        <li><router-link to="/i3-launchpad">I3 LAUNCHPAD</router-link></li>
        <li><router-link to="/blog">Blog</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
    </nav>

    <!-- Mobile Menu Toggle Button -->
    <button class="hamburger-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
      <span :class="['hamburger-line', { 'open': mobileMenuOpen }]"></span>
      <span :class="['hamburger-line', { 'open': mobileMenuOpen }]"></span>
      <span :class="['hamburger-line', { 'open': mobileMenuOpen }]"></span>
    </button>

    <!-- Mobile Menu Dropdown (only appears when toggled) -->
    <div :class="['mobile-menu', { 'mobile-menu--open': mobileMenuOpen }]">
      <ul>
        <li><router-link to="/" @click="closeMobileMenu">Home</router-link></li>
        <li><router-link to="/about" @click="closeMobileMenu">About</router-link></li>
        <li><router-link to="/ongoingEvents" @click="closeMobileMenu">Ongoing Events</router-link></li>
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
      isScrolled.value = window.scrollY > 10;
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;

      // Prevent scrolling when mobile menu is open
      if (mobileMenuOpen.value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
      document.body.style.overflow = 'auto';
    };

    // Close menu when window is resized to desktop size
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen.value) {
        closeMobileMenu();
      }
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto'; // Ensure scroll is restored
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
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

/* Logo styles */
.nav__logo img {
  width: 150px;
  padding: 1rem;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  padding: 1rem 2rem;
}

.desktop-nav ul {
  display: flex;
  gap: 1rem;
}
.desktop-nav ul li {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  justify-items: center;
  margin: auto;
  color: black;
  transition: all 0.3s ease-in-out;
}

.desktop-nav ul li a {
  text-decoration: none;
  color: black;
  font-weight: 500;
}

.desktop-nav ul li a:hover {
  color: #2e6dea;
}

/* Hamburger Button Styles */
.hamburger-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin-right: 15px;
  flex-direction: column;
  justify-content: space-between;
  height: 24px;
  width: 30px;
  z-index: 1001;
}

.hamburger-line {
  display: block;
  height: 3px;
  width: 100%;
  background-color: #333;
  border-radius: 3px;
  transition: all 0.3s ease-in-out;
}

/* Hamburger Animation */
.hamburger-line.open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger-line.open:nth-child(2) {
  opacity: 0;
}

.hamburger-line.open:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Mobile Menu Styles */
.mobile-menu {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 2rem;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 999;
  overflow-y: auto;
}

.mobile-menu--open {
  transform: translateX(0);
}

.mobile-menu ul {
  width: 100%;
  padding: 0 2rem;
}

.mobile-menu ul li {
  margin: 1rem 0;
  padding: 0.5rem 0;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.mobile-menu ul li:last-child {
  border-bottom: none;
}

.mobile-menu ul li a {
  font-size: 1.2rem;
  font-weight: 500;
  display: block;
  padding: 0.5rem;
  color: #333;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .hamburger-toggle {
    display: flex;
  }

  .nav__logo img {
    width: 120px;
    padding: 0.5rem;
  }
}
</style>
