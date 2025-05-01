import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GradientContainer } from '../components/ui/GradientContainer';
import { HabitItem } from '../components/habit/HabitItem';
import { commonStyles } from '../constants/styles';
import {
  CalendarDay,
  getMonthData,
  getMonthDays,
  formatDateWithDay,
  generateHabitId,
} from '../utils/dateUtils';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';

interface DayProps {
  day: CalendarDay;
  isSelected: boolean;
  onPress: (day: CalendarDay) => void;
}

const Day: React.FC<DayProps> = ({ day, isSelected, onPress }) => (
  <TouchableOpacity style={styles.dayCell} onPress={() => onPress(day)} activeOpacity={0.7}>
    <View
      style={[
        styles.dayCircle,
        isSelected && styles.selectedDayCircle,
        day.isToday && styles.todayCircle,
      ]}
    >
      <Text
        style={[
          styles.dayNumber,
          !day.currentMonth && styles.inactiveDay,
          isSelected && styles.selectedDayText,
          day.isToday && styles.todayText,
        ]}
      >
        {day.date}
      </Text>
    </View>
  </TouchableOpacity>
);

const DatePanel: React.FC<{ date: string }> = ({ date }) => (
  <View style={styles.datePanel}>
    <Text style={styles.datePanelText}>{date}</Text>
    <View style={styles.datePanelLine} />
  </View>
);

export const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  const weekDays = useMemo(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], []);

  const { month, year } = useMemo(() => getMonthData(selectedDate), [selectedDate]);

  const calendarDays = useMemo(() => getMonthDays(selectedDate), [selectedDate]);

  // Chunk calendar days into weeks
  const calendarWeeks = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    return weeks;
  }, [calendarDays]);

  const handleDayPress = useCallback((day: CalendarDay) => {
    setSelectedDate(day.fullDate);
  }, []);

  // Demo habits for the selected date
  const habits = useMemo(
    () => [
      {
        id: generateHabitId(),
        title: 'Read',
        emoji: '📖',
        completed: true,
        date: selectedDate,
      },
      {
        id: generateHabitId(),
        title: 'Exercise',
        emoji: '🏃',
        completed: false,
        date: selectedDate,
      },
    ],
    [selectedDate],
  );

  // Format the selected date for display
  const formattedSelectedDate = useMemo(() => formatDateWithDay(selectedDate), [selectedDate]);

  return (
    <GradientContainer vertical>
      <StatusBar style="dark" />
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Calendar</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Calendar Widget */}
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <View style={styles.monthDisplay}>
                  <Text style={styles.monthText}>{month}</Text>
                  <Text style={styles.yearText}>{year}</Text>
                </View>
              </View>

              {/* Weekday Headers */}
              <View style={styles.weekdayHeader}>
                {weekDays.map(day => (
                  <Text key={day} style={styles.weekdayText}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {calendarWeeks.map((week, weekIndex) => (
                  <View key={`week-${weekIndex}`} style={styles.weekRow}>
                    {week.map(day => (
                      <Day
                        key={`${day.day}-${day.date}-${day.fullDate}`}
                        day={day}
                        isSelected={day.fullDate === selectedDate}
                        onPress={handleDayPress}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>

            {/* Habit Lists by Date */}
            <View style={styles.habitsContainer}>
              <DatePanel date={formattedSelectedDate} />
              {habits.map(habit => (
                <HabitItem
                  key={habit.id}
                  id={habit.id}
                  title={habit.title}
                  emoji={habit.emoji}
                  completed={habit.completed}
                  date={habit.date}
                />
              ))}
            </View>
          </ScrollView>

          {/* Floating Action Button */}
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
  title: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '500',
    marginVertical: 24,
  },
  calendarContainer: {
    backgroundColor: '#FDFDFD',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  monthDisplay: {
    alignItems: 'flex-end',
  },
  monthText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '400',
  },
  yearText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#000',
    opacity: 0.7,
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '300',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    marginTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayCell: {
    width: 40,
    alignItems: 'center',
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedDayCircle: {
    backgroundColor: '#ADF7B6',
  },
  todayCircle: {
    borderWidth: 1,
    borderColor: 'rgba(186, 104, 200, 0.8)',
  },
  dayNumber: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(30, 28, 28, 0.8)',
  },
  inactiveDay: {
    color: 'rgba(30, 28, 28, 0.5)',
  },
  selectedDayText: {
    fontWeight: '600',
  },
  todayText: {
    color: 'rgba(186, 104, 200, 0.8)',
  },
  habitsContainer: {
    marginTop: 8,
    paddingBottom: 40,
  },
  datePanel: {
    marginBottom: 12,
  },
  datePanelText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(30, 28, 28, 0.8)',
    marginBottom: 4,
  },
  datePanelLine: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginBottom: 12,
  },
});
