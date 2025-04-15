import { StyleSheet } from 'react-native';
import { theme } from './theme';

// Common styles for reusable components
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

// Text styles for different cases
export const textStyles = StyleSheet.create({
  title: {
    fontSize: theme.fontSizes.huge,
    fontWeight: '400',
    color: '#000',
    lineHeight: 96,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000',
    lineHeight: 27,
  },
  button: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
    lineHeight: 36,
  },
  link: {
    textAlign: 'center',
    fontSize: theme.fontSizes.xs,
    fontWeight: '300',
    textDecorationLine: 'underline',
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 18,
  },
  emphasis: {
    fontWeight: '900',
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: 0.1,
    lineHeight: 14,
  },
});

// Main horizontal gradient (left-to-right)
export const gradientConfig = {
  colors: ['#C2E7FF', '#F3DDFF'] as readonly [string, string],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
  locations: [0, 1] as readonly [number, number],
};

// Vertical diagonal gradient (more gentle and soft)
export const verticalGradientConfig = {
  colors: ['#C2E7FF', '#E8DCFF', '#F3DDFF'] as readonly [string, string, string],
  start: { x: 0.2, y: 0 },
  end: { x: 0.8, y: 1 },
  locations: [0, 0.5, 1] as readonly [number, number, number],
};
