import React, { useRef, useState, useEffect, memo, useCallback } from "react";
import {
  SafeAreaView,
  FlatList,
  PermissionsAndroid,
  ActivityIndicator,
  BackHandler,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { UserService } from "../../services";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { android, userDevice, windowHeight } from "../../utility/size";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHelper } from "../../hooks/useHelper";
import { Button } from "react-native-elements";

import styles from "./styles";
import DiscoverImg from "../../components/DiscoverImg";
import colors from "../../utility/colors";
import ProfileServices from "../../services/ProfileServices";
import DiscoverSkeleton from "../../components/Skeleton/DiscoverSkeleton";
import PersonalityServices from "../../services/PersonalityServices";
import VerificationPendingCard from "../../components/Cards/VerificationPendingCard";
import BottomImageInteraction from "../../components/Modal/BottomImageInteraction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConnectyCube from "react-native-connectycube";
import CallService from "../../services/call-service";
import pushNotificationService from "../../services/PushNotificationService";
import ChatServices from "../../services/ChatServices";
import ActionCard from "../../components/Cards/ActionCard";
import ActionBottomModal from "../../components/Modal/ActionBottomModal";
import FastImage from "react-native-fast-image";
import OutOfProfilesDay from "../../components/OutOfProfilesDay";

let limit = 15;
let offset = 0;

