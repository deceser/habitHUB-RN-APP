import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Types for the authentication context
interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Creating the context with initial values
const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
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
        console.error('Ошибка при получении начальной сессии:', error);
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
          },
        ]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error saving user to database:', error);
    }
  };

  // Function to sign out the user
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Предоставляем состояние и функции через контекст
  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста авторизации
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
