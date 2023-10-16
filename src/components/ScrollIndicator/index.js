import {Animated, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../utility/colors';
import {android, ios, windowHeight} from '../../utility/size';

const FlatListIndicator = ({
  type,
  difference,
  indicator,
  visibleHeight,
  wholeHeight,
}) => {
  let outputRange =
    (android && wholeHeight > 8900 && windowHeight < 9300) ||
    (wholeHeight > 7800 && wholeHeight < 8850 && windowHeight > 800)
      ? difference - 160
      : android &&
        wholeHeight > 7800 &&
        wholeHeight < 9000 &&
        windowHeight < 800
      ? difference - 170
      : ios && wholeHeight > 8000 && wholeHeight < 8700
      ? difference - 85
      : android && wholeHeight > 910 && wholeHeight < 925
      ? difference + 120
      : android && wholeHeight > 900 && wholeHeight < 940
      ? difference + 350
      : android && wholeHeight > 900 && wholeHeight < 1500 && windowHeight > 800
      ? difference + 120
      : android && wholeHeight > 900 && wholeHeight < 1500 && windowHeight < 800
      ? difference + 20
      : wholeHeight > 1000 && wholeHeight < 1450 && windowHeight > 800
      ? difference + 120
      : android &&
        wholeHeight > 1000 &&
        wholeHeight < 1420 &&
        windowHeight < 800
      ? difference + 50
      : ios && wholeHeight > 900 && wholeHeight < 1400
      ? difference + 130
      : android &&
        wholeHeight > 1400 &&
        wholeHeight < 2000 &&
        windowHeight > 800
      ? difference + 35
      : android &&
        wholeHeight > 1400 &&
        wholeHeight < 2000 &&
        windowHeight < 800
      ? difference - 35
      : android &&
        wholeHeight > 1700 &&
        wholeHeight < 1950 &&
        windowHeight > 800
      ? difference + 35
      : android &&
        wholeHeight > 1700 &&
        wholeHeight < 1930 &&
        windowHeight < 800
      ? difference - 20
      : ios && wholeHeight > 1600 && wholeHeight < 1900
      ? difference + 57
      : android && wholeHeight > 780 && wholeHeight < 900
      ? difference + 330
      : ios && wholeHeight > 830 && wholeHeight < 870
      ? difference + 225
      : android && wholeHeight > 3000 && wholeHeight < 3400
      ? difference + 20
      : android && wholeHeight > 3420 && wholeHeight < 3440
      ? difference - 30
      : ios && wholeHeight > 3000 && wholeHeight < 3100
      ? difference + 5
      : android && wholeHeight > 400 && wholeHeight < 620
      ? difference + 180
      : android && wholeHeight > 440 && wholeHeight < 690
      ? difference + 240
      : android && wholeHeight > 580 && wholeHeight < 720
      ? difference + 150
      : android && wholeHeight > 500 && wholeHeight < 600
      ? difference + 150
      : android && wholeHeight > 500 && wholeHeight < 700
      ? difference + 240
      : wholeHeight > 4100 && wholeHeight < 4200
      ? difference - 5
      : difference;

  return (
    <View
      style={[
        styles.indicatorContainer,
        {
          top:
            type == 'vibes'
              ? 70
              : type == 'pool'
              ? 130
              : !ios && type === 'move'
              ? 170
              : 0,
        },
        {
          bottom:
            ios && type == 'vibes'
              ? 90
              : !ios && type == 'vibes'
              ? 105
              : ios && type == 'pool'
              ? 60
              : !ios && type == 'pool'
              ? 80
              : !ios && type === 'move'
              ? 10
              : 0,
        },
      ]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [
              {
                translateY: Animated.multiply(
                  indicator,
                  visibleHeight / wholeHeight,
                ).interpolate({
                  extrapolate: 'clamp',
                  inputRange: [0, difference],
                  outputRange: [0, outputRange],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

export default FlatListIndicator;

const styles = StyleSheet.create({
  indicatorContainer: {
    backgroundColor: colors.vibeLightGrey,
    width: 2,
    position: 'absolute',
    right: 14,
    top: ios ? 0 : 0,
    bottom: ios ? 0 : 0,
    borderRadius: 10,
    alignItems: 'center',
  },
  indicator: {
    backgroundColor: colors.primaryPink,
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
  },
});
