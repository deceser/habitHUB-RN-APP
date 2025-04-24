import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from '../ui/Checkbox';

export interface HabitItemProps {
  id: string;
  title: string;
  emoji: string;
  completed?: boolean;
  onPress?: () => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({
  id,
  title,
  emoji,
  completed = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, completed && styles.completedContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.title, completed && styles.completedTitle]} numberOfLines={1}>
        {title}
      </Text>
      <Checkbox
        checked={completed}
        onPress={onPress || (() => {})}
        size={20}
        containerStyle={styles.checkboxContainer}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedContainer: {
    backgroundColor: 'rgba(186, 104, 200, 0.1)',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  checkboxContainer: {
    marginLeft: 8,
  },
});
