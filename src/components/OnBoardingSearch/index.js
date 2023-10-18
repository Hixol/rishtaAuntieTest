import React from "react";
import { View, StyleSheet, TextInput, Platform } from "react-native";

import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";

const OnBoardingSearch = (props) => {
  const {
    search,
    searchValue,
    array,
    currentIndex,
    text,
    onChangeText,
    type,
    edit,
  } = props;

  return search ? (
    <View style={styles.textinputView}>
      <FastImage
        resizeMode="contain"
        style={{ width: 20, height: 20 }}
        source={require("../../assets/iconimages/Search.png")}
      />
      <TextInput
        style={styles.textinput}
        value={searchValue}
        onChangeText={onChangeText}
        placeholder={`${
          edit
            ? "Search your " + type.toLowerCase()
            : array[currentIndex]?.type === "Family Origin"
            ? "Search countries"
            : "Search your " + array[currentIndex]?.type.toLowerCase()
        }`}
        placeholderTextColor={"#9CA3AF"}
      />
    </View>
  ) : null;
};
export default OnBoardingSearch;
const styles = StyleSheet.create({
  typeandCountView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: "2%",
    marginVertical: "2%",
  },
  type: { fontSize: 16, color: colors.black },
  countView: {
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#23262F",
  },
  countText: { fontSize: 14, color: colors.white },
  question: {
    fontSize: 24,
    color: colors.black,
    fontFamily: "Roboto-Bold",
    marginVertical: "2%",
    maxWidth: "90%",
  },
  ask: {
    fontSize: 16,
    color: colors.black,
    fontFamily: "Roboto-light",
    marginVertical: "1%",
    maxWidth: "90%",
  },
  vibesListing: {
    width: "80%",
    paddingVertical: "3%",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: "3%",
    alignSelf: "center",
    paddingHorizontal: "5%",
    borderRadius: 10,
  },
  radioView: {
    width: 25,
    height: 25,
    borderColor: "#EBECEF",
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  textinputView: {
    width: "95%",
    alignSelf: "center",
    paddingHorizontal: "5%",
    paddingVertical: Platform.OS === "ios" ? "5%" : "3%",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    marginVertical: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  textinput: {
    // minWidth: '60%',
    // maxWidth: '90%',
    flex: 1,
    marginLeft: "5%",
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: colors.black,
  },
});
