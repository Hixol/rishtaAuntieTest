import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native";
import { calculateDateAndTime } from "../../utility/regex";

import styles from "./styles";
import CountryFlag from "react-native-country-flag";
import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";
import Countries from "../../assets/countryLists/Countries";

const BeforeFlip = props => {
  const [loading, setLoading] = useState(false);

  let flagsLiving = null;

  Countries.filter(country => {
    if (
      "otherUser" in props.item &&
      props.item.otherUser.country !== null &&
      country.en == props.item.otherUser.country
    ) {
      flagsLiving = country.code;
    } else if ("User" in props.item && props.item.User.country != null && country.en == props.item.User.country) {
      flagsLiving = country.code;
    } else if ("user" in props.item && props.item.user.country != null && country.en == props.item.user.country) {
      flagsLiving = country.code;
    } else if (
      "vieweeUser" in props.item &&
      props.item.vieweeUser.country != null &&
      country.en == props.item.vieweeUser.country
    ) {
      flagsLiving = country.code;
    }
  });

  return (
    <TouchableOpacity onPress={props.beforeFlipPress} style={styles.shadowContainer}>
      {loading && <ActivityIndicator animating color={colors.primaryPink} size="small" style={styles.indicator} />}
      <ImageBackground
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={styles.imgBg}
        resizeMode="cover"
        imageStyle={{ borderRadius: 36 }}
        source={
          props.resourceType === "USER_MEDIA" ? props.Image : props.resourceType ? props.promptImage : props.Image
        }>
        <View style={styles.overlay} />

        <View style={styles.infoContainer}>
          <Text numberOfLines={2} style={styles.nameAgeTxt}>
            {props.Bname}
            {props.age}
          </Text>
          <Text style={styles.locationTxt}>{props.Blocation}</Text>
          <Text style={styles.daysTxt}>{calculateDateAndTime(props.createdAt)}</Text>
          <View style={styles.flagsContainer}>
            <CountryFlag isoCode={flagsLiving} size={18} />
            <CountryFlag isoCode="de" size={18} />
          </View>
        </View>

        <TouchableOpacity onPress={props.onPress1} style={styles.diagonalContainer}>
          <View style={styles.diagonalInnerContainer}>
            <Text style={styles.viewTxt}>View More</Text>
            <FastImage
              resizeMode="contain"
              style={styles.viewArrow}
              source={require("../../assets/iconimages/viewMoreArrow.png")}
            />
          </View>
        </TouchableOpacity>

        {/* <View
          style={{
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            right: 0,
            width: '40%',
            height: '30%',
            backgroundColor: 'orange',
            borderRadius: 36,
          }}>
          <FastImage
            resizeMode="contain"
            style={{
              width: '100%',
              height: '100%',
              bottom: 0,
              right: 0,
              position: 'absolute',
            }}
            source={require('../../assets/iconimages/viewMore.png')}
          />
        </View> */}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default BeforeFlip;
