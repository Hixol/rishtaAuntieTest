import {CommonActions, useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';

import colors from '../../../utility/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';

import BottomButton from '../../../components/buttons/BottomButton';
import {launchCamera} from 'react-native-image-picker';
import {OS_VER, android, ios} from '../../../utility/size';
import {alerts, handlePermissions} from '../../../utility/regex';
import {PERMISSIONS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import ActionCard from '../../../components/Cards/ActionCard';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import {log} from 'react-native-reanimated';
import Countries from '../../../assets/countryLists/Countries';
import {useHelper} from '../../../hooks/useHelper';
import moment from 'moment';
import {OnBoardingServices, UserService} from '../../../services';
import AutoScroll from '@homielab/react-native-auto-scroll';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const UploadVideo = ({navigation, route}) => {
  const edit = route?.params;

  const {userData, token} = useSelector(store => store.userReducer);
  const {updateUser} = useHelper();
  const {handleLocation, Alerts, handleStatusCode} = useHelper();

  const {video} = useSelector(store => store.NewOnBoardingReducer);
  const {coords} = useSelector(store => store.chatReducer);

  const dispatch = useDispatch();
  const {
    firstName,
    lastName,
    dob,
    gender,
    selfie,
    picture,

    religion,
    profilePictures,
  } = useSelector(store => store.NewOnBoardingReducer);
  const [videoUri, setVideoUri] = useState(null);
  const [mediaOptions, setMediaOptions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [videoObj, setVideoObj] = useState(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isPausedButton, setIsPausedButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit) {
      let find = userData?.UserMedia.filter(item => {
        return item?.type === 'video';
      });
      setVideoUri({
        uri: find[0]?.url,
      });
    } else {
      dispatch({
        type: 'routeName',
        payload: route?.name,
      });
      if (video === null) {
        setVideoUri(null);
      } else if (video !== null) {
        setVideoUri({
          uri: video?.uri,
        });
      } else {
        setVideoUri({
          uri: videoObj?.uri,
        });
      }
    }
  }, []);

  const handleCameraMedia = async (state, result) => {
    try {
      if (result == 'granted') {
        const options = {
          mediaType: 'video',
          quality: 0.4,
        };

        await launchCamera(options, res => {
          if (res.errorCode == 'others') {
            alerts(
              'error',
              res.errorMessage
                ? res.errorMessage
                : 'Camera support is not available on your device.',
            );
          } else if (res.didCancel === true) {
          } else if (
            res?.assets[0]?.height == 0 ||
            res?.assets[0]?.width == 0
          ) {
            alerts('error', 'Please select jpeg/png format images.');
          } else {
            setMediaOptions(state);
            console.log('RESSSS SSSS', res?.assets[0]);
            let obj = {};
            let videoSize = res?.assets[0]?.fileSize / 1000000;
            console.log('VIDEO SIZE', videoSize);

            if (videoSize <= 100) {
              obj = {
                name: res?.assets[0]?.fileName,
                type: res?.assets[0]?.type,
                uri: res?.assets[0]?.uri,
              };
              dispatch({
                type: 'video',
                payload: obj,
              });
              setVideoObj(obj);

              setVideoUri({
                uri: res?.assets[0]?.uri,
              });
            } else {
              alerts('error', 'Please upload video of 100mb or less');
            }
          }
        })
          .catch(() => {})
          .finally(() => {
            setShowAlert(false);
          });
      }
    } catch (err) {
      console.log('camera err', err);
    }
  };

  const handleCamera = state => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.CAMERA,
        'camera',
        res => {
          handleCameraMedia(state, res);
        },
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        'camera',
        res => {
          handleCameraMedia(state, res);
        },
      );
    }
  };

  const continuePress = async () => {
    console.log('TOKEN', token);
    if (edit) {
      setLoading(true);
      let formData1 = new FormData();
      formData1.append('video', video);

      OnBoardingServices.uploadVideo(formData1, token)
        .then(res => {
          console.log('VIDEO RESSS', res);
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            dispatch({
              type: 'SET_VIDEO_FLAG',
              payload: true,
            });
          }
        })
        .catch(e => {
          console.log('e', e);
        })
        .finally(() => {
          setLoading(false);
          navigation.goBack();
        });

      // setLoading(false);
    } else {
      if (videoObj !== null || video !== null) {
        setIsPaused(true);
        if (coords.city == '' && coords.state == '' && coords.country == '') {
          alerts(
            'error',
            'Please enable location and open google maps to sync location!',
          );
          handleLocation();
        } else {
          setLoading(true);
          handleLocation();
          console.log('cooords', coords);

          let code = Countries.filter(item => {
            return item?.en === coords?.country;
          });
          console.log('code', code);
          code = code[0]?.dialCode;
          let formData1 = new FormData();
          formData1.append('video', video);
          OnBoardingServices.uploadVideo(formData1, token)
            .then(res => {
              console.log('VIDEO RESSS', res);
              handleStatusCode(res);
              if (res.status >= 200 && res.status <= 299) {
                dispatch({
                  type: 'SET_VIDEO_FLAG',
                  payload: true,
                });
                let formData = new FormData();
                formData.append('firstName', firstName);
                formData.append('lastName', lastName);
                formData.append('dob', moment(dob).format('YYYY-MM-DD'));
                formData.append('longitude', coords.lat);
                formData.append('latitude', coords.lng);
                formData.append('city', coords.city);
                formData.append('country', coords.country);
                formData.append('countryCode', code);
                formData.append('address', coords.state);
                formData.append('gender', gender);
                formData.append('religion', religion?.name);
                formData.append('verificationPicture', selfie);

                profilePictures.map((x, index) => {
                  console.log('x', x);
                  if (x?.image) {
                    formData.append(`profilePic${index + 1}`, {
                      name: x?.image?.name,
                      type: x?.image.type,
                      uri: x?.image?.uri,
                    });
                  }
                });

                if (token !== null) {
                  setLoading(true);
                  UserService.createNewProfile(formData, token)
                    .then(res => {
                      console.log('NEW RES', res);
                      clearNewRedux();

                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'BottomTab'}],
                        }),
                      );
                      Alerts('success', res?.data?.message);
                      console.log('res', res);
                    })
                    .catch(e => {
                      console.log('e', e);
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                } else {
                  alerts('error', 'Please upload video to continue');
                }
                // Alerts('success', 'Video uploaded successfully');
              }
            })
            .catch(err => {
              console.log('ERRRROR VIDEO', err);
              Alerts('error', err?.message.toString());
            })
            .finally(() => {
              setLoading(false);
            });
        }
      } else {
        setShowAlert(true);
      }
    }
  };

  const handleGalleryMedia = async (state, result) => {
    try {
      if (result == 'granted') {
        ImagePicker.openPicker({
          cropping: false,
          mediaType: 'video',
          compressImageQuality: 0.5,
          forceJpg: true,
        })
          .then(el => {
            if (el.height == 0 || el.width == 0) {
              alerts('error', 'Please select jpeg/png/heif format images.');
            } else {
              console.log('el', el);
              let videoSize = el?.size / 1000000;
              console.log('VIDEO SIZE', videoSize);
              if (videoSize <= 100) {
                let obj = {
                  name: el.path.split('/')[el.path.split('/').length - 1],
                  type: el.mime,
                  uri: el.path,
                };
                dispatch({
                  type: 'video',
                  payload: obj,
                });
                setVideoObj(obj);
                setVideoUri({
                  uri: el.path,
                });
              } else {
                alerts('error', 'Please upload video of 100mb or less');
              }
            }
          })
          .catch(err => {
            alerts('error', err.toString());
            console.log('gallery picker err:', err);
          })
          .finally(() => {
            setMediaOptions(state);
            setShowAlert(false);
          });
      }
    } catch (err) {
      console.log('gallery err', err);
    }
  };

  const handleGallery = state => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        'gallery',
        res => {
          handleGalleryMedia(state, res);
        },
      );
    } else if (android) {
      if (OS_VER >= 13) {
        handleGalleryMedia(state, 'granted');
      } else {
        handlePermissions.checkMultiplePermissions(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          'gallery',
          res => {
            handleGalleryMedia(state, res);
          },
        );
      }
    }
  };
  const handleAlert = state => {
    console.log('mediaOptions', mediaOptions);
    setMediaOptions(state);
    console.log('hello', state);
  };

  const handleRemoveImage = () => {
    setShowAlert(false);
  };
  console.log('video', isPausedButton, isPaused);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsPausedButton(false);
    }, 2000);
  });
  const clearNewRedux = (flag = false) => {
    dispatch({
      type: 'firstName',
      payload: '',
    });
    dispatch({
      type: 'lastName',
      payload: '',
    });
    dispatch({
      type: 'dob',
      payload: null,
    });
    dispatch({
      type: 'gender',
      payload: '',
    });
    dispatch({
      type: 'selfie',
      payload: null,
    });
    dispatch({
      type: 'picture',
      payload: null,
    });
    dispatch({
      type: 'video',
      payload: null,
    });

    dispatch({
      type: 'profilePictures',
      payload: [],
    });
  };

  console.log('VIDEO', video, videoUri);
  return (
    <SafeAreaView style={{flex: 1, padding: 20, backgroundColor: colors.white}}>
      <ActionCard
        videoUpload
        handleCloseAlert={() => setShowAlert(false)}
        isImageAct={true}
        heading={'Choose an Action'}
        handleGallery={handleGallery}
        handleCamera={handleCamera}
        handleAlert={handleAlert}
        handleRemoveImage={handleRemoveImage}
        alert={showAlert}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FastImage
          resizeMode="contain"
          style={{width: 20, height: 30}}
          source={require('../../../assets/iconimages/arrow-back.png')}
        />
      </TouchableOpacity>

      <View style={{marginTop: '8%'}}>
        <Text style={styles.heading}>
          {video === null && videoUri === null
            ? 'Let your video do the talking'
            : 'Video reveal'}
        </Text>
        <Text style={styles.lightText}>
          {video === null && videoUri === null
            ? 'Your chance to shine in seconds, with likes, comments, and voice notes.'
            : 'Watch yourself shine.'}
        </Text>
        <View style={{width: '100%', marginVertical: '5%'}}></View>
        {video === null && videoUri === null ? (
          // <TouchableOpacity
          //   onPress={() => setShowAlert(true)}
          //   style={{
          //     width: '100%',
          //     backgroundColor: '#D9036814',
          //     height: height * 0.2,
          //     borderRadius: 5,
          //     borderWidth: 1,
          //     borderColor: colors.primaryPink,
          //     borderStyle: 'dashed',
          //     alignItems: 'center',
          //     justifyContent: 'center',
          //   }}>
          //   <FastImage
          //     resizeMode="contain"
          //     style={{width: 30, height: 30}}
          //     source={require('../../../assets/iconimages/add-circle.png')}
          //   />
          // </TouchableOpacity>
          <>
            {/* <AutoScroll style={{width: width * 1.2}} duration={5000}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  width: width * 1.2,
                }}>
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '25%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '25%',
                    height: 200,
                    borderRadius: 20,
                    marginTop: 30,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '25%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '25%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
              </View>
            </AutoScroll>
            <AutoScroll style={{width: width * 1}} isLTR={true} duration={5000}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  width: width * 1,
                }}>
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '30%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '30%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
                <Video
                  resizeMode={'cover'}
                  repeat={true}
                  style={{
                    width: '30%',
                    height: 200,
                    borderRadius: 20,
                  }}
                  source={require('../../../assets/images/samplevideo.mp4')}
                />
              </View>
            </AutoScroll> */}

            <Video
              // onLoadStart={() => setIsPreloading(true)}
              resizeMode={'cover'}
              repeat={true}
              // onReadyForDisplay={() => setIsPreloading(false)}
              // playInBackground={false}
              // playWhenInactive={false}
              paused={showAlert}
              style={{
                alignSelf: 'center',
                width: '120%',
                height: height * 0.5,
              }}
              // poster={require('../../../assets/images/discovervideo.mp4')}
              source={require('../../../assets/images/discovervideo1.mp4')}
            />
          </>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setIsPaused(!isPaused);
              setIsPausedButton(true);
            }}
            style={{
              width: '100%',
              height: height * 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
            }}>
            <Video
              onLoadStart={() => setIsPreloading(true)}
              resizeMode={'cover'}
              repeat={true}
              onReadyForDisplay={() => setIsPreloading(false)}
              playInBackground={false}
              playWhenInactive={false}
              paused={isPaused}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 20,
              }}
              poster={video?.uri}
              source={{
                uri: videoUri !== null ? videoUri?.uri : video?.uri,
              }}
            />
            {isPaused === false && isPausedButton === false ? null : (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  height: 10,
                  zIndex: 1,
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FastImage
                  resizeMode="contain"
                  style={{width: 60, height: 60}}
                  source={
                    isPausedButton === true && isPaused == false
                      ? require('../../../assets/iconimages/pause.png')
                      : isPausedButton == true && isPaused == true
                      ? require('../../../assets/iconimages/play.png')
                      : isPausedButton == false && isPaused == true
                      ? require('../../../assets/iconimages/play.png')
                      : null
                  }
                />
              </View>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setShowAlert(true)}
          style={{
            width: '80%',
            padding: '5%',
            flexDirection: 'row',
            alignItems: 'center',
            // borderRadius: 5,
            // alignItems: 'center',
            // justifyContent: 'center',
            // alignSelf: 'flex-end',
            // backgroundColor: colors.primaryBlue,
            // marginVertical: '5%',
          }}>
          <Text
            style={{
              fontSize: 15,
              color: '#6B7280',
              fontFamily: 'Inter-Medium',
            }}>
            {videoUri === null ? null : 'Change Video'}
          </Text>
          {videoUri === null ? null : (
            <FastImage
              style={{width: 15, height: 15, marginLeft: '3%'}}
              resizeMode="contain"
              source={require('../../../assets/iconimages/editt.png')}
            />
          )}
        </TouchableOpacity>
      </View>
      <BottomButton
        loading={loading}
        text={
          edit
            ? 'Update'
            : videoObj || video
            ? 'View profiles now'
            : 'Upload your discovery video'
        }
        onPress={() => continuePress()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {fontFamily: 'Inter-Bold', fontSize: 25, color: colors.black},
  lightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginTop: '3%',
    color: colors.textGrey,
  },
});

export default UploadVideo;
