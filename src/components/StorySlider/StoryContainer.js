import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import GestureRecognizer from "react-native-swipe-gestures";

import Story from "./Story";
import ProgressArray from "./ProgressArray";
import FastImage from "react-native-fast-image";

const StoryContainer = props => {
  const { user } = props;
  const { stories = {} } = user || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPause, setIsPause] = useState(props.isPaused ? true : false);
  const [isLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(6);

  const story = stories.length ? stories[currentIndex] : {};

  const changeStory = evt => {
    if (evt.locationX > 50) {
      nextStory(true);
    } else {
      prevStory();
    }
  };

  const setCurrentIndexFun = i => {
    props.imageCurrentIndex(i);
    setCurrentIndex(i);
  };

  const nextStory = () => {
    if (stories.length - 1 > currentIndex) {
      setCurrentIndexFun(currentIndex + 1);
      setLoaded(false);
      setDuration(6);
    } else {
      setCurrentIndexFun(0);
      setLoaded(false);
      setDuration(6);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0 && stories.length) {
      setCurrentIndexFun(currentIndex - 1);
      setLoaded(false);
      setDuration(6);
    } else {
      // setCurrentIndexFun(-1);
      setCurrentIndexFun(0);
    }
  };

  const onImageLoaded = () => {
    setLoaded(true);
  };

  const onVideoLoaded = length => {
    setLoaded(true);
    setDuration(length.duration);
  };

  const onPause = result => {
    // setIsPause(result);
  };

  const loading = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          <View style={{ width: 1, height: 1 }}>
            <Story
              onImageLoaded={onImageLoaded}
              pause
              onVideoLoaded={onVideoLoaded}
              story={story}
              blurView={props.blurView}
            />
          </View>
          <ActivityIndicator color="white" />
        </View>
      );
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <GestureRecognizer config={config} style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={100}
        onPress={e => changeStory(e.nativeEvent)}
        onLongPress={() => onPause(true)}
        onPressOut={() => onPause(false)}
        style={styles.container}
      >
        <View style={styles.container}>
          <Story
            onImageLoaded={onImageLoaded}
            pause={props.isPaused}
            isNewStory={props.isNewStory}
            onVideoLoaded={onVideoLoaded}
            story={story}
            blurView={props.blurView}
          />

          {stories.length > 1 && loading()}

          <ProgressArray
            next={nextStory}
            isLoaded={isLoaded}
            duration={duration}
            pause={props.isPaused}
            isNewStory={props.isNewStory}
            stories={stories}
            currentIndex={currentIndex}
            currentStory={stories[currentIndex]}
            length={stories.map((_, i) => i)}
            progress={{ id: currentIndex }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={100}
        onPress={e => changeStory(e.nativeEvent)}
        onLongPress={() => onPause(true)}
        onPressOut={() => onPause(false)}
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
          source={require("../../assets/iconimages/opacity-02.png")}
        />
      </TouchableOpacity>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    // paddingTop: 30,
  },
  progressBarArray: {
    flexDirection: "row",
    position: "absolute",
    top: 30,
    width: "98%",
    height: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userView: {
    flexDirection: "row",
    position: "absolute",
    top: 55,
    width: "98%",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 12,
    color: "white",
  },
  time: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 3,
    marginLeft: 12,
    color: "white",
  },
  content: { width: "100%", height: "100%" },
  loading: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "100%",
    height: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bar: {
    width: 50,
    height: 8,
    backgroundColor: "gray",
    alignSelf: "center",
    borderRadius: 4,
    marginTop: 8,
  },
});

export default StoryContainer;
