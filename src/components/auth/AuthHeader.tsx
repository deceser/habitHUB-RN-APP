import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { textStyles } from "../../constants/styles";

interface AuthHeaderProps {
  titleLines: string[];
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  titleLines,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      {titleLines.map((line, index) => (
        <Text key={`title-${index}`} style={textStyles.title}>
          {line}
        </Text>
      ))}
      <Text style={[textStyles.subtitle, styles.subtitle]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 20,
  },
});
