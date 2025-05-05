import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button } from '../components/ui/Button';
import { SocialAuth } from '../components/auth/SocialAuth';
import { signInContent } from '../constants/content';
import { InputField } from '../components/ui/InputField';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { FormContainer } from '../components/layout/FormContainer';
import { useScrollControl } from '../hooks/useScrollControl';
import { useFormValidation } from '../hooks/useFormValidation';
import { formStyles } from '../styles/formStyles';
import { Keyboard } from 'react-native';
import { useAuth } from '../context/AuthContext';

type SignInScreenNavigationProp = RootStackScreenProps<'SignIn'>['navigation'];

export const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Используем контекст авторизации
  const { signIn, error: authError } = useAuth();

  // Use hooks for scroll control and form validation
  const { scrollViewRef, scrollEnabled, handleScrollEnd, scrollToTop } = useScrollControl();
  const { errors, validateForm, clearError } = useFormValidation();

  // Validation rules for fields
  const validationRules = {
    email: { required: true, email: true },
    password: { required: true, minLength: 6 },
  };

  const handleSignIn = async () => {
    Keyboard.dismiss();
    setLocalError(null);

    const isValid = validateForm(
      { email, password },
      validationRules,
      {
        email: {
          required: signInContent.fields.email.errors.required,
          email: signInContent.fields.email.errors.invalid,
        },
        password: {
          required: signInContent.fields.password.errors.required,
          minLength: signInContent.fields.password.errors.short,
        },
      },
      { scrollToTop },
    );

    if (isValid) {
      setIsSubmitting(true);

      try {
        const { success, error } = await signIn(email, password);

        if (!success) {
          setLocalError(error || 'Login error');
        } else {
          // Successful login, will be automatically redirected through AuthProvider
          navigation.navigate('MainTabs');
        }
      } catch (error) {
        setLocalError('An unexpected error occurred');
        console.error('Login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleCreateAccount = () => {
    navigation.navigate('SignUp');
  };

  return (
    <FormContainer
      scrollViewRef={scrollViewRef}
      scrollEnabled={scrollEnabled}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollEnd={handleScrollEnd}
    >
      <View style={formStyles.contentContainer}>
        <View style={formStyles.titleContainer}>
          <Text style={formStyles.title}>{signInContent.title}</Text>
          <Text style={formStyles.subtitle}>{signInContent.subtitle}</Text>
        </View>

        {(localError || authError) && (
          <View style={formStyles.errorContainer}>
            <Text style={formStyles.errorText}>{localError || authError}</Text>
          </View>
        )}

        <View style={formStyles.formContainer}>
          <InputField
            placeholder={signInContent.fields.email.placeholder}
            value={email}
            onChangeText={text => {
              setEmail(text);
              clearError('email');
              setLocalError(null);
            }}
            icon="email"
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <InputField
            placeholder={signInContent.fields.password.placeholder}
            value={password}
            onChangeText={text => {
              setPassword(text);
              clearError('password');
              setLocalError(null);
            }}
            secureTextEntry
            icon="lock"
            error={errors.password}
          />

          <TouchableOpacity style={formStyles.linkContainer} onPress={handleForgotPassword}>
            <Text style={formStyles.linkText}>{signInContent.buttons.forgotPassword}</Text>
          </TouchableOpacity>

          <Button
            title={isSubmitting ? 'Login...' : signInContent.buttons.signIn}
            onPress={handleSignIn}
            style={formStyles.buttonMargin}
            disabled={isSubmitting}
          />

          {isSubmitting && (
            <ActivityIndicator size="large" color="#9747FF" style={formStyles.loader} />
          )}

          <TouchableOpacity style={formStyles.secondaryLinkContainer} onPress={handleCreateAccount}>
            <Text style={formStyles.secondaryLinkText}>{signInContent.buttons.createAccount}</Text>
          </TouchableOpacity>

          <SocialAuth />
        </View>
      </View>
    </FormContainer>
  );
};
