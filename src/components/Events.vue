<!-- EventsView.vue - Main events management page -->
<template>
  <div class="events-view">
    <div class="page-header">
      <h1>Event Management</h1>
      <router-link to="/admin/create-event" class="create-btn">
        <i class="fas fa-plus"></i> Create New Event
      </router-link>
    </div>

    <div class="search-filter-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search events..."
          v-model="searchQuery"
          @input="filterEvents"
        />
      </div>
      <div class="filter-options">
        <select v-model="statusFilter" @change="filterEvents">
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="postponed">Postponed</option>
        </select>
        <button @click="sortEvents('date')" class="sort-btn">
          Sort by Date
          <i :class="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
        </button>
      </div>
    </div>

    <!-- Events Table -->
    <div class="events-table-container">
      <table class="events-table" v-if="filteredEvents.length > 0">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th @click="sortEvents('title')">Event Title</th>
            <th @click="sortEvents('date')">Event Date</th>
            <th @click="sortEvents('price')">Ticket Price (KSH)</th>
            <th>Tickets Sold</th>
            <th>Revenue (KSH)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in filteredEvents" :key="event.id" :class="{ 'postponed': event.isPostponed }">
            <td>
              <img
                  :src="event.thumbnail || '/images/default-event.jpg'"
                  :alt="event.title"
                  class="event-thumbnail"
                  @error="handleImageError"
                />
            </td>
            <td>{{ event.title }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>{{ formatCurrency(event.price) }}</td>
            <td>{{ event.ticketsSold }}</td>
            <td>{{ formatCurrency(event.price * event.ticketsSold) }}</td>
            <td>
              <span :class="getStatusClass(event)">{{ getStatusText(event) }}</span>
            </td>
            <td class="actions-cell">
              <router-link :to="`/admin/events/${event.id}`" class="action-btn view-btn">
                <i class="fas fa-eye"></i>
              </router-link>
              <router-link :to="`/admin/events/${event.id}/edit`" class="action-btn edit-btn">
                <i class="fas fa-edit"></i>
              </router-link>
              <button class="action-btn postpone-btn" @click="showPostponeModal(event)" :disabled="isPastEvent(event)">
                <i class="fas fa-calendar-plus"></i>
              </button>
              <button class="action-btn delete-btn" @click="showDeleteModal(event)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="no-events" v-else>
        <i class="fas fa-calendar-times"></i>
        <p>No events found matching your criteria</p>
      </div>
    </div>

    <!-- Postpone Event Modal -->
    <div class="modal" v-if="postponeModalVisible">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Postpone Event</h2>
          <button class="close-btn" @click="postponeModalVisible = false">×</button>
        </div>
        <div class="modal-body">
          <p>You are about to postpone: <strong>{{ selectedEvent?.title }}</strong></p>
          <div class="form-group">
            <label for="newDate">New Event Date:</label>
            <input type="datetime-local" id="newDate" v-model="newEventDate" />
          </div>
          <div class="form-group">
            <label for="postponeReason">Reason for Postponement:</label>
            <textarea id="postponeReason" v-model="postponeReason" placeholder="Enter reason for postponement..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="postponeModalVisible = false">Cancel</button>
          <button class="postpone-confirm-btn" @click="postponeEvent">Confirm Postponement</button>
        </div>
      </div>
    </div>

    <!-- Delete Event Modal -->
    <div class="modal" v-if="deleteModalVisible">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Delete Event</h2>
          <button class="close-btn" @click="deleteModalVisible = false">×</button>
        </div>
        <div class="modal-body">
          <div class="warning-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p>Are you sure you want to delete the event: <strong>{{ selectedEvent?.title }}</strong>?</p>
          <p class="warning-text">This action cannot be undone. All data related to this event including ticket sales will be permanently removed.</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="deleteModalVisible = false">Cancel</button>
          <button class="delete-confirm-btn" @click="deleteEvent">Confirm Deletion</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, getCurrentInstance } from 'vue';

