import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { android, windowHeight, windowWidth } from "../../utility/size";
import { directory } from "../../utility/regex";
import { UserService } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { useRecorder } from "../../hooks/useRecorder";
import { useHelper } from "../../hooks/useHelper";

import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";
import config from "../../config/appConfig";
import Video from "react-native-video";
import Loader from "../Loader";

const BottomImageInteraction = props => {
  const dispatch = useDispatch();
  const { token } = useSelector(store => store.userReducer);
  const {
    Alerts,
    handleStatusCode,
    keyboardOffset,
    setKeyboardOffset,
    setOffset,
  } = useHelper();

  const [comment, setComment] = useState("");
  const [permission, setPermission] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const {
    onStartRecord,
    onPauseRecord,
    onResumeRecord,
    onStopRecord,
    onSendAudio,
    recordTime,
    recordView,
    pauseView,
    setAudioUri,
  } = useRecorder();

  let bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ["68%"], []);

  useEffect(() => {
    if (props.toggle == true) {
      bottomSheetModalRef.current?.present();
    } else if (props.toggle == false) {
      bottomSheetModalRef.current?.close();
    }
  }, [props.toggle]);

  useEffect(() => {
    setPermission(true);
    if (android) {
      directory.checkPermission().then(res => {});
      directory
        .checkAudioPermission()
        .then(res => {
          if (res) {
            directory
              .checkDirectory(config.audioPath)
              .then(res => {
                if (res) {
                } else {
                  directory
                    .makeNewDirectory(config.audioPath)
                    .then(res => {
                      if (res) {
                      }
                    })
                    .catch(err => console.log("make Dir err: ", err));
                }
              })
              .catch(err => console.log("check Dir err: ", err));
          }
        })
        .catch(err => console.log("permission Err: ", err));
    }
  }, [permission]);

  useEffect(() => {
    setOffset(props.offset);
  }, []);

  const handleSheetChanges = index => {
    index === -1 ? onStopRecord() : null;
  };

  const handleSendAudio = async () => {
    setLoader(true);
    let audioFile = await onSendAudio();

    let formData = new FormData();
    formData.append("resourceId", props?.userPhotosId);
    formData.append("resourceType", "USER_MEDIA");
    formData.append("otherUserId", props?.userId);
    formData.append("file", audioFile);

    UserService.voiceIntercation(formData, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          if (
            props?.userProfilesData != undefined &&
            props?.setUserProfilesData != undefined
          ) {
            let filteredArray = props?.userProfilesData?.filter(val => {
              if (val?.id !== props?.userId) {
                return val;
              }
            });
            props?.setUserProfilesData(filteredArray);
          }
          dispatch({
            type: "SET_DISCOVER_INDEX",
            payload: props?.userId,
          });

          Alerts(
            "success",
            `You left a voice note on ${props?.userName}'s ${
              props?.userMediaVideo != null ? "discover video" : "picture"
            } successfully`
          );
        }
      })
      .catch(err => console.log("Image voice-note err: ", err))
      .finally(() => {
        props.setToggle(false);
        setAudioUri(null);
        setLoader(false);
      });
  };

  const onSendComment = () => {
    setLoader(true);
    UserService.commentIntercation(
      {
        resourceId: props?.userPhotosId,
        resourceType: "USER_MEDIA",
        comment: comment,
        otherUserId: props?.userId,
      },
      token
    )
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          if (
            props?.userProfilesData != undefined &&
            props?.setUserProfilesData != undefined
          ) {
            let filteredArray = props?.userProfilesData?.filter(val => {
              if (val?.id !== props?.userId) {
                return val;
              }
            });
            props?.setUserProfilesData(filteredArray);
          }
          dispatch({
            type: "SET_DISCOVER_INDEX",
            payload: props?.userId,
          });

          Alerts(
            "success",
            `You commented on ${props?.userName}'s ${
              props?.userMediaVideo != null ? "discover video" : "picture"
            } successfully`
          );
        }
      })
      .catch(err => console.log("Image comment err: ", err))
      .finally(() => {
        setComment("");
        props.setToggle(false);
        setLoader(false);
      });
  };

  return (
    <View style={[styles.container, { bottom: keyboardOffset }]}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <BottomSheetModal
            onDismiss={props.onDismiss}
            backgroundStyle={{
              backgroundColor: colors.greyWhite,
            }}
            handleIndicatorStyle={{ backgroundColor: colors.primaryPink }}
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <BottomSheetScrollView
              keyboardShouldPersistTaps="handled"
              indicatorStyle="black"
              contentContainerStyle={[
                styles.contentContainer,
                { backgroundColor: colors.greyWhite },
              ]}
              showsVerticalScrollIndicator={true}
            >
              <View
                style={{
                  width: "100%",
                  height: windowHeight * 0.7,
                }}
              >
                <View
                  style={{
                    width: "98%",
                    height: "70%",
                    borderRadius: 15,
                    marginHorizontal: 20,
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {isPreloading && (
                    <Loader
                      style={{
                        position: "absolute",
                        top: "45%",
                        left: "45%",
                        zIndex: 1,
                      }}
                    />
                  )}
                  {props.userMediaVideo != null ? (
                    <Video
                      onLoadStart={() => setIsPreloading(true)}
                      onReadyForDisplay={() => setIsPreloading(false)}
                      resizeMode={"cover"}
                      repeat={true}
                      controls={true}
                      playInBackground={false}
                      playWhenInactive={false}
                      paused={true}
                      style={styles.media}
                      source={{
                        uri: props?.userMediaVideo?.url,
                      }}
                    />
                  ) : (
                    <FastImage
                      resizeMode="cover"
                      style={styles.media}
                      source={{ uri: props.fastImage }}
                    />
                  )}
                </View>

                <View
                  style={{
                    width: "90%",
                    alignSelf: "center",
                    marginTop: "5%",
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    height: "15%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: "5%",
                    flexDirection: "row",
                  }}
                >
                  {props.modalType == "comment" ? (
                    <TextInput
                      onChangeText={setComment}
                      onBlur={() => setKeyboardOffset(0)}
                      style={{
                        width: "80%",
                        fontSize: 16,
                        color: colors.blackBlue,
                        fontFamily: "Inter-Regular",
                      }}
                      placeholderTextColor={colors.vibeLightGrey}
                      placeholder="Write your comment here..."
                    />
                  ) : props.modalType == "mic" ? (
                    <>
                      {recordView ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={onStopRecord}
                            style={[
                              styles.deletePauseContainer,
                              { marginRight: 5 },
                            ]}
                          >
                            <FastImage
                              style={{
                                width: "50%",
                                height: "50%",
                              }}
                              resizeMode="contain"
                              source={require("../../assets/iconimages/delete-White.png")}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={pauseView ? onResumeRecord : onPauseRecord}
                            style={styles.deletePauseContainer}
                          >
                            <FastImage
                              style={{
                                width: pauseView ? "50%" : "40%",
                                height: pauseView ? "50%" : "40%",
                              }}
                              resizeMode="contain"
                              source={
                                pauseView
                                  ? require("../../assets/iconimages/mic.png")
                                  : require("../../assets/iconimages/pauseVoice.png")
                              }
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              marginLeft: "5%",
                              fontSize: 16,
                              color: colors.primaryBlue,
                              fontFamily: "Inter-Regular",
                            }}
                          >
                            {recordTime}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.voiceText}>
                          Leave a Voice a Note
                        </Text>
                      )}

                      <TouchableOpacity
                        onPress={recordView ? handleSendAudio : onStartRecord}
                        style={styles.micContainer}
                        disabled={loader}
                      >
                        {loader ? (
                          <ActivityIndicator
                            size={"small"}
                            color={colors.white}
                          />
                        ) : (
                          <FastImage
                            resizeMode="contain"
                            style={{ width: "60%", height: "60%" }}
                            source={
                              recordView
                                ? require("../../assets/iconimages/voiceSend.png")
                                : require("../../assets/iconimages/mic.png")
                            }
                          />
                        )}
                      </TouchableOpacity>
                    </>
                  ) : null}

                  {props.modalType == "comment" ? (
                    <TouchableOpacity
                      onPress={onSendComment}
                      disabled={loader}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50 / 2,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.primaryPink,
                      }}
                    >
                      {loader ? (
                        <ActivityIndicator
                          size={"small"}
                          color={colors.white}
                        />
                      ) : (
                        <FastImage
                          source={require("../../assets/iconimages/chat.png")}
                          style={{
                            height: "54%",
                            width: "54%",
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  media: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  bottomContainer: {
    width: windowWidth * 0.92,
    backgroundColor: colors.white,
    flexDirection: "row",
    paddingHorizontal: "5%",
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: "5%",
  },
  deletePauseContainer: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: colors.primaryPink,
    alignItems: "center",
    justifyContent: "center",
  },
  voiceText: {
    fontSize: 16,
    color: colors.vibeLightGrey,
    fontFamily: "Inter-Regular",
  },
  micContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryPink,
    borderRadius: 50 / 2,
  },
});
export default BottomImageInteraction;
