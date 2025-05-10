<template>
  <div class="event-ticket-page">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading event details...</p>
    </div>

    <div v-else-if="event" class="ticket-container">
      <!-- Event Ticket Preview -->
      <div class="event-ticket">
        <div class="ticket-header">
          <h1>{{ event.title }}</h1>
          <div class="ticket-badge" v-if="event.isfeatured">Featured</div>
        </div>

        <div class="ticket-body">
          <div class="ticket-thumbnail">
            <img :src="event.thumbnail" :alt="event.title" />
          </div>

          <div class="ticket-details">
            <div class="ticket-info">
              <div class="info-item">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ formatDate(event.date) }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ event.location }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-tag"></i>
                <span>{{ formatCategory(event.category) }}</span>
              </div>
              <div class="info-item price">
                <i class="fas fa-ticket-alt"></i>
                <span>KSH {{ formatPrice(event.price) }}</span>
              </div>
            </div>

            <div class="ticket-description">
              <h3>Event Details</h3>
              <p>{{ truncateDescription(event.description) }}</p>
              <button v-if="descriptionExpanded" @click="descriptionExpanded = false" class="read-more-btn">
                Read Less
              </button>
              <button v-else @click="descriptionExpanded = true" class="read-more-btn">
                Read More
              </button>
            </div>

            <div class="ticket-action">
              <p v-if="event.capacity" class="seats-left">
                {{ getRemainingSeats() }} seats remaining
              </p>
              <button
                @click="openPaymentModal"
                class="grab-ticket-btn"
                :disabled="!isAuthenticated || (event.capacity && event.ticketsSold >= event.capacity)"
              >
                <i class="fas fa-ticket-alt"></i> Grab A Ticket
              </button>
              <p v-if="!isAuthenticated" class="login-required">
                Please <router-link to="/login">log in</router-link> to purchase tickets
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <div v-if="showPaymentModal" class="payment-modal">
        <div class="payment-modal-content">
          <div class="modal-header">
            <h2>Complete Your Purchase</h2>
            <button @click="showPaymentModal = false" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="purchase-summary">
              <h3>Purchase Summary</h3>
              <div class="summary-item">
                <span>Event:</span>
                <span>{{ event.title }}</span>
              </div>
              <div class="summary-item">
                <span>Date:</span>
                <span>{{ formatDate(event.date) }}</span>
              </div>
              <div class="summary-item">
                <span>Location:</span>
                <span>{{ event.location }}</span>
              </div>
              <div class="summary-item total">
                <span>Total:</span>
                <span>KSH {{ formatPrice(event.price) }}</span>
              </div>
            </div>

            <div class="payment-form">
              <form @submit.prevent="initiatePayment">
                <div class="form-group">
                  <label for="phone">Phone Number (M-Pesa)</label>
                  <div class="phone-input">
                    <span class="country-code">+254</span>
                    <input
                      type="tel"
                      id="phone"
                      v-model="phoneNumber"
                      placeholder="7XXXXXXXX"
                      pattern="^[7|1][0-9]{8}$"
                      required
                    />
                  </div>
                  <small>Enter your phone number without leading zero, e.g. 712345678</small>
                </div>

                <div class="payment-action">
                  <button
                    type="submit"
                    class="pay-btn"
                    :disabled="isProcessingPayment"
                  >
                    <span v-if="isProcessingPayment">
                      <div class="spinner-small"></div> Processing...
                    </span>
                    <span v-else>
                      <i class="fas fa-lock"></i> Pay KSH {{ formatPrice(event.price) }}
                    </span>
                  </button>
                  <p class="secure-note">
                    <i class="fas fa-shield-alt"></i> You'll receive an STK push to enter your PIN
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Payment Status Modal -->
      <div v-if="showStatusModal" class="status-modal">
        <div class="status-modal-content">
          <div class="status-header" :class="{ 'success': paymentSuccess, 'error': !paymentSuccess }">
            <i v-if="paymentSuccess" class="fas fa-check-circle"></i>
            <i v-else class="fas fa-exclamation-circle"></i>
            <h2>{{ paymentSuccess ? 'Payment Successful!' : 'Payment Failed' }}</h2>
          </div>

          <div class="status-body">
            <p v-if="paymentSuccess">
              Thank you for your purchase! Your ticket has been sent to your email.
              We look forward to seeing you at the event.
            </p>
            <p v-else>
              {{ paymentErrorMessage || 'Something went wrong with your payment. Please try again.' }}
            </p>

            <div class="status-actions">
              <button
                v-if="paymentSuccess"
                @click="closeStatusModal"
                class="success-btn"
              >
                Close
              </button>
              <button
                v-else
                @click="retryPayment"
                class="retry-btn"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <p>Event not found or has been removed.</p>
      <router-link to="/events" class="back-to-events">
        Browse Other Events
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/services/supabase';

