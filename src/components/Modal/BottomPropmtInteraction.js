import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {android, windowHeight, windowWidth} from '../../utility/size';
import {UserService} from '../../services';
import {useDispatch, useSelector} from 'react-redux';
import {directory} from '../../utility/regex';
import {useRecorder} from '../../hooks/useRecorder';
import {useHelper} from '../../hooks/useHelper';

import FastImage from 'react-native-fast-image';
import colors from '../../utility/colors';
import config from '../../config/appConfig';

const BottomPromptInteraction = props => {
  const dispatch = useDispatch();
  const {
    Alerts,
    handleStatusCode,
    keyboardOffset,
    setKeyboardOffset,
    setOffset,
  } = useHelper();
  const [comment, setComment] = useState('');
  const [loader, setLoader] = useState(false);
  const {
    onStartRecord,
    onPauseRecord,
    onResumeRecord,
    onStopRecord,
    onSendAudio,
    recordTime,
    recordView,
    pauseView,
    setAudioUri,
  } = useRecorder();

  let bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['40%'], []);

  const {token} = useSelector(store => store.userReducer);

  useEffect(() => {
    if (props.toggle == true) {
      bottomSheetModalRef.current?.present();
    } else if (props.toggle == false) {
      bottomSheetModalRef.current?.close();
    }
  }, [props.toggle]);

  useEffect(() => {
    setOffset(props.offset);

    if (android) {
      directory.checkPermission().then(res => {});

      directory
        .checkAudioPermission()
        .then(res => {
          if (res) {
            directory
              .checkDirectory(config.audioPath)
              .then(res => {
                if (res) {
                } else {
                  directory
                    .makeNewDirectory(config.audioPath)
                    .then(res => {
                      if (res) {
                      }
                    })
                    .catch(err => console.log('make Dir err: ', err));
                }
              })
              .catch(err => console.log('check Dir err: ', err));
          }
        })
        .catch(err => console.log('permission Err: ', err));
    }
  }, []);

  const handleSheetChanges = index => {
    index === -1 ? onStopRecord() : null;
  };

  const handleSendAudio = async () => {
    setLoader(true);
    let audioFile = await onSendAudio();

    let formData = new FormData();
    formData.append('resourceId', props?.item?.id);
    formData.append('resourceType', 'PROFILE_PROMPT');
    formData.append('otherUserId', props?.userId);
    formData.append('file', audioFile);

    UserService.voiceIntercation(formData, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: 'SET_DISCOVER_INDEX',
            payload: props?.userId,
          });
          Alerts(
            'success',
            `You left a voice note on ${props.userName}'s profile prompt successfully`,
          );
        }
      })
      .catch(err => console.log('Prompt voice-note err: ', err))
      .finally(() => {
        props.setToggle(false);
        setAudioUri(null);
        setLoader(false);
      });
  };

  const commentIntercation = () => {
    setLoader(true);
    UserService.commentIntercation(
      {
        resourceId: props?.item?.id,
        comment: comment,
        resourceType: 'PROFILE_PROMPT',
        otherUserId: props?.userId,
      },
      token,
    )
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: 'SET_DISCOVER_INDEX',
            payload: props?.userId,
          });
          Alerts(
            'success',
            `You commented on ${props.userName}'s profile prompt successfully`,
          );
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoader(false);
        setComment('');
        props.setToggle(false);
      });
  };

  return (
    <View style={[styles.container, {bottom: keyboardOffset}]}>
      <BottomSheetModalProvider>
        <View style={{flex: 1}}>
          <BottomSheetModal
            onDismiss={props.onDismiss}
            backgroundStyle={{
              backgroundColor: colors.greyWhite,
            }}
            handleIndicatorStyle={{backgroundColor: colors.primaryPink}}
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <BottomSheetScrollView
              keyboardShouldPersistTaps="handled"
              indicatorStyle="black"
              contentContainerStyle={[
                styles.contentContainer,
                {backgroundColor: colors.greyWhite},
              ]}
              showsVerticalScrollIndicator={true}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                }}>
                <View style={styles.lookingForSec}>
                  <Text style={styles.lookingForTxt}>
                    {props.item?.Question?.title}
                  </Text>
                  <Text style={styles.perfectLatteTxt}>
                    {props.item?.answer}
                  </Text>
                </View>

                {props.modalType === 'mic' ? (
                  <View style={styles.bottomContainer}>
                    {recordView ? (
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                          onPress={onStopRecord}
                          style={[
                            styles.deletePauseContainer,
                            {marginRight: 5},
                          ]}>
                          <FastImage
                            style={{
                              width: '50%',
                              height: '50%',
                            }}
                            resizeMode="contain"
                            source={require('../../assets/iconimages/delete-White.png')}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={pauseView ? onResumeRecord : onPauseRecord}
                          style={styles.deletePauseContainer}>
                          <FastImage
                            style={{
                              width: pauseView ? '50%' : '40%',
                              height: pauseView ? '50%' : '40%',
                            }}
                            resizeMode="contain"
                            source={
                              pauseView
                                ? require('../../assets/iconimages/mic.png')
                                : require('../../assets/iconimages/pauseVoice.png')
                            }
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: '5%',
                            fontSize: 16,
                            color: colors.primaryBlue,
                            fontFamily: 'Inter-Regular',
                          }}>
                          {recordTime}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.voiceText}>Leave a Voice Note</Text>
                    )}

                    <TouchableOpacity
                      onPress={recordView ? handleSendAudio : onStartRecord}
                      style={styles.micContainer}>
                      {loader ? (
                        <ActivityIndicator
                          size={'small'}
                          color={colors.white}
                        />
                      ) : (
                        <FastImage
                          resizeMode="contain"
                          style={{width: '60%', height: '60%'}}
                          source={
                            recordView
                              ? require('../../assets/iconimages/voiceSend.png')
                              : require('../../assets/iconimages/mic.png')
                          }
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      width: '90%',
                      paddingVertical: '5%',
                      backgroundColor: colors.white,
                      flexDirection: 'row',
                      alignSelf: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: '5%',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}>
                    <TextInput
                      onChangeText={setComment}
                      onBlur={() => setKeyboardOffset(0)}
                      placeholder="Write your comment here..."
                      placeholderTextColor={colors.vibeLightGrey}
                      style={{
                        width: '80%',
                        fontSize: 16,
                        color: colors.blackBlue,
                        fontFamily: 'Inter-Regular',
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => commentIntercation()}
                      style={{
                        width: 50,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.primaryPink,
                        borderRadius: 50 / 2,
                      }}>
                      {loader ? (
                        <ActivityIndicator
                          size={'small'}
                          color={colors.white}
                        />
                      ) : (
                        <FastImage
                          resizeMode="contain"
                          style={{width: '60%', height: '60%'}}
                          source={require('../../assets/iconimages/chat.png')}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },

  imageContainer: {
    height: '100%',
    width: windowWidth,
  },
  imgHeader: {
    position: 'absolute',
    padding: '2%',
    alignitems: 'center',
    flexDirection: 'row',
    zindex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  name: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  flagContainer: {
    position: 'absolute',

    zindex: 1,
    bottom: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-around',
  },
  imgFooter: {
    position: 'absolute',
    marginBottom: '5%',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    backgroundColor: 'red',
    paddingHorizontal: '3%',
  },
  imgRight: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '20%',
    bottom: 40,
    right: 10,
    zindex: 1,
    height: windowHeight * 0.2,
  },
  actionIcon: {
    height: windowHeight * 0.057,
    width: windowHeight * 0.057,
    borderRadius: 50,
    backgroundColor: colors.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analystSection: {
    width: windowWidth * 0.92,
    marginVertical: '4%',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: colors.white,
    paddingVertical: '4%',
    paddingHorizontal: '4%',
    justifyContent: 'center',
    shadowColor: '#CCCCCC',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0.4,
    elevation: 5,
  },
  analystTxt: {
    flexDirection: 'row',
    marginTop: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '50%',
    maxWidth: '90%',
  },
  matchingSection: {
    height: windowHeight * 0.23,
    width: windowWidth * 0.92,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginVertical: '4%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: 'grey',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 0.4,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  imgView: {
    height: windowHeight * 0.07,
    width: windowHeight * 0.07,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: '10%',
  },
  myVibesSection: {
    marginVertical: '5%',
    width: windowWidth * 0.92,
    alignSelf: 'center',
    paddingBottom: '7%',
    backgroundColor: 'transparent',
  },
  myvibes: {
    color: colors.primaryPink,
    fontFamily: 'Inter-Medium',
    fontSize: windowHeight * 0.028,
    fontSize: 21,
  },
  ambBtn: {
    backgroundColor: colors.primaryBlue,
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '2%',
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    marginLeft: '1%',
  },
  cardSection: {
    width: windowWidth * 0.92,
    height: windowHeight * 0.59,
    alignSelf: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 7,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  lookingForSec: {
    width: windowWidth * 0.92,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: '6%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    paddingVertical: '3%',
  },
  bottomContainer: {
    width: windowWidth * 0.92,
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingHorizontal: '5%',
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '5%',
  },
  deletePauseContainer: {
    width: 35,
    height: 35,
    borderRadius: 50 / 2,
    backgroundColor: colors.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceText: {
    fontSize: 16,
    color: colors.vibeLightGrey,
    fontFamily: 'Inter-Regular',
  },
  micContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryPink,
    borderRadius: 50 / 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    alignSelf: 'flex-end',
  },
  imgSection: {
    height: windowHeight * 0.76,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 20,
    backgroundColor: 'black',
  },
  paginatorSection: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    alignItems: 'center',
  },
  statementTxt: {
    color: colors.primaryBlue,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  analystFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTxt: {
    fontSize: 16,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Regular',
  },
  matchingSecHeader: {
    flexDirection: 'row',
    width: '49%',
    justifyContent: 'space-between',
    marginVertical: '2%',
  },
  imgCircle: {height: '100%', width: '100%', borderRadius: 50},
  nameTxt: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },
  ambitiousBttn: {
    color: colors.white,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  cardPaginatorView: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    paddingHorizontal: '5%',
  },
  lookingForTxt: {
    color: colors.blackBlue,
    fontFamily: 'Inter-Regular',
    fontSize: windowHeight * 0.019,
  },
  perfectLatteTxt: {
    color: colors.blackBlue,
    fontFamily: 'Inter-Medium',
    fontSize: 24,
    marginTop: '5%',
    alignSelf: 'flex-end',
  },
  actionbtnShadow: {
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  bulbSect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    height: '38%',
    alignItems: 'center',
    marginTop: '1%',
  },
  meView: {
    height: '86%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bulbView: {
    height: '100%',
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meTxt: {
    color: '#A7A8A8',
    fontFamily: 'Inter-Medium',
  },
  lookingForFooter: {
    backgroundColor: colors.primaryBlue,
    marginTop: '2%',
    height: '34%',
    width: '95%',
    borderRadius: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    lineHeight: 15,
  },
  matchingDesc: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    lineHeight: 15,
  },
  nameView: {
    position: 'absolute',
    zindex: 1,
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  iconImg: {
    height: windowHeight * 0.055,
    width: windowHeight * 0.055,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomPromptInteraction;
