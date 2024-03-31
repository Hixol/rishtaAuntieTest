import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";
import Icons from "../../utility/icons";

const HeaderContainer = props => {
  const { userData } = useSelector(store => store.userReducer);
  const proMember = userData?.UserSetting?.isSubscribed;

  return (
    <View>
      {props.Icon && props.backButton ? (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtnContainer}
            onPress={props.gobackButtonPress}
          >
            <Icons.Ionicons
              name={props.goback}
              size={30}
              color={colors.blackBlue}
            />
          </TouchableOpacity>
          <View
            style={{
              width: "45%",
              height: 30,
              alignSelf: "center",
              alignItems: "flex-end",
            }}
          >
            <FastImage
              resizeMode="contain"
              style={{ width: 40, height: "100%" }}
              source={
                proMember
                  ? require("../../assets/iconimages/logo-gold.png")
                  : require("../../assets/iconimages/header-icon.png")
              }
            />
          </View>
          {props.headerRight ? (
            <Text onPress={props.rightPress} style={styles.restoreTxt}>
              {props.headerRight}
            </Text>
          ) : null}
        </View>
      ) : props.Icon ? (
        <View style={styles.header}>
          <View
            style={{
              width: "100%",
              height: 30,
              alignSelf: "center",
              alignItems: "center",
            }}
          >
            <FastImage
              resizeMode="contain"
              style={{ width: 40, height: "100%" }}
              source={
                proMember
                  ? require("../../assets/iconimages/logo-gold.png")
                  : require("../../assets/iconimages/header-icon.png")
              }
            />
          </View>
        </View>
      ) : null}

      {props.screenTitle ? (
        <View style={[styles.header, props.btnWithTitle && styles.row]}>
          {props.btnWithTitle && (
            <TouchableOpacity
              style={[styles.backBtnContainer, { marginRight: 20 }]}
              onPress={props.gobackButtonPress}
            >
              <Icons.Ionicons
                name={props.goback}
                size={30}
                color={colors.blackBlue}
              />
            </TouchableOpacity>
          )}
          {props.titleStyle ? (
            <View
              style={{
                width: "45%",
                height: 30,
                alignSelf: "center",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={[
                  styles.screenTitle,
                  props.titleStyle,
                  props.selectedMsg && { flex: 1 },
                ]}
              >
                {props.screenTitle}
              </Text>
            </View>
          ) : (
            <Text
              style={[styles.screenTitle, props.selectedMsg && { flex: 1 }]}
            >
              {props.screenTitle}
            </Text>
          )}
          {props.selectedMsg && (
            <TouchableOpacity onPress={props.unstarCallback}>
              <Icons.MaterialCommunityIcons
                name="star-off"
                size={20}
                color={colors.blackBlue}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: "3%",
    paddingHorizontal: "3%",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  backBtnContainer: {
    alignSelf: "flex-start",
    width: "10%",
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: colors.blackBlue,
  },
  restoreTxt: {
    position: "absolute",
    right: 20,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: colors.blackBlue,
  },
  headerIcons: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "orange",
    paddingHorizontal: "3%",
  },
  headerSingleIcon: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default HeaderContainer;