const HomeOne = props => {
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [reverify, setReverify] = useState(false);
  const [userMediaVideo, setUserMediaVideo] = useState(null);
  const [userMediaImage, setUserMediaImage] = useState(null);
  const [profilesList, setProfilesList] = useState([]);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [remainingProfiles, setRemainingProfiles] = useState(0);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);
  const [blockAlert, setBlockAlert] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const tabBarHeight = useBottomTabBarHeight();
  const [skeleton, setSkeleton] = useState(true);
  const [index, setIndex] = useState();
  const [check, setCheck] = useState(false);
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const { handlePlayerId, handleStatusCode, Alerts } = useHelper();

  const renderOutProfiles = () => (
    <View style={styles.outContainer}>
      <Text style={styles.title}>Expand your horizons!</Text>
      <Text style={styles.description}>
        Oops! It looks like there aren't any users matching your current
        preferences. Let's tailor your experience to find your perfect match.
      </Text>
      <Button
        onPress={() => props.navigation.navigate("SearchPreferences")}
        title="Edit search preferences"
        icon={
          <FastImage
            resizeMode="contain"
            source={require("../../assets/iconimages/heart-discover.png")}
            style={styles.iconStyle}
          />
        }
        titleStyle={styles.titleStyle}
        buttonStyle={styles.buttonStyle}
      />
    </View>
  );

  const loginInChat = (token, login) => {
    const userCredentials = {
      login: login,
      password: "12345678",
    };
    ConnectyCube.createSession(userCredentials)
      .then(session => {
        handlePlayerId(token, session.id);
        ConnectyCube.chat
          .connect({
            userId: session.id,
            password: session.token,
          })
          .then(() => {
            CallService.init();
            pushNotificationService.init();
          })
          .catch(err => console.log("error: ", err));
      })
      .catch(err => console.log("createSession err:", err));
  };

  const checkUserAlreadyExist = (token, login) => {
    let obj = { login: login };
    ConnectyCube.users
      .get(obj)
      .then(res => {
        if (res?.user?.login != login) {
          createConnectyCubeSession(token, login);
        } else {
          loginInChat(token, login);
        }
      })
      .catch(err => {
        if (err?.code == 404) {
          console.log("ConnectyCube users err", err?.info?.errors[0]);
          createConnectyCubeSession(token, login);
        } else {
          console.log("ConnectyCube users err", err);
        }
      });
  };

  const connectyCubeInitialization = (token, login) => {
    ChatServices.ccCred(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let data = res.data.data;
          AsyncStorage.setItem("cred", JSON.stringify(data));
          const CREDENTIALS = {
            appId: data?.appid,
            authKey: data?.authKey,
            authSecret: data?.authSec,
          };
          const CONFIG = {
            debug: { mode: 0 },
          };
          // ConnectyCube.init(CREDENTIALS, CONFIG);
          ConnectyCube.createSession()
            .then(session => {
              checkUserAlreadyExist(token, login);
            })
            .catch(err => console.log("session", err));
        }
      })
      .catch(err => console.log("cred err:", err));
  };

  const createConnectyCubeSession = (token, login) => {
    const userProfile = {
      password: "12345678",
      phone: login,
      login: login,
    };
    ConnectyCube.createSession()
      .then(session => {
        ConnectyCube.users.signup({ ...userProfile, ...session }).then(res => {
          let userLoginCredentials = {
            login: login,
            password: "12345678",
          };
          ConnectyCube.createSession(userLoginCredentials).then(session => {
            ConnectyCube.login(userLoginCredentials)
              .then(res => {
                handlePlayerId(token, res.id);
                AsyncStorage.setItem("ccuid", `${res.id}`);
                ConnectyCube.chat
                  .connect({
                    userId: session.id,
                    password: session.token,
                  })
                  .then(() => {
                    CallService.init();
                    pushNotificationService.init();
                  })
                  .catch(err => console.log("cc chat err:", err));
              })
              .catch(err => console.log("login err", err));
          });
        });
      })
      .catch(err => console.log("createSession err:", err));
  };

  const personalityMatch = type => {
    PersonalityServices.matchPersonality(type, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: "PERSONALITY_RES",
            payload: res.data.data,
          });
        }
      })
      .catch(err => console.log("Personality match err", err));
  };

  const viewIntercation = userId => {
    UserService.viewIntercation(userId, token)
      .then(res => {
        handleStatusCode(res);
        console.log("viewIntercation res", res.data);
        if (res.status >= 200 && res.status <= 299) {
        }
      })
      .catch(err => console.log("viewIntercation err", err));
  };

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });
  const {
    token,
    status,
    swipeIndex,
    mobileNumber,
    email,
    swipeScreenIndex,
    discoverUserIndex,
    preferenceFilter,
    userData,
  } = useSelector(store => store.userReducer);
  const { religion, vibes } = useSelector(store => store.NewOnBoardingReducer);

  const isFocused = useIsFocused();
  const handleBlockAlert = state => {
    setIsBlocked(true);
    setBlockAlert(state);
  };

  const handleHomeScreen = () => {
    setAction(false);
    setIsBlocked(false);
    setBlockAlert(false);
    getAllUser(limit, offset);
  };

  const handleBlockedScreen = state => {
    props.navigation.navigate("BlockedList");
    setBlockAlert(false);
  };

  const handleReportAlert = state => {
    props.navigation.navigate("ReportAccountScreen", {
      userId: userId,
      userName: userName,
    });
    setAction(false);
  };

  const handleAlert = state => {
    setAction(state);
  };

  const handleDotsPress = useCallback(() => {
    if (isBlocked) {
      setBlockAlert(true);
    } else {
      setAction(true);
    }
  }, []);

  const getMyProfile = () => {
    if (token != null) {
      ProfileServices.getMyProfile(token)
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            let data = res?.data?.data;
            dispatch({
              type: "religion",
              payload: data?.Profile?.religion,
            });
            setReverify(data?.needToReverify);

            dispatch({
              type: "AUTH_USER_STATUS",
              payload: data?.status,
            });

            dispatch({
              type: "AUTH_USER",
              payload: data,
            });
            if (userData?.Profile?.vibes) {
              dispatch({
                type: "vibes",
                payload: userData?.Profile?.vibes,
              });
            }
          }
        })
        .catch(err => {
          if (err?.message.includes("Network")) {
            Alerts("error", err.message);
          } else {
            console.log("getMyProfile err:", err);
          }
        });
    }
  };

  const getAllUser = (limit, offset, pagination) => {
    if (
      status === "ACTIVE" ||
      status === "INCOMPLETE" ||
      status === "INACTIVE" ||
      status === "COMPLETED"
    ) {
      UserService.getAllUser(token, `limit=${limit}&offset=${offset * limit}`)
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            let data = res?.data?.data;
            if (data?.totalProfiles === 0 && data?.noOfProfilesRemaining >= 0) {
              dispatch({
                type: "AUTH_USER_SCREEN_INDEX",
                payload: false,
              });
            } else if (!swipeScreenIndex) {
              setTimeout(() => {
                dispatch({
                  type: "AUTH_USER_SCREEN_INDEX",
                  payload: true,
                });
              }, 500);
            }

            setRemainingProfiles(data?.noOfProfilesRemaining);
            setTotalProfiles(data?.totalProfiles);

            if (preferenceFilter) {
              dispatch({
                type: "SET_PREFERENCE_FILTER",
                payload: false,
              });
              setProfilesList(data?.profiles);
            } else if (!preferenceFilter && pagination) {
              setProfilesList(prevState => [...prevState, ...data?.profiles]);
            } else {
              setProfilesList(data?.profiles);
            }
          }
        })
        .catch(err => {
          if (err?.message.includes("Network")) {
            Alerts("error", err.message);
          } else {
            console.log("getAllUser err:", err);
          }
          dispatch({
            type: "AUTH_USER_SCREEN_INDEX",
            payload: false,
          });
        })
        .finally(() => {
          setLoading(false);
          setSkeleton(false);
        });
    }
  };

  let foundIndex = profilesList.findIndex(el => el.id == discoverUserIndex);

  useFocusEffect(
    useCallback(() => {
      dispatch({
        type: "SET_FOCUSED_SCREEN",
        payload: true,
      });

      if (foundIndex !== -1 && foundIndex < profilesList.length - 1) {
        setProfilesList(prevState =>
          prevState.filter(el => el.id != discoverUserIndex)
        );
      }

      dispatch({
        type: "SET_DISCOVER_INDEX",
        payload: null,
      });
    }, [foundIndex !== -1])
  );

  useFocusEffect(
    useCallback(() => {
      if (preferenceFilter) {
        offset = 0;
        getAllUser(limit, offset);
      }
    }, [preferenceFilter])
  );

  useEffect(() => {
    if (token != null && mobileNumber != "") {
      connectyCubeInitialization(token, mobileNumber);
    } else if (token != null && email != "") {
      connectyCubeInitialization(token, email);
    }

    getMyProfile();
  }, []);

  useEffect(() => {
    setSkeleton(true);

    getAllUser(limit, offset);
  }, [status]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setUserMediaImage(null);
    setUserMediaVideo(null);
    for (var i = 0; i < viewableItems?.length; i++) {
      viewableItems[i]?.item?.UserMedia?.map(item => {
        if (item?.type == "video" && item?.sequence == null) {
          setUserMediaVideo(item);
        } else if (item?.type == "image" && item?.sequence == 1) {
          setUserMediaImage(item);
        }
      });
      if (viewableItems[i]?.item?.Profile?.personalityType != null) {
        personalityMatch(viewableItems[i]?.item?.Profile?.personalityType);
      }
      setIndex(viewableItems[i].index);
      setUserId(viewableItems[i].item.id);
      setUserName(viewableItems[i].item?.firstName);
      viewIntercation(viewableItems[i].item.id);
      props.navigation.navigate("Discover", {
        enableees: swipeIndex,
        userId: viewableItems[i].item.id,
        userDetails: viewableItems[i].item,
      });
    }
  });

  useEffect(() => {
    if (imageModal || action) {
      dispatch({
        type: "AUTH_USER_SCREEN_INDEX",
        payload: false,
      });
    } else if (
      profilesList.length > 0 &&
      (imageModal == false || action == false)
    ) {
      dispatch({
        type: "AUTH_USER_SCREEN_INDEX",
        payload: true,
      });
    }
    if (android) {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
    }
  }, [imageModal, action]);

  const loadMoreData = () => {
    offset += 1;
    getAllUser(limit, offset, true);
  };

  const onMicPress = () => {
    setImageModal(true);
    setModalType("mic");
  };

  const onCommentPress = () => {
    setImageModal(true);
    setModalType("comment");
  };

  const handleBackButton = () => {
    if (imageModal || action) {
      setImageModal(false);
      setAction(false);
    } else {
      BackHandler.exitApp();
    }

    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [imageModal, action]);

  const onHeartPress = id => {
    UserService.likeInteraction(
      {
        resourceId:
          userMediaVideo !== null ? userMediaVideo?.id : userMediaImage?.id,
        resourceType: "USER_MEDIA",
        otherUserId: userId,
      },
      token
    )
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setProfilesList(prevState => prevState.filter(el => el.id !== id));

          Alerts(
            "success",
            `You Liked ${userName}'s ${
              userMediaVideo != null ? "discover video" : "picture"
            } successfully`
          );
        }
      })
      .catch(error => {
        console.log("likeInteraction err", error);
      });
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator
          color={colors.primaryPink}
          style={{ alignSelf: "center", flex: 1 }}
          size={"large"}
        />
      ) : skeleton ? (
        <DiscoverSkeleton tabBarHeight={tabBarHeight} />
      ) : totalProfiles === 0 && remainingProfiles > 0 ? (
        renderOutProfiles()
      ) : totalProfiles > 0 && remainingProfiles === 0 ? (
        <OutOfProfilesDay navigation={props.navigation} />
      ) : (
        <SafeAreaView style={styles.container}>
          {
            // (token !== null || token !== '' || token !== undefined) &&
            // status === 'COMPLETED' &&
            // reverify == false ? (
            //   // <VerificationPendingCard
            //   //   heading="Verification Pending"
            //   //   tagline="We have to ensure that there are no actual rishta aunties
            //   // here. This may take up to 24-48 hours"
            //   //   btnText="Refresh Status"
            //   //   onPress={() => {
            //   //     getAllUser(limit, offset);
            //   //     getMyProfile();
            //   //   }}
            //   // />
            // ) :
            (status === "COMPLETED" && reverify) || status == "FAILED" ? (
              <VerificationPendingCard
                heading="Re - Submit Verification"
                tagline="Please click the button below to re-submit a selfie, please make sure that you are in a well lit space. Thank you!"
                btnText="Resubmit Verification"
                onPress={() => props.navigation.navigate("SelfieVerification")}
              />
            ) : totalProfiles === 0 && remainingProfiles === 0 ? (
              <VerificationPendingCard
                heading="Upgrade to Premium Version"
                tagline="Your Profile viewing limit is reached, Please upgrade to view profiles"
                btnText="Upgrade"
                onPress={() => props.navigation.navigate("Paywall")}
              />
            ) : profilesList.length > 0 ? (
              <FlatList
                scrollEnabled={check ? false : true}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
                ref={flatListRef}
                viewabilityConfig={viewConfigRef.current}
                onViewableItemsChanged={onViewableItemsChanged.current}
                showsVerticalScrollIndicator={false}
                inverted={false}
                pagingEnabled
                initialNumToRender={1}
                snapToAlignment={"start"}
                data={profilesList}
                onEndReachedThreshold={0.5}
                onEndReached={loadMoreData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  let sortedImage = [...item?.UserMedia]
                    .filter(media => media.type != "video")
                    .sort((a, b) => a.sequence - b.sequence)[0].url;

                  return (
                    <>
                      <DiscoverImg
                        key={item?.id}
                        item={item}
                        userId={userId}
                        images={sortedImage}
                        check={check}
                        video={item?.UserMedia?.filter(el => {
                          return el?.type == "video";
                        })}
                        paused={true}
                        pausedButton={false}
                        isFocused={isFocused}
                        tabBarHeight={tabBarHeight}
                        searchPress={() =>
                          props.navigation.navigate("SearchPreferences")
                        }
                        onPressCommentInteraction={() => {
                          if (
                            status === "INACTIVE" ||
                            status === "INCOMPLETE"
                          ) {
                            setCheck(true);
                          } else {
                            onCommentPress();
                          }
                        }}
                        onPressVoiceInteraction={() =>
                          status === "INACTIVE" || status === "INCOMPLETE"
                            ? setCheck(true)
                            : onMicPress()
                        }
                        onPressLikeInteraction={() =>
                          status === "INACTIVE" || status === "INCOMPLETE"
                            ? setCheck(true)
                            : onHeartPress(item?.id)
                        }
                        onDotsPress={handleDotsPress}
                      />
                      {check ? (
                        <>
                          <View
                            style={{
                              flex: 1,
                              width: "100%",
                              height: "100%",
                              zIndex: 1,
                              position: "absolute",
                              backgroundColor: colors.black,
                              opacity: 0.8,
                            }}
                          ></View>
                          <Pressable
                            onPress={() => setCheck(false)}
                            style={{
                              flex: 1,
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              zIndex: 2,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <View
                              style={{
                                width: "90%",
                                height: 250,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: colors.white,
                                borderRadius: 16,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontFamily: "Inter-Medium",
                                  color: colors.black,
                                }}
                              >
                                Warning
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontFamily: "Inter-Regular",
                                  color: "#6B7280",
                                  marginTop: "5%",
                                  marginHorizontal: "3%",
                                }}
                              >
                                Please complete your profile to interact with
                                other users, thank you!
                              </Text>

                              <TouchableOpacity
                                onPress={() => {
                                  props.navigation.navigate(
                                    "OnBoardingQuestions"
                                  );
                                  setCheck(false);
                                }}
                                style={{
                                  width: "80%",
                                  paddingVertical: "3%",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 5,
                                  backgroundColor: colors.primaryPink,
                                  marginTop: "5%",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontFamily: "Inter-Regular",
                                    color: colors.white,
                                  }}
                                >
                                  Complete Profile
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setCheck(false);
                                }}
                                style={{
                                  width: "80%",
                                  paddingVertical: "3%",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 5,
                                  backgroundColor: colors.white,
                                  marginTop: "5%",
                                  borderWidth: 1,
                                  borderColor: colors.primaryPink,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontFamily: "Inter-Regular",
                                    color: colors.primaryPink,
                                  }}
                                >
                                  Later
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </Pressable>
                        </>
                      ) : null}
                    </>
                  );
                }}
              />
            ) : (
              <VerificationPendingCard
                heading="Search Preferences"
                tagline="Please change your search preferences and try again later!"
              />
            )
          }
          {imageModal ? (
            <GestureHandlerRootView
              style={{
                width: "100%",
                backgroundColor: "#00000061",
                height: imageModal ? windowHeight * 1 : 0,
                bottom: 0,
                position: "absolute",
                zIndex: 1,
              }}
            >
              <BottomImageInteraction
                setUserProfilesData={setProfilesList}
                userProfilesData={profilesList}
                listRef={flatListRef}
                index={index}
                userId={userId}
                userName={userName}
                userPhotosId={
                  userMediaVideo != null
                    ? userMediaVideo?.id
                    : userMediaImage?.id
                }
                userMediaVideo={userMediaVideo}
                onDismiss={() => setImageModal(false)}
                fastImage={userMediaImage != null ? userMediaImage?.url : null}
                toggle={imageModal}
                setToggle={setImageModal}
                modalType={modalType}
                offset={userDevice.includes("Pro Max") ? 75 : 70}
              />
            </GestureHandlerRootView>
          ) : null}
          {action ? (
            <ActionBottomModal
              discover
              user={{
                userId,
                userName: userName,
              }}
              showToast
              toggle={action}
              setAction={setAction}
              onDismiss={() => setAction(false)}
            />
          ) : null}
          {/* {action === true && isBlocked == false ? (
            <ActionCard
              heading={'Profile Privacy'}
              handleReportAlert={handleReportAlert}
              handleBlockAlert={handleBlockAlert}
              handleAlert={handleAlert}
              alert={action}
              userId={userId}
              showToast={true}
              userName={userName}
              tabBarHeight={tabBarHeight}
              handleBlockedScreen={handleBlockedScreen}
              isBlocked={isBlocked}
            />
          ) : blockAlert === true && isBlocked == true ? (
            <ActionCard
              heading={`You Have Blocked ${userName}`}
              handleAlert={handleAlert}
              handleBlockAlert={handleBlockAlert}
              blockAlert={false}
              tabBarHeight={tabBarHeight}
              handleBlockedScreen={handleBlockedScreen}
              userId={userId}
              handleHomeScreen={handleHomeScreen}
              isBlocked={isBlocked}
            />
          ) : null} */}
        </SafeAreaView>
      )}
    </>
  );
};
export default memo(HomeOne);
