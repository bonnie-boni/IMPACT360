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
        <!-- Right split content can go here -->
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
            <img src="./assets/team1.jpg" alt="Team Member 1" />
          </div>
          <div class="team-info">
            <h3>Jane Doe</h3>
            <p>Chief Executive Officer</p>
            <p>Jane leads our strategic vision and growth initiatives across Africa.</p>
          </div>
        </div>
        <div class="team-card">
          <div class="team-image">
            <img src="./assets/team2.jpg" alt="Team Member 2" />
          </div>
          <div class="team-info">
            <h3>John Smith</h3>
            <p>Head of Operations</p>
            <p>John oversees daily operations and ensures seamless execution of our programs.</p>
          </div>
        </div>
        <div class="team-card">
          <div class="team-image">
            <img src="./assets/team3.jpg" alt="Team Member 3" />
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
}
.split.left {
  padding: 60px 20px 0px 40px;
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
  height: 85vh;
  background-image: url('@/assets/Bg7.jpg');
  background-size: cover;
}
.Story {
  padding: 40px 200px;
  background-color: #EFEFEF;
  color: black;
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

/* Team Section Styles */
.team-section {
  padding: 40px 200px;
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
  gap: 30px;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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
