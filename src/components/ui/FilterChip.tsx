import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress?: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={!onPress}
  >
    <Text
      style={[styles.filterText, isActive ? styles.activeFilterText : styles.inactiveFilterText]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  filterChip: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    lineHeight: 18,
  },
  activeFilterChip: {
    backgroundColor: 'rgba(186, 104, 200, 0.8)',
  },
  inactiveFilterChip: {
    backgroundColor: '#F5F5F5',
  },
  activeFilterText: {
    fontWeight: '700',
    color: 'rgba(30, 28, 28, 0.8)',
  },
  inactiveFilterText: {
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.3)',
  },
});