export default {
  name: 'EventTicket',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const event = ref(null);
    const loading = ref(true);
    const showPaymentModal = ref(false);
    const showStatusModal = ref(false);
    const phoneNumber = ref('');
    const isProcessingPayment = ref(false);
    const paymentSuccess = ref(false);
    const paymentErrorMessage = ref('');
    const descriptionExpanded = ref(false);

    const isAuthenticated = computed(() => {
      const session = supabase.auth.session();
      return !!session;
    });

    onMounted(async () => {
      try {
        const eventId = route.params.eventId;
        if (!eventId) {
          router.push('/events');
          return;
        }

        await fetchEventDetails(eventId);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        loading.value = false;
      }
    });

    const fetchEventDetails = async (eventId) => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) throw error;
        event.value = data;
      } catch (error) {
        console.error('Error fetching event details:', error);
        event.value = null;
      }
    };

    const formatDate = (dateString) => {
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
    };

    const formatPrice = (price) => {
      return price.toLocaleString('en-US');
    };

    const formatCategory = (category) => {
      if (!category) return 'General';
      return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const truncateDescription = (description) => {
      if (!description) return '';
      if (descriptionExpanded.value) return description;

      const maxLength = 150;
      if (description.length <= maxLength) return description;
      return description.substring(0, maxLength) + '...';
    };

    const getRemainingSeats = () => {
      if (!event.value || !event.value.capacity) return 'Unlimited';
      const remaining = event.value.capacity - (event.value.ticketsSold || 0);
      return remaining > 0 ? remaining : 'Sold Out';
    };

    const openPaymentModal = () => {
      if (!isAuthenticated.value) {
        router.push('/login?redirect=' + route.fullPath);
        return;
      }
      showPaymentModal.value = true;
    };

    const initiatePayment = async () => {
      if (!validatePhoneNumber()) {
        alert('Please enter a valid phone number');
        return;
      }

      try {
        isProcessingPayment.value = true;

        // In a real implementation, this would call your backend API to initiate STK push
        const response = await initiateSTKPush();

        // For demonstration, we'll simulate a successful payment
        setTimeout(() => {
          isProcessingPayment.value = false;
          showPaymentModal.value = false;

          if (response.success) {
            paymentSuccess.value = true;
            // Call function to update ticket count in database and send email
            completeTicketPurchase();
          } else {
            paymentSuccess.value = false;
            paymentErrorMessage.value = response.message;
          }

          showStatusModal.value = true;
        }, 3000);

      } catch (error) {
        console.error('Payment error:', error);
        isProcessingPayment.value = false;
        paymentSuccess.value = false;
        paymentErrorMessage.value = 'Network error. Please try again.';
        showPaymentModal.value = false;
        showStatusModal.value = true;
      }
    };

    const validatePhoneNumber = () => {
      const phonePattern = /^[7|1][0-9]{8}$/;
      return phonePattern.test(phoneNumber.value);
    };

    // This is a mock function - in a real app, you'd call your backend API
    const initiateSTKPush = async () => {
      // Simulate API call to your backend that would handle the STK push
      return new Promise((resolve) => {
        // Simulate successful payment 80% of the time
        const success = Math.random() > 0.2;

        setTimeout(() => {
          if (success) {
            resolve({
              success: true,
              message: 'Payment received successfully'
            });
          } else {
            resolve({
              success: false,
              message: 'M-Pesa transaction failed. Please try again.'
            });
          }
        }, 2000);
      });
    };

    // This is a mock function - in a real app, you'd update your database and send emails
    const completeTicketPurchase = async () => {
      try {
        // 1. Update the tickets sold count in the database
        if (event.value) {
          const { error } = await supabase
            .from('events')
            .update({ ticketsSold: (event.value.ticketsSold || 0) + 1 })
            .eq('id', event.value.id);

          if (error) throw error;
        }

        // 2. Create a ticket record in your tickets table
        const { data: userData } = await supabase.auth.getUser();

        if (userData && userData.user) {
          const { error: ticketError } = await supabase
            .from('tickets')
            .insert([
              {
                event_id: event.value.id,
                user_id: userData.user.id,
                phone_number: '+254' + phoneNumber.value,
                price_paid: event.value.price,
                purchase_date: new Date().toISOString(),
                ticket_code: generateTicketCode(),
                status: 'active'
              }
            ]);

          if (ticketError) throw ticketError;
        }

        // 3. In a real app, you would call your backend to send the email with the ticket
        console.log('Email would be sent with ticket details');

      } catch (error) {
        console.error('Error completing ticket purchase:', error);
      }
    };

    const generateTicketCode = () => {
      // Generate a random alphanumeric ticket code
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const retryPayment = () => {
      paymentErrorMessage.value = '';
      showStatusModal.value = false;
      showPaymentModal.value = true;
    };

    const closeStatusModal = () => {
      showStatusModal.value = false;
      // Refresh the event data to show updated ticket count
      if (event.value) {
        fetchEventDetails(event.value.id);
      }
    };

    return {
      event,
      loading,
      showPaymentModal,
      showStatusModal,
      phoneNumber,
      isProcessingPayment,
      paymentSuccess,
      paymentErrorMessage,
      isAuthenticated,
      descriptionExpanded,
      formatDate,
      formatPrice,
      formatCategory,
      truncateDescription,
      getRemainingSeats,
      openPaymentModal,
      initiatePayment,
      retryPayment,
      closeStatusModal
    };
  }
};
</script>

