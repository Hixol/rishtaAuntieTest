import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableNativeFeedback } from "react-native";
import { WIDTH, HEIGHT } from "../../constants/Constants";
import { useNavigation } from "@react-navigation/native";
import Stories from "./Stories";
import Colors from "../../constants/Colors";
import FastImage from "react-native-fast-image";

export default function ImageCarousel({
  imageUris,
  onIconMicPress,
  onIconPress,
  onIconCommentPress,
  onIconHeartPress,
  blurPhoto,
  currentIndex,
  photosLength,
  isPaused,
}) {
  const [index, setIndex] = useState(0);
  const [images, setimages] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    setimages(
      imageUris
        .map((im, i) => {
          if (im !== "") {
            return {
              id: i,
              url: im,
              type: "image",
              duration: 2,
              isSeen: false,
              isReadMore: true,
              isPaused: true,
            };
          }
        })
        .filter(a => a)
    );
  }, [imageUris]);
  return (
    <View style={styles.container}>
      <Stories
        photosLength={photosLength}
        isPaused={isPaused}
        blurView={blurPhoto}
        imageCurrentIndex={currentIndex}
        images={images}
      />
      <View
        style={{
          zIndex: 2,
          position: "absolute",
          width: "20%",
          alignItems: "center",
          justifyContent: "space-evenly",
          position: "absolute",
          bottom: 50,
          height: HEIGHT * 0.23,
          right: 15,
          zIndex: 1,
        }}
      >
        {onIconPress && (
          <View style={styles.buttonContainer}>
            <FAB
              renderIcon={() => (
                <FastImage
                  resizeMode="contain"
                  style={{ width: "76%", height: "76%" }}
                  source={require("../../assets/iconimages/mic.png")}
                />
              )}
              onPress={() => {
                onIconMicPress(images[index]);
              }}
            />
            <FAB
              renderIcon={() => (
                <FastImage
                  resizeMode="contain"
                  style={{ width: "54%", height: "54%" }}
                  source={require("../../assets/iconimages/chat.png")}
                />
              )}
              onPress={() => {
                onIconCommentPress(images[index]);
              }}
            />
            <FAB
              renderIcon={() => (
                <FastImage
                  resizeMode="contain"
                  style={{ width: "54%", height: "54%" }}
                  source={require("../../assets/iconimages/heart.png")}
                />
              )}
              onPress={() => {
                onIconHeartPress(images[index]);
                navigation.goBack(); // Navigation inside the condition
              }}
            />
          </View>
        )}
      </View>
      {/* <FastImage
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          opacity: 0.9,
        }}
        source={require("../../assets/iconimages/opacity-01.png")}
      /> */}
    </View>
  );
}

const FAB = ({ renderIcon, onPress }) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View style={styles.child}>{renderIcon()}</View>
  </TouchableNativeFeedback>
);

const HeartIcon = ({ isSelected, onPress, iconStyle, size }) => (
  <Icon
    iconStyle={iconStyle}
    name={isSelected ? "heart" : "heart-outline"}
    type="material-community"
    color={"white"}
    size={size}
    style={{
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    }}
    onPress={onPress}
  />
);

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  buttonContainer: {
    // width: "20%",
    // alignItems: "center",
    // justifyContent: "space-evenly",
    // position: "absolute",
    // bottom: 50,
    // height: HEIGHT * 0.23,
    // right: 15,
    // backgroundColor: "red",
    // zIndex: 1,
  },

  image: {
    width: WIDTH,
    height: WIDTH,
    resizeMode: "contain",
  },
  child: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    marginVertical: "10%",
    borderRadius: 50 / 2,
    color: "white",
    backgroundColor: Colors.accentColor,
    elevation: 2,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    // background color must be set
  },
});
