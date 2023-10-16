import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import colors from '../../utility/colors';

const CardPaginator = ({data, scrollX, type}) => {
  const {width} = useWindowDimensions();
  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, i * width];

        const background = scrollX.interpolate({
          inputRange,
          outputRange: [colors.softGrey, colors.primaryPink, colors.softGrey],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[
              type == 'dot' ? styles.dot : styles.dash,
              {backgroundColor: background},
            ]}
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
  dash: {
    borderRadius: 1,
    marginHorizontal: 3,
    backgroundColor: 'red',
    height: '15%',
    width: '15%',
  },
  dot: {
    borderRadius: 12 / 2,
    marginHorizontal: 9,
    backgroundColor: 'red',
    height: 12,
    width: 12,
  },
});

export default CardPaginator;
