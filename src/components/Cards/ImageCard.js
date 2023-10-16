import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS} from 'react-native-permissions';
import {
  windowWidth,
  windowHeight,
  ios,
  android,
  OS_VER,
} from '../../utility/size';
import {RNCamera} from 'react-native-camera';
import {handlePermissions} from '../../utility/regex';
import {DraggableGrid} from 'react-native-draggable-grid';
import {useHelper} from '../../hooks/useHelper';

import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import ActionCard from './ActionCard';
import ImageView from 'react-native-image-viewing';
import Icons from '../../utility/icons';

const ImageCard = props => {
  const {Alerts} = useHelper();

  const [image, setImage] = useState(null);
  const [mediaOptions, setMediaOptions] = useState(false);
  const [cIndex, setCIndex] = useState(null);
  const [dIndex, setDIndex] = useState(null);
  const [data, setData] = useState([
    {name: '1', key: 'one'},
    {name: '2', key: 'two'},
    {name: '3', key: 'three'},
    {name: '4', key: 'four'},
    {name: '5', key: 'five'},
    {name: '6', key: 'six'},
  ]);
  let cameraRef = useRef();

  const handleAlert = state => {
    setMediaOptions(state);
  };
  console.log('profilePicArr 1221', props.profilePicArr);
  const handleGalleryMedia = async (state, result) => {
    try {
      if (result == 'granted') {
        ImagePicker.openPicker({
          cropping: false,
          mediaType: 'photo',
          compressImageQuality: 0.5,
          forceJpg: true,
        })
          .then(el => {
            if (el.height == 0 || el.width == 0) {
              Alerts('error', 'Please select jpeg/png/heif format images.');
            } else {
              let obj = {
                name: el.path.split('/')[el.path.split('/').length - 1],
                type: el.mime,
                uri: el.path,
              };

              props.setProfilePicArr(prevState =>
                prevState.map(el => {
                  if (el.index == cIndex) {
                    return {
                      ...el,
                      image: obj,
                    };
                  } else {
                    return el;
                  }
                }),
              );
              setImage({
                uri: el.path,
              });
            }
          })
          .catch(err => {
            Alerts('error', err.toString());
            console.log('gallery picker err:', err);
          })
          .finally(() => setMediaOptions(state));
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

  const handleCameraMedia = async (state, result) => {
    try {
      if (result == 'granted') {
        const options = {
          mediaType: 'photo',
          quality: 0.4,
        };

        await launchCamera(options, res => {
          if (res.errorCode == 'others') {
            Alerts(
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
            Alerts('error', 'Please select jpeg/png format images.');
          } else {
            setMediaOptions(state);

            props.setProfilePicArr(prevState =>
              prevState.map(el => {
                if (el.index == cIndex) {
                  return {
                    ...el,
                    image: {
                      name: res?.assets[0]?.fileName,
                      type: res?.assets[0]?.type,
                      uri: res?.assets[0]?.uri,
                    },
                  };
                } else {
                  return el;
                }
              }),
            );

            setImage({
              uri: res?.assets[0]?.uri,
            });
          }
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

  const handleRemoveImage = state => {
    props.handleOnRemove(cIndex);
    setImage(null);
    setMediaOptions(state);
  };

  const handleFrontCameraMedia = async res => {
    if (cameraRef) {
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
      props.verificationPress('verified', obj);
    }
  };

  const captureMedia = async () => {
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

  const cancelMedia = () => {
    setImage(null);
    props.verificationPress('cancel', null);
  };
  console.log('D INDEX', dIndex);
  return (
    <View
      style={
        props.verificationTxt
          ? [styles.container, props.containerStyle]
          : [
              {
                width: '100%',
                height: OS_VER <= 10 ? '104%' : '100%',
                justifyContent: 'space-between',
              },
              props.styleContainer && props.styleContainer,
            ]
      }>
      {props.verificationTxt && (
        <Text style={styles.verificationTxt}>{props.verificationTxt}</Text>
      )}
      {props.verificationTxt ? null : (
        <DraggableGrid
          onItemPress={item => {
            console.log('onItemPress', item);
          }}
          numColumns={3}
          renderItem={(item, index) => {
            return (
              <Pressable
                onPress={() => {
                  console.log('item INDEX', item.index);
                  setCIndex(item.index);
                  setMediaOptions(true);
                }}
                style={[
                  styles.cardContainer,
                  props.cardStyle,
                  {
                    width: windowWidth * 0.27,
                    height: '96%',
                    backgroundColor: '#D9036814',
                    borderWidth: 1,
                    borderColor: colors.primaryPink,
                    borderStyle: 'dashed',
                  },
                ]}>
                {item.title && (
                  <FastImage
                    source={require('../../assets/iconimages/header-icon.png')}
                    style={{
                      height: 20,
                      width: 20,
                      position: 'absolute',
                      top: 7,
                    }}
                    resizeMode="contain"
                  />
                )}

                {item.image ? (
                  <FastImage
                    source={{uri: item.image.uri}}
                    style={[
                      styles.actualImage,
                      props.actualImage,
                      {
                        width: windowWidth * 0.29,
                        height: '110%',
                      },
                    ]}
                    resizeMode="cover"
                  />
                ) : (
                  <FastImage
                    source={require('../../assets/iconimages/add-circle.png')}
                    style={
                      item.title
                        ? styles.placeholderImageTitle
                        : styles.placeholderImage
                    }
                    resizeMode="contain"
                  />
                )}
                {item.title && <Text style={styles.mainDisplayTxt}></Text>}
                <Pressable
                  style={[styles.imageAbsolute, props.imageAbsolute, {}]}
                  onPress={() => {
                    console.log('item INDEX', item.index);
                    setCIndex(item.index);
                    setMediaOptions(true);
                  }}>
                  {/* <FastImage
                    source={
                      props.verificationTxt
                        ? null
                        : props.profile
                        ? require('../../assets/iconimages/edit-01.png')
                        : props.txt != 'Main profile pic' &&
                          !props.profile &&
                          require('../../assets/iconimages/edit.png')
                    }
                    style={{height: '90%', width: '90%'}}
                    resizeMode="contain"
                  /> */}
                </Pressable>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    height: windowHeight * 0.035,
                    width: '100%',
                    // backgroundColor: 'red',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.primaryPink,
                      fontFamily:'Inter-Medium'
                    }}>
                    {item?.index === 0 ? 'Main profile pic' : null}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          data={props.profilePicArr ? props.profilePicArr : data}
          onDragRelease={data => {
            console.log('DATA check', data);
            // for (let i = 0; i < data.length; i++) {
            //   if (i == 0) {
            //     data[i]['title'] = props.txt;
            //   } else {
            //     data[i]['title'] = null;
            //   }
            // }
            props.setProfilePicArr(data);
          }}
        />
      )}
      <ActionCard
        isImageAct={true}
        heading={'Choose an Action'}
        handleGallery={handleGallery}
        handleCamera={handleCamera}
        handleAlert={handleAlert}
        handleRemoveImage={handleRemoveImage}
        alert={mediaOptions}
      />
      {props.verificationTxt && (
        <>
          {image?.uri ? (
            <>
              <FastImage
                source={{uri: image?.uri ? image?.uri : props.img}}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 5,
                }}
                // resizeMode="contain"
              />
              {image.uri ? (
                <TouchableOpacity
                  onPress={cancelMedia}
                  style={{position: 'absolute', top: 30, right: 16}}>
                  <Icons.AntDesign
                    name="closecircle"
                    size={24}
                    color={colors.primaryPink}
                  />
                </TouchableOpacity>
              ) : null}
            </>
          ) : (
            <RNCamera
              ref={cameraRef}
              style={styles.preview}
              autoFocus="on"
              type="front"
              captureAudio={false}
            />
          )}

          <TouchableOpacity
            onPress={captureMedia}
            style={{
              position: 'absolute',
              bottom:
                windowHeight <= 640
                  ? windowHeight * 0.01 - 30
                  : windowHeight * 0.01 - 34,
            }}>
            <FastImage
              style={{
                width: windowHeight <= 640 ? 45 : 55,
                height: windowHeight <= 640 ? 45 : 55,
              }}
              source={require('../../assets/iconimages/captureBtn.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      )}

      {/* {image?.uri && mediaUri.length > 0 && (
        <ImageView
          images={mediaUri}
          visible={selected}
          onRequestClose={() => setSelected(false)}
          presentationStyle="overFullScreen"
          animationType="slide"
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '48%',
    width: '32%',
    padding: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    // backgroundColor: '#F6F7FB',
    height: '90%',
    width: '92%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainDisplayTxt: {
    position: 'absolute',
    color: colors.primaryBlue,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    bottom: 6,
    textAlign: 'center',
  },
  verificationTxt: {
    alignSelf: 'flex-start',
    paddingBottom: 6,
    fontWeight: '700',
    color: colors.darkBlue,
  },
  preview: {
    width: 180,
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardContainer: {
    marginTop: windowHeight > 750 && windowHeight < 754 ? 20 : 0,
    backgroundColor: '#F6F7FB',
    height: windowHeight > 750 && windowHeight < 754 ? 115 : 120,
    width: windowWidth / 3 - 10,
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAbsolute: {
    position: 'absolute',
    top: 5,
    right: 5,
    height: windowHeight * 0.035,
    width: windowHeight * 0.035,
  },
  actualImage: {
    height: '100%',
    width: '100%',
  },
  placeholderImage: {
    alignSelf: 'center',
    height: windowHeight <= 640 ? 25 : 35,
    width: windowHeight <= 640 ? 25 : 35,
  },
  placeholderImageTitle: {
    alignSelf: 'center',
    height: windowHeight <= 640 ? 25 : 35,
    width: windowHeight <= 640 ? 25 : 35,
  },
});

export default ImageCard;
