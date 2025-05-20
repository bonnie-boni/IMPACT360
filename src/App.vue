<template>
  <div class='template-body'>
    <Header/>
    <router-view class="content-body" />
  </div>
  <Footer/>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
  .template-body{
    /* min-height: 75vh; */
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
    justify-content: space-between;
  }
</style>
