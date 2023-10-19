import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnBoardingServices, UserService } from "../../../services";
import { useHelper } from "../../../hooks/useHelper";
import { alerts } from "../../../utility/regex";
import { useDispatch, useSelector } from "react-redux";
import { RulerPicker } from "react-native-ruler-picker";
import { android, ios, windowHeight, windowWidth } from "../../../utility/size";

import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import BottomButton from "../../../components/buttons/BottomButton";
import SliderView from "../../../components/Modal/Slider";
import NewOnBoardingDesign from "../../../components/NewOnBoardingDesign";
import OnBoardingSearch from "../../../components/OnBoardingSearch";

let filtered = [];

const OnBoardingQuestions = ({ navigation }) => {
  const { token } = useSelector((store) => store.userReducer);
  const {
    vibes,
    promptsPool,
    height,
    familyOrigin,
    community,
    language,
    educationLevel,
    occupation1,
    denomination,
    practicingLevel,
    pray,
    drink,
    smoke,
    dietChoices,
    religion,
    wholeArray,
    marriageTimeline,
    maritalHistory,
    haveKids,
    wantKids,
    relocate,
    tagline1,
  } = useSelector((store) => store.NewOnBoardingReducer);
  let roundedHeight = height;
  const dispatch = useDispatch();
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

  const {
    handleLocation,
    handleStatusCode,
    Alerts,
    setOffset,
    keyboardOffset,
  } = useHelper();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selctedVibe, setSelectedVibe] = useState([]);
  const [selectedReligion, setSelectedReligion] = useState(null);
  const [selectedDenomination, setSelectedDenomination] = useState(null);
  const [selectedPray, setSelectedPray] = useState(null);
  const [selectedMH, setSelectedMH] = useState(null);
  const [selectedHK, setSelectedHK] = useState(null);
  const [selectedWK, setSelectedWK] = useState(null);
  const [selectedRelocate, setSelectedRelocate] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [selectedSmoke, setSelectedSmoke] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState([]);
  const [selectedPP, setSelectedPP] = useState([]);
  const [selectedFO, setSelectedFO] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [selectedEL, setSelectedEL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [occupation, setOccupation] = useState("");
  const [tagline, setTagline] = useState("");
  let [sliderVal, setSliderVal] = useState([1]);
  let [sliderMarriageVal, setSliderMarriageVal] = useState([1]);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [responseText, setResponseText] = useState(null);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [ppCheck, setPPCheck] = useState(false);
  const [ppIndex, setPPIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (vibes && vibes.length > 0) {
      setSelectedVibe(vibes);
    }
    if (promptsPool && promptsPool.length > 0) {
      setSelectedPP(promptsPool);
    }
    if (familyOrigin && familyOrigin.length > 0) {
      setSelectedFO(familyOrigin);
    }
    if (height !== null) {
      setSelectedHeight(height);
    }

    if (community && community.length > 0) {
      setSelectedCommunity(community);
    }
    if (language && language.length > 0) {
      setSelectedLanguage(language);
    }
    if (educationLevel) {
      setSelectedEL(educationLevel);
    }
    if (occupation1) {
      setOccupation(occupation1);
    }
    if (denomination) {
      setSelectedDenomination(denomination);
    }
    if (practicingLevel) {
      if (practicingLevel === "Rarely Religious") {
        setSliderVal([1]);
      } else if (practicingLevel === "Somewhat Religious") {
        setSliderVal([2]);
      } else if (practicingLevel === "Religious") {
        setSliderVal([3]);
      } else if (practicingLevel === "Strongly Religious") {
        setSliderVal([4]);
      } else {
        setSliderVal([1]);
      }
    }
    if (marriageTimeline) {
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
    }
    if (pray) {
      setSelectedPray(pray);
    }
    if (drink) {
      setSelectedDrink(drink);
    }
    if (smoke && smoke.length > 0) {
      setSelectedSmoke(smoke);
    }
    if (dietChoices && dietChoices.length > 0) {
      setSelectedDiet(dietChoices);
    }
    if (maritalHistory) {
      setSelectedMH(maritalHistory);
    }
    if (haveKids) {
      setSelectedHK(haveKids);
    }
    if (wantKids) {
      setSelectedWK(wantKids);
    }
    if (relocate) {
      setSelectedRelocate(relocate);
    }
    if (tagline1) {
      setTagline(tagline1);
    }
  }, []);

  const [array, setArray] = useState([
    {
      id: 1,
      type: "Main Vibes",
      question: `What are your vibes?`,
      ask: "Share your essence with others by selecting 8 vibes.",
      options: [],
      search: false,
      multiSelect: true,
      heading: "Main Vibes",
    },
    {
      id: 2,
      type: "Prompts Pool",
      question: `Spark conversations`,
      ask: "Share yourself with 3 prompts.",
      options: [],
      search: false,
      multiSelect: true,
      heading: "Prompts Pool",
    },
    {
      id: 3,
      type: "Height",
      question: `What’s your height?`,
      ask: "",
      options: [],
      search: false,
      multiSelect: false,
      heading: "About me",
    },
    {
      id: 4,
      type: "Family Origin",
      question: `What is your family origin?`,
      ask: "",
      options: [],
      search: true,
      multiSelect: true,
      heading: "Ethnicity",
    },
    {
      id: 5,
      type: "Community",
      question: `What is your community?`,
      ask: "",
      options: [],
      search: true,
      multiSelect: true,
      heading: "Ethnicity",
    },
    {
      id: 6,
      type: "Language",
      question: `What is your language?`,
      ask: "",
      options: [],
      search: true,
      multiSelect: true,
      heading: "Ethnicity",
    },
    {
      id: 7,
      type: "Education Level",
      question: `What is your education level?`,
      ask: "",
      options: [
        { name: "High School" },
        { name: "Bachelors" },
        { name: "Doctorate" },
        { name: "Masters" },
      ],
      search: false,
      multiSelect: false,
      heading: "Education and career",
    },

    {
      id: 8,
      type: "Occupation",
      question: `What is your occupation?`,
      ask: "",
      options: [],
      search: false,
      multiSelect: false,
      heading: "Education and career",
    },
    // {
    //   id: 8,
    //   type: 'Religion',
    //   question: `What is your religion?`,
    //   ask: 'Please Select one of the religion',
    //   options: [],
    //   search: false,
    //   multiSelect: false,
    // },
    {
      id: 9,
      type: "Denomination",
      question: `What is your denomination?`,
      ask: "",
      options: [],
      search: false,
      multiSelect: false,
      heading: "Religion",
    },
    {
      id: 10,
      type: "Practicing Level",
      question: `What is your practicing level?`,
      ask: "",
      options: [
        { index: 0, stepLabel: "Rarely Religious" },
        { index: 1, stepLabel: "Somewhat Religious" },
        { index: 2, stepLabel: "Religious" },
        { index: 3, stepLabel: "Strongly Religious" },
      ],
      search: false,
      multiSelect: false,
      heading: "Religion",
    },
    {
      id: 11,
      type: "Pray",
      question: `How often do you pray?`,
      ask: "",
      options: [
        { name: "Don't pray" },
        { name: "Sometimes" },
        { name: "Often" },
        { name: "Regularly" },
      ],
      search: false,
      multiSelect: false,
      heading: "Religion",
    },
    {
      id: 12,
      type: "Drink",
      question: `Do you drink?`,
      ask: "",
      options: [
        {
          name: "I Drink",
          icon: require("../../../assets/iconimages/yes-drink.png"),
        },
        {
          name: "Sometimes, Socially",
          icon: require("../../../assets/iconimages/socially-drink.png"),
        },
        {
          name: `I Don’t Drink`,
          icon: require("../../../assets/iconimages/no-drinks.png"),
        },
      ],
      search: false,
      multiSelect: false,
      heading: "Lifestyle",
    },
    {
      id: 13,
      type: "Smoke",
      question: `Do you smoke?`,
      ask: "",
      options: [
        {
          name: "Hookah",
          icon: require("../../../assets/iconimages/hookahicon.png"),
        },
        {
          name: "Cigarette",
          icon: require("../../../assets/iconimages/cigaretteicon.png"),
        },
        {
          name: `Weed`,
          icon: require("../../../assets/iconimages/weedicon.png"),
        },
        {
          name: `None`,
          icon: require("../../../assets/iconimages/smileyicon.png"),
        },
      ],
      search: false,
      multiSelect: true,
      heading: "Lifestyle",
    },
    {
      id: 14,
      type: "Diet",
      question: `What are your diet choices?`,
      ask: "",
      options: [
        {
          name: "Halal",
          icon: require("../../../assets/iconimages/halalicon.png"),
        },
        {
          name: "Vegan",
          icon: require("../../../assets/iconimages/veganicon.png"),
        },
        {
          name: `Anything`,
          icon: require("../../../assets/iconimages/dieticon.png"),
        },
      ],
      search: false,
      multiSelect: true,
      heading: "Lifestyle",
    },
    {
      id: 15,
      type: "Marital History",
      question: `Marital History`,
      ask: "",
      options: [
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
      ],
      search: false,
      multiSelect: false,
      heading: "Marital history",
    },
    {
      id: 16,
      type: "Marriage Timeline",
      question: `When do you want to get married?`,
      ask: "",
      options: [
        { index: 0, stepLabel: "1 Year" },
        { index: 1, stepLabel: "2 Years" },
        { index: 2, stepLabel: "3 Years" },
        { index: 3, stepLabel: "4 Years" },
      ],
      search: false,
      multiSelect: false,
      heading: "Marital history",
    },
    {
      id: 17,
      type: "Have Kids",
      question: `Do you have Kids?`,
      ask: "",
      options: [
        {
          name: "Yes",
        },
        {
          name: "No",
        },
      ],
      search: false,
      multiSelect: false,
      heading: "Marital history",
    },
    {
      id: 18,
      type: "Want Kids",
      question: `Do you want Kids?`,
      ask: "",
      options: [
        {
          name: "Yes",
        },
        {
          name: "No",
        },
      ],
      search: false,
      multiSelect: false,
      heading: "Marital history",
    },
    {
      id: 19,
      type: "Relocate",
      question: `Are you willing to relocate?`,
      ask: "",
      options: [
        {
          name: "Yes",
        },
        {
          name: "No",
        },
      ],
      search: false,
      multiSelect: false,
      heading: "Marital history",
    },
    {
      id: 20,
      type: "Tagline",
      question: `Write something witty to introduce yourself?`,
      options: [],
      search: false,
      multiSelect: false,
      heading: "Tagline",
    },
  ]);

  useEffect(() => {
    setLoading(true);
    let copyarr = [...array];
    OnBoardingServices.vibesListing()
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let sortedData = res?.data?.data
            .map((x) => ({ name: x?.name, id: x?.id }))
            .sort((a, b) => {
              if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
              if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              return 0;
            });
          console.log("sortedData", sortedData);
          dispatch({
            type: "allVibes",
            payload: sortedData,
          });

          let find = copyarr.findIndex((item, index) => {
            return item?.type === "Main Vibes";
          });

          copyarr[find] = {
            ...copyarr[find],
            options: sortedData,
          };

          UserService.getQuestions()
            .then((res) => {
              handleStatusCode(res);
              if (res.status >= 200 && res.status <= 299) {
                let sortedData = res.data.data.sort((a, b) => {
                  if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                  if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                  return 0;
                });
                console.log("SORTEDDATA123", sortedData, res?.data?.data);

                dispatch({
                  type: "allPrompts",
                  payload: sortedData,
                });
                let findIndex = copyarr.findIndex((item) => {
                  return item?.type === "Prompts Pool";
                });
                copyarr[findIndex] = {
                  ...copyarr[findIndex],
                  options: sortedData,
                };

                setArray(copyarr);
                // setPrompts(
                //   res.data.data.sort((a, b) => {
                //     if (a.title.toLowerCase() < b.title.toLowerCase())
                //       return -1;
                //     if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                //     return 0;
                //   }),
                // );
              }
            })
            .catch((err) => console.log("getQuestions err", err));
        }
      })
      .catch((err) => console.log("vibesListing err", err));

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
      .then(async (res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: "allProfileValues",
            payload: res?.data?.data,
          });

          let data = res?.data?.data;

          let find = copyarr.findIndex((item) => {
            return item?.type === "Family Origin";
          });
          let findCommunityIndex = copyarr.findIndex((item) => {
            return item?.type === "Community";
          });
          let findLanguageIndex = copyarr.findIndex((item) => {
            return item?.type === "Language";
          });
          let findReligionIndex = copyarr.findIndex((item) => {
            return item?.type === "Religion";
          });
          let findDenominationIndex = copyarr.findIndex((item) => {
            return item?.type === "Denomination";
          });

          let religionArray = await Object.keys(data?.denomination)
            .map((x) => ({ name: x }))
            .sort((a, b) => {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            });

          copyarr[find] = {
            ...copyarr[find],
            options: data?.familyOrigin,
          };
          copyarr[findCommunityIndex] = {
            ...copyarr[findCommunityIndex],
            options: data?.community,
          };
          copyarr[findLanguageIndex] = {
            ...copyarr[findLanguageIndex],
            options: data?.language,
          };
          copyarr[findReligionIndex] = {
            ...copyarr[findReligionIndex],
            options: religionArray,
          };
          let passingIndex = religion?.name;

          let denominations = data?.denomination[religion?.name || religion];
          copyarr[findDenominationIndex] = {
            ...copyarr[findDenominationIndex],
            options: denominations,
          };
          setArray(copyarr);
        }
      })
      .catch((err) => console.log("profileValues err", err))
      .finally(() => setLoading(false));
  }, []);

  const selectVibe = (item, index) => {
    let arr = [...selctedVibe];
    let check = arr.some((item1) => {
      return item1?.id === item?.id;
    });
    if (arr.length < 8 && check === false) {
      arr.push(item);
      setSelectedVibe(arr);
      dispatch({
        type: "vibes",
        payload: arr,
      });
    } else if (check === true) {
      let filtered = arr.filter((item1) => {
        return item1?.id !== item?.id;
      });
      setSelectedVibe(filtered);
      dispatch({
        type: "vibes",
        payload: filtered,
      });
    }
  };
  const selectPP = (item, index) => {
    let arr = [...selectedPP];
    let check = arr.some((item1) => {
      return item1?.id === item?.id;
    });
    if (arr.length < 3 && check === false) {
      arr.push(item);
      setSelectedPP(arr);
      dispatch({
        type: "promptsPool",
        payload: arr,
      });
    } else if (check === true) {
      let filtered = arr.filter((item1) => {
        return item1?.id !== item?.id;
      });
      setSelectedPP(filtered);
      dispatch({
        type: "promptsPool",
        payload: filtered,
      });
    }

    // let arr = [...selectedPP];
    // let selectedOptions = wholeArray[currentIndex]?.options;
    // let check = arr.some(item1 => {
    //   return item1?.id === item?.id;
    // });
    // if (arr.length < 3 && check === false) {
    //   arr.push(item);
    //   setSelectedPP(arr);
    //   dispatch({
    //     type: 'promptsPool',
    //     payload: arr,
    //   });
    // } else if (check === true) {
    //   let filtered = arr.filter(item1 => {
    //     return item1?.id !== item?.id;
    //   });
    //   let optionsFiltered = selectedOptions.filter(item3 => {
    //     return item3?.id !== item?.id;
    //   });

    //   const newNumbers = [
    //     ...optionsFiltered.slice(0, index),
    //     {id: item?.id, title: item?.title},
    //     ...optionsFiltered.slice(index),
    //   ];
    //   let copywholeArray = [...wholeArray];
    //   copywholeArray[currentIndex] = {
    //     ...copywholeArray[currentIndex],
    //     options: newNumbers,
    //   };
    //   dispatch({
    //     type: 'wholeArray',
    //     payload: copywholeArray,
    //   });

    //   setSelectedPP(filtered);
    //   dispatch({
    //     type: 'promptsPool',
    //     payload: filtered,
    //   });
    // }
  };

  const selectHeight = (number) => {
    setSelectedHeight(number);
    dispatch({
      type: "height",
      payload: number,
    });
  };

  const selectFO = (item, index) => {
    let arr = [...selectedFO];

    let check2 = arr.some((item1) => {
      return item1?.name === item?.name;
    });

    let check = arr.some((item1) => {
      return item1?.name === "Not Specified";
    });
    if (check && item?.name !== "Not Specified") {
      arr = [];
      arr.push(item);
      setSelectedFO(arr);
      dispatch({
        type: "familyOrigin",
        payload: arr,
      });
    } else if (check && item?.name === "Not Specified") {
      arr = [];
      setSelectedFO(arr);
      dispatch({
        type: "familyOrigin",
        payload: arr,
      });
    } else if (item?.name === "Not Specified" && !check) {
      arr = [];
      arr.push(item);
      setSelectedFO(arr);
      dispatch({
        type: "familyOrigin",
        payload: arr,
      });
    } else if (
      !check &&
      item?.name !== "Not Specified" &&
      !check2 &&
      selectedFO.length < 6
    ) {
      arr.push(item);
      setSelectedFO(arr);
      dispatch({
        type: "familyOrigin",
        payload: arr,
      });
    } else if (!check && item?.name !== "Not Specified" && check2) {
      let filtered = arr.filter((item1) => {
        return item1?.name !== item?.name;
      });
      setSelectedFO(filtered);
      dispatch({
        type: "familyOrigin",
        payload: filtered,
      });
    }
  };
  const selectCommunity = (item, index) => {
    let arr = [...selectedCommunity];

    let check2 = arr.some((item1) => {
      return item1?.name === item?.name;
    });

    let check = arr.some((item1) => {
      return item1?.name === "Not Specified";
    });
    if (check && item?.name !== "Not Specified") {
      arr = [];
      arr.push(item);
      setSelectedCommunity(arr);
      dispatch({
        type: "community",
        payload: arr,
      });
    } else if (check && item?.name === "Not Specified") {
      arr = [];
      setSelectedCommunity(arr);
      dispatch({
        type: "community",
        payload: arr,
      });
    } else if (item?.name === "Not Specified" && !check) {
      arr = [];
      arr.push(item);
      setSelectedCommunity(arr);
      dispatch({
        type: "community",
        payload: arr,
      });
    } else if (!check && item?.name !== "Not Specified" && !check2) {
      arr.push(item);
      setSelectedCommunity(arr);
      dispatch({
        type: "community",
        payload: arr,
      });
    } else if (!check && item?.name !== "Not Specified" && check2) {
      let filtered = arr.filter((item1) => {
        return item1?.name !== item?.name;
      });
      setSelectedCommunity(filtered);
      dispatch({
        type: "community",
        payload: filtered,
      });
    }
  };
  const selectLanguage = (item, index) => {
    let arr = [...selectedLanguage];

    let check2 = arr.some((item1) => {
      return item1?.name === item?.name;
    });

    let check = arr.some((item1) => {
      return item1?.name === "Other";
    });
    if (check && item?.name !== "Other") {
      arr = [];
      arr.push(item);
      setSelectedLanguage(arr);
      dispatch({
        type: "language",
        payload: arr,
      });
    } else if (check && item?.name === "Other") {
      arr = [];
      setSelectedLanguage(arr);
      dispatch({
        type: "language",
        payload: arr,
      });
    } else if (item?.name === "Other" && !check) {
      arr = [];
      arr.push(item);
      setSelectedLanguage(arr);
      dispatch({
        type: "language",
        payload: arr,
      });
    } else if (!check && item?.name !== "Other" && !check2) {
      arr.push(item);
      setSelectedLanguage(arr);
      dispatch({
        type: "language",
        payload: arr,
      });
    } else if (!check && item?.name !== "Other" && check2) {
      let filtered = arr.filter((item1) => {
        return item1?.name !== item?.name;
      });
      setSelectedLanguage(filtered);
      dispatch({
        type: "language",
        payload: filtered,
      });
    }
  };
  const selectEL = (item, index) => {
    setSelectedEL(item);
    dispatch({
      type: "educationLevel",
      payload: item,
    });
  };
  const selectReligion = (item, index) => {
    setSelectedReligion(item);
  };
  const selectDenomination = (item, index) => {
    setSelectedDenomination(item);
    dispatch({
      type: "denomination",
      payload: item,
    });
  };
  const selectPray = (item, index) => {
    setSelectedPray(item);
    dispatch({
      type: "pray",
      payload: item,
    });
  };

  const selectDrink = (item, index) => {
    setSelectedDrink(item);
    dispatch({
      type: "drink",
      payload: item,
    });
  };
  const selectSmoke = (item, index) => {
    let arr = [...selectedSmoke];

    let check2 = arr.some((item1) => {
      return item1?.name === item?.name;
    });

    let check = arr.some((item1) => {
      return item1?.name === "None";
    });
    if (check && item?.name !== "None") {
      arr = [];
      arr.push(item);
      setSelectedSmoke(arr);
      dispatch({
        type: "smoke",
        payload: arr,
      });
    } else if (check && item?.name === "None") {
      arr = [];
      setSelectedSmoke(arr);
      dispatch({
        type: "smoke",
        payload: arr,
      });
    } else if (item?.name === "None" && !check) {
      arr = [];
      arr.push(item);
      setSelectedSmoke(arr);
      dispatch({
        type: "smoke",
        payload: arr,
      });
    } else if (!check && item?.name !== "None" && !check2) {
      arr.push(item);
      setSelectedSmoke(arr);
      dispatch({
        type: "smoke",
        payload: arr,
      });
    } else if (!check && item?.name !== "None" && check2) {
      let filtered = arr.filter((item1) => {
        return item1?.name !== item?.name;
      });
      setSelectedSmoke(filtered);
      dispatch({
        type: "smoke",
        payload: filtered,
      });
    }
  };
  const selectDiet = (item, index) => {
    let arr = [...selectedDiet];

    let check2 = arr.some((item1) => {
      return item1?.name === item?.name;
    });

    let check = arr.some((item1) => {
      return item1?.name === "Anything";
    });
    if (check && item?.name !== "Anything") {
      arr = [];
      arr.push(item);
      setSelectedDiet(arr);
      dispatch({
        type: "dietChoices",
        payload: arr,
      });
    } else if (check && item?.name === "Anything") {
      arr = [];
      setSelectedDiet(arr);
      dispatch({
        type: "dietChoices",
        payload: arr,
      });
    } else if (item?.name === "Anything" && !check) {
      arr = [];
      arr.push(item);
      setSelectedDiet(arr);
      dispatch({
        type: "dietChoices",
        payload: arr,
      });
    } else if (!check && item?.name !== "Anything" && !check2) {
      arr.push(item);
      setSelectedDiet(arr);
      dispatch({
        type: "dietChoices",
        payload: arr,
      });
    } else if (!check && item?.name !== "Anything" && check2) {
      let filtered = arr.filter((item1) => {
        return item1?.name !== item?.name;
      });
      setSelectedDiet(filtered);
      dispatch({
        type: "dietChoices",
        payload: filtered,
      });
    }
  };
  const selectMh = (item, index) => {
    setSelectedMH(item);
    dispatch({
      type: "maritalHistory",
      payload: item,
    });
  };
  const selectHK = (item, index) => {
    setSelectedHK(item);
    dispatch({
      type: "haveKids",
      payload: item,
    });
  };
  const selectWK = (item, index) => {
    setSelectedWK(item);
    dispatch({
      type: "wantKids",
      payload: item,
    });
  };
  const selectRelocate = (item, index) => {
    setSelectedRelocate(item);
    dispatch({
      type: "relocate",
      payload: item,
    });
  };
  const handleSliderValue = (label, val) => {
    setSliderVal(val);
    dispatch({
      type: "practicingLevel",
      payload:
        val[0] === 1
          ? "Rarely Religious"
          : val[0] === 2
          ? "Somewhat Religious"
          : val[0] === 3
          ? "Religious"
          : val[0] === 4
          ? "Strongly Religious"
          : null,
    });
  };
  const handleSliderMarriageValue = (label, val) => {
    setSliderMarriageVal(val);
    dispatch({
      type: "marriageTimeline",
      payload:
        val[0] === 1
          ? "1 Year"
          : val[0] === 2
          ? "2 Years"
          : val[0] === 3
          ? "3 Years"
          : val[0] === 4
          ? "4 Years"
          : null,
    });
  };
  const onSendSliderValue = (v1, v2, v3, v4) => {
    if (sliderVal[0] == 1) {
      return v1;
    } else if (sliderVal[0] == 2) {
      return v2;
    } else if (sliderVal[0] == 3) {
      return v3;
    } else {
      return v4;
    }
  };

  const selectAnswers = async (text, index, findIndex) => {
    await dispatch({
      type: "wholeArray",
      payload: array,
    });
    let copyArray = await [...wholeArray];
    let newArray = await [...wholeArray[currentIndex]?.options];
    if (findIndex?.includes(index)) {
      newArray[index] = await { ...newArray[index], answer: text };
    }

    copyArray[currentIndex] = await {
      ...copyArray[currentIndex],
      options: newArray,
    };
    await dispatch({
      type: "wholeArray",
      payload: copyArray,
    });
    let rArray = [];
    await copyArray[currentIndex]?.options?.map((item, index) => {
      return findIndex?.includes(index) ? rArray.push(item) : null;
    });
    await dispatch({
      type: "promptsPool",
      payload: rArray,
    });
    await setSelectedPP(rArray);
    await setArray(wholeArray);
  };

  const continuePress = () => {
    if (array[currentIndex]?.type === "Main Vibes" && selctedVibe?.length < 1) {
      alerts("error", "Please select any vibe to continue");
    } else if (array[currentIndex]?.type === "Prompts Pool") {
      if (selectedPP?.length < 3) {
        alerts("error", "Please select atleast 3 prompt pools");
      } else {
        setPPCheck(true);
        if (!ppCheck) {
          setPPIndex(0);
        } else if (ppCheck && ppIndex < selectedPP.length - 1) {
          if (
            promptsPool[ppIndex]?.answer &&
            promptsPool[ppIndex]?.answer !== ""
          ) {
            setPPIndex((prev) => prev + 1);
          } else {
            alerts("error", "Please write your answer");
          }
        } else {
          if (
            promptsPool[ppIndex]?.answer &&
            promptsPool[ppIndex]?.answer !== ""
          ) {
            setPPCheck(false);
            setCurrentIndex((prev) => prev + 1);
          } else {
            alerts("error", "Please write your answer");
          }
        }
      }
    } else if (
      array[currentIndex]?.type === "Family Origin" &&
      selectedFO?.length === 0
    ) {
      alerts("error", "Please select atleast one Family Origin");
    } else if (
      array[currentIndex]?.type === "Community" &&
      selectedCommunity?.length === 0
    ) {
      alerts("error", "Please select atleast one Community");
    } else if (
      array[currentIndex]?.type === "Language" &&
      selectedLanguage?.length === 0
    ) {
      alerts("error", "Please select atleast one Language");
    } else if (
      array[currentIndex]?.type === "Education Level" &&
      selectedEL?.length === 0
    ) {
      alerts("error", "Please select atleast one Education Level");
    } else if (
      array[currentIndex]?.type === "Occupation" &&
      occupation?.length < 3
    ) {
      alerts("error", "Please enter valid occupation");
    } else if (
      array[currentIndex]?.type === "Denomination" &&
      selectedDenomination === null
    ) {
      alerts("error", "Please select Denomination");
    } else if (array[currentIndex]?.type === "Pray" && selectedPray === null) {
      alerts("error", "Please select how often do you pray");
    } else if (
      array[currentIndex]?.type === "Drink" &&
      selectedDrink === null
    ) {
      alerts("error", "Please select if you Drink or not");
    } else if (
      array[currentIndex]?.type === "Smoke" &&
      selectedSmoke.length === 0
    ) {
      alerts("error", "Please select if you Smoke or not");
    } else if (
      array[currentIndex]?.type === "Diet" &&
      selectedDiet.length === 0
    ) {
      alerts("error", "Please select what are your Diet Choices");
    } else if (
      array[currentIndex]?.type === "Marital History" &&
      selectedMH === null
    ) {
      alerts("error", "Please select your Marital History");
    } else if (
      array[currentIndex]?.type === "Have Kids" &&
      selectedHK === null
    ) {
      alerts("error", "Please select one of the following");
    } else if (
      array[currentIndex]?.type === "Want Kids" &&
      selectedWK === null
    ) {
      alerts("error", "Please select one of the following");
    } else if (
      array[currentIndex]?.type === "Relocate" &&
      selectedRelocate === null
    ) {
      alerts("error", "Please select one of the following");
    } else if (array[currentIndex]?.type === "Tagline" && tagline === "") {
      alerts("error", "Please write something to introduce yourself");
    } else {
      if (currentIndex === array?.length - 1) {
        setButtonLoader(true);
        const formData = new FormData();
        formData.append("height", height / 30.48);
        formData.append("familyOrigin", familyOrigin[0]?.name);
        formData.append("community", community[0]?.name);
        language.map((el) => {
          formData.append(`languages[]`, el?.name);
        });
        formData.append("denomination", denomination?.name);
        formData.append("practiceLevel", practicingLevel);
        formData.append("iPray", pray?.name);
        formData.append("iDrink", drink?.name);
        formData.append("education", educationLevel?.name);
        formData.append("occupation", occupation1);
        formData.append("marriageTimeline", marriageTimeline);
        formData.append("maritalHistory", maritalHistory?.name);
        formData.append("haveKids", haveKids?.name === "Yes" ? true : false);
        formData.append("wantKids", wantKids?.name === "Yes" ? true : false);
        formData.append(
          "willingToRelocate",
          relocate?.name === "Yes" ? true : false
        );
        formData.append("tagline", tagline);
        smoke.map((x, index) => {
          formData.append(`smokeChoices[]`, x?.name);
        });
        dietChoices.map((x, index) => {
          formData.append(`dietChoices[]`, x?.name);
        });
        vibes?.map((x, index) => {
          formData.append(`vibes[]`, x?.name);
        });

        selectedPP.map((el, ind) => {
          formData.append(`profilePrompts[${ind}][questionId]`, el?.id);
          formData.append(`profilePrompts[${ind}][answer]`, el.answer);
          formData.append(`profilePrompts[${ind}][operation]`, "add");
        });

        UserService.updateNewProfile(formData, token)
          .then((res) => {
            if (res?.status >= 200 && res?.status <= 299) {
              Alerts("success", "Profile updated successfully");
              dispatch({
                type: "AUTH_USER_STATUS",
                payload: res?.data?.data?.user?.status,
              });
              navigation.navigate("PersonalityQuizNew");
            } else {
              Alerts("error", res?.data?.error?.message);
            }
          })
          .catch((e) => {
            // Alerts('Error', e?.data?.error?.message);
            console.log("updateNewProfile err", e);
          })
          .finally(() => {
            setButtonLoader(false);
          });
      } else {
        setCurrentIndex((prev) => prev + 1);
        filtered = [];
        setSearchValue("");
      }
    }
  };

  const search = (text, type, currentIndex) => {
    setSearchValue(text);
    if (text?.length > 2) {
      filtered = [...array];
      let copyArray = [...array];
      let filtered1 = array[currentIndex]?.options.filter((item) => {
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
        multiSliderValuesChange={(val) => {
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
        multiSliderValuesChange={(val) => {
          handleSliderMarriageValue(customLabel, val);
        }}
      />
    );
  };

  return loading ? (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      <ActivityIndicator size={"large"} color={colors.primaryPink} />
    </View>
  ) : (
    <SafeAreaView
      style={{ flex: 1, padding: 20, backgroundColor: colors.white }}
    >
      <TouchableOpacity
        onPress={() => {
          if (
            currentIndex > 0 &&
            !ppCheck &&
            array[currentIndex]?.type !== "Height"
          ) {
            setCurrentIndex((prev) => prev - 1);
          } else if (currentIndex > 0 && ppCheck) {
            if (ppIndex === 0 && ppCheck) {
              setPPIndex(0);
              setPPCheck(false);
            } else {
              setPPIndex((prev) => prev - 1);
            }
          } else if (array[currentIndex]?.type === "Height") {
            setCurrentIndex((prev) => prev - 1);
            setPPCheck(true);
            setPPIndex(selectedPP?.length - 1);
          } else {
            navigation.goBack();
          }
        }}
      >
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../../../assets/iconimages/arrow-back.png")}
        />
      </TouchableOpacity>

      <View style={[styles.typeandCountView]}>
        <Text style={styles.type}>{array[currentIndex]?.heading}</Text>
        {ppCheck || array[currentIndex]?.type === "Main Vibes" ? (
          <View style={styles.countView}>
            <Text style={styles.countText}>
              {ppCheck
                ? ppIndex + 1 + " / " + promptsPool?.length
                : array[currentIndex]?.type === "Main Vibes"
                ? selctedVibe?.length + " / " + "8"
                : null}
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "center",
          height: "1%",
          borderRadius: 10,
          backgroundColor: "#E6E8EC",
          marginVertical: "5%",
        }}
      >
        <View
          style={{
            width: `${(100 / array.length) * (currentIndex + 1)}%`,
            backgroundColor: colors.primaryPink,
            height: "100%",
            borderRadius: 10,
          }}
        ></View>
      </View>

      <Text style={styles.question}>{array[currentIndex]?.question}</Text>
      {array[currentIndex]?.ask !== "" && !ppCheck ? (
        <Text style={[styles.ask]}>{array[currentIndex]?.ask}</Text>
      ) : ppCheck ? (
        <Text style={styles.ask}>
          {ppCheck && ppIndex === 0
            ? "The first question you selected was:"
            : ppCheck && ppIndex === 1
            ? "The second question you selected was:"
            : ppCheck && ppIndex === 2
            ? "The last question you selected was:"
            : null}
        </Text>
      ) : null}

      <View style={{ width: "100%", height: "65%" }}>
        {array[currentIndex]?.type === "Main Vibes" ? (
          <>
            <View style={styles.scrollContainer}>
              <ScrollView
                onContentSizeChange={onContentSizeChange}
                onLayout={onLayout}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
                  { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={{ marginVertical: "5%" }}
              >
                {array[currentIndex]?.options?.length > 0 &&
                  array[currentIndex]?.options.map((item, index) => {
                    let findIndex = selctedVibe.map((newItem) => {
                      return array[currentIndex]?.options.findIndex(
                        (item) => item.id === newItem.id
                      );
                    });
                    return (
                      <NewOnBoardingDesign
                        mainOnPress={() => selectVibe(item, index)}
                        findIndex={findIndex}
                        index={index}
                        item={item}
                        multiSelect={array[currentIndex]?.multiSelect}
                        nameorid={"id"}
                        search={array[currentIndex]?.search}
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
          </>
        ) : array[currentIndex]?.type === "Prompts Pool" ? (
          !ppCheck ? (
            <View style={styles.scrollContainer}>
              <ScrollView
                onContentSizeChange={onContentSizeChange}
                onLayout={onLayout}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
                  { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={{ marginVertical: "5%" }}
              >
                {array[currentIndex]?.options?.length > 0 &&
                  array[currentIndex]?.options.map((item, index) => {
                    let findIndex = selectedPP.map((newItem) => {
                      return array[currentIndex]?.options.findIndex(
                        (item) => item?.id === newItem?.id
                      );
                    });

                    return (
                      <>
                        <NewOnBoardingDesign
                          mainOnPress={() => selectPP(item, index)}
                          findIndex={findIndex}
                          index={index}
                          item={item}
                          multiSelect={array[currentIndex]?.multiSelect}
                          nameorid={"title"}
                          search={array[currentIndex]?.search}
                        />
                      </>
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
              <Text style={styles.question}>
                {"“" + selectedPP[ppIndex]?.title + "”"}
              </Text>
              <View
                style={{
                  marginVertical: ios ? "5%" : "3%",
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
                  onChangeText={(text) => {
                    let copy = [...selectedPP];
                    copy[ppIndex] = {
                      ...copy[ppIndex],
                      answer: text,
                    };
                    setSelectedPP(copy);
                    dispatch({
                      type: "promptsPool",
                      payload: copy,
                    });
                  }}
                  placeholder={`Remember first impressions count 😉`}
                  placeholderTextColor={"#9CA3AF"}
                />
              </View>
            </View>
          )
        ) : array[currentIndex]?.type === "Height" ? (
          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginTop: "15%",
              backgroundColor: "#F9FAFB",
              paddingVertical: "5%",
              borderRadius: 10,
            }}
          >
            <RulerPicker
              value={selectedHeight / 30.48}
              onValueChangeEnd={(number) =>
                selectHeight((number / 30.48).toFixed(1))
              }
              min={92}
              max={252}
              unit="ft"
              height={100}
              width={windowWidth * 0.8}
              indicatorHeight={40}
              indicatorColor={colors.primaryPink}
              shortStepHeight={20}
              longStepHeight={50}
              valueTextStyle={{ color: colors.primaryPink, fontSize: 20 }}
              unitTextStyle={{ color: colors.primaryPink, fontSize: 17 }}
              step={2.55}
              initialValue={92 / 30.48}
            />
          </View>
        ) : array[currentIndex]?.type === "Family Origin" ? (
          <>
            <OnBoardingSearch
              onChangeText={(text) =>
                search(text, array[currentIndex]?.type, currentIndex)
              }
              array={array}
              currentIndex={currentIndex}
              searchValue={searchValue}
              search={array[currentIndex]?.search}
            />
            <View style={styles.scrollContainer}>
              <View style={{ height: windowHeight * 0.5 }}>
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
                        let findIndex = selectedFO.map((newItem) => {
                          return filtered[currentIndex]?.options.findIndex(
                            (item) => item?.name === newItem?.name
                          );
                        });
                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectFO(item, index)}
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
                    : array[currentIndex]?.options?.length > 0 &&
                      array[currentIndex]?.options.map((item, index) => {
                        let findIndex = selectedFO.map((newItem) => {
                          return array[currentIndex]?.options.findIndex(
                            (item) => item?.name === newItem?.name
                          );
                        });
                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectFO(item, index)}
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
        ) : array[currentIndex]?.type === "Community" ? (
          <>
            <OnBoardingSearch
              onChangeText={(text) =>
                search(text, array[currentIndex]?.type, currentIndex)
              }
              array={array}
              currentIndex={currentIndex}
              searchValue={searchValue}
              search={array[currentIndex]?.search}
            />
            <View style={styles.scrollContainer}>
              <View style={{ height: windowHeight * 0.5 }}>
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
                        let findIndex = selectedCommunity.map((newItem) => {
                          return filtered[currentIndex]?.options.findIndex(
                            (item) => item?.name === newItem?.name
                          );
                        });
                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectCommunity(item, index)}
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
                    : array[currentIndex]?.options?.length > 0 &&
                      array[currentIndex]?.options.map((item, index) => {
                        let findIndex = selectedCommunity.map((newItem) => {
                          return array[currentIndex]?.options.findIndex(
                            (item) => item?.name === newItem?.name
                          );
                        });
                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectCommunity(item, index)}
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
        ) : array[currentIndex]?.type === "Language" ? (
          <>
            <OnBoardingSearch
              onChangeText={(text) =>
                search(text, array[currentIndex]?.type, currentIndex)
              }
              array={array}
              currentIndex={currentIndex}
              searchValue={searchValue}
              search={array[currentIndex]?.search}
            />
            <View style={styles.scrollContainer}>
              <View style={{ height: windowHeight * 0.5 }}>
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
                        let findIndex = selectedLanguage.map((newItem) => {
                          return filtered[currentIndex]?.options.findIndex(
                            (item) => item?.name === newItem?.name
                          );
                        });
                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectLanguage(item, index)}
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
                    : array[currentIndex]?.options?.length > 0 &&
                      array[currentIndex]?.options.map((item, index) => {
                        let findIndex = selectedLanguage.map((newItem) => {
                          return array[currentIndex]?.options.findIndex(
                            (item) => item?.name === newItem?.name
                          );
                        });
                        return (
                          <NewOnBoardingDesign
                            mainOnPress={() => selectLanguage(item, index)}
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
        ) : array[currentIndex]?.type === "Education Level" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options?.length > 0 &&
              array[currentIndex]?.options.map((item, index) => {
                let findIndex = array[currentIndex]?.options.findIndex(
                  (item, index) => {
                    return item?.name === selectedEL?.name;
                  }
                );
                return (
                  <NewOnBoardingDesign
                    mainOnPress={() => selectEL(item, index)}
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
        ) : array[currentIndex]?.type === "Occupation" ? (
          <View
            style={{
              marginVertical: ios ? "5%" : "3%",
              width: "90%",
              backgroundColor: "#F9FAFB",
              paddingVertical: "5%",
              alignSelf: "center",
            }}
          >
            <TextInput
              numberOfLines={1}
              style={styles.textinput}
              value={occupation}
              onChangeText={(text) => {
                setOccupation(text);
                dispatch({
                  type: "occupation1",
                  payload: text,
                });
              }}
              placeholder={`Occupation Ex.Designer etc`}
              placeholderTextColor={"#9CA3AF"}
            />
          </View>
        ) : array[currentIndex]?.type === "Religion" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options?.length > 0 &&
              array[currentIndex]?.options.map((item, index) => {
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
        ) : array[currentIndex]?.type === "Denomination" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options?.length > 0 &&
              array[currentIndex]?.options?.map((item, index) => {
                let findIndex = array[currentIndex]?.options?.findIndex(
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
        ) : array[currentIndex]?.type === "Practicing Level" ? (
          <View style={{ marginVertical: "5%" }}>
            <RenderSlider
              min={1}
              max={4}
              stepsAs={array[currentIndex]?.options}
              showSteps={true}
              showStepLabels={true}
              // prefName="Please make a selection:"
              customLabel={"practicingLevel"}
            />
          </View>
        ) : array[currentIndex]?.type === "Pray" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = array[currentIndex]?.options.findIndex(
                (item, index) => {
                  return item?.name === selectedPray?.name;
                }
              );
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectPray(item, index)}
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
        ) : array[currentIndex]?.type === "Drink" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = array[currentIndex]?.options.findIndex(
                (item, index) => {
                  return item?.name === selectedDrink?.name;
                }
              );
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectDrink(item, index)}
                  findIndex={findIndex}
                  index={index}
                  item={item}
                  multiSelect={array[currentIndex]?.multiSelect}
                  nameorid={"name"}
                  search={array[currentIndex]?.search}
                  icon={true}
                />
              );
            })}
          </ScrollView>
        ) : array[currentIndex]?.type === "Smoke" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = selectedSmoke.map((newItem) => {
                return array[currentIndex]?.options.findIndex(
                  (item) => item?.name === newItem?.name
                );
              });
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectSmoke(item, index)}
                  findIndex={findIndex}
                  index={index}
                  item={item}
                  multiSelect={array[currentIndex]?.multiSelect}
                  nameorid={"name"}
                  search={array[currentIndex]?.search}
                  icon={true}
                />
              );
            })}
          </ScrollView>
        ) : array[currentIndex]?.type === "Diet" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = selectedDiet.map((newItem) => {
                return array[currentIndex]?.options.findIndex(
                  (item) => item?.name === newItem?.name
                );
              });
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectDiet(item, index)}
                  findIndex={findIndex}
                  index={index}
                  item={item}
                  multiSelect={array[currentIndex]?.multiSelect}
                  nameorid={"name"}
                  search={array[currentIndex]?.search}
                  icon={true}
                />
              );
            })}
          </ScrollView>
        ) : array[currentIndex]?.type === "Marital History" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = array[currentIndex]?.options.findIndex(
                (item, index) => {
                  return item?.name === selectedMH?.name;
                }
              );
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectMh(item, index)}
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
        ) : array[currentIndex]?.type === "Marriage Timeline" ? (
          <View style={{ marginVertical: "5%" }}>
            <RenderMarriageSlider
              min={1}
              max={4}
              stepsAs={array[currentIndex]?.options}
              showSteps={true}
              showStepLabels={true}
              // prefName="Please make a selection:"
              customLabel={"marriageTimeline"}
            />
          </View>
        ) : array[currentIndex]?.type === "Have Kids" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = array[currentIndex]?.options.findIndex(
                (item, index) => {
                  return item?.name === selectedHK?.name;
                }
              );
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectHK(item, index)}
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
        ) : array[currentIndex]?.type === "Want Kids" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = array[currentIndex]?.options.findIndex(
                (item, index) => {
                  return item?.name === selectedWK?.name;
                }
              );
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectWK(item, index)}
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
        ) : array[currentIndex]?.type === "Relocate" ? (
          <ScrollView style={{ marginVertical: "5%" }}>
            {array[currentIndex]?.options.map((item, index) => {
              let findIndex = array[currentIndex]?.options.findIndex(
                (item, index) => {
                  return item?.name === selectedRelocate?.name;
                }
              );
              return (
                <NewOnBoardingDesign
                  mainOnPress={() => selectRelocate(item, index)}
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
        ) : array[currentIndex]?.type === "Tagline" ? (
          <View
            style={{
              marginVertical: ios ? "5%" : "3%",
              width: "90%",
              backgroundColor: "#F9FAFB",
              paddingVertical: "5%",
              alignSelf: "center",
            }}
          >
            <TextInput
              style={styles.textinput}
              value={tagline}
              onChangeText={(text) => {
                setTagline(text);
                dispatch({
                  type: "tagline1",
                  payload: text,
                });
              }}
              placeholder={`Remember first impressions count 😉`}
              placeholderTextColor={"#9CA3AF"}
            />
          </View>
        ) : null}
      </View>
      <BottomButton
        bottomStyles={{ bottom: isKeyboardVisible && android ? 2 : 15 }}
        loading={buttonLoader}
        onPress={() => continuePress()}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  typeandCountView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: "2%",
    marginVertical: "2%",
  },
  type: { fontSize: 16, color: colors.black, fontFamily: "Inter-SemiBold" },
  countView: {
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#23262F",
  },
  countText: { fontSize: 14, color: colors.white, fontFamily: "Inter-Regular" },
  question: {
    fontSize: 22,
    color: "#111827",
    fontFamily: "Inter-Bold",
    marginVertical: "2%",
    maxWidth: "90%",
  },
  ask: {
    fontSize: 16,
    color: colors.textGrey1,
    fontFamily: "Inter-Regular",
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
    // minWidth: '60%',
    // maxWidth: '80%',
    fontSize: 14,
    color: colors.black,
    paddingVertical: "2%",
    paddingHorizontal: "3%",
  },
  scrollContainer: {
    flexDirection: "row",
    width: "100%",
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
export default OnBoardingQuestions;
