import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView, Text } from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/SocketContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useHelper } from "../../hooks/useHelper";
import { ios } from "../../utility/size";

import ChatListItem from "../../components/containers/ChatListItem";
import ChatServices from "../../services/ChatServices";
import Loader from "../../components/Loader";
import CallLog from "../CallLog";
import colors from "../../utility/colors";
import styles from "./styles";

const Tab = createMaterialTopTabNavigator();

const UserChatList = props => {
  const userId = props.route.params?.userId;
  const chatHeadId = props.route.params?.chatHeadId;

  const insets = useSafeAreaInsets();
  const socket = useContext(SocketContext);
  const { handleStatusCode } = useHelper();
  const { token, userData } = useSelector(store => store.userReducer);

  const proMember = userData?.UserSetting?.isSubscribed;

  const [chatHead, setChatHead] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(null);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      setOnlineUsers([]);
      setUnreadCount(null);
      setLoading(true);
      ChatServices.chatHead(token)
        .then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            let data = res.data.data;
            let ids = [];
            data.map(el => {
              ids.push(el.ChatMembers[0]?.memberId);

              if (userId != undefined && el.ChatMembers[0].memberId == userId) {
                props.navigation.navigate("ChatTabView", {
                  el,
                  moves: true,
                });
              } else if (chatHeadId != undefined && el.id == chatHeadId) {
                props.navigation.navigate("ChatTabView", {
                  el,
                  moves: true,
                });
              }
            });

            if (socket.connect) {
              socket.emit("is-online", {
                recipientId: ids,
              });
            }
            setChatHead(data);
          }
        })
        .catch(err => console.log("ChatHead Err: ", err))
        .finally(() => setLoading(false));
    }, [isFocused, chatHeadId])
  );

  useEffect(() => {
    socket.on("is-online", res => {
      setOnlineUsers(res);
    });

    socket.on("message-receive", res => {
      if (res.status == "SEND") {
        setUnreadCount(res);
      }
    });
  }, []);

  const ChatList = () => (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <Loader />
      ) : chatHead.length == 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.txt}>No recent chat</Text>
        </View>
      ) : (
        <ScrollView>
          <View style={{ borderRadius: 16, overflow: "hidden" }}>
            {chatHead.length > 0 &&
              chatHead.map(el => {
                if (el.type != "GROUP")
                  return (
                    <ChatListItem
                      onPress={() =>
                        props.navigation.navigate("ChatTabView", {
                          el,
                          moves: true,
                        })
                      }
                      key={el.id}
                      item={el}
                      status={onlineUsers}
                      unread={unreadCount}
                    />
                  );
              })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );

  return (
    <Tab.Navigator
      backBehavior="none"
      screenOptions={{
        tabBarStyle: {
          marginTop: ios ? insets.top : 0,
        },
        tabBarActiveTintColor: proMember ? colors.gold : colors.primaryPink,
        tabBarInactiveTintColor: "grey",
        tabBarIndicatorStyle: {
          height: 3,
          backgroundColor: proMember ? colors.gold : colors.primaryPink,
        },
      }}
    >
      <Tab.Screen name="Chats" component={ChatList} />
      <Tab.Screen
        name="CallLog"
        component={CallLog}
        options={{ tabBarLabel: "Calls" }}
      />
    </Tab.Navigator>
  );
};
export default UserChatList;
