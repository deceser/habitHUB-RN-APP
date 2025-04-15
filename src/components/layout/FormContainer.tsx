import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BackgroundBlur } from '../ui/BackgroundBlur';
import { commonStyles, verticalGradientConfig } from '../../constants/styles';
import { useNavigation } from '@react-navigation/native';

interface FormContainerProps {
  children: ReactNode;
  showBackButton?: boolean;
  scrollViewRef?: React.RefObject<ScrollView>;
  scrollEnabled?: boolean;
  onScrollEndDrag?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onMomentumScrollEnd?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

/**
 * Container for forms with gradient background, blur effects, and scroll support
 */
export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  showBackButton = true,
  scrollViewRef,
  scrollEnabled = true,
  onScrollEndDrag,
  onMomentumScrollEnd,
}) => {
  const navigation = useNavigation();

  return (
    <View style={commonStyles.container}>
      {/* Gradient background */}
      <LinearGradient {...verticalGradientConfig} style={StyleSheet.absoluteFillObject} />

      {/* Blur elements in background */}
      <BackgroundBlur />

      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={commonStyles.container}>
        {showBackButton && (
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={true}
          scrollEnabled={scrollEnabled}
          keyboardShouldPersistTaps="handled"
          onScrollEndDrag={onScrollEndDrag}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardAvoidingView}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
              {children}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40, // Increased bottom padding to ensure scrolling
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
