import React from 'react';
import { View } from 'react-native';
import { blurElementStyles } from '../../constants/blurElements';

/**
 * Component for displaying blurred gradient circles in the background
 */
export const BackgroundBlur: React.FC = () => {
  return (
    <>
      <View style={blurElementStyles.purpleBlur} />
      <View style={blurElementStyles.pinkBlur} />
      <View style={blurElementStyles.blueBigBlur} />
      <View style={blurElementStyles.blueSmallBlur} />
    </>
  );
};
