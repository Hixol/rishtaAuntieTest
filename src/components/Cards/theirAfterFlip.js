import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";

import styles from "./styles";
import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";
import WaveForm from "react-native-audiowaveform";
import CircularIcon from "../circularIcons";
import FeedbackModal from "../Modal/FeedBackModal";

const theirAfterFlip = props => {
  let date_1 = new Date(props.createdAt);
  let date_2 = new Date();
  let difference = date_2.getTime() - date_1.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

  const [loading, setLoading] = useState(false);
  const [showWaves, setShowWaves] = useState(props.showWaves);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false); // State for feedback modal visibility

  useEffect(() => {}, [showWaves]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleChatPress = () => {
    setIsFeedbackModalVisible(true); // Show the feedback modal when chat icon is pressed
    if (props.circularIconChatPress) {
      props.circularIconChatPress(); // Call any additional chat press logic
    }
  };

  return (
    <View style={styles.shadowContainer1} onPress={props.afterFlipPress}>
      <View style={styles.commentContainer}>
        <View style={{ alignSelf: "center" }}>
          <Text style={styles.daysAgoTxt}>
            {TotalDays <= 1 ? TotalDays + " Day Ago" : TotalDays + " Days Ago"}
          </Text>
        </View>

        <View style={styles.topUserView}>
          <View style={styles.topRowView}>
            <Text numberOfLines={2} style={styles.nameTxt}>
              {props.Bname}
            </Text>
            <Text style={styles.ageTxt}>{props.age}</Text>
          </View>
        </View>

        <View style={{ marginVertical: "5%" }}>
          {props.type === "COMMENT" ? (
            <View>
              <Text
                numberOfLines={props.resourceType === "PROFILE_PROMPT" ? 8 : 2}
                style={styles.likeCommentText}
              >
                {props.userMediaType === "video"
                  ? `commented: "${props.interactionComment}" on your discover video`
                  : props.userMediaType === "image"
                  ? `commented: "${props.interactionComment}" on your picture`
                  : props.resourceType === "PROFILE_PROMPT"
                  ? `commented: "${props.interactionComment}" on your prompt`
                  : null}
              </Text>
            </View>
          ) : props.type === "LIKE" ? (
            <Text numberOfLines={2} style={styles.likeCommentText}>
              {props.resourceType === "USER_MEDIA" &&
              props.userMediaType === "video"
                ? "liked your discover video"
                : props.resourceType === "USER_MEDIA" &&
                  props.userMediaType === "image"
                ? "liked your picture"
                : `liked your prompt`}
            </Text>
          ) : props.type === "VOICE_NOTE" ? (
            <View>
              <Text numberOfLines={2} style={styles.likeCommentText}>
                {props.userMediaType === "video"
                  ? "left a voice note on your discover video"
                  : props.userMediaType === "image"
                  ? "left a voice note on your picture"
                  : "left a voice note on your prompt"}
              </Text>

              <View style={styles.waveContainer}>
                <TouchableOpacity
                  disabled={loading ? true : false}
                  onPress={() => setShowWaves(!showWaves)}
                  style={styles.playBtnContainer}
                >
                  {loading ? (
                    <ActivityIndicator size={"small"} color={colors.white} />
                  ) : (
                    <FastImage
                      resizeMode="contain"
                      style={styles.playBtn}
                      source={
                        showWaves
                          ? require("../../assets/iconimages/pause.png")
                          : require("../../assets/iconimages/playIcon.png")
                      }
                    />
                  )}
                </TouchableOpacity>

                <WaveForm
                  style={styles.wave}
                  onFinishPlay={() => setShowWaves(false)}
                  source={{ uri: props.voiceNoteUrl }}
                  waveFormStyle={{
                    waveColor: colors.primaryPink,
                    scrubColor: colors.primaryBlue,
                  }}
                  play={props.play === true && showWaves === true}
                />
              </View>
            </View>
          ) : props.status === 2 ? (
            <Text numberOfLines={2} style={styles.likeCommentText}>
              Rejected Request
            </Text>
          ) : props.status === 1 ? (
            <Text numberOfLines={2} style={styles.likeCommentText}>
              Accepted Request
            </Text>
          ) : props.status === 0 ? (
            <Text numberOfLines={2} style={styles.likeCommentText}>
              Pending Request
            </Text>
          ) : props.type === "Requests" ? (
            <Text numberOfLines={2} style={styles.likeCommentText}>
              All Request
            </Text>
          ) : props.selectedItems === "All Requests" ||
            props.selectedItems === "Rejected" ||
            props.selectedItems === "Pending" ? (
            <View>
              <Text numberOfLines={2} style={styles.likeCommentText}>
                {props.selectedItems === "All Requests"
                  ? props.selectedItems
                  : props.selectedItems + " Request"}
              </Text>
            </View>
          ) : (
            <View>
              <Text numberOfLines={2} style={styles.likeCommentText}>
                {props.Bname} viewed your Profile
              </Text>
            </View>
          )}
        </View>

        {props.resourceType === "PROFILE_PROMPT" ? (
          <View style={styles.divider} />
        ) : null}
        {props.resourceType === "PROFILE_PROMPT" ? (
          <View style={styles.promptContainer}>
            <Text numberOfLines={2} style={styles.questTxt}>
              {props.question}
            </Text>
            <Text numberOfLines={2} style={styles.ansTxt}>
              {props.answer}
            </Text>
          </View>
        ) : null}
        <View style={{ alignSelf: "center" }}>
          {props.resourceType === "USER_MEDIA" ? (
            <FastImage style={styles.profilePic} source={props.Image} />
          ) : props.resourceType === "PROFILE_PROMPT" ? null : (
            <FastImage style={styles.profilePic} source={props.Image} />
          )}
        </View>
      </View>

      {(props.selectedFilter !== "All interactions" &&
        props.selectedFilter !== "Views") ||
      props.type === "MATCH_REQUEST" ? (
        <View style={styles.btnViewContainer}>
          {props.status === 0 ? (
            <View
              style={[
                styles.btnView,
                {
                  marginTop:
                    props.resourceType === "USER_MEDIA" &&
                    props.type === "VOICE_NOTE"
                      ? "7%"
                      : null,
                },
              ]}
            >
              <CircularIcon
                onPress={props.circularIconCrossPress}
                iconCrossImage
                color={colors.primaryPink}
                size={26}
                circularIconStyle={[
                  styles.iconStyle,
                  { backgroundColor: colors.circularIcon },
                ]}
              />
              <CircularIcon
                iconChatImage
                onPress={handleChatPress} // Use the new handler
                color={colors.white}
                size={26}
                circularIconStyle={styles.iconStyle}
              />
            </View>
          ) : props.status === 1 ? (
            <View
              style={[
                styles.btnView,
                {
                  marginTop:
                    props.resourceType === "USER_MEDIA" &&
                    props.type === "VOICE_NOTE"
                      ? "7%"
                      : null,
                },
              ]}
            >
              <CircularIcon
                iconChatImage
                status={props.status}
                onPress={handleChatPress} // Use the new handler
                color={colors.white}
                size={26}
                circularIconStyle={styles.iconStyle}
              />
            </View>
          ) : props.status === 2 ? (
            <View
              style={[
                styles.btnView,
                {
                  marginTop:
                    props.resourceType === "USER_MEDIA" &&
                    props.type === "VOICE_NOTE"
                      ? "7%"
                      : null,
                },
              ]}
            >
              <CircularIcon
                iconCrossImage
                status={props.status}
                // onPress={props.circularIconCrossPress}
                color={colors.primaryPink}
                size={26}
                circularIconStyle={[
                  styles.iconStyle,
                  { backgroundColor: colors.circularIcon },
                ]}
              />
            </View>
          ) : null}
        </View>
      ) : null}

      <TouchableOpacity
        onPress={props.onPress1}
        style={styles.diagonalXContainer}
      >
        <View style={styles.diagonalXInnerContainer}>
          <FastImage
            resizeMode="contain"
            style={styles.xImg}
            source={require("../../assets/iconimages/x.png")}
          />
        </View>
      </TouchableOpacity>

      {/* Feedback Modal */}
      <Modal
        transparent={true}
        visible={isFeedbackModalVisible}
        onRequestClose={() => setIsFeedbackModalVisible(false)}
      >
        <FeedbackModal
          onClose={() => setIsFeedbackModalVisible(false)}
          // Pass any additional props your feedback modal might need
        />
      </Modal>
    </View>
  );
};

export default theirAfterFlip;
