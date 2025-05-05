import { supabase, fetchWithRetry } from '../lib/supabase';

/**
 * Registration of a new user
 * @param email User email
 * @param password User password
 * @param name User name
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string,
): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error('Registration error:', error);
      return { data: null, error };
    }

    // Save additional user data
    if (data.user) {
      await saveUserData(data.user.id, { name });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unexpected error during registration';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * User login by email and password
 * @param email User email
 * @param password User password
 */
export const loginUser = async (
  email: string,
  password: string,
): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error during login:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error during login';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * Password recovery (sending a link to reset)
 * @param email User email
 */
export const resetPassword = async (email: string): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'habithubrn://reset-password',
    });

    if (error) {
      console.error('Password reset error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error during password reset:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unexpected error during password reset';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * User logout
 */
export const logoutUser = async (): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error during logout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error during logout';
    return { success: false, error: { message: errorMessage } };
  }
};

/**
 * Getting the current user session
 */
export const getCurrentSession = async (): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unexpected error getting session';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * Getting the current user data
 */
export const getCurrentUser = async (): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error getting user';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * Saving additional user data
 */
const saveUserData = async (userId: string, userData: { name: string }): Promise<void> => {
  try {
    const { error } = await supabase.from('users').upsert([{ id: userId, name: userData.name }]);

    if (error) {
      console.error('Error saving user data:', error);
    }
  } catch (error) {
    console.error('Unexpected error saving user data:', error);
  }
};
