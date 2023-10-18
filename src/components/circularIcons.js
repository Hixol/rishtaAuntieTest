import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import FastImage from 'react-native-fast-image';
import Icons from '../utility/icons';

const CircularIcon = props => {
  return (
    <TouchableOpacity
      disabled={props.status == 1 || props.status == 2 ? true : false}
      onPress={props.onPress}
      style={styles.iconTextView}>
      <View
        style={[
          styles.circularIcon,
          {elevation: props.iconCrossImage || props.iconChatImage ? 0 : 5},
          props.circularIconStyle,
        ]}>
        {props.AntDesign ? (
          <Icons.AntDesign
            name={props.name}
            color={props.color}
            size={props.size}
          />
        ) : null}
        {props.Material ? (
          <Icons.MaterialCommunityIcons
            name={props.name}
            color={props.color}
            size={props.size}
          />
        ) : null}
        {props.iconCrossImage ? (
          <FastImage
            style={{width: 20, height: 20}}
            source={require('../assets/iconimages/cross-pink.png')}
          />
        ) : null}
        {props.iconChatImage ? (
          <FastImage
            style={{width: 25, height: 25}}
            source={require('../assets/iconimages/chat-interaction.png')}
          />
        ) : null}
      </View>
      <Text style={styles.iconText}>{props.iconText}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  iconTextView: {alignItems: 'center'},
  circularIcon: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70 / 2,
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  iconText: {fontSize: 17, color: '#0C3677', fontFamily: 'Inter-Regular'},
});
export default CircularIcon;
