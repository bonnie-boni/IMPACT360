<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Logo and Header -->
      <div class="header">
        <div class="app-logo">
          <!-- You can replace this with your logo -->
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </div>
        <div class="app-name"> Welcome To Impact360 </div>
        <p class="header-subtitle">Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <div class="form-container">
        <div v-if="authError" class="error-message" role="alert">
          {{ authError }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="loginForm.email"
              :class="['form-input', {'input-error': emailError && loginForm.email}]"
              placeholder="your@email.com"
              required
              autocomplete="email"
            >
            <p v-if="emailError && loginForm.email" class="field-error">{{ emailError }}</p>
          </div>

          <div class="form-group">
            <div class="password-header">
              <label for="password">Password</label>
              <router-link to="/forgot-password" class="forgot-link">Forgot password?</router-link>
            </div>
            <div class="password-input-container">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="loginForm.password"
                class="form-input"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              >
              <button
                type="button"
                class="password-toggle-btn"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                  <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"></path>
                  <path d="M1 1l22 22"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="loginForm.remember">
            <label for="remember">Remember me</label>
          </div>

          <button
            type="submit"
            class="submit-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="button-content">
              <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else class="button-content">Sign in</span>
          </button>
        </form>

        <div class="social-divider" role="separator">
          <div class="divider-line"></div>
          <div class="divider-text">Or continue with</div>
          <div class="divider-line"></div>
        </div>

        <div class="social-buttons">
          <button
            type="button"
            @click="socialLogin('google')"
            class="social-button"
            aria-label="Sign in with Google"
          >
            <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12.545,12.151L12.545,12.151c0,1.054,0.787,1.908,1.757,1.908h0.039c0.972,0,1.758-0.854,1.758-1.908v-0.039c0-1.053-0.786-1.907-1.757-1.907 h-0.039c-0.971,0-1.757,0.854-1.757,1.907V12.151z M12.924,7.549c0.616-0.673,1.496-1.096,2.473-1.096c1.016,0,1.903,0.421,2.513,1.096c0.351-0.34,0.987-0.907,1.437-1.336c-0.846-0.792-2.156-1.293-3.95-1.293c-1.8,0-3.111,0.501-3.95,1.292 c0.449,0.424,1.087,0.999,1.438,1.338C12.924,7.55,12.924,7.55,12.924,7.549z" fill="#4285F4"/>
              <path d="M19.719,10.919c-0.234-1.055-0.954-1.617-1.754-1.617c-1.171,0-2.233,1.055-2.233,2.528c0,1.493,0.995,2.527,2.169,2.527 c0.995,0,1.672-0.545,1.852-1.432l-0.802-0.528c-0.137,0.468-0.508,0.775-1.084,0.775c-0.664,0-1.094-0.431-1.094-1.342h3.064" fill="#4285F4"/>
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            @click="socialLogin('github')"
            class="social-button"
            aria-label="Sign in with GitHub"
          >
            <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/>
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <router-link to="/register" class="auth-link">Create one</router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Version tag -->
    <div class="version-tag">v1.0.0</div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createClient } from '@supabase/supabase-js';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();

    // Supabase client initialization
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Reactive state
    const isLoading = ref(false);
    const authError = ref('');
    const showPassword = ref(false);

    const loginForm = ref({
      email: '',
      password: '',
      remember: false
    });

    // Computed properties for validation
    const emailError = computed(() => {
      if (loginForm.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email)) {
        return 'Please enter a valid email address';
      }
      return '';
    });

    // Methods
    const handleLogin = async () => {
      if (emailError.value) return;

      try {
        isLoading.value = true;
        authError.value = '';

        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginForm.value.email,
          password: loginForm.value.password
        });

        if (error) throw error;

        localStorage.setItem('isLoggedIn', 'true');
        router.push('/admin/dashboard');

      } catch (error) {
        authError.value = error.message || 'Failed to sign in. Please check your credentials.';
      } finally {
        isLoading.value = false;
      }
    };

    const socialLogin = async (provider) => {
      try {
        isLoading.value = true;
        authError.value = '';

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) throw error;

      } catch (error) {
        authError.value = error.message || `Failed to sign in with ${provider}.`;
        isLoading.value = false;
      }
    };

    // Check for existing session on mount
    onMounted(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to dashboard
        router.push('/admin/dashboard');
      }
    });

    return {
      loginForm,
      isLoading,
      authError,
      emailError,
      showPassword,
      handleLogin,
      socialLogin
    };

    onUnmounted(() => {
      localStorage.removeItem('isLoggedIn');
    });
  }
}
</script>

<style scoped>
.auth-container {
  background-color: #f3f4f6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
}

.auth-card {
  background-color: white;
  width: 100%;
  max-width: 28rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.header {
  background-color: #4f46e5;
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.app-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.header-subtitle {
  color: #c7d2fe;
  margin: 0;
}

.form-container {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 90%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

.input-error {
  border-color: #ef4444;
}

.field-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.password-input-container {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.forgot-link {
  font-size: 0.875rem;
  color: #4f46e5;
  text-decoration: none;
}

.forgot-link:hover {
  color: #4338ca;
  text-decoration: underline;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me input {
  height: 1rem;
  width: 1rem;
  color: #4f46e5;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
}

.remember-me label {
  font-size: 0.875rem;
  color: #374151;
}

.social-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
}

.divider-text {
  margin: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-button:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.social-icon {
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.5rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  background-color: #4f46e5;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button:hover {
  background-color: #4338ca;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.auth-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.auth-link {
  color: #4f46e5;
  font-weight: 500;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}

.version-tag {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

/* Responsive styles */
@media (max-width: 640px) {
  .auth-card {
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
  }

  .social-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
