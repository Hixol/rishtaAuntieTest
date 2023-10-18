import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useHelper } from "../../hooks/useHelper";
import { UserService } from "../../services";
import { windowHeight } from "../../utility/size";

import moment from "moment";
import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";
import ImageCard from "../../components/Cards/ImageCard";
import BottomButton from "../../components/buttons/BottomButton";
import Countries from "../../assets/countryLists/Countries";

const ProfilePicturesScreen = ({ navigation }) => {
  const { coords } = useSelector((store) => store.chatReducer);
  const { token } = useSelector((store) => store.userReducer);
  const dispatch = useDispatch();
  const { firstName, lastName, dob, gender, selfie, picture, video, religion } =
    useSelector((store) => store.NewOnBoardingReducer);
  const { handleLocation, Alerts } = useHelper();
  const [loading, setLoading] = useState(false);

  const [profilePicArr, setProfilePicArr] = useState([
    {
      index: 0,
      title: "Main profile pic",
      profile: true,
      selected: false,
      key: "one",
    },
    {
      index: 1,
      profile: true,
      selected: false,
      key: "two",
    },
    {
      index: 2,
      profile: true,
      selected: false,
      key: "three",
    },
    {
      index: 3,
      profile: true,
      selected: false,
      key: "four",
    },
    {
      index: 4,
      profile: true,
      selected: false,
      key: "five",
    },
    {
      index: 5,
      profile: true,
      selected: false,
      key: "six",
    },
  ]);
  const handleOnSelect = (item) => {
    if (item?.uri) {
      let dummyArr = [...profilePicArr];
      dummyArr[item.index]["image"] = item;
      setProfilePicArr(dummyArr);
    } else {
      // setSelectedVibes(item);
    }
  };

  const handleOnRemove = (index) => {
    let dummyArr = [...profilePicArr];
    dummyArr[index]["image"] = null;
    setProfilePicArr(dummyArr);
  };

  const completeProfile = () => {
    if (coords.city == "" && coords.state == "" && coords.country == "") {
      Alerts(
        "error",
        "Please enable location and open google maps to sync location!"
      );
      handleLocation();
    } else {
      setLoading(true);
      handleLocation();

      let code = Countries.filter((item) => {
        return item?.en === coords.country;
      });
      code = code[0]?.dialCode;

      let formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("dob", moment(dob).format("YYYY-MM-DD"));
      formData.append("longitude", coords.lat);
      formData.append("latitude", coords.lng);
      formData.append("city", coords.city);
      formData.append("country", coords.country);
      formData.append("countryCode", code);
      formData.append("address", coords.state);
      formData.append("gender", gender);
      formData.append("religion", religion?.name);
      formData.append("verificationPicture", selfie);
      formData.append("intoVideo", video);

      profilePicArr.map((x, index) => {
        if (x?.image) {
          formData.append(`profilePic${index + 1}`, {
            name: x?.image?.name,
            type: x?.image.type,
            uri: x?.image?.uri,
          });
        }
      });

      if (token !== null) {
        UserService.createNewProfile(formData, token)
          .then((res) => {
            dispatch({
              type: "AUTH_USER_STATUS",
              payload: "COMPLETED",
            });
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "BottomTab" }],
              })
            );
            Alerts("success", res.data.message);
          })
          .catch((e) => {
            console.log("e", e);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../../assets/iconimages/back-arrow-blue.png")}
        />
      </TouchableOpacity>
      <View style={{ marginTop: "8%" }}>
        <Text style={styles.heading}>Profile Picture</Text>
        <Text style={styles.lightText}>
          Select photos for your Rishta Auntie profile
        </Text>
      </View>
      <View
        style={{
          marginTop: 7,
          flexDirection: "row",
          flexWrap: "wrap",
          height: 300,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageCard
          imageAbsolute={{
            right: 10,
            height: windowHeight * 0.025,
            width: windowHeight * 0.025,
            marginTop: "2%",
          }}
          // actualImage={{width: '90%', borderRadius: 10, marginTop: '10%'}}
          onPress
          selectedItem={handleOnSelect}
          handleOnRemove={handleOnRemove}
          profilePicArr={profilePicArr}
          setProfilePicArr={setProfilePicArr}
          txt="Main profile pic"
          profile={true}
        />
      </View>
      <BottomButton
        loading={loading}
        text={"Create Profile"}
        onPress={() => completeProfile()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: { fontFamily: "Roboto-Bold", fontSize: 25, color: colors.black },
  lightText: {
    fontFamily: "Roboto-Light",
    fontSize: 15,
    marginTop: "3%",
    color: colors.textGrey,
  },
});

export default ProfilePicturesScreen;
