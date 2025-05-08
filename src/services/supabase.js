// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const validateEnvVars = () => {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
  };

  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      console.warn(`Missing environment variable: ${key}`);
      alert(`Missing required environment variable: ${key}. Please check your .env file.`);
    }
  });
};

// Create and configure Supabase client
export const supabase = (() => {
  try {
    validateEnvVars();

    return createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  } catch (error) {
    console.error('Supabase client initialization failed:', error);
    return null;
  }
})();
