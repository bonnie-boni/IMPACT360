<template>
  <div class="ticket-card-container">
    <div v-if="showConfirmation" class="confirmation-modal">
      <div class="confirmation-content">
        <div class="confirmation-header">
          <i class="fas fa-check-circle"></i>
          <h2>Ticket Request Sent!</h2>
        </div>
        <div class="confirmation-body">
          <p>
            Please check your phone for the M-Pesa STK push prompt to complete payment.
            Once payment is confirmed, your ticket will be sent to your email.
          </p>
          <button @click="showConfirmation = false" class="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!event" class="loading-message">
      <p>Loading event details...</p>
    </div>

    <div v-else class="ticket-card">
      <!-- Event Header -->
      <div class="ticket-header">
        <h1>{{ event.title }}</h1>
        <div class="ticket-badge">Available</div>
      </div>

      <!-- Event Thumbnail -->
      <div class="ticket-thumbnail">
        <img :src="event.thumbnail || '/images/default-event.jpg'" :alt="event.title" @error="handleImageError" />
      </div>

      <!-- Event Details -->
      <div class="ticket-details">
        <div class="ticket-info">
          <div class="info-item">
            <i class="fas fa-calendar-alt"></i>
            <div>
              <span class="info-label">Date & Time</span>
              <span class="info-value">{{ formatDate(event.date) }}</span>
            </div>
          </div>

          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <span class="info-label">Location</span>
              <span class="info-value">{{ event.location }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="ticket-description">
          <h3>Event Details</h3>
          <p>{{ event.description }}</p>
        </div>

        <!-- Price -->
        <div class="ticket-price">
          <span class="price-label">Ticket Price</span>
          <span class="price-value">KSH {{ formatPrice(event.price) }}</span>
        </div>

        <!-- Applicant Information Form -->
        <div class="ticket-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              placeholder="Enter your email address"
              required
            />
            <small>Your ticket will be sent to this email</small>
          </div>

          <div class="form-group">
            <label for="phoneNumber">Phone Number (M-Pesa)</label>
            <div class="phone-input">
              <span class="country-code">+254</span>
              <input
                type="tel"
                id="phoneNumber"
                v-model="formData.phoneNumber"
                placeholder="7XXXXXXXX"
                pattern="^[7|1][0-9]{8}$"
                required
              />
            </div>
            <small>Enter without leading zero, e.g. 712345678</small>
          </div>

          <button
            @click="initiatePayment"
            class="grab-ticket-btn"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing">
              <div class="spinner-small"></div> Processing...
            </span>
            <span v-else>
              <i class="fas fa-ticket-alt"></i> Secure Ticket for KSH {{ formatPrice(event.price) }}
            </span>
          </button>

          <p class="secure-note">
            <i class="fas fa-shield-alt"></i> You'll receive an STK push to complete payment
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/services/supabase.js';
import { useRoute } from 'vue-router';

export default {
  name: 'TicketCard',
  setup() {
    const route = useRoute();
    return { route, supabase };
  },
  data() {
    return {
      event: null,
      formData: {
        name: '',
        email: '',
        phoneNumber: ''
      },
      isProcessing: false,
      showConfirmation: false,
      error: null
    };
  },
  async created() {
    await this.fetchEventData();
  },
  methods: {
    async fetchEventData() {
      try {
        const eventId = this.route.params.id;
        if (!eventId) {
          throw new Error('Event ID is missing in route parameters');
        }

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) {
          throw new Error(`Failed to fetch event: ${error.message}`);
        }

        if (!data) {
          throw new Error('Event not found');
        }

        this.event = {
          id: data.id,
          title: data.title,
          thumbnail: data.thumbnail,
          date: data.date,
          description: data.description,
          price: data.price,
          location: data.location
        };
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching event data:', err);
      }
    },
    handleImageError(event) {
      console.error(`Failed to load image: ${this.event.thumbnail}`);
      this.event.thumbnail = '/images/default-event.jpg';
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    },
    formatPrice(price) {
      return price.toLocaleString('en-US');
    },
    validateForm() {
      if (!this.formData.name || !this.formData.email || !this.formData.phoneNumber) {
        alert('Please fill in all required fields');
        return false;
      }

      const phonePattern = /^[7|1][0-9]{8}$/;
      if (!phonePattern.test(this.formData.phoneNumber)) {
        alert('Please enter a valid phone number starting with 7 or 1 followed by 8 digits');
        return false;
      }

      return true;
    },
    async initiatePayment() {
      if (!this.validateForm()) return;

      this.isProcessing = true;
      this.error = null;

      try {
        // Simulate STK push request to M-Pesa
        const phoneNumber = `254${this.formData.phoneNumber}`; // Format phone number
        const amount = this.event.price;
        const accountReference = `TICKET_${this.event.id}_${Date.now()}`; // Unique reference
        const transactionDesc = `Payment for ${this.event.title}`;

        // Mock API call to M-Pesa STK push (replace with real API in production)
        const response = await this.simulateStkPush(phoneNumber, amount, accountReference, transactionDesc);

        if (response.success) {
          this.showConfirmation = true;
          console.log('STK Push initiated:', response);
        } else {
          throw new Error(response.message || 'Failed to initiate STK push');
        }
      } catch (err) {
        this.error = err.message || 'An error occurred during payment initiation';
        console.error('Payment error:', err);
      } finally {
        this.isProcessing = false;
      }
    },
    async simulateStkPush(phoneNumber, amount, accountReference, transactionDesc) {
      // Simulated STK push response (mocks M-Pesa API behavior)
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate success or failure randomly for demo purposes
          const isSuccess = Math.random() > 0.2; // 80% success rate
          if (isSuccess) {
            resolve({
              success: true,
              message: `STK push sent to ${phoneNumber} for KSH ${amount}`,
              checkoutRequestID: `ws_CO_${Date.now()}`
            });
          } else {
            resolve({
              success: false,
              message: 'Insufficient funds or invalid phone number'
            });
          }
        }, 2000); // Simulate network delay
      });
    }
  }
};
</script>

<style scoped>
/* Existing styles remain unchanged */
.ticket-card-container {
  position: relative;
  max-width: 600px;
  margin: 40px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.ticket-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.ticket-header {
  background: linear-gradient(135deg, #4060ee, #041c86);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.ticket-badge {
  background: #27ae60;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.ticket-thumbnail {
  width: 100%;
  height: 200px;
  background: #e0e0e0;
}

.ticket-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ticket-details {
  padding: 20px;
}

.ticket-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-item i {
  color: #3498db;
  font-size: 18px;
}

.info-label {
  display: block;
  font-size: 14px;
  color: #666;
}

.info-value {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.ticket-description {
  margin-bottom: 20px;
}

.ticket-description h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.ticket-description p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.ticket-price {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.price-label {
  display: block;
  font-size: 14px;
  color: #666;
}

.price-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
}

.form-group small {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.phone-input {
  display: flex;
  align-items: center;
}

.phone-input .country-code {
  padding: 10px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 14px;
  color: #333;
}

.phone-input input {
  border-radius: 0 8px 8px 0;
  flex: 1;
}

.grab-ticket-btn {
  background: #27ae60;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.grab-ticket-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.secure-note {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}

.secure-note i {
  color: #27ae60;
  margin-right: 5px;
}

.confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirmation-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.confirmation-header i {
  color: #27ae60;
  font-size: 40px;
  margin-bottom: 10px;
}

.confirmation-header h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.confirmation-body p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.close-btn {
  background: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message, .loading-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message p {
  color: #e74c3c;
  font-size: 16px;
}
</style>
