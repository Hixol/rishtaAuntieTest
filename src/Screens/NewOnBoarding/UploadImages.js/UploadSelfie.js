import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera } from "react-native-image-picker";
import { ios, android, windowHeight } from "../../../utility/size";
import { alerts, handlePermissions } from "../../../utility/regex";
import { PERMISSIONS } from "react-native-permissions";
import { useDispatch, useSelector } from "react-redux";
import { useHelper } from "../../../hooks/useHelper";

import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import BottomButton from "../../../components/buttons/BottomButton";

const UploadSelfie = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const {} = useHelper();
  const {
    firstName,
    lastName,
    dob,
    gender,
    selfie,
    picture,
    video,
    religion,
    profilePictures,
  } = useSelector((store) => store.NewOnBoardingReducer);

  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [mediaOptions, setMediaOptions] = useState(false);
  const [selfieObj, setSelfieObj] = useState(null);

  useEffect(() => {
    if (selfie !== null) {
      setImageUri({
        uri: selfie?.uri,
      });
    }
  }, []);

  useEffect(() => {}, [imageUri]);

  const handleCameraMedia = async (state, result) => {
    try {
      if (result == "granted") {
        const options = {
          mediaType: "photo",
          quality: 0.4,
          cameraType: "front",
        };

        await launchCamera(options, (res) => {
          if (res.errorCode == "others") {
            alerts(
              "error",
              res.errorMessage
                ? res.errorMessage
                : "Camera support is not available on your device."
            );
          } else if (res.didCancel === true) {
          } else if (
            res?.assets[0]?.height == 0 ||
            res?.assets[0]?.width == 0
          ) {
            alerts("error", "Please select jpeg/png format images.");
          } else {
            setMediaOptions(state);
            let obj = {};
            obj = {
              name: res?.assets[0]?.fileName,
              type: res?.assets[0]?.type,
              uri: res?.assets[0]?.uri,
            };
            setSelfieObj(obj);

            setImageUri({
              uri: res?.assets[0]?.uri,
            });
          }
        });
      }
    } catch (err) {
      console.log("camera err", err);
    }
  };

  const handleCamera = (state) => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.CAMERA,
        "camera",
        (res) => {
          handleCameraMedia(state, res);
        }
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        "camera",
        (res) => {
          handleCameraMedia(state, res);
        }
      );
    }
  };

  const continuePress = () => {
    if (selfieObj || selfie) {
      dispatch({
        type: "selfie",
        payload: selfieObj === null ? selfie : selfieObj,
      });
      navigation.navigate("UploadPicture");
    } else {
      alerts("error", "Please upload Selfie");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 20, backgroundColor: colors.white }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../../../assets/iconimages/arrow-back.png")}
        />
      </TouchableOpacity>
      <View style={{ marginTop: "8%" }}>
        <Text style={styles.heading}>Profile Verification</Text>
        <Text style={styles.lightText}>
          Building trust, one selfie at a time.
        </Text>
        <View style={{ width: "100%", marginVertical: "5%" }}></View>
        {selfie === null && imageUri === null ? (
          <TouchableOpacity
            onPress={handleCamera}
            style={{
              width: "100%",
              backgroundColor: "#D9036814",
              height: windowHeight * 0.2,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: colors.primaryPink,
              borderStyle: "dashed",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FastImage
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
              source={require("../../../assets/iconimages/add-circle.png")}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleCamera}
            style={{
              width: "100%",
              height: 400,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
            }}
          >
            <View style={{ width: "100%", height: "100%", borderRadius: 20 }}>
              <FastImage
                resizeMode="cover"
                style={{ width: "100%", height: "100%", borderRadius: 20 }}
                source={{
                  uri: imageUri?.uri,
                  priority: "high",
                }}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <BottomButton loading={loading} onPress={() => continuePress()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: { fontFamily: "Inter-Bold", fontSize: 25, color: colors.black },
  lightText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    marginTop: "3%",
    color: colors.textGrey1,
  },
});

export default UploadSelfie;
