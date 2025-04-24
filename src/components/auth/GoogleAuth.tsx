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

      // Starting the Google authorization process in Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Settings for requesting access to offline data and forcing the consent dialog to show
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Opening the URL in the browser
        const result = await WebBrowser.openAuthSessionAsync(data.url);

        if (result.type === 'success') {
          // Checking if the authorization was successful
          const { data: sessionData } = await supabase.auth.getSession();

          if (sessionData.session) {
            // Calling the success callback
            onSuccess?.();
          } else {
            throw new Error('Failed to get session after authorization');
          }
        } else if (result.type === 'cancel') {
          // The user canceled the authorization process
          console.log('Authorization was canceled by the user');
        }
      }
    } catch (error) {
      console.error('Error during Google authorization:', error);

      if (error instanceof Error) {
        Alert.alert('Authorization error', error.message);
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
