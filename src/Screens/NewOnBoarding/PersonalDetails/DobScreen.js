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
  Appearance,
  Platform,
} from 'react-native';
const theme = Appearance.getColorScheme();
import colors from '../../../utility/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import CustomTextInput from '../../../components/Textinput';
import DatePicker from 'react-native-date-picker';
import BottomButton from '../../../components/buttons/BottomButton';
import {useSelector, useDispatch} from 'react-redux';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import moment from 'moment';
import { alerts } from '../../../utility/regex';

const DobScreen = ({navigation}) => {
  console.log('THEME', theme);

  const dispatch = useDispatch();
  const {dob} = useSelector(store => store.NewOnBoardingReducer);
  const [dob1, setDob1] = useState(new Date());

  const [showDate, setShowDate] = useState(false);
  const [age, setAge] = useState('');
  let diffTime, diffDate, calculatedAge;

  console.log('calculatedAge', age);
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (dob === null) {
        setShowDate(true);
      }
    }, 500);
  }, []);
  useEffect(() => {
    if (dob !== null) {
      setDob1(dob);
    }
  }, []);
  console.log('dob', dob1);
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
        <Text style={styles.heading}>What's Your Birth Date</Text>
        <Text style={styles.lightText}>
          Other users will only see your age. You can hide your age in
          preferences after your profile is verified.
        </Text>
        <View style={{width: '100%', marginVertical: '5%'}}></View>
      </View>
      {showDate ? null : (
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: 'Inter-Medium',
              color: colors.black,
            }}>
            Age:
          </Text>
          <Text
            style={{
              fontSize: 25,
              color: colors.black,
              fontFamily: 'Inter-Regular',
            }}>
            {dob === null ? null : ' ' + moment(dob1).format('YYYY/MM/DD')}
          </Text>
        </TouchableOpacity>
      )}
      {dob === null ? null : (
        <TouchableOpacity
          onPress={() => setShowDate(true)}
          style={{
            width: '105%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: '5%',
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
            {'Change Date of Birth'}
          </Text>
          <FastImage
            style={{width: 15, height: 15, marginLeft: '3%'}}
            resizeMode="contain"
            source={require('../../../assets/iconimages/editt.png')}
          />
        </TouchableOpacity>
      )}

      <DatePicker
        open={showDate}
        modal
        style={{alignSelf: 'center'}}
        theme={'light'}
        // customStyles={{
        //   dateInput: {
        //     borderWidth: 0,
        //     right: 30,
        //   },
        //   dateText: {
        //     marginTop: 10,
        //     // color: theme === 'dark' ? 'white' : 'black',
        //     fontSize: 16,
        //   },
        //   placeholderText: {
        //     // color: theme === 'dark' ? 'white' : 'black',
        //     fontSize: 16,
        //     width: '100%',
        //     justifyContent: 'center',
        //     flex: 1,
        //     textAlign: 'center',
        //     flexDirection: 'row',
        //     marginTop: 9,
        //     left: 20,
        //   },
        // }}
        mode="date"
        textColor={
          theme === 'dark' && Platform.OS === 'android'
            ? colors.white
            : colors.black
        }
        date={new Date(dob1)}
        androidVariant="nativeAndroid"
        onConfirm={date => {
          console.log('date', date);
          setDob1(date);
          setShowDate(!showDate);

          dispatch({
            type: 'dob',
            payload: date,
          });
          // setDate(date);
          diffTime = Math.abs(date - new Date());
          diffDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          calculatedAge = Math.floor(diffDate / 365);
          setAge(calculatedAge);
          if (calculatedAge < 18) {
            alerts('error', 'You must be at least 18 years of age.');
          } else {
            navigation.navigate('GenderScreen')
            // getCallBackVal(date);
          }
          // navigation.goBack();
        }}
        onCancel={() => {
          setShowDate(false);
          setAge('');
        }}
      />
      {!showDate && (dob === '' || dob === null) ? (
        <BottomButton
          text={'Select Date of Birth'}
          onPress={() => setShowDate(true)}
        />
      ) : (
        <BottomButton
          onPress={() => {
            // dispatch({
            //   type: 'dob',
            //   payload: dob1,
            // });
            navigation.navigate('GenderScreen');
          }}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  heading: {fontFamily: 'Inter-Bold', fontSize: 25, color: colors.black},
  lightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginTop: '3%',
    color: colors.textGrey1,
  },
});
export default DobScreen;
