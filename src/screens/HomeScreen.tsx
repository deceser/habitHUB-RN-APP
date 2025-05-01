import React, { useMemo, useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';

import { GradientContainer } from '../components/ui/GradientContainer';
import { commonStyles } from '../constants/styles';
import { EmptyStateIllustration } from '../assets/images/EmptyStateIllustration';
import { DayItem } from '../components/ui/DayItem';
import { FilterChip } from '../components/ui/FilterChip';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { getWeekDates, formatDate, HabitsByDate, Habit } from '../utils/dateUtils';
import { HabitList } from '../components/habit/HabitList';
import { getHabitsForWeek, updateHabitStatus } from '../services/habitService';
import { useFocusEffect } from '@react-navigation/native';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load habits for the current week from Supabase
  const loadHabits = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const firstDay = weekDays[0].fullDate;
      const lastDay = weekDays[6].fullDate;

      const habits = await getHabitsForWeek(firstDay, lastDay);

      setHabitsByDate(habits);
    } catch (error) {
      console.error('Error loading habits:', error);
      setLoadError('Не удалось загрузить задачи. Проверьте соединение.');
    } finally {
      setIsLoading(false);
    }
  }, [weekDays]);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  const activeHabits = useMemo(() => {
    const habits = habitsByDate[activeDate] || [];

    if (activeTag === 'All') {
      return habits;
    }

    return habits.filter(
      (habit: Habit) =>
        (activeTag === 'Daily Routine' && (habit.emoji === '📝' || habit.emoji === '📖')) ||
        (activeTag === 'Study Routine' && habit.emoji === '📚'),
    );
  }, [habitsByDate, activeDate, activeTag]);

  const formattedActiveDate = useMemo(() => formatDate(activeDate), [activeDate]);

  const handleDayPress = useCallback((fullDate: string) => {
    setActiveDate(fullDate);
  }, []);

  const handleHabitPress = useCallback(
    async (id: string) => {
      const habitToUpdate = habitsByDate[activeDate]?.find((h: Habit) => h.id === id);

      if (!habitToUpdate) return;

      setHabitsByDate(prev => {
        const updated = { ...prev };

        if (updated[activeDate]) {
          updated[activeDate] = updated[activeDate].map((habit: Habit) =>
            habit.id === id ? { ...habit, completed: !habit.completed } : habit,
          );
        }

        return updated;
      });

      try {
        await updateHabitStatus(id, !habitToUpdate.completed);
      } catch (error) {
        console.error('Error updating habit status:', error);
        setHabitsByDate(prev => {
          const updated = { ...prev };

          if (updated[activeDate]) {
            updated[activeDate] = updated[activeDate].map((habit: Habit) =>
              habit.id === id ? { ...habit, completed: habitToUpdate.completed } : habit,
            );
          }

          return updated;
        });
      }
    },
    [habitsByDate, activeDate],
  );

  // Handler for tag filter
  const handleTagPress = useCallback((tag: string) => {
    setActiveTag(tag);
  }, []);

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
              <FilterChip
                label="All"
                isActive={activeTag === 'All'}
                onPress={() => handleTagPress('All')}
              />
              <FilterChip
                label="Daily Routine"
                isActive={activeTag === 'Daily Routine'}
                onPress={() => handleTagPress('Daily Routine')}
              />
              <FilterChip
                label="Study Routine"
                isActive={activeTag === 'Study Routine'}
                onPress={() => handleTagPress('Study Routine')}
              />
            </View>
          </View>

          {/* Display list of habits or loading/empty state */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="rgba(186, 104, 200, 0.8)" />
            </View>
          ) : loadError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{loadError}</Text>
            </View>
          ) : activeHabits.length === 0 ? (
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
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56,
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255, 0, 0, 0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
});
