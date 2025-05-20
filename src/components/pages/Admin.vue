<template>
  <div class="admin-dashboard">
    <!-- Overlay for mobile sidebar -->
    <div class="sidebar-overlay" v-if="showMobileSidebar" @click="toggleSidebar"></div>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed, 'sidebar-mobile': showMobileSidebar }">
      <div class="sidebar-header">
        <div>
          <img src="../../assets/icon.png" alt="Company logo" class="logo" />
        </div>
        <div>
          <button class="toggle-btn" @click="toggleSidebar">
            <span v-if="sidebarCollapsed">›</span>
            <span v-else>‹</span>
          </button>
        </div>
      </div>

      <div class="sidebar-menu">
        <router-link to="/admin/dashboard" class="menu-item" :class="{ active: currentRoute === '/admin/dashboard' }">
          <i class="fas fa-chart-line"></i>
          <span v-if="!sidebarCollapsed">Dashboard</span>
        </router-link>

        <router-link to="/admin/events" class="menu-item" :class="{ active: currentRoute === '/admin/events' }">
          <i class="fas fa-calendar-alt"></i>
          <span v-if="!sidebarCollapsed">Events</span>
        </router-link>

        <router-link to="/admin/create-event" class="menu-item" :class="{ active: currentRoute === '/admin/create-event' }">
          <i class="fas fa-plus-circle"></i>
          <span v-if="!sidebarCollapsed">Create Event</span>
        </router-link>

        <router-link to="/admin/analytics" class="menu-item" :class="{ active: currentRoute === '/admin/analytics' }">
          <i class="fas fa-chart-pie"></i>
          <span v-if="!sidebarCollapsed">Analytics</span>
        </router-link>

        <router-link to="/admin/settings" class="menu-item" :class="{ active: currentRoute === '/admin/settings' }">
          <i class="fas fa-cog"></i>
          <span v-if="!sidebarCollapsed">Settings</span>
        </router-link>
      </div>

      <router-link to="/login" class="menu-item">
        <i class="fas fa-sign-in-alt"></i>
        <span v-if="!sidebarCollapsed">Login</span>
      </router-link>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="top-bar">
        <div class="hamburger" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </div>
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search..." v-model="searchQuery" @input="handleSearch" />
        </div>
        <div class="user-profile">
          <span class="user-name">Admin User</span>
          <div class="user-avatar">AU</div>
        </div>
      </div>

      <!-- Dynamic Content Area -->
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/services/supabase.js';

export default {
  name: 'AdminDashboard',
  setup() {
    const sidebarCollapsed = ref(false);
    const showMobileSidebar = ref(false);
    const searchQuery = ref('');
    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login');
      }
      const savedState = localStorage.getItem('sidebarState');
      if (savedState) {
        sidebarCollapsed.value = savedState === 'collapsed';
      }
      // Close mobile sidebar on route change
      router.afterEach(() => {
        showMobileSidebar.value = false;
      });
    });

    const currentRoute = computed(() => route.path);

    const toggleSidebar = () => {
      if (window.innerWidth <= 768) {
        showMobileSidebar.value = !showMobileSidebar.value;
      } else {
        sidebarCollapsed.value = !sidebarCollapsed.value;
        localStorage.setItem('sidebarState', sidebarCollapsed.value ? 'collapsed' : 'expanded');
      }
    };

    const handleSearch = () => {
      console.log('Searching for:', searchQuery.value);
    };

    const logout = () => {
      router.push('/login');
    };

    onMounted(() => {
      const savedState = localStorage.getItem('sidebarState');
      if (savedState) {
        sidebarCollapsed.value = savedState === 'collapsed';
      }
      // Close mobile sidebar on route change
      router.afterEach(() => {
        showMobileSidebar.value = false;
      });
    });

    return {
      sidebarCollapsed,
      showMobileSidebar,
      currentRoute,
      searchQuery,
      toggleSidebar,
      handleSearch,
      logout
    };
  }
};
</script>

<style scoped>
/* Admin Dashboard Styles */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

.logo{
  border-radius: 50%;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  transition: width 0.3s ease, transform 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #34495e;
}

.logo {
  height: 40px;
  transition: all 0.3s ease;
}

.toggle-btn {
  background: none;
  border: none;
  color: #ecf0f1;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}

.sidebar-menu {
  flex: 1;
  padding-top: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #34495e;
}

.menu-item.active {
  background-color: #3498db;
  border-left: 4px solid #2ecc71;
}

.menu-item i {
  font-size: 18px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid #34495e;
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background: #34495e;
  border: none;
  border-radius: 5px;
  color: #ecf0f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #e74c3c;
}

.logout-btn i {
  margin-right: 10px;
}

/* Sidebar Overlay for Mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  transition: margin-left 0.3s ease;
}

/* Top Bar Styles */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hamburger {
  display: none;
  font-size: 24px;
  cursor: pointer;
  color: #2c3e50;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 30px;
  padding: 8px 15px;
  width: 300px;
}

.search-bar i {
  color: #95a5a6;
  margin-right: 10px;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  flex: 1;
  font-size: 14px;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-name {
  margin-right: 15px;
  font-weight: 500;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.content-area {
  padding: 20px;
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 250px;
    transform: translateX(-100%);
  }

  .sidebar.sidebar-mobile {
    transform: translateX(0);
  }

  .sidebar-collapsed {
    width: 250px;
    transform: translateX(-100%);
  }

  .main-content {
    margin-left: 0;
  }

  .hamburger {
    display: block;
  }

  .toggle-btn {
    display: none;
  }

  .search-bar {
    width: 200px;
  }

  .content-area {
    padding: 15px;
  }
}

@media screen and (max-width: 480px) {
  .search-bar {
    width: 150px;
  }

  .user-name {
    display: none;
  }

  .top-bar {
    padding: 10px 15px;
  }
}
</style>
