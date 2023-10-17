import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useHelper } from "../../hooks/useHelper";
import colors from "../../utility/colors";

const BottomButton = (props) => {
  const { keyboardSpace } = useHelper();

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.buttonView,
        props.bottomStyles,
        {
          bottom: keyboardSpace === 0 ? 15 : keyboardSpace,
        },
      ]}
    >
      {props.loading ? (
        <ActivityIndicator size={"small"} color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>
          {props.text === "" || props?.text === undefined
            ? "Continue"
            : props.text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default BottomButton;

const styles = StyleSheet.create({
  buttonView: {
    width: "90%",
    paddingVertical: "5%",
    borderRadius: 10,
    backgroundColor: colors.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    position: "absolute",
    alignSelf: "center",
    bottom: 15,
  },
  buttonText: { fontSize: 15, color: colors.white, fontFamily: "Inter-Medium" },
});
