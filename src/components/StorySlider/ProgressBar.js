import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';

import PropTypes from 'prop-types';

import Colors from '../../constants/Colors';
import colors from '../../utility/colors';

const ProgressBar = props => {
  const {index, currentIndex, duration, length, active} = props;

  const [width, setWidth] = useState(0);
  const [pauseTime, setPauseTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const scale = useRef(new Animated.Value(0)).current;

  const onLayoutAdded = evt => {
    setWidth(evt.width);
  };

  useEffect(() => {
    switch (active) {
      case 2:
        return scale.setValue(width);
      case 1:
        return props.isLoaded
          ? Animated.timing(scale, {
              toValue: width,
              duration: getDuration(),
              easing: Easing.linear,
              useNativeDriver: false,
            }).start(({finished}) => {
              if (finished) props.next();
            })
          : scale.setValue(0);
      case 0:
        return scale.setValue(0);
      default:
        return scale.setValue(0);
    }
  });

  const getDuration = () => {
    const totalPlaytime = duration * 1000;

    if (props.pause) {
      return 50000;
    }

    if (pauseTime === null) {
      return totalPlaytime;
    }

    const lastTime = pauseTime - startTime;
    return totalPlaytime - lastTime;
  };

  useEffect(() => {
    if (index === currentIndex) {
      if (props.pause) {
        const endtime = Date.now();
        setPauseTime(endtime);
      }

      if (startTime === null) {
        setStartTime(Date.now());
      }
    }
  }, [props.pause]);

  return (
    <View>
      {length !== 1 && (
        <View
          onLayout={evt => onLayoutAdded(evt.nativeEvent.layout)}
          style={[styles.container, {width: index === currentIndex ? 34 : 10}]}>
          <Animated.View
            style={[
              styles.container,
              {
                width: scale,
                backgroundColor:
                  index === currentIndex ? colors.primaryPink : colors.softGrey,
                position: 'absolute',
                top: 0,
                margin: 0,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

ProgressBar.propTypes = {
  index: PropTypes.number,
  currentIndex: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    height: 4,
    width: 10,
    backgroundColor: colors.softGrey,
    margin: 2,
  },
});

export default ProgressBar;
