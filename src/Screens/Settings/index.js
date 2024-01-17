import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { OnBoardingServices } from "../../services";
import { useHelper } from "../../hooks/useHelper";
import { useRNIAP } from "../../hooks/useRNIAP";
import { OS_VER } from "../../utility/size";

import moment from "moment";
import styles from "./styles";
import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";
import ImageContainer from "../../components/containers/imageContainer";
import InviteFriendsContainer from "../../components/containers/inviteFriendsContainer";
import PurchaseUpgrade from "../../components/PurchaseUpgrade";
import SocialButton from "../../components/buttons/SocialButton";
import ProfileServices from "../../services/ProfileServices";
import ActionCard from "../../components/Cards/ActionCard";
import HeaderContainer from "../../components/containers/headerContainer";
import ChatServices from "../../services/ChatServices";
import IAPServices from "../../services/IAPServices";
import Loader from "../../components/Loader";
import SettingButton from "../../components/buttons/SettingButton";
import BoostUpgradeCard from "../../components/Cards/BoostUpgradeCard";
import Icons from "../../utility/icons";

let focused = false;

const Settings = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {} = useRNIAP();
  const { Alerts, handleStatusCode } = useHelper();
  const { token, userData, status } = useSelector(store => store.userReducer);
  const { isSpotTimerFinished, isProfileTimerFinished } = useSelector(
    store => store.timerReducer
  );
  const { denomination } = useSelector(store => store.profileReducer);

  const proMember = userData?.UserSetting?.isSubscribed;

  let [mediaOptions, setMediaOptions] = useState(false);
  let [imageLoader, setImageLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  const settingsArr = [
    {
      id: 1,
      title: "My Search Preferences",
      screen: "SearchPreferences",
      icon: require("../../assets/iconimages/setting-logo.png"),
    },
    {
      id: 2,
      title: "My Privacy Settings",
      screen: "MyPrivacySetting",
      icon: require("../../assets/iconimages/setting-lock-closed-outline.png"),
    },
    {
      id: 3,
      title: "My Settings",
      screen: "MySetting",
      icon: require("../../assets/iconimages/setting-profile.png"),
    },
    {
      id: 4,
      title: "Contact Rishta Auntie",
      screen: "",
      icon: require("../../assets/iconimages/setting-headset.png"),
    },
    {
      id: 5,
      title: "Safety Tips",
      screen: () => handleUrl("safety-tips"),
      icon: require("../../assets/iconimages/setting-tick-circle.png"),
    },
    {
      id: 6,
      title: `FAQ`,
      screen: () => handleUrl("faq"),
      icon: require("../../assets/iconimages/setting-document-text.png"),
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      if (token != null) {
        ProfileServices.getMyProfile(token)
          .then(res => {
            handleStatusCode(res);
            if (res.status >= 200 && res.status <= 299) {
              let data = res?.data?.data;
              // console.log('userData 1', data);
              if (data != null && data?.Profile?.personalityType == null) {
                setMediaOptions(true);
              }
              if (
                data.UserSetting.isSubscribed &&
                data.lastLogDailyProfilesLimit &&
                !isProfileTimerFinished?.showtimer
              ) {
                let time = moment
                  .duration(
                    moment(data.lastLogDailyProfilesLimit?.createdAt).format(
                      "HH:mm"
                    )
                  )
                  .asSeconds();

                dispatch({
                  type: "SET_PROFILE_TIMER",
                  payload: {
                    userId: data.id,
                    showtimer: true,
                    time: time,
                  },
                });
              }
              dispatch({
                type: "AUTH_USER",
                payload: data,
              });
              dispatch({
                type: "USER_CHUPKE_CHUPKE",
                payload: data?.UserSetting?.chupkeChupke
                  ? data?.UserSetting?.chupkeChupke
                  : false,
              });
              dispatch({
                type: "USER_DISCOVERY_MODE",
                payload: data?.UserSetting?.discoveryMode
                  ? data?.UserSetting?.discoveryMode
                  : false,
              });
              dispatch({
                type: "USER_HIDE_AGE",
                payload: data?.UserSetting?.hideAge
                  ? data?.UserSetting?.hideAge
                  : false,
              });
              dispatch({
                type: "USER_HIDE_LIVE_STATUS",
                payload: data?.UserSetting?.hideLiveStatus
                  ? data?.UserSetting?.hideLiveStatus
                  : false,
              });
              dispatch({
                type: "USER_SHOW_MSG_PREV",
                payload: data?.UserSetting?.showMessagePreview
                  ? data?.UserSetting?.showMessagePreview
                  : false,
              });
              dispatch({
                type: "USER_IS_NOTIFICATION",
                payload: data?.UserSetting?.isNotificationEnabled
                  ? data?.UserSetting?.isNotificationEnabled
                  : false,
              });
              dispatch({
                type: "USER_IS_DARK_MODE",
                payload: data?.UserSetting?.isDarkMode
                  ? data?.UserSetting?.isDarkMode
                  : false,
              });

              OnBoardingServices.profileValues(
                encodeURI(
                  JSON.stringify([
                    "community",
                    "denomination",
                    "familyOrigin",
                    "language",
                  ])
                )
              )
                .then(res => {
                  handleStatusCode(res);
                  if (res.status >= 200 && res.status <= 299) {
                    let data = res?.data?.data;
                    dispatch({
                      type: "PROFILE_VALUES",
                      payload: data,
                    });
                  }
                })
                .catch(err => console.log("profileValues err", err));
            }
          })
          .catch(err => console.log("getMyProfile err", err));

        if (denomination.length > 0) {
          dispatch({
            type: "PROFILE_DEN_VALUES",
            payload: denomination[userData?.Profile?.religion]?.map(
              x => x.name
            ),
          });
        }
      } else {
        Alerts("error", "Your token has expired. Please login again.");
      }
    }, [isFocused])
  );

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      focused = true;
    });

    const blurSubs = props.navigation.addListener("blur", () => {
      focused = false;
    });

    return () => {
      blurSubs();
    };
  }, [props.navigation]);

  const handleQuiz = state => {
    setMediaOptions(state);
    props.navigation.navigate("PersonalityQuiz");
  };

  const handleAlert = state => {
    setMediaOptions(state);
  };

  const handleEnableSpotlight = () => {
    if (
      isSpotTimerFinished?.userId == userData.id &&
      isSpotTimerFinished?.showtimer
    ) {
      Alerts("error", "Spotlight is already enabled");
    } else {
      IAPServices.enableSpotlight(token)
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            Alerts("success", res.data.message);

            let copyUser = { ...userData };
            copyUser.UserSetting = {
              ...copyUser.UserSetting,
              noOfSpotlight: userData?.UserSetting?.noOfSpotlight - 1,
            };

            dispatch({
              type: "AUTH_USER",
              payload: copyUser,
            });

            handleGetProfile();
          }
        })
        .catch(err => Alerts("error", err?.message));
    }
  };

  const handleGetProfile = () => {
    ProfileServices.getMyProfile(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let data = res?.data?.data;

          dispatch({
            type: "AUTH_USER",
            payload: data,
          });

          let time = moment
            .duration(moment(data?.spotlightEnabled?.createdAt).format("HH:mm"))
            .asSeconds();

          dispatch({
            type: "SET_SPOT_TIMER",
            payload: {
              userId: userData.id,
              showtimer: true,
              time: time,
            },
          });
        }
      })
      .catch(err => console.log("getMyOwnProfile err", err));
  };

  const createContactSupport = () => {
    ChatServices.contactSupport(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 201) {
          getChatHeads();
        }
      })
      .catch(err => Alerts("error", err?.message))
      .finally(() => setLoading(false));
  };

  const getChatHeads = () => {
    setLoading(true);
    ChatServices.chatHead(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let typeFlag = false;
          let data = res.data.data;

          for (let i = 0; i < data.length; i++) {
            if (data[i].type == "GROUP") {
              typeFlag = true;
              break;
            }
          }

          if (typeFlag) {
            data.map(el => {
              if (el.type === "GROUP") {
                props.navigation.navigate("BottomTab", {
                  screen: "UserChatList",
                  params: {
                    screen: "ChatTabView",
                    el: el,
                    params: {
                      screen: "ChatScreen",
                      el: el,
                    },
                  },
                });
              }
            });
          } else {
            createContactSupport();
          }
        }
      })
      .catch(err => Alerts("error", err?.message))
      .finally(() => setLoading(false));
  };

  const handleUrl = endpoint =>
    Linking.openURL(`https://rishtaauntie.app/${endpoint}/`);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer Icon />
      {/* {isFocused ? (
        <ActionCard
          quiz={true}
          heading={'Solve Personality Quiz'}
          handleQuiz={handleQuiz}
          handleAlert={handleAlert}
          alert={mediaOptions}
        />
      ) : null} */}
      {loading ? (
        <Loader />
      ) : (
        <ScrollView>
          {/* {proMember ? (
            <View
              style={[
                styles.borderBtnContainer,
                styles.borderBtnContainerGold,
              ]}>
              <Text style={styles.borderBtnTxtGold}>
                Welcome to Rishta Auntie Gold
              </Text>
            </View>
          ) : (
            <Pressable
              style={styles.borderBtnContainer}
              onPressIn={() => props.navigation.navigate('Paywall')}>
              <Text style={styles.borderBtnTxt}>Join Rishta Auntie Gold</Text>
            </Pressable>
          )} */}
          {/* 
          {(userData.Profile.personalityType == "" ||
            userData.Profile.personalityType == null) &&
          status === "COMPLETED" ? (
            <View style={styles.actionItemsMainView}>
              <View style={styles.actionItemsView}>
                <Text style={styles.actionItemsText}>Action Items</Text>
                {status === "COMPLETED" ? null : (
                  <SettingButton
                    onPress={() =>
                      props.navigation.navigate("OnBoardingQuestions")
                    }
                    title={"Complete my profile"}
                  />
                )}
                {userData.Profile.personalityType == "" ||
                  (userData.Profile.personalityType == null && (
                    <SettingButton
                      onPress={() =>
                        props.navigation.navigate("PersonalityQuiz")
                      }
                      title={"Take personality quiz to get user insights"}
                    />
                  ))}
              </View>
            </View>
          ) : null} */}
          {userData?.Profile?.personalityType === null ||
          status === "INCOMPLETE" ? (
            <View style={styles.actionItemsMainView}>
              <View style={styles.actionItemsView}>
                <Text style={styles.actionItemsText}>Action Items</Text>
                {status === "INCOMPLETE" ? (
                  <SettingButton
                    onPress={() =>
                      props.navigation.navigate("OnBoardingQuestions")
                    }
                    title={"Complete my profile"}
                  />
                ) : null}
                {userData.Profile.personalityType == "" ||
                  (userData.Profile.personalityType == null && (
                    <SettingButton
                      onPress={() =>
                        props.navigation.navigate("PersonalityQuiz")
                      }
                      title={"Take personality quiz to get user insights"}
                    />
                  ))}
              </View>
            </View>
          ) : null}

          <View style={styles.actionItemsMainView}>
            <View style={styles.actionItemsView}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 56 / 2,
                  }}
                >
                  {userData?.UserMedia?.length > 0 && (
                    <FastImage
                      resizeMode="cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 56 / 2,
                      }}
                      source={{
                        uri: userData?.UserMedia[0]?.url,
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Inter-Bold",
                    alignSelf: "center",
                    minWidth: "60%",
                    maxWidth: "70%",
                    textAlign: "center",
                    color: "#111827",
                  }}
                >
                  {userData?.firstName + " " + userData?.lastName}
                </Text>

                {status !== "INCOMPLETE" ? (
                  <>
                    <Icons.EvilIcons
                      onPress={() => props.navigation.navigate("ViewProfile")}
                      name="user"
                      size={36}
                      color={colors.primaryPink}
                      style={{
                        width: "10%",
                        bottom: OS_VER >= 13 ? 5.5 : 2.5,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate("EditProfileScreen");
                      }}
                      style={{ width: "10%" }}
                    >
                      <FastImage
                        resizeMode="contain"
                        style={{ width: "100%", height: 25 }}
                        source={require("../../assets/iconimages/editoutline.png")}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View />
                )}
              </View>
              <SettingButton
                onPress={() => props.navigation.navigate("MyInsight")}
                sbStyles={{
                  backgroundColor: null,
                  borderColor: colors.primaryPink,
                  borderWidth: 1,
                }}
                titleStyles={{ color: "#121826" }}
                title={"View Insights"}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginTop: "2%",
            }}
          >
            <BoostUpgradeCard
              onPress={() => {
                if (userData?.UserSetting?.noOfSpotlight > 0) {
                  handleEnableSpotlight();
                } else {
                  props.navigation.navigate("PaywallSpots");
                }
              }}
              typeCount={userData?.UserSetting?.noOfSpotlight}
              type="Spotlight:"
              focused={focused}
              timer={userData?.spotlightEnabled}
              imageSource={require("../../assets/iconimages/pinkspotlight.png")}
              buttonTitle={"Boost"}
              bottomText={"Boost my visibility"}
            />
            <BoostUpgradeCard
              proMember={proMember}
              onPress={() => props.navigation.navigate("Paywall")}
              typeCount={`${userData?.Profile?.noOfProfilesRemaining}/${userData?.Profile?.totalNoOfProfiles}`}
              type="Profiles left"
              focused={focused}
              timer={userData?.lastLogDailyProfilesLimit}
              imageSource={require("../../assets/iconimages/pinkprofiles.png")}
              buttonTitle={"Upgrade"}
              bottomText={"Upgrade for unlimited daily profiles"}
            />
          </View>
          {/* <View style={styles.topMainContainer}>
            <View style={styles.imageMainContainer}>
              {imageLoader && (
                <ActivityIndicator
                  animating
                  color={colors.primaryPink}
                  size="small"
                  style={{
                    flex: 1,
                    position: 'absolute',
                    top: '30%',
                    bottom: '50%',
                    left: '45%',
                    zIndex: 1,
                  }}
                />
              )}
              <ImageContainer
                onLoadStart={() => setImageLoader(true)}
                onLoadEnd={() => setImageLoader(false)}
                editProfileonPress={() =>
                  props.navigation.navigate('ViewEditProfile', {
                    profilePrompts: userData?.ProfilePrompts,
                  })
                }
                EditMyProfile
                image={
                  userData?.UserMedia?.length > 0 && userData?.UserMedia[0]?.url
                }
                name={userData?.firstName}
                contStyle={styles.contStyle}
                imageWrapper={styles.imageWrapper}
                imageStyle={[
                  styles.imageProps,
                  proMember && {borderColor: colors.gold},
                ]}
                onPress={() => props.navigation.navigate('MyInsight')}
              />
            </View>
            <View style={styles.purchaseUpgradeWrapper}>
              <PurchaseUpgrade
                IcononPress={handleEnableSpotlight}
                Image={require('../../assets/iconimages/spotlight.png')}
                PurchaseUpgrade={styles.purchaseUpgrade}
                title={'Purchase'}
                TopLeftTitle={'SpotLight'}
                timeLeft={'TimeLeft: 12:12'}
                iconName={'setting'}
                BottomTopText={userData?.UserSetting?.noOfSpotlight}
                bottomBottomText={'Boost My Visibilty'}
              />
              <PurchaseUpgrade
                IcononPress={() =>
                  props.navigation.navigate('SearchPreferences', {
                    preferences: userData?.UserPreference,
                  })
                }
                Image={require('../../assets/iconimages/searchPreferences.png')}
                PurchaseUpgrade={styles.purchaseUpgrade}
                title={'Upgrade'}
                TopLeftTitle={'Profiles Remaining'}
                timeLeft={'TimeLeft: 12:12'}
                iconName={'setting'}
                BottomTopText={`${userData?.Profile?.noOfProfilesRemaining}/${userData?.Profile?.totalNoOfProfiles}`}
                bottomBottomText={'Upgrade for unlimited daily challenges'}
              />
            </View>
          </View> */}

          {/* <InviteFriendsContainer onPress={() => {}} /> */}
          <View
            style={[
              styles.actionItemsMainView,
              {
                marginTop: "2%",
              },
            ]}
          >
            <View style={styles.actionItemsView}>
              {settingsArr.map((el, index, array) => (
                <TouchableOpacity
                  key={el.id}
                  onPress={() => {
                    if (el.title == "Contact Rishta Auntie") getChatHeads();
                    else if (/Safety Tips|FAQ/.test(el.title)) el.screen();
                    else if (el.screen != "")
                      props.navigation.navigate(el.screen);
                  }}
                  style={[
                    styles.settingsIconContainer,
                    {
                      borderBottomWidth: index === array?.length - 1 ? 0 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.textIcon,
                      {
                        width: "80%",
                        justifyContent: "flex-start",
                      },
                    ]}
                  >
                    <FastImage
                      source={el?.icon}
                      resizeMode="contain"
                      style={{ width: 20, height: 20 }}
                    />
                    <Text
                      style={[
                        styles.settingsIconText,
                        {
                          marginLeft: 20,
                        },
                      ]}
                    >
                      {el.title}
                    </Text>
                  </View>
                  <View style={styles.arrowIconView}>
                    <FastImage
                      resizeMode="contain"
                      style={styles.arrowIconImage}
                      source={require("../../assets/iconimages/settingarrow.png")}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actionItemsMainView}>
            <View
              style={[
                styles.actionItemsView,
                {
                  backgroundColor: colors.primaryPink,
                  flexDirection: "row",
                },
              ]}
            >
              <View style={{ width: "60%" }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Inter-Bold",
                    color: colors.white,
                  }}
                >
                  Invite a friend and get 1 month free premium
                </Text>
                <SettingButton
                  titleStyles={{ color: "#164951" }}
                  sbStyles={{
                    backgroundColor: colors.white,
                    width: "70%",
                    marginTop: "10%",
                  }}
                  title={"Invite a friend"}
                />
              </View>
              <FastImage
                resizeMode="contain"
                style={{ width: "35%", height: 90 }}
                source={require("../../assets/iconimages/Illustration.png")}
              />
            </View>
          </View>

          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontFamily: "Inter-Regular",
                color: colors.primaryBlue,
                marginTop: "5%",
              }}
            >
              Follow Us!
            </Text>
            <View style={{ width: "50%", marginVertical: "5%" }}>
              <SocialButton />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: "5%",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              marginVertical: "5%",
              width: "80%",
            }}
          >
            <Text
              onPress={() => handleUrl("terms-of-use")}
              style={{ color: "#374151", fontSize: 15 }}
            >
              Terms of Service
            </Text>
            <View style={styles.verticalLine}></View>
            <Text
              onPress={() => handleUrl("privacy-policy")}
              style={{ color: "#374151", fontSize: 15 }}
            >
              Privacy Policy
            </Text>
            {/* <View style={styles.verticalLine}></View> */}
            {/* <Text
              onPress={() => handleUrl('cookies-policy')}
              style={{color: colors.textGrey}}>
              Cookies Policy
            </Text> */}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Settings;
