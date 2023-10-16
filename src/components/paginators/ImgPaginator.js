import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import colors from '../../utility/colors';

const ImgPaginator = ({images, scrollX}) => {
  const {width} = useWindowDimensions();
  return (
    <View style={styles.container}>
      {images.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [6, 28, 6],
          extrapolate: 'clamp',
        });

        const background = scrollX.interpolate({
          inputRange,
          outputRange: [colors.white, colors.primaryPink, colors.white],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[styles.dot, {width: dotWidth, backgroundColor: background}]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 20,
  },
  dot: {
    borderRadius: 1,
    marginHorizontal: 2.7,
    height: 6,
  },
});

export default ImgPaginator;
