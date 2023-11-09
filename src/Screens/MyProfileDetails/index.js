import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { windowWidth } from "../../utility/size";
import { useIsFocused } from "@react-navigation/native";

import styles from "./styles";
import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";
import Countries from "../../assets/countryLists/Countries";
import CountryFlag from "react-native-country-flag";
import CardCarousel from "../../modules/CardCarousel";
import ImageCarousel from "../../components/StorySlider/ImageCarousel";
import Icons from "../../utility/icons";

const MyProfileDetails = props => {
  const isFocused = useIsFocused();
  const { userData } = useSelector(store => store.userReducer);

  const ref1 = React.useRef(null);
  const [bioData, setBioData] = useState(null);
  const [index, setIndex] = useState(0);

  let userImages = [];
  let countryFlag = "";
  let originFlag = "";

  Countries.filter(country => {
    if (country.en == userData?.country) {
      countryFlag = country.code;
    }
    if (country.en == userData?.Profile?.familyOrigin) {
      originFlag = country.code;
    }
  });

  useEffect(() => {
    setBioData(userData);
  }, []);

  if (userData?.UserMedia.length > 0) {
    userData?.UserMedia.map(x => {
      if (x.type == "image") {
        userImages.push(x.url);
      }
    });
  }

  let languages = [];
  bioData ? languages.push(bioData?.UserLanguages?.map(x => x.language)) : null;

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
      <ScrollView>
        <View ref={ref1} style={styles.imgSection}>
          <View
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {isFocused ? (
              <ImageCarousel
                photosLength={userImages.length}
                imageUris={userImages}
                blurPhoto={true}
                currentIndex={setIndex}
              />
            ) : null}
          </View>

          <View style={styles.imgHeader}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("SearchPreferences")}
              style={styles.iconImg}
            >
              <FastImage
                style={{ height: "72%", width: "60%" }}
                source={require("../../assets/iconimages/heart-discover.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.nameView}>
            <Text numberOfLines={1} style={styles.name}>
              {bioData ? bioData.firstName : null}{" "}
            </Text>
            <Text style={styles.nameTxt}>
              {bioData
                ? `${bioData?.Profile?.age}, ${bioData?.Profile?.occupation}`
                : null}
            </Text>
          </View>

          <View style={styles.flagContainer}>
            <View style={styles.row1}>
              <CountryFlag
                isoCode={countryFlag}
                size={17}
                style={{ marginRight: 5 }}
              />
              <CountryFlag isoCode={originFlag} size={17} />
            </View>

            <View style={styles.row2}>
              <Icons.Ionicons
                name="location-outline"
                size={20}
                color={colors.textGrey1}
              />
              <Text style={styles.location}>
                {bioData?.city},{" "}
                {bioData?.country == "United States"
                  ? bioData?.address
                  : bioData?.country}
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
              {userData?.Profile?.tagline}
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
                  {bioData ? bioData.city : null}
                  {bioData
                    ? bioData?.country !== "Not Specified" &&
                      bioData?.country != "United States"
                      ? ", " + bioData?.country
                      : bioData?.country == "United States"
                      ? ", " + bioData?.address
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
                {bioData ? bioData.Profile.occupation : null}
              </Text>
            </View>
          </View>

          <View style={styles.matchingSection}>
            <Text style={styles.lookingForTxt}>Personality Insights</Text>
            <View style={styles.bulbSect}>
              <View style={styles.meView}>
                <Text style={styles.meTxt}>Me:</Text>
                <Capsule outlined title={bioData?.Profile?.personalityType} />
              </View>

              <View style={styles.bulbView}>
                <FastImage
                  style={{ height: "80%", width: "80%" }}
                  resizeMode="contain"
                  source={require("../../assets/iconimages/bulb.png")}
                />
              </View>

              <View style={[styles.meView, { marginLeft: "10%" }]} />
            </View>
          </View>

          <View style={styles.matchingSection}>
            <Text style={styles.lookingForTxt}>Vibes</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 12,
                alignItems: "flex-start",
                justifyContent: "flex-start",
                alignSelf: "flex-start",
              }}
            >
              {bioData != null &&
                bioData?.Profile?.vibes?.map((item, index) => {
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
        </View>

        <View style={{ width: windowWidth * 0.92, alignSelf: "center" }}>
          <CardCarousel user={userData} />
        </View>
        <View style={{ height: 20, width: "100%" }} />

        <View>
          {userData?.ProfilePrompts?.map((item, index) => {
            return (
              <View key={index} style={styles.lookingForSec}>
                <Text
                  style={[
                    styles.poolQuestTxt,
                    { marginTop: 15, marginLeft: 6 },
                  ]}
                >
                  {item?.Question?.title}
                </Text>
                <Text style={[styles.poolAnsTxt, { marginTop: 14 }]}>
                  {item?.answer}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileDetails;
