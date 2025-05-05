import { supabase, fetchWithRetry } from '../lib/supabase';

/**
 * Регистрация нового пользователя
 * @param email Email пользователя
 * @param password Пароль пользователя
 * @param name Имя пользователя
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
      console.error('Ошибка при регистрации:', error);
      return { data: null, error };
    }

    // Сохраняем дополнительные данные пользователя
    if (data.user) {
      await saveUserData(data.user.id, { name });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Непредвиденная ошибка при регистрации:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка при регистрации';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * Вход пользователя по email и паролю
 * @param email Email пользователя
 * @param password Пароль пользователя
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
      console.error('Ошибка при входе:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Непредвиденная ошибка при входе:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка при входе';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * Восстановление пароля (отправка ссылки для сброса)
 * @param email Email пользователя
 */
export const resetPassword = async (email: string): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'habithubrn://reset-password',
    });

    if (error) {
      console.error('Ошибка при сбросе пароля:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Непредвиденная ошибка при сбросе пароля:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка при сбросе пароля';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * Выход пользователя
 */
export const logoutUser = async (): Promise<{ success: boolean; error: any }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Ошибка при выходе:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Непредвиденная ошибка при выходе:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка при выходе';
    return { success: false, error: { message: errorMessage } };
  }
};

/**
 * Получение текущей сессии пользователя
 */
export const getCurrentSession = async (): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Ошибка при получении сессии:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Непредвиденная ошибка при получении сессии:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка при получении сессии';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * Получение данных текущего пользователя
 */
export const getCurrentUser = async (): Promise<{ data: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Ошибка при получении пользователя:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Непредвиденная ошибка при получении пользователя:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка при получении пользователя';
    return { data: null, error: { message: errorMessage } };
  }
};

/**
 * Сохранение дополнительных данных пользователя
 */
const saveUserData = async (userId: string, userData: { name: string }): Promise<void> => {
  try {
    const { error } = await supabase.from('users').upsert([{ id: userId, name: userData.name }]);

    if (error) {
      console.error('Ошибка при сохранении данных пользователя:', error);
    }
  } catch (error) {
    console.error('Непредвиденная ошибка при сохранении данных пользователя:', error);
  }
};
