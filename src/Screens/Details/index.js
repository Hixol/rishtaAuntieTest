import React, { useState, useEffect, memo } from "react";
import {
  Text,
  View,
  ScrollView,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSelector, useDispatch } from "react-redux";
import { userDevice, windowHeight } from "../../utility/size";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useHelper } from "../../hooks/useHelper";

import styles from "./styles";
import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";
import CountryFlag from "react-native-country-flag";
import ActionCard from "../../components/Cards/ActionCard";
import UserService from "../../services/UserService";
import ImageCarousel from "../../components/StorySlider/ImageCarousel";
import CardCarousel from "../../modules/CardCarousel";
import DetailsSkeleton from "../../components/Skeleton/DetailsSkeleton";
import BottomImageInteraction from "../../components/Modal/BottomImageInteraction";
import BottomPromptInteraction from "../../components/Modal/BottomPropmtInteraction";
import Countries from "../../assets/countryLists/Countries";
import Icons from "../../utility/icons";
import ActionBottomModal from "../../components/Modal/ActionBottomModal";

const DetailScreen = (props) => {
  const tabBarHeight = useBottomTabBarHeight();
  const userDetails = props?.route?.params?.userDetails;
  const userId = props?.route?.params?.userId;

  let Images = [];
  const ref = React.useRef(null);
  const dispatch = useDispatch();
  const { Alerts, handleStatusCode } = useHelper();
  const { token, userData, status, focusedScreen } = useSelector(
    (store) => store.userReducer
  );
  const { personalityRes } = useSelector((store) => store.profileReducer);

  let [userImages, setUserImages] = useState();
  const [blockAlert, setBlockAlert] = useState(false);
  const [action, setAction] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const isFocused = useIsFocused();
  const [commentModal, setCommentModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [promptModal, setPromptModal] = useState(false);
  const [completeAlert, setCompleteAlert] = useState(false);
  const [modalType, setModalType] = useState("");
  const [index, setIndex] = useState(0);
  const [promptIndex, setPromptIndex] = useState();
  const [onBoardingCheck, setOnBoardingCheck] = useState(false);

  const handleReportAlert = (state) => {
    setAction(false);
    props?.navigation.navigate("ReportAccountScreen", {
      userId: userId,
      userName: userDetails?.firstName,
    });
  };

  const handleHomeScreen = () => {
    setBlockAlert(false);
    props?.navigation.jumpTo("HomeOne");
  };

  const handleBlockedScreen = (state) => {
    setBlockAlert(false);
    props?.navigation.navigate("BlockedList");
  };

  userDetails?.UserMedia?.map((item) => {
    if (item?.type === "image") {
      return Images.push({ id: item?.id, url: item?.url });
    } else {
      return null;
    }
  });

  Images = [...Images].sort((a, b) => a.id - b.id);

  const handleAlert = (state) => {
    setAction(state);
  };

  const handleBlockAlert = (state) => {
    setBlockAlert(state);
    setIsBlocked(state);
  };

  const userPhotosUrl = Images?.map((item) => {
    return item?.url;
  });

  const userPhotosId = Images?.map((item) => {
    return item?.id;
  });

  const viewIntercation = () => {
    UserService.viewIntercation(props?.route?.params?.userId, token)
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
        }
      })
      .catch((err) => console.log("viewIntercation err", err));
  };

  useFocusEffect(
    React.useCallback(() => {
      return viewIntercation();
    }, [props?.route?.params?.userId])
  );

  useEffect(() => {
    userDetails === null ||
    userDetails === undefined ||
    userDetails === "" ||
    userDetails.length === 0
      ? null
      : setUserImages(userDetails?.Profile?.profilePics);
  }, []);

  userImages ? (userImages = Object.values(userImages)) : null;

  const likeImageInteraction = () => {
    UserService.likeInteraction(
      {
        resourceId: userPhotosId ? userPhotosId[index] : null,
        resourceType: "USER_MEDIA",
        otherUserId: userId,
      },
      token
    )
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: "SET_DISCOVER_INDEX",
            payload: userId,
          });
          Alerts(
            "success",
            `You liked ${userDetails?.firstName}'s picture successfully`
          );
        }
      })
      .catch((error) => console.log("likeImageInteraction err", error));
  };

  const likeProfilePrompt = (item) => {
    UserService.likeInteraction(
      {
        resourceId: item?.id,
        resourceType: "PROFILE_PROMPT",
        otherUserId: userId,
      },
      token
    )
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: "SET_DISCOVER_INDEX",
            payload: userId,
          });
          Alerts(
            "success",
            `You liked ${userDetails?.firstName}'s profie prompt successfully`
          );
        }
      })
      .catch((error) => console.log("likeProfilePrompt err", error));
  };

  const handleBackButton = () => {
    if (imageModal || promptModal || action) {
      setImageModal(false);
      setPromptModal(false);
      setAction(false);
    } else if (focusedScreen) {
      dispatch({
        type: "SET_FOCUSED_SCREEN",
        payload: false,
      });
      BackHandler.exitApp();
    } else {
      props.navigation.goBack();
    }
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      if (
        commentModal == true ||
        imageModal === true ||
        promptModal == true ||
        action
      ) {
        dispatch({
          type: "AUTH_USER_SCREEN_INDEX",
          payload: false,
        });
      } else if (
        commentModal == false ||
        imageModal === false ||
        promptModal === false ||
        action == false
      ) {
        dispatch({
          type: "AUTH_USER_SCREEN_INDEX",
          payload: true,
        });
      }

      dispatch({
        type: "SET_FOCUSED_SCREEN",
        payload: false,
      });

      return () => {
        setOnBoardingCheck(false);
      };
    }, [commentModal || imageModal || promptModal, action])
  );

  useEffect(() => {
    const add = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => {
      add;
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [handleBackButton]);

  let country = props?.route?.params?.userDetails?.country;
  let fOrigin = props?.route?.params?.userDetails?.Profile?.familyOrigin;

  let flagsLiving = [];
  flagsLiving = Countries.filter((item) => {
    return item?.en === country ? item.code : null;
  });
  let flagsOrigin = [];
  flagsOrigin = Countries.filter((item) => {
    return item.en === fOrigin ? item.code : null;
  });

  const Capsule = ({ outlined, title, style, titleStyle }) => (
    <View
      style={[
        styles.capsule,
        style,
        outlined ? styles.outlined : styles.filled,
      ]}
    >
      <Text
        style={[styles.myvibes, titleStyle, !outlined && styles.whiteTitle]}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* {action === true && isBlocked == false ? (
        <ActionCard
          heading={'Profile Privacy'}
          handleReportAlert={handleReportAlert}
          handleBlockAlert={handleBlockAlert}
          handleAlert={handleAlert}
          alert={action}
          userId={userId}
          Alert={() => setAction(!action)}
          tabBarHeight={tabBarHeight}
          handleBlockedScreen={handleBlockedScreen}
          handleHomeScreen={handleHomeScreen}
        />
      ) : blockAlert === true && isBlocked == true ? (
        <ActionCard
          heading={`You Have Blocked ${userDetails?.firstName}`}
          handleBlockAlert={handleBlockAlert}
          handleAlert={handleAlert}
          blockAlert={blockAlert}
          tabBarHeight={tabBarHeight}
          handleBlockedScreen={handleBlockedScreen}
          Alert={() => setAction(!action)}
          userId={userId}
          handleHomeScreen={handleHomeScreen}
        />
      ) : null} */}
      <ScrollView ref={ref}>
        {/* IMAGE VIEW START */}
        {isFocused ? (
          <View>
            <View ref={ref} style={styles.imgSection}>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {isFocused ? (
                  <ImageCarousel
                    photosLength={userPhotosUrl?.length}
                    isPaused={imageModal ? true : false}
                    imageUris={userPhotosUrl}
                    onIconPress
                    onIconMicPress={(imageUri) => {
                      if (status === "INCOMPLETE") {
                        setOnBoardingCheck(true);
                      } else {
                        setImageModal(true);
                        setModalType("mic");
                        imageUri?.id;
                      }
                    }}
                    onIconCommentPress={() => {
                      if (status === "INCOMPLETE") {
                        setOnBoardingCheck(true);
                      } else {
                        isFocused == true;
                        setImageModal(true);
                        setModalType("comment");
                      }
                    }}
                    onIconHeartPress={() => {
                      if (status === "INCOMPLETE") {
                        setOnBoardingCheck(true);
                      } else {
                        likeImageInteraction();
                      }
                    }}
                    blurPhoto={true}
                    currentIndex={setIndex}
                  />
                ) : null}
              </View>

              <View style={styles.imgHeader}>
                <TouchableOpacity
                  onPress={() =>
                    props?.navigation.navigate("SearchPreferences")
                  }
                  style={styles.iconImg}
                >
                  <FastImage
                    style={{ height: "72%", width: "60%" }}
                    source={require("../../assets/iconimages/heart-discover.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    isBlocked ? setBlockAlert(true) : setAction(true)
                  }
                >
                  <Icons.MaterialCommunityIcons
                    name="dots-vertical"
                    size={34}
                    color={"white"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.nameView}>
                <Text numberOfLines={2} style={styles.name}>
                  {userDetails ? userDetails?.firstName : null}{" "}
                </Text>
                <Text style={styles.nameTxt}>
                  {userDetails
                    ? `${userDetails?.Profile?.age}, ${userDetails?.Profile?.occupation}`
                    : null}
                </Text>
              </View>

              <View style={styles.flagContainer}>
                <View style={styles.row1}>
                  <CountryFlag
                    isoCode={`${flagsLiving[0]?.code}`}
                    size={17}
                    style={{ marginRight: 5 }}
                  />
                  <CountryFlag isoCode={`${flagsOrigin[0]?.code}`} size={17} />
                </View>

                <View style={styles.row2}>
                  <Icons.Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.textGrey1}
                  />
                  <Text style={styles.location}>
                    {userDetails?.city}, {userDetails?.country}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text
                style={[
                  styles.myvibes,
                  {
                    paddingHorizontal: "4%",
                    marginTop: "5%",
                  },
                ]}
              >
                Details
              </Text>
              <View style={styles.analystSection}>
                <Text style={styles.statementTxt}>
                  {userDetails?.Profile?.tagline}
                </Text>
                <View style={styles.analystTxt}>
                  <View style={styles.analystFooter}>
                    <Icons.MaterialCommunityIcons
                      name="map-marker-outline"
                      size={30}
                      color={colors.blackBlue}
                    />
                    <Text
                      style={[
                        styles.locationTxt,
                        {
                          minWidth: "50%",
                          maxWidth: "70%",
                        },
                      ]}
                    >
                      {userDetails ? userDetails?.city : null}
                      {userDetails
                        ? userDetails?.country !== "Not Specified"
                          ? [", " + userDetails?.country]
                          : null
                        : null}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.locationTxt,
                      {
                        minWidth: "30%",
                        maxWidth: "40%",
                      },
                    ]}
                  >
                    {userDetails ? userDetails?.Profile.occupation : null}
                  </Text>
                </View>
              </View>

              {personalityRes != null &&
              userData?.Profile?.personalityType != null &&
              userDetails?.Profile?.personalityType != null ? (
                <View style={styles.matchingSection}>
                  <Text style={styles.lookingForTxt}>Personality Insights</Text>
                  <View style={styles.bulbSect}>
                    <View style={styles.meView}>
                      <Text style={styles.meTxt}>Me</Text>
                      <Capsule
                        outlined
                        title={userData?.Profile?.personalityType}
                      />
                    </View>

                    <View style={styles.bulbView}>
                      <FastImage
                        style={{ height: "80%", width: "80%" }}
                        resizeMode="contain"
                        source={require("../../assets/iconimages/bulb.png")}
                      />
                    </View>

                    <View style={styles.meView}>
                      <Text numberOfLines={1} style={styles.meTxt}>
                        {userDetails ? userDetails?.firstName : null}
                      </Text>
                      <Capsule title={userDetails?.Profile?.personalityType} />
                    </View>
                  </View>

                  <View style={styles.lookingForFooter}>
                    <Text style={styles.matchingDesc}>{personalityRes}</Text>
                  </View>
                </View>
              ) : null}
              <View style={styles.matchingSection}>
                <Text style={styles.lookingForTxt}>Vibes</Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: "1%",
                  }}
                >
                  {userDetails != null &&
                    userDetails?.Profile?.vibes?.map((item, index) => {
                      return (
                        <Capsule
                          outlined
                          title={item}
                          style={{ margin: 3 }}
                          titleStyle={{ fontSize: 14 }}
                        />
                      );
                    })}
                </View>
              </View>
              {/* <View style={styles.myVibesSection}>
                <Text style={styles.myvibes}>Vibes</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: '5%',
                    marginHorizontal: '1%',
                    backgroundColor: colors.white,
                    paddingHorizontal: '3%',
                    paddingVertical: '2%',
                    borderRadius: 10,
                  }}>
                  {userDetails != null &&
                    userDetails?.Profile?.vibes?.map((item, index) => {
                      return (
                        <View key={index} style={styles.ambBtn}>
                          <Text style={styles.ambitiousBttn}>{item}</Text>
                        </View>
                      );
                    })}
                </View>
              </View> */}
            </View>

            <CardCarousel user={userDetails} />
            <View style={{ height: 20, width: "100%" }}></View>

            <View>
              {userDetails?.ProfilePrompts?.map((item) => {
                return (
                  <View style={styles.lookingForSec}>
                    <Text style={styles.poolQuestTxt}>
                      {item?.Question?.title}
                    </Text>
                    <Text style={styles.poolAnsTxt}>{item?.answer}</Text>
                    <View style={styles.cardFooter}>
                      <TouchableOpacity
                        onPress={() => {
                          if (status === "INCOMPLETE") {
                            setOnBoardingCheck(true);
                          } else {
                            setPromptModal(true);
                            setPromptIndex(item);
                            setModalType("mic");
                          }
                        }}
                        style={[styles.actionIcon, styles.actionbtnShadow]}
                      >
                        <FastImage
                          source={require("../../assets/iconimages/mic.png")}
                          style={{ height: "76%", width: "76%" }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          if (status === "INCOMPLETE") {
                            setOnBoardingCheck(true);
                          } else {
                            setPromptModal(true);
                            setPromptIndex(item);
                            setModalType("comment");
                          }
                        }}
                        style={[styles.actionIcon, styles.actionbtnShadow]}
                      >
                        <FastImage
                          source={require("../../assets/iconimages/chat.png")}
                          style={{ height: "54%", width: "54%" }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          if (status === "INCOMPLETE") {
                            setOnBoardingCheck(true);
                          } else {
                            likeProfilePrompt(item);
                          }
                        }}
                        style={[styles.actionIcon, styles.actionbtnShadow]}
                      >
                        <FastImage
                          source={require("../../assets/iconimages/heart.png")}
                          style={{ height: "54%", width: "54%" }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <DetailsSkeleton />
        )}
      </ScrollView>
      {onBoardingCheck ? (
        <>
          <View
            style={{
              flex: 1,
              width: "100%",
              height: windowHeight * 1,
              zIndex: 1,
              position: "absolute",
              backgroundColor: colors.black,
              opacity: 0.8,
            }}
          ></View>
          <Pressable
            onPress={() => setOnBoardingCheck(false)}
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
                Please complete your profile to interact with other users, thank
                you!
              </Text>

              <TouchableOpacity
                onPress={() => props.navigation.navigate("OnBoardingQuestions")}
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
                onPress={() => setOnBoardingCheck(false)}
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
            userId={userId}
            userName={userDetails?.firstName}
            userPhotosId={userPhotosId[index]}
            userMediaVideo={null}
            onDismiss={() => setImageModal(false)}
            fastImage={userPhotosUrl[index]}
            toggle={imageModal}
            setToggle={setImageModal}
            modalType={modalType}
            offset={userDevice.includes("Pro Max") ? 75 : 70}
          />
        </GestureHandlerRootView>
      ) : promptModal ? (
        <GestureHandlerRootView
          style={{
            width: "100%",
            backgroundColor: "#00000061",
            height: promptModal ? windowHeight * 1 : 0,
            bottom: 0,
            position: "absolute",
            zIndex: 1,
          }}
        >
          <BottomPromptInteraction
            userId={userId}
            userName={userDetails?.firstName}
            onDismiss={() => setPromptModal(false)}
            item={promptIndex}
            toggle={promptModal}
            modalType={modalType}
            setToggle={setPromptModal}
            offset={userDevice.includes("Pro Max") ? 75 : 70}
          />
        </GestureHandlerRootView>
      ) : action ? (
        <ActionBottomModal
          user={{
            userId,
            userName: userDetails?.firstName,
          }}
          toggle={action}
          setAction={setAction}
          onDismiss={() => setAction(false)}
        />
      ) : null}
    </SafeAreaView>
  );
};
export default memo(DetailScreen);
