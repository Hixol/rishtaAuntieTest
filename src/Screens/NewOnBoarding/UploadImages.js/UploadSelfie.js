import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera } from "react-native-image-picker";
import { ios, android, windowHeight, windowWidth } from "../../../utility/size";
import { alerts, handlePermissions } from "../../../utility/regex";
import { PERMISSIONS } from "react-native-permissions";
import { useDispatch, useSelector } from "react-redux";
import { useHelper } from "../../../hooks/useHelper";
import { useIsFocused } from "@react-navigation/native";
import { RNCamera } from "react-native-camera";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import FaceDetection, {
  FaceDetectorContourMode,
  FaceDetectorLandmarkMode,
} from "react-native-face-detection";

import Icons from "../../../utility/icons";
import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import BottomButton from "../../../components/buttons/BottomButton";
import { Svg, Defs, Rect, Mask, Circle } from "react-native-svg";

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
  } = useSelector(store => store.NewOnBoardingReducer);

  const isFocused = useIsFocused();

  const FDOptions = {
    landmarkMode: FaceDetectorLandmarkMode.ALL,
    contourMode: FaceDetectorContourMode.ALL,
    rotation: 0,
    cameraOrientation: "landscapeRight",
  };

  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [mediaOptions, setMediaOptions] = useState(false);
  const [selfieObj, setSelfieObj] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [flashMode, setFlashMode] = useState("off");
  const [cameraMode, setCameraMode] = useState("front");
  const devices = useCameraDevices();
  const device = devices[cameraMode];

  const OvalMask = () => (
    <Svg height="100%" width="100%" style={{ position: "absolute" }}>
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Circle
            r="19.7%"
            cx="50%"
            cy={ios ? "30%" : "27%"}
            fill="black"
            scaleY={1.2}
            strokeWidth={2}
            stroke={colors.textGrey1}
          />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(97, 16, 65, 0.3)"
        mask="url(#mask)"
        fill-opacity="0"
      />
    </Svg>
  );

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

        await launchCamera(options, res => {
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

  const handleCamera = state => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.CAMERA,
        "camera",
        res => {
          setSelfieObj(null);
          setShowCamera(true);
        }
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        "camera",
        res => {
          setSelfieObj(null);
          setShowCamera(true);
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

  const handleCapture = async () => {
    if (cameraRef !== null) {
      try {
        const RNOptions = {
          mirrorImage: true,
          width: windowWidth,
          quality: 0.5,
          fixOrientation: true,
        };

        if (ios) {
          const image = await cameraRef.current?.takePictureAsync(RNOptions);
          const faces = await FaceDetection.processImage(image.uri, FDOptions);

          if (faces.length > 0) {
            let obj = {
              name: image.uri.split("/").pop(),
              type: `image/${image.uri.split(".").pop()}`,
              uri: image.uri,
            };

            setSelfieObj(obj);
            setImageUri({
              uri: image.uri,
            });
            setShowCamera(false);
          } else {
            alerts("error", "No face detected");
          }
        } else {
          const image = await cameraRef.current?.takePhoto();
          const faces = await FaceDetection.processImage(image.path, FDOptions);

          if (faces.length > 0) {
            let obj = {
              name: image.path.split("/").pop(),
              type: `image/${image.path.split(".").pop()}`,
              uri: `file://${image.path}`,
            };

            setSelfieObj(obj);
            setImageUri({
              uri: `file://${image.path}`,
            });
            setShowCamera(false);
          } else {
            alerts("error", "No face detected");
          }
        }
      } catch (err) {
        console.log("handleCapture err: ", err);
      }
    }
  };

  const handleFlashMode = () => {
    if (ios && flashMode == "off") {
      setFlashMode("torch");
    } else if (ios && flashMode == "torch") {
      setFlashMode("off");
    } else if (flashMode == "on") {
      setFlashMode("off");
    } else setFlashMode("on");
  };

  const handleCameraMode = () => {
    if (cameraMode == "front") setCameraMode("back");
    else if (cameraMode == "back") setCameraMode("front");
  };

  const handleRetake = () => setSelfieObj(null);

  return cameraRef != null && showCamera ? (
    <View style={styles.cameraBg}>
      {selfieObj ? (
        <FastImage
          source={{ uri: selfieObj.uri }}
          resizeMode="cover"
          style={styles.camera}
        />
      ) : ios ? (
        <>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            autoFocus="on"
            type={cameraMode}
            captureAudio={false}
            flashMode={flashMode}
          >
            <OvalMask />
          </RNCamera>
        </>
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={isFocused}
            photo={true}
            video={false}
            audio={false}
            torch={flashMode}
            frameProcessorFps={5}
          />
          <OvalMask />
        </>
      )}

      <Icons.Ionicons
        onPress={() => setShowCamera(false)}
        name="close"
        size={30}
        color={colors.white}
        style={styles.closeIcon}
      />

      <View style={styles.bottomContainer}>
        {/* <Pressable onPressIn={handleFlashMode}>
          <FastImage
            style={styles.featureIcons}
            resizeMode="contain"
            source={require("../../../assets/iconimages/flash.png")}
          />
        </Pressable> */}

        <Pressable onPress={handleCapture} style={styles.captureBtnBorder}>
          <Pressable onPress={handleCapture} style={styles.captureBtn} />
        </Pressable>

        {/* {selfieObj ? (
          <Pressable onPressIn={handleRetake} style={styles.retake}>
            <Icons.MaterialCommunityIcons
              name="camera-retake"
              size={22}
              color={colors.blackBlue}
            />
          </Pressable>
        ) : (
          <Pressable onPressIn={handleCameraMode}>
            <FastImage
              style={styles.featureIcons}
              resizeMode="contain"
              source={require("../../../assets/iconimages/retake.png")}
            />
          </Pressable>
        )} */}
      </View>
    </View>
  ) : (
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
              width: "80%",
              height: "70%",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <FastImage
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
              source={{
                uri: imageUri?.uri,
                priority: "high",
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <BottomButton loading={loading} onPress={() => continuePress()} />
    </SafeAreaView>
  );
};

export default UploadSelfie;

const styles = StyleSheet.create({
  heading: { fontFamily: "Inter-Bold", fontSize: 25, color: colors.black },
  lightText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    marginTop: "3%",
    color: colors.textGrey1,
  },
  cameraBg: {
    flex: 1,
    backgroundColor: colors.pinkPurple,
  },
  oval: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 280 / 2,
    overflow: "hidden",
    top: windowHeight * 0.23,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: colors.textGrey1,
    transform: [{ scaleY: 1.2 }],
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  closeIcon: {
    position: "absolute",
    top: ios ? 80 : 50,
    left: 24,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  featureIcons: {
    width: windowWidth * 0.1 + 13,
    height: windowWidth * 0.1 + 13,
  },
  captureBtnBorder: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 100 / 2,
  },
  captureBtn: {
    margin: 5,
    width: windowWidth * 0.15 + 3,
    height: windowWidth * 0.15 + 3,
    borderRadius: windowWidth * 0.15 + 3 / 2,
    backgroundColor: colors.primaryPink,
  },
  retake: {
    width: windowWidth * 0.1 + 13,
    height: windowWidth * 0.1 + 13,
    borderRadius: windowWidth * 0.1 + 13 / 2,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
});
