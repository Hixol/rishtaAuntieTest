import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { ios, windowWidth } from "../utility/size";
import { useSelector } from "react-redux";
import { checkExtension } from "../utility/regex";
import { LinkPreview } from "@flyerhq/react-native-link-preview";

import colors from "../utility/colors";
import FastImage from "react-native-fast-image";
import Video from "react-native-video";
import convertToProxyURL from "react-native-video-cache";
import Slider from "react-native-slider";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icons from "../utility/icons";

const Message = ({
  item,
  sentMsg,
  receivedMsg,
  setReply,
  setReplyMsg,
  onLongPress,
  chatMessages,
  msgRead,
}) => {
  const navigation = useNavigation();
  const { userData } = useSelector(store => store.userReducer);
  const [play, setPlay] = useState(true);
  const [pausePlay, setPausePlay] = useState(true);
  const [playTime, setPlayTime] = useState("00:00");
  const [currentPosSec, setCurrentPosSec] = useState(0);
  const [currentDurSec, setCurrentDurSec] = useState(0);
  const [net, setNet] = useState(false);
  const rightAudioRef = useRef(null);
  const leftAudioRef = useRef(null);
  const rightSwipeableRef = useRef(null);
  const leftSwipeableRef = useRef(null);
  let playWidth = (currentPosSec / currentDurSec) * 100;
  let asyncMsgRead = "";

  if (!playWidth) {
    playWidth = 0;
  }

  useEffect(() => {
    async () => {
      asyncMsgRead = await AsyncStorage.getItem("MSG_READ");
    };
    const unsubscribe = () => {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          setNet(true);
        } else {
          setNet(false);
        }
      });
    };

    return () => unsubscribe();
  }, []);

  const onProgress = e => {
    let minutes = Math.floor(e.currentTime / 60);
    let seconds = Math.floor(e.currentTime - minutes * 60);
    let time = `0${minutes}:0${seconds}`;
    setCurrentDurSec(e.seekableDuration);
    setCurrentPosSec(e.currentTime);
    setPlayTime(time);
  };

  const onEnd = () => {
    rightAudioRef.current?.seek(0);
    leftAudioRef.current?.seek(0);
    setCurrentDurSec(0);
    setCurrentPosSec(0);
    setPausePlay(true);
  };

  const onSlidingComplete = e => {
    let time = (e / 100) * currentDurSec;
    rightAudioRef.current?.seek(time);
    leftAudioRef.current?.seek(time);
  };

  const mediaPreview = (type, uri) => {
    navigation.navigate("MessagePreview", {
      type,
      uri,
    });
  };

  const VideoThumbnail = ({ uri, borderCornerStyle }) => (
    <View style={[styles.videoWrapper, borderCornerStyle]}>
      <Video
        resizeMode="cover"
        repeat={true}
        poster={uri}
        style={[styles.video, borderCornerStyle]}
        paused={play}
        source={{ uri: convertToProxyURL(uri) }}
      />
      <TouchableOpacity
        onPress={() => mediaPreview("video", uri)}
        style={styles.playBtnContainer}
      >
        <Icons.Ionicons
          name={play ? "play" : "pause"}
          color={colors.white}
          size={30}
        />
      </TouchableOpacity>
    </View>
  );

  const renderReplyBtn = () => {
    return (
      <View style={styles.replyBtnContainer}>
        <Icons.MaterialCommunityIcons
          name="reply"
          size={22}
          color={colors.white}
        />
      </View>
    );
  };

  const ExtWithIcon = ({ icon, text, user, msg }) => (
    <View style={[styles.row, { justifyContent: "space-between" }]}>
      <View>
        <Text style={styles.replyYou}>{user}</Text>
        <View style={styles.row}>
          <Icons.MaterialIcons
            name={icon}
            size={16}
            color={colors.vibeMidGrey}
            style={{ marginRight: 2 }}
          />
          <Text style={styles.replyMsg}>{text}</Text>
        </View>
      </View>
      {text == "Photo" ? (
        <FastImage
          source={{ uri: msg }}
          style={{
            width: 40,
            height: "100%",
            right: -9,
          }}
          resizeMode="contain"
        />
      ) : (
        text == "Video" && (
          <Video
            poster={msg}
            source={{ uri: convertToProxyURL(msg) }}
            style={{ width: 40, height: "100%", right: -8 }}
            resizeMode="contain"
            paused={true}
            controls={false}
          />
        )
      )}
    </View>
  );

  const RenderReply = ({ msg, user, cornerStyle }) => (
    <View style={[styles.replyMsgContainer, cornerStyle]}>
      {checkExtension(msg) === "Photo" ? (
        <ExtWithIcon icon="photo" text="Photo" user={user} msg={msg} />
      ) : checkExtension(msg) === "Video" ? (
        <ExtWithIcon icon="videocam" text="Video" user={user} msg={msg} />
      ) : checkExtension(msg) === "Audio" ? (
        <ExtWithIcon icon="mic" text="Audio" user={user} msg={msg} />
      ) : (
        <View>
          <Text style={styles.replyYou}>{user}</Text>
          <Text numberOfLines={3} style={styles.replyMsg}>
            {msg}
          </Text>
        </View>
      )}
    </View>
  );

  const MsgSeen = ({ time, left, status }) => (
    <>
      {left ? (
        <View
          style={{
            alignSelf: "flex-start",
            marginLeft: receivedMsg?.MessageReactions.length > 0 ? 45 : "2.5%",
          }}
        >
          <Text style={styles.time}>{time}</Text>
        </View>
      ) : (
        <View
          style={[
            styles.msgSeen,
            sentMsg?.MessageReactions.length > 0 && { marginRight: 45 },
          ]}
        >
          <Text style={styles.time}>{time}</Text>
          {status === "SEEN" ? (
            <Icons.Ionicons
              name="checkmark-done"
              size={18}
              color={colors.primaryPink}
            />
          ) : status === "DELIVERED" ? (
            <Icons.Ionicons
              name="checkmark-done"
              size={18}
              color={colors.vibeMidGrey}
            />
          ) : (
            <Icons.Ionicons
              name="checkmark"
              size={18}
              color={colors.vibeMidGrey}
            />
          )}
        </View>
      )}
    </>
  );

  const RenderEmoji = ({ emoji, style }) => (
    <View style={[styles.emojiContainer, style]}>
      <Text>{emoji}</Text>
    </View>
  );

  return (
    <>
      {(sentMsg?.message && sentMsg?.type === "TEXT_MESSAGE") ||
      item?.answer ? ( //SENT TEXT BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            enabled={item ? false : true}
            ref={rightSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => rightSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "right", ...sentMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "2%" }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={item}
              onLongPress={onLongPress}
              style={[
                styles.answerMsg,
                // sentMsg && styles.shadow(sentMsg?.MessageReactions),
                sentMsg?.messageReplyId && styles.replyWrapper,
                {
                  marginVertical: sentMsg ? "0.5%" : "3%",
                  marginHorizontal: sentMsg ? 0 : "2%",
                },
              ]}
            >
              {sentMsg?.messageReplyId &&
                chatMessages.length > 0 &&
                chatMessages.map(el =>
                  el?.id == sentMsg?.messageReplyId ? (
                    <RenderReply
                      cornerStyle={{ borderTopRightRadius: 0 }}
                      msg={el?.message}
                      user={
                        el?.senderId != userData?.id
                          ? el?.Sender?.firstName
                          : "You"
                      }
                    />
                  ) : null
                )}
              <Text style={styles.answerText}>
                {sentMsg?.message || item?.answer}
              </Text>
            </TouchableOpacity>
            {sentMsg && (
              <MsgSeen
                status={sentMsg?.status}
                time={moment(sentMsg?.createdAt).format("H:mm a")}
              />
            )}
            {sentMsg?.MessageReactions.length > 0 && (
              <RenderEmoji emoji={sentMsg?.MessageReactions[0].emoji} />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : sentMsg?.message && sentMsg?.type === "PICTURE" ? ( //SENT IMAGE BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            ref={rightSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => rightSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "right", ...sentMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "2%" }}
          >
            <Pressable
              disabled={item}
              onLongPress={onLongPress}
              onPress={() => mediaPreview("image", sentMsg?.message)}
              style={[
                styles.answerMsg,
                styles.mediaWrapper("right"),
                // sentMsg && styles.shadow(sentMsg?.MessageReactions),
              ]}
            >
              <FastImage
                style={[styles.image, { borderTopRightRadius: 0 }]}
                source={{
                  uri: sentMsg?.message,
                }}
              />
            </Pressable>
            <MsgSeen
              status={sentMsg?.status}
              time={moment(sentMsg?.createdAt).format("H:mm a")}
            />
            {sentMsg?.MessageReactions.length > 0 && (
              <RenderEmoji emoji={sentMsg?.MessageReactions[0].emoji} />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : sentMsg?.message && sentMsg?.type === "VIDEO" ? ( //SENT VIDEO BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            ref={rightSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => rightSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "right", ...sentMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "2%" }}
          >
            <Pressable
              disabled={item}
              onLongPress={onLongPress}
              onPress={() => mediaPreview("video", sentMsg?.message)}
              style={[
                styles.answerMsg,
                styles.mediaWrapper("right"),
                // sentMsg && styles.shadow(sentMsg?.MessageReactions),
              ]}
            >
              <VideoThumbnail
                uri={sentMsg?.message}
                borderCornerStyle={{ borderTopRightRadius: 0 }}
              />
            </Pressable>
            <MsgSeen
              status={sentMsg?.status}
              time={moment(sentMsg?.createdAt).format("H:mm a")}
            />
            {sentMsg?.MessageReactions.length > 0 && (
              <RenderEmoji emoji={sentMsg?.MessageReactions[0].emoji} />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : sentMsg?.message && sentMsg?.type === "VOICE_NOTE" ? ( //SENT AUDIO BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            ref={rightSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => rightSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "right", ...sentMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "2%" }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={item}
              onLongPress={onLongPress}
              style={[
                styles.answerMsg,
                styles.mediaWrapper("right"),
                // sentMsg && styles.shadow(sentMsg?.MessageReactions),
              ]}
            >
              <Video
                ref={rightAudioRef}
                source={{ uri: sentMsg?.message }}
                style={styles.audioContainer}
                audioOnly={true}
                resizeMode={"contain"}
                controls={false}
                paused={pausePlay}
                repeat={false}
                ignoreSilentSwitch={"ignore"}
                playInBackground={false}
                onProgress={e => onProgress(e)}
                onEnd={e => onEnd(e)}
              />
              <View style={styles.audioBtnSeek}>
                <Pressable
                  onPress={() => setPausePlay(!pausePlay)}
                  style={{ alignItems: "center" }}
                >
                  <Icons.Ionicons
                    name={pausePlay ? "play" : "pause"}
                    color={colors.white}
                    size={30}
                  />
                  <Text style={{ color: colors.white, fontSize: 12 }}>
                    {playTime}
                  </Text>
                </Pressable>
                <View style={{ width: "80%" }}>
                  <Slider
                    value={playWidth}
                    minimumValue={0}
                    maximumValue={100}
                    style={{ height: "100%" }}
                    trackStyle={{ backgroundColor: colors.white }}
                    thumbStyle={styles.thumbStyle}
                    onSlidingComplete={e => onSlidingComplete(e)}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <MsgSeen
              status={sentMsg?.status}
              time={moment(sentMsg?.createdAt).format("H:mm a")}
            />
            {sentMsg?.MessageReactions.length > 0 && (
              <RenderEmoji emoji={sentMsg?.MessageReactions[0].emoji} />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : sentMsg?.message && sentMsg?.type === "LINK" ? ( //SENT LINK BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            ref={rightSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => rightSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "right", ...sentMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "2%" }}
          >
            <Pressable
              disabled={item}
              onLongPress={onLongPress}
              onPress={() => Linking.openURL(sentMsg?.message)}
              style={[
                styles.answerMsg,
                // sentMsg && styles.shadow(sentMsg?.MessageReactions),
                styles.replyWrapper,
                {
                  marginVertical: sentMsg ? "0.5%" : "3%",
                  marginHorizontal: sentMsg ? 0 : "2%",
                },
              ]}
            >
              {sentMsg?.messageReplyId ? (
                chatMessages.length > 0 &&
                chatMessages.map(el =>
                  el?.id == sentMsg?.messageReplyId ? (
                    <RenderReply
                      cornerStyle={{ borderTopRightRadius: 0 }}
                      msg={el?.message}
                      user={
                        el?.senderId != userData?.id
                          ? el?.Sender?.firstName
                          : "You"
                      }
                    />
                  ) : null
                )
              ) : (
                <LinkPreview
                  text={sentMsg?.message}
                  textContainerStyle={{ display: "none" }}
                  containerStyle={[
                    styles.linkContainerStyle,
                    { borderTopRightRadius: 0 },
                  ]}
                />
              )}
              <Text style={{ color: colors.overlayBlue }}>
                {sentMsg?.message}
              </Text>
            </Pressable>
            {sentMsg && (
              <MsgSeen
                status={sentMsg?.status}
                time={moment(sentMsg?.createdAt).format("H:mm a")}
              />
            )}
            {sentMsg?.MessageReactions.length > 0 && (
              <RenderEmoji emoji={sentMsg?.MessageReactions[0].emoji} />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : (receivedMsg?.message && receivedMsg?.type === "TEXT_MESSAGE") ||
        item ? ( //RECEIVED TEXT BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            enabled={item ? false : true}
            ref={leftSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => leftSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "left", ...receivedMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "1%" }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={item}
              onLongPress={onLongPress}
              style={[
                styles.questionMsg,
                // receivedMsg && styles.shadow(receivedMsg?.MessageReactions),
                receivedMsg?.messageReplyId && styles.replyWrapper,
              ]}
            >
              {receivedMsg?.messageReplyId &&
                chatMessages.length > 0 &&
                chatMessages.map(el =>
                  el?.id == receivedMsg?.messageReplyId ? (
                    <RenderReply
                      cornerStyle={{ borderBottomLeftRadius: 0 }}
                      msg={el?.message}
                      user={
                        el?.senderId != userData?.id
                          ? el?.Sender?.firstName
                          : "You"
                      }
                    />
                  ) : null
                )}
              <Text style={styles.questionText}>
                {receivedMsg?.message || item}
              </Text>
            </TouchableOpacity>
            {receivedMsg && (
              <MsgSeen
                left
                time={moment(receivedMsg?.createdAt).format("H:mm a")}
              />
            )}
            {receivedMsg?.MessageReactions.length > 0 && (
              <RenderEmoji
                emoji={receivedMsg?.MessageReactions[0].emoji}
                style={{ left: 12, bottom: 0 }}
              />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : receivedMsg?.message && receivedMsg?.type === "PICTURE" ? ( //RECEIVED IMAGE BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            ref={leftSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => leftSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "left", ...receivedMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "1%" }}
          >
            <Pressable
              disabled={item}
              onLongPress={onLongPress}
              onPress={() => mediaPreview("image", receivedMsg?.message)}
              style={[
                styles.questionMsg,
                styles.mediaWrapper("left"),
                // receivedMsg && styles.shadow(receivedMsg?.MessageReactions),
              ]}
            >
              <FastImage
                style={[styles.image, { borderTopLeftRadius: 0 }]}
                source={{
                  uri: receivedMsg?.message,
                }}
              />
            </Pressable>
            <MsgSeen
              left
              time={moment(receivedMsg?.createdAt).format("H:mm a")}
            />
            {receivedMsg?.MessageReactions.length > 0 && (
              <RenderEmoji
                emoji={receivedMsg?.MessageReactions[0].emoji}
                style={{ left: 10 }}
              />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : receivedMsg?.message && receivedMsg?.type === "VIDEO" ? ( //RECEIVED VIDEO BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            ref={leftSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => leftSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "left", ...receivedMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "1%" }}
          >
            <Pressable
              disabled={item}
              onLongPress={onLongPress}
              onPress={() => mediaPreview("video", receivedMsg?.message)}
              style={[
                styles.questionMsg,
                styles.mediaWrapper("left"),
                // receivedMsg && styles.shadow(receivedMsg?.MessageReactions),
              ]}
            >
              <VideoThumbnail
                uri={receivedMsg?.message}
                borderCornerStyle={{ borderTopLeftRadius: 0 }}
              />
            </Pressable>
            <MsgSeen
              left
              time={moment(receivedMsg?.createdAt).format("H:mm a")}
            />
            {receivedMsg?.MessageReactions.length > 0 && (
              <RenderEmoji
                emoji={receivedMsg?.MessageReactions[0].emoji}
                style={{ left: 10 }}
              />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : receivedMsg?.message && receivedMsg?.type === "VOICE_NOTE" ? ( //RECECIVED AUDIO BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            ref={leftSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => leftSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "left", ...receivedMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "1%" }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={item}
              onLongPress={onLongPress}
              style={[
                styles.questionMsg,
                styles.mediaWrapper("left"),
                // receivedMsg && styles.shadow(receivedMsg?.MessageReactions),
              ]}
            >
              <Video
                ref={leftAudioRef}
                source={{ uri: receivedMsg?.message }}
                style={styles.audioContainer}
                audioOnly={true}
                resizeMode={"contain"}
                controls={false}
                paused={pausePlay}
                repeat={false}
                ignoreSilentSwitch={"ignore"}
                playInBackground={false}
                onProgress={e => onProgress(e)}
                onEnd={e => onEnd(e)}
              />
              <View style={styles.audioBtnSeek}>
                <Pressable
                  onPress={() => setPausePlay(!pausePlay)}
                  style={{ alignItems: "center" }}
                >
                  <Icons.Ionicons
                    name={pausePlay ? "play" : "pause"}
                    color={colors.primaryPink}
                    size={30}
                  />
                  <Text style={styles.smallFont}>{playTime}</Text>
                </Pressable>
                <View style={{ width: "80%" }}>
                  <Slider
                    value={playWidth}
                    minimumValue={0}
                    maximumValue={100}
                    style={{ height: "100%" }}
                    trackStyle={{ backgroundColor: colors.black }}
                    thumbStyle={styles.thumbStyle}
                    onSlidingComplete={e => onSlidingComplete(e)}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <MsgSeen
              left
              time={moment(receivedMsg?.createdAt).format("H:mm a")}
            />
            {receivedMsg?.MessageReactions.length > 0 && (
              <RenderEmoji
                emoji={receivedMsg?.MessageReactions[0].emoji}
                style={{ left: 10 }}
              />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : receivedMsg?.message && receivedMsg?.type === "LINK" ? ( //RECECIVED LINK BUBBLE
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Swipeable
            ref={leftSwipeableRef}
            renderLeftActions={renderReplyBtn}
            onSwipeableOpen={() => leftSwipeableRef.current?.close()}
            onSwipeableWillOpen={() => {
              setReplyMsg({ msgPosition: "left", ...receivedMsg });
              setReply(true);
            }}
            containerStyle={{ flex: 1, marginBottom: "1%" }}
          >
            <Pressable
              disabled={item}
              onLongPress={onLongPress}
              onPress={() => Linking.openURL(receivedMsg?.message)}
              style={[
                styles.questionMsg,
                // receivedMsg && styles.shadow(receivedMsg?.MessageReactions),
                styles.replyWrapper,
              ]}
            >
              {receivedMsg?.messageReplyId ? (
                chatMessages.length > 0 &&
                chatMessages.map(el =>
                  el?.id == receivedMsg?.messageReplyId ? (
                    <RenderReply
                      cornerStyle={{ borderBottomLeftRadius: 0 }}
                      msg={el?.message}
                      user={
                        el?.senderId != userData?.id
                          ? el?.Sender?.firstName
                          : "You"
                      }
                    />
                  ) : null
                )
              ) : (
                <LinkPreview
                  text={receivedMsg?.message}
                  textContainerStyle={{ display: "none" }}
                  containerStyle={[
                    styles.linkContainerStyle,
                    { borderTopLeftRadius: 0 },
                  ]}
                />
              )}
              <Text style={{ color: colors.overlayBlue }}>
                {receivedMsg?.message}
              </Text>
            </Pressable>
            {receivedMsg && (
              <MsgSeen
                left
                time={moment(receivedMsg?.createdAt).format("H:mm a")}
              />
            )}
            {receivedMsg?.MessageReactions.length > 0 && (
              <RenderEmoji
                emoji={receivedMsg?.MessageReactions[0].emoji}
                style={{ left: 10, bottom: 0 }}
              />
            )}
          </Swipeable>
        </GestureHandlerRootView>
      ) : null}
    </>
  );
};

export default Message;

const styles = StyleSheet.create({
  questionMsg: {
    maxWidth: "78%",
    backgroundColor: colors.msgGrey,
    paddingVertical: "2%",
    paddingHorizontal: "4%",
    marginVertical: "1%",
    marginHorizontal: "2%",
    alignSelf: "flex-start",
    borderRadius: 24,
    borderBottomLeftRadius: 0,
  },
  answerMsg: {
    maxWidth: "78%",
    backgroundColor: colors.primaryPink,
    paddingVertical: "2%",
    paddingHorizontal: "4%",
    marginVertical: "3%",
    marginHorizontal: "2%",
    alignSelf: "flex-end",
    borderRadius: 24,
    borderTopRightRadius: 0,
  },
  questionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: colors.blackBlue,
  },
  answerText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: colors.white,
  },
  caption: {
    maxWidth: windowWidth * 0.58,
    marginTop: 3,
  },
  shadow: reaction => ({
    elevation: reaction.length > 0 ? 0 : 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  }),
  image: {
    width: windowWidth * 0.55,
    height: 280,
    borderRadius: 18,
  },
  mediaWrapper: type => ({
    maxWidth: "68%",
    paddingHorizontal: "1.5%",
    paddingVertical: "1.5%",
    marginVertical: /left|right/.test(type) ? "1%" : "3%",
    marginHorizontal: type == "right" ? 0 : "2%",
  }),
  videoWrapper: {
    borderRadius: 18,
    width: windowWidth * 0.55,
    height: 280,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  playBtnContainer: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    top: 240 / 2,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  replyBtnContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginHorizontal: "1%",
  },
  audioContainer: {
    width: windowWidth * 0.58,
  },
  audioBtnSeek: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 42,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  thumbStyle: {
    width: 12,
    height: 12,
    backgroundColor: colors.primaryPink,
  },
  msgSeen: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  smallFont: {
    color: colors.black,
    fontSize: 12,
  },
  time: {
    color: colors.vibeMidGrey,
    fontSize: 11,
    fontWeight: "600",
  },
  highlightMsg: {
    backgroundColor: "rgba(52, 183, 241, 0.5)",
    height: "100%",
    width: windowWidth,
    position: "absolute",
    zIndex: 1,
  },
  emojiContainer: {
    right: 10,
    bottom: 4,
    position: "absolute",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    width: 28,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: colors.white,
  },
  replyMsgContainer: {
    minWidth: 100,
    backgroundColor: colors.softGrey,
    borderLeftWidth: 5,
    borderLeftColor: colors.overlayBlue,
    borderRadius: 14,
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 10,
    overflow: "hidden",
    justifyContent: "space-between",
    paddingHorizontal: "2%",
    paddingVertical: "1%",
    marginBottom: ios ? 4 : 2,
  },
  replyYou: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: colors.primaryBlue,
  },
  replyMsg: {
    color: colors.mediumGrey,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
    fontSize: 12,
  },
  replyWrapper: {
    paddingHorizontal: "1.5%",
    paddingVertical: "1.5%",
    borderRadius: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageText: {
    color: colors.black,
    fontSize: 16,
  },
  linkContainerStyle: {
    borderRadius: 12,
    overflow: "hidden",
    height: ios ? 65 : 80,
    marginBottom: 5,
  },
});
