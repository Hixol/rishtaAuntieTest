import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {windowHeight, windowWidth} from '../../utility/size';

const DetailsSkeleton = props => {
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <SkeletonPlaceholder speed={1200}>
        <View style={styles.pictureBox} />
        <View style={styles.locationBox} />
        <View style={styles.personalityBox} />
        <View style={styles.txt} />
        <View style={styles.btn} />
        <View
          style={[
            styles.personalityBox,
            {marginTop: windowHeight * 0.05, marginBottom: windowHeight * 0.1},
          ]}
        />
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pictureBox: {
    height: windowHeight * 0.45,
    width: windowWidth,
  },
  locationBox: {
    height: windowHeight * 0.1,
    width: windowWidth * 0.9,
    borderRadius: 22,
    alignSelf: 'center',
    marginVertical: windowHeight * 0.02,
  },
  personalityBox: {
    height: windowHeight * 0.2,
    width: windowWidth * 0.9,
    borderRadius: 20,
    alignSelf: 'center',
  },
  txt: {
    height: windowHeight * 0.025,
    width: windowWidth * 0.35,
    borderRadius: 5,
    marginTop: windowHeight * 0.03,
    marginLeft: windowWidth * 0.07,
  },
  btn: {
    height: windowHeight * 0.043,
    width: windowWidth * 0.27,
    borderRadius: 50,
    marginTop: windowHeight * 0.015,
    marginLeft: windowWidth * 0.09,
  },
});

export default DetailsSkeleton;
