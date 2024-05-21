import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHelper } from "../../hooks/useHelper";
import { alerts } from "../../utility/regex";
import { useDispatch, useSelector } from "react-redux";
import { RulerPicker } from "react-native-ruler-picker";
import { android, ios, windowWidth, windowHeight } from "../../utility/size";

import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";
import BottomButton from "../../components/buttons/BottomButton";
import SliderView from "../../components/Modal/Slider";
import NewOnBoardingDesign from "../../components/NewOnBoardingDesign";
import OnBoardingSearch from "../../components/OnBoardingSearch";
import DropDownView from "../../components/Modal/DropDown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

let filtered = [];
const EditScreenSetting = props => {
  const { allVibes, allPrompts, allProfileValues, promptsPool, distance1 } =
    useSelector(store => store.NewOnBoardingReducer);
  const { updateUser, updateUserPreference } = useHelper();
  const dispatch = useDispatch();
  const proMem = userData?.UserSetting?.isSubscribed;
  const { userData, token } = useSelector(store => store.userReducer);
  const { edit, type, index, ask, line, preferenceEdit, placeholder } =
    props?.route?.params;
  const [tagline, setTagline] = useState("");
  const [selctedVibe, setSelectedVibe] = useState([]);
  const [selectedDenomination, setSelectedDenomination] = useState([]);
  const [selectedPray, setSelectedPray] = useState([]);
  const [selectedMH, setSelectedMH] = useState(null);
  const [selectedHK, setSelectedHK] = useState(null);
  const [selectedWK, setSelectedWK] = useState(null);
  const [selectedRelocate, setSelectedRelocate] = useState(null);
  const [distance, setDistance] = useState(null);
  let [distanceSlider, setDistanceSlider] = useState();
  const [selectedDrink, setSelectedDrink] = useState([]);
  const [selectedSmoke, setSelectedSmoke] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState([]);
  const [selectedPP, setSelectedPP] = useState([]);
  const [selectedFO, setSelectedFO] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedEL, setSelectedEL] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [occupation, setOccupation] = useState("");
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [selectedHeightFrom, setSelectedHeightFrom] = useState(null);
  const [selectedHeightTo, setSelectedHeightTo] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(null);

  const distanceList = ["Unlimited", "Nationwide", "Set Distance"];
  const [heightSlider, setHeightSlider] = useState(
    (userData?.UserPreference?.heightFrom === null &&
      userData?.UserPreference?.heightTo === null) ||
      (userData?.UserPreference?.heightFrom === undefined &&
        userData?.UserPreference?.heightTo === undefined)
      ? [null]
      : [
          userData?.UserPreference?.heightFrom,
          userData?.UserPreference?.heightTo,
        ]
  );
  let [age, setAge] = useState(
    (userData?.UserPreference?.ageFrom === null &&
      userData?.UserPreference?.ageTo === null) ||
      (userData?.UserPreference?.ageFrom === undefined &&
        userData?.UserPreference?.ageTo === undefined)
      ? [null]
      : [userData?.UserPreference?.ageFrom, userData?.UserPreference?.ageTo]
  );
  const [elArray, setElArray] = useState([
    { name: "High School" },
    { name: "Bachelors" },
    { name: "Masters" },
    { name: "Doctorate" },
  ]);
  const [distanceOptions, setDistanceOptions] = useState([
    { name: "Unlimited" },
    { name: "Nationwide" },
    { name: "Set Distance" },
  ]);

  const [plArray, setPlArray] = useState([
    { index: 0, stepLabel: "Rarely Religious" },
    { index: 1, stepLabel: "Somewhat Religious" },
    { index: 2, stepLabel: "Religious" },
    { index: 3, stepLabel: "Strongly Religious" },
  ]);
  const [prayArray, setPrayArray] = useState([
    { name: `Don't pray` },
    { name: "Sometimes" },
    { name: "Often" },
    { name: "Regularly" },
  ]);
  const [drinkArray, setDrinkArray] = useState([
    {
      name: "I Drink",
      icon: require("../../assets/iconimages/yes-drink.png"),
    },
    {
      name: "Sometimes, Socially",
      icon: require("../../assets/iconimages/socially-drink.png"),
    },
    {
      name: `I Don’t Drink`,
      icon: require("../../assets/iconimages/no-drinks.png"),
    },
  ]);
  const [smokeArray, setSmokeArray] = useState([
    {
      name: "Hookah",
      icon: require("../../assets/iconimages/hookahicon.png"),
    },
    {
      name: "Cigarette",
      icon: require("../../assets/iconimages/cigaretteicon.png"),
    },
    {
      name: `Weed`,
      icon: require("../../assets/iconimages/weedicon.png"),
    },
    {
      name: `None`,
      icon: require("../../assets/iconimages/smileyicon.png"),
    },
  ]);
  const [dietArray, setDietArray] = useState([
    {
      name: "Halal",
      icon: require("../../assets/iconimages/halalicon.png"),
    },
    {
      name: "Vegan",
      icon: require("../../assets/iconimages/veganicon.png"),
    },
    {
      name: `Anything`,
      icon: require("../../assets/iconimages/dieticon.png"),
    },
  ]);
  const [mhArray, setMhArray] = useState([
    {
      name: "None",
    },
    {
      name: "Annulled",
    },
    {
      name: `Divorces`,
    },
    {
      name: `Widowed`,
    },
  ]);
  const [mtArray, setMtArray] = useState([
    { index: 0, stepLabel: "1 Year" },
    { index: 1, stepLabel: "2 Years" },
    { index: 2, stepLabel: "3 Years" },
    { index: 3, stepLabel: "4 Years" },
  ]);
  const [ynArray, setYnArray] = useState([
    {
      name: "Yes",
    },
    {
      name: "No",
    },
  ]);

  let [sliderVal, setSliderVal] = useState([1]);
  let [sliderMarriageVal, setSliderMarriageVal] = useState([1]);

  const [responseText, setResponseText] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [ppCheck, setPPCheck] = useState(false);
  const [ppIndex, setPPIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // setLoading(true);
    setTimeout(() => {
      // setLoading(false);
    }, 1000);
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [ppCheck]);

  useEffect(() => {
    if (type === "Tagline") {
      setTagline(userData?.Profile?.tagline);
    } else if (type === "Main Vibes") {
      setSelectedVibe(userData?.Profile?.vibes);
    } else if (type === "Prompts Pool") {
      let copy = [...userData?.ProfilePrompts];
      let arr = [];
      copy.map(item => {
        return arr.push({
          id: item?.Question?.id,
          title: item?.Question?.title,
          answer: item?.answer,
          selected: true,
        });
      });
      setSelectedPP(arr);
    } else if (type === "Height") {
      setSelectedHeight(userData?.Profile?.height);
    } else if (type === "Family Origin") {
      let arr = [];
      if (preferenceEdit) {
        if (
          userData?.UserPreference &&
          Array.isArray(userData?.UserPreference?.familyOrigin)
        ) {
          userData?.UserPreference?.familyOrigin.forEach(el => {
            arr.push({ name: el });
          });
          setSelectedFO(arr);
        }
      } else {
        arr = {
          ...arr,
          name: edit ? userData?.Profile?.familyOrigin : null,
        };
        setSelectedFO([arr]);
      }
    } else if (type === "Community") {
      let arr;
      if (preferenceEdit) {
        if (userData?.UserPreference && userData?.UserPreference?.community) {
          arr = {
            ...arr,
            name: userData?.UserPreference?.community,
          };
          setSelectedCommunity([arr]);
        } else {
          // Handle the case where userData or UserPreference or community is not available
        }
      } else {
        arr = {
          ...arr,
          name: edit
            ? userData?.Profile?.community
            : preferenceEdit
            ? userData?.UserPreference?.community
            : null,
        };
        setSelectedCommunity([arr]);
      }
    } else if (type === "Languages") {
      let arr;
      if (preferenceEdit) {
        if (
          userData?.UserPreference &&
          userData?.UserPreference?.languagesSpoken
        ) {
          arr = {
            ...arr,
            name: userData?.UserPreference?.languagesSpoken,
          };
          setSelectedLanguage([arr]);
        } else {
          // Handle the case where userData or UserPreference or languagesSpoken is not available
        }
      } else {
        let copy = edit
          ? userData?.UserLanguages
          : preferenceEdit
          ? userData?.UserPreference?.languagesSpoken
          : null;
        if (copy !== null && copy?.length > 0) {
          copy = copy.map(languageObj => {
            return { name: languageObj.language };
          });
          setSelectedLanguage(copy);
        }
      }
    } else if (type === "Denomination") {
      let arr = [];

      if (preferenceEdit) {
        if (
          userData?.UserPreference &&
          Array.isArray(userData?.UserPreference?.religiousDenomination)
        ) {
          userData?.UserPreference?.religiousDenomination.forEach(el => {
            console.log("el", typeof el);
            arr.push({ name: el });
          });
          setSelectedDenomination(arr);
        }
      } else {
        arr = {
          ...arr,
          name: edit ? userData?.Profile?.denomination : null,
        };

        setSelectedDenomination([arr]);
      }
    } else if (type === "Education Level") {
      let arr = [];
      arr = {
        ...arr,
        name: userData?.Profile?.education,
      };
      setSelectedEL(arr);
    } else if (type === "Occupation") {
      setOccupation(userData?.Profile?.occupation);
    } else if (type === "Practicing Level") {
      let practiceLevel = userData?.Profile?.practiceLevel;
      if (practiceLevel === "Rarely Religious") {
        setSliderVal([1]);
      } else if (practiceLevel === "Somewhat Religious") {
        setSliderVal([2]);
      } else if (practiceLevel === "Religious") {
        setSliderVal([3]);
      } else if (practiceLevel === "Strongly Religious") {
        setSliderVal([4]);
      } else {
        setSliderVal([1]);
      }
    } else if (type === "Pray") {
      let arr = [];
      if (preferenceEdit) {
        // Check if UserPreference and theyPray are available and it is an array
        if (
          userData?.UserPreference &&
          Array.isArray(userData?.UserPreference?.theyPray)
        ) {
          // Iterate through the theyPray array and push items to the arr
          userData?.UserPreference?.theyPray.forEach(prayItem => {
            arr.push({
              name: prayItem, // Assuming theyPray contains strings, adjust if needed
            });
          });
          setSelectedPray(arr);
        }
      } else if (type === "Drink") {
        let arr = [];
        if (preferenceEdit) {
          // Check if UserPreference and theyPray are available and it is an array
          if (
            userData?.UserPreference &&
            Array.isArray(userData?.UserPreference?.drinking)
          ) {
            // Iterate through the drinking array and push items to the arr
            userData?.UserPreference?.drinking.forEach(drinkItem => {
              arr.push({
                name: drinkItem, // Assuming drinking contains strings, adjust if needed
                icon: getDrinkIcon(drinkItem), // Assuming you have a function to get the corresponding icon
              });
            });
            setSelectedDrink(arr);
          }
        } else {
          arr = {
            ...arr,
            name: edit
              ? userData?.Profile?.iDrink
              : preferenceEdit
              ? userData?.UserPreference?.drinking
              : null,
            icon: edit
              ? userData?.Profile?.iDrink === "I Drink"
                ? require("../../assets/iconimages/yes-drink.png")
                : userData?.Profile?.iDrink === "Sometimes, Socially"
                ? require("../../assets/iconimages/socially-drink.png")
                : require("../../assets/iconimages/no-drinks.png")
              : preferenceEdit
              ? userData?.UserPreference?.drinking === "I Drink"
                ? require("../../assets/iconimages/yes-drink.png")
                : userData?.UserPreference?.drinking === "Sometimes, Socially"
                ? require("../../assets/iconimages/socially-drink.png")
                : require("../../assets/iconimages/no-drinks.png")
              : null,
          };
        }

        setSelectedDrink(arr);
      }
    } else if (type === "Smoke") {
      let arr;
      if (preferenceEdit) {
        if (
          userData?.UserPreference &&
          Array.isArray(userData?.UserPreference?.smoking)
        ) {
          arr =
            userData?.UserPreference?.smoking.map(item => ({ name: item })) ||
            [];
          setSelectedSmoke(arr);
        } else {
          // Handle the case where userData or UserPreference or smoking is not available
        }
      } else {
        let copy = edit
          ? userData?.UserSmokes
          : preferenceEdit
          ? userData?.UserPreference?.smoking
          : null;
        if (copy !== null && copy?.length > 0) {
          copy = copy.map(smokeObj => {
            return {
              name: smokeObj?.choice,
              icon:
                userData?.UserSmokes === "Cigarette"
                  ? require("../../assets/iconimages/cigaretteicon.png")
                  : userData?.UserSmokes === "Weed"
                  ? require("../../assets/iconimages/weedicon.png")
                  : userData?.UserSmokes === "None"
                  ? require("../../assets/iconimages/smileyicon.png")
                  : userData?.UserSmokes === "Hookah"
                  ? require("../../assets/iconimages/hookahicon.png")
                  : null,
            };
          });
          setSelectedSmoke(copy);
        }
      }
    } else if (type === "Diet") {
      let arr;
      if (preferenceEdit) {
        if (
          userData?.UserPreference &&
          Array.isArray(userData?.UserPreference?.dietChoices)
        ) {
          arr =
            userData?.UserPreference?.dietChoices.map(item => ({
              name: item,
            })) || [];
          setSelectedDiet(arr);
        } else {
          // Handle the case where userData or UserPreference or smoking is not available
        }
      } else {
        let copy = edit
          ? userData?.UserDietChoices
          : preferenceEdit
          ? userData?.UserPreference?.dietChoices
          : null;
        if (copy !== null && copy?.length > 0) {
          copy = copy.map(dietobject => {
            return {
              name: dietobject?.choice,
              icon:
                userData?.UserDietChoices === "Halal"
                  ? require("../../assets/iconimages/halalicon.png")
                  : userData?.UserDietChoices === "Vegan"
                  ? require("../../assets/iconimages/veganicon.png")
                  : userData?.UserDietChoices === "Anything"
                  ? require("../../assets/iconimages/dieticon.png")
                  : null,
            };
          });
          setSelectedDiet(copy);
        }
      }
    } else if (type === "Marital History") {
      let arr = [];
      arr = {
        ...arr,
        name: edit
          ? userData?.Profile?.maritalHistory
          : preferenceEdit
          ? userData?.UserPreference?.maritalHistory
          : null,
      };
      setSelectedMH(arr);
    } else if (type === "Marriage Timeline") {
      let marriageTimeline = userData?.Profile?.marriageTimeline;
      if (marriageTimeline === "1 Year") {
        setSliderMarriageVal([1]);
      } else if (marriageTimeline === "2 Years") {
        setSliderMarriageVal([2]);
      } else if (marriageTimeline === "3 Years") {
        setSliderMarriageVal([3]);
      } else if (marriageTimeline === "4 Years") {
        setSliderMarriageVal([4]);
      } else {
        setSliderMarriageVal([1]);
      }
    } else if (type === "Have Kids") {
      if (edit) {
        if (userData?.Profile?.haveKids) {
          setSelectedHK("Yes");
        } else if (userData?.Profile?.haveKids === false) {
          setSelectedHK("No");
        } else {
          setSelectedHK(null);
        }
      } else if (preferenceEdit) {
        if (userData?.UserPreference?.haveKids) {
          setSelectedHK("Yes");
        } else if (userData?.UserPreference?.haveKids === false) {
          setSelectedHK("No");
        } else {
          setSelectedHK(null);
        }
      } else {
        setSelectedHK(null);
      }
    } else if (type === "Want Kids") {
      if (edit) {
        if (userData?.Profile?.wantKids) {
          setSelectedWK("Yes");
        } else if (userData?.Profile?.wantKids === false) {
          setSelectedWK("No");
        } else {
          setSelectedWK(null);
        }
      } else if (preferenceEdit) {
        if (userData?.UserPreference?.wantKids) {
          setSelectedWK("Yes");
        } else if (userData?.UserPreference?.wantKids === false) {
          setSelectedWK("No");
        } else {
          setSelectedWK(null);
        }
      } else {
        setSelectedWK(null);
      }
    } else if (type === "Relocate") {
      if (edit) {
        if (userData?.Profile?.willingToRelocate) {
          setSelectedRelocate("Yes");
        } else if (userData?.Profile?.willingToRelocate === false) {
          setSelectedRelocate("No");
        } else {
          setSelectedRelocate(null);
        }
      } else if (preferenceEdit) {
        if (userData?.UserPreference?.willingToRelocate) {
          setSelectedRelocate("Yes");
        } else if (userData?.UserPreference?.willingToRelocate === false) {
          setSelectedRelocate("No");
        } else {
          setSelectedRelocate(null);
        }
      } else {
        setSelectedRelocate(null);
      }
    }
  }, []);

  useEffect(() => {
    if (
      /unlimited|nationwide/.test(userData?.UserPreference?.distance) &&
      userData?.UserPreference?.distance !== null
    ) {
      setDistance(userData?.UserPreference?.distance);
    } else {
      setDistance("Set Distance");
      setDistanceSlider(parseInt(userData?.UserPreference?.distance));
    }
  }, []);

  const selectVibe = (item, index) => {
    let arr = [...selctedVibe];
    let check = arr.some(item1 => {
      return item1 === item?.name;
    });
    if (arr.length < 8 && check === false) {
      arr.push(item?.name);
      setSelectedVibe(arr);
    } else if (check === true) {
      let filtered = arr.filter(item1 => {
        return item1 !== item?.name;
      });
      setSelectedVibe(filtered);
    }
  };
  const selectPP = (item, index) => {
    let arr = [...selectedPP];
    let check = arr.some(item1 => {
      return item1?.id === item?.id;
    });

    if (
      userData?.UserSetting?.isSubscribed &&
      check === false &&
      arr.length < 5
    ) {
      arr.push(item);
      setSelectedPP(arr);
    } else if (
      !userData?.UserSetting?.isSubscribed &&
      arr.length < 3 &&
      !check
    ) {
      arr.push(item);
      setSelectedPP(arr);
    } else if (check === true) {
      let filtered = arr.filter(item1 => {
        return item1?.id !== item?.id;
      });
      setSelectedPP(filtered);
    }
  };
  const selectHeight = number => {
    setSelectedHeight(number);
  };
  const selectHeightFrom = number => {
    setSelectedHeightFrom(number);
  };
  const selectHeightTo = number => {
    setSelectedHeightTo(number);
  };
  const search = (text, type, currentIndex) => {
    setSearchValue(text);
    if (text?.length > 2) {
      let filtered1 = allProfileValues?.[type].filter(item => {
        return item?.name.includes(text);
      });
      if (filtered1.length > 0) {
        filtered = filtered1;
      }
    } else if (text?.length <= 2) {
      filtered = [];
    }
  };

  const onPressAll = () => {
    setSelectedFO(allProfileValues?.familyOrigin.filter(el => el.name != ""));
  };

  const selectFO = (item, index) => {
    if (preferenceEdit) {
      if (item.name == "Not Specified") {
        setSelectedFO([item]);
      } else {
        setSelectedFO(prevState => {
          if (prevState.length == 1 && prevState[0].name == "Not Specified") {
            // replace not specified value
            return [item];
          } else if (prevState.some(el => el.name.includes(item.name))) {
            // remove if already exist
            return prevState.filter(el => el.name != item.name);
          } else {
            // append new value
            return [...prevState, item];
          }
        });
      }
    } else {
      let arr = [...selectedFO];

      let check2 = arr.some(item1 => {
        return item1?.name === item?.name;
      });

      let check = arr.some(item1 => {
        return item1?.name === "Not Specified";
      });
      if (check && item?.name !== "Not Specified") {
        arr = [];
        arr.push(item);
        setSelectedFO(arr);
      } else if (check && item?.name === "Not Specified") {
        arr = [];
        setSelectedFO(arr);
      } else if (item?.name === "Not Specified" && !check) {
        arr = [];
        arr.push(item);
        setSelectedFO(arr);
      } else if (
        !check &&
        item?.name !== "Not Specified" &&
        !check2 &&
        selectedFO.length < 6
      ) {
        arr.push(item);
        setSelectedFO(arr);
      } else if (!check && item?.name !== "Not Specified" && check2) {
        let filtered = arr.filter(item1 => {
          return item1?.name !== item?.name;
        });
        setSelectedFO(filtered);
      }
    }
  };
  const onPressAllLanguages = () => {
    setSelectedLanguage(allProfileValues?.language.filter(el => el.name != ""));
  };

  const selectLanguage = (item, index) => {
    if (preferenceEdit) {
      if (item.name == "") {
        setSelectedLanguage([item]);
      } else {
        setSelectedLanguage(prevState => {
          if (prevState.length == 1 && prevState[0].name == "") {
            // replace not specified value
            return [item];
          } else if (prevState.some(el => el.name.includes(item.name))) {
            // remove if already exist
            return prevState.filter(el => el.name != item.name);
          } else {
            // append new value
            return [...prevState, item];
          }
        });
      }
    } else {
      let arr = [...selectedLanguage];

      let check2 = arr.some(item1 => {
        return item1?.name === item?.name;
      });

      let check = arr.some(item1 => {
        return item1?.name === "Other";
      });
      if (check && item?.name !== "Other") {
        arr = [];
        arr.push(item);
        setSelectedLanguage(arr);
      } else if (check && item?.name === "Other") {
        arr = [];
        setSelectedLanguage(arr);
      } else if (item?.name === "Other" && !check) {
        arr = [];
        arr.push(item);
        setSelectedLanguage(arr);
      } else if (!check && item?.name !== "Other" && !check2) {
        arr.push(item);
        setSelectedLanguage(arr);
      } else if (!check && item?.name !== "Other" && check2) {
        let filtered = arr.filter(item1 => {
          return item1?.name !== item?.name;
        });
        setSelectedLanguage(filtered);
      }
    }
  };
  // const onPressAllDenomination = () => {
  //   let arr = [];
  //   userData?.UserPreference?.religion.map(rel => {
  //     arr = allProfileValues?.denomination[rel].filter(el => el.name != "");
  //   });

  //   setSelectedDenomination(arr);
  // };

  // const selectDenomination = (item, index) => {
  //   if (item.name == "") {
  //     setSelectedDenomination([item]);
  //   } else {
  //     setSelectedDenomination(prevState => {
  //       if (prevState.length == 1 && prevState[0].name == "") {
  //         // replace not specified value
  //         return [item];
  //       } else if (prevState?.some(el => el.name.includes(item.name))) {
  //         // remove if already exist
  //         return prevState.filter(el => el.name != item.name);
  //       } else {
  //         // append new value
  //         return [...prevState, item];
  //       }
  //     });
  //   }
  // };

  const selectDenomination = item => {
    setSelectedDenomination([item]);
  };
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

  const onPressAllCommunity = () => {
    setSelectedCommunity(
      allProfileValues?.community.filter(el => el.name != "")
    );
  };
  const selectCommunity = (item, index) => {
    if (preferenceEdit) {
      if (item.name == "Not Specified") {
        setSelectedCommunity([item]);
      } else {
        setSelectedCommunity(prevState => {
          if (prevState.length == 1 && prevState[0].name == "Not Specified") {
            // replace not specified value
            return [item];
          } else if (prevState.some(el => el.name.includes(item.name))) {
            // remove if already exist
            return prevState.filter(el => el.name != item.name);
          } else {
            // append new value
            return [...prevState, item];
          }
        });
      }
    } else {
      let arr = [...selectedCommunity];

      let check2 = arr.some(item1 => {
        return item1?.name === item?.name;
      });

      let check = arr.some(item1 => {
        return item1?.name === "Not Specified";
      });
      if (check && item?.name !== "Not Specified") {
        arr = [];
        arr.push(item);
        setSelectedCommunity(arr);
      } else if (check && item?.name === "Not Specified") {
        arr = [];
        setSelectedCommunity(arr);
      } else if (item?.name === "Not Specified" && !check) {
        arr = [];
        arr.push(item);
        setSelectedCommunity(arr);
      } else if (!check && item?.name !== "Not Specified" && !check2) {
        arr.push(item);
        setSelectedCommunity(arr);
      } else if (!check && item?.name !== "Not Specified" && check2) {
        let filtered = arr.filter(item1 => {
          return item1?.name !== item?.name;
        });
        setSelectedCommunity(filtered);
      }
    }
  };
  const selectEL = (item, index) => {
    setSelectedEL(item);
  };
  const RenderSlider = ({
    min,
    max,
    prefName,
    step,
    customLabel,
    stepsAs,
    showSteps,
    showStepLabels,
  }) => {
    return (
      <SliderView
        textWithoutIconView
        preferenceName={prefName}
        multiSliderValue={[sliderVal[0]]}
        min={min}
        max={max}
        step={step}
        stepsAs={stepsAs}
        showSteps={showSteps}
        showStepLabels={showStepLabels}
        enableLabel={true}
        customLabel={customLabel}
        bg="transparent"
        multiSliderValuesChange={val => {
          handleSliderValue(customLabel, val);
        }}
      />
    );
  };
  const RenderMarriageSlider = ({
    min,
    max,
    prefName,
    step,
    customLabel,
    stepsAs,
    showSteps,
    showStepLabels,
  }) => {
    return (
      <SliderView
        textWithoutIconView
        preferenceName={prefName}
        multiSliderValue={[sliderMarriageVal[0]]}
        min={min}
        max={max}
        step={step}
        stepsAs={stepsAs}
        showSteps={showSteps}
        showStepLabels={showStepLabels}
        enableLabel={true}
        customLabel={customLabel}
        bg="transparent"
        multiSliderValuesChange={val => {
          handleSliderMarriageValue(customLabel, val);
        }}
      />
    );
  };
  const handleSliderValue = (label, val) => {
    setSliderVal(val);
  };
  const handleSliderMarriageValue = (label, val) => {
    setSliderMarriageVal(val);
  };

  // const selectPray = (item, index) => {
  //   console.log("PPPP", item);
  //   setSelectedPray(item);
  // };
  const onPressAllPray = () => {
    setSelectedPray(prayArray.filter(el => el.name !== ""));
  };
  const selectPray = (item, index) => {
    if (preferenceEdit) {
      setSelectedPray(prevState => {
        if (prevState.some(el => el.name.includes(item.name))) {
          // remove if already exist
          return prevState.filter(el => el.name != item.name);
        } else {
          // append new value
          return [...prevState, item];
        }
      });
    } else {
      let arr = [...selectedPray];

      let check2 = arr.some(item1 => {
        return item1?.name === item?.name;
      });

      let check = arr.some(item1 => {
        return item1?.name === "Don't Pray";
      });

      if (check && item?.name !== "Don't Pray") {
        arr = [];
        arr.push(item);
        setSelectedPray(arr);
      } else if (check && item?.name === "Don't Pray") {
        arr = [];
        setSelectedPray(arr);
      } else if (item?.name === "Don't Pray" && !check) {
        arr = [];
        arr.push(item);
        setSelectedPray(arr);
      } else if (!check && item?.name !== "Don't Pray" && !check2) {
        arr.push(item);
        setSelectedPray(arr);
      } else if (!check && item?.name !== "Don't Pray" && check2) {
        let filtered = arr.filter(item1 => {
          return item1?.name !== item?.name;
        });
        setSelectedPray(filtered);
      }
    }
  };
  const onPressAllDrink = () => {
    setSelectedDrink(drinkArray.filter(el => el.name !== ""));
  };
  const selectDrink = (item, index) => {
    if (preferenceEdit) {
      setSelectedDrink(prevState => {
        if (prevState.some(el => el.name === item.name)) {
          // Remove if already exists
          return prevState.filter(el => el.name !== item.name);
        } else {
          // Append new value
          return [...prevState, item];
        }
      });
    } else {
      let arr = [...selectedDrink];

      let check2 = arr.some(item1 => {
        return item1?.name === item?.name;
      });

      let check = arr.some(item1 => {
        return item1?.name === "I Don't Drink";
      });

      if (check && item?.name !== "I Don't Drink") {
        arr = [];
        arr.push(item);
        setSelectedDrink(arr);
      } else if (check && item?.name === "I Don't Drink") {
        arr = [];
        setSelectedDrink(arr);
      } else if (item?.name === "I Don't Drink" && !check) {
        arr = [];
        arr.push(item);
        setSelectedDrink(arr);
      } else if (!check && item?.name !== "I Don't Drink" && !check2) {
        arr.push(item);
        setSelectedDrink(arr);
      } else if (!check && item?.name !== "I Don't Drink" && check2) {
        let filtered = arr.filter(item1 => {
          return item1?.name !== item?.name;
        });
        setSelectedDrink(filtered);
      }
    }
  };
  const onPressAllSmoke = () => {
    setSelectedSmoke(smokeArray.filter(el => el.name !== ""));
  };
  const selectSmoke = (item, index) => {
    if (preferenceEdit) {
      setSelectedSmoke(prevState => {
        const updatedState = [...(prevState || [])];

        // Check if "None" is selected
        const isNoneSelected = updatedState.some(el => el.name === "None");

        if (item.name === "None") {
          // If "None" is selected, clear the array and add only "None"
          return [item];
        }

        if (isNoneSelected) {
          // If "None" is already selected, unselect it and select the new option
          return [item];
        }

        // Check if the new option is already selected
        const isItemSelected = updatedState.some(el => el.name === item.name);

        if (isItemSelected) {
          // If selected, remove it from the array
          return updatedState.filter(el => el.name !== item.name);
        } else {
          // If not selected, add it to the array
          return [...updatedState, item];
        }
      });
    } else {
      let arr = [...selectedSmoke];

      let check2 = arr.some(item1 => {
        return item1?.name === item?.name;
      });

      let check = arr.some(item1 => {
        return item1?.name === "None";
      });
      if (check && item?.name !== "None") {
        arr = [];
        arr.push(item);
        setSelectedSmoke(arr);
      } else if (check && item?.name === "None") {
        arr = [];
        setSelectedSmoke(arr);
      } else if (item?.name === "None" && !check) {
        arr = [];
        arr.push(item);
        setSelectedSmoke(arr);
      } else if (!check && item?.name !== "None" && !check2) {
        arr.push(item);
        setSelectedSmoke(arr);
      } else if (!check && item?.name !== "None" && check2) {
        let filtered = arr.filter(item1 => {
          return item1?.name !== item?.name;
        });
        setSelectedSmoke(filtered);
      }
    }
  };
  const onPressAllDiet = () => {
    setSelectedDiet(dietArray.filter(el => el.name !== ""));
  };
  const selectDiet = (item, index) => {
    if (preferenceEdit) {
      setSelectedDiet(prevState => {
        const updatedState = [...(prevState || [])];

        // Check if "None" is selected
        const isNoneSelected = updatedState.some(el => el.name === "Anything");

        if (item.name === "Anything") {
          // If "None" is selected, clear the array and add only "None"
          return [item];
        }

        if (isNoneSelected) {
          // If "None" is already selected, unselect it and select the new option
          return [item];
        }

        // Check if the new option is already selected
        const isItemSelected = updatedState.some(el => el.name === item.name);

        if (isItemSelected) {
          // If selected, remove it from the array
          return updatedState.filter(el => el.name !== item.name);
        } else {
          // If not selected, add it to the array
          return [...updatedState, item];
        }
      });
    } else {
      let arr = [...selectedDiet];

      let check2 = arr.some(item1 => {
        return item1?.name === item?.name;
      });

      let check = arr.some(item1 => {
        return item1?.name === "Anything";
      });
      if (check && item?.name !== "Anything") {
        arr = [];
        arr.push(item);
        setSelectedDiet(arr);
      } else if (check && item?.name === "Anything") {
        arr = [];
        setSelectedDiet(arr);
      } else if (item?.name === "Anything" && !check) {
        arr = [];
        arr.push(item);
        setSelectedDiet(arr);
      } else if (!check && item?.name !== "Anything" && !check2) {
        arr.push(item);
        setSelectedDiet(arr);
      } else if (!check && item?.name !== "Anything" && check2) {
        let filtered = arr.filter(item1 => {
          return item1?.name !== item?.name;
        });
        setSelectedDiet(filtered);
      }
    }
  };
  const selectMh = (item, index) => {
    setSelectedMH(item);
  };
  const selectDistance = (item, index) => {
    setDistance(item);
    dispatch({
      type: "distance1",
      payload: distance,
    });
  };
  const selectHK = (item, index) => {
    setSelectedHK(item?.name);
  };
  const selectWK = (item, index) => {
    setSelectedWK(item?.name);
  };
  const selectRelocate = (item, index) => {
    setSelectedRelocate(item?.name);
  };
  const Distance = value => {
    setDistance(value);
  };
  const DistanceSlider = value => {
    setDistanceSlider(value);
  };
  const HeightSliderValuesChange = values => {
    setHeightSlider(values);
  };
  const AgeSliderValuesChange = value => {
    // value = value.map(item => {
    //   return parseInt(item);
    // });

    setAge(value);
  };

  const updateProfile = async () => {
    console.log("FO:", selectedFO);
    console.log("Community:", selectedCommunity);
    let foArr = selectedFO.map(el => el.name);
    let communityArr = selectedCommunity.map(el => el.name);
    let langArr = selectedLanguage.map(el => el.name);
    let smokeArr = selectedSmoke.map(el => el.name);
    let dietArr = selectedDiet.map(el => el.name);
    let prayArr = selectedPray.map(el => el.name);
    let drinkArr = selectedDrink.map(el => el.name);
    let denArr = selectedDenomination.map(el => el.name);
    if (edit) {
      let formData = new FormData();
      // console.log("FormDATA", type);
      if (type === "Prompts Pool") {
        if (selectedPP?.length < 3) {
          alerts("error", "Please select atleast 3 prompt pools");
        } else {
          setPPCheck(true);
          if (!ppCheck) {
            setPPIndex(0);
          } else if (ppCheck && ppIndex < selectedPP.length - 1) {
            if (
              selectedPP[ppIndex]?.answer &&
              selectedPP[ppIndex]?.answer !== ""
            ) {
              setPPIndex(prev => prev + 1);
            } else {
              alerts("error", "Please write your answer");
            }
          } else {
            if (
              selectedPP[ppIndex]?.answer &&
              selectedPP[ppIndex]?.answer !== ""
            ) {
              let check;

              selectedPP.map((el, ind) => {
                check = userData?.ProfilePrompts?.some((item, index) => {
                  return item?.Question?.id === el?.id;
                });

                formData.append(`profilePrompts[${ind}][questionId]`, el?.id);
                formData.append(`profilePrompts[${ind}][answer]`, el.answer);
                formData.append(
                  `profilePrompts[${ind}][operation]`,
                  !check && el?.selected ? "delete" : check ? "update" : "add"
                );
              });

              await updateUser(formData, token);
              setPPCheck(false);
            } else {
              alerts("error", "Please write your answer");
            }
          }
        }
      } else {
        let paramKey = type;
        switch (paramKey) {
          case "Tagline":
            formData.append("tagline", tagline);
            break;
          case "Main Vibes":
            selctedVibe.map((x, index) => {
              formData.append(`vibes[]`, x);
            });
            break;
          case "Prompts Pool":
            selectedPP.map((x, index) => {
              formData.append(`vibes[]`, x);
            });
            break;
          case "FirstName":
            formData.append("firstName", textVal);
            break;
          case "Height":
            formData.append("height", selectedHeight);
            break;
          case "Family Origin":
            formData.append("familyOrigin", selectedFO[0]?.name);
            break;
          case "Community":
            formData.append("community", selectedCommunity[0]?.name);
            break;
          case "Languages":
            selectedLanguage.map((x, index) => {
              formData.append(`languages[]`, x[0]?.name);
            });
            break;
          case "Denomination":
            formData.append("denomination", selectedDenomination?.name);
            break;
          case "Education Level":
            formData.append("education", selectedEL?.name);
            break;
          case "Occupation":
            formData.append("occupation", occupation);
            break;
          case "Practicing Level":
            formData.append(
              "practiceLevel",
              sliderVal[0] === 1
                ? "Rarely Religious"
                : sliderVal[0] === 2
                ? "Somewhat Religious"
                : sliderVal[0] === 3
                ? "Religious"
                : "Strongly Religious"
            );
            break;
          case "Pray":
            formData.append("iPray", selectedPray?.name);
            break;
          case "Drink":
            formData.append("iDrink", selectedDrink?.name);
            break;
          case "Smoke":
            selectedSmoke.map((x, index) => {
              formData.append(`smokeChoices[]`, x?.name);
            });
            break;
          case "Diet":
            selectedDiet.map((x, index) => {
              formData.append(`dietChoices[]`, x?.name);
            });
            break;
          case "Marital History":
            formData.append("maritalHistory", selectedMH?.name);
            break;
          case "Marriage Timeline":
            formData.append(
              "marriageTimeline",
              sliderMarriageVal[0] === 1
                ? "1 Year"
                : sliderMarriageVal[0] === 2
                ? "2 Years"
                : sliderMarriageVal[0] === 3
                ? "3 Years"
                : sliderMarriageVal[0] === 4
                ? "4 Years"
                : ""
            );
            break;
          case "Have Kids":
            formData.append("haveKids", selectedHK === "Yes" ? true : false);
            break;
          case "Want Kids":
            formData.append("wantKids", selectedWK === "Yes" ? true : false);
            break;
          case "Relocate":
            formData.append(
              "willingToRelocate",
              selectedRelocate === "Yes" ? true : false
            );
            break;

          default:
            return null;
        }
        await updateUser(formData, token);
        props.navigation.goBack();
      }
      formData.append(sendType, value);
    } else if (preferenceEdit) {
      let filteredCommuntiy;
      let filteredFO;
      if (type === "Community") {
        filteredCommuntiy = selectedCommunity?.filter(item => {
          return item?.name !== null;
        });
      }
      if (type === "Family Origin") {
        filteredFO = selectedFO?.filter(item => {
          return item?.name !== null;
        });
      }
      let sendType;
      let value;
      let type2;
      let paramKey = type;
      switch (paramKey) {
        case "Distance":
          sendType = "distance";
          value =
            distance === "Set Distance"
              ? distanceSlider.toString()
              : distance === null
              ? "unlimited"
              : distance.toLowerCase();
          break;
        case "Height":
          sendType = "heightFrom";
          type2 = "heightTo";
          value = [selectedHeightFrom, selectedHeightTo];

          break;
        case "Age":
          sendType = "ageFrom";
          type2 = "ageTo";
          value = [age[0], age[1]];
          break;

        case "Religion":
          sendType = "religion";
          break;
        case "Family Origin":
          sendType = "familyOrigin";
          value = foArr;
          break;
        case "Community":
          sendType = "community";
          value = communityArr;
          break;
        case "Languages":
          sendType = "languagesSpoken";
          value = langArr;
          break;
        case "Denomination":
          sendType = "religiousDenomination";
          value = denArr;
          break;

        case "Pray":
          sendType = "theyPray";
          value = prayArr;
          break;
        case "Drink":
          sendType = "drinking";
          value = drinkArr;
          break;
        case "Smoke":
          sendType = "smoking";
          value = smokeArr;
          break;
        case "Diet":
          sendType = "dietChoices";
          value = dietArr;
          break;
        case "Marital History":
          sendType = "maritalHistory";
          value = selectedMH?.name;
          break;
        case "Have Kids":
          sendType = "haveKids";
          value = selectedHK === "Yes" ? true : false;
          break;
        case "Want Kids":
          sendType = "wantKids";
          value = selectedWK === "Yes" ? true : false;
          break;
        case "Relocate":
          sendType = "willingToRelocate";
          value = selectedRelocate === "Yes" ? true : false;
          break;
      }
      if (selectedHeightFrom > selectedHeightTo) {
        alerts("error", "Height From should be less than Height To");
      } else {
        await updateUserPreference(
          token,
          sendType,
          value === undefined || value === null ? null : value,
          type2
        );
        props.navigation.goBack();
      }
    }
  };

  const calculateInches = async number => {
    const totalInches = number / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = (await totalInches) % 12;

    let inchesString;

    if (inches >= 10) {
      inchesString = await inches.toFixed(0);
    } else if (inches >= 0 && inches < 10) {
      inchesString = await inches.toFixed(0);
    }

    return feet + "." + inchesString;
  };

  const Divider = () => (
    <View
      style={{
        width: "100%",
        borderWidth: 0.7,
        alignSelf: "center",
        borderColor: "#EBECEF",
        marginTop: 5,
      }}
    />
  );

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.white, padding: 20 }}
      >
        <KeyboardAwareScrollView
          enableOnAndroid={ppCheck && android ? true : false}
          extraScrollHeight={ppCheck && android ? 150 : 0}
          // style={{ flex: 1 }}
          contentContainerStyle={ppCheck && android ? null : { flex: 1 }}
          keyboardShouldPersistTaps={"handled"}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              height: windowHeight,
              // backgroundColor: "green",
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={{
                width: "12%",
                paddingVertical: "2%",
                height: 35,
              }}
            >
              <FastImage
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
                source={require("../../assets/iconimages/settingback.png")}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                // paddingVertical: "2%",
                // marginVertical: "2%",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-Medium",
                  marginVertical: "5%",
                  color: "#23262F",
                }}
              >
                {line}
              </Text>
              {type === "Prompts Pool" && ppCheck ? (
                <View
                  style={{
                    paddingHorizontal: "4%",
                    paddingVertical: "2%",
                    borderRadius: 7,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#23262F",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.white,
                      fontFamily: "Inter-Regular",
                    }}
                  >
                    {ppIndex + 1 + " / " + selectedPP?.length}
                  </Text>
                </View>
              ) : !ppCheck && type === "Prompts Pool" ? (
                <View style={styles.countView}>
                  <Text style={[styles.countText]}>
                    {selectedPP?.length + " / "}
                    {userData?.UserSetting?.isSubscribed ? "5" : "3"}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[
                styles.ask,
                {
                  width: "100%",
                },
              ]}
            >
              {ask}
            </Text>
            {preferenceEdit ? null : edit && type !== "Main Vibes" ? null : (
              <Text style={[styles.line]}>{line}</Text>
            )}
            <View
              style={{
                width: "100%",
                height:
                  edit && type === "Main Vibes" && android
                    ? "67%"
                    : edit && type === "Main Vibes" && ios
                    ? "70%"
                    : ios
                    ? "78%"
                    : "73%",
              }}
            >
              {type === "Distance" ? (
                <>
                  {distanceList.map((item, index) => {
                    let findIndex = distanceList.findIndex((item, index) => {
                      return item.toLowerCase() === distance?.toLowerCase();
                    });

                    return (
                      <NewOnBoardingDesign
                        mainOnPress={() => selectDistance(item, index)}
                        findIndex={findIndex}
                        index={index}
                        item={item}
                        multiSelect={false}
                        search={false}
                        radio={true}
                      />
                    );
                  })}
                  <View>
                    {/* <DropDownView
                      // preferenceName={'Distance'}
                      onValueChange={Distance}
                      SelectDropdown
                      defaultValue={
                        userData?.UserPreference?.distance === "unlimited" ||
                        userData?.UserPreference?.distance === "nationwide"
                          ? userData?.UserPreference?.distance
                          : distance
                      }
                      DropDownPlaceholder={userData?.UserPreference?.distance}
                      data={distanceList}
                      // textWithIconView
                      // preferenceIcon={require('../../assets/iconimages/location.png')}
                    /> */}
                    {distance === "Set Distance" ? (
                      <SliderView
                        sp={{
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "5%",
                        }}
                        multiSliderValue={[
                          /Unlimited|unlimited/.test(
                            userData?.UserPreference?.distance
                          ) ||
                          /Nationwide|nationwide/.test(
                            userData?.UserPreference?.distance
                          )
                            ? 0
                            : parseInt(userData?.UserPreference?.distance),
                        ]}
                        multiSliderValuesChange={DistanceSlider}
                        min={0}
                        max={2000}
                        // preferenceName={"Distance"}
                        customLabel="mi"
                        enableLabel={true}
                        step={1}
                      />
                    ) : null}
                  </View>
                </>
              ) : type === "Height" && preferenceEdit ? (
                <>
                  <View
                    style={{
                      width: "100%",
                      borderWidth: 0.7,
                      alignSelf: "center",
                      borderColor: "#EBECEF",
                      marginTop: 5,
                    }}
                  ></View>
                  <Text
                    style={{
                      marginTop: "5%",
                      fontSize: 14,
                      fontFamily: "Inter-Medium",
                    }}
                  >
                    From
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      marginTop: "5%",
                      backgroundColor: "#F9FAFB",
                      // paddingVertical: "5%",
                      borderRadius: 10,
                      height: windowHeight * 0.2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RulerPicker
                      value={selectedHeightFrom / 30.48}
                      onValueChangeEnd={async number => {
                        let res = await calculateInches(number);
                        selectHeightFrom(res);
                      }}
                      onValueChange={number => {
                        console.log("NUMBer", number);
                      }}
                      min={122}
                      max={245}
                      unit="ft"
                      height={100}
                      width={windowWidth * 0.8}
                      indicatorHeight={40}
                      indicatorColor={colors.primaryPink}
                      shortStepHeight={20}
                      longStepHeight={50}
                      valueTextStyle={{
                        color: colors.primaryPink,
                        fontSize: 20,
                      }}
                      unitTextStyle={{
                        color: colors.primaryPink,
                        fontSize: 17,
                      }}
                      step={2.54}
                      initialValue={122 / 30.48}
                    />
                  </View>
                  <Text
                    style={{
                      marginTop: "5%",
                      fontSize: 14,
                      fontFamily: "Inter-Medium",
                    }}
                  >
                    To
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      marginTop: "5%",
                      backgroundColor: "#F9FAFB",
                      // paddingVertical: "5%",
                      borderRadius: 10,
                      height: windowHeight * 0.2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RulerPicker
                      value={selectedHeightTo / 30.48}
                      onValueChangeEnd={async number => {
                        let res = await calculateInches(number);
                        selectHeightTo(res);
                      }}
                      onValueChange={number => {
                        console.log("NUMBer", number);
                      }}
                      min={122}
                      max={245}
                      unit="ft"
                      height={100}
                      width={windowWidth * 0.8}
                      indicatorHeight={40}
                      indicatorColor={colors.primaryPink}
                      shortStepHeight={20}
                      longStepHeight={50}
                      valueTextStyle={{
                        color: colors.primaryPink,
                        fontSize: 20,
                      }}
                      unitTextStyle={{
                        color: colors.primaryPink,
                        fontSize: 17,
                      }}
                      step={2.54}
                      initialValue={122 / 30.48}
                    />
                  </View>
                </>
              ) : // <SliderView
              //   sp={{ marginVertical: "1%" }}
              //   searchPreferences
              //   textWithoutIconView
              //   multiSliderValue={
              //     heightSlider[0] !== null && heightSlider[1] !== null
              //       ? [heightSlider[0], heightSlider[1]]
              //       : [4, 10]
              //   }
              //   isMarkersSeparated={true}
              //   showSteps={true}
              //   multiSliderValuesChange={HeightSliderValuesChange}
              //   min={4}
              //   max={10}
              //   preferenceName={"Height"}
              //   customLabel="feet"
              //   enableLabel={true}
              //   step={0.1}
              //   bg={{ color: "red" }}
              // />
              type === "Age" && preferenceEdit ? (
                <>
                  <Divider />
                  <SliderView
                    sp={{ marginVertical: "1%" }}
                    searchPreferences
                    textWithoutIconView
                    multiSliderValue={
                      age[0] !== null && age[1] !== null
                        ? [age[0], age[1]]
                        : [18, 68]
                    }
                    isMarkersSeparated={true}
                    showSteps={true}
                    multiSliderValuesChange={AgeSliderValuesChange}
                    min={18}
                    max={68}
                    preferenceName={"Age"}
                    customLabel="age"
                    enableLabel={true}
                    step={1}
                    bg={{ color: "red" }}
                  />
                </>
              ) : type === "Tagline" ? (
                <View style={styles.textinputView}>
                  <TextInput
                    style={styles.textinput}
                    value={tagline}
                    onChangeText={text => {
                      setTagline(text);
                    }}
                    placeholder={`Remember first impressions count 😉`}
                    placeholderTextColor={"#9CA3AF"}
                  />
                </View>
              ) : type === "Main Vibes" ? (
                <View style={styles.scrollContainer}>
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
                    style={{ marginVertical: "2%" }}
                  >
                    {allVibes.length > 0 &&
                      allVibes.map((item, index) => {
                        let findIndex = selctedVibe?.map(newItem => {
                          return allVibes.findIndex(
                            item => item.name === newItem
                          );
                        });
                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectVibe(item, index)}
                            findIndex={findIndex}
                            index={index}
                            item={item}
                            multiSelect={true}
                            nameorid={"name"}
                            search={false}
                          />
                        );
                      })}
                  </ScrollView>
                  <View style={styles.customScrollBarBackground}>
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
              ) : type === "Prompts Pool" ? (
                !ppCheck ? (
                  <View style={styles.scrollContainer}>
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
                      {allPrompts.length > 0 &&
                        allPrompts.map((item, index) => {
                          let findIndex = selectedPP.map(newItem => {
                            return allPrompts.findIndex(
                              item => item?.id === newItem?.id
                            );
                          });

                          return (
                            <NewOnBoardingDesign
                              mainOnPress={() => selectPP(item, index)}
                              findIndex={findIndex}
                              index={index}
                              item={item}
                              multiSelect={true}
                              nameorid={"title"}
                              search={false}
                            />
                          );
                        })}
                    </ScrollView>
                    <View style={styles.customScrollBarBackground}>
                      <Animated.View
                        style={[
                          styles.customScrollBar,
                          {
                            height: scrollIndicatorSize,
                            transform: [
                              { translateY: scrollIndicatorPosition },
                            ],
                          },
                        ]}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        width: "100%",
                        borderWidth: 0.5,
                        borderColor: "#EBECEF",
                        marginVertical: "10%",
                      }}
                    ></View>
                    <Text style={styles.ask}>
                      {"“" + selectedPP[ppIndex]?.title + "”"}
                    </Text>
                    <View
                      style={{
                        marginVertical: Platform.OS === "ios" ? "5%" : "3%",
                        width: "95%",
                        backgroundColor: "#F9FAFB",
                        paddingVertical: "5%",
                        alignSelf: "center",
                      }}
                    >
                      <TextInput
                        numberOfLines={1}
                        style={styles.textinput}
                        value={
                          selectedPP[ppIndex]?.answer
                            ? selectedPP[ppIndex]?.answer
                            : ""
                        }
                        onChangeText={text => {
                          let copy = [...selectedPP];
                          copy[ppIndex] = {
                            ...copy[ppIndex],
                            answer: text,
                          };
                          setSelectedPP(copy);
                        }}
                        placeholder={`Remember first impressions count 😉`}
                        placeholderTextColor={"#9CA3AF"}
                      />
                    </View>
                  </View>
                )
              ) : type === "Height" ? (
                <>
                  <View
                    style={{
                      width: "100%",
                      borderWidth: 0.7,
                      alignSelf: "center",
                      borderColor: "#EBECEF",
                      marginBottom: 5,
                    }}
                  ></View>
                  <View style={styles.rulerView}>
                    <RulerPicker
                      value={selectedHeight / 30.48}
                      onValueChangeEnd={number =>
                        selectHeight((number / 30.48).toFixed(1))
                      }
                      min={92}
                      max={252}
                      unit="ft"
                      height={100}
                      width={windowWidth * 0.8}
                      // indicatorHeight={40}
                      indicatorColor={colors.primaryPink}
                      shortStepHeight={20}
                      longStepHeight={50}
                      valueTextStyle={{
                        color: colors.primaryPink,
                        fontSize: 20,
                      }}
                      unitTextStyle={{
                        color: colors.primaryPink,
                        fontSize: 17,
                      }}
                      step={5}
                      initialValue={92 / 30.48}
                    />
                  </View>
                </>
              ) : type === "Family Origin" ? (
                <>
                  <OnBoardingSearch
                    onChangeText={text => search(text, "familyOrigin")}
                    array={allProfileValues?.familyOrigin}
                    // currentIndex={currentIndex}
                    searchValue={searchValue}
                    search={true}
                    edit
                    placeholder={placeholder}
                    type={type}
                  />
                  <Text
                    onPress={onPressAll}
                    style={{
                      fontFamily: "Inter-SemiBold",
                      color: colors.primaryPink,
                      alignSelf: "flex-end",
                      fontSize: 16,
                      marginRight: 10,
                      marginBottom: -14,
                    }}
                  >
                    Select all
                  </Text>
                  <View style={styles.scrollContainer}>
                    <View style={{ height: windowHeight * 0.6 }}>
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
                        style={{
                          marginVertical: "5%",
                        }}
                      >
                        {filtered?.length > 0
                          ? filtered.map((item, index) => {
                              let findIndex = selectedFO.map(newItem => {
                                return filtered.findIndex(
                                  item => item?.name === newItem?.name
                                );
                              });
                              return (
                                <NewOnBoardingDesign
                                  mainOnPress={() => selectFO(item, index)}
                                  findIndex={findIndex}
                                  index={index}
                                  item={item}
                                  multiSelect={true}
                                  nameorid={"name"}
                                  search={true}
                                  radio={true}
                                />
                              );
                            })
                          : allProfileValues?.familyOrigin.length > 0 &&
                            allProfileValues?.familyOrigin.map(
                              (item, index) => {
                                let findIndex = selectedFO.map(newItem => {
                                  return allProfileValues?.familyOrigin.findIndex(
                                    item => item?.name === newItem?.name
                                  );
                                });

                                return (
                                  <NewOnBoardingDesign
                                    mainOnPress={() => selectFO(item, index)}
                                    findIndex={findIndex}
                                    index={index}
                                    item={item}
                                    multiSelect={true}
                                    nameorid={"name"}
                                    search={true}
                                    radio={true}
                                  />
                                );
                              }
                            )}
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
                            transform: [
                              { translateY: scrollIndicatorPosition },
                            ],
                          },
                        ]}
                      />
                    </View>
                  </View>
                </>
              ) : type === "Community" ? (
                <>
                  <OnBoardingSearch
                    onChangeText={text => search(text, "community")}
                    array={userData?.Profile?.community}
                    // currentIndex={userData?.Profile?.community}
                    searchValue={searchValue}
                    search={true}
                    edit
                    placeholder={placeholder}
                    type={type}
                  />
                  <View style={styles.scrollContainer}>
                    <View style={{ height: windowHeight * 0.6 }}>
                      <Text
                        onPress={onPressAllCommunity}
                        style={{
                          fontFamily: "Inter-SemiBold",
                          color: colors.primaryPink,
                          alignSelf: "flex-end",
                          fontSize: 16,
                          marginRight: 10,
                          marginBottom: -14,
                        }}
                      >
                        Select all
                      </Text>

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
                        style={{
                          marginVertical: "5%",
                        }}
                      >
                        {filtered?.length > 0
                          ? filtered.map((item, index) => {
                              let findIndex = selectedCommunity.map(newItem => {
                                return filtered.findIndex(
                                  item => item?.name === newItem?.name
                                );
                              });
                              return (
                                <NewOnBoardingDesign
                                  mainOnPress={() =>
                                    selectCommunity(item, index)
                                  }
                                  findIndex={findIndex}
                                  index={index}
                                  item={item}
                                  multiSelect={true}
                                  nameorid={"name"}
                                  search={true}
                                  radio={true}
                                />
                              );
                            })
                          : allProfileValues?.community?.length > 0 &&
                            allProfileValues?.community.map((item, index) => {
                              let findIndex = selectedCommunity.map(newItem => {
                                return allProfileValues?.community.findIndex(
                                  item => item?.name === newItem?.name
                                );
                              });
                              return (
                                <NewOnBoardingDesign
                                  mainOnPress={() =>
                                    selectCommunity(item, index)
                                  }
                                  findIndex={findIndex}
                                  index={index}
                                  item={item}
                                  multiSelect={true}
                                  nameorid={"name"}
                                  search={true}
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
                            transform: [
                              { translateY: scrollIndicatorPosition },
                            ],
                          },
                        ]}
                      />
                    </View>
                  </View>
                </>
              ) : type === "Languages" ? (
                <>
                  <OnBoardingSearch
                    onChangeText={text => search(text, "language")}
                    array={userData?.UserLanguages}
                    // currentIndex={currentIndex}
                    searchValue={searchValue}
                    search={true}
                    edit
                    placeholder={placeholder}
                    type={type}
                  />
                  <View style={styles.scrollContainer}>
                    <View style={{ height: windowHeight * 0.6 }}>
                      <Text
                        onPress={onPressAllLanguages}
                        style={{
                          fontFamily: "Inter-SemiBold",
                          color: colors.primaryPink,
                          alignSelf: "flex-end",
                          fontSize: 16,
                          marginRight: 10,
                          marginBottom: -14,
                        }}
                      >
                        Select all
                      </Text>
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
                        style={{
                          marginVertical: "5%",
                        }}
                      >
                        {filtered?.length > 0
                          ? filtered.map((item, index) => {
                              let findIndex = selectedLanguage.map(newItem => {
                                return filtered.findIndex(
                                  item => item?.name === newItem?.name
                                );
                              });
                              return (
                                <NewOnBoardingDesign
                                  mainOnPress={() =>
                                    selectLanguage(item, index)
                                  }
                                  findIndex={findIndex}
                                  index={index}
                                  item={item}
                                  multiSelect={true}
                                  nameorid={"name"}
                                  search={true}
                                  radio={true}
                                />
                              );
                            })
                          : allProfileValues?.language.length > 0 &&
                            allProfileValues?.language.map((item, index) => {
                              let findIndex = selectedLanguage.map(newItem => {
                                return allProfileValues?.language.findIndex(
                                  item => item?.name === newItem?.name
                                );
                              });
                              return (
                                <NewOnBoardingDesign
                                  mainOnPress={() =>
                                    selectLanguage(item, index)
                                  }
                                  findIndex={findIndex}
                                  index={index}
                                  item={item}
                                  multiSelect={true}
                                  nameorid={"name"}
                                  search={true}
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
                            transform: [
                              { translateY: scrollIndicatorPosition },
                            ],
                          },
                        ]}
                      />
                    </View>
                  </View>
                </>
              ) : type === "Denomination" && edit ? (
                <View style={styles.scrollContainer}>
                  <View style={{ height: windowHeight * 0.6 }}>
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
                      style={{
                        marginVertical: "5%",
                      }}
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
              ) : type === "Denomination" && preferenceEdit ? (
                <View style={styles.scrollContainer}>
                  <View style={{ maxHeight: windowHeight * 0.6 }}>
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
                      style={{
                        marginVertical: "5%",
                      }}
                    >
                      {/* <Text
                        onPress={onPressAllDenomination}
                        style={{
                          fontFamily: "Inter-SemiBold",
                          color: colors.primaryPink,
                          alignSelf: "flex-end",
                          fontSize: 16,
                          marginRight: 10,
                          marginBottom: 0,
                        }}
                      >
                        Select all
                      </Text> */}
                      {userData?.UserPreference?.religion !== undefined &&
                        userData?.UserPreference?.religion.map(
                          (rel, relIndex) =>
                            allProfileValues?.denomination[rel]?.length > 0 ? (
                              allProfileValues?.denomination[rel].map(
                                (item, index) => {
                                  let findIndex = selectedDenomination.map(
                                    newItem => {
                                      return allProfileValues?.denomination[
                                        rel
                                      ].findIndex(
                                        item => item.name == newItem.name
                                      );
                                    }
                                  );
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
                                }
                              )
                            ) : (
                              <View
                                key={`no-denomination-${relIndex}`}
                                style={{
                                  width: "100%",
                                  height: 200,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 20,
                                    fontFamily: "Inter-Medium",
                                    color: colors.black,
                                  }}
                                >
                                  Please Select Religion First
                                </Text>
                              </View>
                            )
                        )}
                    </ScrollView>
                  </View>

                  {userData?.UserPreference?.religion != undefined && (
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
                            transform: [
                              { translateY: scrollIndicatorPosition },
                            ],
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>
              ) : type === "Education Level" ? (
                elArray.length > 0 &&
                elArray.map((item, index) => {
                  let findIndex = elArray.findIndex((item, index) => {
                    return item?.name === selectedEL?.name;
                  });
                  return (
                    <NewOnBoardingDesign
                      mainOnPress={() => selectEL(item, index)}
                      findIndex={findIndex}
                      index={index}
                      item={item}
                      multiSelect={false}
                      nameorid={"name"}
                      search={false}
                      radio={true}
                    />
                  );
                })
              ) : type === "Occupation" ? (
                <View style={styles.textinputView}>
                  <TextInput
                    style={styles.textinput}
                    value={occupation}
                    onChangeText={text => {
                      setOccupation(text);
                    }}
                    placeholder={`Occupation Ex. Designer etc`}
                    placeholderTextColor={"#9CA3AF"}
                  />
                </View>
              ) : type === "Practicing Level" ? (
                <View style={{ marginVertical: "5%" }}>
                  <RenderSlider
                    min={1}
                    max={4}
                    stepsAs={plArray}
                    showSteps={true}
                    showStepLabels={true}
                    // prefName='Please make a selection:'
                    customLabel={"practicingLevel"}
                  />
                </View>
              ) : type === "Pray" ? (
                <>
                  <Text
                    onPress={onPressAllPray}
                    style={{
                      fontFamily: "Inter-SemiBold",
                      color: colors.primaryPink,
                      alignSelf: "flex-end",
                      fontSize: 16,
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                  >
                    Select all
                  </Text>
                  {prayArray.map((item, index) => {
                    let findIndex = selectedPray.map(newItem => {
                      return prayArray.findIndex(
                        item => item?.name === newItem?.name
                      );
                    });
                    return (
                      <NewOnBoardingDesign
                        key={index}
                        mainOnPress={() => selectPray(item, index)}
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
                </>
              ) : type === "Drink" ? (
                <>
                  <Text
                    onPress={onPressAllDrink}
                    style={{
                      fontFamily: "Inter-SemiBold",
                      color: colors.primaryPink,
                      alignSelf: "flex-end",
                      fontSize: 16,
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                  >
                    Select all
                  </Text>
                  {drinkArray.map((item, index) => {
                    let findIndex = selectedDrink.map(newItem => {
                      return drinkArray.findIndex(
                        drinkitem => drinkitem?.name === newItem?.name
                      );
                    });
                    return (
                      <NewOnBoardingDesign
                        key={index}
                        mainOnPress={() => selectDrink(item, index)}
                        findIndex={findIndex}
                        index={index}
                        item={item}
                        multiSelect={true}
                        nameorid={"name"}
                        search={false}
                        icon={true}
                      />
                    );
                  })}
                </>
              ) : type === "Smoke" ? (
                <>
                  <Text
                    onPress={onPressAllSmoke}
                    style={{
                      fontFamily: "Inter-SemiBold",
                      color: colors.primaryPink,
                      alignSelf: "flex-end",
                      fontSize: 16,
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                  >
                    Select all
                  </Text>
                  {smokeArray.map((item, index) => {
                    let findIndex = selectedSmoke.map(newItem => {
                      return smokeArray.findIndex(
                        smokeItem => smokeItem?.name === newItem?.name
                      );
                    });
                    return (
                      <NewOnBoardingDesign
                        key={index}
                        mainOnPress={() => selectSmoke(item, index)}
                        findIndex={findIndex}
                        index={index}
                        item={item}
                        multiSelect={true}
                        nameorid={"name"}
                        search={false}
                        icon={true}
                      />
                    );
                  })}
                </>
              ) : type === "Diet" ? (
                <>
                  <Text
                    onPress={onPressAllDiet}
                    style={{
                      fontFamily: "Inter-SemiBold",
                      color: colors.primaryPink,
                      alignSelf: "flex-end",
                      fontSize: 16,
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                  >
                    Select all
                  </Text>
                  {dietArray.map((item, index) => {
                    let findIndex = selectedDiet.map(newItem => {
                      return dietArray.findIndex(
                        dietItem => dietItem?.name === newItem?.name
                      );
                    });
                    return (
                      <NewOnBoardingDesign
                        key={index}
                        mainOnPress={() => selectDiet(item, index)}
                        findIndex={findIndex}
                        index={index}
                        item={item}
                        multiSelect={true}
                        nameorid={"name"}
                        search={false}
                        icon={true}
                      />
                    );
                  })}
                </>
              ) : type === "Marital History" ? (
                mhArray.map((item, index) => {
                  let findIndex = mhArray.findIndex((item, index) => {
                    return item?.name === selectedMH?.name;
                  });
                  return (
                    <NewOnBoardingDesign
                      mainOnPress={() => selectMh(item, index)}
                      findIndex={findIndex}
                      index={index}
                      item={item}
                      multiSelect={false}
                      nameorid={"name"}
                      search={false}
                      radio={true}
                    />
                  );
                })
              ) : type === "Marriage Timeline" ? (
                <View style={{ marginVertical: "5%" }}>
                  <RenderMarriageSlider
                    min={1}
                    max={4}
                    stepsAs={mtArray}
                    showSteps={true}
                    showStepLabels={true}
                    // prefName='Please make a selection:'
                    customLabel={"marriageTimeline"}
                  />
                </View>
              ) : type === "Have Kids" ? (
                ynArray.map((item, index) => {
                  let findIndex = ynArray.findIndex((item, index) => {
                    return item?.name === selectedHK;
                  });
                  return (
                    <NewOnBoardingDesign
                      mainOnPress={() => selectHK(item, index)}
                      findIndex={findIndex}
                      index={index}
                      item={item}
                      multiSelect={false}
                      nameorid={"name"}
                      search={false}
                      radio={true}
                    />
                  );
                })
              ) : type === "Want Kids" ? (
                ynArray.map((item, index) => {
                  let findIndex = ynArray.findIndex((item, index) => {
                    return item?.name === selectedWK;
                  });
                  return (
                    <NewOnBoardingDesign
                      mainOnPress={() => selectWK(item, index)}
                      findIndex={findIndex}
                      index={index}
                      item={item}
                      multiSelect={false}
                      nameorid={"name"}
                      search={false}
                      radio={true}
                    />
                  );
                })
              ) : type === "Relocate" ? (
                ynArray.map((item, index) => {
                  let findIndex = ynArray.findIndex((item, index) => {
                    return item?.name === selectedRelocate;
                  });
                  return (
                    <NewOnBoardingDesign
                      mainOnPress={() => selectRelocate(item, index)}
                      findIndex={findIndex}
                      index={index}
                      item={item}
                      multiSelect={false}
                      nameorid={"name"}
                      search={false}
                      radio={true}
                    />
                  );
                })
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <BottomButton
        bottomStyles={{ bottom: isKeyboardVisible && android ? 2 : 15 }}
        loading={buttonLoader}
        text={edit ? "Update" : "Save Search preferences"}
        onPress={updateProfile}
      />
    </>
  );
};
export default EditScreenSetting;
const styles = StyleSheet.create({
  textinput: {
    // minWidth: '60%',
    // maxWidth: '80%',
    fontSize: 14,
    color: colors.black,
    paddingVertical: "2%",
    paddingHorizontal: "3%",
  },
  textinputView: {
    marginVertical: Platform.OS === "ios" ? "5%" : "3%",
    width: "90%",
    backgroundColor: "#F9FAFB",
    paddingVertical: "5%",
    alignSelf: "center",
  },
  rulerView: {
    width: "100%",
    alignItems: "center",
    marginTop: "15%",
    backgroundColor: "#F9FAFB",
    paddingVertical: "5%",
    borderRadius: 10,
  },
  scrollContainer: {
    flexDirection: "row",
    width: "100%",
  },
  ask: {
    fontSize: 24,
    color: "#111827",
    fontFamily: "Inter-Bold",
    marginVertical: "1%",
    // maxWidth: '90%',
  },
  line: {
    fontSize: 16,
    color: colors.textGrey1,
    fontFamily: "Inter-Regular",
    marginVertical: "4%",
    maxWidth: "90%",
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
  countView: {
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#23262F",
  },
  countText: { fontSize: 14, color: colors.white, fontFamily: "Inter-Regular" },
});
