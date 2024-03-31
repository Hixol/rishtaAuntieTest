import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import colors from "../utility/colors";

const Loader = ({ size = "large", color = colors.primaryPink, style }) => {
  return (
    <ActivityIndicator
      size={size}
      color={color}
      style={[styles.loader, style]}
    />
  );
};

export default Loader;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
