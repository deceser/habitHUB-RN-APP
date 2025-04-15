import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  commonStyles,
  verticalGradientConfig,
  textStyles,
} from "../constants/styles";
import { AuthHeader } from "../components/auth/AuthHeader";
import { Button } from "../components/ui/Button";
import { SocialAuth } from "../components/auth/SocialAuth";
import { BackgroundBlur } from "../components/ui/BackgroundBlur";
import { loginContent } from "../constants/content";

export const LoginScreen = () => {
  return (
    <View style={commonStyles.container}>
      {/* Градиентный фон */}
      <LinearGradient
        {...verticalGradientConfig}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Размытые элементы фона */}
      <BackgroundBlur />

      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.contentContainer}>
          <AuthHeader
            titleLines={loginContent.titleLines}
            subtitle={loginContent.subtitle}
          />

          <View style={styles.authContainer}>
            <Button title={loginContent.buttons.login} />

            <TouchableOpacity style={styles.createAccountContainer}>
              <Text style={textStyles.link}>
                {loginContent.buttons.createAccount}
              </Text>
            </TouchableOpacity>

            <SocialAuth />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: "15%",
    paddingBottom: "10%",
    zIndex: 1,
  },
  authContainer: {
    width: "100%",
  },
  createAccountContainer: {
    marginTop: 16,
  },
});
