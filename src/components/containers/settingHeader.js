import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

import FastImage from 'react-native-fast-image';
import colors from '../../utility/colors';
import Icons from '../../utility/icons';
const SettingHeader = props => {
  const {userData} = useSelector(store => store.userReducer);

  let proMember = userData?.UserSetting?.isSubscribed;

  const {screenTitle, backPress} = props;

  return (
    <View style={{width: '100%'}}>
      <FastImage
        resizeMode="contain"
        style={{width: 37, height: 37, alignSelf: 'center'}}
        source={
          proMember
            ? require('../../assets/iconimages/settinglogo2.png')
            : require('../../assets/iconimages/settinglogo1.png')
        }
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '5%',
        }}>
        <TouchableOpacity
          onPress={backPress}
          style={{
            width: '12%',
            paddingVertical: '2%',
            height: 35,
          }}>
          <FastImage
            resizeMode="contain"
            style={{width: 20, height: 20}}
            source={require('../../assets/iconimages/settingback.png')}
          />
        </TouchableOpacity>
        <Text
          style={{
            width: '70%',
            textAlign: 'center',
            fontSize: 24,
            fontFamily: 'Inter-Bold',
            color:'#111827'
          }}>
          {screenTitle}
        </Text>
        <View style={{width: '12%', height: 15}}></View>
      </View>
    </View>
  );
};
export default SettingHeader;
