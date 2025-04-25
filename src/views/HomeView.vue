<template>
  <div>
  <Hero />
  <Cards />
</div>
</template>

<script>
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
