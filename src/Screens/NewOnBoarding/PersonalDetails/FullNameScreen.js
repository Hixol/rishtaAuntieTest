import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import colors from '../../../utility/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import CustomTextInput from '../../../components/Textinput';
import DatePicker from 'react-native-date-picker';
import BottomButton from '../../../components/buttons/BottomButton';
import {useSelector, useDispatch} from 'react-redux';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useHelper} from '../../../hooks/useHelper';
import {alerts} from '../../../utility/regex';

const FullNameScreen = ({navigation, route}) => {
  const {userData, token} = useSelector(store => store.userReducer);
  const {updateUser} = useHelper();

  const edit = route?.params;

  const dispatch = useDispatch();
  const {firstName, lastName} = useSelector(
    store => store.NewOnBoardingReducer,
  );

  const [firstName1, setFirstname] = useState('');
  const [lastName1, setLastname] = useState('');

  useEffect(() => {
    if (edit) {
      setFirstname(userData?.firstName);
    } else {
      if (firstName !== '') {
        setFirstname(firstName);
      }
      if (lastName !== '') {
        setLastname(lastName);
      }
    }
  }, []);

  const continueButton = async () => {
    if (edit) {
      let formData = new FormData();
      formData.append('firstName', firstName1);
      await updateUser(formData, token);
      navigation.goBack();
    } else {
      dispatch({
        type: 'firstName',
        payload: firstName1,
      });
      dispatch({
        type: 'lastName',
        payload: lastName1,
      });
      if (firstName1 !== '' && lastName1 !== '') {
        navigation.navigate('DobScreen');
      } else {
        alerts('error', 'Please fill all the fields');
      }
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{flex: 1, padding: 20, backgroundColor: colors.white}}>
        <TouchableOpacity
          onPress={() =>
            edit
              ? navigation.goBack()
              : navigation.reset({
                  index: 0,
                  routes: [{name: 'WelcomeScreen'}],
                })
          }>
          <FastImage
            resizeMode="contain"
            style={{width: 20, height: 30}}
            source={require('../../../assets/iconimages/arrow-back.png')}
          />
        </TouchableOpacity>
        <View style={{marginTop: '8%'}}>
          <Text style={styles.heading}>About you</Text>
          <Text style={styles.lightText}>
            Your last name is hidden from other users.
          </Text>
          <View style={{width: '100%', marginVertical: '5%'}}></View>
          <CustomTextInput
            leftIcon={require('../../../assets/iconimages/useroutline.png')}
            value={firstName1}
            onChangeText={text => setFirstname(text)}
            placeholder="First Name"
          />
          {edit ? null : (
            <CustomTextInput
              leftIcon={require('../../../assets/iconimages/useroutline.png')}
              value={lastName1}
              onChangeText={text => setLastname(text)}
              placeholder="Last Name"
            />
          )}
        </View>
        <BottomButton onPress={() => continueButton()} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  heading: {fontFamily: 'Inter-Bold', fontSize: 25, color: colors.black},
  lightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginTop: '3%',
    color: '#6B7280',
  },
});
export default FullNameScreen;
