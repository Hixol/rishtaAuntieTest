import React, { useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnBoardingServices, UserService } from "../../services";
import { useHelper } from "../../hooks/useHelper";

import styles from "./styles";
import colors from "../../utility/colors";
import SettingHeader from "../../components/containers/settingHeader";
import FastImage from "react-native-fast-image";

const EditProfileScreen = props => {
  const dispatch = useDispatch();
  const {} = useHelper();
  const { userData } = useSelector(store => store.userReducer);

  const changeOption = [
    {
      id: 1,
      preferenceName: "Change discover video",
      type: "video",
      screen: true,
      screenName: "UploadVideo",
    },
    {
      id: 2,
      preferenceName: "Change profile picture",
      type: "profilePicture",
      screen: true,
      screenName: "UploadPicture",
    },
  ];
  const EditOption = [
    {
      id: 1,
      preferenceName: "Tagline",
      type: "Tagline",
      index: 19,
      ask: "Write something witty to introduce yourself",
    },
    {
      id: 2,
      preferenceName: "Edit my vibes",
      type: "Main Vibes",
      index: 0,
      ask: "What are your vibes?",
      line: "Share your essence with others by selecting 8 vibes.",
    },
    {
      id: 3,
      preferenceName: "Change profile prompts",
      type: "Prompts Pool",
      ask: "Spark conversations",
      line: "Share yourself with 3 prompts.",
      //   value: profilePrompts,
    },
  ];
  const EditOptions = [
    {
      id: 1,
      preferenceName: "First name",
      type: "FirstName",
      screen: true,
      screenName: "FullNameScreen",
      //   value: userData?.firstName,
    },
    // {
    //   id: 19,
    //   preferenceName: 'Height',
    //   type: 'Height',
    //   ask: 'What’s your height?',
    // },
    {
      id: 2,
      preferenceName: "Family Origin",
      type: "Family Origin",
      ask: "What is your family origin?",
      //   value: userData?.Profile?.familyOrigin,
    },
    {
      id: 3,
      preferenceName: "Community",
      type: "Community",
      ask: "What is your community?",
      //   value: userData?.Profile?.community,
    },
    {
      id: 4,
      preferenceName: "Languages",
      type: "Languages",
      ask: "What is your language?",
      //   value: userData?.UserLanguages,
    },
    {
      id: 5,
      preferenceName: "Religion",
      type: "Religion",
      screen: true,
      screenName: "ReligionScreen",
      //   value: userData?.Profile?.religion,
    },
    {
      id: 6,
      preferenceName: "Denomination",
      type: "Denomination",
      ask: "What is your denomination?",
      //   value: userData?.Profile?.denomination,
    },
    {
      id: 7,
      preferenceName: "Education Level",
      type: "Education Level",
      ask: "What is your education level?",
      //   value: userData?.Profile?.education,
    },
    // {
    //   id: 8,
    //   preferenceName: 'College/University',
    //   type: 'College/University',
    //   value: userData?.Profile?.school,
    // },
    {
      id: 9,
      preferenceName: "Occupation",
      type: "Occupation",
      ask: "What is your occupation?",
      //   value: userData?.Profile?.occupation,
    },
    {
      id: 10,
      preferenceName: "Practicing Level",
      type: "Practicing Level",
      ask: "What is your practicing level?",
      //   value: userData?.Profile?.practiceLevel,
    },

    {
      id: 11,
      preferenceName: "Do you pray?",
      type: "Pray",
      ask: "How often do you pray?",
      //   value: userData?.Profile?.iPray,
    },
    {
      id: 12,
      preferenceName: "Do you drink?",
      type: "Drink",
      ask: "Do you drink?",
      //   value: userData?.Profile?.iDrink,
    },
    {
      id: 13,
      preferenceName: "Do you smoke?",
      type: "Smoke",
      ask: "Do you smoke?",
      //   value: userData?.UserSmokes,
    },
    {
      id: 14,
      preferenceName: "What are your diet choices?",
      type: "Diet",
      ask: "What are your diet choices?",
      //   value: userData?.UserDietChoices,
    },
    {
      id: 15,
      preferenceName: "Marital history",
      type: "Marital History",
      ask: "Marital history",
      //   value: userData?.Profile?.maritalHistory,
    },
    {
      id: 16,
      preferenceName: "Marriage timeline",
      type: "Marriage Timeline",
      ask: "When do you want to get married?",
      //   value: userData?.Profile?.maritalHistory,
    },
    {
      id: 17,
      preferenceName: "Do you have kids?",
      type: "Have Kids",
      ask: "Do you have kids?",
      //   value: userData?.Profile?.haveKids,
    },
    {
      id: 18,
      preferenceName: "Do you want kids?",
      type: "Want Kids",
      ask: "Do you want kids?",
      //   value: userData?.Profile?.wantKids,
    },
    {
      id: 19,
      preferenceName: "Are you willing to relocate?",
      type: "Relocate",
      ask: "Are you willing to relocate?",
      //   value: userData?.Profile?.willingToRelocate,
    },
  ];

  useEffect(() => {
    OnBoardingServices.vibesListing()
      .then(res => {
        if (res.status >= 200 && res.status <= 299) {
          let sortedData = res?.data?.data
            .map(x => ({ name: x?.name, id: x?.id }))
            .sort((a, b) => {
              if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
              if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              return 0;
            });

          dispatch({
            type: "allVibes",
            payload: sortedData,
          });

          UserService.getQuestions()
            .then(res => {
              if (res.status >= 200 && res.status <= 299) {
                let sortedData = res.data.data.sort((a, b) => {
                  if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                  if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                  return 0;
                });

                dispatch({
                  type: "allPrompts",
                  payload: sortedData,
                });
              }
            })
            .catch(err => console.log("getQuestions err", err));
        }
      })
      .catch(err => console.log("vibesListing err", err));

    OnBoardingServices.profileValues(
      encodeURI(
        JSON.stringify([
          "college",
          "community",
          "denomination",
          "familyOrigin",
          "language",
          "occupation",
        ])
      )
    )
      .then(async res => {
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: "allProfileValues",
            payload: res?.data?.data,
          });
        }
      })
      .catch(err => console.log("profileValues err", err))
      .finally(() => {});
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white, padding: 20 }}
    >
      <SettingHeader
        backPress={() => props.navigation.goBack()}
        screenTitle={"Edit Profile"}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.actionItemsView}>
          {changeOption.map((i, index, array) => {
            return (
              <>
                <TouchableOpacity
                  key={i.id}
                  onPress={() =>
                    props.navigation.navigate(i?.screenName, {
                      edit: true,
                      index: i?.index,
                      type: i?.type,
                      ask: i?.ask,
                    })
                  }
                  style={[styles.detailsView]}
                >
                  <Text style={styles.detailTxt}>{i.preferenceName}</Text>
                  <FastImage
                    resizeMode="contain"
                    style={{ width: 14, height: 18 }}
                    source={require("../../assets/iconimages/settingarrow.png")}
                  />
                </TouchableOpacity>
                {index === array?.length - 1 ? null : (
                  <View style={styles.horizontalLine}></View>
                )}
              </>
            );
          })}
        </View>
        <View style={styles.actionItemsView}>
          {EditOption.map((i, index, array) => {
            return (
              <>
                <TouchableOpacity
                  key={i.id}
                  onPress={() =>
                    props.navigation.navigate("EditScreenSetting", {
                      edit: true,
                      index: i?.index,
                      type: i?.type,
                      ask: i?.ask,
                      line: i?.line,
                    })
                  }
                  style={[styles.detailsView]}
                >
                  <Text style={styles.detailTxt}>{i?.preferenceName}</Text>
                  <FastImage
                    resizeMode="contain"
                    style={{ width: 14, height: 18 }}
                    source={require("../../assets/iconimages/settingarrow.png")}
                  />
                </TouchableOpacity>
                {index === array?.length - 1 ? null : (
                  <View style={styles.horizontalLine}></View>
                )}
              </>
            );
          })}
        </View>
        <View style={styles.actionItemsView}>
          {EditOptions.map((i, index, array) => {
            return (
              <>
                <TouchableOpacity
                  key={i.id}
                  onPress={() => {
                    if (i?.screen) {
                      props.navigation?.navigate(i?.screenName, {
                        edit: true,
                      });
                    } else {
                      props.navigation.navigate("EditScreenSetting", {
                        edit: true,
                        index: i?.index,
                        type: i?.type,
                        ask: i?.ask,
                      });
                    }
                  }}
                  style={[styles.detailsView]}
                >
                  <Text style={styles.detailTxt}>{i.preferenceName}</Text>
                  <FastImage
                    resizeMode="contain"
                    style={{ width: 14, height: 18 }}
                    source={require("../../assets/iconimages/settingarrow.png")}
                  />
                </TouchableOpacity>
                {index === array?.length - 1 ? null : (
                  <View style={styles.horizontalLine}></View>
                )}
              </>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default EditProfileScreen;
