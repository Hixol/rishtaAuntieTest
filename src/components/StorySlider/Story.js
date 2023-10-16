import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import colors from '../../utility/colors';

const Story = props => {
  const {story} = props;
  const {url} = story || {};

  return (
    <View style={styles.container}>
      <FastImage
        onLoadStart={() => (
          <ActivityIndicator size={'small'} color={colors.primaryPink} />
        )}
        source={{uri: url}}
        style={styles.content}
        onLoadEnd={() => props.onImageLoaded()}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

Story.propTypes = {
  story: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
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
