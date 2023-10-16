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
import moment from 'moment';

const GenderScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {gender} = useSelector(store => store.NewOnBoardingReducer);
  const [gender1, setGender1] = useState('Male');

  useEffect(() => {
    if (gender === '') {
      setGender1('Male');
    } else {
      setGender1(gender);
    }
  }, []);

  const ContinuePress = () => {
    dispatch({
      type: 'gender',
      payload: gender1,
    });
    navigation.navigate('ReligionScreen');
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 20, backgroundColor: colors.white}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FastImage
          resizeMode="contain"
          style={{width: 20, height: 30}}
          source={require('../../../assets/iconimages/arrow-back.png')}
        />
      </TouchableOpacity>
      <View style={{marginTop: '8%'}}>
        <Text style={styles.heading}>Select your gender</Text>
        {/* <Text style={styles.lightText}>Please select your Gender</Text> */}
        <View style={{width: '100%', marginVertical: '5%'}}></View>
      </View>
      <View style={styles.genderMainView}>
        <TouchableOpacity
          onPress={() => setGender1('Male')}
          style={[
            styles.genderView,
            {
              backgroundColor:
                gender1 === 'Male' ? colors.primaryBlue : '#F9FAFB',
            },
          ]}>
          <FastImage
            tintColor={gender1 === 'Male' ? colors.white : '#111827'}
            resizeMode="contain"
            style={{
              width: 40,
              height: 40,
              tintColor: gender1 === 'Male' ? colors.white : colors.primaryBlue,
            }}
            source={require('../../../assets/iconimages/Union.png')}
          />
          <Text
            style={[
              styles.genderText,
              {
                color: gender1 === 'Male' ? colors.white : '#111827',
              },
            ]}>
            Male
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGender1('Female')}
          style={[
            styles.genderView,
            {
              backgroundColor:
                gender1 === 'Female' ? colors.primaryPink : '#F9FAFB',
            },
          ]}>
          <FastImage
            tintColor={gender1 === 'Female' ? colors.white : '#111827'}
            resizeMode="contain"
            style={{width: 40, height: 40}}
            source={require('../../../assets/iconimages/Union2.png')}
          />
          <Text
            style={[
              styles.genderText,
              {
                color: gender1 === 'Female' ? colors.white : '#111827',
              },
            ]}>
            Female
          </Text>
        </TouchableOpacity>
      </View>
      <BottomButton onPress={() => ContinuePress()} />
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
  genderMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical:'10%'
  },
  genderView: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: '12%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 20,
    color: colors.white,
    marginTop: '5%',
    fontFamily: 'Inter-Medium',
  },
});
export default GenderScreen;
