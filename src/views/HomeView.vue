<template>
  <div>
    <Header />
      <Hero />
      <Cards />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Hero from '@/components/Hero.vue'
import Cards from '@/components/Cards.vue'


export default {
  name: 'HomeView',
  components: {
    Hero,
    Cards,
  },


}

</script>
<style scoped></style>
