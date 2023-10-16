import React from 'react';
import {
  View,
  Modal,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ios, windowHeight} from '../../utility/size';

import colors from '../../utility/colors';
import Icons from '../../utility/icons';
import FastImage from 'react-native-fast-image';

const InteractionModal = props => {
  return (
    <View>
      {props.promptInteraction ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={
            props.promptCommentInteraction || props.promptVoiceInteraction
          }
          onRequestClose={props.onRequestClose}>
          <View
            style={[
              {
                backgroundColor: '#00000061',
              },
              {height: windowHeight},
            ]}>
            <View
              style={{
                width: '100%',
                height: windowHeight * 0.5,
                position: 'absolute',
                bottom: 0,
                zIndex: 1,
                alignSelf: 'flex-end',
                top: ios ? windowHeight * 0.08 : 20,
                right: 25,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}>
                <Text>Hello</Text>
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.commentModal || props.InteractionModal}
          onRequestClose={props.onRequestClose}>
          <View
            style={[
              {
                backgroundColor: '#00000061',
              },
              {height: windowHeight},
            ]}>
            <View
              style={{
                width: '100%',
                height: windowHeight * 0.78,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '75%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  blurRadius={10}
                  style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    position: 'absolute',
                  }}
                  source={{uri: props.fastImage}}
                />

                <FastImage
                  style={{width: '80%', height: '80%', zIndex: 1}}
                  source={{uri: props.image}}
                />
                <TouchableOpacity
                  onPress={props.closeModal}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    alignSelf: 'flex-end',
                    top: 20,
                    right: 25,
                  }}>
                  <Icons.FontAwesome name="close" size={30} color={'white'} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '25%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.greyWhite,
                }}>
                <View
                  style={{
                    width: '90%',
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    height: '60%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: '5%',
                    flexDirection: 'row',
                  }}>
                  {props.comment ? (
                    <TextInput
                      onChangeText={props.onChangeText}
                      style={{
                        fontSize: 15,
                        width: '80%',
                        fontFamily: 'Roboto-Regular',
                        color: colors.black,
                      }}
                      placeholderTextColor={colors.black}
                      placeholder={
                        props.comment
                          ? 'Leave a comment'
                          : props.voice
                          ? 'Leave a Voice Note'
                          : null
                      }
                    />
                  ) : props.voice ? (
                    props.interactionView === true ? (
                      <View style={{width: '80%'}}>
                        <View>{props.recordView}</View>
                      </View>
                    ) : (
                      <Text
                        style={{
                          fontSize: 15,
                          width: '80%',
                          fontFamily: 'Roboto-Regular',
                          color: colors.black,
                        }}>
                        Leave a Voice Note
                      </Text>
                    )
                  ) : null}

                  <TouchableOpacity
                    onPress={props.onPress}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primaryPink,
                    }}>
                    <FastImage
                      source={
                        props.comment
                          ? require('../../assets/iconimages/chat.png')
                          : props.voice && props.interactionView === false
                          ? require('../../assets/iconimages/mic.png')
                          : props.voice && props.interactionView === true
                          ? require('../../assets/iconimages/voiceSend.png')
                          : null
                      }
                      style={{
                        height: '54%',
                        width: '54%',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
export default InteractionModal;
