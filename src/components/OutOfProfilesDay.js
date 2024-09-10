import React from "react";
import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "../utility/colors";
import FastImage from "react-native-fast-image";

const OutOfProfilesDay = ({ adPress, adLoad, navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.h2, { textAlign: "center" }]}>
        Out of Profiles for the Day!
      </Text>
      <Text style={styles.resetTxt}>
        Resets in
        <Text style={styles.boldTxt}> 14</Text> hours{" "}
        <Text style={styles.boldTxt}>12</Text> minutes
      </Text>

      <Text style={styles.h2}>Don’t want to wait?</Text>

      <Text style={styles.h4}>Option 1: Go premium 💎</Text>
      <Text style={styles.descTxt}>
        Upgrade to our Premium Membership and unlock unlimited profiles! With
        Premium, you can discover as many potential matches as your heart
        desires.
      </Text>
      <Button
        onPress={() => navigation.navigate("Paywall")}
        title="Upgrade to premium"
        titleStyle={styles.titleStyle}
        buttonStyle={styles.buttonStyle}
      />

      <Text style={styles.h4}>Option 2: Watch a quick clip 📺</Text>
      <Text style={styles.descTxt}>
        Alternatively, watch a brief video ad and gain access to 5 more profiles
        for the day.
      </Text>
      <Button
        onPress={adPress}
        loading={adLoad}
        title="Unlock 5 profiles for free"
        titleStyle={styles.titleStyle1}
        buttonStyle={styles.buttonStyle1}
        icon={
          <FastImage
            resizeMode="contain"
            source={require("../assets/iconimages/tv.png")}
            style={styles.iconStyle}
          />
        }
      />
    </SafeAreaView>
  );
};

export default OutOfProfilesDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    paddingTop: 40,
    backgroundColor: colors.white,
  },
  h2: {
    fontSize: 24,
    color: colors.blackBlue,
    fontFamily: "Inter-Bold",
  },
  h4: {
    fontSize: 16,
    color: colors.blackBlue,
    marginVertical: "1%",
    fontFamily: "Inter-SemiBold",
  },
  resetTxt: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: "7%",
    color: colors.primaryPink,
    fontFamily: "Inter-Medium",
  },
  boldTxt: {
    fontFamily: "Inter-Bold",
  },
  descTxt: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: "9%",
    color: colors.blackBlue,
    fontFamily: "Inter-Regular",
  },
  titleStyle: {
    fontSize: 16,
    color: colors.white,
    fontFamily: "Inter-Bold",
  },
  buttonStyle: {
    padding: 14,
    borderRadius: 12,
    marginBottom: "12%",
    paddingVertical: "5%",
    backgroundColor: colors.primaryPink,
  },
  titleStyle1: {
    fontSize: 16,
    color: colors.primaryPink,
    fontFamily: "Inter-Bold",
  },
  buttonStyle1: {
    padding: 14,
    borderRadius: 12,
    marginBottom: "12%",
    paddingVertical: "5%",
    backgroundColor: colors.primaryPinkOpacity,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
});
