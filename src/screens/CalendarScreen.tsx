import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { GradientContainer } from '../components/ui/GradientContainer';

interface DayProps {
  day: string;
  date: string;
  isCurrentMonth: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

const Day: React.FC<DayProps> = ({ day, date, isCurrentMonth, isSelected, onPress }) => (
  <TouchableOpacity style={styles.dayCell} onPress={onPress}>
    <View style={[styles.dayCircle, isSelected && styles.selectedDayCircle]}>
      <Text
        style={[
          styles.dayNumber,
          !isCurrentMonth && styles.inactiveDay,
          isSelected && styles.selectedDayText,
        ]}
      >
        {date}
      </Text>
    </View>
  </TouchableOpacity>
);

const HabitItem: React.FC<{ title: string; emoji: string }> = ({ title, emoji }) => (
  <View style={styles.habitItem}>
    <View style={styles.habitContent}>
      <Text style={styles.habitEmoji}>{emoji}</Text>
      <Text style={styles.habitTitle}>{title}</Text>
    </View>
    <View style={styles.statusDots}>
      <View style={styles.emptyDot} />
      <View style={styles.filledDot} />
    </View>
  </View>
);

const DatePanel: React.FC<{ date: string }> = ({ date }) => (
  <View style={styles.datePanel}>
    <Text style={styles.datePanelText}>{date}</Text>
    <View style={styles.datePanelLine} />
  </View>
);

export const CalendarScreen = () => {
  const [selectedDate] = useState(15);

  const weekDays = useMemo(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], []);

  const calendarDays = useMemo(
    () => [
      // Previous month days (January)
      { day: 'Mon', date: '29', currentMonth: false },
      { day: 'Tue', date: '30', currentMonth: false },
      { day: 'Wed', date: '31', currentMonth: false },
      // Current month - February
      { day: 'Thu', date: '1', currentMonth: true },
      { day: 'Fri', date: '2', currentMonth: true },
      { day: 'Sat', date: '3', currentMonth: true },
      { day: 'Sun', date: '4', currentMonth: true },
      // Next week
      { day: 'Mon', date: '5', currentMonth: true },
      { day: 'Tue', date: '6', currentMonth: true },
      { day: 'Wed', date: '7', currentMonth: true },
      { day: 'Thu', date: '8', currentMonth: true },
      { day: 'Fri', date: '9', currentMonth: true },
      { day: 'Sat', date: '10', currentMonth: true },
      { day: 'Sun', date: '11', currentMonth: true },
      // Next week
      { day: 'Mon', date: '12', currentMonth: true },
      { day: 'Tue', date: '13', currentMonth: true },
      { day: 'Wed', date: '14', currentMonth: true },
      { day: 'Thu', date: '15', currentMonth: true, selected: true },
      { day: 'Fri', date: '16', currentMonth: true },
      { day: 'Sat', date: '17', currentMonth: true },
      { day: 'Sun', date: '18', currentMonth: true },
      // Next week
      { day: 'Mon', date: '19', currentMonth: true },
      { day: 'Tue', date: '20', currentMonth: true },
      { day: 'Wed', date: '21', currentMonth: true },
      { day: 'Thu', date: '22', currentMonth: true },
      { day: 'Fri', date: '23', currentMonth: true },
      { day: 'Sat', date: '24', currentMonth: true },
      { day: 'Sun', date: '25', currentMonth: true },
      // Next week
      { day: 'Mon', date: '26', currentMonth: true },
      { day: 'Tue', date: '27', currentMonth: true },
      { day: 'Wed', date: '28', currentMonth: true },
      { day: 'Thu', date: '29', currentMonth: true },
      // Next month days (March)
      { day: 'Fri', date: '1', currentMonth: false },
      { day: 'Sat', date: '2', currentMonth: false },
      { day: 'Sun', date: '3', currentMonth: false },
    ],
    [],
  );

  // Chunk calendar days into weeks
  const calendarWeeks = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }
    return weeks;
  }, [calendarDays]);

  return (
    <GradientContainer vertical>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Calendar</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Calendar Widget */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <View style={styles.monthDisplay}>
                <Text style={styles.monthText}>February</Text>
                <Text style={styles.yearText}>2024</Text>
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
                      key={`${day.day}-${day.date}`}
                      day={day.day}
                      date={day.date}
                      isCurrentMonth={day.currentMonth}
                      isSelected={day.date === selectedDate.toString() && day.currentMonth}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Habit Lists by Date */}
          <View style={styles.habitsContainer}>
            <DatePanel date="February, 15th, Thu" />
            <HabitItem title="Read" emoji="📖" />
            <HabitItem title="Read" emoji="📖" />

            <DatePanel date="February, 16th, Fri" />
            <HabitItem title="Read" emoji="📖" />
            <HabitItem title="Read" emoji="📖" />

            <DatePanel date="This week" />
            <HabitItem title="Read" emoji="📖" />
            <HabitItem title="Read" emoji="📖" />
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#D7ECFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  habitTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '400',
  },
  statusDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D9D9D9',
    marginRight: 8,
  },
  filledDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '500',
  },
});
