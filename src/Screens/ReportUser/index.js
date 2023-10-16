import React, {useState} from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useHelper} from '../../hooks/useHelper';
import {alerts} from '../../utility/regex';

import styles from './styles';
import colors from '../../utility/colors';
import HeaderContainer from '../../components/containers/headerContainer';
import UserService from '../../services/UserService';
import FastImage from 'react-native-fast-image';

const ReportAccountScreen = props => {
  const userId = props?.route?.params?.userId;
  const userName = props?.route?.params?.userName;

  const dispatch = useDispatch();
  const {handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  const [reason, setReason] = useState(null);
  const [description, setDescription] = useState('');
  const [modal, setModal] = useState(false);

  const blockUser = () => {
    UserService.blockUser(userId, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setModal(!modal);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const reportandBlock = () => {
    if (reason == null) {
      alerts('error', 'Please choose a suitable option!');
    } else if (description == '') {
      alerts('error', 'Please give reason!');
    } else {
      reportUser();
      blockUser();
    }
  };

  const reportUser = () => {
    if (reason == null) {
      alerts('error', 'Please choose a suitable option!');
    } else if (description == '') {
      alerts('error', 'Please give reason!');
    } else {
      UserService.reportUser(userId, token, {
        reason: reason,
        description: description,
      })
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setModal(!modal);

            dispatch({
              type: 'SET_DISCOVER_INDEX',
              payload: userId,
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const radio_prop = [
    {label: 'Harrasment', value: 0},
    {label: 'Inappropriate content', value: 1},
    {label: 'They were impersonating someone else', value: 2},
    {label: 'They are too young to be on Risht Aunty', value: 3},
    {label: 'They were soliciting', value: 4},
    {label: 'Other', value: 5},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer
        goback={'arrow-back'}
        backButton
        Icon
        name={'setting'}
        gobackButtonPress={() => props.navigation.goBack()}
      />
      <ScrollView paddingHorizontal={5} keyboardShouldPersistTaps="always">
        <Modal
          animationType="slide"
          transparent
          visible={modal}
          onRequestClose={() => {
            setModal(!modal);
          }}>
          <View
            style={{
              backgroundColor: '#00000061',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <View
              style={{
                width: '80%',
                borderRadius: 10,
                height: '15%',
                backgroundColor: colors.greyWhite,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: '2%',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 20,
                  color: colors.primaryBlue,
                }}>
                You have Reported {userName}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('BottomTab')}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  padding: '5%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: colors.primaryBlue,
                    fontFamily: 'Roboto-Medium',
                  }}>
                  Go home
                </Text>
                <View
                  style={{
                    width: '10%',
                    height: '50%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <FastImage
                    resizeMode="contain"
                    style={{width: '100%', height: '100%'}}
                    source={require('../../assets/iconimages/long-arrow-right.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.deleteText}>Report User</Text>
        <View>
          <View style={[styles.ViewContainer, {paddingVertical: '5%'}]}>
            <Text style={styles.feedbackText}>
              If a user is making you uncomfortable and not following the Rishta
              Auntie code of conduct, please let us know!
            </Text>
          </View>
          <View style={[styles.ViewContainer, {padding: '5%'}]}>
            <View>
              {radio_prop.map(i => {
                return (
                  <View>
                    <TouchableOpacity
                      key={i.reason}
                      onPress={() => {
                        setReason(i?.label);
                      }}
                      style={styles.container1}>
                      <View
                        style={[
                          styles.radioCircle,

                          {
                            backgroundColor:
                              i?.label === reason
                                ? colors.primaryPink
                                : '#A9A9A9',
                          },
                        ]}></View>
                      <Text style={styles.radioText}>{i.label}</Text>
                    </TouchableOpacity>
                    <View style={styles.horizontalLine} />
                  </View>
                );
              })}
            </View>
          </View>
          <View style={[styles.ViewContainer, {paddingVertical: '5%'}]}>
            <Text style={styles.pleaseExplainText}>Please Explain</Text>
            <TextInput
              onChangeText={value => setDescription(value)}
              style={{padding: 12}}
              placeholder="Write Here"
              multiline={true}
              backgroundColor={colors.greyWhite}
              borderRadius={10}
              height={180}
              textAlignVertical={'top'}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                paddingHorizontal: '5%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => reportUser()}>
                <Text style={styles.btnTitle}>Report User </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  {backgroundColor: colors.primaryBlue, borderWidth: 0},
                ]}
                onPress={() => reportandBlock()}>
                <Text style={[styles.btnTitle, {color: colors.white}]}>
                  Report & Block
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ReportAccountScreen;
