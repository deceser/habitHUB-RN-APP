import React, { useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, ScrollView } from 'react-native';

import { GradientContainer } from '../components/ui/GradientContainer';
import { commonStyles } from '../constants/styles';
import { EmptyStateIllustration } from '../assets/images/EmptyStateIllustration';
import { DayItem } from '../components/ui/DayItem';
import { FilterChip } from '../components/ui/FilterChip';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { getWeekDates } from '../utils/dateUtils';

export const HomeScreen = () => {
  const weekDays = useMemo(() => getWeekDates(), []);
  const [activeDate, setActiveDate] = useState<string>(() => {
    const today = weekDays.find(day => day.isToday);
    return today ? today.fullDate : weekDays[0].fullDate;
  });

  const handleDayPress = useCallback(
    (fullDate: string) => {
      setActiveDate(fullDate);
      const selectedDay = weekDays.find(day => day.fullDate === fullDate);

      console.log(`Selected day: ${selectedDay?.dayName}, date: ${fullDate}`);
    },
    [weekDays],
  );

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
          <FloatingActionButton onPress={() => console.log('FAB pressed')} />
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
  },

  daysContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 36,
  },

  emptyStateContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 56,
  },
});
