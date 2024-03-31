import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ios, windowHeight } from "../utility/size";
import { useSelector } from "react-redux";

import Settings from "../Screens/Settings";
import Discover from "../Screens/Discover";
import colors from "../utility/colors";
import UserChatList from "../Screens/userChatList";
import Blog from "../Screens/Blog";
import Interactions from "../Screens/Interactions";
import MyVibes from "../Screens/myVibes";
import ProfilePrompts from "../Screens/ProfilePrompts";
import FastImage from "react-native-fast-image";
import ChatTabView from "../Screens/ChatTabView";
import ViewProfile from "../Screens/ViewProfile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SettingsStack = props => {
  const { userData } = useSelector(store => store.userReducer);
  const proMember = userData?.UserSetting?.isSubscribed;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitle: () => (
          <View style={styles.header}>
            <View
              style={{
                width: "100%",
                height: 30,
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              <FastImage
                resizeMode="contain"
                style={{ width: 40, height: "100%" }}
                source={
                  proMember
                    ? require("../assets/iconimages/logo-gold.png")
                    : require("../assets/iconimages/header-icon.png")
                }
              />
            </View>
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="ViewSettings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewProfile"
        component={ViewProfile}
        options={{
          headerTintColor: colors.blackBlue,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="MyVibes"
        component={MyVibes}
        options={{
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="ProfilePrompts"
        component={ProfilePrompts}
        options={{
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const UserChatListStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserChatListScreen" component={UserChatList} />
      <Stack.Screen name="ChatTabView" component={ChatTabView} />
    </Stack.Navigator>
  );
};

const Tabs = props => {
  const CustomTabButton = props => (
    <TouchableOpacity
      {...props}
      style={
        props.accessibilityState.selected
          ? [
              props.style,
              {
                borderTopColor: colors.primaryPink,
                borderTopWidth: 5,
              },
            ]
          : props.style
      }
    />
  );

  return (
    <Tab.Navigator
      detachInactiveScreens={false}
      backBehavior="none"
      screenOptions={{
        tabBarStyle: {
          alignItems: "center",
          justifyContent: "center",
          height: ios ? windowHeight * 0.08 : windowHeight * 0.06,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarButton: CustomTabButton,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconView}>
              <FastImage
                resizeMode="contain"
                style={styles.icon}
                source={
                  focused
                    ? require("../assets/iconimages/discover-active.png")
                    : require("../assets/iconimages/discover.png")
                }
              />
            </View>
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: e => navigation.navigate("HomeOne"),
        })}
      />
      <Tab.Screen
        name="Blog"
        component={Blog}
        options={{
          tabBarButton: CustomTabButton,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconView}>
              <FastImage
                resizeMode="contain"
                style={styles.icon}
                source={
                  focused
                    ? require("../assets/iconimages/blog-active.png")
                    : require("../assets/iconimages/blog.png")
                }
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Interactions"
        component={Interactions}
        options={{
          tabBarButton: CustomTabButton,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconView}>
              <FastImage
                resizeMode="contain"
                style={styles.icon}
                source={
                  focused
                    ? require("../assets/iconimages/interaction-active.png")
                    : require("../assets/iconimages/interaction.png")
                }
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="UserChatList"
        component={UserChatListStack}
        options={{
          tabBarButton: CustomTabButton,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconView}>
              <FastImage
                resizeMode="contain"
                style={styles.icon}
                source={
                  focused
                    ? require("../assets/iconimages/chat-active.png")
                    : require("../assets/iconimages/chat.png")
                }
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        children={() => <SettingsStack {...props} />}
        options={{
          tabBarButton: CustomTabButton,
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.iconView}>
              <FastImage
                resizeMode="contain"
                style={styles.icon}
                source={
                  focused
                    ? require("../assets/iconimages/settings-active.png")
                    : require("../assets/iconimages/settings.png")
                }
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Tabs;

const styles = StyleSheet.create({
  iconView: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  icon: { width: "80%", height: "80%" },
});
