import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RNCamera} from 'react-native-camera';
import {handlePermissions} from '../../utility/regex';
import {PERMISSIONS} from 'react-native-permissions';
import {android, ios, windowHeight, windowWidth} from '../../utility/size';
import {useSelector, useDispatch} from 'react-redux';
import {useHelper} from '../../hooks/useHelper';

import styles from './styles';
import Button from '../../components/buttons/Button';
import FastImage from 'react-native-fast-image';
import HeaderContainer from '../../components/containers/headerContainer';
import colors from '../../utility/colors';
import ProfileServices from '../../services/ProfileServices';
import Loader from '../../components/Loader';
import Icons from '../../utility/icons';

const SelfieVerification = ({navigation}) => {
  const dispatch = useDispatch();
  const {Alerts, handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleFrontCameraMedia = async res => {
    if (cameraRef && res == 'granted') {
      const options = {
        mirrorImage: true,
        width: windowWidth,
        quality: 0.4,
        fixOrientation: true,
      };
      const data = await cameraRef.current?.takePictureAsync(options);
      let obj = {
        name: data?.uri.split('/').pop(),
        type: `image/${data?.uri.split('.').pop()}`,
        uri: data?.uri,
      };
      setImage(obj);
    }
  };

  const captureMedia = () => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.CAMERA,
        'camera',
        res => {
          handleFrontCameraMedia(res);
        },
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        'camera',
        res => {
          handleFrontCameraMedia(res);
        },
      );
    }
  };

  const showCamera = () => {
    setShow(true);
  };

  const handleClose = () => {
    setImage(null);
    setShow(true);
  };

  const submitSelfieVerification = () => {
    if (image == null) {
      Alerts('error', 'Please upload selfie.');
    } else {
      setLoading(true);
      let formData = new FormData();
      formData.append('verificationPicture', image);

      if (token != null) {
        ProfileServices.updateProfile(formData, token)
          .then(res => {
            handleStatusCode(res);
            if (res.data.status >= 200 && res.data.status <= 299) {
              dispatch({
                type: 'AUTH_USER',
                payload: res.data.data.user,
              });
              Alerts('success', res.data.message);
              navigation.navigate('BottomTab', {screen: 'HomeOne'});
            }
          })
          .catch(err => Alerts('error', err?.message.toString()))
          .finally(() => setLoading(false));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer
        Icon
        backButton
        goback="arrow-back"
        gobackButtonPress={() => navigation.goBack()}
      />
      {loading ? (
        <Loader />
      ) : (
        <View style={styles.innerContainer}>
          <View style={styles.card}>
            <View style={styles.innerCard}>
              <Text style={styles.heading}>Selfie Re-Verification</Text>
              <View style={styles.selfieComp}>
                {image == null && show ? (
                  <RNCamera
                    ref={cameraRef}
                    style={styles.preview}
                    autoFocus="on"
                    type="front"
                    captureAudio={false}
                  />
                ) : (
                  <TouchableOpacity onPress={showCamera} disabled={image}>
                    <FastImage
                      source={
                        image
                          ? {uri: image?.uri}
                          : require('../../assets/iconimages/camera-upload.png')
                      }
                      style={{
                        width: image ? 160 : 90,
                        height: image ? 250 : 75,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
                {image ? (
                  <Icons.AntDesign
                    name="close"
                    size={22}
                    color={colors.primaryPink}
                    style={{position: 'absolute', top: 5, right: 5}}
                    onPress={handleClose}
                  />
                ) : null}
              </View>

              {show ? (
                <TouchableOpacity
                  onPress={captureMedia}
                  style={{
                    position: 'absolute',
                    bottom:
                      windowHeight <= 640
                        ? windowHeight * 0.01 - 18
                        : windowHeight * 0.01 - 25,
                  }}>
                  <FastImage
                    style={{
                      width: windowHeight <= 640 ? 40 : 50,
                      height: windowHeight <= 640 ? 40 : 50,
                    }}
                    source={require('../../assets/iconimages/captureBtn.png')}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <Text style={styles.tagline}>
              To help prevent fake accounts we need to verify you're real. (This
              will NOT be shown publicly. Only for verification.)
            </Text>
          </View>
          <Button title="Next" YesNoBtn onPress={submitSelfieVerification} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SelfieVerification;
