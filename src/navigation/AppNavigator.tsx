import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { NewTaskScreen } from '../screens/NewTaskScreen';

import { RootStackParamList } from './types';

import { TabNavigator } from './TabNavigator';

import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    // Определяем начальный маршрут на основе статуса аутентификации
    if (!loading) {
      setInitialRoute(user ? 'MainTabs' : 'Login');
    }
  }, [user, loading]);

  // Отображаем экран загрузки пока проверяем статус аутентификации
  if (loading || initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialRoute}
      >
        {user ? (
          // Авторизованные маршруты
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
              name="NewTask"
              component={NewTaskScreen}
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom',
              }}
            />
          </>
        ) : (
          // Неавторизованные маршруты
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
