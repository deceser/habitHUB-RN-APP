import React, { useMemo, useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  RefreshControl,
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
import { homeContent } from '../constants/content';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = () => {
  // Get user data from AuthContext
  const { user } = useAuth();

  // Get days of the current week
  const weekDays = useMemo(() => getWeekDates(), []);

  // Set the active date (default - today)
  const [activeDate, setActiveDate] = useState<string>(() => {
    const today = weekDays.find(day => day.isToday);
    return today ? today.fullDate : weekDays[0].fullDate;
  });

  // Create state to store habits by dates
  const [habitsByDate, setHabitsByDate] = useState<HabitsByDate>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load habits for the current week from Supabase
  const loadHabits = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        // Get the first and last day of the week
        const firstDay = weekDays[0].fullDate;
        const lastDay = weekDays[6].fullDate;

        // Get tasks for the week from Supabase
        const habits = await getHabitsForWeek(firstDay, lastDay);

        // Set the received tasks in the state
        setHabitsByDate(habits);
      } catch (error) {
        console.error('Error loading habits:', error);
        setLoadError(homeContent.error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [weekDays],
  );

  // Update tasks when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  // Get tasks for the active date and filter by tag if necessary
  const activeHabits = useMemo(() => {
    const habits = habitsByDate[activeDate] || [];

    if (activeTag === homeContent.filters.all) {
      return habits;
    }

    // Filter tasks by tag
    return habits.filter((habit: Habit) => {
      if (activeTag === homeContent.filters.dailyRoutine) {
        return habit.emoji === '📝' || habit.emoji === '📖';
      } else if (activeTag === homeContent.filters.studyRoutine) {
        return habit.emoji === '📚';
      } else if (activeTag === homeContent.filters.fitness) {
        return habit.emoji === '🏃';
      } else if (activeTag === homeContent.filters.work) {
        return habit.emoji === '💻';
      }
      return false;
    });
  }, [habitsByDate, activeDate, activeTag]);

  // Format the date for display
  const formattedActiveDate = useMemo(() => formatDate(activeDate), [activeDate]);

  // Handler for clicking on a day
  const handleDayPress = useCallback((fullDate: string) => {
    setActiveDate(fullDate);
  }, []);

  // Handler for clicking on a habit - updates the status of the task
  const handleHabitPress = useCallback(
    async (id: string) => {
      // Find the habit in the current state
      const habitToUpdate = habitsByDate[activeDate]?.find((h: Habit) => h.id === id);

      if (!habitToUpdate) return;

      // Update the local state for immediate feedback
      setHabitsByDate(prev => {
        const updated = { ...prev };

        if (updated[activeDate]) {
          updated[activeDate] = updated[activeDate].map((habit: Habit) =>
            habit.id === id ? { ...habit, completed: !habit.completed } : habit,
          );
        }

        return updated;
      });

      // Send the update to Supabase
      try {
        await updateHabitStatus(id, !habitToUpdate.completed);
      } catch (error) {
        console.error('Error updating habit status:', error);
        // In case of an error, return the previous state
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

  // Handler for filtering by tag
  const handleTagPress = useCallback((tag: string) => {
    setActiveTag(tag);
  }, []);

  // Handler for refreshing when pull-to-refresh
  const handleRefresh = useCallback(() => {
    loadHabits(true);
  }, [loadHabits]);

  return (
    <GradientContainer vertical>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={commonStyles.container}>
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        >
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
                label={homeContent.filters.all}
                isActive={activeTag === homeContent.filters.all}
                onPress={() => handleTagPress(homeContent.filters.all)}
              />
              <FilterChip
                label={homeContent.filters.dailyRoutine}
                isActive={activeTag === homeContent.filters.dailyRoutine}
                onPress={() => handleTagPress(homeContent.filters.dailyRoutine)}
              />
              <FilterChip
                label={homeContent.filters.studyRoutine}
                isActive={activeTag === homeContent.filters.studyRoutine}
                onPress={() => handleTagPress(homeContent.filters.studyRoutine)}
              />
              <FilterChip
                label={homeContent.filters.fitness}
                isActive={activeTag === homeContent.filters.fitness}
                onPress={() => handleTagPress(homeContent.filters.fitness)}
              />
            </View>
          </View>

          {/* Display the list of habits or loading/empty list state */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="rgba(186, 104, 200, 0.8)" />
              <Text style={styles.loaderText}>{homeContent.loading}</Text>
            </View>
          ) : loadError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{loadError}</Text>
            </View>
          ) : activeHabits.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <EmptyStateIllustration useSvg={true} size={340} />
              <Text style={styles.emptyStateText}>
                {homeContent.emptyState} {formattedActiveDate}
              </Text>
            </View>
          ) : (
            <View style={styles.habitListContainer}>
              <HabitList habits={activeHabits} onHabitPress={handleHabitPress} />
            </View>
          )}
        </ScrollView>

        {/* Add button */}
        <FloatingActionButton />
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
    flexWrap: 'wrap',
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
    marginBottom: 80,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
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
    height: 300,
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255, 0, 0, 0.8)',
    textAlign: 'center',
    marginBottom: 16,
  },
});
