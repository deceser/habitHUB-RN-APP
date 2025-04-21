import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface DayItemProps {
  day: string;
  date: string;
  isActive: boolean;
}

export const DayItem = ({ day, date, isActive }: DayItemProps) => (
  <View style={[styles.dayItem, isActive ? styles.activeDayItem : styles.inactiveDayItem]}>
    <Text style={[styles.dayText, isActive && styles.activeDayText]}>{day}</Text>
    <View style={styles.dateCircle}>
      <Text style={[styles.dateText, isActive && styles.activeDayText]}>{date}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  dayItem: {
    width: 48,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  activeDayItem: {
    backgroundColor: 'rgba(186, 104, 200, 0.8)',
  },
  inactiveDayItem: {
    backgroundColor: 'rgba(222, 181, 228, 0.6)',
  },
  dayText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(30, 28, 28, 0.8)',
    marginBottom: 4,
    lineHeight: 18,
    textAlign: 'center',
  },
  activeDayText: {
    fontWeight: '700',
  },
  dateCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(30, 28, 28, 0.8)',
    lineHeight: 18,
    textAlign: 'center',
  },
});
