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
  const { edit, type, index, ask, line, preferenceEdit } = props?.route?.params;
  const [tagline, setTagline] = useState("");
  const [selctedVibe, setSelectedVibe] = useState([]);
  const [selectedDenomination, setSelectedDenomination] = useState(null);
  const [selectedPray, setSelectedPray] = useState(null);
  const [selectedMH, setSelectedMH] = useState(null);
  const [selectedHK, setSelectedHK] = useState(null);
  const [selectedWK, setSelectedWK] = useState(null);
  const [selectedRelocate, setSelectedRelocate] = useState(null);
  const [distance, setDistance] = useState(null);
  let [distanceSlider, setDistanceSlider] = useState();
  const [selectedDrink, setSelectedDrink] = useState(null);
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
    { name: "Doctorate" },
    { name: "Masters" },
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
      arr = {
        ...arr,
        name: edit
          ? userData?.Profile?.familyOrigin
          : preferenceEdit
          ? userData?.UserPreference?.familyOrigin
          : null,
      };
      setSelectedFO([arr]);
    } else if (type === "Community") {
      let arr;
      arr = {
        ...arr,
        name: edit
          ? userData?.Profile?.community
          : preferenceEdit
          ? userData?.UserPreference?.community
          : null,
      };
      setSelectedCommunity([arr]);
    } else if (type === "Languages") {
      if (preferenceEdit) {
        let arr = [];
        arr = {
          ...arr,
          name: userData?.UserPreference?.languagesSpoken,
        };
        setSelectedLanguage([arr]);
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
      arr = {
        ...arr,
        name: edit
          ? userData?.Profile?.denomination
          : preferenceEdit
          ? userData?.UserPreference?.religiousDenomination
          : null,
      };
      setSelectedDenomination(arr);
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
      arr = {
        ...arr,
        name: edit
          ? userData?.Profile?.iPray
          : preferenceEdit
          ? userData?.UserPreference?.theyPray
          : null,
      };
      setSelectedPray(arr);
    } else if (type === "Drink") {
      let arr = [];
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
      setSelectedDrink(arr);
    } else if (type === "Smoke") {
      if (preferenceEdit) {
        let arr = [];
        arr = {
          ...arr,
          name: userData?.UserPreference?.smoking,
        };
        setSelectedSmoke([arr]);
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
      if (preferenceEdit) {
        let arr = [];
        arr = {
          ...arr,
          name: userData?.UserPreference?.dietChoices,
        };
        setSelectedDiet([arr]);
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
      (userData?.UserPreference?.distance === "Unlimited" ||
        userData?.UserPreference?.distance === "Nationwide") &&
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
  const selectFO = (item, index) => {
    if (preferenceEdit) {
      setSelectedFO([item]);
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
  const selectLanguage = (item, index) => {
    if (preferenceEdit) {
      setSelectedLanguage([item]);
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
  const selectDenomination = (item, index) => {
    setSelectedDenomination(item);
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
  const selectCommunity = (item, index) => {
    if (preferenceEdit) {
      setSelectedCommunity([item]);
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
  const selectPray = (item, index) => {
    setSelectedPray(item);
  };
  const selectDrink = (item, index) => {
    setSelectedDrink(item);
  };
  const selectSmoke = (item, index) => {
    if (preferenceEdit) {
      setSelectedSmoke([item]);
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
  const selectDiet = (item, index) => {
    if (preferenceEdit) {
      setSelectedDiet([item]);
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
    value = value.map(item => {
      return parseInt(item);
    });

    setAge(value);
  };

  const updateProfile = async () => {
    if (edit) {
      let formData = new FormData();
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
                console.log("CHECCK", check);

                formData.append(`profilePrompts[${ind}][questionId]`, el?.id);
                formData.append(`profilePrompts[${ind}][answer]`, el.answer);
                formData.append(
                  `profilePrompts[${ind}][operation]`,
                  !check && el?.selected ? "delete" : check ? "update" : "add"
                );
              });
              console.log("FORM DATA", formData);
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
              formData.append(`languages[]`, x?.name);
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
              : distance;
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
          value = filteredFO[0]?.name;
          break;
        case "Community":
          sendType = "community";
          value = filteredCommuntiy[0]?.name;
          break;
        case "Languages":
          sendType = "languagesSpoken";
          value = selectedLanguage[0]?.name;
          break;
        case "Denomination":
          sendType = "religiousDenomination";
          value = selectedDenomination?.name;
          break;

        case "Pray":
          sendType = "theyPray";
          value = selectedPray?.name;
          break;
        case "Drink":
          sendType = "drinking";
          value = selectedDrink?.name;
          break;
        case "Smoke":
          sendType = "smoking";
          value = selectedSmoke[0]?.name;
          break;
        case "Diet":
          sendType = "dietChoices";
          value = selectedDiet[0]?.name;
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
  console.log(
    "SELECTED HEIGHT FROM",
    userData,
    selectedHeightTo,
    distanceSlider
  );

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
                      return item === distance;
                    });

                    return (
                      <NewOnBoardingDesign
                        mainOnPress={() => selectDistance(item, index)}
                        findIndex={findIndex}
                        index={index}
                        item={item}
                        multiSelect={false}
                        nameorid={"name"}
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
                          userData?.UserPreference?.distance === "Unlimited" ||
                          userData?.UserPreference?.distance === "Nationwide"
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
                        console.log("RES", res);
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
                        console.log("RES", res);
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
                <SliderView
                  sp={{ marginVertical: "1%" }}
                  searchPreferences
                  textWithoutIconView
                  multiSliderValue={
                    age[0] !== null && age[1] !== null
                      ? [parseInt(age[0]), parseInt(age[1])]
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
                  step={0.1}
                  bg={{ color: "red" }}
                />
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
                    type={type}
                  />
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
                    type={type}
                  />
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
                    type={type}
                  />
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
                      {allProfileValues?.denomination[
                        userData?.Profile?.religion
                      ].length > 0 &&
                        allProfileValues?.denomination[
                          userData?.Profile?.religion
                        ].map((item, index) => {
                          let findIndex = allProfileValues?.denomination[
                            userData?.Profile?.religion
                          ]?.findIndex((item, index) => {
                            return item?.name === selectedDenomination?.name;
                          });
                          return (
                            <NewOnBoardingDesign
                              mainOnPress={() =>
                                selectDenomination(item, index)
                              }
                              findIndex={findIndex}
                              index={index}
                              item={item}
                              multiSelect={false}
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
                      {allProfileValues?.denomination[
                        userData?.UserPreference?.religion
                      ].length > 0 ? (
                        allProfileValues?.denomination[
                          userData?.UserPreference?.religion
                        ].map((item, index) => {
                          let findIndex = allProfileValues?.denomination[
                            userData?.UserPreference?.religion
                          ]?.findIndex((item, index) => {
                            return item?.name === selectedDenomination?.name;
                          });
                          return (
                            <NewOnBoardingDesign
                              mainOnPress={() =>
                                selectDenomination(item, index)
                              }
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
                      ) : (
                        <View
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
                          transform: [{ translateY: scrollIndicatorPosition }],
                        },
                      ]}
                    />
                  </View>
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
                prayArray.map((item, index) => {
                  let findIndex = prayArray.findIndex((item, index) => {
                    return item?.name === selectedPray?.name;
                  });
                  return (
                    <NewOnBoardingDesign
                      mainOnPress={() => selectPray(item, index)}
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
              ) : type === "Drink" ? (
                drinkArray.map((item, index) => {
                  let findIndex = drinkArray.findIndex((item, index) => {
                    return item?.name === selectedDrink?.name;
                  });
                  return (
                    <NewOnBoardingDesign
                      mainOnPress={() => selectDrink(item, index)}
                      findIndex={findIndex}
                      index={index}
                      item={item}
                      multiSelect={false}
                      nameorid={"name"}
                      search={false}
                      icon={true}
                    />
                  );
                })
              ) : type === "Smoke" ? (
                smokeArray.map((item, index) => {
                  let findIndex = selectedSmoke.map(newItem => {
                    return smokeArray.findIndex(
                      item => item?.name === newItem?.name
                    );
                  });
                  return (
                    <NewOnBoardingDesign
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
                })
              ) : type === "Diet" ? (
                dietArray.map((item, index) => {
                  let findIndex = selectedDiet.map(newItem => {
                    return dietArray.findIndex(
                      item => item?.name === newItem?.name
                    );
                  });
                  return (
                    <NewOnBoardingDesign
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
                })
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
        text={"Save search preference"}
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
