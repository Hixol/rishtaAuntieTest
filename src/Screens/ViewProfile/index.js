import React, {useEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {BackHandler} from 'react-native';
import {useSelector} from 'react-redux';

import MyProfile from '../MyProfile';
import MyProfileDetails from '../MyProfileDetails';

const Tab = createMaterialTopTabNavigator();

const ViewProfile = props => {
  const {swipeIndex} = useSelector(store => store.userReducer);

  const handleBackButton = () => {
    props.navigation.goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{
        swipeEnabled: swipeIndex,
      }}>
      <Tab.Screen name="MyProfile" component={MyProfile} />
      <Tab.Screen name="MyProfileDetails" component={MyProfileDetails} />
    </Tab.Navigator>
  );
};

export default ViewProfile;
