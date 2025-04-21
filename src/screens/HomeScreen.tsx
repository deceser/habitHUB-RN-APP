import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { GradientContainer } from '../components/ui/GradientContainer';
import { commonStyles } from '../constants/styles';
import { EmptyStateIllustration } from '../assets/images/EmptyStateIllustration';

const DayItem = ({ day, date, isActive }: { day: string; date: string; isActive: boolean }) => (
  <View style={[styles.dayItem, isActive ? styles.activeDayItem : styles.inactiveDayItem]}>
    <Text style={[styles.dayText, isActive && styles.activeDayText]}>{day}</Text>
    <View style={styles.dateCircle}>
      <Text style={[styles.dateText, isActive && styles.activeDayText]}>{date}</Text>
    </View>
  </View>
);

const FilterChip = ({ label, isActive }: { label: string; isActive: boolean }) => (
  <View style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}>
    <Text
      style={[styles.filterText, isActive ? styles.activeFilterText : styles.inactiveFilterText]}
    >
      {label}
    </Text>
  </View>
);

export const HomeScreen = () => {
  return (
    <GradientContainer vertical>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {/* Days */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysContainer}
            >
              <DayItem day="Sun" date="10" isActive={false} />
              <DayItem day="Mon" date="11" isActive={true} />
              <DayItem day="Tue" date="12" isActive={false} />
              <DayItem day="Wed" date="13" isActive={false} />
              <DayItem day="Thu" date="14" isActive={false} />
              <DayItem day="Fri" date="15" isActive={false} />
              <DayItem day="Sat" date="16" isActive={false} />
            </ScrollView>

            {/* Filter Chips */}
            <View style={styles.filtersContainer}>
              <FilterChip label="All" isActive={true} />
              <FilterChip label="Daily Routine" isActive={false} />
              <FilterChip label="Study Routine" isActive={false} />
            </View>
          </View>

          {/* Empty State */}
          <View style={styles.emptyStateContainer}>
            <EmptyStateIllustration useSvg={true} size={340} />
          </View>

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
    paddingBottom: 80,
  },

  headerContainer: {
    flexDirection: 'column',
  },

  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: 8,
    marginTop: 0,
  },
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
  daysContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 36,
  },
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
  emptyStateContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 56,
  },

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
