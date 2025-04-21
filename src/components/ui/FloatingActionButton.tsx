import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface FloatingActionButtonProps {
  onPress?: () => void;
  label?: string;
}

export const FloatingActionButton = ({ onPress, label = '+' }: FloatingActionButtonProps) => (
  <TouchableOpacity style={styles.fab} onPress={onPress}>
    <Text style={styles.fabText}>{label}</Text>
  </TouchableOpacity>
);

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
