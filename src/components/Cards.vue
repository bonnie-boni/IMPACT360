<template>
  <div class="Cards">
    <!-- Header Section -->
    <div class="header">
      <h2>Empowering Entrepreneurs & Ecosystems</h2>
      <p>From game-changing events to startup acceleration, we make impact happen.</p>
    </div>

    <!-- Events List -->
    <div class="events-container">
      <div v-for="(event, index) in events" :key="index" class="event-card">
        <img :src="event.image" alt="Event Image" class="event-image" />
        <div class="event-details">
          <p class="event-date">{{ event.date }} • {{ event.location }}</p>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-description">{{ event.description }}</p>

        <!-- This code will be used to create a button that will redirect the user to a link if it exists. If the link is undefined, it will show a disabled button. -->
          <button
            v-if="event.link"
            class="register-btn"
            @click="goToLink(event.link)"
           >
            Register Now
          </button>


          <span v-else class="register-btn-placeholder">
            <!-- You can put text like "Registration Closed" or leave it empty -->
            <!-- Or style it like a disabled button -->
             <button class="register-btn" disabled>Register Now</button>
          </span>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  name: 'Cards',
  methods: {
    goToLink(url) {
      // Since v-if ensures the link exists here, we just open it
      window.open(url, '_blank');
    }
  },
  data() {
    return {
      events: [],
    }
  },
  async mounted() {
    const { data, error } = await supabase
      .from('events')
      .select('*')

    if (error) {
      console.error('Error fetching events:', error)
    } else {
      this.events = data.map(event => ({
        ...event,
        image: `/${event.image}` // Assuming images are in the public directory
      }));
    }
  },
}
</script>

<style scoped>
.Cards {
  font-family: sans-serif;
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
