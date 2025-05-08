<template>
  <div class="admin-dashboard">
    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <!-- Statistics Cards -->
      <div class="stats-cards">
        <div class="stat-card" v-for="(stat, index) in statistics" :key="index">
          <div class="stat-icon" :style="{ backgroundColor: stat.bgColor }">
            <i :class="'fas ' + stat.icon"></i>
          </div>
          <div class="stat-info">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
          <div class="stat-trend" :class="stat.trend">
            <i :class="'fas fa-arrow-' + (stat.trend === 'up' ? 'up' : 'down')"></i>
            <span>{{ stat.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-card revenue-chart">
          <div class="card-header">
            <h3>Revenue Overview</h3>
            <div class="dropdown">
              <button class="dropdown-btn" @click="toggleRevenuePeriod">
                {{ revenuePeriod }} <i class="fas fa-chevron-down"></i>
              </button>
              <div class="dropdown-menu" v-if="showRevenueDropdown">
                <div class="dropdown-item" @click="setRevenuePeriod('This Week')">This Week</div>
                <div class="dropdown-item" @click="setRevenuePeriod('This Month')">This Month</div>
                <div class="dropdown-item" @click="setRevenuePeriod('This Year')">This Year</div>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>

        <div class="chart-card ticket-chart">
          <div class="card-header">
            <h3>Ticket Sales</h3>
            <div class="dropdown">
              <button class="dropdown-btn" @click="toggleTicketPeriod">
                {{ ticketPeriod }} <i class="fas fa-chevron-down"></i>
              </button>
              <div class="dropdown-menu" v-if="showTicketDropdown">
                <div class="dropdown-item" @click="setTicketPeriod('Last 7 Days')">Last 7 Days</div>
                <div class="dropdown-item" @click="setTicketPeriod('Last 30 Days')">Last 30 Days</div>
                <div class="dropdown-item" @click="setTicketPeriod('Last Year')">Last Year</div>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <canvas ref="ticketChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Events Table -->
      <div class="recent-events">
        <div class="card-header">
          <h3>Recent Events</h3>
          <button class="view-all-btn" @click="navigateTo('/admin/events')">
            View All <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="table-container">
          <table class="events-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Sales</th>
                <!-- <th>Actions</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(event, index) in filteredEvents" :key="index">
                <td class="event-info">
                  <img :src="event.thumbnail || 'https://placehold.co/48x48'" alt="Event Thumbnail" class="event-thumb" />
                  <div>
                    <p class="event-title">{{ event.title }}</p>
                    <p class="event-category">{{ event.category }}</p>
                  </div>
                </td>
                <td>{{ formatDate(event.date) }}</td>
                <td>{{ event.location }}</td>
                <td>KSH {{ event.price }}</td>
                <td>
                  <span class="status-badge" :class="event.status.toLowerCase()">
                    {{ event.status }}
                  </span>
                </td>
                <td>
                  <div class="sales-progress">
                    <div class="progress-bar" :style="{ width: calculateSalesPercentage(event) + '%' }"></div>
                    <span>{{ event.ticketsSold }}/{{ event.capacity }}</span>
                  </div>
                </td>
                <!-- <td class="actions">
                  <button class="action-btn edit" @click="editEvent(event.id)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn view" @click="viewEvent(event.id)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="action-btn delete" @click="confirmDelete(event.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div class="quick-actions">
        <button class="action-card" @click="navigateTo('/admin/events/create')">
          <i class="fas fa-calendar-plus"></i>
          <span>Create Event</span>
        </button>
        <button class="action-card" @click="navigateTo('/admin/reports')">
          <i class="fas fa-chart-line"></i>
          <span>View Reports</span>
        </button>
        <button class="action-card" @click="navigateTo('/admin/users')">
          <i class="fas fa-users"></i>
          <span>Manage Users</span>
        </button>
        <button class="action-card" @click="navigateTo('/admin/settings')">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirm Delete</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showDeleteModal = false">Cancel</button>
          <button class="delete-btn" @click="deleteEvent">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const unreadNotifications = ref(5);
    const showDeleteModal = ref(false);
    const eventToDelete = ref(null);
    const revenuePeriod = ref('This Month');
    const ticketPeriod = ref('Last 7 Days');
    const showRevenueDropdown = ref(false);
    const showTicketDropdown = ref(false);

    // Chart references
    const revenueChart = ref(null);
    const ticketChart = ref(null);
    let revenueChartInstance = null;
    let ticketChartInstance = null;

    // Statistics cards data
    const statistics = [
      {
        label: 'Total Revenue',
        value: 'KSH 845,000',
        icon: 'fa-dollar-sign',
        bgColor: '#4CAF50',
        trend: 'up',
        percentage: 12.5
      },
      {
        label: 'Ticket Sales',
        value: '1,253',
        icon: 'fa-ticket-alt',
        bgColor: '#2196F3',
        trend: 'up',
        percentage: 8.3
      },
      {
        label: 'Active Events',
        value: '24',
        icon: 'fa-calendar-check',
        bgColor: '#FF9800',
        trend: 'up',
        percentage: 5.1
      },
      {
        label: 'New Users',
        value: '321',
        icon: 'fa-user-plus',
        bgColor: '#9C27B0',
        trend: 'down',
        percentage: 2.8
      }
    ];

    // Sample data for charts
    const revenueData = ref({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [30000, 45000, 35000, 50000, 70000, 60000, 80000, 75000, 65000, 90000, 85000, 95000],
        backgroundColor: '#3498db',
        borderColor: '#3498db',
        borderWidth: 2,
        fill: false
      }]
    });

    const ticketCategories = [
      { label: 'Conference', percentage: 45, color: '#2196F3' },
      { label: 'Workshop', percentage: 25, color: '#4CAF50' },
      { label: 'Concert', percentage: 20, color: '#FF9800' },
      { label: 'Exhibition', percentage: 10, color: '#9C27B0' }
    ];

    // Sample recent events data
    const recentEvents = ref([]);

    // Computed property for filtered events
    const filteredEvents = computed(() => {
      if (!searchQuery.value) return recentEvents.value;
      return recentEvents.value.filter(event =>
        event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    onMounted(() => {
      fetchRecentEvents();
      initializeCharts();
    });

    const fetchRecentEvents = () => {
      recentEvents.value = [
        {
          id: 1,
          title: 'Tech Conference 2025',
          category: 'Conference',
          date: '2025-05-15T09:00',
          location: 'Nairobi Convention Center',
          price: 2500,
          status: 'Upcoming',
          ticketsSold: 420,
          capacity: 500,
          thumbnail: null
        },
        {
          id: 2,
          title: 'Web Development Workshop',
          category: 'Workshop',
          date: '2025-05-10T14:00',
          location: 'iHub Nairobi',
          price: 1200,
          status: 'Sold Out',
          ticketsSold: 50,
          capacity: 50,
          thumbnail: null
        },
        {
          id: 3,
          title: 'Marketing Masterclass',
          category: 'Seminar',
          date: '2025-06-05T10:00',
          location: 'Kenyatta University',
          price: 3000,
          status: 'Upcoming',
          ticketsSold: 95,
          capacity: 200,
          thumbnail: null
        },
        {
          id: 4,
          title: 'Jazz Night Live',
          category: 'Concert',
          date: '2025-05-20T19:00',
          location: 'Carnivore Grounds',
          price: 1500,
          status: 'Postponed',
          ticketsSold: 320,
          capacity: 800,
          thumbnail: null
        },
        {
          id: 5,
          title: 'Art Exhibition',
          category: 'Exhibition',
          date: '2025-05-12T10:00',
          location: 'National Museum',
          price: 500,
          status: 'Upcoming',
          ticketsSold: 125,
          capacity: 300,
          thumbnail: null
        }
      ];
    };

    const initializeCharts = () => {
      if (revenueChart.value) {
        revenueChartInstance = new Chart(revenueChart.value, {
          type: 'line',
          data: revenueData.value,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Revenue (KSH)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Month'
                }
              }
            }
          }
        });
      }

      if (ticketChart.value) {
        ticketChartInstance = new Chart(ticketChart.value, {
          type: 'doughnut',
          data: {
            labels: ticketCategories.map(item => item.label),
            datasets: [{
              data: ticketCategories.map(item => item.percentage),
              backgroundColor: ticketCategories.map(item => item.color),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right'
              }
            }
          }
        });
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const calculateSalesPercentage = (event) => {
      if (!event.capacity) return 0;
      return Math.min(Math.round((event.ticketsSold / event.capacity) * 100), 100);
    };

    const navigateTo = (route) => {
      router.push(route);
    };

    const editEvent = (id) => {
      router.push(`/admin/events/edit/${id}`);
    };

    const viewEvent = (id) => {
      router.push(`/admin/events/${id}`);
    };

    const confirmDelete = (id) => {
      eventToDelete.value = id;
      showDeleteModal.value = true;
    };

    const deleteEvent = () => {
      recentEvents.value = recentEvents.value.filter(event => event.id !== eventToDelete.value);
      showDeleteModal.value = false;
      eventToDelete.value = null;
    };

    const toggleNotifications = () => {
      unreadNotifications.value = 0;
      // Implement notification view logic here
    };

    const searchEvents = () => {
      // Triggered by search input
    };

    const toggleRevenuePeriod = () => {
      showRevenueDropdown.value = !showRevenueDropdown.value;
    };

    const toggleTicketPeriod = () => {
      showTicketDropdown.value = !showTicketDropdown.value;
    };

    const setRevenuePeriod = (period) => {
      revenuePeriod.value = period;
      showRevenueDropdown.value = false;
      updateRevenueData(period);
    };

    const setTicketPeriod = (period) => {
      ticketPeriod.value = period;
      showTicketDropdown.value = false;
      updateTicketData(period);
    };

    const updateRevenueData = (period) => {
      const dataMap = {
        'This Week': [10000, 15000, 12000, 18000, 20000, 17000, 22000],
        'This Month': [30000, 45000, 35000, 50000, 70000, 60000, 80000, 75000, 65000, 90000, 85000, 95000],
        'This Year': [250000, 300000, 280000, 320000, 350000, 330000, 400000, 380000, 360000, 420000, 400000, 450000]
      };
      revenueData.value.datasets[0].data = dataMap[period] || dataMap['This Month'];
      if (revenueChartInstance) {
        revenueChartInstance.update();
      }
    };

    const updateTicketData = (period) => {
      const dataMap = {
        'Last 7 Days': [45, 25, 20, 10],
        'Last 30 Days': [40, 30, 20, 10],
        'Last Year': [50, 20, 20, 10]
      };
      ticketChartInstance.data.datasets[0].data = dataMap[period] || dataMap['Last 7 Days'];
      ticketChartInstance.update();
    };

    return {
      searchQuery,
      unreadNotifications,
      statistics,
      revenueData,
      ticketCategories,
      recentEvents,
      filteredEvents,
      showDeleteModal,
      revenuePeriod,
      ticketPeriod,
      showRevenueDropdown,
      showTicketDropdown,
      revenueChart,
      ticketChart,
      navigateTo,
      formatDate,
      calculateSalesPercentage,
      editEvent,
      viewEvent,
      confirmDelete,
      deleteEvent,
      toggleNotifications,
      searchEvents,
      toggleRevenuePeriod,
      toggleTicketPeriod,
      setRevenuePeriod,
      setTicketPeriod
    };
  }
}
</script>

