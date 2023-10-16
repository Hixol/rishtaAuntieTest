import React, {useState, useEffect} from 'react';

import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
const SocialButton = props => {
  return (
    <View>
      <View style={styles.container}>
        {props.followUs ? (
          <Text style={styles.followText}>Follow Us:</Text>
        ) : null}
        <TouchableOpacity>
          <FastImage
            resizeMode="contain"
            style={styles.iconSize}
            source={require('../../assets/iconimages/settingIg.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FastImage
            resizeMode="contain"
            style={styles.iconSize}
            source={require('../../assets/iconimages/settingtw.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FastImage
            resizeMode="contain"
            style={styles.iconSize}
            source={require('../../assets/iconimages/settingfb.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SocialButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    marginHorizontal: '5%',
  },
  followText: {
    color: colors.primaryBlue,
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
  },
  iconSize: {height: 32, width: 32},
});
