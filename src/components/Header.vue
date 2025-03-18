<template>
  <div class="header">
    <div class="nav__logo">
      <img src="../assets/logo.png" alt="Impact logo" />
    </div>
    <div class="nav__menu">
        
      <ul>
        <li><router-link to="#">Home</router-link></li>
        <li><router-link to="#">About</router-link></li>
        <li><router-link to="#">Events</router-link></li>
        <li><router-link to="#">I3 LAUNCHPAD</router-link></li>
        <li><router-link to="#">Blog</router-link></li>
        <li><router-link to="#">Contact</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
}
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  width :100%;
  height: 70px;
  border-radius: 10px;

}
.nav__logo img {
  width: 70px;
  padding: 1rem;
}
.nav__menu ul {
  display: flex;
  list-style: none;
  justify-content: space-between;
  padding: 1rem 2rem;
  gap: 0.5rem;
}
.nav__menu ul li {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.5s ease-in-out;
}
.nav__menu ul li:hover {
  /* background-color: rgb(12, 111, 224); */
  opacity: 0.8;
  color: #2E6DEA;
  cursor: pointer;
}
</style>
