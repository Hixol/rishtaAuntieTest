import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import { android, ios, OS_VER } from "../../utility/size";
import {
  checkExtension,
  checkInteractionStatement,
  directory,
  getTypeForApi,
  handlePermissions,
} from "../../utility/regex";
import { PERMISSIONS } from "react-native-permissions";
import { launchCamera } from "react-native-image-picker";
import { UserService } from "../../services";
import { useSelector } from "react-redux";
import { useRecorder } from "../../hooks/useRecorder";
import { useHelper } from "../../hooks/useHelper";
import { Divider } from "react-native-elements";
import { SocketContext } from "../../context/SocketContext";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { useFocusEffect } from "@react-navigation/native";

import ImagePicker from "react-native-image-crop-picker";
import styles from "./styles";
import colors from "../../utility/colors";
import ChatHeaderContainer from "../../components/containers/chatHeaderContainer";
import FastImage from "react-native-fast-image";
import Message from "../../components/Message";
import config from "../../config/appConfig";
import ActionCard from "../../components/Cards/ActionCard";
import ChatServices from "../../services/ChatServices";
import Loader from "../../components/Loader";
import Button from "../../components/buttons/Button";
import Icons from "../../utility/icons";
import Video from "react-native-video";
import ActionBottomModal from "../../components/Modal/ActionBottomModal";
import WaveForm from "react-native-audiowaveform";

let limit = 50;
let offset = 0; // offset starts like an array index and 0 will points to first page.
let count = 0;

