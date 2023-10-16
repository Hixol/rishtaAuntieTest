import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import colors from '../utility/colors';

const Loader = ({style}) => {
  return (
    <ActivityIndicator
      size={'large'}
      color={colors.primaryPink}
      style={[styles.loader, style]}
    />
  );
};

export default Loader;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
