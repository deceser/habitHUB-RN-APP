import React from 'react';
import { ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientConfig, verticalGradientConfig } from '../../constants/styles';

interface GradientContainerProps {
  style?: ViewStyle;
  children: React.ReactNode;
  /**
   * Set to true to use the verticalGradientConfig
   */
  vertical?: boolean;
}

/**
 * Container component with a gradient background
 */
export const GradientContainer: React.FC<GradientContainerProps> = ({
  style,
  children,
  vertical = false,
}) => {
  const config = vertical ? verticalGradientConfig : gradientConfig;

  return (
    <LinearGradient
      colors={config.colors}
      start={config.start}
      end={config.end}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};
