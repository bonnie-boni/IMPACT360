<template>
  <div class="hero">
    <div class="hero__overlay">
      <div class="hero__content">
        <h1 id="text">Decentralizing Tech & Entrepreneurship</h1>
        <!-- <p>
              Empowering communities in africa through accessible tech education and <br />
              entrepreneurship opportunities.Join us in building a more inclusive future
            </p> -->
      </div>
      <div class="btn">
        <RouterLink to="/i3-launchpad"><button>Join I3LAUNCHPAD</button></RouterLink>
        <RouterLink to="/events"><button>View Upcoming Events</button></RouterLink>
      </div>
    </div>
    <!-- end of hero page -->
    <!-- Start of who we are section -->
  </div>

  <Cards />

</template>

<script>
import Cards from '@/components/Cards.vue';

export default {
  name: 'HomePage',
  components: {
    Cards,
  }
}
</script>

<style scoped>
.hero {
  font-family: sans-serif;
  font-size: bold;
  letter-spacing: 1px;
  position: relative;
  background-image: url('/Bg1.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  color: white;
  display: flex;
  align-items: left;
  justify-content: left;
  text-align: left;
  padding:0 20px;
}

.hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0%;
  background-color: #2a6aebcc; /* Blue overlay matching screenshot */
  z-index: 1;
}

.hero__content {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  max-width: 100%;
}

h1 {
   font-weight: 600;
  margin-top: 100px;
  margin-bottom: 20px;
  font-size: 4.0rem;
  margin-bottom: 20px;
  max-width: 800px;
}

p {
  font-size: 1.5rem;
  line-height: 1.5;
  margin-bottom: 30px;
}
.btn{
  gap:20px;
  display: flex;
}
.btn button {
  font-family: sans-serif;
  font-size: medium;
  gap: 40px;
  border-radius: 5px;
  margin: 2px 3px;
  padding: 20px 60px;
  border: none;
  background-color:#2d1f38;
  color:white;

}
.btn button:hover {
  background-color: #3a41a5;
  color:rgba(255, 255, 255, 0.8)  ;
  cursor: pointer;
}
</style>
