import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GradientContainer } from '../components/ui/GradientContainer';
import { commonStyles } from '../constants/styles';

interface MenuItemProps {
  title: string;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.menuItemText}>{title}</Text>
      <Text style={styles.menuItemArrow}>{'>'}</Text>
    </TouchableOpacity>
  );
};

export const ProfileScreen = () => {
  return (
    <GradientContainer vertical>
      <StatusBar style="dark" />
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.menuContainer}>
              <MenuItem title="Account" />
              <MenuItem title="Notifications" />
              <MenuItem title="Help" />
              <MenuItem title="Storage and Data" />
              <MenuItem title="Invite a friend" />
              <MenuItem title="Logout" />
            </View>

            {/* Placeholder for profile info */}
            <View style={styles.profileInfoContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>👤</Text>
              </View>
              <Text style={styles.profileEmail}>user@example.com</Text>
            </View>

            {/* App info */}
            <View style={styles.appInfoContainer}>
              <Text style={styles.appInfoText}>Version 1.0.0</Text>
              <Text style={styles.appInfoText}>© 2024 HabitHUB</Text>
            </View>
          </ScrollView>
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
  title: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '500',
    marginVertical: 24,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FDFDFD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(30, 28, 28, 0.8)',
  },
  menuItemArrow: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(30, 28, 28, 0.8)',
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4D8F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImageText: {
    fontSize: 40,
  },
  profileName: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'rgba(30, 28, 28, 0.6)',
  },
  appInfoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  appInfoText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: 'rgba(30, 28, 28, 0.5)',
    marginBottom: 4,
  },
});
