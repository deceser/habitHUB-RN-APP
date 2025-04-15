import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

type SignInScreenNavigationProp = RootStackScreenProps<'SignIn'>['navigation'];

export const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Use hooks for scroll control and form validation
  const { scrollViewRef, scrollEnabled, handleScrollEnd, scrollToTop } = useScrollControl();
  const { errors, validateForm, clearError } = useFormValidation();

  // Validation rules for fields
  const validationRules = {
    email: { required: true, email: true },
    password: { required: true, minLength: 6 },
  };

  const handleSignIn = () => {
    Keyboard.dismiss();

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
      // In the future, here will be login logic
      console.log('Sign in with', email, password);
    }
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

        <View style={formStyles.formContainer}>
          <InputField
            placeholder={signInContent.fields.email.placeholder}
            value={email}
            onChangeText={text => {
              setEmail(text);
              clearError('email');
            }}
            icon="email"
            error={errors.email}
          />

          <InputField
            placeholder={signInContent.fields.password.placeholder}
            value={password}
            onChangeText={text => {
              setPassword(text);
              clearError('password');
            }}
            secureTextEntry
            icon="lock"
            error={errors.password}
          />

          <TouchableOpacity style={formStyles.linkContainer}>
            <Text style={formStyles.subtitle}>{signInContent.buttons.forgotPassword}</Text>
          </TouchableOpacity>

          <Button
            title={signInContent.buttons.signIn}
            onPress={handleSignIn}
            style={formStyles.buttonMargin}
          />

          <SocialAuth />
        </View>
      </View>
    </FormContainer>
  );
};
