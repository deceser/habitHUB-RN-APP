import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { Button } from '../components/ui/Button';

export const NewTaskScreen: React.FC = () => {
  const navigation = useNavigation<RootStackScreenProps<'NewTask'>['navigation']>();

  return (
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
          <Text style={styles.emoji}>⭐</Text>
          <Text style={styles.emojiHint}>Click to change the emoji</Text>
        </View>

        {/* Task name input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name your new task"
            placeholderTextColor="rgba(30, 28, 28, 0.8)"
          />
          <View style={styles.divider} />

          <TextInput
            style={styles.input}
            placeholder="Describe it"
            placeholderTextColor="rgba(30, 28, 28, 0.8)"
            multiline
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
                <Text style={styles.repeatValue}>Every week</Text>
                <Text style={styles.arrow}>{'>'}</Text>
              </View>
            </View>
            <View style={styles.divider} />
          </View>

          {/* Frequency buttons */}
          <View style={styles.frequencyContainer}>
            <View style={[styles.frequencyButton, styles.inactiveButton]}>
              <Text style={styles.frequencyText}>Daily</Text>
            </View>
            <View style={[styles.frequencyButton, styles.activeButton]}>
              <Text style={styles.frequencyTextActive}>Weekly</Text>
            </View>
            <View style={[styles.frequencyButton, styles.inactiveButton]}>
              <Text style={styles.frequencyText}>Monthly</Text>
            </View>
          </View>

          {/* Days of week */}
          <View style={styles.daysContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <View
                key={index}
                style={[styles.dayCircle, index === 2 || index === 3 ? styles.activeDayCircle : {}]}
              >
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tags section */}
        <Text style={styles.sectionTitle}>Card Color</Text>
        <View style={styles.colorsContainer}>
          {[
            '#ADF7B6',
            '#A817C0',
            '#FFC09F',
            '#8FFFF8',
            '#CC2222',
            '#FBF1BA',
            '#7075E5',
            '#FF36F7',
          ].map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                index === 0 ? styles.activeColorCircle : {},
              ]}
            />
          ))}
        </View>

        {/* Tags */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Set a tag for your task</Text>
          <View style={styles.divider} />

          <View style={styles.tagsContainer}>
            <View style={styles.tagChip}>
              <Text style={styles.tagText}>Daily Routine</Text>
            </View>
            <View style={styles.tagChip}>
              <Text style={styles.tagText}>Study Routine</Text>
            </View>
            <View style={styles.tagChip}>
              <Text style={styles.tagText}>Add More +</Text>
            </View>
          </View>
        </View>

        {/* Create Task button */}
        <Button
          title="Create Task"
          onPress={() => navigation.goBack()}
          style={styles.createButton}
        />

        {/* Add spacing at the bottom for better scrolling */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  tagText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(30, 28, 28, 0.8)',
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
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  bottomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 28,
  },
  createButton: {
    marginVertical: 20,
  },
  bottomSpacing: {
    height: 50,
  },
});
