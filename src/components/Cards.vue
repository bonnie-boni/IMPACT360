<template>
  <div class="Cards">
    <!-- Header Section -->
    <div class="header">
      <h2>Empowering Entrepreneurs & Ecosystems</h2>
      <p>From game-changing events to startup acceleration, we make impact happen.</p>
    </div>

    <!-- Events List -->
    <div class="events-container">
      <div v-for="(event, index) in events.filter(isOngoingEvent)" :key="index" class="event-card">
        <img
          :src="event.thumbnail || '/images/default-event.jpg'"
          :alt="event.title"
          class="event-thumbnail"
          @error="handleImageError($event, index)"
        />
        <div class="event-details">
          <p class="event-date">{{ formatDate(event.date) }} • {{ event.location }}</p>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-description">{{ truncateDescription(event.description, 100) }}</p>
          <button
            v-if="isOngoingEvent(event) && event.id"
            class="register-btn"
            @click="goToLink(event.id)"
          >
            Register Now
          </button>
          <span v-else class="register-btn-placeholder">
            <button class="register-btn disabled" disabled>Registration Closed</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'vue-router';
import { supabase } from '@/services/supabase.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
//const supabase = createClient(supabaseUrl, supabaseKey);

export default {
  name: 'Cards',
  setup() {
    const router = useRouter();

    return { router, supabase };
  },
  methods: {
    async goToLink(eventId) {
      this.router.push({ name: 'Ticket', params: { id: eventId } });
    },
    async signOut() {
      const { error } = await supabase.auth.signOut()
      if (error) console.error('Error signing out:', error)
      this.router.push('/login')
    },
    handleImageError(event, index) {
      console.error(`Failed to load image for event ${index}: ${this.events[index].thumbnail}`);
      this.events[index].thumbnail = '/images/default-event.jpg';
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    truncateDescription(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    isOngoingEvent(event) {
      if (!event || !event.date) {
        console.warn(`Event ${event?.title || 'unknown'} has no valid date`);
        return false;
      }
      const eventDate = new Date(event.date);
      const currentDate = new Date();
      // Set currentDate to start of day for comparison
      currentDate.setHours(0, 0, 0, 0);
      const isFutureOrToday = eventDate >= currentDate;
      const isNotPostponed = event.status?.toLowerCase() !== 'postponed';
      if (!event.status) {
        console.warn(`Event ${event.title} has no status field; assuming ongoing if date is valid`);
      }
      return isFutureOrToday && isNotPostponed;
    }
  },
  data() {
    return {
      events: [],
    };
  },
  async mounted() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      this.events = data;
      console.log('Event thumbnails:', this.events.map(e => e.thumbnail));
    }
  },
};
</script>

<style scoped>
.Cards {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-align: center;
  padding: 60px 20px;
  background-color: #f8fafc;
}

.header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.header p {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.events-container {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.event-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  width: 320px;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.event-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.event-details {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.event-date {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 500;
}

.event-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.4;
}

.event-description {
  font-size: 0.9375rem;
  color: #475569;
  margin-bottom: 16px;
  line-height: 1.5;
  flex-grow: 1;
}

.register-btn {
  background: #0d6efd;
  color: #ffffff;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.register-btn:hover {
  background: #0b5ed7;
}

.register-btn.disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .Cards {
    padding: 40px 16px;
  }

  .header h2 {
    font-size: 1.5rem;
  }

  .header p {
    font-size: 1rem;
  }

  .event-card {
    width: 100%;
    max-width: 340px;
  }

  .event-thumbnail {
    height: 180px;
  }

  .event-title {
    font-size: 1.125rem;
  }

  .event-description {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .event-card {
    width: 100%;
  }

  .event-thumbnail {
    height: 160px;
  }
}
</style>
