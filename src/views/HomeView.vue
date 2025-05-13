<template>
  <div>
      <Hero />
      <Cards />
  </div>
</template>

<script>
import Hero from '@/components/Hero.vue';
import Cards from '@/components/Cards.vue';

export default {
  name: 'HomeView',
  components: {
    Hero,
    Cards
  },
  mounted() {
    console.log("HomeView mounted");
  }
};

</script>
<style scoped>
</style>
