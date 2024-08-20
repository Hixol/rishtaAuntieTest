import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Platform,
} from "react-native";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/SocketContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useHelper } from "../../hooks/useHelper";
import ChatListItem from "../../components/containers/ChatListItem";
import ChatServices from "../../services/ChatServices";
import Loader from "../../components/Loader";
import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";
import styles from "../userChatList/styles";

const Tab = createMaterialTopTabNavigator();

const UserChatList = props => {
  const userId = props.route.params?.userId;
  const chatHeadId = props.route.params?.chatHeadId;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const socket = useContext(SocketContext);
  const { handleStatusCode } = useHelper();
  const { token, userData } = useSelector(store => store.userReducer);

  const proMember = userData?.UserSetting?.isSubscribed;

  const [chatHead, setChatHead] = useState([]);
  const [loading, setLoading] = useState(true);
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
            data.forEach(el => {
              ids.push(el.ChatMembers[0]?.memberId);

              if (
                userId !== undefined &&
                el.ChatMembers[0].memberId === userId
              ) {
                props.navigation.navigate("ChatTabView", {
                  el,
                  moves: true,
                });
              } else if (chatHeadId !== undefined && el.id === chatHeadId) {
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
      if (res.status === "SEND") {
        setUnreadCount(res);
      }
    });
  }, []);

  const nonGroupChats = chatHead.filter(el => el.type !== "GROUP");

  const DefaultMessages = () => (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.centerContainer}>
          <View style={styles.demoChatContainer}>
            <Image
              source={require("../../assets/iconimages/settinglogo1.png")}
              style={styles.logo}
            />
            <Text style={styles.messageBox}>
              You have no active matches right now 🙁
            </Text>
          </View>
          <Text style={styles.defaultMessage}>But don’t worry</Text>
          <Text style={styles.defaultMessage}>
            Try editing your profile with some interesting prompts and some of
            your best photos
          </Text>
          <Text style={styles.defaultMessage}>
            Then when you’re ready, discover new profiles!
          </Text>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type message..."
            placeholderTextColor="#ABABAB"
          />
          <TouchableOpacity>
            <Image
              source={require("../../assets/iconimages/Send1.png")}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate("Discover")}
        >
          <Text style={styles.buttonText}>Go to Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button1}
          onPress={() => props.navigation.navigate("EditProfileScreen")}
        >
          <Text style={styles.buttonText2}>Edit My Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            paddingVertical: "2%",
            paddingHorizontal: "3%",
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {nonGroupChats.length === 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("HomeOne")}
            >
              <Image
                source={require("../../assets/iconimages/back-arrow.png")}
                style={styles.backIcon}
              />
            </TouchableOpacity>
          )}
          <FastImage
            resizeMode="contain"
            style={{ width: 40, height: 50 }}
            source={
              proMember
                ? require("../../assets/iconimages/logo-gold.png")
                : require("../../assets/iconimages/header-icon.png")
            }
          />
        </View>
      </View>
      {loading ? (
        <Loader />
      ) : nonGroupChats.length === 0 ? (
        <DefaultMessages />
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ borderRadius: 16, overflow: "hidden" }}>
              {nonGroupChats.map(el => (
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
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
};

export default UserChatList;
