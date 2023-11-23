import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";

import colors from "../../utility/colors";

import FastImage from "react-native-fast-image";

const NewOnBoardingDesign = props => {
  const {
    mainOnPress,
    index,
    findIndex,
    item,
    nameorid,
    multiSelect,
    search,
    divider = true,
    radio,
    icon,
  } = props;
  return (
    <>
      {divider && index === 0 ? (
        <View
          style={{
            width: "100%",
            borderWidth: 0.7,
            alignSelf: "center",
            borderColor: "#EBECEF",
            marginBottom: 5,
          }}
        ></View>
      ) : null}

      <TouchableOpacity
        onPress={mainOnPress}
        style={[
          styles.vibesListing,
          radio
            ? null
            : {
                backgroundColor: multiSelect
                  ? findIndex?.includes(index)
                    ? colors.primaryPink
                    : "#F9FAFB"
                  : findIndex === index
                  ? colors.primaryPink
                  : "#F9FAFB",
              },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon ? (
            <View
              style={[
                styles.leftIconView,
                {
                  backgroundColor: findIndex === index ? "#C60A63" : "#EBECEF",
                },
              ]}
            >
              <FastImage
                resizeMode="contain"
                style={{ width: 25, height: 25 }}
                source={item?.icon}
              />
            </View>
          ) : null}

          <Text
            style={{
              flex: 0.93,
              fontFamily: "Inter-Medium",
              marginLeft: icon ? "5%" : "0%",
              fontSize: 16,
              color: radio
                ? colors.black
                : multiSelect
                ? findIndex?.includes(index)
                  ? colors.white
                  : colors.black
                : findIndex === index
                ? colors.white
                : colors.black,
            }}
          >
            {nameorid === "title"
              ? item?.title
              : nameorid === "name"
              ? item?.name
              : item}
          </Text>
        </View>
        <View
          style={[
            styles.radioView,

            {
              borderWidth: multiSelect
                ? findIndex?.includes(index)
                  ? 0
                  : 1
                : findIndex === index
                ? 0
                : 1,
              backgroundColor: multiSelect
                ? findIndex?.includes(index)
                  ? colors.white
                  : null
                : findIndex === index
                ? colors.white
                : null,
            },
          ]}
        >
          {radio && multiSelect && findIndex?.includes(index) ? (
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: colors.primaryPink,
                borderRadius: 15 / 2,
              }}
            ></View>
          ) : radio && !multiSelect && findIndex === index ? (
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: colors.primaryPink,
                borderRadius: 15 / 2,
              }}
            ></View>
          ) : multiSelect && findIndex?.includes(index) ? (
            <FastImage
              style={{ width: 15, height: 15 }}
              source={require("../../assets/iconimages/checkicon.png")}
            />
          ) : !multiSelect && findIndex === index ? (
            <FastImage
              style={{ width: 15, height: 15 }}
              source={require("../../assets/iconimages/checkicon.png")}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    </>
  );
};
export default NewOnBoardingDesign;
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
    fontFamily: "Inter-Bold",
    marginVertical: "2%",
    maxWidth: "90%",
  },
  ask: {
    fontSize: 16,
    color: colors.black,
    fontFamily: "Inter-light",
    marginVertical: "1%",
    maxWidth: "90%",
  },
  vibesListing: {
    width: "95%",
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
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    marginVertical: "5%",
    flexDirection: "row",
  },
  textinput: {
    minWidth: "60%",
    maxWidth: "80%",
    marginLeft: "5%",
    fontSize: 18,
  },
  leftIconView: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
