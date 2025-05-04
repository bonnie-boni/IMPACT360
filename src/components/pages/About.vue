<template>
  <div class="heroAbout">
    <div class="hero__overlay">
      <div class="split left">
        <h1>Our Mission</h1>
        <p>
          To democratize access to technology and entrepreneurship—resources and expertise that
          empower every community in Africa to innovate and thrive.
          <br>
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
  height: auto; /* Adjust height to content */
}

.split {
  position: relative;
  width: 100%; /* Full width on smaller screens */
  overflow: hidden;
  height: 100vh;
}

.split.left {
  width: 80%; /* Full width on smaller screens */
  padding: 20px;
  background-color: black;
  color: white;
  height: auto; /* Adjust height to content */
}

.split.left h1 {
  font-size: 2rem; /* Adjust font size for smaller screens */
  margin-bottom: 10px;
}

.split.left p {
  margin: 0;
  padding: 0;
  font-size: 1rem;
  line-height: 1.4;
}

.split.right {
  width: 100%; /* Full width on smaller screens */
  padding: 0;
  height: auto; /* Adjust height to content */
  background-image: url('@/assets/Bg7.jpg');
  background-size: cover;
  height: auto;
  min-height: 200px; /* Ensure a minimum height for the background image */
}

.Story {
  padding: 20px;
  background-color: #EFEFEF;
  color: black;
  text-align: center; /* Center text for better readability */
}

.Story h1 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.Story p {
  padding: 0;
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 15px;
}

.cards-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 15px;
}

/* Media query for larger screens */
@media screen and (max-width: 780px) {

  .hero__overlay {
    flex-direction: column-reverse;
  }

  .split {
    width: 50%; /* Restore 50% width on larger screens */
  }

  .split.left {
    height: auto;
    width: auto;
  }

  .split.left h1 {
    font-size: 2rem;
  }

  .split.left p {
    font-size: 12px;
    line-height: 1.5;
  }

  .split.right {
    min-height: 50vh;
    height: auto;
  }

  .Story {
    text-align: center;
  }

  .Story h1 {
    font-size: 2.5rem;
  }

  .Story p {
    padding: 5%;
  }
}
</style>
