import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { OnBoardingServices, UserService } from "../../services";
import { useHelper } from "../../hooks/useHelper";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { alerts } from "../../utility/regex";
import ProfileServices from "../../services/ProfileServices";
import styles from "./styles";
import colors from "../../utility/colors";
import PrivacySettingContainer from "../../components/containers/PrivacySettingContainer";
import BasicPrivacySetting from "../../components/containers/BasicPrivacySetting";
import Button from "../../components/buttons/Button";
import SettingHeader from "../../components/containers/settingHeader";
import analytics from '@react-native-firebase/analytics'; // Import Firebase Analytics

const SearchPreferences = props => {
  const isFocused = useIsFocused();
  const value = props?.route?.params?.preferences;

  const dispatch = useDispatch();
  const { handleDisablePremium, handleStatusCode } = useHelper();
  const { token, userData } = useSelector(store => store.userReducer);

  const [premiumPrivacySetting, setPremiumPrivacySetting] = useState(
    userData?.UserSetting?.isSubscribed
  );

  const BasicPreferences = [
    {
      id: 1,
      preferenceName: "Distance",
      type: "Distance",
      value: value?.distance,
      editType: "Distance",
      ask: "Find matches closer or farther away",
      line: "Set your preferred distance",
    },
    {
      id: 2,
      preferenceName: "Age",
      type: "Age",
      value: [value?.ageFrom, value?.ageTo],
      editType: "Age",
      ask: "Discover matches in your preferred age group",
      line: "Select desired age range",
    },
    {
      id: 3,
      preferenceName: "Religion",
      type: "Religion",
      value: value?.religion,
      editType: "Religion",
      screenName: "ReligionScreen",
      screen: true,
      placeholder: "Search religions",
      ask: "Find matches with similar religious views",
      line: "Set your preferred distance",
    },
    {
      id: 4,
      preferenceName: "Family Origin",
      type: "Origin",
      value: value?.familyOrigin,
      editType: "Family Origin",
      placeholder: "Search countries",
      ask: "Embrace a variety of family origins",
      line: "Explore diverse family origins",
    },
  ];

  const PremiumPreferences = [
    {
      id: 1,
      preferenceName: "Height",
      type: "Height",
      value: [value?.heightFrom, value?.heightTo],
      editType: "Height",
      ask: "Find matches based on height compatibility",
      line: "Specify preferred height range",
    },
    {
      id: 2,
      preferenceName: "Community",
      type: "Community",
      value: value?.community,
      editType: "Community",
      placeholder: "Search communities",
      ask: "Find matches from various communities",
      line: "Embrace diverse communities",
    },
    {
      id: 3,
      preferenceName: "Languages",
      type: "Languages",
      value: value?.languagesSpoken,
      editType: "Languages",
      placeholder: "Search languages",
      ask: "Connect with matches who speak your language",
      line: "Explore multilingual connections",
    },
    {
      id: 4,
      preferenceName: "Religious Denomination",
      type: "Religious",
      value: value?.religiousDenomination,
      editType: "Denomination",
      placeholder: "Search religious denominations",
      ask: "Find matches with matching faith traditions",
      line: "Match based on religious denomination",
    },
    {
      id: 5,
      preferenceName: "Do they pray?",
      type: "Pray",
      value: value?.theyPray,
      editType: "Pray",
      ask: "Connect with matches who share your spiritual practices",
      line: "Match your prayer habits",
    },
    {
      id: 6,
      preferenceName: "Do they drink?",
      type: "Drink",
      value: value?.drinking,
      editType: "Drink",
      ask: "Match with those who share your attitude towards alcohol",
      line: "Specify drinking preferences",
    },
    {
      id: 7,
      preferenceName: "Do they smoke?",
      type: "Smoke",
      value: value?.smoking,
      editType: "Smoke",
      ask: "Connect with matches who match your smoking habits",
      line: "Set smoking preferences",
    },
    {
      id: 8,
      preferenceName: "What are their diet choices?",
      type: "Diet",
      value: value?.dietChoices,
      editType: "Diet",
      ask: "Connect with matches who share your dietary lifestyle?",
      line: "Define diet preferences",
    },
    {
      id: 9,
      preferenceName: "Marital history",
      type: "Marital",
      value: value?.maritalHistory,
      editType: "Marital History",
      ask: "Connect with matches based on their marital background",
      line: "Choose marital history preferences",
    },
    {
      id: 10,
      preferenceName: "Do they have kids?",
      type: "HaveKids",
      value: value?.hasKids,
      editType: "Have Kids",
      ask: "Match with those who have kids",
      line: "Preferences regarding children",
    },
    {
      id: 11,
      preferenceName: "Do they want kids?",
      type: "WantKids",
      value: value?.wantKids,
      editType: "Want Kids",
      ask: "Connect with those who share your family plans",
      line: "Desire for future children",
    },
    {
      id: 12,
      preferenceName: "Are they willing to relocate?",
      type: "Relocate",
      value: value?.willingToRelocate,
      editType: "Relocate",
      ask: "Connect with those who are willing to relocate",
      line: "Openness to relocation",
    },
  ];

  const resetFeature = () => {
    UserService.applyReset(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          // Analytics logging
          analytics().logEvent('reset_feature', {
            screen: 'SearchPreferences',
            result: 'success'
          });
        }
      })
      .catch(err => {
        console.log("applyReset err:", err);
        // Analytics logging
        analytics().logEvent('reset_feature', {
          screen: 'SearchPreferences',
          result: 'error',
          error: err.message
        });
      });
  };

  const handleUpgrade = () => {
    if (!premiumPrivacySetting) {
      props.navigation.navigate("Paywall");
    }
  };

  useEffect(() => {
    // Track screen view
    analytics().logScreenView({
      screen_name: 'SearchPreferences',
      screen_class: 'SearchPreferences',
    });

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
      .finally(() => { });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (token != null) {
        setPremiumPrivacySetting(userData?.UserSetting?.isSubscribed);
        ProfileServices.getMyProfile(token).then(res => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            let data = res?.data?.data;

            dispatch({
              type: "AUTH_USER",
              payload: data,
            });
          }
        });
      } else {
        alerts("error", "Your token has expired. Please login again.");
      }
    }, [isFocused])
  );

  const handleClearPref = type => {
    let body = {};
    if (type === "basic") {
      body = {
        distance: "unlimited",
        ageFrom: 18,
        ageTo: 68,
        religion: null,
        familyOrigin: null,
        heightFrom: userData?.UserPreference?.heightFrom,
        heightTo: userData?.UserPreference?.heightTo,
        community: userData?.UserPreference?.community,
        languagesSpoken: userData?.UserPreference?.languagesSpoken,
        religiousDenomination: userData?.UserPreference?.religiousDenomination,
        theyPray: userData?.UserPreference?.theyPray,
        drinking: userData?.UserPreference?.drinking,
        smoking: userData?.UserPreference?.smoking,
        dietChoices: userData?.UserPreference?.dietChoices,
        maritalHistory: userData?.UserPreference?.maritalHistory,
        haveKids: userData?.UserPreference?.haveKids,
        wantKids: userData?.UserPreference?.wantKids,
        willingToRelocate: userData?.UserPreference?.willingToRelocate,
      };
    } else {
      body = {
        distance: userData?.UserPreference?.distance
          ? userData?.UserPreference?.distance
          : "unlimited",
        ageFrom: userData?.UserPreference?.ageFrom,
        ageTo: userData?.UserPreference?.ageTo,
        religion: userData?.UserPreference?.religion,
        familyOrigin: userData?.UserPreference?.familyOrigin,
        heightFrom: 0,
        heightTo: 0,
        community: null,
        languagesSpoken: null,
        religiousDenomination: null,
        theyPray: null,
        drinking: null,
        smoking: null,
        dietChoices: null,
        maritalHistory: null,
        haveKids: null,
        wantKids: null,
        willingToRelocate: null,
      };
    }

    UserService.searchUserPreference(body, token)
      .then(res => {
        handleStatusCode(res);
        if (res.data.status === 200 || res.data.status === 201) {
          alerts("success", res.data.message);

          dispatch({
            type: "SET_PREFERENCE_FILTER",
            payload: true,
          });

          // Analytics logging
          analytics().logEvent('clear_preferences', {
            screen: 'SearchPreferences',
            type,
            result: 'success'
          });
        }
      })
      .catch(err => {
        console.log("clearPreference err", err);
        // Analytics logging
        analytics().logEvent('clear_preferences', {
          screen: 'SearchPreferences',
          type,
          result: 'error',
          error: err.message
        });
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white, padding: 20 }}
    >
      <SettingHeader
        backPress={() => props.navigation.goBack()}
        screenTitle={"Search preferences"}
      />
      {/* 
      <TouchableOpacity onPress={resetFeature}>
        <Text style={[styles.basicPreferenceType, {marginBottom: '5%'}]}>
          Reset
        </Text>
      </TouchableOpacity> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.preferenceRow}>
          <Text style={styles.basicPreferenceType}>Basic Preferences</Text>
          <Text
            onPress={() => handleClearPref("basic")}
            style={styles.clearTxt}
          >
            Clear all
          </Text>
        </View>
        <View style={styles.actionItemsView}>
          <View style={{ marginVertical: "2%" }}>
            {BasicPreferences.map((i, index, array) => {
              return (
                <View key={i.id}>
                  <BasicPrivacySetting
                    arrowIcononPress={() =>
                      i?.screen
                        ? props.navigation.navigate(i?.screenName, {
                          preferenceEdit: true,
                          index: i?.index,
                          type: i?.type,
                          placeholder: i?.placeholder,
                        })
                        : props.navigation.navigate("EditScreenSetting", {
                          preferenceEdit: true,
                          index: i?.index,
                          type: i?.editType,
                          placeholder: i?.placeholder,
                          ask: i?.ask,
                          line: i?.line,
                        })
                    }
                    arrowIcon
                    contStyle={styles.privacySettingStyle}
                    toggleOptionTextStyle={{
                      color: "#374151",
                      fontSize: 14,
                      fontFamily: "Inter-Medium",
                    }}
                    toggleOptionText={i.preferenceName}
                    toggleViewStyle={{ paddingBottom: "2%" }}
                  />
                  {index === array?.length - 1 ? null : (
                    <View style={styles.horizontalLine}></View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.preferenceRow}>
          <Text style={styles.basicPreferenceType}>Gold Preferences</Text>
          <Text
            onPress={() => premiumPrivacySetting && handleClearPref("premium")} // Ensure handleClearPref is called only if premiumPrivacySetting is true
            style={[
              styles.clearTxt,
              {
                color: premiumPrivacySetting ? "#D90368" : colors.textGrey, // Change color based on premium status
                opacity: premiumPrivacySetting ? 1 : 0.5, // Dull button when not premium
              },
            ]}
          >
            Clear all
          </Text>
        </View>
        {premiumPrivacySetting === false ? (
          <TouchableOpacity
            onPress={handleUpgrade}
            style={styles.enableDisableButton}
          >
            <Text style={{ fontSize: 15, color: colors.white }}>
              Upgrade now to use Gold preferences
            </Text>
          </TouchableOpacity>
        ) : null}
        <View style={[styles.actionItemsView, { marginBottom: "10%" }]}>
          {PremiumPreferences.map((i, index, array) => {
            return (
              <View key={i.id}>
                <PrivacySettingContainer
                  imageRequire={
                    premiumPrivacySetting
                      ? require("../../assets/iconimages/settingarrow.png")
                      : require("../../assets/iconimages/settingarrow.png")
                  }
                  arrowIcononPress={
                    () =>
                      props.navigation.navigate("EditScreenSetting", {
                        preferenceEdit: true,
                        index: i?.index,
                        type: i?.editType,
                        placeholder: i?.placeholder,
                        ask: i?.ask,
                        line: i?.line,
                      })
                  }
                  disabled={premiumPrivacySetting ? false : true}
                  isEnabled={premiumPrivacySetting ? true : false}
                  arrowIcon
                  toggleOptionTextStyle={{
                    color: premiumPrivacySetting
                      ? "#374151"
                      : colors.PremiumGrey,
                    fontSize: 14,
                    fontFamily: "Inter-Medium",
                  }}
                  toggleOptionText={i.preferenceName}
                  toggleViewStyle={{ paddingBottom: "2%" }}
                />
                {index === array?.length - 1 ? null : (
                  <View style={styles.horizontalLine}></View>
                )}
              </View>
            );
          })}
        </View>
        {/* <View style={{marginBottom: '20%'}}>
          <Button YesNoBtn title={'Save'} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Inter-Medium',
              color: colors.primaryPink,
              alignSelf: 'center',
              marginVertical: '3%',
            }}>
            Need help?
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchPreferences;
