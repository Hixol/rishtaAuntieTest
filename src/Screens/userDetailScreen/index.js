import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { windowHeight, windowWidth } from "../../utility/size";
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

const UserDetailScreen = props => {
  const userId =
    props?.props?.route?.params?.el.ChatMembers[0].User.id ||
    props?.route?.params?.userId;

  const ref = useRef(null);
  const dispatch = useDispatch();
  const { Alerts, handleStatusCode, navigation } = useHelper();
  const { token, userData, focusedScreen } = useSelector(
    store => store.userReducer
  );
  const { personalityRes } = useSelector(store => store.profileReducer);

  const unmatch = props?.route?.params?.unmatch || null;
  const [blockAlert, setBlockAlert] = useState(false);
  const [action, setAction] = useState(false);
  let [userImages, setUserImages] = useState();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allDetails, setAllDetails] = useState(null);
  const isFocused = useIsFocused();
  const [commentModal, setCommentModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [promptModal, setPromptModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [index, setIndex] = useState(0);
  const [promptIndex, setPromptIndex] = useState(null);

  const handleReportAlert = state => {
    setAction(false);
    props.navigation.navigate("ReportAccountScreen", {
      userId: userId,
      userName: allDetails?.firstName,
    });
  };

  const handleHomeScreen = () => {
    setBlockAlert(false);
    props?.navigation.navigate("HomeOne");
  };

  const handleBlockedScreen = state => {
    setBlockAlert(false);
    props.navigation.navigate("BlockedList");
  };

  const Images = [];
  allDetails?.UserMedia?.map(item => {
    if (item?.type === "image") {
      return Images.push({ id: item?.id, url: item?.url });
    } else {
      return null;
    }
  });
  const handleAlert = state => {
    setAction(state);
  };

  const handleBlockAlert = state => {
    setBlockAlert(state);
    setIsBlocked(state);
  };

  const userPhotosUrl = Images?.map(item => {
    return item?.url;
  });

  const userPhotosId = Images?.map(item => {
    return item?.id;
  });

  useEffect(() => {
    allDetails === null ||
    allDetails === undefined ||
    allDetails === "" ||
    allDetails.length === 0
      ? null
      : setUserImages(allDetails?.Profile?.profilePics);
  }, []);

  useEffect(() => {
    setLoading(true);
    UserService.getOtherUserDetail(userId, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setAllDetails(res.data.data);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
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
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          Alerts(
            "success",
            `You liked ${allDetails?.firstName}'s picture successfully`
          );
        }
      })
      .catch(error => console.log("likeImageInteraction err", error));
  };

  const likeProfilePrompt = item => {
    UserService.likeInteraction(
      {
        resourceId: item?.id,
        resourceType: "PROFILE_PROMPT",
        otherUserId: userId,
      },
      token
    )
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          Alerts(
            "success",
            `You liked ${allDetails?.firstName}'s profie prompt successfully`
          );
        }
      })
      .catch(error => console.log("likeProfilePrompt err", error));
  };

  useEffect(() => {
    if (commentModal || imageModal || promptModal || action) {
      {
        dispatch({
          type: "AUTH_USER_SCREEN_INDEX",
          payload: false,
        });
      }
    } else if (
      commentModal == false ||
      imageModal == false ||
      promptModal == false ||
      action == false
    ) {
      {
        dispatch({
          type: "AUTH_USER_SCREEN_INDEX",
          payload: true,
        });
      }
    }
  }, [commentModal || imageModal || promptModal, action]);

  let address = allDetails?.address;
  let country = allDetails?.country;
  let fOrigin = allDetails?.Profile?.familyOrigin;

  let flagsLiving = null;
  let flagsOrigin = null;
  let countryCode = null;

  Countries.filter(item => {
    if (item.en == country) {
      flagsLiving = item.code;
    }
    if (item.en == fOrigin) {
      flagsOrigin = item.code;
    }
    if (
      country == "United States" &&
      address?.toLowerCase() == item.name?.toLowerCase()
    ) {
      countryCode = item.abbreviation;
    }
  });

  const handleBackButton = () => {
    if (imageModal || promptModal || action) {
      setImageModal(false);
      setPromptModal(false);
      setAction(false);
    } else {
      navigation.goBack();
    }
    return true;
  };

  const handleUnmatchUser = () => {
    UserService.unmatchUser(userId, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          Alerts("success", res?.data?.message);
        }
      })
      .catch(err => Alerts("error", err?.message.toString()))
      .finally(() => setAction(false));
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [handleBackButton]);

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
    <>
      <>
        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={"large"} color={colors.primaryPink} />
          </View>
        ) : (
          <SafeAreaView style={styles.container}>
            {/* {action === true && isBlocked == false ? (
              <ActionCard
                heading={'Profile Privacy'}
                unmatch={unmatch ? true : false}
                handleUnmatchUser={handleUnmatchUser}
                handleReportAlert={handleReportAlert}
                handleBlockAlert={handleBlockAlert}
                handleAlert={handleAlert}
                alert={action}
                Alert={() => setAction(!action)}
                userId={userId}
                tabBarHeight={46.18}
                handleBlockedScreen={handleBlockedScreen}
                handleHomeScreen={handleHomeScreen}
              />
            ) : blockAlert === true && isBlocked == true ? (
              <ActionCard
                heading={`You Have Blocked ${allDetails?.firstName}`}
                unmatch={unmatch ? true : false}
                handleUnmatchUser={handleUnmatchUser}
                handleBlockAlert={handleBlockAlert}
                handleAlert={handleAlert}
                blockAlert={blockAlert}
                tabBarHeight={46.18}
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
                          onIconMicPress={imageUri => {
                            setImageModal(true);
                            setModalType("mic");
                            imageUri?.id;
                          }}
                          onIconCommentPress={imageUri => {
                            isFocused == true;
                            setImageModal(true);
                            setModalType("comment");
                          }}
                          onIconHeartPress={() => likeImageInteraction()}
                          blurPhoto={true}
                          currentIndex={setIndex}
                        />
                      ) : null}
                    </View>

                    <View style={styles.imgHeader}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("SearchPreferences")}
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
                      <Text numberOfLines={1} style={styles.name}>
                        {allDetails ? allDetails?.firstName : null}{" "}
                      </Text>
                      <Text style={styles.nameTxt}>
                        {allDetails
                          ? `${allDetails?.Profile?.age}, ${allDetails?.Profile?.occupation}`
                          : null}
                      </Text>
                    </View>

                    <View style={styles.flagContainer}>
                      <View style={styles.row1}>
                        <CountryFlag
                          isoCode={`${flagsLiving}`}
                          size={17}
                          style={{ marginRight: 5 }}
                        />
                        <CountryFlag isoCode={`${flagsOrigin}`} size={17} />
                      </View>

                      <View style={styles.row2}>
                        <Icons.Ionicons
                          name="location-outline"
                          size={20}
                          color={colors.textGrey1}
                        />
                        <Text style={styles.location}>
                          {allDetails?.city},{" "}
                          {allDetails?.country == "United States"
                            ? countryCode
                            : allDetails?.country}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    <View style={styles.analystSection}>
                      <Text style={styles.tagTxt}>
                        {allDetails?.Profile?.tagline}
                      </Text>
                    </View>

                    {personalityRes != null &&
                    userData?.Profile?.personalityType != null &&
                    allDetails?.Profile?.personalityType != null ? (
                      <View style={styles.matchingSection}>
                        <Text style={styles.lookingForTxt}>
                          Personality Insights
                        </Text>
                        <View style={styles.bulbSect}>
                          <View style={styles.meView}>
                            <Text style={styles.meTxt}>Me:</Text>
                            <Capsule
                              outlined
                              title={userData?.Profile?.personalityType}
                            />
                          </View>

                          <View style={styles.bulbView}>
                            <FastImage
                              style={{ height: "80%", width: "100%" }}
                              resizeMode="contain"
                              source={require("../../assets/iconimages/bulb.png")}
                            />
                          </View>

                          <View style={styles.meView}>
                            <Text numberOfLines={1} style={styles.meTxt}>
                              {allDetails ? allDetails?.firstName : null}
                            </Text>
                            <Capsule
                              title={allDetails?.Profile?.personalityType}
                            />
                          </View>
                        </View>

                        <View style={styles.lookingForFooter}>
                          <Text style={styles.matchingDesc}>
                            {personalityRes}
                          </Text>
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
                        {allDetails != null &&
                          allDetails?.Profile?.vibes?.map((item, index) => {
                            return (
                              <Capsule
                                key={index}
                                outlined
                                title={item}
                                style={{ margin: 3 }}
                                titleStyle={{ fontSize: 14 }}
                              />
                            );
                          })}
                      </View>
                    </View>
                  </View>

                  <View
                    style={{ width: windowWidth * 0.92, alignSelf: "center" }}
                  >
                    <CardCarousel user={allDetails} />
                  </View>
                  <View style={{ height: 20, width: "100%" }}></View>
                  <View>
                    {allDetails?.ProfilePrompts?.map(item => {
                      return (
                        <View style={styles.lookingForSec}>
                          <Text style={styles.poolQuestTxt}>
                            {item?.Question?.title}
                          </Text>
                          <Text style={styles.poolAnsTxt}>{item?.answer}</Text>
                          <View style={styles.cardFooter}>
                            <TouchableOpacity
                              onPress={() => {
                                setPromptModal(true);
                                setPromptIndex(item);
                                setModalType("mic");
                              }}
                              style={[
                                styles.actionIcon,
                                styles.actionbtnShadow,
                              ]}
                            >
                              <FastImage
                                source={require("../../assets/iconimages/mic.png")}
                                style={{ height: "76%", width: "76%" }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setPromptModal(true);
                                setPromptIndex(item);
                                setModalType("comment");
                              }}
                              style={[
                                styles.actionIcon,
                                styles.actionbtnShadow,
                              ]}
                            >
                              <FastImage
                                source={require("../../assets/iconimages/chat.png")}
                                style={{ height: "54%", width: "54%" }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => likeProfilePrompt(item)}
                              style={[
                                styles.actionIcon,
                                styles.actionbtnShadow,
                              ]}
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
                  userName={allDetails?.firstName}
                  userPhotosId={userPhotosId[index]}
                  userMediaVideo={null}
                  onDismiss={() => setImageModal(false)}
                  fastImage={userPhotosUrl[index]}
                  toggle={imageModal}
                  setToggle={setImageModal}
                  modalType={modalType}
                  offset={0}
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
                  userName={allDetails?.firstName}
                  onDismiss={() => setPromptModal(false)}
                  item={promptIndex}
                  toggle={promptModal}
                  modalType={modalType}
                  offset={0}
                />
              </GestureHandlerRootView>
            ) : null}
            {action ? (
              <ActionBottomModal
                user={{
                  userId,
                  userName: allDetails?.firstName,
                }}
                toggle={action}
                setAction={setAction}
                onDismiss={() => setAction(false)}
              />
            ) : null}
          </SafeAreaView>
        )}
      </>
    </>
  );
};
export default UserDetailScreen;
