import React, {
  useRef,
  useState,
  useEffect,
  memo,
  useCallback,
  useReducer,
} from "react";
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
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { UserService } from "../../services";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { android, ios, userDevice, windowHeight } from "../../utility/size";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHelper } from "../../hooks/useHelper";
import { Button } from "react-native-elements";
import {
  TestIds,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

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
import ActionBottomModal from "../../components/Modal/ActionBottomModal";
import FastImage from "react-native-fast-image";
import OutOfProfilesDay from "../../components/OutOfProfilesDay";
import UploadSelfie from "../NewOnBoarding/UploadImages.js/UploadSelfie";
// import FeedbackModal from "../../components/Modal/FeedBackModal";
import analytics from '@react-native-firebase/analytics'
let limit = 15;
let offset = 0;
// let profileIds = [];

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : ios
  ? "ca-app-pub-8950919464657693/6439625116"
  : "ca-app-pub-8950919464657693/2927384385";

const admob = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const initialState = {
  userId: undefined,
  userName: undefined,
  reverify: false,
  userMediaVideo: null,
  userMediaImage: null,
  profilesList: [],
  totalProfiles: 0,
  remainingProfiles: 0,
  action: false,
  blockAlert: false,
  isBlocked: false,
  imageModal: false,
  modalType: "",
  skeleton: false,
  index: undefined,
  check: false,
  loaded: false,
  adLoad: false,
  // isModalVisible: false,
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    // case "SHOW_MODAL":
    //   return { ...state, isModalVisible: true };
    // case "HIDE_MODAL":
    //   return { ...state, isModalVisible: false };

    // case "SKIP_MODAL":
    //   // Handle the case when the user skips the modal
    //   // You might want to save the skip time in local storage
    //   AsyncStorage.setItem("lastSkipped", new Date().toISOString());
    //   return { ...state, isModalVisible: false };
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    case "SET_USER_NAME":
      return { ...state, userName: action.payload };
    case "SET_REVERIFY":
      return { ...state, reverify: action.payload };
    case "SET_USER_MEDIA_VIDEO":
      return { ...state, userMediaVideo: action.payload };
    case "SET_USER_MEDIA_IMAGE":
      return { ...state, userMediaImage: action.payload };
    case "SET_PROFILES_LIST":
      return { ...state, profilesList: action.payload };
    case "SET_TOTAL_PROFILES":
      return { ...state, totalProfiles: action.payload };
    case "SET_REMAINING_PROFILES":
      return { ...state, remainingProfiles: action.payload };
    case "SET_ACTION":
      return { ...state, action: action.payload };
    case "SET_BLOCK_ALERT":
      return { ...state, blockAlert: action.payload };
    case "SET_IS_BLOCKED":
      return { ...state, isBlocked: action.payload };
    case "SET_IMAGE_MODAL":
      return { ...state, imageModal: action.payload };
    case "SET_MODAL_TYPE":
      return { ...state, modalType: action.payload };
    case "SET_SKELETON":
      return { ...state, skeleton: action.payload };
    case "SET_INDEX":
      return { ...state, index: action.payload };
    case "SET_CHECK":
      return { ...state, check: action.payload };
    case "SET_LOADED":
      return { ...state, loaded: action.payload };
    case "SET_AD_LOAD":
      return { ...state, adLoad: action.payload };
    default:
      return state;
  }
}

