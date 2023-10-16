import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {showToast} from '../../utility/utils';
import {useSelector} from 'react-redux';

import Icons from '../../utility/icons';
import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import CallService from '../../services/call-service';
import ConnectyCube from 'react-native-connectycube';
import PushNotificationsService from '../../services/PushNotificationService';

const ChatHeaderContainer = ({
  backPress,
  image,
  type,
  name,
  user,
  status,
  selected,
  starCallback,
  reportCallback,
  optionsPress,
}) => {
  const navigation = useNavigation();
  const {token} = useSelector(store => store.userReducer);

  const startCall = async (callType = 'video') => {
    if (user.UserSetting.ccuid == null) {
      showToast('User does not have a valid connectycube id');
      return;
    }

    const selectedOpponentsIds = [user.UserSetting.ccuid];

    const callSession = await CallService.startCall(
      selectedOpponentsIds,
      callType == 'video'
        ? ConnectyCube.videochat.CallType.VIDEO
        : ConnectyCube.videochat.CallType.AUDIO,
      {token, callType, userId: user.id},
    );

    const pushParams = {
      message: `Incoming call from ${user.firstName}`,
      ios_voip: 1,
      handle: user.firstName,
      initiatorId: callSession.initiatorID,
      opponentsIds: selectedOpponentsIds.join(','),
      uuid: callSession.ID,
      callType,
    };

    PushNotificationsService.sendPushNotification(
      selectedOpponentsIds,
      pushParams,
    );

    navigation.navigate('VideoScreen', {
      initiatorName: user,
    });
  };

  return (
    <View style={styles.headerView}>
      <View style={styles.leftContainerView}>
        <TouchableOpacity onPress={backPress}>
          <Icons.Ionicons
            name="arrow-back-sharp"
            size={28}
            color={colors.blackBlue}
          />
        </TouchableOpacity>
        {/* <View style={styles.imageContainer}>
          <FastImage
            style={type === 'GROUP' ? styles.logo : styles.image}
            resizeMode="cover"
            source={
              type === 'GROUP'
                ? require('../../assets/iconimages/logo-01.png')
                : {uri: image}
            }
          />
        </View> */}

        <View>
          <Text style={styles.userName}>{name}</Text>
          {/* <Text style={styles.status}>{status}</Text> */}
        </View>
      </View>
      <View style={styles.row}>
        {selected ? (
          <>
            <TouchableOpacity onPress={starCallback} style={{marginRight: 14}}>
              <Icons.MaterialCommunityIcons
                name="star"
                size={24}
                color={colors.blackBlue}
              />
            </TouchableOpacity>
            {type === 'GROUP' ? null : (
              <TouchableOpacity onPress={reportCallback}>
                <Icons.MaterialCommunityIcons
                  name="message-alert"
                  size={22}
                  color={colors.blackBlue}
                />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            {type === 'GROUP' ? null : (
              <>
                <TouchableOpacity onPress={() => startCall('voice')}>
                  <FastImage
                    source={require('../../assets/iconimages/call-01.png')}
                    style={{width: 40, height: 18}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => startCall('video')}>
                  <FastImage
                    source={require('../../assets/iconimages/video-call-01.png')}
                    style={{width: 50, height: 16}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </>
            )}
            {type === 'GROUP' ? null : (
              <TouchableOpacity onPress={optionsPress}>
                <Icons.Ionicons
                  name="ellipsis-vertical-sharp"
                  size={26}
                  color={colors.blackBlue}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 20,
    marginLeft: 5,
    color: colors.blackBlue,
    fontFamily: 'Inter-Bold',
  },
  status: {
    fontSize: 15,
    color: colors.darkBlue,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginHorizontal: '5%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  logo: {
    width: '85%',
    height: '85%',
  },
  leftContainerView: {
    flexDirection: 'row',
    width: '62%',
    paddingVertical: '2%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default ChatHeaderContainer;
