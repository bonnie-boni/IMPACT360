import { createRouter, createWebHistory } from 'vue-router'
import { HomeView, AboutView, ContactView } from '@/views'
import Admin from '@/components/pages/Admin.vue'
import CreateEditEvent from '@/components/CreateEditEvent.vue'
import Events from '@/components/Events.vue'
import Dashboard from '@/components/Dashboard.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'
import ForgotPass from '@/components/ForgotPass.vue'
import ongoingEvents from '@/components/ongoingEvents.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPass },
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/contact', name: 'contact', component: ContactView },
  { path: '/ongoingEvents', name: 'ongoingEvents', component: ongoingEvents },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    redirect: '/admin/dashboard',
    children: [
      { path: 'create-event', name: 'create-event', component: CreateEditEvent },
      { path: 'events', name: 'events', component: Events },
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'analytics', name: 'analytics', component: () => import('../components/Analytics.vue') },
    ],
  },
  // { path: '/event-tickets', name: 'event-ticket', component: EventTicket }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard: if the route is not public and user is not logged in, redirect to login.

// If auth is required and no user is stored, set the return URL and redirect to login.

export default router
