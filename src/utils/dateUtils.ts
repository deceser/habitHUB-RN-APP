import moment from 'moment';

export interface WeekDay {
  dayName: string;
  dayNumber: string;
  fullDate: string;
  isToday: boolean;
}

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
