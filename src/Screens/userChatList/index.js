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
import MyInsight from "../MyInsight";
import HeaderContainer from "../../components/containers/headerContainer";
import { container } from "aws-amplify";

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
      <View
        style={{
          // top: 45,
          flex: 0.1,
        }}
      >
        <HeaderContainer Icon />
      </View>
      {loading ? (
        <Loader />
      ) : nonGroupChats.length === 0 ? (
        <DefaultMessages />
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ top: "5%", borderRadius: 16, overflow: "hidden" }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    // padding: 10, // Use padding instead of margin
    // flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 16,
    top: 20,
  },
  demoChatContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginRight: 10,
  },
  messageBox: {
    fontSize: 16,
    color: colors.black,
    backgroundColor: "#ffff",
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 8,
    textAlign: "left",
    padding: 7,
    width: "80%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  defaultMessage: {
    fontSize: 16,
    color: colors.black,
    backgroundColor: "#ffff",
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 8,
    textAlign: "left",
    padding: 9,
    width: "80%",
    marginLeft: 45,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonContainer: {
    width: "100%",
    top: "40%",
    justifyContent: "flex-end",
    // marginTop: 20,
    flexDirection: "column",
  },
  centerContainer: {
    flex: 1, // This will allow the container to take up the full height of the screen
    justifyContent: "space-between", // Space out the content, pushing the buttons to the bottom
    padding: 16,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center", // Center the buttons horizontally
    alignItems: "center",
    marginBottom: 20, // Add some space at the bottom of the screen
  },
  buttonContainer2: {
    width: "100%",
    justifyContent: "center", // Center the buttons horizontally
    alignItems: "center",
  },
  button: {
    backgroundColor: "#D90368",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "80%",
    marginBottom: 10, // Add space between buttons
  },
  button1: {
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EBECEF",
    borderRadius: 10,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
  },
  buttonText2: {
    color: "#D90368",
    fontSize: 16,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 10,
    // alignContent: "space-between",
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "#ABABAB",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.black,
  },
  sendIcon: {
    height: 45,
    width: 45,
    // tintColor: "#D90368", // Optional: Add tint color to the icon
    // marginLeft: 60, // Add margin to separate from the input
    left: 60,
  },
});

export default UserChatList;
