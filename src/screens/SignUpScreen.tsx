import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../components/ui/Button';
import { SocialAuth } from '../components/auth/SocialAuth';
import { signUpContent } from '../constants/content';
import { InputField } from '../components/ui/InputField';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { FormContainer } from '../components/layout/FormContainer';
import { useScrollControl } from '../hooks/useScrollControl';
import { useFormValidation } from '../hooks/useFormValidation';
import { textStyles } from '../constants/styles';
import { formStyles } from '../styles/formStyles';
import { Keyboard } from 'react-native';
import { useAuth } from '../context/AuthContext';

type SignUpScreenNavigationProp = RootStackScreenProps<'SignUp'>['navigation'];

export const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Используем контекст авторизации
  const { signUp, error: authError } = useAuth();

  // Use hooks for scroll control and validation
  const { scrollViewRef, scrollEnabled, handleScrollEnd, scrollToTop } = useScrollControl();
  const { errors, validateForm, clearError } = useFormValidation();

  // Validation rules for fields
  const validationRules = {
    name: { required: true },
    email: { required: true, email: true },
    password: { required: true, minLength: 6 },
    confirmPassword: { required: true, match: 'password' },
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setLocalError(null);

    const isValid = validateForm(
      { name, email, password, confirmPassword },
      validationRules,
      {
        name: { required: signUpContent.fields.name.errors.required },
        email: {
          required: signUpContent.fields.email.errors.required,
          email: signUpContent.fields.email.errors.invalid,
        },
        password: {
          required: signUpContent.fields.password.errors.required,
          minLength: signUpContent.fields.password.errors.short,
        },
        confirmPassword: {
          required: signUpContent.fields.confirmPassword.errors.required,
          match: signUpContent.fields.confirmPassword.errors.match,
        },
      },
      { scrollToTop },
    );

    if (isValid) {
      setIsSubmitting(true);

      try {
        const { success, error } = await signUp(email, password, name);

        if (!success) {
          setLocalError(error || 'Ошибка при регистрации');
        } else {
          // Успешная регистрация, перенаправляем на MainTabs
          // В реальной жизни здесь может быть подтверждение email или другие шаги
          navigation.navigate('MainTabs');
        }
      } catch (error) {
        setLocalError('Произошла непредвиденная ошибка');
        console.error('Ошибка при регистрации:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleHaveAccount = () => {
    navigation.navigate('SignIn');
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
          <Text style={formStyles.title}>{signUpContent.title}</Text>
          <Text style={formStyles.subtitle}>{signUpContent.subtitle}</Text>
        </View>

        {(localError || authError) && (
          <View style={formStyles.errorContainer}>
            <Text style={formStyles.errorText}>{localError || authError}</Text>
          </View>
        )}

        <View style={formStyles.formContainer}>
          <InputField
            placeholder={signUpContent.fields.name.placeholder}
            value={name}
            onChangeText={text => {
              setName(text);
              clearError('name');
              setLocalError(null);
            }}
            icon="person"
            error={errors.name}
          />

          <InputField
            placeholder={signUpContent.fields.email.placeholder}
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
            placeholder={signUpContent.fields.password.placeholder}
            value={password}
            onChangeText={text => {
              setPassword(text);
              clearError('password');
              clearError('confirmPassword');
              setLocalError(null);
            }}
            secureTextEntry
            icon="lock"
            error={errors.password}
          />

          <InputField
            placeholder={signUpContent.fields.confirmPassword.placeholder}
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              clearError('confirmPassword');
              setLocalError(null);
            }}
            secureTextEntry
            icon="lock-outline"
            error={errors.confirmPassword}
          />

          <Button
            title={isSubmitting ? 'Регистрация...' : signUpContent.buttons.createAccount}
            onPress={handleSignUp}
            style={formStyles.buttonMargin}
            disabled={isSubmitting}
          />

          {isSubmitting && (
            <ActivityIndicator size="large" color="#9747FF" style={formStyles.loader} />
          )}

          <TouchableOpacity style={formStyles.linkContainer} onPress={handleHaveAccount}>
            <Text style={formStyles.linkText}>{signUpContent.buttons.haveAccount}</Text>
          </TouchableOpacity>

          <SocialAuth />
        </View>
      </View>
    </FormContainer>
  );
};
