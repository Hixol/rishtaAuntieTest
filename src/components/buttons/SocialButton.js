import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";
import analytics from "@react-native-firebase/analytics";

const SocialButton = props => {
  const openLink = (url, platform) => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          // Log the social media button click event in Firebase Analytics
          analytics().logEvent("social_media_click", {
            platform: platform,
          });

          Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  return (
    <View>
      <View style={styles.container}>
        {props.followUs ? (
          <Text style={styles.followText}>Follow Us:</Text>
        ) : null}
        <TouchableOpacity
          onPress={() =>
            openLink("https://www.instagram.com/rishtaauntieapp", "Instagram")
          }
        >
          <FastImage
            resizeMode="contain"
            style={styles.iconSize}
            source={require("../../assets/iconimages/settingIg.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            openLink("https://www.facebook.com/rishtaauntieapp", "Facebook")
          }
        >
          <FastImage
            resizeMode="contain"
            style={{
              height: 31,
              width: 31,
            }}
            source={require("../../assets/iconimages/settingfb.png")}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
        //  onPress={() => openLink('https://www.twitter.com/rishtaauntieapp', "Twitter")}
        >
          <FastImage
            resizeMode="contain"
            style={styles.iconSize}
            source={require("../../assets/iconimages/settingtw.png")}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    marginHorizontal: "5%",
  },
  followText: {
    color: colors.primaryBlue,
    fontSize: 20,
    fontFamily: "Inter-Regular",
    alignSelf: "center",
  },
  iconSize: { height: 32, width: 32 },
});
