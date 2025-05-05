import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '../../navigation/types';

interface FloatingActionButtonProps {
  onPress?: () => void;
  label?: string;
}

export const FloatingActionButton = ({ onPress, label = '+' }: FloatingActionButtonProps) => {
  const navigation = useNavigation<RootStackScreenProps<'MainTabs'>['navigation']>();
  const route = useRoute();

  // Hide the FAB on the Profile screen
  if (route.name === 'Profile') {
    return null;
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('NewTask');
    }
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Text style={styles.fabText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 50,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    zIndex: 10,
  },
  fabText: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 36,
  },
});
