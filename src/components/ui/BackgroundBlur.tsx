import React from "react";
import { View } from "react-native";
import { blurElementStyles } from "../../constants/blurElements";

/**
 * Компонент для отображения размытых градиентных кругов в фоне
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
