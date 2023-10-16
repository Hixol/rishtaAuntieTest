import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import FastImage from 'react-native-fast-image';
import colors from '../../utility/colors';

const InviteFriendsContainer = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.inviteFriendsContainer, props.btnStyle]}>
      <Text style={styles.inviteFriendsText}>
        Invite Friends -{' '}
        <Text style={{fontFamily: 'Roboto-Regular'}}>
          You each get a free spotlight for every friend that joins Rishta
          Auntie
        </Text>
      </Text>
      <View style={{width: '10%', height: '100%', alignItems: 'center'}}>
        <FastImage
          style={{width: 27, height: 25, marginLeft: '2%'}}
          source={require('../../assets/iconimages/invitefriend-send.png')}
        />
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  inviteFriendsContainer: {
    width: '90%',
    paddingVertical: '5%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: '2%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primaryPink,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteFriendsText: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',

    color: '#D90368',
    width: '88%',
  },
});

export default InviteFriendsContainer;
