import React, { useState } from 'react';
import { Alert, ActivityIndicator, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SocialButton } from '../ui/SocialButton';
import { supabase } from '../../lib/supabase';

// Закрываем браузерную сессию после авторизации
WebBrowser.maybeCompleteAuthSession();

interface GoogleAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Запускаем процесс авторизации через Google в Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Настройки для запроса доступа к offline данным и принудительного показа диалога согласия
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Открываем URL в браузере
        const result = await WebBrowser.openAuthSessionAsync(data.url);

        if (result.type === 'success') {
          // Проверяем, что авторизация прошла успешно
          const { data: sessionData } = await supabase.auth.getSession();

          if (sessionData.session) {
            // Вызываем колбэк успешной авторизации
            onSuccess?.();
          } else {
            throw new Error('Не удалось получить сессию после авторизации');
          }
        } else if (result.type === 'cancel') {
          // Пользователь отменил процесс авторизации
          console.log('Авторизация была отменена пользователем');
        }
      }
    } catch (error) {
      console.error('Ошибка при авторизации через Google:', error);

      if (error instanceof Error) {
        Alert.alert('Ошибка авторизации', error.message);
        onError?.(error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#DB4437" />;
  }

  return <SocialButton iconName="google" color="#DB4437" onPress={handleGoogleSignIn} />;
};