<style scoped>
/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-dashboard {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.dashboard-content{
  width: 100%;
}

/* Stats Cards */
.stats-cards {
  display: flex;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-auto-flow: row wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  width: 30%;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-right: 15px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #1a202c;
}


.stat-label {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
}

.stat-trend.up {
  color: #48bb78;
}

.stat-trend.down {
  color: #e53e3e;
}

/* Charts Section */
.charts-section {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  width: 100%;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 20px;
  color: #1a202c;
  font-weight: 600;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropdown-btn:hover {
  background-color: #e2e8f0;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  min-width: 150px;
  z-index: 1000;
}

.dropdown-item {
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f7fafc;
}

.chart-container {
  height: 300px;
}

/* Recent Events Table */
.recent-events {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #3498db;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.view-all-btn:hover {
  color: #2b6cb0;
}

.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.events-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.events-table th {
  text-align: left;
  padding: 15px;
  border-bottom: 2px solid #edf2f7;
  color: #718096;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}

.events-table td {
  padding: 15px;
  border-bottom: 1px solid #edf2f7;
  color: #2d3748;
  font-size: 14px;
  white-space: nowrap;
}

.event-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.event-thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}

.event-title {
  font-weight: 600;
  margin-bottom: 3px;
  color: #2d3748;
}

.event-category {
  font-size: 12px;
  color: #718096;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-badge.upcoming {
  background-color: #e3f2fd;
  color: #3182ce;
}

.status-badge.sold {
  background-color: #e8f5e9;
  color: #38a169;
}

.status-badge.postponed {
  background-color: #fff3e0;
  color: #dd6b20;
}

.sales-progress {
  position: relative;

  width: 120px;
  height: 4px;
  background-color: #edf2f7;
  border-radius: 4px;
  margin-bottom: 5px;
}

.progress-bar {
  position: absolute;
  height: 100%;
  background-color: #3498db;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  filter: brightness(90%);
}

.action-btn.edit {
  background-color: #3498db;
}

.action-btn.view {
  background-color: #48bb78;
}

.action-btn.delete {
  background-color: #e53e3e;
}

/* Quick Actions Section */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.action-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.15);
}

