import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { OS_VER, android, ios, windowHeight } from "../../../utility/size";
import { alerts, handlePermissions } from "../../../utility/regex";
import { PERMISSIONS } from "react-native-permissions";
import { useDispatch, useSelector } from "react-redux";
import { useHelper } from "../../../hooks/useHelper";
import { OnBoardingServices, UserService } from "../../../services";

import moment from "moment";
import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import ImagePicker from "react-native-image-crop-picker";
import BottomButton from "../../../components/buttons/BottomButton";
import ActionCard from "../../../components/Cards/ActionCard";
import Video from "react-native-video";
import Countries from "../../../assets/countryLists/Countries";
import DeviceInfo from "react-native-device-info";
import * as Progress from "react-native-progress";
const UploadVideo = ({ navigation, route }) => {
  const edit = route?.params;

  const dispatch = useDispatch();
  const { handleLocation, Alerts, handleStatusCode } = useHelper();
  const { coords } = useSelector(store => store.chatReducer);
  const { userData, token } = useSelector(store => store.userReducer);
  const {
    firstName,
    lastName,
    dob,
    gender,
    selfie,
    video,
    religion,
    profilePictures,
  } = useSelector(store => store.NewOnBoardingReducer);

  const [videoUri, setVideoUri] = useState(null);
  const [mediaOptions, setMediaOptions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [videoObj, setVideoObj] = useState(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isPausedButton, setIsPausedButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (edit) {
      let find = userData?.UserMedia.filter(item => {
        return item?.type === "video";
      });
      setVideoUri({
        uri: find[0]?.url?.split("?")[0],
      });
      console.log("URLLL", find);
    } else {
      console.log("VIDEOOO", video);
      console.log("VideoObj", videoObj);
      dispatch({
        type: "routeName",
        payload: route?.name,
      });
      if (video === null) {
        setVideoUri(null);
      } else if (video !== null) {
        setVideoUri({
          uri: video?.uri,
        });
      } else {
        setVideoUri({
          uri: videoObj?.uri,
        });
      }
    }
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 1) {
        setProgress(progress + 0.1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [progress]);

  const handleCameraMedia = async (state, result) => {
    try {
      if (result == "granted") {
        const options = {
          mediaType: "video",
          videoQuality: "high",
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
            let videoSize = res?.assets[0]?.fileSize / 1000000;

            if (videoSize <= 100) {
              obj = {
                name: res?.assets[0]?.fileName,
                type: res?.assets[0]?.type,
                uri: res?.assets[0]?.uri,
              };
              dispatch({
                type: "video",
                payload: obj,
              });
              setVideoObj(obj);

              setVideoUri({
                uri: res?.assets[0]?.uri,
              });
            } else {
              alerts("error", "Please upload video of 100mb or less");
            }
          }
        })
          .catch(() => {})
          .finally(() => {
            setShowAlert(false);
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
          handleCameraMedia(state, res);
        }
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        "camera",
        res => {
          handleCameraMedia(state, res);
        }
      );
    }
  };

  const handleSkipNow = async () => {
    setLoading(true);
    if (coords.city == "" && coords.state == "" && coords.country == "") {
      alerts(
        "error",
        "Please enable location and open google maps to sync location!"
      );
      handleLocation();
      setLoading(false);
    } else {
      setLoading(true);
      handleLocation();

      let code = Countries.filter(item => {
        return item?.en === coords?.country;
      });
      code = code[0]?.dialCode;

      let versionCode = DeviceInfo.getVersion();
      let userDevice = DeviceInfo.getModel();
      let OSVersion = DeviceInfo.getSystemVersion();
      let OSName = android ? `Android ${OSVersion}` : `iOS ${OSVersion}`;

      let formData = new FormData();
      formData.append("versionCode", versionCode);
      formData.append("userDevice", userDevice);
      formData.append("OSVersion", OSVersion);
      formData.append("OSName", OSName);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("dob", moment(dob).format("YYYY-MM-DD"));
      formData.append("longitude", coords.lat);
      formData.append("latitude", coords.lng);
      formData.append("city", coords.city);
      formData.append("country", coords.country);
      formData.append("countryCode", code);
      formData.append("address", coords.state);
      formData.append("gender", gender);
      formData.append("religion", religion?.name);
      formData.append("verificationPicture", selfie);

      profilePictures.map((x, index) => {
        if (x?.image) {
          formData.append(`profilePic${index + 1}`, {
            name: x?.image?.name,
            type: x?.image.type,
            uri: x?.image?.uri,
          });
        }
      });

      if (token !== null) {
        setLoading(true);
        UserService.createNewProfile(formData, token)
          .then(res => {
            console.log("Profile", res.data);
            console.log("FormData", formData);
            handleStatusCode(res);
            if (res.status >= 200 && res.status <= 299) {
              clearNewRedux();
              Alerts("success", res?.data?.message);

              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "BottomTab" }],
                })
              );
            }
          })
          .catch(e => {
            console.log("createNewProfile err", e);
            Alerts("error", e?.message.toString());
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
        alerts("error", "Please upload video to continue");
      }
    }
  };

  const continuePress = async () => {
    if (edit && videoUri != null) {
      setLoading(true);

      const formData1 = new URLSearchParams();
      formData1.append("mediaName", video.name);
      formData1.append("mediaType", "video/mp4");

      OnBoardingServices.getPresignedUrl(formData1, token)
        .then(async res => {
          handleStatusCode(res);
          console.log("RESPONSE>>>", res);
          if (res.status >= 200 && res.status <= 299) {
            const responseData = res.data;
            const { url, key } = responseData.data;
            const baseUrl = url.split("?")[0]; // Get the base URL
            alerts("success", res.data.message);

            const videoFileUri = video.uri;
            const videoFile = await fetch(videoFileUri);
            const videoBlob = await videoFile.blob();

            const uploadResponse = await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": "video/mp4",
              },
              body: videoBlob,
            });

            if (uploadResponse.ok) {
              // Video uploaded successfully, now inform the backend API
              const backendPayload = {
                videoUrl: baseUrl, // Send the base URL to the backend
              };
              // Handle the response of the PUT request here if needed
              // Once the video is uploaded successfully, notify the backend API
              OnBoardingServices.uploadVideo(backendPayload, token)
                .then(res => {
                  handleStatusCode(res);
                  if (res.status >= 200 && res.status <= 299) {
                    let copy = JSON.parse(JSON.stringify(userData));
                    copy.UserMedia = copy.UserMedia.map(el => {
                      if (el.type == "video") {
                        return {
                          ...el,
                          url: res.data.data,
                        };
                      } else {
                        return el;
                      }
                    });

                    dispatch({
                      type: "AUTH_USER",
                      payload: copy,
                    });

                    dispatch({
                      type: "SET_VIDEO_FLAG",
                      payload: true,
                    });
                    alerts("success", res.data.message);
                  }
                })
                .catch(e => console.log("uploadVideo err", e))
                .finally(() => {
                  setLoading(false);
                  navigation.goBack();
                });
            }
          }
        })
        .catch(err => {
          console.error("Error:", err);
        });
    } else {
      if (videoObj !== null || video !== null) {
        setIsPaused(true);
        if (coords.city == "" && coords.state == "" && coords.country == "") {
          alerts(
            "error",
            "Please enable location and open google maps to sync location!"
          );
          handleLocation();
        } else {
          setLoading(true);
          handleLocation();

          let code = Countries.filter(item => {
            return item?.en === coords?.country;
          });
          code = code[0]?.dialCode;
          // Step 1: Get pre-signed URL from backend
          const formData1 = new URLSearchParams();
          formData1.append("mediaName", video.name);
          formData1.append("mediaType", "video/mp4");

          OnBoardingServices.getPresignedUrl(formData1, token)
            .then(async res => {
              handleStatusCode(res);
              if (res.status >= 200 && res.status <= 299) {
                const responseData = res.data;
                const { url } = responseData.data;
                const baseUrl = url.split("?")[0]; // Get the base URL
                console.log("Url Response", baseUrl);
                alerts("success", res.data.message);
                // Step 2: Upload video to the signed URL
                const videoFileUri = video.uri;
                const videoFile = await fetch(videoFileUri);
                const videoBlob = await videoFile.blob();

                const uploadResponse = await fetch(url, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "video/mp4",
                  },
                  body: videoBlob,
                });

                if (uploadResponse.ok) {
                  // Step 3: Inform backend API after successful upload
                  const backendPayload = {
                    videoUrl: baseUrl, // Send the base URL to the backend
                  };
                  console.log("BackendPayload", backendPayload);
                  OnBoardingServices.uploadVideo(backendPayload, token)
                    .then(res => {
                      handleStatusCode(res);
                      if (res.status >= 200 && res.status <= 299) {
                        dispatch({
                          type: "SET_VIDEO_FLAG",
                          payload: true,
                        });
                        alerts("success", res.data.message);

                        let versionCode = DeviceInfo.getVersion();
                        let userDevice = DeviceInfo.getModel();
                        let OSVersion = DeviceInfo.getSystemVersion();
                        let OSName = android
                          ? `Android ${OSVersion}`
                          : `iOS ${OSVersion}`;

                        let formData = new FormData();
                        formData.append("versionCode", versionCode);
                        formData.append("userDevice", userDevice);
                        formData.append("OSVersion", OSVersion);
                        formData.append("OSName", OSName);
                        formData.append("firstName", firstName);
                        formData.append("lastName", lastName);
                        formData.append(
                          "dob",
                          moment(dob).format("YYYY-MM-DD")
                        );
                        formData.append("longitude", coords.lat);
                        formData.append("latitude", coords.lng);
                        formData.append("city", coords.city);
                        formData.append("country", coords.country);
                        formData.append("countryCode", code);
                        formData.append("address", coords.state);
                        formData.append("gender", gender);
                        formData.append("religion", religion?.name);
                        formData.append("verificationPicture", selfie);

                        profilePictures.map((x, index) => {
                          if (x?.image) {
                            formData.append(`profilePic${index + 1}`, {
                              name: x?.image?.name,
                              type: x?.image.type,
                              uri: x?.image?.uri,
                            });
                          }
                        });

                        if (token !== null) {
                          setLoading(true);
                          UserService.createNewProfile(formData, token)
                            .then(res => {
                              handleStatusCode(res);
                              if (res.status >= 200 && res.status <= 299) {
                                clearNewRedux();
                                Alerts("success", res?.data?.message);

                                navigation.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: "BottomTab" }],
                                  })
                                );
                              }
                            })
                            .catch(e => {
                              console.log("createNewProfile err", e);
                              Alerts("error", e?.message.toString());
                            })
                            .finally(() => setLoading(false));
                        } else {
                          setLoading(false);
                          alerts("error", "Please upload video to continue");
                        }
                      }
                    })
                    .catch(err => {
                      console.error("Error adding intro video:", err);
                      alerts("error", "Error adding intro video");
                    })
                    .finally(() => setLoading(false));
                } else {
                  alerts("error", "Failed to upload video");
                  setLoading(false);
                }
              } else {
                alerts("error", "Failed to get pre-signed URL");
                setLoading(false);
              }
            })
            .catch(err => {
              console.error("Error getting pre-signed URL:", err);
              setLoading(false);
              alerts("error", "Failed to get pre-signed URL");
            });
        }
      } else {
        setShowAlert(true);
      }
    }
  };

  const handleGalleryMedia = async (state, result) => {
    try {
      if (result === "granted") {
        await launchImageLibrary(
          { mediaType: "video", videoQuality: "low", quality: 0.4 },
          res => {
            if (res.errorCode === "others") {
              alerts(
                "error",
                res.errorMessage
                  ? res.errorMessage
                  : "Camera support is not available on your device."
              );
            } else if (!res.didCancel) {
              if (res.assets[0].height === 0 || res.assets[0].width === 0) {
                alerts("error", "Please select jpeg/png format images.");
              } else {
                setMediaOptions(state);
                const videoSize = res.assets[0].fileSize / 1000000;
                if (videoSize <= 100) {
                  const obj = {
                    name: res.assets[0].fileName,
                    type: res.assets[0].type,
                    uri: res.assets[0].uri,
                  };
                  dispatch({
                    type: "video",
                    payload: obj,
                  });
                  setVideoObj(obj);
                  setVideoUri({
                    uri: res.assets[0].uri,
                  });
                } else {
                  alerts("error", "Please upload video of 100mb or less");
                }
              }
            }
          }
        ).finally(() => {
          setShowAlert(false);
        });
      }
    } catch (err) {
      console.log("gallery err", err);
    }
  };

  const handleGallery = state => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        "gallery",
        res => {
          handleGalleryMedia(state, res);
        }
      );
    } else if (android) {
      if (OS_VER >= 13) {
        handleGalleryMedia(state, "granted");
      } else {
        handlePermissions.checkMultiplePermissions(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          "gallery",
          res => {
            handleGalleryMedia(state, res);
          }
        );
      }
    }
  };
  const handleAlert = state => {
    setMediaOptions(state);
  };

  const handleRemoveImage = () => {
    dispatch({
      type: "video",
      payload: null,
    });
    setVideoObj(null);
    setVideoUri(null);
    setShowAlert(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsPausedButton(false);
    }, 2000);
  });

  const clearNewRedux = (flag = false) => {
    dispatch({
      type: "firstName",
      payload: "",
    });
    dispatch({
      type: "lastName",
      payload: "",
    });
    dispatch({
      type: "dob",
      payload: null,
    });
    dispatch({
      type: "gender",
      payload: "",
    });
    dispatch({
      type: "selfie",
      payload: null,
    });
    dispatch({
      type: "picture",
      payload: null,
    });
    dispatch({
      type: "video",
      payload: null,
    });

    dispatch({
      type: "profilePictures",
      payload: [],
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 20, backgroundColor: colors.white }}
    >
      <ActionCard
        videoUpload
        handleCloseAlert={() => setShowAlert(false)}
        isImageAct={true}
        heading={"Choose an Action"}
        handleGallery={handleGallery}
        handleCamera={handleCamera}
        handleAlert={handleAlert}
        handleRemoveImage={handleRemoveImage}
        // handleSkipNow={handleSkipNow}
        // showSkipButton={true} // Add this line
        alert={showAlert}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../../../assets/iconimages/arrow-back.png")}
        />
      </TouchableOpacity>

      <View style={{ marginTop: "8%" }}>
        <Text style={styles.heading}>
          {video === null && videoUri === null
            ? "Let your video do the talking"
            : "Video reveal"}
        </Text>
        <Text style={styles.lightText}>
          {video === null && videoUri === null
            ? "Your chance to shine in seconds, with likes, comments, and voice notes."
            : "Watch yourself shine."}
        </Text>
        <View style={{ width: "100%", marginVertical: "5%" }}></View>
        {video === null && videoUri === null ? (
          // <TouchableOpacity
          //   onPress={() => setShowAlert(true)}
          //   style={{
          //     width: '100%',
          //     backgroundColor: '#D9036814',
          //     height: height * 0.2,
          //     borderRadius: 5,
          //     borderWidth: 1,
          //     borderColor: colors.primaryPink,
          //     borderStyle: 'dashed',
          //     alignItems: 'center',
          //     justifyContent: 'center',
          //   }}>
          //   <FastImage
          //     resizeMode="contain"
          //     style={{width: 30, height: 30}}
          //     source={require('../../../assets/iconimages/add-circle.png')}
          //   />
          // </TouchableOpacity>
          <>
            {/* <AutoScroll style={{width: width * 1.2}} duration={5000}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  width: width * 1.2,
                }}>
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '25%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '25%',
                    height: 200,
                    borderRadius: 20,
                    marginTop: 30,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '25%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '25%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
              </View>
            </AutoScroll>
            <AutoScroll style={{width: width * 1}} isLTR={true} duration={5000}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  width: width * 1,
                }}>
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '30%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '30%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '30%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
              </View>
            </AutoScroll> */}

            <Video
              // onLoadStart={() => setIsPreloading(true)}
              resizeMode={"cover"}
              repeat={true}
              // onReadyForDisplay={() => setIsPreloading(false)}
              // playInBackground={false}
              // playWhenInactive={false}
              paused={showAlert}
              style={{
                alignSelf: "center",
                width: "120%",
                height: windowHeight * 0.5,
              }}
              // poster={require('../../../assets/images/discovervideo.mp4')}
              source={require("../../../assets/images/discovervideo1.mp4")}
            />
          </>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setIsPaused(!isPaused);
              setIsPausedButton(true);
            }}
            style={{
              width: "100%",
              height: windowHeight * 0.5,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
            }}
          >
            <Video
              onLoadStart={() => setIsPreloading(true)}
              resizeMode={"cover"}
              repeat={true}
              onReadyForDisplay={() => setIsPreloading(false)}
              playInBackground={false}
              playWhenInactive={false}
              paused={isPaused}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 20,
              }}
              poster={video?.uri}
              source={{
                uri: videoUri !== null ? videoUri?.uri : video?.uri,
              }}
            />
            {isPaused === false && isPausedButton === false ? null : (
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  height: 10,
                  zIndex: 1,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FastImage
                  resizeMode="contain"
                  style={{ width: 60, height: 60 }}
                  source={
                    isPausedButton === true && isPaused == false
                      ? require("../../../assets/iconimages/pause.png")
                      : isPausedButton == true && isPaused == true
                      ? require("../../../assets/iconimages/play.png")
                      : isPausedButton == false && isPaused == true
                      ? require("../../../assets/iconimages/play.png")
                      : null
                  }
                />
              </View>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setShowAlert(true)}
          style={{
            width: "80%",
            padding: "5%",
            flexDirection: "row",
            alignItems: "center",
            // borderRadius: 5,
            // alignItems: 'center',
            // justifyContent: 'center',
            // alignSelf: 'flex-end',
            // backgroundColor: colors.primaryBlue,
            // marginVertical: '5%',
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#6B7280",
              fontFamily: "Inter-Medium",
            }}
          >
            {videoUri === null ? null : "Change Video"}
          </Text>
          {videoUri === null ? null : (
            <FastImage
              style={{ width: 15, height: 15, marginLeft: "3%" }}
              resizeMode="contain"
              source={require("../../../assets/iconimages/editt.png")}
            />
          )}
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D90368" />
          <Text style={styles.uploadingText}>Uploading...</Text>
          <View style={styles.progressBar}>
            <Progress.Bar
              progress={progress}
              width={200}
              height={300}
              color="#D90368"
              borderWidth={0}
              animated={true}
            />
          </View>
        </View>
      )}
      <View
        style={{
          top: 55,
        }}
      >
        <BottomButton
          loading={loading}
          text={
            edit && videoUri
              ? "Update"
              : videoObj || video
              ? "View profiles now"
              : "Upload your discover video"
          }
          onPress={() => continuePress()}
        />
      </View>
      <View
        style={{
          width: "90%",
          paddingVertical: "5%",
          borderRadius: 10,
          backgroundColor: "#FDEDF1",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          borderColor: "#F9B5C6",
          position: "absolute",
          alignSelf: "center",
          bottom: 20,
        }}
      >
        <TouchableOpacity onPress={() => handleSkipNow()}>
          <Text
            style={{
              fontSize: 15,
              color: "#EF4770",
              fontFamily: "Inter-Medium",
            }}
          >
            Use my picture instead
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: { fontFamily: "Inter-Bold", fontSize: 25, color: colors.black },
  lightText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    marginTop: "3%",
    color: colors.textGrey,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    right: 0,
  },
  uploadingText: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "500",
  },
  progressBar: {
    marginTop: 20,
    width: "80%",
    height: 10,
    backgroundColor: "#ffff",
    borderRadius: 15,
    overflow: "hidden",
  },
});

export default UploadVideo;
