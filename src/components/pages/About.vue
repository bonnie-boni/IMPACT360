<template>

  <!-- <Header /> -->
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
      <br><br>
        Through empowering events, startup incubation, and community-driven initiatives, we are building a thriving network of technopreneurs. Starting in Kenya and expanding across Africa, Impact360 is fueling the next generation of entrepreneurs who will transform their communities — and the continent.
      </p>
      <div class="cards-container">
        <ImpactCard title="Growth" description="Expanding our reach across continents, serving diverse industries">
          <template #icon>
            <i class="fas fa-chart-line"></i>
          </template>
        </ImpactCard>

        <ImpactCard title="Partnership" description="Building lasting relationships with clients and stakeholders">
          <template #icon>
            <i class="fas fa-handshake"></i>
          </template>
        </ImpactCard>

        <ImpactCard title="Innovation" description="Pioneering new approaches to business transformation">
          <template #icon>
            <i class="fas fa-lightbulb"></i>
          </template>
        </ImpactCard>
      </div>
    </div>

    <!-- Our Team Section -->
    <div class="team-section">
      <h1>Our Team</h1>
      <div class="team-container">
        <div class="team-card">
          <div class="team-image">
            <img src="../../assets/Bg1.jpg" alt="Team Member 1" />
          </div>
          <div class="team-info">
            <h3>Jane Doe</h3>
            <p>Chief Executive Officer</p>
            <p>Jane leads our strategic vision and growth initiatives across Africa.</p>
          </div>
        </div>
        <div class="team-card">
          <div class="team-image">
            <img src="../../assets/Bg1.jpg" alt="Team Member 2" />
          </div>
          <div class="team-info">
            <h3>John Smith</h3>
            <p>Head of Operations</p>
            <p>John oversees daily operations and ensures seamless execution of our programs.</p>
          </div>
        </div>
        <div class="team-card">
          <div class="team-image">
            <img src="../../assets/Bg1.jpg" alt="Team Member 3" />
          </div>
          <div class="team-info">
            <h3>Mary Johnson</h3>
            <p>Community Manager</p>
            <p>Mary fosters relationships with our community partners and stakeholders.</p>
          </div>
        </div>
        <!-- Add more team cards as needed -->
      </div>
    </div>
  </div>
  <!-- <Footer /> -->
</template>

<script setup>
import Header from '../Header.vue';
import ImpactCard from '@/components/ImpactCard.vue';
import Footer from '../Footer.vue';
</script>
<script>
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
  height: max-content;
  position: relative;
  min-height: 80vh;
  /* background-color: rgba(52, 112, 234, 0.8); */
  /* z-index: 1; */

}

.split {
  position: relative;
  width: 100%; /* Full width on smaller screens */
  overflow: hidden;
  height: 100vh;

}

.split.left {

  width: 40%; /* Full width on smaller screens */
  padding: 20px;
  background-color: black;
  background: linear-gradient(to right, #0D2D56,#4B67BC);
  color: white;
  height: auto; /* Adjust height to content */
}

.split.left h1 {
  font-size: 2rem; /* Adjust font size for smaller screens */
  margin-bottom: 10px;
  left: 0;
  color: white;
  /* padding: 60px 20px 0px 40px; */
  /* height: 85vh; */
  /* background: linear-gradient(to right, #0D2D56,#4B67BC); */
}

.split.left p {
  margin: 0;
  padding: 0;
  font-size: 1rem;
  line-height: 1.4;
}

.split.right {

  right: 0;
  width: 60%;
  height: auto;
  background-image: url('@/assets/Bg7.jpg');
  background-size: cover;
  min-height: 200px; /* Ensure a minimum height for the background image */
}

.Story {
  padding: 20px 40px;
  background-color: #EFEFEF;
  color: black;
  text-align:justify;

}

.Story h1 {
  font-size: 2rem;
  margin-bottom: 15px;
  text-align: center;
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
    width: auto;
    min-height: 60vh;
    height: auto;
  }

  .Story {
    padding: auto;
    /* text-align: center; */
  }

  .Story h1 {
    font-size: 2.5rem;
  }

  .Story p {
    padding: 5%;
  }
}

/* Team Section Styles */
.team-section {
  padding: 40px;
  background-color: #f9f9f9;
  text-align: center;
}
.team-section h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
}
.team-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 50px;
}
.team-card {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}
.team-card:hover {
  transform: scale(1.05);
}
.team-image img {
  width: 200%;
  height: 200%;
  object-fit: cover;

}
.team-info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.team-card:hover .team-info {
  opacity: 1;
}
.team-info h3 {
  margin: 0 0 10px 0;
}
.team-info p {
  margin: 5px 0;
  font-size: 14px;
  text-align: center;
}
</style>
