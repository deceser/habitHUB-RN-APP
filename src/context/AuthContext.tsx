import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { registerUser, loginUser, logoutUser, resetPassword } from '../services/authService';

// Types for the authentication context
interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; error: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: any }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error: any }>;
  error: string | null;
}

// Creating the context with initial values
const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  loading: true,
  signUp: async () => ({ success: false, error: null }),
  signIn: async () => ({ success: false, error: null }),
  signOut: async () => {},
  forgotPassword: async () => ({ success: false, error: null }),
  error: null,
});

// Props for the authentication provider
interface AuthProviderProps {
  children: ReactNode;
}

// Authentication provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect for initializing and tracking the authentication state
  useEffect(() => {
    // Getting the current session when the app loads
    const getInitialSession = async () => {
      try {
        setLoading(true);

        // Getting the session from Supabase
        const { data } = await supabase.auth.getSession();

        // Setting the session and user
        setSession(data.session);
        setUser(data.session?.user ?? null);

        // If there is a user, check and update the data in the database
        if (data.session?.user) {
          await saveUserToDatabase(data.session.user);
        }
      } catch (error) {
        console.error('Error fetching initial session:', error);
        setError('Failed to load authorization data');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Subscribing to authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Authentication event:', event);

      // Updating the session and user state
      setSession(newSession);
      setUser(newSession?.user ?? null);

      // Saving/updating user data when signing in
      if (newSession?.user && event === 'SIGNED_IN') {
        await saveUserToDatabase(newSession.user);
      }
    });

    // Unsubscribing from the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to save/check user in the database
  const saveUserToDatabase = async (user: User) => {
    try {
      // Checking if the user exists in the database
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If the user doesn't exist, create a record
      if (!data) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || 'User',
          },
        ]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error saving user to database:', error);
    }
  };

  // Function to register a new user
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await registerUser(email, password, name);

      if (error) {
        let errorMessage = error.message;
        // Handling known errors
        if (error.message.includes('already')) {
          errorMessage = 'User with this email already exists';
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Error registering';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Function to sign in a user
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await loginUser(email, password);

      if (error) {
        let errorMessage = error.message;
        // Handling known errors
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Error logging in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Function to sign out the user
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { success, error } = await logoutUser();

      if (error) {
        setError('Error logging out');
        console.error('Error logging out:', error);
      }
    } catch (err: any) {
      setError('Unexpected error logging out');
      console.error('Unexpected error logging out:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the password
  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await resetPassword(email);

      if (error) {
        let errorMessage = error.message;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, error: null };
    } catch (err: any) {
      const errorMessage = err.message || 'Error resetting password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Provide the state and functions through the context
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signOut,
        signUp,
        signIn,
        forgotPassword,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
