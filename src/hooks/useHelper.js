import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {Linking} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {android, ios, OS_VER, userDevice} from '../utility/size';
import {alerts, handlePermissions} from '../utility/regex';
import {PERMISSIONS} from 'react-native-permissions';
import {UserService} from '../services';

import OneSignal from 'react-native-onesignal';
import NotificationServices from '../services/NotificationServices';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import ProfileServices from '../services/ProfileServices';

export const useHelper = props => {
  const {userData} = useSelector(store => store.userReducer);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [mulk, setMulk] = useState('');
  const [offset, setOffset] = useState(0);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    handleKeyboardEvents(offset);
  }, [offset]);

  const handleKeyboardEvents = offset => {
    Keyboard.addListener('keyboardWillShow', e => {
      if (ios) {
        if (
          (userDevice.includes('X') || userDevice.includes('x')) &&
          !userDevice.includes('Pro')
        ) {
          setKeyboardOffset(e.endCoordinates.height - 35);
        } else {
          setKeyboardOffset(e.endCoordinates.height - offset);
        }
      }
    });

    Keyboard.addListener('keyboardWillHide', e => {
      setKeyboardOffset(0);
    });
  };

  const handleDisablePremium = () => {
    const new_device_link = 'https://apps.apple.com/account/subscriptions';
    const old_device_link =
      'https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions';

    if (ios) {
      Linking.openURL(new_device_link);
    } else {
      Linking.openURL(
        'https://play.google.com/store/account/subscriptions?package=com.rishtaaunty',
      );
    }
  };

  const Alerts = (type, msg) => {
    const msgType = {
      success: 'Success',
      info: 'Info',
      error: 'Error',
    };

    Toast.show({
      type: type,
      text1: msgType[type],
      text2: msg,
      visibilityTime: 2700,
      topOffset: ios ? 40 : 10,
    });
  };

  const handleStatusCode = res => {
    if (res.status >= 300 && res.status <= 399) {
      Alerts(
        'error',
        'You need to perform further actions to complete the request!',
      );
    } else if (res.status >= 400 && res.status <= 499) {
      Alerts('error', res.data?.error?.message);
    } else if (res.status >= 500 && res.status <= 599) {
      Alerts('error', 'Internal server error! Your server is probably down.');
    } else if (res.status != 200 && res.status != 201) {
      Alerts('error', 'Something went wrong. Please try again later!');
    }
  };

  const handlePlayerId = (token, ccuid) => {
    OneSignal.getDeviceState()
      .then(res => {
        if (res.userId.length > 0) {
          const body = {
            deviceToken: res.userId,
            ccuid: `${ccuid}`,
          };

          NotificationServices.deviceToken(body, token)
            .then(res => {})
            .catch(err => console.log('deviceToken err:', err));
        }
      })
      .catch(err => console.log('getDeviceState err:', err));
  };

  const dispatchAndNavigate = (status, route, data) => {
    if (data != null) {
      dispatch({
        type: 'AUTH_TOKEN',
        payload: data.JWTToken,
      });
      dispatch({
        type: 'SET_USER_ID',
        payload: data.id,
      });
      dispatch({
        type: 'AUTH_USER',
        payload: data,
      });
    }
    if (status !== 'INACTIVE') {
      dispatch({
        type: 'AUTH_USER_STATUS',
        payload: status,
      });
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: route}],
      }),
    );
  };

  const updateLocation = token => {
    let body = {
      longitude: lng,
      latitude: lat,
      city: city,
      country: mulk,
      address: state,
    };
    UserService.updateCurrentLocation(body, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
        }
      })
      .catch(err => console.log('updateCurrentLocation err', err));
  };

  const getAddress = (lat, lng) => {
    let KEY = 'AIzaSyBZaB5rG_KQEZl5EwI_YMXmGilE81WVJXo';
    let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${KEY}`;
    axios
      .get(geocodeUrl)
      .then(res => {
        let data = res.data.results;
        let city = '',
          state = '',
          address = '',
          country = '';

        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].address_components.length; j++) {
            if (data[i].address_components[j].types[0] == 'locality') {
              city = data[i].address_components[j].long_name;
              setCity(data[i].address_components[j].long_name);
            }
            if (
              data[i].address_components[j].types[0] ==
              'administrative_area_level_1'
            ) {
              state = data[i].address_components[j].long_name;
              setState(data[i].address_components[j].long_name);
            }
            if (data[i].types[0] == 'route') {
              let arr = data[i].formatted_address.split(', ');
              if (arr[0] === 'Unnamed Road') {
                arr = arr.slice(1, -1);
              } else {
                arr = arr.slice(0, -1);
              }
              address = arr.join(', ');
              setAddress(arr.join(', '));
            }
            if (data[i].types[0] == 'country') {
              country = data[i].formatted_address;
              setMulk(data[i].formatted_address);
            }
          }
        }

        if (
          lat != '' &&
          lng != '' &&
          city != '' &&
          state != '' &&
          address != '' &&
          country != ''
        ) {
          dispatch({
            type: 'UPDATE_COORDS',
            payload: {
              lat: lat,
              lng: lng,
              city: city,
              state: state,
              address: address,
              mulk: country,
            },
          });
        }
      })
      .catch(err => console.log('geocode err', err));
  };

  const handleLocationCoords = async result => {
    if (result == 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          if (lat != undefined && lng != undefined) {
            getAddress(lat, lng);
          } else {
            Alerts('error', 'Could not get latitude and longitude.');
          }
          setLat(lat);
          setLng(lng);
        },
        err => {
          if (err.code == 1) {
            Alerts('error', 'Location permission is not granted');
          } else if (err.code == 2) {
            Alerts('error', 'Location provider is not available');
          } else if (err.code == 4) {
            Alerts(
              'error',
              'Google play service is not installed or has an older version',
            );
          } else {
            Alerts('error', err?.message);
          }
        },
        {
          accuracy: {
            ios: 'best',
            android: 'high',
          },
          enableHighAccuracy: false,
          distanceFilter: 0,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    }
  };

  const handleLocation = async () => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        'location',
        res => {
          handleLocationCoords(res);
        },
      );
    } else if (android) {
      if (OS_VER <= 10) {
        handlePermissions.checkAndroidPermissions(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          'location',
          res => {
            if (res === 'granted') {
              handleLocationCoords('granted');
            }
          },
        );
      } else {
        handlePermissions.checkAndroidPermissions(
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          'location',
          res => {
            if (res === 'granted') {
              handleLocationCoords('granted');
            }
          },
        );
      }
    }
  };

  const updateUser = async (formData, token) => {
    console.log('FORMDATA in hook', formData);
    await ProfileServices.updateProfile(formData, token)
      .then(async res => {
        handleStatusCode(res);

        console.log('RES RELIGION', res);
        if (res.data.status >= 200 && res.data.status <= 299) {
          await dispatch({
            type: 'AUTH_USER',
            payload: res?.data?.data?.user,
          });
          alerts('success', res.data.message);
        }
      })
      .catch(err => console.log('err', err))
      .finally(() => {});
  };
  const updateUserPreference = async (token, type, value, type2) => {
    console.log('TYPEEE', type);
    console.log('SendValue', value);

    let body = {
      distance: userData?.UserPreference?.distance
        ? userData?.UserPreference?.distance
        : 'unlimited',
      ageFrom: userData?.UserPreference?.ageFrom,
      ageTo: userData?.UserPreference?.ageTo,
      religion: userData?.UserPreference?.religion,
      familyOrigin: userData?.UserPreference?.familyOrigin,
      heightFrom: userData?.UserPreference?.heightFrom,
      heightTo: userData?.UserPreference?.heightTo,
      community: userData?.UserPreference?.community,
      languagesSpoken: userData?.UserPreference?.languagesSpoken,
      religiousDenomination: userData?.UserPreference?.religiousDenomination,
      theyPray: userData?.UserPreference?.theyPray,
      drinking: userData?.UserPreference?.drinking,
      smoking: userData?.UserPreference?.smoking,
      dietChoices: userData?.UserPreference?.dietChoices,
      maritalHistory: userData?.UserPreference?.maritalHistory,
      haveKids: userData?.UserPreference?.haveKids,
      wantKids: userData?.UserPreference?.wantKids,
      willingToRelocate: userData?.UserPreference?.willingToRelocate,
    };
    console.log('TYPE OF TYOE', type, typeof type);
    if (
      (type === 'heightFrom' || type === 'ageFrom') &&
      (type2 === 'heightTo' || type2 === 'ageTo')
    ) {
      console.log('HELLO', type, type2, value);
      body = {
        ...body,
        [type]: value[0],
        [type2]: value[1],
      };
    } else {
      body = {
        ...body,
        [type]: value,
      };
    }

    console.log('BODY123', body);

    await UserService.searchUserPreference(body, token)
      .then(async res => {
        handleStatusCode(res);
        console.log('res', res.data);
        if (res.data.status >= 200 && res.data.status <= 299) {
          alerts('success', res.data.message);

          dispatch({
            type: 'SET_PREFERENCE_FILTER',
            payload: true,
          });
        }
      })
      .catch(err => {
        console.log('err', err);
        // alerts('error', 'value not updated.Try again');
      });
  };

  return {
    Alerts,
    navigation,
    handlePlayerId,
    dispatchAndNavigate,
    handleLocation,
    updateLocation,
    handleDisablePremium,
    handleStatusCode,
    updateUser,
    updateUserPreference,
    lat,
    lng,
    city,
    state,
    address,
    mulk,
    setOffset,
    keyboardOffset,
    setKeyboardOffset,
  };
};
