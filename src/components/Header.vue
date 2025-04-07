<template>
  <div :class="['header', { 'header--scrolled': isScrolled }]">
    <div class="nav__logo">
      <img src="../assets/logo.png" alt="Impact logo" />
    </div>
    <div class="nav__menu">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/events">Events</router-link></li>
        <li><router-link to="/i3-launchpad">I3 LAUNCHPAD</router-link></li>
        <li><router-link to="/blog">Blog</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Header',
  setup() {
    const isScrolled = ref(false)

    const handleScroll = () => {
      isScrolled.value = window.scrollY > -40 // Add transparency when scrolled more than 10px
    }
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return { isScrolled }
  },
}
</script>
<style scoped>
/* base styles */
* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  text-decoration: none;
  list-style: none;
  font-family: sans-serif;
  transition: all 0.2s ease-in-out;
  color: black;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 10px;
  z-index: 1000;
  width: 100%;
  height: 70px;
  border-radius: 10px;
  transition:
    background-color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
}
.header--scrolled {
  background-color: rgba(255, 255, 255, 0.9); /* Transparent white */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Lighter shadow */
  backdrop-filter: blur(10px); /* Optional: Adds a blur effect */
}

.nav__logo img {
  width: 150px;
  padding: 1rem;
}
.nav__menu ul {
  display: flex;
  list-style: none;
  justify-content: space-between;
  padding: 1rem 2rem;
  gap: 0.5rem;
  text-decoration: none;
}
.nav__menu ul li {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  /* text-decoration: none; */
  color: black;
  transition: all 0.5s ease-in-out;
}

.nav__menu ul li :hover {
  color: #2e6dea;
  opacity: 0.8;
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: left;
    height: auto;
  }
  .nav__menu ul {
    flex-direction: column;
    align-items: left;
    padding: 0;
  }
  .nav__menu ul li {
    /* padding: 0.5rem 1rem; */
    width: 100px;
    text-align: left;
  }
}

</style>
