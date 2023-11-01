import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import StoryContainer from "./StoryContainer";
import FastImage from "react-native-fast-image";

const Stories = props => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const modalScroll = useRef(null);
  const AllStories = [{ stories: props.images }];

  const onStoryNext = isScroll => {
    if (AllStories.length > 1) {
      const newIndex = currentUserIndex;
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onStoryPrevious = isScroll => {
    if (AllStories.length > 1) {
      const newIndex = currentUserIndex - 1;
      if (currentUserIndex > 0) {
        setCurrentUserIndex(newIndex);
        if (!isScroll) {
          modalScroll.current.scrollTo(newIndex, true);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {AllStories.map((item, index) => (
        <>
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
              source={require("../../assets/iconimages/opacity-02.png")}
            />
          </View>
          <StoryContainer
            isPaused={props.isPaused}
            imageCurrentIndex={props.imageCurrentIndex}
            onClose={() => {}}
            onStoryNext={onStoryNext}
            onStoryPrevious={onStoryPrevious}
            user={item}
            isNewStory={index !== currentUserIndex}
            blurView={props.blurView}
          />
        </>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    width: 66,
    margin: 4,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: "#72bec5",
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: 9,
    textAlign: "center",
  },
});

export default Stories;
