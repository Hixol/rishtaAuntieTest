import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {windowHeight} from '../../utility/size';
import {useDispatch, useSelector} from 'react-redux';
import {UserService} from '../../services';
import {useHelper} from '../../hooks/useHelper';

import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import Icons from '../../utility/icons';
import MyButton from '../buttons/MyButton';

const ActionCard = props => {
  const dispatch = useDispatch();
  const {Alerts, handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  const [reason, setReason] = useState('');
  const [blockUser, setBlockUser] = useState(false);

  const handleBlockUser = () => {
    if (reason == '') {
      Alerts('error', 'Please give reason!');
    } else {
      props.handleAlert(false);

      UserService.blockUser(props?.userId, token, {
        reason,
      })
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            if (props.showToast) {
              Alerts('success', `You have blocked ${props.userName}`);

              dispatch({
                type: 'SET_DISCOVER_INDEX',
                payload: props?.userId,
              });
            } else {
              props.handleBlockAlert(true);
            }
          }
        })
        .catch(err => Alerts('error', err?.message.toString()));
    }
  };

  return (
    <Modal
      transparent
      visible={props.alert && props.alert}
      animationType={'fade'}>
      <KeyboardAvoidingView
        style={[styles.boxBg, {height: windowHeight}]}
        behavior="padding">
        <View
          style={[
            styles.privacyBox,
            blockUser && {height: 220},
            props.fav && {height: windowHeight * 0.29},
          ]}>
          {blockUser ? (
            <Text style={styles.privacyTxt}>Block User</Text>
          ) : (
            <Text style={styles.privacyTxt}>{props.heading}</Text>
          )}
          {
            props.isImageAct ? (
              // Gallery Action Card Footer Start
              <View
                style={[
                  styles.galleyFooter,
                  props.chatType == 'GROUP' && {
                    justifyContent: 'space-around',
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => props.handleGallery(false)}
                  style={styles.iconContainer}>
                  <Icons.FontAwesome
                    name="image"
                    size={40}
                    color={colors.primaryBlue}
                  />
                  <Text style={styles.iconTxt}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => props.handleCamera(false)}
                  style={styles.iconContainer}>
                  <Icons.FontAwesome
                    name="camera"
                    size={40}
                    color={colors.primaryBlue}
                  />
                  <Text style={styles.iconTxt}>Camera</Text>
                </TouchableOpacity>
                {props.chatType == 'ONE-TO-ONE' ? (
                  <TouchableOpacity
                    onPress={() => props.handleVideo(false)}
                    style={styles.iconContainer}>
                    <Icons.Entypo
                      name="video-camera"
                      color={colors.primaryBlue}
                      size={44}
                    />
                    <Text style={styles.iconTxt}>Video</Text>
                  </TouchableOpacity>
                ) : props.chatType != 'GROUP' ? (
                  <TouchableOpacity
                    onPress={() => props?.handleRemoveImage(false)}
                    style={styles.iconContainer}>
                    <Icons.Entypo
                      name="cross"
                      color={colors.primaryBlue}
                      size={40}
                    />
                    <Text style={styles.iconTxt}>Remove</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : props.quiz ? (
              <View style={[styles.galleyFooter, {justifyContent: 'center'}]}>
                <TouchableOpacity
                  onPress={() => props.handleQuiz(false)}
                  style={styles.iconContainer}>
                  <Icons.MaterialCommunityIcons
                    name="frequently-asked-questions"
                    size={40}
                    color={colors.primaryBlue}
                  />
                  <Text style={styles.iconTxt}>Personality Quiz</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Gallery Action Card Footer End
              // Profile Privacy Card Footer Start
              <View
                style={[
                  styles.boxFooter,
                  {
                    height: props.unmatch
                      ? windowHeight * 0.2
                      : windowHeight * 0.13,
                  },
                ]}>
                {props.fav && (
                  <TouchableOpacity
                    onPress={props.fav}
                    style={[styles.boxInside, styles.bottomBar]}>
                    <Text style={styles.boxText}>Favourite messages</Text>
                    <View style={styles.arrowIconView}>
                      <FastImage
                        resizeMode="contain"
                        style={styles.arrowIconImage}
                        source={require('../../assets/iconimages/long-arrow-right.png')}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                {props.unmatch && (
                  <TouchableOpacity
                    onPress={props.handleUnmatchUser}
                    style={[
                      styles.boxInside,
                      styles.bottomBar,
                      {height: props.unmatch ? 65 : null},
                    ]}>
                    <Text style={styles.boxText}>Unmatch User</Text>
                    <View style={styles.arrowIconView}>
                      <FastImage
                        resizeMode="contain"
                        style={styles.arrowIconImage}
                        source={require('../../assets/iconimages/long-arrow-right.png')}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                {blockUser ? (
                  <>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Write Here"
                      placeholderTextColor={colors.black}
                      multiline={true}
                      backgroundColor={colors.greyWhite}
                      borderRadius={10}
                      textAlignVertical={'top'}
                      onChangeText={setReason}
                    />
                    <MyButton title="Submit" onPress={handleBlockUser} />
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={
                        props.alert
                          ? props.handleReportAlert
                          : props.handleBlockedScreen
                      }
                      style={[
                        styles.boxInside,
                        styles.bottomBar,
                        {height: props.unmatch ? 65 : null},
                      ]}>
                      <Text style={styles.boxText}>
                        {props.alert ? 'Report User' : 'View My Blocked List'}
                      </Text>
                      <View style={styles.arrowIconView}>
                        <FastImage
                          resizeMode="contain"
                          style={styles.arrowIconImage}
                          source={require('../../assets/iconimages/long-arrow-right.png')}
                        />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={
                        props.alert
                          ? () => setBlockUser(true)
                          : props.handleHomeScreen
                      }
                      style={[
                        styles.boxInside,
                        {
                          height: props.unmatch ? 65 : null,
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                        },
                      ]}>
                      <Text style={styles.boxText}>
                        {props.alert ? 'Block User' : 'Go Home'}
                      </Text>
                      <View style={styles.arrowIconView}>
                        <FastImage
                          resizeMode="contain"
                          style={styles.arrowIconImage}
                          source={require('../../assets/iconimages/long-arrow-right.png')}
                        />
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )
            // Profile Privacy Card Footer End
          }
          {props.videoUpload ? (
            <TouchableOpacity
              onPress={props.handleCloseAlert}
              style={styles.alertCrossBtn}>
              <Icons.Entypo
                name="cross"
                color={colors.primaryPink}
                size={windowHeight * 0.065}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={
                props.alert
                  ? () => props.handleAlert(false)
                  : props.handleHomeScreen
              }
              style={styles.alertCrossBtn}>
              <Icons.Entypo
                name="cross"
                color={colors.primaryPink}
                size={windowHeight * 0.065}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  boxBg: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIconView: {
    width: '10%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  arrowIconImage: {width: '100%', height: '100%'},
  privacyBox: {
    paddingVertical: '5%',
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  boxText: {
    fontSize: 18,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Medium',
  },
  boxInside: {
    paddingHorizontal: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBar: {
    borderBottomColor: '#bbbbbb',
    borderBottomWidth: 0.7,
  },
  privacyTxt: {
    color: colors.primaryBlue,
    fontSize: 25,
    fontFamily: 'Inter-Medium',
    width: '70%',
    textAlign: 'center',
  },
  boxFooter: {
    width: '100%',
    height: windowHeight * 0.13,
    borderRadius: 10,
    marginTop: '2%',
  },
  alertCrossBtn: {
    height: windowHeight * 0.072,
    width: windowHeight * 0.072,
    borderRadius: 50,
    backgroundColor: colors.white,
    position: 'absolute',
    top: -18,
    right: -10,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0.4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleyFooter: {
    width: '75%',
    height: windowHeight * 0.14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTxt: {
    color: colors.primaryBlue,
    fontFamily: 'Inter-Medium',
    marginTop: '10%',
  },
  iconContainer: {
    alignItems: 'center',
  },
  textInput: {
    padding: 12,
    margin: 12,
    minHeight: 90,
    color: colors.black,
  },
});

export default ActionCard;
