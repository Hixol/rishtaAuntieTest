import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ios, windowHeight, windowWidth, screenHeight, OS_VER } from "../utility/size";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FastImage from "react-native-fast-image";
import CountryFlag from "react-native-country-flag";
import Video from "react-native-video";
import convertToProxyURL from "react-native-video-cache";
import Countries from "../assets/countryLists/Countries";
import Icons from "../utility/icons";
import colors from "../utility/colors";

const DiscoverProfile = ({
  item,
  tabBarHeight,
  video,
  image,
  userName,
  city,
  address,
  country,
  fOrigin,
  occupation,
  tagline,
  age,
  isFocused
}) => {
  const insets = useSafeAreaInsets();

  let adjustHeight = 0;
  let flagsLiving = null;
  let flagsOrigin = null;
  let countryCode = null;
  const navigation = useNavigation();
  const [isPaused, setIsPaused] = useState(true);
  const [isPausedButton, setIsPausedButton] = useState(true);

  const pausePlay = () => {
    setIsPausedButton(!isPausedButton);
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (isFocused == true) {
      setIsPaused(true);
      setIsPausedButton(true);
    } else {
      setIsPaused(true);
      setIsPausedButton(true);
    }
  }, [isFocused]);

  Countries.filter(item => {
    if (country != null && item.en == country) {
      flagsLiving = item.code;
    }
    if (fOrigin != null && item.en == fOrigin) {
      flagsOrigin = item.code;
    }
    if (country == "United States" && address?.toLowerCase() == item.name?.toLowerCase()) {
      countryCode = item.abbreviation;
    }
  });

  if (screenHeight - windowHeight > 0) {
    adjustHeight = windowHeight - tabBarHeight - 56 - 24 + 24;
  } else {
    adjustHeight = windowHeight - tabBarHeight - 56 - 24;
  }

  return (
    <Pressable
      onPress={() => pausePlay()}
      style={[
        styles.container,
        {
          height:
            (windowHeight <= 640 || windowHeight < 790) && !(windowHeight <= 770)
              ? adjustHeight
              : (windowHeight < 755 || windowHeight < 880) &&
                !(windowHeight <= 770 || (windowHeight > 830 && windowHeight < 845)) &&
                OS_VER == 13
              ? adjustHeight
              : ios
              ? windowHeight - tabBarHeight - 44 - insets.top
              : windowHeight - tabBarHeight - 56
        }
      ]}>
      {video ? (
        <View>
          <View
            style={{
              width: "100%",
              height: "100%",
              zIndex: 1,
              position: "absolute"
            }}>
            <FastImage
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden"
              }}
              source={require("../assets/iconimages/opacity-02.png")}
            />
          </View>
          <Video
            resizeMode={"cover"}
            repeat={true}
            playInBackground={false}
            playWhenInactive={false}
            paused={isPaused}
            style={{
              width: "100%",
              height: "100%"
            }}
            source={{ uri: video.split("?")[0] }}
          />
          {isPausedButton ? (
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                opacity: 0.4
              }}>
              <FastImage
                resizeMode="contain"
                source={require("../assets/iconimages/playIcon.png")}
                style={{
                  width: 60,
                  height: 60
                }}
              />
            </View>
          ) : null}
        </View>
      ) : (
        <FastImage source={{ uri: image }} style={{ width: "100%", height: "100%" }} />
      )}
      <View style={styles.imgHeader}>
        <TouchableOpacity style={styles.iconImg} onPress={() => navigation.navigate("SearchPreferences")}>
          <FastImage
            style={{ height: "72%", width: "60%" }}
            source={require("../assets/iconimages/heart-discover.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imgFooter}>
        <Text numberOfLines={1} style={styles.nameTxt}>
          {userName}
        </Text>
        <Text
          style={[
            styles.analystTxt,
            {
              width: "80%"
            }
          ]}>
          {age}, {occupation}
        </Text>

        {/* <Text style={styles.statementTxt}>{tagline}</Text> */}
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
              height: 20
            }}
          />
          <View style={styles.location}>
            <Icons.Ionicons name="location-outline" size={20} color={colors.textGrey1} />
            <Text style={[styles.name, { width: "60%" }]}>
              {city}, {country == "United States" ? countryCode : country}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth
  },
  imgHeader: {
    position: "absolute",
    padding: "1%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    zIndex: 3
  },
  imgFooter: {
    bottom: 0,
    width: "100%",
    paddingBottom: "3%",
    paddingHorizontal: "3%",
    zIndex: 3,
    position: "absolute"
  },
  occupation: {
    width: "28%",
    alignItems: "center",
    justifyContent: "center"
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "15%"
  },
  name: {
    marginLeft: "2%",
    fontSize: 16,
    color: "white",
    width: "80%",
    fontFamily: "Inter-Medium"
  },
  nameView: {
    position: "absolute",
    zindex: 1,
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%"
  },
  lastFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2%"
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
    justifyContent: "center"
  },
  textWrap: {
    alignSelf: "flex-end",
    height: windowHeight * 0.12,
    width: windowHeight * 0.12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  nameTxt: {
    color: "white",
    fontSize: 24,
    // alignSelf: "center",
    fontFamily: "Inter-SemiBold"
  },
  statementTxt: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-Regular"
  },
  analystTxt: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-Medium",
    width: "17%"
  },
  iconImg: {
    height: windowHeight * 0.055,
    width: windowHeight * 0.055,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default DiscoverProfile;
