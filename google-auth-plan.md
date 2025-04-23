# План авторизации через Google в Supabase для React Native

## 1. Настройка провайдера Google в Supabase

- Войти в Supabase Dashboard: `https://supabase.com/dashboard/project/<project-id>/auth/providers`
- В разделе "Authentication" → "Providers" найти Google
- Нажать "Enable" и ввести Client ID и Client Secret от Google OAuth
- В настройках включить автоматическое создание пользователей

## 2. Настройка Google OAuth в Google Cloud Console

- Перейти в [Google Cloud Console](https://console.cloud.google.com/)
- Создать новый проект или выбрать существующий
- В разделе "APIs & Services" → "Credentials" создать OAuth client ID
- Тип приложения: Web application
- Добавить authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
- Скопировать полученные Client ID и Client Secret в настройки Supabase

## 3. Настройка React Native проекта

- Установить необходимые зависимости:

  ```bash
  npm install @supabase/supabase-js expo-secure-store react-native-url-polyfill expo-web-browser
  ```

- Создать файл для инициализации Supabase:

```typescript
// utils/supabase.ts
import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Адаптер для безопасного хранения
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

// Получение конфигурации из переменных окружения
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## 4. Компонент авторизации Google с использованием встроенной авторизации Supabase

```typescript
// components/GoogleAuth.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../utils/supabase';

// Закрываем сессию браузера после авторизации
WebBrowser.maybeCompleteAuthSession();

const GoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      // Используем встроенный метод Supabase для авторизации через Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;

      // Открываем URL для авторизации в браузере
      if (data?.url) {
        const authResult = await WebBrowser.openAuthSessionAsync(data.url);

        if (authResult.type === 'success') {
          // Supabase автоматически обрабатывает успешную авторизацию
          // Нам не нужно вручную обрабатывать токены, Supabase сделает это за нас
          const { data } = await supabase.auth.getSession();
          console.log("Авторизация успешна:", !!data.session);
        }
      }
    } catch (error) {
      console.error('Ошибка авторизации через Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={signInWithGoogle}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>Войти через Google</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GoogleAuth;
```

## 5. Создание AuthProvider с использованием Supabase Auth

```typescript
// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

// Типы для контекста
interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Создание контекста
const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

// Провайдер авторизации
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Выход из системы
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  useEffect(() => {
    // Проверяем существующую сессию при запуске
    const getInitialSession = async () => {
      try {
        setLoading(true);
        // Получаем текущую сессию
        const { data } = await supabase.auth.getSession();

        // Устанавливаем сессию если она существует
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('Ошибка при получении начальной сессии:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Подписываемся на изменения сессии
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Событие авторизации:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Если произошла авторизация, проверяем наличие пользователя в базе данных
        if (newSession?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          await checkAndSaveUser(newSession.user);
        }
      }
    );

    // Отписываемся при размонтировании
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Проверка и сохранение пользователя в базе данных
  const checkAndSaveUser = async (user: User) => {
    if (!user?.email) return;

    try {
      // Проверяем наличие пользователя в таблице users
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Если пользователя нет в базе, создаем запись
      if (!data) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email
          }]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Ошибка при проверке/сохранении пользователя:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);
```

## 6. Настройка схемы глубоких ссылок для возврата из браузера

В `app.json` добавить:

```json
{
  "expo": {
    "scheme": "habithubrn",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

## 7. Экран входа с компонентом GoogleAuth

```typescript
// screens/LoginScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import GoogleAuth from '../components/GoogleAuth';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HabitHUB</Text>
      <Text style={styles.subtitle}>Войдите в аккаунт</Text>

      <View style={styles.authContainer}>
        <GoogleAuth />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  authContainer: {
    width: '100%',
    maxWidth: 300,
  },
});

export default LoginScreen;
```

## 8. Настройка таблицы пользователей в Supabase

SQL для создания таблицы пользователей с настройками безопасности:

```sql
-- Создание таблицы пользователей, если её ещё нет
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Включение Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Разрешение на чтение только своих данных
CREATE POLICY "Пользователи могут видеть только свои данные"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Разрешение на вставку только аутентифицированным пользователям и только своих данных
CREATE POLICY "Пользователи могут создавать только свои записи"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## 9. Основной компонент приложения

```typescript
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

// Компонент навигации, зависящий от состояния авторизации
const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Показать экран загрузки
    return null; // или компонент загрузки
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
```

## 10. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Обновите babel.config.js для поддержки переменных окружения:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: true,
          allowUndefined: false,
        },
      ],
    ],
  };
};
```

## 11. Дополнительные соображения

1. **Обработка ошибок**: Добавьте полноценную обработку ошибок и информативные сообщения.

2. **Логаут**: Используйте `supabase.auth.signOut()` для выхода из системы.

3. **Получение профиля**: После авторизации данные пользователя доступны в `user.user_metadata`.

4. **Хуки Supabase**: Используйте встроенные хуки для реактивного доступа к данным.

5. **Защищенные маршруты**: Используйте контекст авторизации для ограничения доступа.

6. **Автоматизация таблицы**: Можно настроить триггеры в SQL для автоматического создания записей в `users` при регистрации пользователя.