<style scoped>
.event-ticket-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ticket-container {
  position: relative;
}

.event-ticket {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.ticket-header {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 20px 30px;
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
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 14px;
  font-weight: 500;
}

.ticket-body {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .ticket-body {
    flex-direction: row;
  }
}

.ticket-thumbnail {
  width: 100%;
  overflow: hidden;
}

@media (min-width: 768px) {
  .ticket-thumbnail {
    width: 40%;
  }
}

.ticket-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ticket-details {
  flex: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.ticket-info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 15px;
}

.info-item {
  flex: 1;
  min-width: calc(50% - 15px);
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item i {
  color: #3498db;
  margin-right: 10px;
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.info-item.price {
  background: #ebf7fd;
}

.info-item.price i,
.info-item.price span {
  color: #3498db;
  font-weight: 600;
}

.ticket-description {
  margin-bottom: 25px;
}

.ticket-description h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

.ticket-description p {
  margin: 0 0 15px;
  line-height: 1.6;
  color: #555;
}

.read-more-btn {
  background: none;
  border: none;
  color: #3498db;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.ticket-action {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.seats-left {
  font-size: 14px;
  color: #e74c3c;
  margin-bottom: 10px;
  font-weight: 500;
}

.grab-ticket-btn {
  width: 100%;
  max-width: 300px;
  padding: 15px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(46, 204, 113, 0.2);
}

.grab-ticket-btn:hover {
  background: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(46, 204, 113, 0.3);
}

.grab-ticket-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-required {
  margin-top: 10px;
  font-size: 14px;
  color: #7f8c8d;
}

.login-required a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

/* Payment Modal Styles */
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
}

.payment-modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background: #f8f9fa;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #95a5a6;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 20px;
}

.purchase-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.purchase-summary h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.summary-item span:first-child {
  color: #7f8c8d;
}

.summary-item.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-weight: 600;
  font-size: 16px;
}

.payment-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.phone-input {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.country-code {
  background: #f8f9fa;
  padding: 12px;
  border-right: 1px solid #ddd;
  color: #7f8c8d;
  font-weight: 500;
}

.phone-input input {
  flex: 1;
  padding: 12px;
  border: none;
  outline: none;
  font-size: 16px;
}

.payment-form small {
  display: block;
  margin-top: 5px;
  color: #7f8c8d;
  font-size: 12px;
}

.payment-action {
  margin-top: 25px;
}

.pay-btn {
  width: 100%;
  padding: 15px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.pay-btn:hover:not(:disabled) {
  background: #c0392b;
}

.pay-btn:disabled {
  background: #e57373;
  cursor: not-allowed;
}

.spinner-small {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

.secure-note {
  text-align: center;
  margin-top: 15px;
  font-size: 13px;
  color: #7f8c8d;
}

.secure-note i {
  color: #27ae60;
  margin-right: 5px;
}

/* Status Modal Styles */
.status-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.status-modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modalBounce 0.5s ease-out;
}

@keyframes modalBounce {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.status-header {
  padding: 30px 20px;
  text-align: center;
  color: white;
}

.status-header.success {
  background: #2ecc71;
}

.status-header.error {
  background: #e74c3c;
}

.status-header i {
  font-size: 50px;
  margin-bottom: 15px;
}

.status-header h2 {
  margin: 0;
  font-size: 24px;
}

.status-body {
  padding: 25px;
  text-align: center;
}

.status-body p {
  margin: 0 0 25px;
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

.status-actions {
  display: flex;
  justify-content: center;
}

.success-btn, .retry-btn {
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.success-btn {
  background: #2ecc71;
  color: white;
  border: none;
}

.success-btn:hover {
  background: #27ae60;
}

.retry-btn {
  background: white;
  color: #e74c3c;
  border: 2px solid #e74c3c;
}

.retry-btn:hover {
  background: #fcf0f0;
}

/* Error Container */
.error-container {
  text-align: center;
  padding: 50px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-container i {
  font-size: 50px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.error-container p {
  font-size: 18px;
  color: #555;
  margin-bottom: 25px;
}

.back-to-events {
  display: inline-block;
  padding: 12px 25px;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-to-events:hover {
  background: #2980b9;
  transform: translateY(-2px);
}
</style>
