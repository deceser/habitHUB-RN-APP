import moment from 'moment';

export interface WeekDay {
  dayName: string;
  dayNumber: string;
  fullDate: string;
  isToday: boolean;
}

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  completed: boolean;
  date: string;
}

export type HabitsByDate = {
  [date: string]: Habit[];
};

/**
 * Get dates of the current week in the format of an array of WeekDay objects
 */
export const getWeekDates = (): WeekDay[] => {
  const startOfWeek = moment().startOf('isoWeek');
  return Array.from({ length: 7 }).map((_, i) => {
    const date = startOfWeek.clone().add(i, 'days');
    return {
      dayName: date.format('ddd'), // Sun, Mon...
      dayNumber: date.format('D'), // 10, 11...
      fullDate: date.format('YYYY-MM-DD'),
      isToday: date.isSame(moment(), 'day'),
    };
  });
};

/**
 * Generates a unique ID for a habit using the current timestamp and a random number
 */
export const generateHabitId = (): string => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
};

/**
 * Formats the date for display
 */
export const formatDate = (date: string): string => {
  return moment(date).format('DD MMM YYYY');
};

/**
 * Creates demo habits data for the current week
 */
export const generateDemoHabits = (): HabitsByDate => {
  const weekDates = getWeekDates();
  const habitsByDate: HabitsByDate = {};

  // Add habits for all days except Friday (to show empty state)
  weekDates.forEach(day => {
    if (day.dayName === 'Fri') {
      // Friday will be empty to show EmptyState
      habitsByDate[day.fullDate] = [];
    } else if (day.dayName === 'Wed') {
      // For Wednesday, add more habits
      habitsByDate[day.fullDate] = [
        {
          id: generateHabitId(),
          title: 'Exercise',
          emoji: '🏃',
          completed: true,
          date: day.fullDate,
        },
        {
          id: generateHabitId(),
          title: 'Study',
          emoji: '📚',
          completed: false,
          date: day.fullDate,
        },
        {
          id: generateHabitId(),
          title: 'Journal',
          emoji: '📝',
          completed: false,
          date: day.fullDate,
        },
      ];
    } else {
      // For other days, add basic habits
      habitsByDate[day.fullDate] = [
        { id: generateHabitId(), title: 'Read', emoji: '📖', completed: false, date: day.fullDate },
        {
          id: generateHabitId(),
          title: 'Meditate',
          emoji: '🧘',
          completed: day.isToday,
          date: day.fullDate,
        },
      ];
    }
  });

  return habitsByDate;
};
