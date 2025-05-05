import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../components/ui/Button';
import { InputField } from '../components/ui/InputField';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { FormContainer } from '../components/layout/FormContainer';
import { useScrollControl } from '../hooks/useScrollControl';
import { useFormValidation } from '../hooks/useFormValidation';
import { formStyles } from '../styles/formStyles';
import { Keyboard } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { forgotPasswordContent } from '../constants/content';

type ForgotPasswordScreenNavigationProp = RootStackScreenProps<'ForgotPassword'>['navigation'];

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Используем контекст авторизации
  const { forgotPassword, error: authError } = useAuth();

  // Use hooks for scroll control and form validation
  const { scrollViewRef, scrollEnabled, handleScrollEnd, scrollToTop } = useScrollControl();
  const { errors, validateForm, clearError } = useFormValidation();

  // Validation rules for fields
  const validationRules = {
    email: { required: true, email: true },
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    setLocalError(null);
    setIsSuccess(false);

    const isValid = validateForm(
      { email },
      validationRules,
      {
        email: {
          required: forgotPasswordContent.fields.email.errors.required,
          email: forgotPasswordContent.fields.email.errors.invalid,
        },
      },
      { scrollToTop },
    );

    if (isValid) {
      setIsSubmitting(true);

      try {
        const { success, error } = await forgotPassword(email);

        if (!success) {
          setLocalError(error || forgotPasswordContent.errors.serverError);
        } else {
          setIsSuccess(true);
          // Очищаем поле email после успешной отправки
          setEmail('');
        }
      } catch (error) {
        setLocalError(forgotPasswordContent.errors.serverError);
        console.error('Ошибка при сбросе пароля:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <FormContainer
      scrollViewRef={scrollViewRef}
      scrollEnabled={scrollEnabled}
      onScrollEndDrag={handleScrollEnd}
      onMomentumScrollEnd={handleScrollEnd}
    >
      <View style={formStyles.contentContainer}>
        <TouchableOpacity onPress={goBack} style={{ position: 'absolute', top: 50, left: 20 }}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={formStyles.titleContainer}>
          <Text style={formStyles.title}>{forgotPasswordContent.title}</Text>
          <Text style={formStyles.subtitle}>{forgotPasswordContent.subtitle}</Text>
        </View>

        {isSuccess && (
          <View style={[formStyles.errorContainer, { backgroundColor: 'rgba(0, 255, 0, 0.1)' }]}>
            <Text style={[formStyles.errorText, { color: 'green' }]}>
              {forgotPasswordContent.success}
            </Text>
          </View>
        )}

        {(localError || authError) && (
          <View style={formStyles.errorContainer}>
            <Text style={formStyles.errorText}>{localError || authError}</Text>
          </View>
        )}

        <View style={formStyles.formContainer}>
          <InputField
            placeholder={forgotPasswordContent.fields.email.placeholder}
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

          <Button
            title={isSubmitting ? 'Отправка...' : forgotPasswordContent.buttons.resetPassword}
            onPress={handleResetPassword}
            style={formStyles.buttonMargin}
            disabled={isSubmitting}
          />

          {isSubmitting && (
            <ActivityIndicator size="large" color="#9747FF" style={formStyles.loader} />
          )}

          <TouchableOpacity style={formStyles.linkContainer} onPress={goBack}>
            <Text style={formStyles.linkText}>{forgotPasswordContent.buttons.backToLogin}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FormContainer>
  );
};
