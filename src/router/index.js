import { createRouter, createWebHistory } from 'vue-router'
import { HomeView } from '@/views'

const routes = [{ path: '/', name: 'home', component: HomeView }]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard: if the route is not public and user is not logged in, redirect to login.

// If auth is required and no user is stored, set the return URL and redirect to login.

export default router
