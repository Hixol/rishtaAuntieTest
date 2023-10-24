import React, { useState } from "react";
import { View, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PERMISSIONS } from "react-native-permissions";
import { handlePermissions } from "../../utility/regex";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-elements";
import {
  android,
  ios,
  OS_VER,
  windowHeight,
  windowWidth,
} from "../../utility/size";

import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";
import NetInfo from "@react-native-community/netinfo";
import styles from "./styles";

const WelcomeScreen = props => {
  const [connection, setConnection] = useState(false);

  const getAllPermissions = () => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        [
          PERMISSIONS.IOS.CAMERA,
          PERMISSIONS.IOS.PHOTO_LIBRARY,
          PERMISSIONS.IOS.MICROPHONE,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ],
        "",
        res => {}
      );
    } else if (android) {
      if (OS_VER >= 13) {
        handlePermissions.checkAndroid13Permissions([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]);
      } else if (OS_VER <= 10) {
        handlePermissions.checkAndroidPermissions([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);
      } else {
        handlePermissions.checkAndroidPermissions([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]);
      }
    }
  };

  const goToLogin = () => {
    if (connection) {
      props.navigation.navigate("Login");
    } else {
      Alert.alert(
        "Internet Connection!",
        "Please check your internet connection."
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllPermissions();
      const unsubscribe = NetInfo.addEventListener(state => {
        setConnection(state.isConnected);
      });

      // Unsubscribe
      return () => unsubscribe();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          height: windowHeight * 1,
          width: windowWidth * 1,
        }}
      >
        <FastImage
          style={{ width: "100%", height: "100%" }}
          source={require("../../assets/images/couple.jpg")}
        />
      </View>
      <View
        style={{
          bottom: 0,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          zIndex: 1,
          width: "100%",
          height: "55%",
          position: "absolute",
          backgroundColor: colors.white,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            marginTop: "15%",
            width: "23%",
            height: "23%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FastImage
            resizeMode="contain"
            source={require("../../assets/iconimages/logo.png")}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>
        <View style={{ marginTop: "5%" }}>
          <Button
            onPress={goToLogin}
            title="Login"
            buttonStyle={styles.btnContainer}
            titleStyle={styles.titleStyle}
          />
          <Button
            onPress={() => props.navigation.navigate("SignUp")}
            title="Get Started"
            buttonStyle={styles.btnContainer}
            titleStyle={styles.titleStyle}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default WelcomeScreen;
