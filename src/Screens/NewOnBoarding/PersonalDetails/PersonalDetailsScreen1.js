import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { alerts } from "../../../utility/regex";

import moment from "moment";
import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import CustomTextInput from "../../../components/Textinput";
import BottomButton from "../../../components/buttons/BottomButton";

const PersonalDetailsScreen1 = ({ navigation, route }) => {
  const { firstName, lastName, dob, gender } = useSelector(
    (store) => store.NewOnBoardingReducer
  );
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [gender1, setGender1] = useState("");
  const [dateofBirth, setDateofBirth] = useState("");
  const [age, setAge] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      dispatch({
        type: "routeName",
        payload: route?.name,
      });
      if (firstName && lastName) {
        setFullName(firstName + " " + lastName);
      }

      setGender1(gender);
      if (dob !== null) {
        setDateofBirth(moment(dob).format("MMM DD YYYY"));
      }
    }, [gender, firstName, lastName, dob])
  );

  const ContinueButton = () => {
    if (
      gender1 === "" ||
      dateofBirth === "" ||
      dateofBirth === null ||
      lastName === ""
    ) {
      alerts("error", "Please enter all the fields");
    } else {
      navigation.navigate("UploadSelfie");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 20, backgroundColor: colors.white }}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "WelcomeScreen" }],
          })
        }
      >
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../../../assets/iconimages/back-arrow-blue.png")}
        />
      </TouchableOpacity>
      <View style={{ marginTop: "8%" }}>
        <Text style={styles.heading}>Personal Details</Text>
        <Text style={styles.lightText}>
          This info helps us to find some Great Match for you!
        </Text>
        <View style={{ width: "100%", marginVertical: "5%" }}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate("FullNameScreen")}
          style={{
            width: "100%",
            marginVertical: "3%",
            flexDirection: "row",
            backgroundColor: "#F9FAFB",
            alignItems: "center",
            padding: "5%",
          }}
        >
          <FastImage
            resizeMode="contain"
            style={{ width: 25, height: 25 }}
            source={require("../../../assets/iconimages/personicon.png")}
          />
          <Text
            style={{
              fontSize: 18,
              marginLeft: "2%",
              color: fullName ? colors.black : "#9CA3AF",
            }}
          >
            {fullName ? fullName : "Full Name"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("DobScreen")}
          style={{
            width: "100%",
            marginVertical: "3%",
            flexDirection: "row",
            backgroundColor: "#F9FAFB",
            alignItems: "center",
            padding: "5%",
          }}
        >
          <FastImage
            resizeMode="contain"
            style={{ width: 25, height: 25 }}
            source={require("../../../assets/iconimages/personicon.png")}
          />
          <Text
            style={{
              fontSize: 18,
              marginLeft: "2%",
              color: dateofBirth ? colors.black : "#9CA3AF",
            }}
          >
            {dateofBirth ? dateofBirth : "Date of Birth"}
          </Text>
          {/* <CustomTextInput
            leftIcon={require('../../../assets/iconimages/calendaricon.png')}
            value={dateofBirth}
            onChangeText={text => setAge(text)}
            placeholder="Date of Birth"
            editable={true}
          /> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("GenderScreen")}>
          <CustomTextInput
            leftIcon={require("../../../assets/iconimages/gendericon.png")}
            value={gender1}
            onChangeText={(text) => setGender1(text)}
            placeholder="Gender"
            editable={true}
          />
        </TouchableOpacity>
      </View>

      <BottomButton onPress={() => ContinueButton()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: { fontFamily: "Inter-Bold", fontSize: 25, color: colors.black },
  lightText: {
    fontFamily: "Inter-Light",
    fontSize: 15,
    marginTop: "3%",
    color: colors.textGrey,
  },
});

export default PersonalDetailsScreen1;
