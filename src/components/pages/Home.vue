<template>
  <div class="hero">
    <div class="hero__content">
      <h1>Decentralizing Tech & Entrepreneurship</h1>
      <p>Empowering communities in africa through accessible tech education and <br/> entrepreneurship opportunities.Join us in building a more inclusive future</p>
      <div class="btn">
        <button>JOIN I3 LAUNCHPAD</button>
        <button>EVENTS</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
.hero {
  font-family:  sans-serif;
  font-size: bold;
  background-image: url('@/assets/Bg1.jpg');
  color: white;
  background-size: cover;
  height:488px;
  padding:0 40px;
  
}
.hero__content {
  display: flex;
  flex-direction: column;
  align-items: left;
  gap:10px;
}
.hero__content h1 {
  font-size: 3.5rem;
  font-weight: 600;
  margin-top: 100px;
  margin-bottom: 20px;
}
.hero__content p{
 font-weight: 60;
 font-size: 27px;
 margin-top:0;
 
}
.btn button{
  background-color: white;
  /* border:none; */
}
</style>
