import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import StoryContainer from './StoryContainer';

const Stories = (props) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);
  const AllStories = [{stories: props.images}];

  const onStoryNext = (isScroll) => {
    const newIndex = currentUserIndex;
    setCurrentUserIndex(newIndex);
    if (!isScroll) {
      modalScroll.current.scrollTo(newIndex, true);
    }
  };

  const onStoryPrevious = (isScroll) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious();
      setCurrentScrollValue(scrollValue);
    }
  };

  const renderSeperator = () => (
    <View style={{height: 1, backgroundColor: '#ccc'}} />
  );

  return (
    <View style={styles.container}>
      {AllStories.map((item, index) => (
        <StoryContainer
          onClose={() => {}}
          onStoryNext={onStoryNext}
          onStoryPrevious={onStoryPrevious}
          user={item}
          isNewStory={index !== currentUserIndex}
          myuser={props.user}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  circle: {
    width: 66,
    margin: 4,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#72bec5',
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: 9,
    textAlign: 'center',
  },
});

export default Stories;
