import React from 'react';
import {StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';

const windowHeight = Dimensions.get('window').height;

const LoginOptionsButtons = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.LoginOptionsContainer, props.LoginOptionsView]}>
      {props.icon ? (
        props.icon
      ) : (
        <FastImage
          style={{width: windowHeight * 0.05, height: windowHeight * 0.05}}
          resizeMode={'contain'}
          source={props.iconSource}
        />
      )}

      <Text
        style={{
          color: props.txtColor,
          fontSize: 15,
          fontFamily: 'Inter-Regular',
        }}>
        {props.iconName}
      </Text>
    </TouchableOpacity>
  );
};
export default LoginOptionsButtons;

const styles = StyleSheet.create({
  LoginOptionsContainer: {
    width: '24%',
    height: windowHeight * 0.105,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: colors.primaryBlue,
  },
});
