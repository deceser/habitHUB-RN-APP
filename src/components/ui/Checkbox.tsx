import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  size?: number;
  containerStyle?: object;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  size = 24,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          checked ? styles.checked : styles.unchecked,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {checked && <View style={styles.innerCircle} />}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  checked: {
    borderColor: '#BA68C8',
    backgroundColor: 'rgba(186, 104, 200, 0.2)',
  },
  unchecked: {
    borderColor: '#D9D9D9',
    backgroundColor: '#F5F5F5',
  },
  innerCircle: {
    width: '60%',
    height: '60%',
    borderRadius: 100,
    backgroundColor: '#BA68C8',
  },
  label: {
    marginLeft: 8,
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#000000',
  },
});
