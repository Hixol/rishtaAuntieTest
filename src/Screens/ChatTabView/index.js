import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { ios } from "../../utility/size";

import colors from "../../utility/colors";
import ChatScreen from "../ChatScreen";
import UserDetailScreen from "../userDetailScreen";
import ChatInsight from "../ChatInsight";

const Tab = createMaterialTopTabNavigator();

const ChatTabView = props => {
  const insets = useSafeAreaInsets();
  const chatType = props.route.params?.el?.type;
  const { userData, swipeScreenIndex } = useSelector(store => store.userReducer);
  const proMember = userData?.UserSetting?.isSubscribed;

  return (
    <Tab.Navigator
      initialRouteName="ChatScreen"
      backBehavior="none"
      screenOptions={{
        swipeEnabled: chatType == "GROUP" ? false : true,
        tabBarStyle: {
          marginTop: ios ? insets.top : 0,
          display: chatType == "GROUP" ? "none" : "flex",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: "Inter-Medium",
          textTransform: "capitalize",
        },
        tabBarActiveTintColor: proMember ? colors.gold : colors.blackBlue,
        tabBarInactiveTintColor: colors.vibeLightGrey,
        tabBarIndicatorStyle: {
          height: 5,
          borderRadius: 6,
          backgroundColor: proMember ? colors.gold : colors.primaryPink,
        },
      }}
    >
      <Tab.Screen
        name="ChatScreen"
        children={() => <ChatScreen props={props} />}
        options={{ tabBarLabel: "Chat", swipeEnabled: swipeScreenIndex }}
      />
      <Tab.Screen
        name="UserDetail"
        children={() => <UserDetailScreen props={props} />}
        options={{ tabBarLabel: "Profile", swipeEnabled: swipeScreenIndex }}
      />
      <Tab.Screen
        name="ChatInsight"
        children={() => <ChatInsight props={props} />}
        options={{ tabBarLabel: "Insights", swipeEnabled: swipeScreenIndex }}
      />
    </Tab.Navigator>
  );
};

export default ChatTabView;
