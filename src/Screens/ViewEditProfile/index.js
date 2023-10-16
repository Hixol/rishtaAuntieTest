import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';

import ViewProfile from '../ViewProfile';
import EditProfile from '../EditProfile';
import colors from '../../utility/colors';
import Icons from '../../utility/icons';

const Tab = createMaterialTopTabNavigator();

const ViewEditProfile = props => {
  const {userData} = useSelector(store => store.userReducer);
  const proMember = userData?.UserSetting?.isSubscribed;

  useEffect(() => {
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
  }, [props]);

  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: false,
        tabBarActiveTintColor: proMember ? colors.gold : colors.primaryPink,
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontFamily: 'Roboto-Bold',
          fontSize: 14,
        },
        tabBarIndicatorStyle: {
          height: 3,
          backgroundColor: proMember ? colors.gold : colors.primaryPink,
        },
      }}>
      <Tab.Screen
        name="ViewProfile"
        component={ViewProfile}
        options={{tabBarLabel: 'View'}}
      />
      <Tab.Screen
        name="EditProfile"
        component={EditProfile}
        options={{tabBarLabel: 'Edit'}}
      />
    </Tab.Navigator>
  );
};
export default ViewEditProfile;
