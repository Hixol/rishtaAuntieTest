import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {windowHeight} from '../../utility/size';
import {useHelper} from '../../hooks/useHelper';

import MultiSelect from '../../components/MultiSelect/MultiSelect';
import colors from '../../utility/colors';
import styles from './style';
import UserService from '../../services/UserService';
import HeaderContainer from '../../components/containers/headerContainer';
import Button from '../../components/buttons/Button';
import ProfileServices from '../../services/ProfileServices';
import Icons from '../../utility/icons';

const MyVibes = props => {
  const {userVibes} = props?.route?.params;

  const dispatch = useDispatch();
  const {Alerts, handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems([]);
    setLoading(true);
    UserService.getVibes()
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let data = res.data.data;
          setVibes(
            data.sort((a, b) => {
              if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
              if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              return 0;
            }),
          );
          if (userVibes) {
            setSelectedItems(
              data.filter(vibe => userVibes.some(el => el.trim() == vibe.name)),
            );
          }
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const arraysEqual = (a, b) => {
    for (var i = 0; i < b.length; ++i) {
      if (b[i].name !== a[i]) return false;
    }
    return true;
  };

  const onSave = () => {
    if (userVibes.length == selectedItems.length) {
      if (arraysEqual(userVibes, selectedItems)) {
        Alerts('error', 'Please select new vibes.');
      }
    } else {
      setLoading(true);
      let formData = new FormData();
      selectedItems.map(x => {
        formData.append('vibes[]', x.name);
      });

      ProfileServices.updateProfile(formData, token)
        .then(res => {
          handleStatusCode(res);
          if (res.data.status >= 200 && res.data.status <= 299) {
            dispatch({
              type: 'AUTH_USER',
              payload: res.data.data.user,
            });
            Alerts('success', res.data.message);
            props.navigation.navigate('ViewEditProfile', {
              screen: 'EditProfile',
            });
          }
        })
        .catch(err => console.log('err', err))
        .finally(() => setLoading(false));
    }
  };

  props.navigation.setOptions({
    headerLeft: () => (
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Icons.FontAwesome
          name="long-arrow-left"
          color={colors.primaryBlue}
          size={22}
        />
      </TouchableOpacity>
    ),
  });

  const handleOnSelect = items => {
    setSelectedItems(items);
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator
          color={colors.primaryPink}
          style={{alignSelf: 'center', flex: 1}}
          size={'large'}
        />
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <HeaderContainer
            goback={'arrow-back'}
            backButton
            Icon
            name={'setting'}
            gobackButtonPress={() =>
              props.navigation.navigate('ViewEditProfile', {
                screen: 'EditProfile',
              })
            }
          />
          <ScrollView>
            <View style={styles.container}>
              <Text style={[styles.vibesHeading, {fontSize: 24}]}>
                What are your vibes?
              </Text>
              <Text style={[styles.vibesHeading, {fontSize: 16}]}>
                Select the personality traits that express you
              </Text>
              <Text style={[styles.vibesHeading, {fontSize: 40}]}>
                {selectedItems.length}/10
              </Text>
              <View style={styles.vibesSection}>
                <MultiSelect
                  vibes
                  handleOnSelect={handleOnSelect}
                  arrayData={vibes}
                  selectedItems={selectedItems}
                  height={windowHeight * 0.055}
                  paddingHorizontal={'4%'}
                  marginHorizontal={'1%'}
                  justifyContent={'flex-start'}
                  backGroundColor={colors.white}
                />
                <Button
                  onPress={onSave}
                  YesNoBtn
                  title="Save"
                  YesNoBtnStyle={{marginVertical: '10%'}}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default MyVibes;
