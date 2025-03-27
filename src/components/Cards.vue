<template>
  <div class="Cards">
    <!-- Header Section -->
    <div class="header">
      <h2>Featured Events</h2>
      <p>Join our upcoming events and be part of the change</p>
    </div>

    <!-- Events List -->
    <div class="events-container">
      <div v-for="(event, index) in events" :key="index" class="event-card">
        <img :src="event.image" alt="Event Image" class="event-image" />
        <div class="event-details">
          <p class="event-date">{{ event.date }} • {{ event.location }}</p>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-description">{{ event.description }}</p>
          <button class="register-btn">Register Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bg1 from '@/assets/Bg1.jpg'
import Bg2 from '@/assets/Bg2.jpg'
import Bg3 from '@/assets/Bg3.jpg'


export default {
  name: 'Cards',
  data() {
    return {
      events: [
        {
          id: 1,
          image: Bg1,
          date: 'October 4, 2024',
          location: 'Nakuru, Kenya',
          title: 'Beyond Now Summit',
          description:
            'Creating the Future today.Join Industry leaders and inovaters for our bi-annual summitt',
        },
        {
          id: 2,
          image: Bg2,
          // date: 'April 2, 2024',
          location: 'Nakuru, Kenya',
          title: 'I3 Lanchpad',
          description: 'Present your startup idea to top investors and win seed funding.',
        },
        {
          id: 3,
          image: Bg3,
          // date: 'April 20, 2024',
          location: 'London',
          title: 'AI Innovation Summit',
          description: 'Explore the latest in AI technology and its impact on business.',
        },
      ],
    }
  },
}
</script>

<style scoped>
.Cards {
  text-align: center;
  padding: 40px;
  background-color: #fff;
}

.header h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  margin-bottom: 30px;
}

.events-container {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  /* border: 2px solid red; */
}

.event-card {
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
  text-align: left;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.event-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.event-details {
  padding: 0px 10px;
}

.event-date {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.event-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.event-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.register-btn {
  background: black;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  width: 100%;
  border-radius: 4px;
  font-size: 14px;
}

.register-btn:hover {
  background: #333;
}
</style>
