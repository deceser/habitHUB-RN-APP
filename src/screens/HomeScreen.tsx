import React from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView, ScrollView } from 'react-native';

import { GradientContainer } from '../components/ui/GradientContainer';
import { commonStyles } from '../constants/styles';
import { EmptyStateIllustration } from '../assets/images/EmptyStateIllustration';
import { DayItem } from '../components/ui/DayItem';
import { FilterChip } from '../components/ui/FilterChip';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';

export const HomeScreen = () => {
  return (
    <GradientContainer vertical>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {/* Days */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysContainer}
            >
              <DayItem day="Sun" date="10" isActive={true} />
              <DayItem day="Mon" date="11" isActive={false} />
              <DayItem day="Tue" date="12" isActive={false} />
              <DayItem day="Wed" date="13" isActive={false} />
              <DayItem day="Thu" date="14" isActive={false} />
              <DayItem day="Fri" date="15" isActive={false} />
              <DayItem day="Sat" date="16" isActive={false} />
            </ScrollView>

            {/* Filter Chips */}
            <View style={styles.filtersContainer}>
              <FilterChip label="All" isActive={true} />
              <FilterChip label="Daily Routine" isActive={false} />
              <FilterChip label="Study Routine" isActive={false} />
            </View>
          </View>

          {/* Empty State */}
          <View style={styles.emptyStateContainer}>
            <EmptyStateIllustration useSvg={true} size={340} />
          </View>

          {/* Floating Action Button */}
          <FloatingActionButton onPress={() => console.log('FAB pressed')} />
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

  headerContainer: {
    flexDirection: 'column',
  },

  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },

  daysContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 36,
  },

  emptyStateContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 56,
  },
});
