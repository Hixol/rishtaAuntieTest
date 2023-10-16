import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {windowHeight} from '../../utility/size';
import {useHelper} from '../../hooks/useHelper';

import FastImage from 'react-native-fast-image';
import colors from '../../utility/colors';
import UserService from '../../services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import {useDispatch, useSelector} from 'react-redux';

const CELL_COUNT = 6;

const OtpScreen = props => {
  const {phoneNum, otp} = props?.route?.params;
  const {dispatchAndNavigate, handleLocation, handleStatusCode, Alerts} =
    useHelper();
  const {religion} = useSelector(store => store.NewOnBoardingReducer);

  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  let [otpResend, setOtpResend] = useState(null);
  let [timer, setTimer] = useState(10);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const resendOtp = () => {
    setValue('');
    startTimer();
    if (phoneNum === '') {
      Alerts('error', 'Phone Number is required...!');
    } else {
      UserService.login({
        phoneNumber: phoneNum,
      })
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setOtpResend(res.data.data.otp);
            Alerts('success', 'OTP sent successfully');
            const timer = 10;
            setTimer(timer);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const startTimer = () => {
    let interval = setInterval(() => {
      setTimer(prevTimer => {
        prevTimer <= 1 && clearInterval(interval);
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    setTimeout(() => {
      if (otpResend != null) {
        setValue(`${otpResend}`);
      } else {
        setValue(`${otp}`);
      }
    }, 3000);
  }, [otpResend]);

  useEffect(() => {
    startTimer();
    handleLocation();
  }, []);

  const verifyOtp = () => {
    if (otp.toString().length < 6) {
      Alerts('error', 'Please enter 6-digit otp!');
    } else if (
      otp.toString().length === 6 &&
      (phoneNum == '' || phoneNum == undefined || phoneNum == null)
    ) {
      Alerts('error', 'Please enter correct phone number!');
    } else {
      setLoading(true);
      UserService.verifyOtp({
        phoneNumber: phoneNum,
        code: otpResend !== null ? otpResend : otp,
      })
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            Alerts('success', res.data.message);
            const timer = 0;
            setTimer(timer);

            let data = res?.data?.data;
            // dispatch({
            //   type: 'religion',
            //   payload:
            //     data?.Profile?.religion === 'Islam'
            //       ? 'Muslim'
            //       : data?.Profile?.religion === 'Muslim'
            //       ? 'Muslim'
            //       : data?.Profile?.religion,
            // });

            if (data != null) {
              AsyncStorage.setItem('token', data?.JWTToken);
              AsyncStorage.setItem('login', phoneNum);

              if (data.status === 'INACTIVE') {
                dispatchAndNavigate(data.status, 'FullNameScreen', data);
              } else {
                dispatchAndNavigate(data.status, 'BottomTab', data);
              }
            }
          }
        })
        .catch(err => Alerts('error', err?.message.toString()))
        .finally(() => setLoading(false));
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <FastImage
          style={{width: '100%', height: '100%'}}
          resizeMode={'contain'}
          source={require('../../assets/iconimages/logo.png')}
        />
      </View>
      <Text style={styles.verifyTitle}>Verify OTP</Text>

      <View style={styles.codeFieldContainer}>
        <CodeField
          ref={ref}
          {...prop}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor delay={1000} /> : null)}
            </Text>
          )}
        />
      </View>

      <TouchableOpacity
        disabled={value == '' ? true : false}
        onPress={verifyOtp}
        style={[
          styles.verifyContainer,
          {
            backgroundColor:
              value.length < 6 ? colors.softGrey : colors.primaryBlue,
            paddingVertical: loading ? '6%' : '3%',
          },
        ]}>
        {loading ? <Loader /> : <Text style={styles.verifyTxt}>Verify</Text>}
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.otpTxt}>Didn't get OTP ? Resend in {timer}</Text>
      </View>

      {timer == 0 ? (
        <TouchableOpacity onPress={resendOtp} style={styles.resendOtpContainer}>
          <Text style={styles.resendOtpTxt}>Resend OTP</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default OtpScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyWhite,
  },
  header: {
    width: '30%',
    height: windowHeight * 0.1,
    alignSelf: 'center',
    marginVertical: '10%',
  },
  root: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
  },
  codeFieldContainer: {width: '80%', alignItems: 'center', alignSelf: 'center'},
  codeFieldRoot: {
    marginTop: 20,
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 20,
    borderWidth: 2,
    borderRadius: 6,
    color: colors.primaryBlue,
    borderColor: colors.primaryPink,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '2%',
    fontFamily: 'Inter-Regular',
  },
  focusCell: {
    borderColor: colors.primaryBlue,
  },
  profilePicText: {padding: '4%'},
  logo: {
    alignSelf: 'center',
    marginTop: '10%',
    height: 120,
    width: 170,
  },
  verifyTitle: {
    marginBottom: '2%',
    fontFamily: 'Inter-Bold',
    fontSize: 30,
    alignSelf: 'center',
    color: colors.primaryBlue,
  },
  verifyContainer: {
    marginTop: '10%',
    alignItems: 'center',
    paddingVertical: '3%',
    marginHorizontal: '10%',
    borderRadius: 30,
  },
  verifyTxt: {
    fontSize: 20,
    color: colors.white,
    fontFamily: 'Inter-Regular',
  },
  row: {
    maxWidth: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpTxt: {
    fontSize: 15,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter-Regular',
  },
  resendOtpContainer: {
    marginTop: '5%',
    alignSelf: 'center',
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    paddingVertical: '2%',
    paddingHorizontal: '3%',
    borderRadius: 30,
    fontFamily: 'Inter-Regular',
  },
  resendOtpTxt: {fontSize: 15, color: 'white'},
});
