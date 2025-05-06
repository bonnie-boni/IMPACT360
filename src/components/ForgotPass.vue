<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Logo and Header -->
      <div class="header">
        <div class="app-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </div>
        <div class="app-name">Impact360</div>
        <p class="header-subtitle">Reset your password</p>
      </div>

      <!-- Forgot Password Form -->
      <div class="form-container">
        <p class="form-description">Enter your email address and we'll send you a link to reset your password.</p>

        <div v-if="resetSuccess" class="success-message" role="alert">
          Check your email for a password reset link.
        </div>

        <div v-if="resetError" class="error-message" role="alert">
          {{ resetError }}
        </div>

        <form @submit.prevent="resetPassword">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="resetForm.email"
              :class="['form-input', {'input-error': emailError && resetForm.email}]"
              placeholder="your@email.com"
              required
              autocomplete="email"
            >
            <p v-if="emailError && resetForm.email" class="field-error">{{ emailError }}</p>
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
              Sending...
            </span>
            <span v-else class="button-content">Send reset link</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Remember your password?
            <router-link to="/login" class="auth-link">Sign in</router-link>
          </p>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { createClient } from '@supabase/supabase-js';

export default {
  name: 'ForgotPasswordPage',
  setup() {
    const router = useRouter();

    // Supabase client initialization
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Reactive state
    const isLoading = ref(false);
    const resetError = ref('');
    const resetSuccess = ref(false);
    const resetForm = ref({
      email: ''
    });

    // Computed properties for validation
    const emailError = computed(() => {
      if (resetForm.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetForm.value.email)) {
        return 'Please enter a valid email address';
      }
      return '';
    });

    // Methods
    const resetPassword = async () => {
      if (emailError.value) return;

      try {
        isLoading.value = true;
        resetError.value = '';
        resetSuccess.value = false;

        const { error } = await supabase.auth.resetPasswordForEmail(resetForm.value.email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });

        if (error) throw error;

        resetSuccess.value = true;
        resetForm.value.email = '';

        // Redirect to login after 3 seconds on success
        setTimeout(() => {
          router.push('/login');
        }, 3000);

      } catch (error) {
        resetError.value = error.message || 'Failed to send reset email. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      resetForm,
      isLoading,
      resetError,
      resetSuccess,
      emailError,
      resetPassword
    };
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

.form-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
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
  width: 93%;
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

.auth-footer p {
  margin: 0.5rem 0;
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

.success-message {
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
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
}
</style>
