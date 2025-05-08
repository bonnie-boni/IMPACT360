<template>
  <div class="analytics-dashboard">
    <div class="page-header">
      <h1>Analytics Dashboard</h1>
      <div class="date-filter">
        <label for="dateRange">Time Period:</label>
        <select id="dateRange" v-model="selectedDateRange" @change="updateCharts">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="180">Last 6 months</option>
          <option value="365">Last year</option>
          <option value="all">All time</option>
        </select>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="metrics-cards">
      <div class="metric-card">
        <div class="metric-icon tickets-icon">
          <i class="fas fa-ticket-alt"></i>
        </div>
        <div class="metric-details">
          <h3>Total Tickets Sold</h3>
          <p class="metric-value">{{ metrics.totalTickets }}</p>
          <p class="metric-change" :class="metrics.ticketsChange >= 0 ? 'positive' : 'negative'">
            <i :class="metrics.ticketsChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ Math.abs(metrics.ticketsChange) }}% from previous period
          </p>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon revenue-icon">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="metric-details">
          <h3>Total Revenue</h3>
          <p class="metric-value">KSH {{ formatNumber(metrics.totalRevenue) }}</p>
          <p class="metric-change" :class="metrics.revenueChange >= 0 ? 'positive' : 'negative'">
            <i :class="metrics.revenueChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ Math.abs(metrics.revenueChange) }}% from previous period
          </p>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon events-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="metric-details">
          <h3>Active Events</h3>
          <p class="metric-value">{{ metrics.activeEvents }}</p>
          <p class="metric-secondary">{{ metrics.totalEvents }} total events</p>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon avg-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="metric-details">
          <h3>Avg. Tickets per Event</h3>
          <p class="metric-value">{{ metrics.avgTicketsPerEvent }}</p>
          <p class="metric-change" :class="metrics.avgTicketsChange >= 0 ? 'positive' : 'negative'">
            <i :class="metrics.avgTicketsChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ Math.abs(metrics.avgTicketsChange) }}% from previous period
          </p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <div class="chart-header">
          <h2>Revenue Over Time</h2>
          <div class="chart-actions">
            <button @click="exportChartData('revenue')" class="export-btn">
              <i class="fas fa-download"></i> Export
            </button>
          </div>
        </div>
        <div class="chart revenue-chart">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <h2>Tickets Sold by Event</h2>
          <div class="chart-actions">
            <button @click="exportChartData('tickets')" class="export-btn">
              <i class="fas fa-download"></i> Export
            </button>
          </div>
        </div>
        <div class="chart tickets-chart">
          <canvas ref="ticketsChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Events Performance Table -->
    <div class="performance-section">
      <div class="section-header">
        <h2>Event Performance</h2>
        <div class="section-actions">
          <button class="export-table-btn" @click="exportTableData">
            <i class="fas fa-file-export"></i> Export to CSV
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="performance-table">
          <thead>
            <tr>
              <th @click="sortTable('title')">
                Event Name
                <i :class="getSortIcon('title')"></i>
              </th>
              <th @click="sortTable('date')">
                Date
                <i :class="getSortIcon('date')"></i>
              </th>
              <th @click="sortTable('ticketsSold')">
                Tickets Sold
                <i :class="getSortIcon('ticketsSold')"></i>
              </th>
              <th @click="sortTable('capacity')">
                Capacity
                <i :class="getSortIcon('capacity')"></i>
              </th>
              <th @click="sortTable('fillRate')">
                Fill Rate
                <i :class="getSortIcon('fillRate')"></i>
              </th>
              <th @click="sortTable('revenue')">
                Revenue
                <i :class="getSortIcon('revenue')"></i>
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in sortedEvents" :key="event.id">
              <td>{{ event.title }}</td>
              <td>{{ formatDate(event.date) }}</td>
              <td>{{ event.ticketsSold }}</td>
              <td>{{ event.capacity }}</td>
              <td>
                <div class="fill-rate-container">
                  <div class="fill-rate-bar">
                    <div class="fill-rate-progress" :style="{ width: `${event.fillRate}%` }"></div>
                  </div>
                  <span>{{ event.fillRate }}%</span>
                </div>
              </td>
              <td>KSH {{ formatNumber(event.revenue) }}</td>
              <td>
                <span :class="getStatusClass(event)">{{ getStatusText(event) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'AnalyticsDashboard',
  setup() {
    // Chart references
    const revenueChart = ref(null);
    const ticketsChart = ref(null);
    let revenueChartInstance = null;
    let ticketsChartInstance = null;

    // Data
    const selectedDateRange = ref('30');
    const sortKey = ref('revenue');
    const sortDirection = ref('desc');

    // Sample metrics data (would come from API)
    const metrics = ref({
      totalTickets: 1235,
      ticketsChange: 12.5,
      totalRevenue: 4875000,
      revenueChange: 8.2,
      activeEvents: 5,
      totalEvents: 12,
      avgTicketsPerEvent: 98,
      avgTicketsChange: -2.3
    });

    // Sample events data (would come from API)
    const events = ref([
      {
        id: 1,
        title: 'Tech Conference 2025',
        date: '2025-07-15T09:00:00',
        ticketsSold: 420,
        capacity: 500,
        fillRate: 84,
        price: 5000,
        revenue: 2100000,
        isPostponed: false,
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Music Festival',
        date: '2025-06-20T18:00:00',
        ticketsSold: 350,
        capacity: 1000,
        fillRate: 35,
        price: 2500,
        revenue: 875000,
        isPostponed: true,
        status: 'postponed'
      },
      {
        id: 3,
        title: 'Entrepreneurship Workshop',
        date: '2025-05-10T10:00:00',
        ticketsSold: 75,
        capacity: 100,
        fillRate: 75,
        price: 1000,
        revenue: 75000,
        isPostponed: false,
        status: 'upcoming'
      },
      {
        id: 4,
        title: 'Charity Gala',
        date: '2024-11-10T19:00:00',
        ticketsSold: 200,
        capacity: 250,
        fillRate: 80,
        price: 10000,
        revenue: 2000000,
        isPostponed: false,
        status: 'past'
      },
      {
        id: 5,
        title: 'Art Exhibition',
        date: '2024-12-05T11:00:00',
        ticketsSold: 190,
        capacity: 200,
        fillRate: 95,
        price: 500,
        revenue: 95000,
        isPostponed: false,
        status: 'past'
      }
    ]);

    // Sort events based on sortKey and sortDirection
    const sortedEvents = computed(() => {
      return [...events.value].sort((a, b) => {
        let valA, valB;

        if (sortKey.value === 'date') {
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
        } else {
          valA = a[sortKey.value];
          valB = b[sortKey.value];
        }

        if (sortDirection.value === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
    });

    // Sort table
    const sortTable = (key) => {
      if (sortKey.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortDirection.value = 'desc';
      }
    };

    // Get sort icon based on current sort key and direction
    const getSortIcon = (key) => {
      if (sortKey.value !== key) return 'fas fa-sort';
      return sortDirection.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    };

    // Format large numbers with commas
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    // Get status class for styling
    const getStatusClass = (event) => {
      if (event.isPostponed) return 'status-postponed';
      return event.status === 'past' ? 'status-past' : 'status-upcoming';
    };

    // Get status text
    const getStatusText = (event) => {
      if (event.isPostponed) return 'Postponed';
      return event.status === 'past' ? 'Past' : 'Upcoming';
    };

    // Initialize charts
    const initCharts = () => {
      // Revenue chart data
      const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue (KSH)',
          data: [750000, 1200000, 800000, 1400000, 1900000, 1600000],
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderColor: 'rgba(46, 204, 113, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      };

      // Tickets chart data
      const ticketsData = {
        labels: events.value.map(event => event.title),
        datasets: [{
          label: 'Tickets Sold',
          data: events.value.map(event => event.ticketsSold),
          backgroundColor: events.value.map(event =>
            event.status === 'past' ? 'rgba(52, 152, 219, 0.7)' :
            event.isPostponed ? 'rgba(231, 76, 60, 0.7)' : 'rgba(241, 196, 15, 0.7)'
          ),
          borderColor: events.value.map(event =>
            event.status === 'past' ? 'rgba(52, 152, 219, 1)' :
            event.isPostponed ? 'rgba(231, 76, 60, 1)' : 'rgba(241, 196, 15, 1)'
          ),
          borderWidth: 1
        }]
      };

      // Chart options
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false
      };

      // Create revenue chart
      if (revenueChartInstance) {
        revenueChartInstance.destroy();
      }

      revenueChartInstance = new Chart(revenueChart.value, {
        type: 'line',
        data: revenueData,
        options: {
          ...chartOptions,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => 'KSH ' + formatNumber(value)
              }
            }
          }
        }
      });

      // Create tickets chart
      if (ticketsChartInstance) {
        ticketsChartInstance.destroy();
      }

      ticketsChartInstance = new Chart(ticketsChart.value, {
        type: 'bar',
        data: ticketsData,
        options: {
          ...chartOptions,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };

    // Update charts when date range changes
    const updateCharts = () => {
      // In a real app, this would fetch new data based on the selected date range
      // For demo purposes, we'll just randomize the data
      const range = parseInt(selectedDateRange.value);

      // Create new revenue data based on range
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let labels;

      if (range <= 30) {
        // For shorter periods, show days
        labels = Array.from({ length: range }, (_, i) => `Day ${i+1}`);
      } else if (range <= 90) {
        // For medium periods, show weeks
        labels = Array.from({ length: Math.ceil(range/7) }, (_, i) => `Week ${i+1}`);
      } else {
        // For longer periods, show months
        const currentMonth = new Date().getMonth();
        labels = Array.from({ length: range > 365 ? 12 : Math.ceil(range/30) }, (_, i) => {
          const monthIndex = (currentMonth - i + 12) % 12;
          return months[monthIndex];
        }).reverse();
      }

      // Generate new revenue data
      const revenueData = {
        labels,
        datasets: [{
          label: 'Revenue (KSH)',
          data: labels.map(() => Math.floor(Math.random() * 2000000) + 500000),
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderColor: 'rgba(46, 204, 113, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      };

      // Update revenue chart
      revenueChartInstance.data = revenueData;
      revenueChartInstance.update();

      // For the tickets chart, we'll just shuffle the existing data
      const shuffledEvents = [...events.value].sort(() => 0.5 - Math.random());

      // Update tickets chart
      ticketsChartInstance.data.labels = shuffledEvents.map(event => event.title);
      ticketsChartInstance.data.datasets[0].data = shuffledEvents.map(event => event.ticketsSold);
      ticketsChartInstance.data.datasets[0].backgroundColor = shuffledEvents.map(event =>
        event.status === 'past' ? 'rgba(52, 152, 219, 0.7)' :
        event.isPostponed ? 'rgba(231, 76, 60, 0.7)' : 'rgba(241, 196, 15, 0.7)'
      );
      ticketsChartInstance.data.datasets[0].borderColor = shuffledEvents.map(event =>
        event.status === 'past' ? 'rgba(52, 152, 219, 1)' :
        event.isPostponed ? 'rgba(231, 76, 60, 1)' : 'rgba(241, 196, 15, 1)'
      );

      ticketsChartInstance.update();

      // Also update metrics to simulate data changes
      metrics.value = {
        totalTickets: Math.floor(Math.random() * 2000) + 1000,
        ticketsChange: (Math.random() * 30) - 15,
        totalRevenue: Math.floor(Math.random() * 6000000) + 3000000,
        revenueChange: (Math.random() * 20) - 10,
        activeEvents: Math.floor(Math.random() * 8) + 3,
        totalEvents: Math.floor(Math.random() * 15) + 10,
        avgTicketsPerEvent: Math.floor(Math.random() * 50) + 70,
        avgTicketsChange: (Math.random() * 15) - 7.5
      };
    };

    // Export chart data
    const exportChartData = (chartType) => {
      let data;
      let filename;

      if (chartType === 'revenue') {
        data = revenueChartInstance.data;
        filename = 'revenue-data.csv';
      } else {
        data = ticketsChartInstance.data;
        filename = 'tickets-data.csv';
      }

      // Create CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';

      // Add header row
      csvContent += data.labels.join(',') + '\n';

      // Add data rows
      data.datasets.forEach(dataset => {
        csvContent += dataset.data.join(',') + '\n';
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', filename);
      document.body.appendChild(link);

      // Trigger download
      link.click();
      document.body.removeChild(link);
    };

    // Export table data
    const exportTableData = () => {
      // Create CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';

      // Add header row
      csvContent += 'Event Name,Date,Tickets Sold,Capacity,Fill Rate,Revenue,Status\n';

      // Add data rows
      events.value.forEach(event => {
        const row = [
          event.title,
          formatDate(event.date),
          event.ticketsSold,
          event.capacity,
          event.fillRate + '%',
          'KSH ' + formatNumber(event.revenue),
          getStatusText(event)
        ];
        csvContent += row.join(',') + '\n';
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'event-performance.csv');
      document.body.appendChild(link);

      // Trigger download
      link.click();
      document.body.removeChild(link);
    };

    // Initialize on mount
    onMounted(() => {
      initCharts();
    });

    return {
      selectedDateRange,
      metrics,
      events,
      sortedEvents,
      revenueChart,
      ticketsChart,
      formatNumber,
      formatDate,
      sortTable,
      getSortIcon,
      getStatusClass,
      getStatusText,
      updateCharts,
      exportChartData,
      exportTableData
    };
  }
};
</script>

<style scoped>
.analytics-dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.date-filter {
  display: flex;
  align-items: center;
}

.date-filter label {
  margin-right: 10px;
  font-weight: 500;
}

.date-filter select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 14px;
  cursor: pointer;
}

/* Metrics Cards */
.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 20px;
}

.tickets-icon {
  background-color: #3498db;
}

.revenue-icon {
  background-color: #2ecc71;
}

.events-icon {
  background-color: #9b59b6;
}

.avg-icon {
  background-color: #f1c40f;
}

.metric-details {
  flex: 1;
}

.metric-details h3 {
  font-size: 14px;
  font-weight: 600;
  color: #7f8c8d;
  margin: 0 0 8px 0;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.metric-change {
  font-size: 13px;
  display: flex;
  align-items: center;
  margin: 0;
}

.metric-change i {
  margin-right: 5px;
}

.positive {
  color: #2ecc71;
}

.negative {
  color: #e74c3c;
}

.metric-secondary {
  font-size: 13px;
  color: #95a5a6;
  margin: 5px 0 0 0;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.chart-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.export-btn {
  background-color: #ecf0f1;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #dde4e6;
}

.export-btn i {
  margin-right: 5px;
}

.chart {
  height: 300px;
  position: relative;
}

/* Performance Table Section */
.performance-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.export-table-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.export-table-btn:hover {
  background-color: #2980b9;
}

.export-table-btn i {
  margin-right: 8px;
}

.table-container {
  overflow-x: auto;
}

.performance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.performance-table th {
  background-color: #f9f9f9;
  color: #7f8c8d;
  font-weight: 600;
  text-align: left;
  padding: 12px 15px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  border-bottom: 1px solid #e0e0e0;
}

.performance-table th i {
  margin-left: 5px;
}

.performance-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
}

.performance-table tbody tr:hover {
  background-color: #f5f7fa;
}

/* Fill Rate Bar */
.fill-rate-container {
  display: flex;
  align-items: center;
}

.fill-rate-bar {
  flex: 1;
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  margin-right: 10px;
  overflow: hidden;
}

.fill-rate-progress {
  height: 100%;
  background-color: #3498db;
  border-radius: 4px;
}

/* Status Styles */
.status-upcoming {
  background-color: #f1c40f;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-past {
  background-color: #95a5a6;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-postponed {
  background-color: #e74c3c;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .date-filter {
    margin-top: 15px;
  }

  .metrics-cards {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }
}

/* Add Font Awesome CDN link in your HTML head */
</style>
