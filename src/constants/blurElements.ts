import { StyleSheet } from 'react-native';

// Base styles for blurred elements
export const baseBlurStyles = StyleSheet.create({
  blurCircle: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.5,
  },
});

// Additional styles for different blur elements
export const blurElementStyles = StyleSheet.create({
  pinkBlur: {
    ...baseBlurStyles.blurCircle,
    backgroundColor: 'rgba(241, 220, 255, 0.5)',
    top: -120,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  blueBigBlur: {
    ...baseBlurStyles.blurCircle,
    backgroundColor: 'rgba(200, 230, 255, 0.6)',
    top: '50%',
    left: -125,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  blueSmallBlur: {
    ...baseBlurStyles.blurCircle,
    backgroundColor: 'rgba(210, 240, 255, 0.55)',
    bottom: '10%',
    right: -50,
    width: 170,
    height: 170,
    borderRadius: 85,
  },
  // Дополнительное фиолетовое пятно для глубины дизайна
  purpleBlur: {
    ...baseBlurStyles.blurCircle,
    backgroundColor: 'rgba(232, 225, 255, 0.5)',
    bottom: '35%',
    right: '15%',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});