const HomeOne = props => {
  const [state1, dispatch1] = useReducer(reducer, initialState);

  const {
    userId,
    userName,
    reverify,
    userMediaVideo,
    userMediaImage,
    profilesList,
    totalProfiles,
    remainingProfiles,
    action,
    blockAlert,
    isBlocked,
    imageModal,
    modalType,
    skeleton,
    index,
    check,
    loaded,
    adLoad,
  } = state1;

  const tabBarHeight = useBottomTabBarHeight();
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

  const renderFailed = () => (
    <View style={styles.outContainer}>
      <Text style={styles.title}>Failed verification</Text>
      <Text style={styles.description}>
        Sorry, we were unable to verify your profile. Please delete your profile
        and make a new one again.
      </Text>
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
        if (res.status >= 200 || res.status <= 201) {
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
    profileIndex,
  } = useSelector(store => store.userReducer);
  const { religion, vibes } = useSelector(store => store.NewOnBoardingReducer);

  const isFocused = useIsFocused();
  const handleBlockAlert = state => {
    // setBlockAlert(state);
  };

  const handleHomeScreen = () => {
    // setBlockAlert(false);
    getAllUser(limit, offset);
  };

  const handleBlockedScreen = state => {
    props.navigation.navigate("BlockedList");
    // setBlockAlert(false);
  };

  const handleReportAlert = state => {
    props.navigation.navigate("ReportAccountScreen", {
      userId: userId,
      userName: userName,
    });
  };

  const handleAlert = state => {
    // setAction(state);
    dispatch1({ type: "SET_ACTION", payload: state });
  };

  const handleDotsPress = useCallback(() => {
    if (isBlocked) {
      // setBlockAlert(true);
      dispatch1({ type: "SET_BLOCK_ALERT", payload: true });
    } else {
      // setAction(true);
      dispatch1({ type: "SET_ACTION", payload: true });
    }
  }, []);

  // const showFeedbackModal = async () => {
  //   try {
  //     const lastSkippedDate = await AsyncStorage.getItem('lastSkipped');
  //     const shouldShowModal =
  //       !lastSkippedDate || 
  //       new Date() - new Date(lastSkippedDate) >= 7 * 24 * 60 * 60 * 1000;
  
  //     if (shouldShowModal) {
  //       dispatch1({ type: "SHOW_MODAL" });
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving last skipped date from AsyncStorage:', error);
  //   }
  // };
  
  // const handleSkipModal = async () => {
  //   await AsyncStorage.setItem("lastSkipped", new Date().toISOString());
  //   dispatch1({ type: "SKIP_MODAL" });
  // };

  const handleCloseModal = async () => {
    try {
      await AsyncStorage.setItem('lastSkipped', new Date().toISOString());
      dispatch1({ type: "HIDE_MODAL" });
    } catch (error) {
      console.error('Error updating last skipped date in AsyncStorage:', error);
    }
  };
  

  const getMyProfile = async () => {
    if (token != null) {
      await ProfileServices.getMyProfile(token)
        .then(async res => {
          console.log("UAISUIODUIODUIODOIDU", res.data);
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            let data = await res?.data?.data;
            dispatch({
              type: "religion",
              payload: data?.Profile?.religion,
            });
            await dispatch1({
              type: "SET_REVERIFY",
              payload: data?.needToReverify,
            });
            // setReverify(data?.needToReverify);

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

  const getAllUser = useCallback((limit, offset, pagination) => {
    const limitValue = limit; // or a default value if needed
    const offsetValue = offset * limit;
  
    if (
      status === "ACTIVE" ||
      status === "INCOMPLETE" ||
      status === "INACTIVE" ||
      status === "COMPLETED" ||
      status === null
    ) {
      UserService.getAllUser(token, {
        limit: limitValue,
        offset: offsetValue,
      })
        .then(async res => {
          handleStatusCode(res);
          console.log("PROFILES RESSSSSS", res.data);
  
          if (res.status >= 200 && res.status <= 299) {
            let data = await res?.data?.data;
  
            if (data?.totalProfiles === 0 && data?.noOfProfilesRemaining >= 0) {
              dispatch({
                type: "AUTH_USER_SCREEN_INDEX",
                payload: false,
              });
            } else if (!swipeScreenIndex) {
              dispatch({
                type: "AUTH_USER_SCREEN_INDEX",
                payload: true,
              });
            }
  
            dispatch1({
              type: "SET_REMAINING_PROFILES",
              payload: data?.noOfProfilesRemaining,
            });
  
            dispatch1({
              type: "SET_TOTAL_PROFILES",
              payload: data?.totalProfiles,
            });
  
            if (preferenceFilter) {
              dispatch({
                type: "SET_PREFERENCE_FILTER",
                payload: false,
              });
              dispatch1({
                type: "SET_PROFILES_LIST",
                payload: data?.profiles?.filter(
                  el =>
                    el.Profile.gender.toLowerCase() !==
                    userData.Profile?.gender.toLowerCase()
                ),
              });
            } else if (!preferenceFilter && pagination) {
              const updatedProfiles = [
                ...profilesList,
                ...data?.profiles.filter(
                  el =>
                    el?.Profile?.gender.toLowerCase() !==
                    userData?.Profile?.gender.toLowerCase()
                ),
              ];
              dispatch1({
                type: "SET_PROFILES_LIST",
                payload: updatedProfiles,
              });
            } else {
              await dispatch1({
                type: "SET_PROFILES_LIST",
                payload: data?.profiles.filter(
                  el =>
                    el.Profile.gender.toLowerCase() !==
                    userData.Profile?.gender.toLowerCase()
                ),
              });
            }
          }
        })
        .catch(err => {
          if (err?.response?.status === 403) {
            // Handle 403 error - User deleted or access forbidden
            console.log("User has been deleted or access forbidden:", err);
  
            // Clear user state or token
            dispatch({ type: "AUTH_USER_STATUS", payload: null });
            dispatch({ type: "AUTH_TOKEN", payload: null });
  
            // Redirect the user to the WelcomeScreen or another screen
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "WelcomeScreen" }],
              })
            );
          } else if (err?.message.includes("Network")) {
            Alerts("error", err.message);
          } else {
            console.log("getAllUser err:", err);
          }
          dispatch({
            type: "AUTH_USER_SCREEN_INDEX",
            payload: false,
          });
        })
        .finally(() => dispatch1({ type: "SET_SKELETON", payload: false }));
    } else {
      dispatch1({ type: "SET_SKELETON", payload: false });
    }
  }, [token, status, swipeScreenIndex, preferenceFilter, profilesList, userData, props.navigation]);
  

  // const getAllUser = (limit, offset, pagination) => {
  //   if (
  //     status === "ACTIVE" ||
  //     status === "INCOMPLETE" ||
  //     status === "INACTIVE" ||
  //     status === "COMPLETED"
  //   ) {
  //     UserService.getAllUser(token, limit=${limit}&offset=${offset * limit})
  //       .then((res) => {
  //         handleStatusCode(res);
  //         if (res.status >= 200 && res.status <= 299) {
  //           let data = res?.data?.data;
  //           if (data?.totalProfiles === 0 && data?.noOfProfilesRemaining >= 0) {
  //             dispatch({
  //               type: "AUTH_USER_SCREEN_INDEX",
  //               payload: false,
  //             });
  //           } else if (!swipeScreenIndex) {
  //             dispatch({
  //               type: "AUTH_USER_SCREEN_INDEX",
  //               payload: true,
  //             });
  //           }

  //           setRemainingProfiles(data?.noOfProfilesRemaining);
  //           setTotalProfiles(data?.totalProfiles);

  //           // Logic for handling seen profiles
  //           const filteredProfiles = data?.profiles.filter(
  //             (el) =>
  //               el.Profile.gender.toLowerCase() !==
  //               userData.Profile?.gender.toLowerCase()
  //           );

  //           if (preferenceFilter) {
  //             dispatch({
  //               type: "SET_PREFERENCE_FILTER",
  //               payload: false,
  //             });
  //             dispatch1({type:"SET_PROFILES_LIST",payload:filteredProfiles);
  //           } else if (!preferenceFilter && pagination) {
  //             // Remove previously seen profiles
  //             const newProfilesList = filteredProfiles.filter(
  //               (profile) => !seenProfiles.includes(profile.id)
  //             );
  //             dispatch1({type:"SET_PROFILES_LIST",payload:(prevState) => [
  //               ...prevState,
  //               ...newProfilesList,
  //             ]);
  //           } else {
  //             // Remove previously seen profiles
  //             const newProfilesList = filteredProfiles.filter(
  //               (profile) => !seenProfiles.includes(profile.id)
  //             );
  //             dispatch1({type:"SET_PROFILES_LIST",payload:newProfilesList);
  //           }
  //         }
  //       })
  //       .catch((err) => {
  //         if (err?.message.includes("Network")) {
  //           Alerts("error", err.message);
  //         } else {
  //           console.log("getAllUser err:", err);
  //         }
  //         dispatch({
  //           type: "AUTH_USER_SCREEN_INDEX",
  //           payload: false,
  //         });
  //       })
  //       .finally(() => dispatch1({type:"SET_SKELETON",payload:false}));
  //   } else dispatch1({type:"SET_SKELETON",payload:false});
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch({
  //       type: "SET_FOCUSED_SCREEN",
  //       payload: true,
  //     });

  //     if (foundIndex !== -1 && profilesList.length > 0) {
  //       dispatch1({
  //         type: "SET_PROFILES_LIST", payload: (prevState) =>
  //           prevState.filter((el) => el.id != discoverUserIndex)
  //       });

  //     }

  //     dispatch({
  //       type: "SET_DISCOVER_INDEX",
  //       payload: null,
  //     });
  //   }, [foundIndex !== -1])
  // );

  // useFocusEffect(
  //   useCallback(() => {
  //     if (profileIds.length > 0 && profilesList.length > 0) {
  //       dispatch({
  //         type: "AUTH_USER_SCREEN_INDEX",
  //         payload: true,
  //       });

  //       dispatch1({type:"SET_PROFILES_LIST",payload:(prevState) =>
  //         prevState.filter((el) => profileIds.every((id) => id != el.id))
  //       );

  //       profileIds = [];
  //     }

  //     if (profilesList.length == 0) {
  //       dispatch({
  //         type: "AUTH_USER_SCREEN_INDEX",
  //         payload: false,
  //       });
  //     }
  //   }, [profileIds, profilesList])
  // );

  const handleGetReward = () => {
    UserService.adReward(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status == 200 || res.status == 201) {
          getAllUser(15, 0);

          let copy = JSON.parse(JSON.stringify(userData));
          copy.Profile = res.data.data[0][0][0];

          dispatch({
            type: "AUTH_USER",
            payload: copy,
          });

          Alerts("success", res.data.message);
        }
      })
      .catch(err => console.log("adReward err", err));
  };

  const handleWatchAd = async () => {
    try {
      if (!loaded) {
        dispatch1({ type: "SET_AD_LOAD", payload: true });
  
        // Log the start of loading an ad
        await analytics().logEvent('watch_ad_start', {
          description: 'User started watching a rewarded ad',
        });
  
        admob.load();
      }
    } catch (error) {
      console.error('Error during ad loading:', error);
  
      // Log any errors that occur while loading the ad
      await analytics().logEvent('watch_ad_failure', {
        description: 'Failed to load rewarded ad',
        error: error.message,
      });
    }
  };
  

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    dispatch1({ type: "SET_USER_MEDIA_IMAGE", payload: null });
    dispatch1({ type: "SET_USER_MEDIA_VIDEO", payload: null });
    // setUserMediaVideo(null);
    console.log("Viewable", viewableItems);
    for (var i = 0; i < viewableItems?.length; i++) {
      AsyncStorage.setItem(
        "moveIndex",
        JSON.stringify(viewableItems[0]?.index)
      );
      viewableItems[i]?.item?.UserMedia?.map(item => {
        if (item?.type == "video" && item?.sequence == null) {
          dispatch1({ type: "SET_USER_MEDIA_VIDEO", payload: item });
        } else if (item?.type == "image" && item?.sequence == 1) {
          dispatch1({ type: "SET_USER_MEDIA_IMAGE", payload: item });
        }
      });
      if (viewableItems[i]?.item?.Profile?.personalityType != null) {
        personalityMatch(viewableItems[i]?.item?.Profile?.personalityType);
      }
      // setIndex(viewableItems[i].index);
      dispatch1({ type: "SET_INDEX", payload: viewableItems[i].index });

      dispatch1({ type: "SET_USER_ID", payload: viewableItems[i].item?.id });
      dispatch1({
        type: "SET_USER_NAME",
        payload: viewableItems[i].item?.firstName,
      });
      // setUserId(viewableItems[i].item?.id);
      // setUserName(viewableItems[i].item?.firstName);
      viewIntercation(viewableItems[i].item?.id);
      // if (!profileIds.includes(viewableItems[i].item?.id)) {
      //   profileIds.push(viewableItems[i].item?.id);
      // }
      props.navigation.navigate("Discover", {
        enableees: swipeIndex,
        userId: viewableItems[i].item?.id,
        userDetails: viewableItems[i].item,
      });
    }
  });

  const loadMoreData = () => {
    console.log("ENTEREEEEED 11");
    offset += 1;
    getAllUser(limit, offset, true);
  };

  const onMicPress = async () => {
  try {
    await analytics().logEvent('mic_button_press', {
      description: 'User pressed the microphone button',
    });

    dispatch1({ type: "SET_IMAGE_MODAL", payload: true });
    dispatch1({ type: "SET_MODAL_TYPE", payload: "mic" });

    // Show feedback modal if conditions are met
    // await showFeedbackModal();
  } catch (error) {
    console.error('Error logging mic button press:', error);
    await analytics().logEvent('mic_button_press_failure', {
      description: 'Failed to log mic button press event',
      error: error.message,
    });
  }
};
  

