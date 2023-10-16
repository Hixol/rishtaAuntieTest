import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {OnBoardingServices, UserService} from '../../services';
import {useHelper} from '../../hooks/useHelper';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import styles from './styles';
import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import ProfileServices from '../../services/ProfileServices';
import HeaderContainer from '../../components/containers/headerContainer';
import PrivacySettingContainer from '../../components/containers/PrivacySettingContainer';
import BasicPrivacySetting from '../../components/containers/BasicPrivacySetting';
import Button from '../../components/buttons/Button';
import SettingHeader from '../../components/containers/settingHeader';
import {alerts} from '../../utility/regex';

const SearchPreferences = props => {
  const isFocused = useIsFocused();
  const value = props?.route?.params?.preferences;
  const {token, userData} = useSelector(store => store.userReducer);
  const dispatch = useDispatch();
  const {handleDisablePremium, handleStatusCode, Alerts} = useHelper();

  const [user, setUser] = useState();

  const [premiumPrivacySetting, setPremiumPrivacySetting] = useState(
    userData?.UserSetting?.isSubscribed,
  );

  const BasicPreferences = [
    {
      id: 1,
      preferenceName: 'Distance',
      type: 'Distance',
      value: value?.distance,
      editType: 'Distance',
      ask: 'Please select distance',
    },
    {
      id: 2,
      preferenceName: 'Age',
      type: 'Age',
      value: [value?.ageFrom, value?.ageTo],
      editType: 'Age',
      ask: 'Please select age',
    },
    {
      id: 3,
      preferenceName: 'Religion',
      type: 'Religion',
      value: value?.religion,
      editType: 'Religion',
      screenName: 'ReligionScreen',
      screen: true,
      ask: 'Please select religion',
    },
    {
      id: 4,
      preferenceName: 'Family Origin',
      type: 'Origin',
      value: value?.familyOrigin,
      editType: 'Family Origin',
      ask: 'Please select family origin',
    },
  ];

  const PremiumPreferences = [
    {
      id: 1,
      preferenceName: 'Height',
      type: 'Height',
      value: [value?.heightFrom, value?.heightTo],
      editType: 'Height',
      ask: 'Please select height',
    },
    {
      id: 2,
      preferenceName: 'Community',
      type: 'Community',
      value: value?.community,
      editType: 'Community',
      ask: 'Please select community',
    },
    {
      id: 3,
      preferenceName: 'Languages',
      type: 'Languages',
      value: value?.languagesSpoken,
      editType: 'Languages',
      ask: 'Please select languages',
    },
    {
      id: 4,
      preferenceName: 'Religious Denomination',
      type: 'Religious',
      value: value?.religiousDenomination,
      editType: 'Denomination',
      ask: 'Please select denomination',
    },
    {
      id: 5,
      preferenceName: 'Do they pray?',
      type: 'Pray',
      value: value?.theyPray,
      editType: 'Pray',
      ask: 'How often do they pray?',
    },
    {
      id: 6,
      preferenceName: 'Do they drink?',
      type: 'Drink',
      value: value?.drinking,
      editType: 'Drink',
      ask: 'How often do they drink?',
    },
    {
      id: 7,
      preferenceName: 'Do they smoke?',
      type: 'Smoke',
      value: value?.smoking,
      editType: 'Smoke',
      ask: 'How often do they smoke?',
    },
    {
      id: 8,
      preferenceName: 'What are their diet choices?',
      type: 'Diet',
      value: value?.dietChoices,
      editType: 'Diet',
      ask: 'What are their diet choices?',
    },
    {
      id: 9,
      preferenceName: 'Marital history',
      type: 'Marital',
      value: value?.maritalHistory,
      editType: 'Marital History',
      ask: 'What is their marital history?',
    },
    {
      id: 10,
      preferenceName: 'Do they have kids?',
      type: 'HaveKids',
      value: value?.hasKids,
      editType: 'Have Kids',
      ask: 'Do they have kids?',
    },
    {
      id: 11,
      preferenceName: 'Do they want kids?',
      type: 'WantKids',
      value: value?.wantKids,
      editType: 'Want Kids',
      ask: 'Do they want kids?',
    },
    {
      id: 12,
      preferenceName: 'Are they willing to relocate?',
      type: 'Relocate',
      value: value?.willingToRelocate,
      editType: 'Relocate',
      ask: 'Are they willing to relocate?',
    },
  ];

  const resetFeature = () => {
    UserService.applyReset(token)
      .then(res => {
        console.log('applyReset res:', res);
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
        }
      })
      .catch(err => console.log('applyReset err:', err));
  };

  const handleBackButton = () => {
    props.navigation.goBack();

    return true;
  };

  const handleUpgrade = () => {
    if (!premiumPrivacySetting) {
      props.navigation.navigate('Paywall');
    }
  };
  useEffect(() => {
    OnBoardingServices.profileValues(
      encodeURI(
        JSON.stringify([
          'college',
          'community',
          'denomination',
          'familyOrigin',
          'language',
          'occupation',
        ]),
      ),
    )
      .then(async res => {
        console.log('PROFILE VALUES', res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: 'allProfileValues',
            payload: res?.data?.data,
          });
        }
      })
      .catch(err => console.log('err', err))
      .finally(() => {});
  }, []);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      if (token != null) {
        setPremiumPrivacySetting(userData?.UserSetting?.isSubscribed);
        ProfileServices.getMyProfile(token).then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            let data = res?.data?.data;
            console.log('userData 1', res);

            dispatch({
              type: 'AUTH_USER',
              payload: data,
            });
          }
        });
      } else {
        alerts('error', 'Your token has expired. Please login again.');
      }
    }, [isFocused]),
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white, padding: 20}}>
      <SettingHeader
        backPress={() => props.navigation.goBack()}
        screenTitle={'Search preferences'}
      />
      {/* 
      <TouchableOpacity onPress={resetFeature}>
        <Text style={[styles.basicPreferenceType, {marginBottom: '5%'}]}>
          Reset
        </Text>
      </TouchableOpacity> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.basicPreferenceType}>Basic Preferences</Text>
        <View style={styles.actionItemsView}>
          <View style={{marginVertical: '2%'}}>
            {BasicPreferences.map((i, index, array) => {
              return (
                <View>
                  <BasicPrivacySetting
                    arrowIcononPress={() =>
                      i?.screen
                        ? props.navigation.navigate(i?.screenName, {
                            preferenceEdit: true,
                            index: i?.index,
                            type: i?.type,
                          })
                        : props.navigation.navigate('EditScreenSetting', {
                            preferenceEdit: true,
                            index: i?.index,
                            type: i?.editType,
                            ask: i?.ask,
                            // ask: i?.ask,
                            // line: i?.line,
                          })
                    }
                    arrowIcon
                    contStyle={styles.privacySettingStyle}
                    toggleOptionTextStyle={{
                      color: '#374151',
                      fontSize: 14,
                      FontFamily: 'Inter-Medium',
                    }}
                    toggleOptionText={i.preferenceName}
                    toggleViewStyle={{paddingBottom: '2%'}}
                  />
                  {index === array?.length - 1 ? null : (
                    <View style={styles.horizontalLine}></View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
        <Text style={[styles.basicPreferenceType]}>Gold Preferences</Text>
        {premiumPrivacySetting == false ? (
          <TouchableOpacity
            onPress={handleUpgrade}
            style={styles.enableDisableButton}>
            <Text style={{fontSize: 15, color: colors.white}}>
              Upgrade now to use Gold preferences
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleDisablePremium}
            style={styles.enableDisableButton}>
            <Text style={{fontSize: 15, color: colors.white}}>
              Disable Premium
            </Text>
          </TouchableOpacity>
        )}
        <View style={[styles.actionItemsView, {marginBottom: '10%'}]}>
          {PremiumPreferences.map((i, index, array) => {
            return (
              <View>
                <PrivacySettingContainer
                  imageRequire={
                    premiumPrivacySetting
                      ? require('../../assets/iconimages/settingarrow.png')
                      : require('../../assets/iconimages/settingarrow.png')
                  }
                  arrowIcononPress={
                    () =>
                      props.navigation.navigate('EditScreenSetting', {
                        preferenceEdit: true,
                        index: i?.index,
                        type: i?.editType,
                        ask: i?.ask,
                        // ask: i?.ask,
                        // line: i?.line,
                      })

                    // props.navigation.navigate('MySearchPreferencesEditScreen', {
                    //   paramKey: i.type,
                    //   paramKey2: i.preferenceName,
                    //   preferences: user.UserPreference,
                    //   value: user?.UserPreference,
                    // })
                  }
                  disabled={premiumPrivacySetting ? false : true}
                  isEnabled={premiumPrivacySetting ? true : false}
                  arrowIcon
                  toggleOptionTextStyle={{
                    color: premiumPrivacySetting
                      ? '#374151'
                      : colors.PremiumGrey,
                    fontSize: 14,
                    FontFamily: 'Inter-Medium',
                  }}
                  toggleOptionText={i.preferenceName}
                  toggleViewStyle={{paddingBottom: '2%'}}
                />
                {index === array?.length - 1 ? null : (
                  <View style={styles.horizontalLine}></View>
                )}
              </View>
            );
          })}
        </View>
        {/* <View style={{marginBottom: '20%'}}>
          <Button YesNoBtn title={'Save'} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Roboto-Medium',
              color: colors.primaryPink,
              alignSelf: 'center',
              marginVertical: '3%',
            }}>
            Need help?
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchPreferences;
