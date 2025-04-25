import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, ScrollView, Text } from 'react-native';

import { GradientContainer } from '../components/ui/GradientContainer';
import { commonStyles } from '../constants/styles';
import { EmptyStateIllustration } from '../assets/images/EmptyStateIllustration';
import { DayItem } from '../components/ui/DayItem';
import { FilterChip } from '../components/ui/FilterChip';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { getWeekDates, generateDemoHabits, formatDate, HabitsByDate } from '../utils/dateUtils';
import { HabitList } from '../components/habit/HabitList';

export const HomeScreen = () => {
  // Get days of the current week
  const weekDays = useMemo(() => getWeekDates(), []);

  // Set active date (default - today)
  const [activeDate, setActiveDate] = useState<string>(() => {
    const today = weekDays.find(day => day.isToday);
    return today ? today.fullDate : weekDays[0].fullDate;
  });

  // Create state for storing habits by dates
  const [habitsByDate, setHabitsByDate] = useState<HabitsByDate>({});

  // Load demo data on first render
  useEffect(() => {
    setHabitsByDate(generateDemoHabits());
  }, []);

  // Get habits for active date
  const activeHabits = useMemo(() => habitsByDate[activeDate] || [], [habitsByDate, activeDate]);

  // Format date for display
  const formattedActiveDate = useMemo(() => formatDate(activeDate), [activeDate]);

  // Handler for day press
  const handleDayPress = useCallback(
    (fullDate: string) => {
      setActiveDate(fullDate);
      const selectedDay = weekDays.find(day => day.fullDate === fullDate);
      console.log(`Selected day: ${selectedDay?.dayName}, date: ${fullDate}`);
    },
    [weekDays],
  );

  // Handler for habit press
  const handleHabitPress = useCallback(
    (id: string) => {
      setHabitsByDate(prev => {
        // Copy current state
        const updated = { ...prev };

        // Update only habits for selected date
        if (updated[activeDate]) {
          updated[activeDate] = updated[activeDate].map(habit =>
            habit.id === id ? { ...habit, completed: !habit.completed } : habit,
          );
        }

        return updated;
      });
      console.log(`Habit pressed: ${id}`);
    },
    [activeDate],
  );

  return (
    <GradientContainer vertical>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {/* Days of the week */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysContainer}
            >
              {weekDays.map(day => (
                <DayItem
                  key={day.fullDate}
                  day={day.dayName}
                  date={day.dayNumber}
                  isActive={day.fullDate === activeDate}
                  fullDate={day.fullDate}
                  onPress={handleDayPress}
                />
              ))}
            </ScrollView>

            {/* Filters */}
            <View style={styles.filtersContainer}>
              <FilterChip label="All" isActive={true} />
              <FilterChip label="Daily Routine" isActive={false} />
              <FilterChip label="Study Routine" isActive={false} />
            </View>
          </View>

          {/* Display list of habits or empty state */}
          {activeHabits.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <EmptyStateIllustration useSvg={true} size={340} />
            </View>
          ) : (
            <View style={styles.habitListContainer}>
              <HabitList habits={activeHabits} onHabitPress={handleHabitPress} />
            </View>
          )}

          {/* Add button */}
          <FloatingActionButton />
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
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 36,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#444',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  habitListContainer: {
    flex: 1,
  },
});
