import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Alert, TextInput, Platform} from 'react-native';
import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';

const CustomTextInput = props => {
  //   const {value} = props?.route?.params;
  return (
    <View
      style={{
        width: '100%',
        marginVertical: '3%',
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        padding: Platform.OS === 'ios' ? '5%' : '3%',
        borderRadius:10
      }}>
      <FastImage
        resizeMode="contain"
        style={{width: 22, height: 22}}
        source={props.leftIcon}
      />
      <TextInput
        editable={props.editable ? false : true}
        style={{
          height: '100%',
          borderRadius: 5,
          backgroundColor: '#F9FAFB',
          width: '80%',
          fontSize: 18,
          paddingHorizontal: '3%',
          color: colors.black,
          fontFamily:'Inter-Regular'
        }}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.placeholder}
        placeholderTextColor={'#9CA3AF'}
      />
    </View>
  );
};
export default CustomTextInput;
