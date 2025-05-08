<template>

  <div class="hero">

    <div class="hero__overlay"></div>
    <div class="hero__content">
      <h1>Decentralizing Tech & Entrepreneurship</h1>
      <p>
        Bringing Technopreneurship Resources Closer to You—Together,We’re Building Africa’s Technopreneurship Ecosystem.
      </p>
      <div class="dtn">
       <RouterLink to="/i3-launchpad" class="btn1"><button >Join I3LAUNCHPAD</button></RouterLink>
       <RouterLink to="/events"><button class="btn2">View Events</button></RouterLink>
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
  font-family: sans-serif;
  font-size: bold;
  letter-spacing: 1px;
  position: relative;
  background-image: url('@/assets/Bg1.jpg');
  background-size: cover;
  background-position: center;
  height: 90vh;
  color: white;
  display: flex;
  align-items: left;
  justify-content: left;
  text-align: left;
  padding: 40px;
}

.hero__overlay {
  position: absolute;
  padding: 0 40px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(105, 143, 219, 0.8); /* Blue overlay matching screenshot */
  z-index: 1;
}

.hero__content {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  max-width: 80%;
  /* padding: 80px 20px; */
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
.dtn{
  gap:20px;
  display: flex;

}
.dtn button {
  font-family: sans-serif;
  font-size: medium;
  gap: 40px;
  border-radius: 5px;
  margin: 2px 3px;
  padding: 20px 60px;
  border: none;
  /* background-color:black; */
  /* color:white; */

}
.dtn button:hover {
  background-color: #3a41a5;
  color:rgba(255, 255, 255, 0.8)  ;
  cursor: pointer;
}
.btn2 {
  background-color:black;
  color:white;
}
@media screen and (max-width: 768px) {
  .hero {
    height: 70vh;
    padding: 0 20px;
    text-align: left;
    align-items: left;
    justify-content: left;
  }
  h1 {
    font-size: 2.5rem;
    margin-top: 50px;
  }
  p {
    font-size: 1.2rem;
    margin-bottom: 60px;
    margin-top: 20px;
  }
  .dtn button {
    padding: 15px 30px;
    font-size: medium;
  }
  .button:hover {
    background-color: #3a41a5;
    color:rgba(255, 255, 255, 0.8)  ;
    cursor: pointer;
  }
}
@media screen and (max-width: 360px) {
  .hero {
    height: 70vh;
    padding: 0 10px;
    text-align: left;
    align-items: left;
    justify-content: left;
  }
  h1 {
    font-size: 2rem;
    margin-top: 50px;
  }
  p {
    font-size: 1rem;
    margin-bottom: 60px;
    margin-top: 20px;
  }
  .dtn button {
    padding: 10px 20px;
    font-size: small;
  }
  .btn2 button:hover {
    background-color: #3a41a5;
    color:rgba(255, 255, 255, 0.8)  ;
    cursor: pointer;
  }
  .btn2 {
    background-color:black;
    color:white;
    height: auto;
    width: auto;
  }
  .btn1 {
    height: auto;
    width: auto;

  }

}
</style>
