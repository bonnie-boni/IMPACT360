<template>
  <div class='template-body'>
    <Header/>
    <router-view/>
    <Footer/>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
  .template-body{
    overflow-x: hidden;
  }
</style>
