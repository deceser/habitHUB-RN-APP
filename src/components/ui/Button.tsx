import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { commonStyles, textStyles } from "../../constants/styles";
import { theme } from "../../constants/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export const Button: React.FC<ButtonProps> = ({ title, style, ...props }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={textStyles.button}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.loginButton,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    ...commonStyles.shadow,
  },
});
