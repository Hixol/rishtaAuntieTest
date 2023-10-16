import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {getUserById} from '../../utility/utils';

import CallService from '../../services/call-service';
import Icons from '../../utility/icons';

export default function IncomingCallScreen({navigation}) {
  const [initiator, setInitiator] = useState(null);
  const callSession = useSelector(store => store.ActiveCall.session);
  const isCallAccepted = useSelector(store => store.ActiveCall.isAccepted);

  useEffect(() => {
    getUserById(callSession?.initiatorID).then(user => setInitiator(user));
  }, []);

  useEffect(() => {
    if (isCallAccepted) {
      navigation.push('VideoScreen', {initiatorName: initiator});
    }
  }, [isCallAccepted]);

  const acceptCall = async () => {
    await CallService.acceptCall();
  };

  const rejectCall = () => {
    CallService.rejectCall();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.container}>
        {initiator != null && (
          <Text style={styles.incomingCallText}>
            {initiator.firstName} is calling
          </Text>
        )}
        <View style={styles.containerButtons}>
          <TouchableOpacity
            style={[styles.buttonAcceptCall]}
            onPress={acceptCall}>
            <Icons.MaterialIcons name={'call'} size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonRejectCall]}
            onPress={rejectCall}>
            <Icons.MaterialIcons name={'call-end'} size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },

  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  incomingCallText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },

  buttonAcceptCall: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },

  buttonRejectCall: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
});
