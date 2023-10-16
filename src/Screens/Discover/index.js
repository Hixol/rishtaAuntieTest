import React, {useState, useEffect, memo} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useSelector} from 'react-redux';

import HomeOne from '../HomeOne';
import DetailScreen from '../Details';

const Tab = createMaterialTopTabNavigator();

const Discover = props => {
  const [userId, setUserID] = useState();
  const [userDetails, setUserDetails] = useState();
  const {swipeScreenIndex} = useSelector(store => store.userReducer);

  useEffect(() => {
    setUserID(props?.route?.params?.userId);
    setUserDetails(props?.route?.params?.userDetails);
  }, []);

  return (
    <Tab.Navigator tabBar={() => null}>
      <Tab.Screen
        name="HomeOne"
        children={() => (
          <HomeOne {...props} userId={userId} userDetails={userDetails} />
        )}
        options={{
          swipeEnabled: swipeScreenIndex,
        }}
      />
      <Tab.Screen
        name="Details"
        children={() => (
          <DetailScreen {...props} userId={userId} userDetails={userDetails} />
        )}
        options={{
          swipeEnabled: swipeScreenIndex,
        }}
      />
    </Tab.Navigator>
  );
};
export default memo(Discover);
