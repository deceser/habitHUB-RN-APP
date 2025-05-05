import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { Button } from '../components/ui/Button';
import { createTask, Task, checkConnection } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import NetInfo from '@react-native-community/netinfo';

// Emoji list
const EMOJI_LIST = ['⭐', '📚', '📝', '🏃', '🧘', '🍎', '💻', '🌱', '🎯', '🎵'];

// Predefined colors for selection
const COLORS = [
  '#ADF7B6',
  '#A817C0',
  '#FFC09F',
  '#8FFFF8',
  '#CC2222',
  '#FBF1BA',
  '#7075E5',
  '#FF36F7',
];

// Predefined tags
const TAGS = ['Daily Routine', 'Study Routine', 'Fitness', 'Work', 'Hobby', 'Personal', 'Other'];

// Task repetition types
type RepeatType = 'Daily' | 'Weekly' | 'Monthly';

// Days of week
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const NewTaskScreen: React.FC = () => {
  const navigation = useNavigation<RootStackScreenProps<'NewTask'>['navigation']>();
  const { user } = useAuth();

  // States for form fields
  const [taskName, setTaskName] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('⭐');
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [selectedRepeatType, setSelectedRepeatType] = useState<RepeatType>('Weekly');
  const [selectedDays, setSelectedDays] = useState<number[]>([2, 3]); // Default: Wednesday and Thursday
  const [selectedTag, setSelectedTag] = useState<string>(TAGS[0]);
  const [isShowingEmojiPicker, setIsShowingEmojiPicker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [networkAvailable, setNetworkAvailable] = useState<boolean>(true);

  // Check network connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkAvailable(!!state.isConnected && !!state.isInternetReachable);
    });

    // Initial check
    NetInfo.fetch().then(state => {
      setNetworkAvailable(!!state.isConnected && !!state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  // Handler for cyclic emoji switching
  const handleEmojiPress = useCallback(() => {
    const currentIndex = EMOJI_LIST.indexOf(selectedEmoji);
    const nextIndex = (currentIndex + 1) % EMOJI_LIST.length;
    setSelectedEmoji(EMOJI_LIST[nextIndex]);
  }, [selectedEmoji]);

  // Handler for color selection
  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  // Handler for repeat type selection
  const handleRepeatTypeSelect = useCallback((type: RepeatType) => {
    setSelectedRepeatType(type);
  }, []);

  // Handler for day selection
  const handleDaySelect = useCallback((dayIndex: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(day => day !== dayIndex);
      } else {
        return [...prev, dayIndex];
      }
    });
  }, []);

  // Handler for tag selection
  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTag(tag);
  }, []);

  // Formatting task repetition data
  const getRepeatTaskString = useCallback(() => {
    if (selectedRepeatType === 'Daily') {
      return 'Every day';
    } else if (selectedRepeatType === 'Weekly') {
      const daysString = selectedDays.map(day => DAYS_OF_WEEK[day]).join(', ');
      return `Weekly on ${daysString}`;
    } else {
      return 'Monthly';
    }
  }, [selectedRepeatType, selectedDays]);

  // Сбросить форму
  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setSelectedEmoji('⭐');
    setSelectedColor(COLORS[0]);
    setSelectedRepeatType('Weekly');
    setSelectedDays([2, 3]);
    setSelectedTag(TAGS[0]);
  };

  // Saving task to Supabase
  const handleCreateTask = async () => {
    // Check if task name is present
    if (!taskName.trim()) {
      Alert.alert('Error', 'Enter the task name');
      return;
    }

    // Check if any days selected for weekly tasks
    if (selectedRepeatType === 'Weekly' && selectedDays.length === 0) {
      Alert.alert('Error', 'Select at least one day of the week');
      return;
    }

    // Check network connection
    if (!networkAvailable) {
      Alert.alert(
        'No connection',
        'No internet connection. The task will be created when the connection is restored.',
        [{ text: 'OK' }],
      );
      return;
    }

    setIsLoading(true);

    try {
      // Check connection with Supabase
      const { connected, error: connectionError } = await checkConnection();
      if (!connected) {
        Alert.alert(
          'Connection error',
          `Failed to connect to the server: ${connectionError || 'unknown error'}. Please try again later.`,
          [{ text: 'OK' }],
        );
        setIsLoading(false);
        return;
      }

      // Create task object with user ID from auth context
      const newTask: Task = {
        name_task: taskName,
        description_task: taskDescription,
        color_task: selectedColor,
        repeat_task: getRepeatTaskString(),
        tag_task: selectedTag,
        completed: false,
        user_id: user?.id, // Add user ID to associate tasks with the current user
      };

      console.log('Sending task:', JSON.stringify(newTask));

      // Send task to Supabase
      const { data, error } = await createTask(newTask);

      if (error) {
        const errorDetails =
          typeof error === 'object' && error !== null
            ? error.message || JSON.stringify(error)
            : String(error);

        Alert.alert('Error creating task', `Failed to save the task: ${errorDetails}`, [
          { text: 'Cancel' },
          {
            text: 'Retry',
            onPress: () => handleCreateTask(),
          },
        ]);
        console.error('Error creating task:', error);
      } else {
        // Task created successfully
        console.log('Task created successfully:', data);
        resetForm();
        navigation.goBack();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Error', `Failed to create a task: ${errorMessage}`, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: () => handleCreateTask(),
        },
      ]);
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header with close button */}
        <View style={styles.header}>
          <Text style={styles.title}>New Task</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="close" size={24} color="rgba(0, 0, 0, 0.8)" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Task emoji and name */}
          <View style={styles.emojiSection}>
            <TouchableOpacity onPress={handleEmojiPress}>
              <Text style={styles.emoji}>{selectedEmoji}</Text>
              <Text style={styles.emojiHint}>Click to change</Text>
            </TouchableOpacity>
          </View>

          {/* Task name input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name your new task"
              placeholderTextColor="rgba(30, 28, 28, 0.8)"
              value={taskName}
              onChangeText={setTaskName}
            />
            <View style={styles.divider} />

            <TextInput
              style={styles.input}
              placeholder="Describe it"
              placeholderTextColor="rgba(30, 28, 28, 0.8)"
              multiline
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
          </View>

          {/* Repeat section */}
          <Text style={styles.sectionTitle}>Repeat</Text>
          <View style={styles.inputContainer}>
            <View style={styles.repeatToggleContainer}>
              <Text style={styles.toggleLabel}>Set a cycle for your task</Text>
              <View style={styles.divider} />

              <View style={styles.repeatRow}>
                <Text style={styles.repeatLabel}>Repeat</Text>
                <View style={styles.repeatOptions}>
                  <Text style={styles.repeatValue}>{getRepeatTaskString()}</Text>
                  <Text style={styles.arrow}>{'>'}</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </View>

            {/* Frequency buttons */}
            <View style={styles.frequencyContainer}>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  selectedRepeatType === 'Daily' ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => handleRepeatTypeSelect('Daily')}
              >
                <Text
                  style={
                    selectedRepeatType === 'Daily'
                      ? styles.frequencyTextActive
                      : styles.frequencyText
                  }
                >
                  Daily
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  selectedRepeatType === 'Weekly' ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => handleRepeatTypeSelect('Weekly')}
              >
                <Text
                  style={
                    selectedRepeatType === 'Weekly'
                      ? styles.frequencyTextActive
                      : styles.frequencyText
                  }
                >
                  Weekly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  selectedRepeatType === 'Monthly' ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => handleRepeatTypeSelect('Monthly')}
              >
                <Text
                  style={
                    selectedRepeatType === 'Monthly'
                      ? styles.frequencyTextActive
                      : styles.frequencyText
                  }
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>

            {/* Days of week - display only for Weekly */}
            {selectedRepeatType === 'Weekly' && (
              <View style={styles.daysContainer}>
                {DAYS_OF_WEEK.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCircle,
                      selectedDays.includes(index) ? styles.activeDayCircle : {},
                    ]}
                    onPress={() => handleDaySelect(index)}
                  >
                    <Text style={styles.dayText}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Card Color section */}
          <Text style={styles.sectionTitle}>Card Color</Text>
          <View style={styles.colorsContainer}>
            {COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  color === selectedColor ? styles.activeColorCircle : {},
                ]}
                onPress={() => handleColorSelect(color)}
              />
            ))}
          </View>

          {/* Tags */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Set a tag for your task</Text>
            <View style={styles.divider} />

            <View style={styles.tagsContainer}>
              {TAGS.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.tagChip, tag === selectedTag ? styles.activeTagChip : {}]}
                  onPress={() => handleTagSelect(tag)}
                >
                  <Text style={[styles.tagText, tag === selectedTag ? styles.activeTagText : {}]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Create Task button */}
          <Button
            title={isLoading ? 'Creating...' : 'Create Task'}
            onPress={handleCreateTask}
            style={styles.createButton}
            disabled={isLoading || !taskName.trim()}
          />

          {isLoading && <ActivityIndicator size="large" color="#A817C0" style={styles.loader} />}

          {/* Network Status Warning */}
          {!networkAvailable && (
            <View style={styles.networkWarning}>
              <MaterialIcons name="wifi-off" size={20} color="#D32F2F" />
              <Text style={styles.networkWarningText}>
                No internet connection. The task will not be saved.
              </Text>
            </View>
          )}

          {/* Add spacing at the bottom for better scrolling */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#BDE0FE',
    borderRadius: 55,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    position: 'relative',
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 36,
    color: '#000000',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  emojiSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 65,
    lineHeight: 97,
  },
  emojiHint: {
    fontSize: 8,
    color: 'rgba(30, 28, 28, 0.8)',
    marginTop: -10,
  },
  inputContainer: {
    backgroundColor: '#FDFDFD',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  input: {
    fontFamily: 'Poppins',
    fontSize: 14,
    paddingVertical: 8,
    color: 'rgba(30, 28, 28, 0.8)',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginVertical: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 5,
    color: 'rgba(30, 28, 28, 0.8)',
  },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  activeColorCircle: {
    borderWidth: 3,
    borderColor: '#F5F5F5',
  },
  inputLabel: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'rgba(30, 28, 28, 0.8)',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tagChip: {
    backgroundColor: '#ABDDF4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  activeTagChip: {
    backgroundColor: '#87C4FF',
  },
  tagText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(30, 28, 28, 0.8)',
  },
  activeTagText: {
    fontWeight: '700',
  },
  repeatToggleContainer: {
    marginBottom: 10,
  },
  toggleLabel: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'rgba(30, 28, 28, 0.8)',
    marginBottom: 8,
  },
  repeatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  repeatLabel: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'rgba(30, 28, 28, 0.8)',
  },
  repeatOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatValue: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'rgba(30, 28, 28, 0.8)',
    marginRight: 5,
  },
  arrow: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'rgba(30, 28, 28, 0.8)',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  frequencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FFC09F',
  },
  inactiveButton: {
    backgroundColor: '#EDEAEA',
  },
  frequencyText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'rgba(30, 28, 28, 0.8)',
  },
  frequencyTextActive: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(30, 28, 28, 0.8)',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFC09F',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
  },
  activeDayCircle: {
    opacity: 1,
  },
  dayText: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '300',
    color: '#000',
  },
  createButton: {
    marginVertical: 20,
  },
  bottomSpacing: {
    height: 50,
  },
  loader: {
    marginVertical: 10,
  },
  networkWarning: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  networkWarningText: {
    color: '#D32F2F',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
});
