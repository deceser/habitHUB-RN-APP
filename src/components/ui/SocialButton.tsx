import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { commonStyles } from "../../constants/styles";

// Поддерживаемые типы иконок Fontisto
type FontistoIconName = "facebook" | "google" | "apple";

interface SocialButtonProps {
  iconName: FontistoIconName;
  color: string;
  onPress?: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  iconName,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Fontisto name={iconName} size={20} color={color} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.19)",
    ...commonStyles.centerContent,
    marginHorizontal: 12,
  },
  iconContainer: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
