import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FastImage from "react-native-fast-image";
import colors from "../../../utility/colors";
import analytics from "@react-native-firebase/analytics";

const PersonalityQuizNew = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.replace("BottomTab", {
              screen: "Discover",
            })
          }
        >
          <FastImage
            resizeMode="contain"
            style={{ width: 20, height: 30 }}
            source={require("../../../assets/iconimages/back-arrow-blue.png")}
          />
        </TouchableOpacity>
        <FastImage
          resizeMode="contain"
          style={{ width: 40, height: 50 }}
          source={require("../../../assets/iconimages/shortLogo.png")}
        />
        <View style={{ width: 20, height: 30 }}></View>
      </View>
      <Text style={{ color: "#111827", fontSize: 18, marginTop: "25%" }}>
        Time for the Rishta Auntie personality quiz!
      </Text>
      <Text
        style={{
          color: "#6B7280",
          fontSize: 18,
          marginTop: "3%",
          maxWidth: "80%",
        }}
      >
        This will help me learn more about you and give suggestions about
        potential matches
      </Text>
      <FastImage
        resizeMode="contain"
        style={{
          width: "70%",
          height: "40%",
          alignSelf: "center",
          marginTop: "10%",
        }}
        source={require("../../../assets/iconimages/PersonalityBrain.png")}
      />
      <TouchableOpacity
        onPress={async () => {
          // Log the analytics event
          await analytics().logEvent("personality_quiz_button_pressed", {
            description: "User pressed Rishta Auntie Personality Quiz button",
          });

          // Navigate to the PersonalityQuiz screen
          navigation.navigate("PersonalityQuiz");
        }}
        style={{
          paddingVertical: "5%",
          backgroundColor: colors.primaryPink,
          alignSelf: "center",
          marginTop: "5%",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: "5%",
        }}
      >
        <Text style={{ color: colors.white, fontSize: 20 }}>
          Rishta Auntie Personality Quiz
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          // Log the analytics event
          await analytics().logEvent("skip_now_button_pressed", {
            description: "User pressed Skip for Now button",
          });

          // Navigate to the Settings screen
          navigation.navigate("BottomTab", {
            screen: "Settings",
          });
        }}
        style={{
          paddingVertical: "3%",
          alignSelf: "center",
          marginTop: "3%",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: "5%",
          borderWidth: 1,
          borderColor: "#EBECEF",
        }}
      >
        <Text style={{ color: colors.primaryPink, fontSize: 18 }}>
          Skip for Now
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default PersonalityQuizNew;
