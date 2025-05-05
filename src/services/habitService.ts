import { supabase } from '../lib/supabase';
import { Habit, HabitsByDate } from '../utils/dateUtils';
import { Task } from './taskService';

/**
 * Converts a task from Supabase to a habit format for display
 */
export const taskToHabit = (task: Task): Habit => {
  return {
    id: task.id?.toString() || '',
    title: task.name_task,
    emoji:
      task.tag_task === 'Fitness'
        ? '🏃'
        : task.tag_task === 'Study Routine'
          ? '📚'
          : task.tag_task === 'Work'
            ? '💻'
            : task.tag_task === 'Hobby'
              ? '🎵'
              : '📝',
    completed: false, // By default, tasks are not completed
    date: task.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
  };
};

/**
 * Gets tasks for a specific date
 * @param date Date in YYYY-MM-DD format
 * @returns List of tasks in habit format
 */
export const getHabitsByDate = async (date: string): Promise<Habit[]> => {
  try {
    // Get the start and end of the day
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('user_tasks')
      .select('*')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);

    if (error) {
      console.error('Error fetching tasks by date:', error);
      return [];
    }

    // Convert tasks to habit format
    const habits: Habit[] = (data || []).map(taskToHabit);
    return habits;
  } catch (error) {
    console.error('Unexpected error fetching tasks by date:', error);
    return [];
  }
};

/**
 * Gets all user tasks for a week, grouped by date
 * @param startDate Start date (first day of the week)
 * @param endDate End date (last day of the week)
 * @returns Tasks grouped by dates
 */
export const getHabitsForWeek = async (
  startDate: string,
  endDate: string,
): Promise<HabitsByDate> => {
  try {
    // Form the request to get tasks for the week
    const startOfWeek = `${startDate}T00:00:00.000Z`;
    const endOfWeek = `${endDate}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('user_tasks')
      .select('*')
      .gte('created_at', startOfWeek)
      .lte('created_at', endOfWeek);

    if (error) {
      console.error('Error fetching tasks for week:', error);
      return {};
    }

    // Group tasks by date
    const habitsByDate: HabitsByDate = {};

    (data || []).forEach(task => {
      // Extract the date from the timestamp
      const date = task.created_at.split('T')[0];

      // Create an array if it doesn't exist
      if (!habitsByDate[date]) {
        habitsByDate[date] = [];
      }

      // Add the task to the corresponding day
      habitsByDate[date].push(taskToHabit(task));
    });

    return habitsByDate;
  } catch (error) {
    console.error('Unexpected error fetching tasks for week:', error);
    return {};
  }
};

/**
 * Updates the status of a task
 * @param id ID of the task
 * @param completed New status of completion
 */
export const updateHabitStatus = async (id: string, completed: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_tasks')
      .update({ completed })
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error updating task status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating task status:', error);
    return false;
  }
};
