import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnBoardingServices } from "../../../services";
import { useHelper } from "../../../hooks/useHelper";
import { useDispatch, useSelector } from "react-redux";

import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import BottomButton from "../../../components/buttons/BottomButton";
import NewOnBoardingDesign from "../../../components/NewOnBoardingDesign";
import OnBoardingSearch from "../../../components/OnBoardingSearch";

let filtered = [];

const ReligionScreen = ({ navigation, route }) => {
  let edit = route?.params?.edit;
  let placeholder = route?.params?.placeholder;
  let preferenceEdit = route?.params?.preferenceEdit;

  const dispatch = useDispatch();
  const { updateUser, updateUserPreference } = useHelper();

  const { userData, token } = useSelector(store => store.userReducer);
  const { religion } = useSelector(store => store.NewOnBoardingReducer);

  const [searchValue, setSearchValue] = useState("");
  const [array, setArray] = useState([
    {
      id: 1,
      type: "Religion",
      question: `Find matches with similar religious views?`,
      ask: "Match with shared beliefs",
      options: [],
      search: true,
      multiSelect: false,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReligion, setSelectedReligion] = useState(null);
  const [selectedDenomination, setSelectedDenomination] = useState(null);
  const [loading, setLoading] = useState(null);

  const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
  const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
  const scrollIndicator = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    setLoading(true);
    let copyarr = [...array];
    OnBoardingServices.profileValues(
      encodeURI(JSON.stringify(["denomination"]))
    )
      .then(async res => {
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: "allProfileValues",
            payload: res?.data?.data,
          });
          let data = res?.data?.data;
          let findReligionIndex = copyarr.findIndex(item => {
            return item?.type === "Religion";
          });
          let religionArray = await Object.keys(data?.denomination)
            .map(x => ({ name: x }))
            .sort((a, b) => {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            });

          copyarr[findReligionIndex] = {
            ...copyarr[findReligionIndex],
            options: religionArray,
          };
          setArray(copyarr);
        }
      })
      .catch(err => console.log("profileValues err", err))
      .finally(() => setLoading(false));
  }, []);

  const selectReligion = (item, index) => {
    console.log("Selected Religion:", item);
    setSelectedReligion(item);
    dispatch({
      type: "religion",
      payload: item,
    });
  };

  const selectDenomination = (item, index) => {
    setSelectedDenomination(item);
  };

  useEffect(() => {
    if (religion) {
      setSelectedReligion(religion);
    }
  }, []);

  useEffect(() => {
    if (edit) {
      let copy = {
        ...copy,
        name: userData?.Profile?.religion,
      };
      setSelectedReligion(copy);
    } else if (preferenceEdit) {
      let copy = {
        ...copy,
        name: userData?.UserPreference?.religion,
      };
      setSelectedReligion(copy);
    }
  }, []);

  const createProfile = async () => {
    if (edit) {
      let formData = new FormData();
      formData.append("religion", selectedReligion?.name);
      await updateUser(formData, token);
      // navigation.goBack();
      navigation.navigate("Denominations", {
        religions: selectedReligion,
      });
    } else if (preferenceEdit) {
      await updateUserPreference(token, "religion", [selectedReligion?.name]);
      navigation.goBack();
    } else {
      if (selectedReligion !== null) {
        dispatch({
          type: "religion",
          payload: selectedReligion === null ? religion : selectedReligion,
        });
        navigation.navigate("UploadSelfie");
        // navigation.navigate("Denominations", {
        //   religions: selectedReligion,
        //   // Other parameters if needed
        // });
      }
    }
  };
  // const createProfile = async () => {
  //   if (edit) {
  //     let formData = new FormData();
  //     formData.append("religion", selectedReligion?.name);
  //     await updateUser(formData, token);
  //     navigation.goBack();
  //   } else if (preferenceEdit) {
  //     // If preference is being edited, navigate to Denominations screen
  //     await updateUserPreference(token, "religion", [selectedReligion?.name]);
  //     navigation.navigate("Denominations", {
  //       religions: selectedReligion,
  //     });
  //   } else {
  //     if (selectedReligion !== null) {
  //       dispatch({
  //         type: "religion",
  //         payload: selectedReligion === null ? religion : selectedReligion,
  //       });
  //       navigation.navigate("UploadSelfie");
  //     }
  //   }
  // };

  const search = (text, type, currentIndex) => {
    setSearchValue(text);
    if (text?.length > 2) {
      filtered = [...array];
      let copyArray = [...array];
      let filtered1 = array[currentIndex]?.options.filter(item => {
        return item?.name.includes(text);
      });
      if (filtered1.length > 0) {
        copyArray[currentIndex] = {
          ...copyArray[currentIndex],
          options: filtered1,
        };
        filtered = copyArray;
      }
    } else if (text?.length <= 2) {
      filtered = [];
    }
  };

  return loading ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.white,
      }}
    >
      <ActivityIndicator size={"large"} color={colors.primaryPink} />
    </View>
  ) : (
    <SafeAreaView
      style={{ flex: 1, padding: 20, backgroundColor: colors.white }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../../../assets/iconimages/arrow-back.png")}
        />
      </TouchableOpacity>
      <View style={styles.typeandCountView}>
        {/* <Text style={styles.type}>{array[currentIndex]?.type}</Text> */}
      </View>

      <Text style={styles.ask}>{array[currentIndex]?.ask}</Text>
      <Text style={styles.question}>{array[currentIndex]?.question}</Text>
      <View style={{ width: "100%", height: "80%" }}>
        {array[currentIndex]?.type === "Religion" ? (
          <>
            <OnBoardingSearch
              onChangeText={text =>
                search(text, array[currentIndex]?.type, currentIndex)
              }
              array={array}
              type={array[currentIndex]?.type}
              currentIndex={currentIndex}
              searchValue={searchValue}
              search={array[currentIndex]?.search}
              placeholder={placeholder}
            />
            <View style={styles.scrollContainer}>
              <View style={{ height: "95%", width: "95%" }}>
                <ScrollView
                  onContentSizeChange={onContentSizeChange}
                  onLayout={onLayout}
                  onScroll={Animated.event(
                    [
                      {
                        nativeEvent: { contentOffset: { y: scrollIndicator } },
                      },
                    ],
                    { useNativeDriver: false }
                  )}
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}
                  style={{
                    marginVertical: "5%",
                  }}
                >
                  {filtered?.length > 0
                    ? filtered[currentIndex]?.options.map((item, index) => {
                        let findIndex = filtered[
                          currentIndex
                        ]?.options.findIndex(
                          item => item?.name === selectedReligion?.name
                        );

                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectReligion(item, index)}
                            findIndex={findIndex}
                            index={index}
                            item={item}
                            multiSelect={array[currentIndex]?.multiSelect}
                            nameorid={"name"}
                            search={array[currentIndex]?.search}
                            radio={true}
                          />
                        );
                      })
                    : array[currentIndex]?.options.map((item, index) => {
                        let findIndex = array[currentIndex]?.options.findIndex(
                          (item, index) => {
                            return item?.name === selectedReligion?.name;
                          }
                        );
                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectReligion(item, index)}
                            findIndex={findIndex}
                            index={index}
                            item={item}
                            multiSelect={array[currentIndex]?.multiSelect}
                            nameorid={"name"}
                            search={array[currentIndex]?.search}
                            radio={true}
                          />
                        );
                      })}
                </ScrollView>
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
          </>
        ) : array[currentIndex]?.type === "Denomination" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = array[currentIndex]?.options.findIndex(
                (item, index) => {
                  return item?.name === selectedDenomination?.name;
                }
              );
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectDenomination(item, index)}
                  findIndex={findIndex}
                  index={index}
                  item={item}
                  multiSelect={array[currentIndex]?.multiSelect}
                  nameorid={"name"}
                  search={array[currentIndex]?.search}
                  radio={true}
                />
              );
            })}
          </ScrollView>
        ) : null}
      </View>
      <BottomButton
        text={edit ? "Update Search Preference" : "Save Search preference"}
        // text={
        //   edit || preferenceEdit || selectReligion === "Denomination"
        //     ? "Update Search preferences"
        //     : "Save Search preferences"
        // }
        onPress={() => createProfile()}
      />
    </SafeAreaView>
  );
};
export default ReligionScreen;
const styles = StyleSheet.create({
  typeandCountView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: "2%",
    marginVertical: "2%",
  },
  type: { fontSize: 16, color: colors.black },
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
  },
  ask: {
    fontSize: 16,
    color: colors.black,
    fontFamily: "Inter-Medium",
    marginVertical: "1%",
    maxWidth: "90%",
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
