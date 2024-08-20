import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";

const FeedbackModal = ({ visible, onClose }) => {
  const [feedback, setFeedback] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(null);

  useEffect(() => {
    // Effect to run on component mount to check modal status
    const checkModalStatus = async () => {
      const feedbackStatus = await AsyncStorage.getItem("feedbackStatus");
      const lastSkipped = await AsyncStorage.getItem("lastSkipped");
      const nextShowDate = await AsyncStorage.getItem("nextShowDate");

      const now = new Date();

      // Determine if the modal should be shown
      if (
        feedbackStatus !== "submitted" &&
        (!lastSkipped ||
          new Date(lastSkipped).getTime() + 7 * 24 * 60 * 60 * 1000 <=
            now.getTime()) &&
        (!nextShowDate || new Date(nextShowDate) <= now)
      ) {
        // Show the modal
      } else {
        onClose(); // Hide the modal if conditions are not met
      }
    };

    checkModalStatus();
  }, [visible]);

  const handleThumbsUp = () => {
    setSelectedThumb("up");
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=YOUR_APP_ID"
    );
    onClose();
  };

  const handleThumbsDown = () => {
    setShowTextInput(true);
    setSelectedThumb("down");
  };

  const handleSkip = async () => {
    const now = new Date();
    await AsyncStorage.setItem("lastSkipped", now.toISOString());
    // Set next show date to one week from now
    const nextShowDate = new Date();
    nextShowDate.setDate(nextShowDate.getDate() + 7);
    await AsyncStorage.setItem("nextShowDate", nextShowDate.toISOString());
    onClose();
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await axios.post(
        "https://api.rishtaauntie.link/dev/rishta_auntie/api/v1/user/app-feedback",
        { comment: feedback } // Adjusted to match the backend structure
      );
      console.log("Response:", response.data); // Log the response
      Alert.alert("Success", response.data.message);
      await AsyncStorage.setItem("feedbackStatus", "submitted");
      // Set next show date to one week from now
      const nextShowDate = new Date();
      nextShowDate.setDate(nextShowDate.getDate() + 7);
      await AsyncStorage.setItem("nextShowDate", nextShowDate.toISOString());
    } catch (error) {
      console.error(
        "Error submitting feedback:",
        error.response || error.message
      ); // Log the error
      Alert.alert("Submission Failed", "Please try again later.");
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {!showTextInput && (
            <>
              <Text style={styles.title}>
                Tell us how you’re liking the Rishta Auntie app
              </Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.thumbButton}
                  onPress={handleThumbsUp}
                >
                  <FastImage
                    resizeMode="contain"
                    style={[
                      styles.thumbIcon,
                      selectedThumb === "up" && styles.selectedThumbIcon,
                    ]}
                    source={require("../../assets/iconimages/ThumbsUp.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.thumbButton}
                  onPress={handleThumbsDown}
                >
                  <FastImage
                    resizeMode="contain"
                    style={[
                      styles.thumbIcon,
                      selectedThumb === "down" && styles.selectedThumbIcon,
                    ]}
                    source={require("../../assets/iconimages/ThumbsDown.png")}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
          {showTextInput && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.title}>
                What can we do to improve your experience?
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Please enter your feedback."
                value={feedback}
                onChangeText={setFeedback}
              />
              <TouchableOpacity
                onPress={handleSubmitFeedback}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
          {!showTextInput && (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipButton}>Skip For Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    height: "40%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    marginBottom: 25,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "60%",
    marginBottom: 20,
  },
  thumbButton: {
    borderColor: "#F9B5C6",
    borderWidth: 2,
    backgroundColor: "#FDEDF1",
    padding: 20,
    borderRadius: 10,
  },
  thumbIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  selectedThumbIcon: {
    tintColor: "#D90368",
    borderWidth: 0, // Reset border when selected
  },
  feedbackContainer: {
    width: "90%",
    height: "50%",
    color: "white",
  },
  textInput: {
    width: "100%",
    padding: 10,
    borderColor: "#F9FAFB",
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#D90368",
    borderRadius: 10,
    alignItems: "center",
    width: "75%",
    height: "40%",
    marginHorizontal: 50,
    top: 30,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    padding: 20,
    textAlign: "center",
  },
  skipButton: {
    color: "#D90368",
    marginTop: 20,
    textAlign: "center",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#EBECEF",
    padding: 20,
  },
});

export default FeedbackModal;
