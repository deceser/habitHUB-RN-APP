import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { HabitItem } from './HabitItem';
import { EmptyStateIllustration } from '../../assets/images/EmptyStateIllustration';
import { Habit } from '../../utils/dateUtils';

export interface HabitListProps {
  habits: Habit[];
  onHabitPress?: (id: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onHabitPress }) => {
  const hasHabits = habits && habits.length > 0;

  if (!hasHabits) {
    return (
      <View style={styles.emptyStateContainer}>
        <EmptyStateIllustration useSvg={true} size={340} />
      </View>
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <HabitItem
          id={item.id}
          title={item.title}
          emoji={item.emoji}
          completed={item.completed}
          date={item.date}
          onPress={onHabitPress}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 16,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56,
  },
});
