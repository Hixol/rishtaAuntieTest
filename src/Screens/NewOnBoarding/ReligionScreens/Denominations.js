import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
  Animated,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useHelper } from "../../../hooks/useHelper";
import BottomButton from "../../../components/buttons/BottomButton";
import OnBoardingSearch from "../../../components/OnBoardingSearch";
import NewOnBoardingDesign from "../../../components/NewOnBoardingDesign";
import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

const Denominations = ({ navigation, route }) => {
  const { updateUser, updateUserPreference } = useHelper();
  const { userData, token } = useSelector(store => store.userReducer);
  const { allProfileValues } = useSelector(store => store.NewOnBoardingReducer);
  //   const { edit, preferenceEdit, type } = route?.params;
  let edit = route?.params?.edit;
  console.log(allProfileValues);
  // let preferenceEdit = route?.params?.preferenceEdit;
  let type = route?.params?.type;
  const { religions } = route.params;

  // const [currentIndex, setCurrentIndex] = useState(0);
  const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
  const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
  const scrollIndicator = useRef(new Animated.Value(0)).current;
  const [selectedDenomination, setSelectedDenomination] = useState(null);
  const dispatch = useDispatch();
  const { denomination } = useSelector(store => store.NewOnBoardingReducer);
  console.log("value ======", denomination);

  // const [searchValue, setSearchValue] = useState("");
  // const [array, setArray] = useState([
  //   {
  //     id: 1,
  //     type: "Denomination",
  //     question: `Find matches with matching faith traditions?`,
  //     ask: "Match based on religious denomination",
  //     options: [],
  //     search: true,
  //     multiSelect: false,
  //   },
  // ]);
  const scrollIndicatorSize =
    completeScrollBarHeight > visibleScrollBarHeight
      ? (visibleScrollBarHeight * visibleScrollBarHeight) /
        completeScrollBarHeight
      : visibleScrollBarHeight;

  const difference =
    visibleScrollBarHeight > scrollIndicatorSize
      ? visibleScrollBarHeight - scrollIndicatorSize
      : 1;

  const scrollIndicatorPosition = Animated.multiply(
    scrollIndicator,
    visibleScrollBarHeight / completeScrollBarHeight
  ).interpolate({
    extrapolate: "clamp",
    inputRange: [0, difference],
    outputRange: [0, difference],
  });

  const onContentSizeChange = (_, contentHeight) =>
    setCompleteScrollBarHeight(contentHeight);

  const onLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }) => {
    setVisibleScrollBarHeight(height);
  };

  // useEffect(() => {
  //   let arr = [];
  //   if (
  //     userData?.UserPreference &&
  //     Array.isArray(userData?.UserPreference?.religiousDenomination)
  //   ) {
  //     userData?.UserPreference?.religiousDenomination.forEach(el => {
  //       console.log("el", typeof el);
  //       arr.push({ name: el });
  //     });
  //     setSelectedDenomination(arr);
  //   } else {
  //     arr = {
  //       ...arr,
  //       name: userData?.Profile?.denomination,
  //     };

  //     setSelectedDenomination([arr]);
  //   }
  // }, [userData]);

  useEffect(() => {
    setSelectedDenomination([{ name: userData?.Profile?.denomination }]);
  }, []);

  const selectDenomination = item => {
    setSelectedDenomination([item]); // Update local state
    console.log("Selected denomination:", item);
    // Use `item` directly here
    dispatch({
      type: "denomination",
      payload: item,
    });
    console.log("TTTTTTTTT", item.name);
  };

  useEffect(() => {
    console.log("Redux State Denomination:", denomination);
  }, [denomination]);

  // useEffect(() => {
  //   if (denomination) {
  //     setSelectedDenomination(denomination);
  //   }
  // }, []);
  const updateProfile = async () => {
    console.log("Executed", selectedDenomination);

    // dispatch({
    //   type: "denomination",
    //   payload:
    //     selectDenomination === null ? denomination : selectedDenomination.name,
    // });
    if (selectedDenomination.length > 0) {
      try {
        // Save the selected denominations to user's profile/preferences
        let denArr = selectedDenomination.map(el => el.name);

        let formData = new FormData();

        formData.append(
          "denomination",
          JSON.stringify(selectedDenomination.name)
        );

        if (edit) {
          // If editing, update the user's denominations
          await updateUser(formData, token);
        }

        // Navigate to the previous screen
        navigation.goBack();

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "User profile updated successfully",
        });
      } catch (error) {
        console.error("Error updating user preference:", error);
        // Show an error toast if there's an issue updating preferences
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to update preferences",
        });
      }
    } else {
      // Handle case when no denomination is selected
      // For example: Show an alert or prompt the user to select a denomination
      // You can customize this part based on your app's requirements
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a denomination",
      });
    }
  };

  // console.log("DEnomination", allProfileValues?.denomination);
  // console.log("DEnomination2", religions);

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.white,
          bottom: 10,
        }}
      >
        {/* <ActivityIndicator size={"large"} color={colors.primaryPink} /> */}
      </View>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            paddingLeft: 20,
            top: "2%",
          }}
        >
          <FastImage
            resizeMode="contain"
            style={{ width: 20, height: 30 }}
            source={require("../../../assets/iconimages/arrow-back.png")}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.ask}>Match based on religious denomination</Text>
          <Text style={styles.question}>
            Find matches with matching faith traditions
          </Text>
        </View>
        <View style={{ height: "95%", width: "95%" }}>
          {/* {type === "Denomination" ( */}
          <View style={styles.scrollContainer}>
            <View style={{ height: "95%", width: "95%" }}>
              {selectedDenomination !== null && (
                <View style={styles.scrollContainer}>
                  <View style={{ height: "100%", width: "110%" }}>
                    <ScrollView
                      onContentSizeChange={onContentSizeChange}
                      onLayout={onLayout}
                      onScroll={Animated.event(
                        [
                          {
                            nativeEvent: {
                              contentOffset: { y: scrollIndicator },
                            },
                          },
                        ],
                        { useNativeDriver: false }
                      )}
                      scrollEventThrottle={16}
                      showsVerticalScrollIndicator={false}
                      style={{ marginVertical: "5%" }}
                    >
                      {userData?.Profile?.religion !== undefined &&
                        allProfileValues?.denomination[
                          userData?.Profile?.religion
                        ]?.length > 0 &&
                        allProfileValues?.denomination[
                          userData?.Profile?.religion
                        ].map((item, index) => {
                          let findIndex = selectedDenomination.map(newItem => {
                            return allProfileValues?.denomination[
                              userData?.Profile?.religion
                            ].findIndex(item => item.name == newItem.name);
                          });
                          return (
                            <NewOnBoardingDesign
                              key={index} // Ensure each item has a unique key
                              mainOnPress={() =>
                                selectDenomination(item, index)
                              }
                              findIndex={findIndex}
                              index={index}
                              item={item}
                              multiSelect={true}
                              nameorid={"name"}
                              search={false}
                              radio={true}
                            />
                          );
                        })}
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>

            <View
              style={[
                styles.customScrollBarBackground,
                { height: "80%", marginTop: "5%" },
              ]}
            >
              <Animated.View
                style={[
                  styles.customScrollBar,
                  {
                    height: scrollIndicatorSize,
                    transform: [{ translateY: scrollIndicatorPosition }],
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <BottomButton
        text={
          updateProfile
            ? "Update Search preferences"
            : "Save Search preferences"
        }
        onPress={updateProfile}
      />
    </>
  );
};

export default Denominations;

const styles = StyleSheet.create({
  typeandCountView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: "2%",
    marginVertical: "2%",
  },
  // type: { fontSize: 16, color: colors.black },
  countView: {
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#23262F",
  },
  countText: { fontSize: 14, color: colors.white },
  question: {
    fontSize: 24,
    color: colors.black,
    fontFamily: "Inter-Bold",
    marginVertical: "3%",
    maxWidth: "90%",
    paddingLeft: "5%",
    top: "20%",
  },
  ask: {
    fontSize: 16,
    color: colors.black,
    fontFamily: "Inter-Medium",
    marginVertical: "1%",
    maxWidth: "90%",
    paddingLeft: "5%",
    top: "15%",
  },
  vibesListing: {
    width: "80%",
    paddingVertical: "3%",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: "3%",
    alignSelf: "center",
    paddingHorizontal: "5%",
    borderRadius: 10,
  },
  radioView: {
    width: 25,
    height: 25,
    borderColor: "#EBECEF",
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  textinputView: {
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    marginVertical: "5%",
    flexDirection: "row",
  },
  textinput: {
    minWidth: "60%",
    maxWidth: "80%",
    marginLeft: "5%",
    fontSize: 18,
  },
  scrollContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  scrollViewContainer: {
    width: "100%",
  },
  customScrollBar: {
    backgroundColor: colors.primaryPink,
    borderRadius: 3,
    width: 6,
  },
  customScrollBarBackground: {
    backgroundColor: "#D903680D",
    borderRadius: 3,
    height: "95%",
    width: 6,
  },
});
