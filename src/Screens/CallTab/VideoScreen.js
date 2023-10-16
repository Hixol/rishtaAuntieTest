import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

import RTCViewGrid from './RTCViewGrid';
import CallService from '../../services/call-service';
import VideoToolBar from './VideoToolbar';

export default function VideoScreen({navigation, route}) {
  const [isAudioCall, setIsAudioCall] = useState(false);

  const {initiatorName} = route.params;
  const streams = useSelector(store => store.ActiveCall.streams);
  const callSession = useSelector(store => store.ActiveCall.session);

  useEffect(() => {
    // stop call if all opponents are left
    if (streams.length === 1) {
      stopCall();
    }

    if (callSession?.callType == 2) {
      setIsAudioCall(true);
    } else {
      setIsAudioCall(false);
    }
  }, [callSession, streams]);

  const navigateBack = () => {
    if (navigation.canGoBack()) {
      navigation.pop();
    }
  };

  const stopCall = () => {
    CallService.stopCall(callSession?.ID);

    navigateBack();
  };

  const muteCall = isAudioMuted => {
    CallService.muteMicrophone(isAudioMuted);
  };

  const switchCamera = () => {
    CallService.switchCamera();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      {!isAudioCall && (
        <RTCViewGrid streams={streams} name={initiatorName.firstName} />
      )}
      {isAudioCall && (
        <View
          style={{
            alignItems: 'center',
            padding: 10,
            marginTop: '20%',
          }}>
          <Text style={{marginVertical: 10, fontSize: 20, color: '#fff'}}>
            Audio Call
          </Text>
          <Text style={{marginVertical: 30, fontSize: 22, color: '#fff'}}>
            {initiatorName.firstName}
          </Text>

          <FastImage
            source={
              initiatorName.UserMedia[0].url === undefined ||
              initiatorName.UserMedia[0].url === null ||
              initiatorName.UserMedia[0].url === ''
                ? require('../../assets/images/user.png')
                : {
                    uri: initiatorName.UserMedia[0].url,
                  }
            }
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
            }}
          />
        </View>
      )}
      <VideoToolBar
        isAudioCall={isAudioCall}
        onSwitchCamera={switchCamera}
        onStopCall={stopCall}
        onMute={muteCall}
        canSwitchCamera={CallService.mediaDevices.length > 1}
      />
    </SafeAreaView>
  );
}