const onCommentPress = async () => {
  try {
    await analytics().logEvent('comment_button_press', {
      description: 'User pressed the comment button',
    });

    dispatch1({ type: "SET_IMAGE_MODAL", payload: true });
    dispatch1({ type: "SET_MODAL_TYPE", payload: "comment" });

    // Show feedback modal if conditions are met
    // await showFeedbackModal();
  } catch (error) {
    console.error('Error logging comment button press:', error);
    await analytics().logEvent('comment_button_press_failure', {
      description: 'Failed to log comment button press event',
      error: error.message,
    });
  }
};
  const handleBackButton = () => {
    if (imageModal || action) {
      // setImageModal(false);
      dispatch1({ type: "SET_IMAGE_MODAL", payload: false });

      // setAction(false);
      dispatch1({ type: "SET_ACTION", payload: false });
    } else {
      BackHandler.exitApp();
    }

    return true;
  };

  const onHeartPress = async (id) => {
    try {
      await analytics().logEvent('heart_button_press', {
        description: 'User pressed the heart button',
        otherUserId: userId,
        resourceId: userMediaVideo !== null ? userMediaVideo?.id : userMediaImage?.id,
        resourceType: "USER_MEDIA",
      });
  
      const res = await UserService.likeInteraction(
        {
          resourceId: userMediaVideo !== null ? userMediaVideo?.id : userMediaImage?.id,
          resourceType: "USER_MEDIA",
          otherUserId: userId,
        },
        token
      );
  
      handleStatusCode(res);
  
      if (res.status >= 200 && res.status <= 299) {
        dispatch1(prevState => {
          const updatedProfilesList = prevState.profilesList.filter(
            el => el.id !== id
          );
          return {
            type: "SET_PROFILES_LIST",
            payload: updatedProfilesList,
          };
        });
  
        Alerts(
          "success",
          `You Liked ${userName}'s ${
            userMediaVideo != null ? "  video" : "picture"
          } successfully`
        );
  
        // Show feedback modal if conditions are met
        // await showFeedbackModal();
      }
    } catch (error) {
      console.log("likeInteraction err", error);
      await analytics().logEvent('heart_button_press_failure', {
        description: 'Failed to process heart button press',
        error: error.message,
      });
    }
  };
  

  const getMoveIndex = async () => {
    let moveIndex = await AsyncStorage.getItem("moveIndex");

    return moveIndex;
  };
  useEffect(() => {
    dispatch1({ type: "SET_SKELETON", payload: true });
    if (preferenceFilter) {
      let offset = 0;
      getAllUser(limit, offset);
    } else {
      console.log("ENTERED");
      getAllUser(limit, offset);
    }

    getMyProfile();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (preferenceFilter) {
  //       offset = 0;
  //       getAllUser(limit, offset);
  //     }
  //   }, [preferenceFilter])
  // );

  // useEffect(() => {
  //   if (imageModal || action) {
  //     dispatch({
  //       type: "AUTH_USER_SCREEN_INDEX",
  //       payload: false,
  //     });
  //   } else if (
  //     profilesList.length > 0 &&
  //     (imageModal == false || action == false)
  //   ) {
  //     dispatch({
  //       type: "AUTH_USER_SCREEN_INDEX",
  //       payload: true,
  //     });
  //   }
  //   if (android) {
  //     PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  //     );
  //   }
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButton);
  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
  //   };
  // }, [imageModal, action]);

  useFocusEffect(
    useCallback(() => {
      if (token != null && mobileNumber != "") {
        connectyCubeInitialization(token, mobileNumber);
      } else if (token != null && email != "") {
        connectyCubeInitialization(token, email);
      }

      const unsubscribeLoaded = admob.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          dispatch1({ type: "SET_LOADED", payload: true });
          dispatch1({ type: "SET_AD_LOAD", payload: false });

          if (admob.loaded) {
            admob.show();
          }

          unsubscribeLoaded();
        }
      );

      const unsubscribeEarned = admob.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
          dispatch1({ type: "SET_LOADED", payload: false });
          dispatch1({ type: "SET_AD_LOAD", payload: false });
          console.log("User earned reward of ", reward);
          handleGetReward();
          unsubscribeEarned();
        }
      );
      // getMoveIndex()
    }, [])
  );

   useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        if (preferenceFilter) {
          dispatch1({ type: "SET_SKELETON", payload: true });
          console.log("ENTERED U DDD");
          let offset = 0;
          getAllUser(limit, offset);
        }
        let index = getMoveIndex();
        console.log("IS FOCUSES", isFocused, index);
        setTimeout(() => {
          if (isFocused && flatListRef.current && index > 0) {
            flatListRef?.current?.scrollToIndex({
              index: index,
              animated: false,
            });
          }
        }, 200);
      }

    }, [isFocused])
  );

  const renderItem = useCallback(({ item }) => {
    let sortedImage = [...item?.UserMedia]
      .filter(media => media.type != "video")
      .sort((a, b) => a.sequence - b.sequence)[0].url;

    // console.log("sortedImage", sortedImage);
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
          searchPress={() => props.navigation.navigate("SearchPreferences")}
          onPressCommentInteraction={() => {
            if (status === "INACTIVE" || status === "INCOMPLETE") {
              dispatch1({ type: "SET_CHECK", payload: true });
            } else {
              onCommentPress();
            }
          }}
          onPressVoiceInteraction={() =>
            status === "INACTIVE" || status === "INCOMPLETE"
              ? dispatch1({ type: "SET_CHECK", payload: true })
              : onMicPress()
          }
          onPressLikeInteraction={() =>
            status === "INACTIVE" || status === "INCOMPLETE"
              ? dispatch1({ type: "SET_CHECK", payload: true })
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
              onPress={() => dispatch1({ type: "SET_CHECK", payload: false })}
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
                  Please complete your profile to interact with other users,
                  thank you!
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("OnBoardingQuestions");
                    dispatch1({ type: "SET_CHECK", payload: false });
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
                    dispatch1({ type: "SET_CHECK", payload: false });
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
  });

  return (
    <>
      {state1.skeleton ? (
        <DiscoverSkeleton tabBarHeight={tabBarHeight} />
      ) : state1.userData?.Profile?.noOfProfilesRemaining === 0 &&
        state1.userData?.Profile?.totalNoOfProfiles > 0 ? (
        renderOutProfiles()
      ) : (
        <SafeAreaView style={styles.container}>
          {state1.reverify ? (
            <UploadSelfie reverify />
          ) : state1.status === "FAILED" ? (
            renderFailed()
          ) : state1.userData?.Profile?.noOfProfilesRemaining === 0 ? (
            <OutOfProfilesDay
              adLoad={state1.adLoad}
              adPress={handleWatchAd}
              navigation={props.navigation}
            />
          ) : state1.profilesList.length > 0 ? (
            <FlatList
              scrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
              ref={flatListRef}
              onScrollToIndexFailed={info => {
               if(Platform.OS==='android'){
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({ index: info.index });
                });
               }
              }}
              viewabilityConfig={viewConfigRef.current}
              onViewableItemsChanged={onViewableItemsChanged.current}
              showsVerticalScrollIndicator={false}
              inverted={false}
              pagingEnabled
              snapToAlignment={"start"}
              data={state1.profilesList}
              onEndReached={loadMoreData}
              keyExtractor={item => item?.id}
              renderItem={renderItem}
            />
          ) : (
            renderOutProfiles()
          )}
          {state1.imageModal ? (
            <GestureHandlerRootView
              style={{
                width: "100%",
                backgroundColor: "#00000061",
                height: state1.imageModal ? windowHeight * 1 : 0,
                bottom: 0,
                position: "absolute",
                zIndex: 1,
              }}
            >
              <BottomImageInteraction
                setUserProfilesData={data =>
                  dispatch1({ type: "SET_PROFILES_LIST", payload: data })
                }
                userProfilesData={state1.profilesList}
                listRef={flatListRef}
                index={state1.index}
                userId={state1.userId}
                userName={state1.userName}
                userPhotosId={
                  state1.userMediaVideo != null
                    ? state1.userMediaVideo?.id
                    : state1.userMediaImage?.id
                }
                userMediaVideo={state1.userMediaVideo}
                onDismiss={() =>
                  dispatch1({ type: "SET_IMAGE_MODAL", payload: false })
                }
                fastImage={
                  state1.userMediaImage != null
                    ? state1.userMediaImage?.url
                    : null
                }
                toggle={state1.imageModal}
                setToggle={value =>
                  dispatch1({ type: "SET_IMAGE_MODAL", payload: value })
                }
                modalType={state1.modalType}
                offset={state1.userDevice && state1.userDevice.includes("Pro Max") ? 75 : 70}
              />
            </GestureHandlerRootView>
          ) : null}
          {state1.action ? (
            <ActionBottomModal
              discover
              user={{
                userId: state1.userId,
                userName: state1.userName,
              }}
              showToast
              toggle={state1.action}
              setAction={value =>
                dispatch1({ type: "SET_ACTION", payload: value })
              }
              onDismiss={() =>
                dispatch1({ type: "SET_ACTION", payload: false })
              }
            />
          ) : null}
         {/* <FeedbackModal
  visible={state1.isModalVisible}
  onClose={handleCloseModal}
  // onSkip={() => dispatch1({ type: "SKIP_MODAL" })}
/> */}
        </SafeAreaView>
      )}
    </>
  );
};
export default memo(HomeOne);