const ChatScreen = (props) => {
  const navProps = props.props;
  const { el } = navProps.route.params;

  const socket = useContext(SocketContext);
  const { Alerts, handleStatusCode } = useHelper();
  const { token, userData } = useSelector((store) => store.userReducer);

  const flatRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [action, setAction] = useState(false);
  const [userFirstImage, setUserFirstImage] = useState(null);
  const [mediaUri, setMediaUri] = useState(null);
  const [blockModal, setBlockModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockAlert, setBlockAlert] = useState(false);
  const [mediaModal, setMediaModal] = useState(false);
  const [reply, setReply] = useState(false);
  const [replyMsg, setReplyMsg] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState({});
  const [userStatus, setUserStatus] = useState(false);
  const [typingStatus, setTypingStatus] = useState(false);
  const [loader, setLoader] = useState(false);
  const [pause, setPause] = useState(false);
  const [msgRead, setMsgRead] = useState("");
  const [matchReq, setMatchReq] = useState(null);
  const [isTicketOpened, setIsTicketOpened] = useState(false);
  const {
    onStartRecord,
    onPauseRecord,
    onResumeRecord,
    onStopRecord,
    onSendAudio,
    recordTime,
    recordView,
    pauseView,
    audioUri,
    setAudioUri,
  } = useRecorder();

  const noMatchMessages = [
    { id: 1, msg: "You have no active matches right now 🙁" },
    { id: 2, msg: "But don’t worry!" },
    {
      id: 3,
      msg: "Try editing your profile with some interesting prompts and some of your best photos",
    },
    { id: 4, msg: "Then when you’re ready, discover new profiles!" },
  ];

  const captureMedia = () => {
    setMediaModal(true);
  };

  const handleSendAudio = async () => {
    let audioFile = await onSendAudio();
    chatSendMedia(audioFile);
  };

  const msgReadStatus = () => {
    let obj = {
      chatHeadId: el.id,
      senderId: userData?.id,
      recipientId:
        el.type === "GROUP"
          ? el.ChatMembers.map((el) => el.memberId)
          : el?.ChatMembers[0]?.memberId,
    };
    socket.emit("message-read", obj, (res) => {
      console.log("message-read emit: ", res);
    });
  };

  const onSendMsg = (val, msgType) => {
    let obj = {};
    if (reply) {
      obj = {
        chatHeadId: el.id,
        senderId: userData?.id,
        messageReplyId: replyMsg?.id,
        recipientId:
          el.type === "GROUP"
            ? el.ChatMembers.map((el) => el.memberId)
            : el.ChatMembers[0]?.memberId,
        message: msgType == "TEXT_MESSAGE" ? msg : val,
        type: msgType,
      };
      setReply(false);
      setReplyMsg(null);
    } else {
      obj = {
        chatHeadId: el.id,
        senderId: userData?.id,
        recipientId:
          el.type === "GROUP"
            ? el.ChatMembers.map((el) => el.memberId)
            : el.ChatMembers[0]?.memberId,
        message: msgType == "TEXT_MESSAGE" ? msg : val,
        type: msgType,
      };
    }

    socket.emit("message-send", obj, (res) => {
      console.log("message-send res", obj, res);
      if (res.event == "message-send") {
        setChatMessages((prevState) => ({
          ...prevState,
          rows: [
            ...prevState.rows,
            {
              id: res.chatRecord.id,
              chatHeadId: res.chatHeadId,
              senderId: userData?.id,
              message: res.message,
              messageReplyId: res.chatRecord.messageReplyId,
              status: res.chatRecord.status,
              type: res.type,
              createdAt: new Date(),
              MessageReactions: [],
            },
          ],
        }));
      }
    });
    setLoader(false);
    setTypingStatus(false);
    setAudioUri(null);
    setMsg("");
  };

  const onSend = (val, type) => {
    if (val.includes("https") && type != "TEXT_MESSAGE") {
      onSendMsg(val, type);
    } else if (val != "" && type == "TEXT_MESSAGE") {
      onSendMsg(val, type);
    }
  };

  const onPressSend = () => {
    if (el.type === "GROUP" && isTicketOpened == false) {
      createTicket(msg);
    }
    if (msg.includes("https")) {
      onSendMsg(msg, "LINK");
    } else if (msg) {
      onSend(msg, "TEXT_MESSAGE");
    } else if (audioUri) {
      handleSendAudio();
    } else {
      onStartRecord();
    }
  };

  const handleBackButton = () => {
    if (action) {
      setAction(false);
    } else if (selectedMsg) {
      setSelectedMsg(null);
    } else if (mediaModal) {
      setMediaModal(false);
    } else {
      navProps.navigation.goBack(null);
    }
    return true;
  };

  const getOpenendTicket = () => {
    ChatServices.getOpenendTicket(token)
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 201) {
          if (res.data.data == null) setIsTicketOpened(false);
          else setIsTicketOpened(true);
        }
      })
      .catch((err) => Alerts("error", err?.message));
  };

  const createTicket = (description) => {
    ChatServices.createTicket(
      {
        chatHeadId: el.id,
        description,
      },
      token
    )
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 201) {
          setIsTicketOpened(true);
          Alerts("success", res.data.message);
        }
      })
      .catch((err) => console.log("createTicket err:", err));
  };

  useEffect(() => {
    msgReadStatus();

    userData?.UserMedia.map((media) => {
      if (media.sequence == 1) setUserFirstImage(media.url);
    });

    if (el.type === "GROUP") getOpenendTicket();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [handleBackButton]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setPause(true);
      };
    }, [])
  );

  let clientTimer;

  useEffect(() => {
    socket.on("message-receive", (res) => {
      console.log("message-receive on", res);
      if (Object.keys(res).length > 0) {
        let obj = {
          chatHeadId: el.id,
          messageId: res.id,
          messageSenderId: res.senderId,
        };

        // socket.emit('message-delivered', obj, res => {
        //   if (res) {
        //     console.log('message-delivered emit: ', res);
        //   }
        // });

        // append new msg
        setChatMessages((prevState) => ({
          ...prevState,
          rows: [
            ...prevState.rows,
            {
              id: res.id,
              chatHeadId: res.chatHeadId,
              senderId: res.senderId,
              message: res.message,
              messageReplyId: res.messageReplyId,
              type: res.type,
              createdAt: res.createdAt,
              MessageReactions: [],
            },
          ],
        }));
      }
    });

    socket.on("is-online", (res) => {
      console.log("is-online on: ", res);
      setUserStatus(res.isOnline);
    });

    socket.on("go-online-or-offline", (res) => {
      if (res.isOnline) {
        getAllChatMessages(limit, offset);
      }
      setUserStatus(res.isOnline);
    });

    socket.on("message-typing", (res) => {
      clearTimeout(clientTimer);
      if (Object.keys(res).length > 0) {
        setTypingStatus(true);

        clientTimer = setTimeout(() => {
          setTypingStatus(false);
        }, 2000);
      }
    });

    // if (userStatus) {
    //   socket.on('message-read', res => {
    //     if (Object.keys(res).length > 0) {
    //       setMsgRead('SEEN');
    //     }
    //   });
    // } else {
    //   socket.on('message-delivered', res => {
    //     if (Object.keys(res).length > 0) {
    //       setMsgRead('DELIVERED');
    //     }
    //   });
    // }

    // socket.on('message-delivered', res => {
    //   if (Object.keys(res).length > 0) {
    //     console.log('message-delivered on: ', res);
    //     // setMsgRead('DELIVERED');
    //     AsyncStorage.setItem('MSG_READ', 'DELIVERED');
    //   }
    // });

    // socket.on('message-read', res => {
    //   console.log('message-read on: ', res);
    //   if (Object.keys(res).length > 0) {
    //     setMsgRead('SEEN');
    //   }
    // });

    socket.on("message-reaction", (res) => {
      if (Object.keys(res).length > 0) {
        if (userData?.id != el?.ChatMembers[0]?.memberId) {
          setChatMessages((prevState) => ({
            ...prevState,
            rows: [
              prevState.rows.map((el) =>
                el.id == res.messageId
                  ? { ...el, MessageReactions: [{ emoji: res.emoji }] }
                  : el
              ),
            ][0],
          }));
        }
      }
    });
  }, []);

  const emitUserStatus = () => {
    socket.emit("is-online", {
      recipientId:
        el.type === "GROUP"
          ? el.ChatMembers.map((el) => el.memberId)
          : el?.ChatMembers[0]?.memberId,
    });
  };

  const getAllChatMessages = (limit, offset) => {
    if (count !== chatMessages?.count) {
      setLoading(true);
      ChatServices.chatMessages(
        el.id,
        `limit=${limit}&offset=${offset * limit}`,
        token
      )
        .then((res) => {
          if (res.status >= 200 && res.status <= 299) {
            let data = res.data.data;
            count += data.rows.length;
            if (limit <= 50 && offset == 0) {
              setChatMessages(data);
            } else if (offset > 0) {
              setChatMessages((prevState) => ({
                ...prevState,
                rows: [...prevState.rows, ...data?.rows],
              }));
            }
          } else if (res.status >= 300 && res.status <= 399) {
            Alerts(
              "error",
              "You need to perform further actions to complete the request!"
            );
          } else if (res.status >= 400 && res.status <= 499) {
            if (el.type === "GROUP") {
              setMatchReq(false);
            } else if (res.data.error.message.includes("matchRequest")) {
              setMatchReq(true);
            } else {
              Alerts("error", res.data.error.message);
            }
          } else if (res.status >= 500 && res.status <= 599) {
            Alerts(
              "error",
              "Internal server error! Your server is probably down."
            );
          } else {
            Alerts("error", "Something went wrong Please try again later");
          }
        })
        .catch((err) => console.log("ChatMessages Err: ", err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    let obj = {
      recipientId: userData?.id,
      isOnline: true,
    };
    socket.emit("go-online-or-offline", obj, (res) => {
      console.log("go-online-or-offline emit: ", res);
    });

    emitUserStatus();

    if (android) {
      directory.checkPermission().then(() => {});

      directory
        .checkAudioPermission()
        .then((res) => {
          if (res) {
            directory
              .checkDirectory(config.audioPath)
              .then((res) => {
                if (res) {
                } else {
                  directory
                    .makeNewDirectory(config.audioPath)
                    .then((res) => {
                      if (res) {
                      }
                    })
                    .catch((err) => console.log("make Dir err: ", err));
                }
              })
              .catch((err) => console.log("check Dir err: ", err));
          }
        })
        .catch((err) => console.log("permission Err: ", err));
    }

    getAllChatMessages(limit, offset);

    return () => {
      limit = 50;
      offset = 0;
      count = 0;

      let obj = {
        recipientId: userData?.id,
        isOnline: false,
      };
      socket.emit("go-online-or-offline", obj, (res) => {
        console.log("go-online-or-offline emit: ", res);
      });
    };
  }, []);

  const handleGalleryMedia = async (state, result) => {
    try {
      if (result == "granted") {
        ImagePicker.openPicker({
          cropping: false,
          mediaType: "any",
          compressImageQuality: 0.99,
          forceJpg: true,
        })
          .then((el) => {
            let obj = {
              name: el.path.split("/")[el.path.split("/").length - 1],
              type: el.mime,
              uri: el.path,
            };
            chatSendMedia(obj);
          })
          .catch((err) => console.log("gallery picker err:", err))
          .finally(() => setMediaModal(state));
      }
    } catch (err) {
      console.log("gallery err", err);
    }
  };

  const handleGallery = (state) => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        "gallery",
        (res) => {
          handleGalleryMedia(state, res);
        }
      );
    } else if (android) {
      if (OS_VER >= 13) {
        handleGalleryMedia(state, "granted");
      } else {
        handlePermissions.checkMultiplePermissions(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          "gallery",
          (res) => {
            handleGalleryMedia(state, res);
          }
        );
      }
    }
  };

  const handleCameraMedia = async (state, result) => {
    try {
      if (result == "granted") {
        const options = {
          mediaType: "photo",
          quality: 0.4,
        };

        await launchCamera(options, (res) => {
          if (res.errorCode == "others") {
            Alerts(
              "error",
              res.errorMessage
                ? res.errorMessage
                : "Camera support is not available on your device."
            );
          } else if (res.didCancel === true) {
            setMediaModal(state);
          } else {
            setMediaModal(state);

            let obj = {
              name: res?.assets[0]?.fileName,
              type: res?.assets[0]?.type,
              uri: res?.assets[0]?.uri,
            };
            chatSendMedia(obj);
          }
        });
      }
    } catch (err) {
      console.log("camera err", err);
    }
  };

  const handleCamera = (state) => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.CAMERA,
        "camera",
        (res) => {
          handleCameraMedia(state, res);
        }
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        "camera",
        (res) => {
          handleCameraMedia(state, res);
        }
      );
    }
  };

  const handleVideoMedia = async (state, result) => {
    try {
      if (result === "granted") {
        const options = {
          mediaType: "video",
          videoQuality: "high",
        };

        await launchCamera(options, (res) => {
          if (res.errorCode == "others") {
            Alerts(
              "error",
              res.errorMessage
                ? res.errorMessage
                : "Camera support is not available on your device."
            );
          } else if (res.didCancel === true) {
            setMediaModal(state);
          } else {
            setMediaModal(state);

            let obj = {
              name: res?.assets[0]?.fileName,
              type: res?.assets[0]?.type,
              uri: res?.assets[0]?.uri,
            };

            chatSendMedia(obj);
          }
        });
      }
    } catch (err) {
      console.log("video err:", err);
    }
  };

  const handleVideo = (state) => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.CAMERA,
        "camera",
        (res) => {
          handleVideoMedia(state, res);
        }
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        "camera",
        (res) => {
          handleVideoMedia(state, res);
        }
      );
    }
  };

  const handleRemoveImage = (state) => {
    setMediaUri(null);
    setMediaModal(state);
  };

  const showOptions = () => {
    setAction(true);
  };

  const chatSendMedia = (obj) => {
    setLoader(true);
    let type = "";
    type = getTypeForApi(obj.type);

    let formData = new FormData();
    formData.append("mediaType", type);
    formData.append("media", obj);

    ChatServices.sendChatMedia(formData, token)
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setMediaUri(res.data.data);
          onSend(res.data.data, type);
        }
      })
      .catch((err) => {
        console.log("chatSendMedia err:", err);
        setLoader(false);
      })
      .finally(() => setLoader(false));
  };

  const handleReportAlert = () => {
    navProps.navigation.navigate("ReportAccountScreen", {
      userId: el?.ChatMembers[0]?.memberId,
      userName: el?.ChatMembers[0]?.User?.firstName,
    });
    setMediaModal(false);
    setReportModal(false);
  };

  const handleAlert = (state) => {
    setMediaModal(state);
    setReportModal(state);
  };

  const handleBlockAlert = (state) => {
    UserService.blockUser(el?.ChatMembers[0]?.memberId, token)
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setIsBlocked(true);
          setBlockAlert(state);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBlockedScreen = (state) => {
    navProps.navigation.navigate("BlockedList");
    setBlockAlert(false);
  };

  const onSendEmoji = (emo) => {
    let obj = {
      chatHeadId: el.id,
      senderId: selectedMsg?.senderId,
      loggedInUserId: userData?.id,
      messageId: selectedMsg?.id,
      emoji: `${emo}`,
    };

    socket.emit("message-reaction", obj, (res) => {
      setChatMessages((prevState) => ({
        ...prevState,
        rows: [
          prevState.rows.map((el) =>
            el.id == selectedMsg?.id
              ? { ...el, MessageReactions: [{ emoji: res.emoji }] }
              : el
          ),
        ][0],
      }));
    });

    setSelectedMsg(null);
  };

  let senderTimer;

  const checkTypingStatus = () => {
    let obj = {
      chatHeadId: el.id,
      recipientId:
        el.type === "GROUP"
          ? el.ChatMembers.map((el) => el.memberId)
          : el?.ChatMembers[0]?.memberId,
      typing: true,
    };

    if (senderTimer == null) {
      socket.emit("message-typing", obj);
      senderTimer = setTimeout(() => {
        senderTimer = null;
      }, 500);
    }
  };

  const onChangeText = (val) => {
    if (val.length > 0) {
      checkTypingStatus();
    }
    setMsg(val);
  };

  const TextWithIcon = ({ icon, text }) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Icons.MaterialIcons
        name={icon}
        size={16}
        color={colors.vibeMidGrey}
        style={{ marginRight: 2 }}
      />
      <Text style={{ color: colors.mediumGrey, fontSize: 12 }}>{text}</Text>
    </View>
  );

  const starCallback = () => {
    let obj = {
      chatHeadId: el.id,
      messageId: selectedMsg?.id,
      userId: userData?.id,
    };
    socket.emit("message-favourite", obj, (res) => {});
    setSelectedMsg(null);
  };

  const onReport = () => {
    ChatServices.chatReportMessage(selectedMsg?.id, token)
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          Alerts("success", res.data.message);
        }
      })
      .catch((err) => console.log("chatReportMessage err:", err))
      .finally(() => setSelectedMsg(null));
  };

  const reportCallback = () => {
    Alert.alert(
      "Report Message?",
      "This message will be forwarded to Rishta Auntie. This contact will not be notified.",
      [{ text: "CANCEL" }, { text: "REPORT", onPress: () => onReport() }],
      { cancelable: false }
    );
  };

  const loadMoreData = () => {
    offset += 1;
    getAllChatMessages(limit, offset);
  };

  const onLongPress = (item) => {
    if (el?.type != "GROUP") setSelectedMsg(item);
  };

  const Avatar = () => (
    <View>
      <FastImage
        style={styles.image}
        resizeMode={"stretch"}
        source={{ uri: el?.ChatMembers[0]?.User?.UserMedia[0]?.url }}
      />
      {userStatus ? <View style={styles.status} /> : null}
    </View>
  );

  const renderItem = ({ item }) =>
    item?.senderId != userData?.id ? (
      <>
        {selectedMsg?.id === item.id && <View style={styles.highlight} />}
        <View style={styles.imageMessageContainer}>
          <Avatar />
          <Message
            receivedMsg={item}
            setReply={setReply}
            setReplyMsg={setReplyMsg}
            onLongPress={() => onLongPress(item)}
            chatMessages={chatMessages?.rows}
            msgRead={msgRead}
          />
        </View>
      </>
    ) : (
      item?.senderId == userData?.id && (
        <>
          {selectedMsg?.id === item.id && <View style={styles.highlight} />}
          <Message
            sentMsg={item}
            setReply={setReply}
            setReplyMsg={setReplyMsg}
            msgRead={msgRead}
            onLongPress={() => onLongPress(item)}
            chatMessages={chatMessages?.rows}
          />
        </>
      )
    );

  const renderMatchItem = ({ item }) => <Message item={item.msg} />;

  const renderInteraction = () => (
    <View style={styles.interactionContainer}>
      {renderInteractionText()}
      <View style={styles.avatar}>
        <Avatar />
      </View>

      <View style={styles.interactionImageContainer}>
        {chatMessages?.firstInteraction?.resource?.type == "video" ? (
          <View>
            <Video
              poster={chatMessages?.firstInteraction?.resource?.url}
              source={{
                uri: chatMessages?.firstInteraction?.resource?.url,
              }}
              resizeMode="cover"
              paused={pause}
              repeat={true}
              controls={false}
              style={styles.video}
            />
            <Icons.FontAwesome5
              name={pause ? "play" : "pause"}
              size={20}
              color={colors.primaryPink}
              style={styles.playBtn}
              onPress={() => setPause(!pause)}
            />
          </View>
        ) : chatMessages?.firstInteraction?.resource?.type == "image" ? (
          <FastImage
            source={{
              uri: /your/.test(
                checkInteractionStatement(
                  userData?.id,
                  chatMessages?.firstInteraction,
                  el?.ChatMembers[0]?.User?.firstName
                )
              )
                ? userFirstImage
                : el?.ChatMembers[0]?.User?.UserMedia[0]?.url,
            }}
            style={styles.interactionImage}
            resizeMode="stretch"
          />
        ) : null}
      </View>
      {/LIKE/.test(
        chatMessages?.firstInteraction?.type
      ) ? null : /VOICE_NOTE/.test(
          chatMessages?.firstInteraction?.type
        ) ? null : (
        // <WaveForm
        //   style={{
        //     width: '70%',
        //     height: 30,
        //     marginLeft: 5,
        //     alignSelf: 'center',
        //   }}
        //   // onFinishPlay={() => setShowWaves(false)}
        //   // source={{uri: props.voiceNoteUrl}}
        //   waveFormStyle={{
        //     waveColor: colors.primaryPink,
        //     scrubColor: colors.primaryBlue,
        //   }}
        //   play={false}
        // />
        <>
          <Divider width={3} color={colors.white} style={styles.divider} />
          <Text style={styles.comment}>
            That’s funny I am looking for the same thing. Maybe we should get
            one someday.
          </Text>
        </>
      )}
    </View>
  );

  const renderInteractionText = () => {
    return (
      <Text style={styles.interactionTxt}>
        {checkInteractionStatement(
          userData?.id,
          chatMessages?.firstInteraction,
          el?.ChatMembers[0]?.User?.firstName
        )}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeaderContainer
        backPress={() =>
          selectedMsg
            ? setSelectedMsg(null)
            : el.type === "GROUP"
            ? navProps.navigation.replace("BottomTab", {
                screen: "Settings",
              })
            : navProps.navigation.goBack()
        }
        type={el.type === "GROUP" && "GROUP"}
        name={
          el.type === "GROUP"
            ? "Customer Support"
            : el?.ChatMembers[0]?.User?.firstName
        }
        image={el?.ChatMembers[0]?.User?.UserMedia[0]?.url}
        status={typingStatus ? "typing..." : userStatus ? "online" : ""}
        selected={selectedMsg}
        user={el?.ChatMembers[0]?.User}
        starCallback={starCallback}
        reportCallback={reportCallback}
        optionsPress={showOptions}
      />
      {mediaModal ? (
        <ActionCard
          chatType={el.type}
          isImageAct={true}
          heading={"Choose an Action"}
          handleGallery={handleGallery}
          handleCamera={handleCamera}
          handleVideo={handleVideo}
          handleAlert={handleAlert}
          handleRemoveImage={handleRemoveImage}
          alert={mediaModal}
        />
      ) : null}
      {/* {reportModal == true && isBlocked == false ? (
        <ActionCard
          fav={() => {
            navProps.navigation.navigate('FavouriteMessages', el);
            setReportModal(false);
          }}
          heading={'Profile Privacy'}
          handleReportAlert={handleReportAlert}
          handleBlockAlert={handleBlockAlert}
          handleAlert={handleAlert}
          alert={reportModal}
          handleBlockedScreen={handleBlockedScreen}
          isBlocked={isBlocked}
          Alert={() => {
            isBlocked ? setBlockAlert(true) : setReportModal(true);
          }}
        />
      ) : blockModal == true && isBlocked == true ? (
        <ActionCard
          heading={`You Have Blocked ${el?.ChatMembers[0]?.User?.firstName}`}
          handleBlockAlert={handleBlockAlert}
          handleAlert={handleAlert}
          blockAlert={blockAlert}
          handleBlockedScreen={handleBlockedScreen}
          isBlocked={isBlocked}
          Alert={() => {
            isBlocked ? setBlockAlert(true) : setBlockModal(true);
          }}
        />
      ) : null} */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <FlatList
            inverted={matchReq ? false : true}
            ref={flatRef}
            contentContainerStyle={{ paddingHorizontal: "3%" }}
            showsVerticalScrollIndicator={false}
            data={
              matchReq
                ? noMatchMessages
                : chatMessages?.rows?.sort((a, b) => b.id - a.id)
            }
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMoreData}
            renderItem={matchReq ? renderMatchItem : renderItem}
            ListFooterComponent={
              el.type != "GROUP" ? renderInteraction() : null
            }
          />

          {/* BOTTOM CONTAINER */}
          <KeyboardAvoidingView
            behavior={ios ? "padding" : ""}
            keyboardVerticalOffset={100}
          >
            {reply && (
              <View style={styles.replyContainer}>
                <View style={styles.replyInnerContainer}>
                  <Icons.Ionicons
                    name="close"
                    size={20}
                    color={colors.mediumGrey}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: 5,
                      zIndex: 2,
                    }}
                    onPress={() => setReply(false)}
                  />
                  <View>
                    {replyMsg?.msgPosition == "right" ? (
                      <Text style={styles.replyYou}>You</Text>
                    ) : (
                      <Text style={styles.replyYou}>
                        {el?.ChatMembers[0]?.User?.firstName}
                      </Text>
                    )}
                    {checkExtension(replyMsg?.message) == "Photo" ? (
                      <TextWithIcon icon="photo" text="Photo" />
                    ) : checkExtension(replyMsg?.message) == "Video" ? (
                      <TextWithIcon icon="videocam" text="Video" />
                    ) : checkExtension(replyMsg?.message) == "Audio" ? (
                      <TextWithIcon icon="mic" text="Audio" />
                    ) : (
                      <Text style={styles.replyText} numberOfLines={3}>
                        {replyMsg?.message}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
            {selectedMsg ? (
              <View style={{ height: 280 }}>
                <EmojiSelector
                  columns={10}
                  category={Categories.symbols}
                  onEmojiSelected={onSendEmoji}
                />
              </View>
            ) : (
              <View style={styles.bottomContainer}>
                <View
                  style={[
                    styles.inputContainer,
                    // reply && styles.replyInputContainer,
                  ]}
                >
                  {recordView ? (
                    <View style={styles.audioContainer}>
                      <TouchableOpacity
                        onPress={onStopRecord}
                        style={[
                          styles.deletePauseContainer,
                          { marginRight: 5 },
                        ]}
                      >
                        <FastImage
                          style={{
                            width: "50%",
                            height: "50%",
                          }}
                          resizeMode="contain"
                          source={require("../../assets/iconimages/delete-White.png")}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={pauseView ? onResumeRecord : onPauseRecord}
                        style={styles.deletePauseContainer}
                      >
                        <FastImage
                          style={{
                            width: pauseView ? "55%" : "40%",
                            height: pauseView ? "55%" : "40%",
                          }}
                          resizeMode="contain"
                          source={
                            pauseView
                              ? require("../../assets/iconimages/mic.png")
                              : require("../../assets/iconimages/pauseVoice.png")
                          }
                        />
                      </TouchableOpacity>
                      <Text style={styles.recordTime}>{recordTime}</Text>
                    </View>
                  ) : (
                    <>
                      <TextInput
                        value={msg}
                        placeholder="Write a reply..."
                        placeholderTextColor={colors.vibeLightGrey}
                        style={styles.input}
                        onChangeText={onChangeText}
                      />
                      <TouchableOpacity onPress={captureMedia}>
                        <FastImage
                          source={require("../../assets/iconimages/camera-blue-01.png")}
                          style={{ width: 24, height: 24 }}
                          tintColor={colors.vibeMidGrey}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  disabled={matchReq}
                  style={styles.micContainer}
                  onPress={onPressSend}
                >
                  {loader ? (
                    <Loader />
                  ) : (
                    <FastImage
                      source={
                        msg || recordView
                          ? require("../../assets/iconimages/send-03.png")
                          : require("../../assets/iconimages/mic.png")
                      }
                      tintColor="white"
                      style={{
                        left: msg ? 0 : recordView ? -2 : 0,
                        top: msg ? 0 : recordView ? 2 : 0,
                        width: msg ? 26 : recordView ? 33 : 37,
                        height: msg ? 26 : recordView ? 33 : 37,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
            {matchReq && (
              <View>
                <Button
                  YesNoBtn
                  onPress={() =>
                    navProps.navigation.navigate("ViewEditProfile", {
                      screen: "EditProfile",
                    })
                  }
                  title="Edit My Profile"
                  btnTitleStyle={{ fontFamily: "Inter-Regular" }}
                  YesNoBtnStyle={{ marginVertical: "5%", width: "50%" }}
                />
                <Button
                  YesNoBtn
                  onPress={() => navProps.navigation.navigate("Discover")}
                  title="Go To Discover"
                  btnTitleStyle={{ fontFamily: "Inter-Regular" }}
                  YesNoBtnStyle={{ marginBottom: "5%", width: "50%" }}
                />
              </View>
            )}
          </KeyboardAvoidingView>
        </>
      )}
      {action ? (
        <ActionBottomModal
          user={{
            userId: el?.ChatMembers[0]?.memberId,
            userName: el?.ChatMembers[0]?.User?.firstName,
          }}
          fav={() => {
            setAction(false);
            navProps.navigation.navigate("FavouriteMessages", el);
          }}
          toggle={action}
          setAction={setAction}
          onDismiss={() => setAction(false)}
        />
      ) : null}
    </SafeAreaView>
  );
};
export default ChatScreen;
