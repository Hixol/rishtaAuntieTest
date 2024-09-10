import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ios, android, windowHeight, windowWidth } from "../../../utility/size";
import { alerts, handlePermissions } from "../../../utility/regex";
import { PERMISSIONS } from "react-native-permissions";
import { useDispatch, useSelector } from "react-redux";
import { useHelper } from "../../../hooks/useHelper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { RNCamera } from "react-native-camera";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { Svg, Defs, Rect, Mask, Circle } from "react-native-svg";
import FaceDetection, {
  FaceDetectorContourMode,
  FaceDetectorLandmarkMode,
} from "react-native-face-detection";

import Icons from "../../../utility/icons";
import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import BottomButton from "../../../components/buttons/BottomButton";
import ProfileServices from "../../../services/ProfileServices";
import analytics from "@react-native-firebase/analytics";

const UploadSelfie = ({ reverify, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { handleStatusCode } = useHelper();
  const { token } = useSelector(store => store.userReducer);
  const { selfie } = useSelector(store => store.NewOnBoardingReducer);
  const navigation = useNavigation();
  const FDOptions = {
    landmarkMode: FaceDetectorLandmarkMode.ALL,
    contourMode: FaceDetectorContourMode.ALL,
    rotation: 0,
    cameraOrientation: "landscapeRight",
  };

  const cameraRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);
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

  // const handleUploadSelfie = async () => {
  //   try {
  //     if (selfieObj == null) {
  //       alerts("error", "Please upload selfie.");
  //     } else {
  //       // Log the start of the selfie upload process
  //       await analytics().logEvent('start_selfie_upload', {
  //         description: 'User started selfie upload process',
  //       });

  //       let formData = new FormData();
  //       formData.append("verificationPicture", selfieObj);

  //       ProfileServices.updateProfile(formData, token)
  //         .then(async res => {
  //           handleStatusCode(res);
  //           if (res.data.status >= 200 && res.data.status <= 299) {
  //             dispatch({
  //               type: "AUTH_USER",
  //               payload: res.data.data.user,
  //             });

  //             // Log successful selfie upload
  //             await analytics().logEvent('selfie_upload_success', {
  //               description: 'Selfie uploaded successfully',
  //               userId: res.data.data.user.id || 'unknown',
  //             });

  //             setSelfieObj(null);
  //             alerts("success", res.data.message);
  //           }
  //         })
  //         .catch(async err => {
  //           // Log the error if selfie upload fails
  //           await analytics().logEvent('selfie_upload_failure', {
  //             description: 'Failed to upload selfie',
  //             error: err.message,
  //           });
  //           alerts("error", err?.message.toString());
  //         });
  //     }
  //   } catch (error) {
  //     console.error("Error during selfie upload process:", error);
  //     // Log any unexpected errors
  //     await analytics().logEvent('selfie_upload_failure', {
  //       description: 'Unexpected error during selfie upload process',
  //       error: error.message,
  //     });
  //   }
  // };

  const handleUploadSelfie = async () => {
    try {
      if (selfieObj == null) {
        alerts("error", "Please upload selfie.");
      } else {
        // Log the start of the selfie upload process
        await analytics().logEvent("start_selfie_upload", {
          description: "User started selfie upload process",
        });

        let formData = new FormData();
        formData.append("verificationPicture", selfieObj);

        ProfileServices.updateProfile(formData, token)
          .then(async res => {
            handleStatusCode(res);
            if (res.data.status >= 200 && res.data.status <= 299) {
              dispatch({
                type: "AUTH_USER",
                payload: res.data.data.user,
              });

              // Log successful selfie upload
              await analytics().logEvent("selfie_upload_success", {
                description: "Selfie uploaded successfully",
                userId: res.data.data.user.id || "unknown",
              });

              setSelfieObj(null);
              alerts("success", res.data.message);

              // Navigate to HomeOne after successful selfie upload
              navigation.navigate("HomeOne");
            }
          })
          .catch(async err => {
            // Log the error if selfie upload fails
            await analytics().logEvent("selfie_upload_failure", {
              description: "Failed to upload selfie",
              error: err.message,
            });
            alerts("error", err?.message.toString());
          });
      }
    } catch (error) {
      console.error("Error during selfie upload process:", error);
      // Log any unexpected errors
      await analytics().logEvent("selfie_upload_failure", {
        description: "Unexpected error during selfie upload process",
        error: error.message,
      });
    }
  };
  useEffect(() => {
    if (reverify) {
      handleUploadSelfie(); // Automatically start upload if reverify is true
    }
  }, [reverify]);
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
  console.log("FFFFFFF", reverify);

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
          <Pressable onPressIn={handleCameraMode} style={styles.retake}>
            <FastImage
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
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
      <TouchableOpacity onPress={() => navigation.navigate("HomeOne")}>
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../../../assets/iconimages/arrow-back.png")}
        />
      </TouchableOpacity>
      {reverify ? null : (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FastImage
            resizeMode="contain"
            style={{ width: 20, height: 30 }}
            source={require("../../../assets/iconimages/arrow-back.png")}
          />
        </TouchableOpacity>
      )}
      <View style={{ marginTop: "8%" }}>
        <Text style={styles.heading}>
          {reverify
            ? "Profile reverification required"
            : "Profile Verification"}
        </Text>
        <Text style={styles.lightText}>
          {reverify
            ? "Please resubmit a selfie so that your profile can be verified."
            : "Building trust, one selfie at a time."}
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
      {reverify ? (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUploadSelfie}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      ) : (
        <BottomButton onPress={() => continuePress()} />
      )}
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
  submitButton: {
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
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "Inter-Bold",
  },
});
