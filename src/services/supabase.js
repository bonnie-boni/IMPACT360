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

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or Key is missing!');
      return null;
    }

    return createClient(
      supabaseUrl,
      supabaseKey
    );
  } catch (error) {
    console.error('Supabase client initialization failed:', error);
    return null;
  }
})();
