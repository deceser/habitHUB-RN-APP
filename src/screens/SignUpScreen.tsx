import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

type SignUpScreenNavigationProp = RootStackScreenProps<'SignUp'>['navigation'];

export const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleSignUp = () => {
    Keyboard.dismiss();

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
      // In the future, here will be registration logic
      console.log('Sign up with', name, email, password);
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

        <View style={formStyles.formContainer}>
          <InputField
            placeholder={signUpContent.fields.name.placeholder}
            value={name}
            onChangeText={text => {
              setName(text);
              clearError('name');
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
            }}
            icon="email"
            error={errors.email}
          />

          <InputField
            placeholder={signUpContent.fields.password.placeholder}
            value={password}
            onChangeText={text => {
              setPassword(text);
              clearError('password');
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
            }}
            secureTextEntry
            icon="lock-outline"
            error={errors.confirmPassword}
          />

          <Button
            title={signUpContent.buttons.createAccount}
            onPress={handleSignUp}
            style={formStyles.buttonMargin}
          />

          <TouchableOpacity style={formStyles.linkContainer} onPress={handleHaveAccount}>
            <Text style={textStyles.link}>{signUpContent.buttons.haveAccount}</Text>
          </TouchableOpacity>

          <SocialAuth />
        </View>
      </View>
    </FormContainer>
  );
};