export default {
  name: 'EventsView',
  setup() {
    const { appContext } = getCurrentInstance();

    // Data
    const events = ref([]);
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const sortKey = ref('date');
    const sortDirection = ref('asc');
    const postponeModalVisible = ref(false);
    const deleteModalVisible = ref(false);
    const selectedEvent = ref(null);
    const newEventDate = ref('');
    const postponeReason = ref('');

    // Fetch events from Supabase
    onMounted(async () => {
      await fetchEvents();
    });

    const fetchEvents = async () => {
      const { data, error } = await appContext.config.globalProperties.$supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error);
        alert('Error fetching events');
      } else {
        events.value = data;
      }
    };

    // Filter events based on search and status
    const filteredEvents = computed(() => {
      return events.value.filter(event => {
        // Search filter
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                             event.description.toLowerCase().includes(searchQuery.value.toLowerCase());

        // Status filter
        const eventDate = new Date(event.date);
        const today = new Date();
        const isPast = eventDate < today;

        if (statusFilter.value === 'upcoming' && (isPast || event.isPostponed)) return false;
        if (statusFilter.value === 'past' && !isPast) return false;
        if (statusFilter.value === 'postponed' && !event.isPostponed) return false;

        return matchesSearch;
      }).sort((a, b) => {
        // Apply sorting
        let valA, valB;

        if (sortKey.value === 'date') {
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
        } else if (sortKey.value === 'price') {
          valA = a.price;
          valB = b.price;
        } else {
          valA = a[sortKey.value].toLowerCase();
          valB = b[sortKey.value].toLowerCase();
        }

        if (sortDirection.value === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
    });

    // Methods
    const filterEvents = () => {
      // Filtering happens automatically via computed property
    };

    const sortEvents = (key) => {
      if (sortKey.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortDirection.value = 'asc';
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        currencyDisplay: 'narrowSymbol'
      }).format(amount);
    };

    const isPastEvent = (event) => {
      return new Date(event.date) < new Date();
    };

    const getStatusClass = (event) => {
      if (event.isPostponed) return 'status-postponed';
      return isPastEvent(event) ? 'status-past' : 'status-upcoming';
    };

    const getStatusText = (event) => {
      if (event.isPostponed) return 'Postponed';
      return isPastEvent(event) ? 'Past' : 'Upcoming';
    };

    const showPostponeModal = (event) => {
      selectedEvent.value = event;
      newEventDate.value = event.date.substring(0, 16); // Format for datetime-local input
      postponeReason.value = '';
      postponeModalVisible.value = true;
    };

    const showDeleteModal = (event) => {
      selectedEvent.value = event;
      deleteModalVisible.value = true;
    };

    const postponeEvent = async () => {
      if (!newEventDate.value) {
        alert('Please select a new date for the event');
        return;
      }

      const { data, error } = await appContext.config.globalProperties.$supabase
        .from('events')
        .update({
          date: newEventDate.value,
          isPostponed: true,
          originalDate: selectedEvent.value.date // Store original date
        })
        .eq('id', selectedEvent.value.id)
        .select();

      if (error) {
        console.error('Error postponing event:', error);
        alert('Error postponing event');
      } else {
        console.log('Event postponed:', data);
        // Update the events array
        events.value = events.value.map(event =>
          event.id === selectedEvent.value.id ? { ...event, date: newEventDate.value, isPostponed: true } : event
        );
        postponeModalVisible.value = false;
      }
    };

    const deleteEvent = async () => {
      const { error } = await appContext.config.globalProperties.$supabase
        .from('events')
        .delete()
        .eq('id', selectedEvent.value.id);

      if (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
      } else {
        console.log('Event deleted:', selectedEvent.value);
        // Update the events array
        events.value = events.value.filter(e => e.id !== selectedEvent.value.id);
        deleteModalVisible.value = false;
      }
    };

    return {
      events,
      searchQuery,
      statusFilter,
      sortKey,
      sortDirection,
      filteredEvents,
      postponeModalVisible,
      deleteModalVisible,
      selectedEvent,
      newEventDate,
      postponeReason,
      filterEvents,
      sortEvents,
      formatDate,
      formatCurrency,
      getStatusClass,
      getStatusText,
      isPastEvent,
      showPostponeModal,
      showDeleteModal,
      postponeEvent,
      deleteEvent
    };
  }
};
</script>

<style scoped>
.events-view {
  padding: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-header h1 {
  font-size: 24px;
  color: #2c3e50;
}

.create-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
}

.search-filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 8px 15px;
  width: 300px;
}

.search-box i {
  color: #95a5a6;
  margin-right: 10px;
}

.search-box input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
}

.filter-options {
  display: flex;
  gap: 10px;
}

.filter-options select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  outline: none;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.sort-btn:hover {
  background-color: #f5f5f5;
}

.events-table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th {
  background-color: #f8f9fa;
  text-align: left;
  padding: 15px;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s ease;
}

.events-table th:hover {
  background-color: #eaeaea;
}

.events-table td {
  padding: 15px;
  border-top: 1px solid #eaeaea;
  vertical-align: middle;
}

.event-thumbnail {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  text-decoration: none;
}

.view-btn {
  background-color: #3498db;
}

.view-btn:hover {
  background-color: #2980b9;
}

.edit-btn {
  background-color: #f39c12;
}

.edit-btn:hover {
  background-color: #d35400;
}

.postpone-btn {
  background-color: #e74c3c;
}

.postpone-btn:hover {
  background-color: #c0392b;
}

.delete-btn {
  background-color: #e74c3c;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.action-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.status-upcoming {
  background-color: #2ecc71;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.status-past {
  background-color: #95a5a6;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.status-postponed {
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.postponed {
  background-color: rgba(231, 76, 60, 0.1);
}

.no-events {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  color: #95a5a6;
}

.no-events i {
  font-size: 50px;
  margin-bottom: 15px;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h2 {
  font-size: 18px;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #95a5a6;
}

.modal-body {
  padding: 20px;
}

.warning-icon {
  display: flex;
  justify-content: center;
  font-size: 50px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.warning-text {
  color: #e74c3c;
  margin-top: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eaeaea;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #f5f7fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.postpone-confirm-btn,
.delete-confirm-btn {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .search-filter-section {
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .events-table {
    display: block;
    overflow-x: auto;
  }

  .page-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
