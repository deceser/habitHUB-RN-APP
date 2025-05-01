import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Adapter for secure token storage
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Getting the Supabase configuration from environment variables
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase Anon Key available:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or key is not configured. Please ensure you have added them to environment variables or app.config.js',
  );
}

// Creating the Supabase client with improved configuration
export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // Add increased timeouts and reliability settings
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
    // Increase timeout to 30 seconds
    fetch: (url, options) => {
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), 30000); // 30 seconds timeout

      // Add timeout signal to the request
      const fetchOptions = {
        ...options,
        signal: timeoutController.signal,
      };

      return fetch(url, fetchOptions)
        .then(response => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          console.error('Fetch error:', error);
          // Convert error to a clear format
          if (error.name === 'AbortError') {
            throw new Error('Timeout exceeded');
          }
          throw error;
        });
    },
  },
  // Add retry logic
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Function with retries for requests to Supabase
export const fetchWithRetry = async (
  operation: () => Promise<any>,
  maxRetries = 3,
): Promise<any> => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} of ${maxRetries} failed:`, error);
      lastError = error;

      // Exponential delay between attempts (0.5s, 1s, 2s)
      const delay = 500 * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// Check connection to Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('user_tasks')
      .select('count', { count: 'exact', head: true });
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
};

// Checking user authentication
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Getting the current user
export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
