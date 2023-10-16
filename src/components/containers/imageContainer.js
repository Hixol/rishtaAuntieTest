import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {windowWidth} from '../../utility/size';

import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import PurchaseUpgradeButton from '../buttons/PurchaseUpgradeButton';

const ImageContainer = props => {
  return (
    <View style={[styles.ProfileContainer, props.contStyle]}>
      <View>
        {props.name ? (
          <Text numberOfLines={1} style={styles.name}>
            {props.name}
          </Text>
        ) : null}
      </View>
      <View style={[styles.imageWrapper, props.imageWrapper]}>
        <View style={styles.imagePosition}>
          <FastImage
            onLoadStart={props.onLoadStart}
            onLoadEnd={props.onLoadEnd}
            style={[styles.profileImage, props.imageStyle]}
            source={
              props.image
                ? {uri: props.image, cache: 'web'}
                : require('../../assets/images/user.png')
            }
          />
        </View>
      </View>
      <View>
        {props.EditMyProfile ? (
          <TouchableOpacity onPress={props.editProfileonPress}>
            <Text style={styles.editMyProfile}>View and Edit my Profile</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View>
        {props.ChatNow ? (
          <View style={styles.chatContainer}>
            <Text style={styles.chatText}>Chat Now</Text>
          </View>
        ) : null}
      </View>
      <View>
        {props.ChatLater ? (
          <View style={styles.chatLaterContainer}>
            <Text style={[styles.chatText, {color: colors.primaryPink}]}>
              Chat Later
            </Text>
          </View>
        ) : null}
      </View>
      <View>
        {props.DiscoverOtherMatches ? (
          <View style={styles.chatLaterContainer}>
            <Text style={[styles.chatText, {color: colors.primaryPink}]}>
              Discover Other Matches
            </Text>
          </View>
        ) : null}
      </View>
      <View style={{marginTop: '15%'}}>
        <PurchaseUpgradeButton
          title={'View Insights'}
          onPressTitle={props.onPress}
        />
      </View>
    </View>
  );
};
export default ImageContainer;

const styles = StyleSheet.create({
  ProfileContainer: {
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: '5%',
    // paddingVertical: '2%',
    backgroundColor: '#FFFFFF',
  },
  imageWrapper: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    backgroundColor: '#FFFFFFF',
    // elevation: 10,
    zIndex: 0,
    marginVertical: '3%',
  },
  imagePosition: {
    zIndex: 0,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    borderColor: colors.primaryPink,
    borderWidth: 4,
    zIndex: 1,
  },
  editIconView: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    backgroundColor: '#FFFFFF',
    shadowOffset: {
      height: 5,
    },
    shadowOpacity: 10,
    shadowRadius: 10,
    shadowColor: 'black',
    elevation: 10,
    borderWidth: 2,
    borderColor: '#D90368',
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editMyProfile: {
    color: '#0C3677',
    fontFamily: 'Roboto-Medium',
    marginTop: '5%',
    fontSize: 15,
    textAlign: 'center',
  },
  name: {
    color: '#0C3677',
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    paddingVertical: '3%',
  },
  chatContainer: {
    width: windowWidth * 0.75,
    marginVertical: '3%',
    paddingVertical: '3%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: colors.primaryPink,
  },
  chatLaterContainer: {
    width: windowWidth * 0.75,

    marginVertical: '3%',
    paddingVertical: '3%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primaryPink,
  },
  chatText: {fontSize: 22, color: '#FFFFFF'},
});
