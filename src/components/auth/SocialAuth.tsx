import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SocialButton } from '../ui/SocialButton';
import { commonStyles, textStyles } from '../../constants/styles';
import { theme } from '../../constants/theme';
import { loginContent } from '../../constants/content';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../../navigation/types';

// Closing the browser session after authorization
WebBrowser.maybeCompleteAuthSession();

type LoginScreenNavigationProp = RootStackScreenProps<'Login'>['navigation'];

export const SocialAuth: React.FC = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Handler for clicking the Google button
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      // Starting the Google authorization process in Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
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
            // Переходим на главный экран
            navigation.navigate('MainTabs');
          } else {
            throw new Error('Не удалось получить сессию после авторизации');
          }
        } else if (result.type === 'cancel') {
          console.log('Авторизация была отменена пользователем');
        }
      }
    } catch (error) {
      console.error('Ошибка при авторизации через Google:', error);

      if (error instanceof Error) {
        Alert.alert('Ошибка авторизации', error.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.dividerContainer}>
        <View style={commonStyles.divider} />
        <Text style={[textStyles.emphasis, styles.orText]}>{loginContent.dividers.or}</Text>
        <View style={commonStyles.divider} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <SocialButton iconName="facebook" color={theme.colors.facebook} />

        {googleLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={theme.colors.google} />
          </View>
        ) : (
          <SocialButton
            iconName="google"
            color={theme.colors.google}
            onPress={handleGoogleSignIn}
          />
        )}

        <SocialButton iconName="apple" color={theme.colors.apple} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  orText: {
    paddingHorizontal: 12,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  loaderContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.19)',
    ...commonStyles.centerContent,
    marginHorizontal: 12,
  },
});
