/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import AboutCard from '../../modules/AboutCard';
import MyEthnicity from '../../modules/MyEthnicity';
import MyReligion from '../../modules/MyReligion';
import MyLifeStyle from '../../modules/MyLifeStyle';
import MyEducation from '../../modules/MyEducation';
import MarrigeHistory from '../../modules/MarrigeHistory';
import PropTypes from 'prop-types';

const Story = (props) => {
  const {story, user} = props;
  const {url, type, id} = story || {};

  props.onImageLoaded();

  const _renderItem = (item) => {
    if (item == 1) {
      return <AboutCard user={user} />;
    } else if (item == 2) {
      return <MyEthnicity user={user} />;
    } else if (item == 3) {
      return <MyReligion user={user} />;
    } else if (item == 4) {
      return <MyLifeStyle user={user} />;
    } else if (item == 5) {
      return <MyEducation user={user} />;
    } else if (item == 6) {
      return <MarrigeHistory user={user} />;
    }
  };
  return <View style={styles.container}>{_renderItem(id)}</View>;
};

Story.propTypes = {
  story: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    // backgroundColor: 'green',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  content: {width: '100%', height: '100%', flex: 1},
  imageContent: {
    width: '100%',
    
    height: '100%',
    flex: 1,
  },
  loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Story;