.action-card i {
  font-size: 24px;
  color: #3498db;
}

.action-card span {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #edf2f7;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #718096;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn, .delete-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background-color: #edf2f7;
  color: #4a5568;
  border: none;
}

.cancel-btn:hover {
  background-color: #e2e8f0;
}

.delete-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c53030;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .stats-cards {
    flex-direction: column;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 15px;
  }
  .stat-card{
    width: 55%;
  }

  .quick-actions {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }

  .chart-container {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 15px;
  }

  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
    gap: 12px;
  }

  .quick-actions {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
    gap: 12px;
  }

  .action-card {
    padding: 15px;
    min-height: 60px;
  }

  .action-card i {
    font-size: 20px;
  }

  .action-card span {
    font-size: 14px;
  }

  .recent-events {
    padding: 15px;
  }

  .card-header h3 {
    font-size: 18px;
  }

  .view-all-btn {
    font-size: 13px;
  }

  .events-table th,
  .events-table td {
    padding: 10px;
    font-size: 13px;
  }

  .event-thumb {
    width: 40px;
    height: 40px;
  }

  .event-title {
    font-size: 14px;
  }

  .event-category {
    font-size: 11px;
  }

  .sales-progress {
    width: 100px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  /* Hide less critical columns on small screens */
  .events-table th:nth-child(3), /* Location */
  .events-table td:nth-child(3),
  .events-table th:nth-child(4), /* Price */
  .events-table td:nth-child(4),
  .events-table th:nth-child(7), /* Actions */
  .events-table td:nth-child(7) {
    display: none;
  }

  .modal-content {
    width: 90%;
    max-width: 320px;
  }

  .modal-header {
    padding: 12px 15px;
  }

  .modal-header h3 {
    font-size: 16px;
  }

  .modal-body {
    padding: 15px;
  }

  .modal-body p {
    font-size: 13px;
  }

  .modal-footer {
    padding: 12px 15px;
  }

  .cancel-btn, .delete-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .dashboard-content {
    padding: 10px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
    margin-right: 10px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-label {
    font-size: 13px;
  }

  .stat-trend {
    font-size: 12px;
  }

  .charts-section {
    gap: 12px;
  }

  .chart-card {
    padding: 15px;
  }

  .card-header h3 {
    font-size: 16px;
  }

  .dropdown-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .dropdown-menu {
    min-width: 120px;
  }

  .dropdown-item {
    padding: 8px 12px;
    font-size: 13px;
  }

  .chart-container {
    height: 200px;
  }

  .recent-events {
    padding: 10px;
  }

  .events-table th,
  .events-table td {
    padding: 8px;
    font-size: 12px;
  }

  .event-info {
    gap: 8px;
  }

  .event-thumb {
    width: 36px;
    height: 36px;
  }

  .event-title {
    font-size: 13px;
  }

  .event-category {
    font-size: 10px;
  }

  .status-badge {
    padding: 4px 8px;
    font-size: 11px;
  }

  .sales-progress {
    width: 80px;
    height: 6px;
  }

  .quick-actions {
    gap: 10px;
  }

  .action-card {
    padding: 12px;
    min-height: 50px;
  }

  .action-card i {
    font-size: 18px;
  }

  .action-card span {
    font-size: 13px;
  }

  .modal-content {
    max-width: 280px;
  }

  .modal-header {
    padding: 10px 12px;
  }

  .modal-header h3 {
    font-size: 14px;
  }

  .modal-body {
    padding: 12px;
  }

  .modal-body p {
    font-size: 12px;
  }

  .modal-footer {
    padding: 10px 12px;
  }

  .cancel-btn, .delete-btn {
    padding: 5px 10px;
    font-size: 12px;
  }
}
</style>
