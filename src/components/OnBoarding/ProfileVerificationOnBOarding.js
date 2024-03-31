import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';

import Video from 'react-native-video';
import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import ActionCard from '../Cards/ActionCard';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const ProfileVerificationOnBoarding = props => {
  const [videoUri, setVideoUri] = useState('');
  const [mediaOptions, setMediaOptions] = useState(false);

  const handleAlert = () => {
    setMediaOptions(false);
  };

  const handleGallery = async state => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (result == 'granted') {
      const options = {
        mediaType: 'video',
        quality: 0.5,
      };
      launchImageLibrary(options, response => {
        response.didCancel === true
          ? null
          : setVideoUri(response?.assets[0]?.uri);
      });
      setMediaOptions(state);
    }
  };

  const handleCamera = async state => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (result == 'granted') {
      const options = {
        mediaType: 'video',
      };
      launchCamera(options, response => {
        response.didCancel === true
          ? null
          : setVideoUri(response?.assets[0]?.uri);
      });
      setMediaOptions(state);
    }
  };

  const handleRemoveVideo = state => {
    setVideoUri('');
    setMediaOptions(state);
  };

  useFocusEffect(
    React.useCallback(() => {
      setVideoUri(props.img);
    }, [props.img]),
  );

  return (
    <TouchableOpacity style={[styles.container, props.conStyle]}>
      <ActionCard
        isImageAct={true}
        heading={'Choose an Action'}
        handleGallery={handleGallery}
        handleCamera={handleCamera}
        handleAlert={handleAlert}
        handleRemoveImage={handleRemoveVideo}
        alert={mediaOptions}
      />
      {props.img && videoUri ? (
        <Video
          key={videoUri}
          poster={videoUri}
          source={{uri: videoUri}}
          paused={true}
          controls={true}
          style={{width: '100%', height: '100%', borderRadius: 4}}
          posterResizeMode="cover"
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <FastImage
            style={{
              marginTop: '7%',
              width: windowHeight <= 640 ? 95 : 120,
              height: windowHeight <= 640 ? 95 : 120,
            }}
            source={require('../../assets/iconimages/user-default.png')}
            resizeMode="contain"
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProfileVerificationOnBoarding;

const styles = StyleSheet.create({
  container: {
    height: '35%',
    width: '50%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1%',
    marginBottom: '-20%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primaryPink,
  },
  img: {
    backgroundColor: '#F6F7FB',
    height: 335,
    width: 135,
    borderRadius: 95,
  },
  mainDisplayTxt: {
    position: 'absolute',
    color: colors.primaryBlue,
    fontSize: windowHeight * 0.012,
    fontFamily: 'Inter-Bold',
    bottom: 6,
  },
});
