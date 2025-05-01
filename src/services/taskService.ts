import { supabase, fetchWithRetry, checkSupabaseConnection } from '../lib/supabase';

export interface Task {
  id?: number;
  name_task: string;
  description_task: string;
  color_task: string;
  repeat_task: string;
  tag_task: string;
  created_at?: string;
  completed?: boolean;
}

/**
 * Check connection before performing operations
 * @returns Connection status information
 */
export const checkConnection = async (): Promise<{ connected: boolean; error?: string }> => {
  try {
    const connected = await checkSupabaseConnection();
    return { connected };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return { connected: false, error: errorMessage };
  }
};

/**
 * Creates a new task in Supabase
 * @param task The task object to create
 * @returns The created task or an error
 */
export const createTask = async (task: Task): Promise<{ data: any; error: any }> => {
  try {
    // Check connection before performing the operation
    const { connected, error: connectionError } = await checkConnection();
    if (!connected) {
      console.error('Connection error:', connectionError);
      return {
        data: null,
        error: {
          message: 'Нет соединения с сервером. Проверьте подключение к интернету.',
          details: connectionError,
        },
      };
    }

    // Add the current date if it's not specified
    const taskWithDate = {
      ...task,
      created_at: task.created_at || new Date().toISOString(),
    };

    // Use the retry function to create the task
    const result = await fetchWithRetry(async () => {
      console.log('Attempting to create task with data:', JSON.stringify(taskWithDate));
      const response = await supabase.from('user_tasks').insert([taskWithDate]).select();
      console.log('Task creation response:', JSON.stringify(response));
      return response;
    });

    const { data, error } = result;

    if (error) {
      console.error('Error creating task:', error);
      // Form a clear error message
      const errorMessage = error.message || 'Failed to create task';
      return { data: null, error: { message: errorMessage, original: error } };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating task:', error);
    // Convert the error to a clear format
    const errorMessage = error instanceof Error ? error.message : 'Unknown error creating task';
    return { data: null, error: { message: errorMessage, original: error } };
  }
};

/**
 * Gets a list of all user tasks
 * @returns List of tasks or an error
 */
export const getTasks = async (): Promise<{ data: Task[] | null; error: any }> => {
  try {
    return await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return { data: null, error };
      }

      return { data, error: null };
    });
  } catch (error) {
    console.error('Unexpected error fetching tasks:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching tasks';
    return { data: null, error: { message: errorMessage, original: error } };
  }
};

/**
 * Deletes a task by ID
 * @param taskId ID of the task to delete
 * @returns The result of the operation
 */
export const deleteTask = async (taskId: number): Promise<{ success: boolean; error: any }> => {
  try {
    return await fetchWithRetry(async () => {
      const { error } = await supabase.from('user_tasks').delete().eq('id', taskId);

      if (error) {
        console.error('Error deleting task:', error);
        return { success: false, error };
      }

      return { success: true, error: null };
    });
  } catch (error) {
    console.error('Unexpected error deleting task:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error deleting task';
    return { success: false, error: { message: errorMessage, original: error } };
  }
};

/**
 * Updates an existing task
 * @param taskId ID of the task to update
 * @param updatedData Updated task data
 * @returns The updated task or an error
 */
export const updateTask = async (
  taskId: number,
  updatedData: Partial<Task>,
): Promise<{ data: any; error: any }> => {
  try {
    return await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from('user_tasks')
        .update(updatedData)
        .eq('id', taskId)
        .select();

      if (error) {
        console.error('Error updating task:', error);
        return { data: null, error };
      }

      return { data, error: null };
    });
  } catch (error) {
    console.error('Unexpected error updating task:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error updating task';
    return { data: null, error: { message: errorMessage, original: error } };
  }
};
