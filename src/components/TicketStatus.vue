<template>
  <div class="ticket-status-container">
    <div v-if="loading" class="loading-message">
      <div class="spinner"></div>
      <p>Checking your payment status...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <h2>Something went wrong</h2>
      <p>{{ error }}</p>
      <router-link to="/ongoingEvents" class="action-btn back-btn">
        <i class="fas fa-arrow-left"></i> Back to Events
      </router-link>
    </div>

    <div v-else-if="transactionStatus === 'COMPLETED'" class="success-container">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2>Payment Successful!</h2>
      <p>Your ticket has been sent to your email address.</p>

      <div class="ticket-details">
        <h3>Your Ticket Details</h3>
        <div class="detail-row">
          <span class="detail-label">Event:</span>
          <span class="detail-value">{{ event?.title }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time:</span>
          <span class="detail-value">{{ formatDate(event?.date) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">{{ event?.location }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Paid:</span>
          <span class="detail-value">KSH {{ formatPrice(transaction?.amount) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Ticket ID:</span>
          <span class="detail-value">{{ ticket?.ticket_id }}</span>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="downloadTicket" class="action-btn download-btn">
          <i class="fas fa-download"></i> Download Ticket
        </button>
        <router-link to="/ongoingEvents" class="action-btn browse-btn">
          <i class="fas fa-list"></i> Browse More Events
        </router-link>
      </div>
    </div>

    <div v-else-if="transactionStatus === 'PENDING'" class="pending-container">
      <div class="pending-icon">
        <i class="fas fa-clock"></i>
      </div>
      <h2>Waiting for Payment Confirmation</h2>
      <p>Your order has been received and is awaiting payment confirmation.</p>
      <p>Please check your phone and complete the M-Pesa payment to finalize your ticket purchase.</p>

      <div class="action-buttons">
        <button @click="checkStatus" class="action-btn refresh-btn">
          <i class="fas fa-sync"></i> Check Status Again
        </button>
      </div>
    </div>

    <div v-else-if="transactionStatus === 'FAILED'" class="failed-container">
      <div class="failed-icon">
        <i class="fas fa-times-circle"></i>
      </div>
      <h2>Payment Failed</h2>
      <p>Unfortunately, your payment could not be processed.</p>
      <p>{{ transaction?.result_description || 'Please try again or use a different payment method.' }}</p>

      <div class="action-buttons">
        <router-link :to="`/ongoingEvents/${event?.id}`" class="action-btn retry-btn">
          <i class="fas fa-redo"></i> Try Again
        </router-link>
        <router-link to="/ongoingEvents" class="action-btn back-btn">
          <i class="fas fa-arrow-left"></i> Back to Events
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/services/supabase.js';
import { useRoute } from 'vue-router';

export default {
  name: 'TicketStatus',
  setup() {
    const route = useRoute();
    return { route };
  },
  data() {
    return {
      loading: true,
      error: null,
      checkoutRequestId: null,
      transaction: null,
      ticket: null,
      event: null,
      transactionStatus: null,
      pollingInterval: null
    };
  },
  async created() {
    this.checkoutRequestId = this.route.query.id;

    if (!this.checkoutRequestId) {
      this.error = 'Invalid request. No transaction ID provided.';
      this.loading = false;
      return;
    }

    await this.checkStatus();

    // Start polling for status if the transaction is pending
    if (this.transactionStatus === 'PENDING') {
      this.startPolling();
    }
  },
  beforeUnmount() {
    // Clear polling interval when component is destroyed
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  },
  methods: {
    async checkStatus() {
      this.loading = true;
      this.error = null;

      try {
        // Get transaction details
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('checkout_request_id', this.checkoutRequestId)
          .single();

        if (transactionError) {
          throw new Error('Transaction not found. Please check your payment reference.');
        }

        this.transaction = transactionData;
        this.transactionStatus = transactionData.status;

        // Get event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', transactionData.event_id)
          .single();

        if (eventError) {
          throw new Error('Event details not found.');
        }

        this.event = eventData;

        // If payment is completed, get ticket details
        if (this.transactionStatus === 'COMPLETED') {
          const { data: ticketData, error: ticketError } = await supabase
            .from('tickets')
            .select('*')
            .eq('transaction_id', transactionData.id)
            .single();

          if (!ticketError) {
            this.ticket = ticketData;
          }
        }
      } catch (err) {
        this.error = err.message;
        console.error('Error checking status:', err);
      } finally {
        this.loading = false;
      }
    },
    startPolling() {
      // Poll every 5 seconds for 2 minutes
      const maxAttempts = 24; // 24 * 5 seconds = 2 minutes
      let attempts = 0;

      this.pollingInterval = setInterval(async () => {
        attempts++;

        await this.checkStatus();

        // Stop polling if transaction is no longer pending or we've reached max attempts
        if (this.transactionStatus !== 'PENDING' || attempts >= maxAttempts) {
          clearInterval(this.pollingInterval);
        }
      }, 5000);
    },
    formatDate(dateString) {
      if (!dateString) return '';

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
      if (!price) return '0';
      return parseFloat(price).toLocaleString('en-US');
    },
    downloadTicket() {
      // In a real implementation, you would generate and download a PDF ticket
      // For this example, we'll just show an alert
      alert('Ticket download functionality would be implemented here!');

      // Example implementation could use jsPDF or html2canvas to generate a PDF
      // const doc = new jsPDF();
      // doc.text(`Ticket: ${this.ticket.ticket_id}`, 10, 10);
      // doc.text(`Event: ${this.event.title}`, 10, 20);
      // doc.save(`ticket-${this.ticket.ticket_id}.pdf`);
    }
  }
};
</script>

<style scoped>
.ticket-status-container {
  max-width: 600px;
  margin: 40px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
}

.loading-message {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-container, .pending-container, .failed-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.success-icon, .pending-icon, .failed-icon, .error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.success-icon i {
  color: #27ae60;
}

.pending-icon i {
  color: #f39c12;
}

.failed-icon i, .error-icon i {
  color: #e74c3c;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

.ticket-details {
  width: 100%;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: left;
}

.ticket-details h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
  text-align: center;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #333;
  width: 120px;
  flex-shrink: 0;
}

.detail-value {
  color: #666;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.action-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.download-btn {
  background: #27ae60;
  color: white;
}

.download-btn:hover {
  background: #219653;
}

.browse-btn {
  background: #3498db;
  color: white;
}

.browse-btn:hover {
  background: #2980b9;
}

.refresh-btn {
  background: #f39c12;
  color: white;
}

.refresh-btn:hover {
  background: #e67e22;
}

.retry-btn {
  background: #e74c3c;
  color: white;
}

.retry-btn:hover {
  background: #c0392b;
}

.back-btn {
  background: #95a5a6;
  color: white;
}

.back-btn:hover {
  background: #7f8c8d;
}
</style>
