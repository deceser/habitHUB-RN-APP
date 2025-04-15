import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocialButton } from "../ui/SocialButton";
import { commonStyles, textStyles } from "../../constants/styles";
import { theme } from "../../constants/theme";
import { loginContent } from "../../constants/content";

export const SocialAuth: React.FC = () => {
  return (
    <View>
      <View style={styles.dividerContainer}>
        <View style={commonStyles.divider} />
        <Text style={[textStyles.emphasis, styles.orText]}>
          {loginContent.dividers.or}
        </Text>
        <View style={commonStyles.divider} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <SocialButton iconName="facebook" color={theme.colors.facebook} />
        <SocialButton iconName="google" color={theme.colors.google} />
        <SocialButton iconName="apple" color={theme.colors.apple} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  orText: {
    paddingHorizontal: 12,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
});
