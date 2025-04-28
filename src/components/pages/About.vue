<template>
  <div class="heroAbout">
    <div class="hero__overlay">
      <div class="split left">
        <h1>Our Mission</h1>
        <p>
          To democratize access to technology and entrepreneurship—resources and expertise that
          empower every community in Africa to innovate and thrive.
        </p>
        <p>
          We deliver this impact through curated event experiences designed to inspire, connect, and
          activate changemakers across the continent.
        </p>
        <h1>Our Vision</h1>
        <p>
          Empowerment & Innovation We host technology events in underserved areas—providing tools,
          knowledge, and networks to help individuals and communities unlock their potential and
          drive meaningful change.
        </p>
        <p>
          We build supportive entrepreneurial ecosystems across Africa—enabling aspiring
          entrepreneurs to learn, grow, and drive economic and social progress in their communities.
        </p>
      </div>
      <div class="split right">
    
      </div>
    </div>
    <div class="Story">
      <h1>Our Story</h1>
      <p>
        Founded in Kenya, Impact360 was created to bridge the gap between talent and opportunity across Africa. We believe innovation should be accessible to everyone — not just in major cities.
      </p>
      <p>
        Through empowering events, startup incubation, and community-driven initiatives, we are building a thriving network of technopreneurs. Starting in Kenya and expanding across Africa, Impact360 is fueling the next generation of entrepreneurs who will transform their communities — and the continent.
      </p>
      <div class="cards-container">
        <ImpactCard title="Growth" description="Expanding our reach across continents, serving diverse industries">
          <template #icon>
            <i class="fas fa-chart-line"></i> <!-- Replace with your preferred icon -->
          </template>
        </ImpactCard>

        <ImpactCard title="Partnership" description="Building lasting relationships with clients and stakeholders">
          <template #icon>
            <i class="fas fa-handshake"></i> <!-- Replace with your preferred icon -->
          </template>
        </ImpactCard>

        <ImpactCard title="Innovation" description="Pioneering new approaches to business transformation">
          <template #icon>
            <i class="fas fa-lightbulb"></i> <!-- Replace with your preferred icon -->
          </template>
        </ImpactCard>
      </div>
    </div>
  </div>
</template>
<script>
import ImpactCard from '@/components/ImpactCard.vue';
export default {
  name: 'About',
    components: {
        ImpactCard,
    },
};
</script>
<style scoped>
.heroAbout {
  font-family: sans-serif;
  font-size: small;
  margin-top: 0%;
}
.hero__overlay {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(52, 112, 234, 0.8);
  z-index: 1;
}
.split {
  position: relative;
  height: 100%;
  width: 50%;
  overflow: hidden;
  /* z-index: 1; */
}
.split.left {
  padding: 60px 20px 0px 40px;
  /* padding-top: 60px;     */
  left: 0;
  background-color: black;
  color: white;
  height: 85vh;
}
.split.left p {
  margin: 0;
  padding: 0px;
  font-size: 16px;
  line-height: 1.5;
}
.split.right {
  padding: 60px 20px 0px 40px;
  right: 0;
  width: 50%;
  height: 100%;
  position: relative;
  height: 85vh;
  background-image: url('@/assets/Bg7.jpg');
  background-size: cover;
}
.Story {
    padding: 40px 200px;
    background-color: #EFEFEF;
    color: black;
    height: 100%;
    text-align: center;

}
.Story h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}
.Story p {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 20px;
}
.cards-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>
