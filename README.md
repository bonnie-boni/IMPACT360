# IMPACT360

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```



### Supabase 

// vue-supabase-setup.js

/*
 * This file provides instructions to set up a Vue 3 project with Supabase integration.
 * Follow these steps to create a fully functional login/registration system.
 */

// Step 1: Create a new Vue 3 project using Vite
// Run the following commands in your terminal:
```bash
npm create vite@latest my-vue-auth-app -- --template vue
cd my-vue-auth-app
```

// Step 2: Install required dependencies
```bash
npm install @supabase/supabase-js
npm install vue-router@4
npm install vuelidate@next @vuelidate/core @vuelidate/validators
npm install tailwindcss postcss autoprefixer
```

// Step 3: Set up Tailwind CSS
```bash
npx tailwindcss init -p
```

// Step 4: Update tailwind.config.js
/*
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
*/

// Step 5: Create a CSS file (src/assets/main.css) and add Tailwind directives
/*
@tailwind base;
@tailwind components;
@tailwind utilities;
*/

// Step 6: Create a Supabase client file (src/supabase.js)
/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/

// Step 7: Create a .env file in the root directory with your Supabase credentials
/*
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
*/

// Step 8: Set up Vue Router (src/router/index.js)
/*
import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '../supabase';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('../views/AuthCallback.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  const isLoggedIn = !!data.session;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && isLoggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
*/

// Step 9: Update main.js
/*
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';

createApp(App).use(router).mount('#app');
*/

// Step 10: Create a views directory and add the Login.vue component
// Copy the HTML, CSS, and JavaScript from the login-page artifact into a new file: src/views/Login.vue
// Make the following modifications:
// - Remove the script tag importing Vue and Supabase
// - Update the export default to use Vue SFC format
// - Import the supabase client from your supabase.js file

// Step 11: Create a simple Dashboard.vue view
/*
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button 
          @click="logout" 
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      </div>
    </header>
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div class="text-center">
              <h2 class="text-2xl font-semibold text-gray-800">Welcome to your dashboard!</h2>
              <p class="mt-2 text-gray-600">User: {{ user?.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const user = ref(null);
    const router = useRouter();

    onMounted(async () => {
      const { data } = await supabase.auth.getUser();
      user.value = data.user;
    });

    const logout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
    };

    return {
      user,
      logout
    };
  }
};
</script>
*/

// Step 12: Create a AuthCallback.vue view to handle OAuth redirects
/*
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-600">Processing authentication...</p>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

export default {
  setup() {
    const router = useRouter();

    onMounted(async () => {
      // Handle the OAuth callback
      await supabase.auth.getSession();
      router.push('/dashboard');
    });

    return {};
  }
};
</script>
*/

// Step 13: Create a simple App.vue component
/*
<template>
  <router-view />
</template>
*/

// Step 14: Configure Supabase Authentication
/*
1. Go to your Supabase dashboard (https://app.supabase.com/)
2. Select your project
3. Go to Authentication > Settings
4. Add your site URL to the Site URL field (e.g., http://localhost:5173)
5. Add redirect URLs for OAuth providers (e.g., http://localhost:5173/auth/callback)
6. Enable the authentication methods you want to use (Email, Google, GitHub, etc.)
7. If using Email, configure your SMTP settings or use the built-in email service
*/

// Step 15: Run your project
/*
npm run dev
*/