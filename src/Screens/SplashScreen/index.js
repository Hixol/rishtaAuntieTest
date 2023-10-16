import React, {useEffect} from 'react';
import {Image, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import {useHelper} from '../../hooks/useHelper';
import {useRNIAP} from '../../hooks/useRNIAP';
import {version} from '../../../package.json';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from './styles';
import ProfileServices from '../../services/ProfileServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BadgeServices from '../../services/BadgeServices';
import colors from '../../utility/colors';

const SplashScreen = props => {
  const {} = useRNIAP();

  const {token, status, mobileNumber, email, userData} = useSelector(
    store => store.userReducer,
  );
  const {routeName} = useSelector(store => store.NewOnBoardingReducer);

  const {
    handlePlayerId,
    handleLocation,
    updateLocation,
    handleStatusCode,
    lat,
    lng,
    city,
    state,
    mulk,
  } = useHelper();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('tokenSplash', token);
    if (token != null) {
      handleLocation();
      setTimeout(() => {
        getMyProfile();
      }, 500);
    }
    setTimeout(async () => {
      if (
        ((token !== null || token !== '' || token !== undefined) &&
          status === 'ACTIVE') ||
        status === 'COMPLETED' ||
        status === 'INCOMPLETE'
      ) {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'BottomTab'}],
          }),
        );
        let ccuid = await AsyncStorage.getItem('ccuid');
        handlePlayerId(token, ccuid);
      } else if (email != '' && status == undefined) {
        console.log('1');
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'WelcomeScreen'}],
          }),
        );
      } else if (mobileNumber != '' && status == undefined) {
        console.log('2');
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'WelcomeScreen'}],
          }),
        );
      } else if (email == '' && status == undefined) {
        console.log('3');
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'WelcomeScreen'}],
          }),
        );
      } else if (mobileNumber == '' && status == undefined) {
        console.log('4');
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'WelcomeScreen'}],
          }),
        );
      } else {
        console.log('5');
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'WelcomeScreen'}],
          }),
        );
      }
    }, 2000);
  }, []);

  if (lat != '' && lng != '' && city != '' && state != '' && mulk != '') {
    updateLocation(token);
  }

  const getMyProfile = () => {
    ProfileServices.getMyProfile(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: 'AUTH_USER_STATUS',
            payload: res?.data?.data?.status,
          });
          callBadge();
        }
      })
      .catch(err => console.log('getMyProfile err', err));
  };

  const callBadge = () => {
    BadgeServices.openApp(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
        }
      })
      .catch(err => console.log('callBadge err', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.logo}
        source={require('../../assets/iconimages/logo.png')}
      />
      <Text style={{color: colors.primaryBlue}}>Version {version}</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;
