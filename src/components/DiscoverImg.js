import React, { useState, useEffect, memo } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  ios,
  OS_VER,
  windowHeight,
  windowWidth,
  screenHeight,
} from "../utility/size";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FastImage from "react-native-fast-image";
import CountryFlag from "react-native-country-flag";
import ActionButton from "./buttons/FloatingActionButton";
import Video from "react-native-video";
import convertToProxyURL from "react-native-video-cache";
import colors from "../utility/colors";
import Icons from "../utility/icons";
import Countries from "../assets/countryLists/Countries";

const DiscoverImg = ({
  item,
  userId,
  images,
  video,
  paused,
  pausedButton,
  isFocused,
  tabBarHeight,
  searchPress,
  onPressCommentInteraction,
  onPressVoiceInteraction,
  onPressLikeInteraction,
  onDotsPress,
  check,
}) => {
  const insets = useSafeAreaInsets();

  let adjustHeight = 0;
  let flagsLiving = null;
  let flagsOrigin = null;
  let countryCode = null;
  const [isPreloading, setIsPreloading] = useState(false);
  const [isPreloadingImage, setIsPreloadingImage] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPausedButton, setIsPausedButton] = useState(false);

  const pausePlay = () => {
    setIsPausedButton(!isPausedButton);
    setIsPaused(!isPaused);
  };
  useEffect(() => {
    if (check) {
      setIsPaused(true);
      setIsPausedButton(false);
    } else {
      userId === item.id && isFocused === true && paused
        ? setIsPaused(false)
        : setIsPaused(true);
    }

    pausedButton === false ? setIsPausedButton(false) : setIsPausedButton(true);
  }, [userId, isFocused, check]);

  Countries.filter(country => {
    if (country.en == item.country) {
      flagsLiving = country.code;
    }
    if (country.en == item.Profile?.familyOrigin) {
      flagsOrigin = country.code;
    }
    if (
      item.country == "United States" &&
      item.address?.toLowerCase() == country.name?.toLowerCase()
    ) {
      countryCode = country.abbreviation;
    }
  });

  if (screenHeight - windowHeight > 0) {
    adjustHeight = windowHeight - tabBarHeight - 24 + 24;
  } else {
    adjustHeight = windowHeight - tabBarHeight - 24;
  }
  return (
    <>
      <Pressable
        onPress={() => pausePlay()}
        style={[
          styles.container,
          {
            height:
              (windowHeight <= 640 || windowHeight < 790) &&
              !(windowHeight <= 770)
                ? adjustHeight
                : (windowHeight < 755 || windowHeight < 880) &&
                  !(
                    windowHeight <= 770 ||
                    (windowHeight > 830 && windowHeight < 845)
                  ) &&
                  OS_VER == 13
                ? adjustHeight
                : ios
                ? windowHeight - tabBarHeight - insets.top
                : windowHeight - tabBarHeight,
          },
        ]}
      >
        {video?.length > 0 ? (
          <>
            <View>
              {isPreloading && (
                <ActivityIndicator
                  animating
                  color={colors.primaryPink}
                  size="large"
                  style={{
                    flex: 1,
                    position: "absolute",
                    top: "50%",
                    left: "45%",
                    zIndex: 1,
                  }}
                />
              )}
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  position: "absolute",
                }}
              >
                <FastImage
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                  source={require("../assets/iconimages/opacity-02.png")}
                />
              </View>
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
                }}
                source={{
                  uri: convertToProxyURL(video[0]?.url),
                }}
              />
              {isPausedButton ? (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    opacity: 0.4,
                  }}
                >
                  <FastImage
                    resizeMode="contain"
                    source={require("../assets/iconimages/playIcon.png")}
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                </View>
              ) : null}
            </View>
          </>
        ) : (
          <View>
            {isPreloadingImage && (
              <ActivityIndicator
                animating
                color={colors.primaryPink}
                size="large"
                style={{
                  flex: 1,
                  position: "absolute",
                  top: "50%",
                  left: "45%",
                  zIndex: 1,
                }}
              />
            )}
            <View
              style={{
                width: "100%",
                height: "100%",
                zIndex: 1,
                position: "absolute",
              }}
            >
              <FastImage
                resizeMode="cover"
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
                source={require("../assets/iconimages/opacity-02.png")}
              />
            </View>
            <FastImage
              onLoadStart={() => setIsPreloadingImage(true)}
              onLoadEnd={() => setIsPreloadingImage(false)}
              source={
                images === undefined
                  ? "https://images.unsplash.com/photo-1657214059264-99456d9aae24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  : { uri: images }
              }
              style={{ width: "100%", height: "100%", zIndex: 0 }}
            />
          </View>
        )}
        <View style={styles.imgHeader}>
          <TouchableOpacity style={styles.iconImg} onPress={searchPress}>
            <FastImage
              style={{ height: "72%", width: "60%" }}
              source={require("../assets/iconimages/heart-discover.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDotsPress}>
            <Icons.MaterialCommunityIcons
              name="dots-vertical"
              size={34}
              color={"white"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imgFooter}>
          <View
            style={{
              alignItems: "flex-end",
              bottom: 120,
            }}
          >
            <ActionButton
              onPressCommentInteraction={onPressCommentInteraction}
              onPressVoiceInteraction={onPressVoiceInteraction}
              onPressLikeInteraction={onPressLikeInteraction}
              imageRound={images}
            />
          </View>

          <Text numberOfLines={1} style={styles.nameTxt}>
            {item.firstName}
          </Text>
          <Text
            style={[
              styles.analystTxt,
              {
                width: "80%",
              },
            ]}
          >
            {item.Profile.age}, {item.Profile.occupation}
          </Text>

          {/* <Text style={styles.statementTxt}>{item.Profile.tagline}</Text> */}
          <View style={styles.lastFooter}>
            <View style={styles.flagContainer}>
              <CountryFlag isoCode={`${flagsLiving}`} size={18} />
              <View style={{ marginLeft: "20%" }}>
                <CountryFlag isoCode={`${flagsOrigin}`} size={18} />
              </View>
            </View>
            <View
              style={{
                width: "10%",
                height: 20,
              }}
            ></View>
            <View style={styles.location}>
              <Icons.Ionicons
                name="location-outline"
                size={20}
                color={colors.textGrey1}
              />
              <Text style={[styles.name, { width: "60%" }]}>
                {item.city},{" "}
                {item.country == "United States" ? countryCode : item.country}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
  },
  imgHeader: {
    position: "absolute",
    padding: "1%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    zIndex: 3,
  },
  imgFooter: {
    bottom: 0,
    width: "100%",
    paddingBottom: "3%",
    paddingHorizontal: "3%",
    zIndex: 3,
    position: "absolute",
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "15%",
  },
  name: {
    marginLeft: "2%",
    fontSize: 16,
    color: "white",
    width: "80%",
    fontFamily: "Inter-Medium",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  lastFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2%",
  },
  circularImg: {
    position: "absolute",
    backgroundColor: "white",
    height: windowHeight * 0.075,
    width: windowHeight * 0.075,
    borderRadius: 50,
    borderWidth: 1.3,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    alignSelf: "flex-end",
    height: windowHeight * 0.12,
    width: windowHeight * 0.12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  nameTxt: {
    color: "white",
    fontSize: 24,
    // alignSelf: 'center',
    fontFamily: "Inter-SemiBold",
  },
  statementTxt: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  analystTxt: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-Medium",
    width: "17%",
  },
  iconImg: {
    height: windowHeight * 0.055,
    width: windowHeight * 0.055,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(DiscoverImg);
