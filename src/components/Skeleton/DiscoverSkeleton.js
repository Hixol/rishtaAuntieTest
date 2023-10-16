import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {windowHeight, windowWidth} from '../../utility/size';

const DiscoverSkeleton = props => {
  return (
    <View style={{backgroundColor: 'white'}}>
      <SkeletonPlaceholder speed={1100}>
        <View
          style={{
            height: windowHeight - props.tabBarHeight,
            width: windowWidth,
            paddingHorizontal: windowWidth * 0.02,
            paddingVertical: windowHeight * 0.028,
            justifyContent: 'space-between',
          }}>
          <View style={styles.skelHeader}>
            <View style={styles.skelHeart} />
            <View style={styles.skelDots} />
          </View>

          <View>
            <View style={styles.skelPic} />

            <View style={styles.skelName} />

            <View style={styles.skelDesc} />

            <View style={styles.skelLocation}>
              <View style={styles.skelFlag} />
              <View style={styles.skelArea} />
              <View style={styles.skelProf} />
            </View>
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  skelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.02,
  },
  skelHeart: {
    height: windowHeight * 0.055,
    width: windowWidth * 0.1,
    borderRadius: 5,
  },
  skelDots: {
    height: windowHeight * 0.055,
    width: windowWidth * 0.05,
    borderRadius: 5,
  },
  skelLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: windowHeight * 0.027,
  },
  skelFlag: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.15,
    borderRadius: 5,
  },
  skelArea: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.3,
    borderRadius: 5,
  },
  skelProf: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.16,
    borderRadius: 5,
  },
  skelDesc: {
    height: windowHeight * 0.025,
    width: windowWidth * 0.6,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: windowHeight * 0.027,
  },
  skelName: {
    height: windowHeight * 0.03,
    width: windowWidth * 0.35,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: windowHeight * 0.027,
  },
  skelPic: {
    height: windowHeight * 0.1,
    width: windowHeight * 0.1,
    borderRadius: 100,
    alignSelf: 'flex-end',
  },
});

export default DiscoverSkeleton;
