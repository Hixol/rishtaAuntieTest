import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
  BackHandler,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { OnBoardingServices, UserService } from "../../services";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { PERMISSIONS } from "react-native-permissions";
import {
  android,
  ios,
  OS_VER,
  windowHeight,
  windowWidth,
} from "../../utility/size";
import { handlePermissions, measureUnits } from "../../utility/regex";
import { useHelper } from "../../hooks/useHelper";

import data from "../../../data.json";
import colors from "../../utility/colors";
import Icons from "../../utility/icons";
import styles from "./styles";
import FastImage from "react-native-fast-image";
import GenderOnBoarding from "../../components/OnBoarding/GenderOnboarding";
import BirthdayPicker from "../../components/OnBoarding/BirthdayPicker";
import SliderView from "../../components/Modal/Slider";
import Button from "../../components/buttons/Button";
import ProfileVerificationOnBoarding from "../../components/OnBoarding/ProfileVerificationOnBOarding";
import ImageCard from "../../components/Cards/ImageCard";
import HeaderContainer from "../../components/containers/headerContainer";
import Video from "react-native-video";
import moment from "moment";
import ActionCard from "../../components/Cards/ActionCard";
import BottomModal from "../../components/Modal/BottomModal";
import Message from "../../components/Message";
import {
  educations,
  maritalHistory,
  resligiousSteps,
  praySteps,
  drinkButtons,
  optionButtons,
  videoButtons,
  uploadButton,
  reviewButtons,
  quizButtons,
} from "../../mocks/onboarding";
import LinkedInModal from "@symhomendra21/react-native-linkedin";
import axios from "axios";
import DeviceInfo from "react-native-device-info";

export default function OnBoarding(props) {
  const { handleLocation, handleStatusCode, Alerts } = useHelper();
  const flatRef = useRef(null);
  const inputRef = useRef(null);

  let [sliderVal, setSliderVal] = useState([1]);
  let [personHeight, setPersonHeight] = useState([92]);
  let [country, setCountry] = useState([]);
  let [community, setCommunity] = useState([]);
  let [language, setLanguage] = useState([]);
  let [occupation, setOccupation] = useState([]);
  let [religion, setReligion] = useState([]);
  let [denomination, setDenomination] = useState([]);
  let [den, setDen] = useState([]);
  let [vibesList, setVibeslist] = useState([]);
  let [prompts, setPrompts] = useState([]);
  let arr = [],
    profileImage = [],
    btnChoice = [],
    vibesVal = [];
  let videoExt = new Set([
    "video/mp4",
    "video/mov",
    "video/MOV",
    "video/quicktime",
  ]);
  let imageExt = new Set(["image/jpeg", "image/png", "image/jpg"]);

  const [msg, setMsg] = useState("");
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState(null);
  const [mediaOptions, setMediaOptions] = useState(false);
  const [mediaForm, setMediaForm] = useState("");
  const [videoUri, setVideoUri] = useState(null);
  const [played, setPlayed] = useState(false);
  const [modalUri, setModalUri] = useState(null);
  const [dropdownVal, setDropdownVal] = useState([]);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [ind, setInd] = useState(null);

  const [smokeButtons, setSmokeButtons] = useState([
    {
      id: 1,
      title: "Hookah",
      btnIcon: require("../../assets/iconimages/Hookah-01.png"),
      selected: false,
    },
    {
      id: 2,
      title: "Cigarette",
      btnIcon: require("../../assets/iconimages/Cigarette.png"),
      selected: false,
    },
    {
      id: 3,
      title: "Weed",
      btnIcon: require("../../assets/iconimages/Weed-01.png"),
      selected: false,
    },
    {
      id: 4,
      title: "None",
      btnIcon: require("../../assets/iconimages/no.png"),
      selected: false,
    },
  ]);

  const [dietButtons, setDietButtons] = useState([
    {
      id: 1,
      title: "Halal",
      btnIcon: require("../../assets/iconimages/Halal.png"),
      selected: false,
    },
    {
      id: 2,
      title: "Vegan",
      btnIcon: require("../../assets/iconimages/Vegan-01.png"),
      selected: false,
    },
    {
      id: 3,
      title: "Vegetarian",
      btnIcon: require("../../assets/iconimages/Vegetarian-01.png"),
      selected: false,
    },
    {
      id: 3,
      title: "Anything",
      btnIcon: require("../../assets/iconimages/Anything-01.png"),
      selected: false,
    },
  ]);

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

  const {
    index,
    chat,
    dob,
    userHeight,
    selfieImage,
    promptsIndex,
    promptsPool,
    coords,
    videoFlag,
  } = useSelector((store) => store.chatReducer);
  const { token } = useSelector((store) => store.userReducer);
  const dispatch = useDispatch();

  const handleBackButton = () => {
    clearRedux();
    props.navigation.replace("OnBoarding");
    BackHandler.exitApp();
  };

  useEffect(() => {
    if (chat.length == 0) {
      dispatch({
        type: "CHAT",
        payload: data.questionArray[index],
      });
    }

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
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let data = res?.data?.data;
          setCountry(data?.familyOrigin.map((x) => x));
          setCommunity(data?.community.map((x) => x));
          setLanguage(data?.language.map((x) => x));
          setOccupation(data?.occupation.map((x) => x));
          setDenomination(data?.denomination);
          setReligion(
            Object.keys(data?.denomination)
              .map((x) => ({ name: x }))
              .sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
              })
          );
        }
      })
      .catch((err) => console.log("err", err));

    OnBoardingServices.vibesListing()
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setVibeslist(
            res.data.data
              .map((x) => ({ status: x.name }))
              .sort((a, b) => {
                if (a.status.toLowerCase() < b.status.toLowerCase()) return -1;
                if (a.status.toLowerCase() > b.status.toLowerCase()) return 1;
                return 0;
              })
          );

          UserService.getQuestions()
            .then((res) => {
              handleStatusCode(res);
              if (res.status >= 200 && res.status <= 299) {
                setPrompts(
                  res.data.data.sort((a, b) => {
                    if (a.title.toLowerCase() < b.title.toLowerCase())
                      return -1;
                    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                    return 0;
                  })
                );
              }
            })
            .catch((err) => console.log("getQuestions err", err));
        }
      })
      .catch((err) => console.log("vibesListing err", err));
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);

  const flatScrollToBottom = () => {
    flatRef?.current?._listRef?._scrollRef?.scrollToEnd();
  };

  const onSend = (msg) => {
    if (msg != "") {
      if (msg == "Skip for now") {
        if (data.questionArray.length != chat.length) {
          //pushing new question
          showNextQuestionByIndex(2);
        }
      } else if (msg == "Skipped") {
        //filter returns the whole object when match, for nested object we use map
        arr = profilePicArr
          .filter((el) => {
            if (el?.image != undefined) {
              return el;
            }
          })
          .map((el) => el.image);
        updateChat(arr);
      } else if (promptsPool.length > 0 && promptsIndex < 3) {
        //update chat properties against current question
        let updateChatObj = promptsPool.map((el) => {
          if (el.id == promptsPool[promptsIndex].id) {
            return {
              ...el,
              isAnswered: true,
              answer: msg,
            };
          } else {
            return el;
          }
        });

        if (promptsIndex < 2) {
          dispatch({
            type: "UPDATE_CHAT",
            payload: updateChatObj[promptsIndex],
          });
          dispatch({
            type: "UPDATE_POOL",
            payload: updateChatObj[promptsIndex],
          });
          dispatch({
            type: "PROMPTS_INDEX",
            payload: promptsIndex + 1,
          });
          dispatch({
            type: "CHAT",
            payload: promptsPool[promptsIndex + 1],
          });
        } else if (promptsIndex == 2) {
          dispatch({
            type: "UPDATE_CHAT",
            payload: updateChatObj[promptsIndex],
          });
          dispatch({
            type: "UPDATE_POOL",
            payload: updateChatObj[promptsIndex],
          });
          dispatch({
            type: "PROMPTS_INDEX",
            payload: promptsIndex + 1,
          });
          dispatch({
            type: "INDEX",
            payload: index + 1,
          });
          dispatch({
            type: "CHAT",
            payload: data.questionArray[index + 1],
          });
        }
        flatScrollToBottom();
        setMsg("");
      } else {
        if (
          videoExt.has(msg?.type) ||
          imageExt.has(msg[0]?.type) ||
          msg == "Verified"
        ) {
          let updateChatObj = chat.map((x) => {
            if (x.id == data.questionArray[index].id) {
              return {
                ...x,
                isAnswered: true,
                answer: msg,
              };
            } else {
              return x;
            }
          });
          // get object based on index
          dispatch({
            type: "UPDATE_CHAT",
            payload: updateChatObj[index + 3],
          });

          dispatch({
            type: "INDEX",
            payload: index + 1,
          });
          dispatch({
            type: "CHAT",
            payload: data.questionArray[index + 1],
          });

          flatScrollToBottom();
          setMsg("");
        } else {
          let updateChatObj = chat.map((x) => {
            if (x.id == data.questionArray[index].id) {
              return {
                ...x,
                isAnswered: true,
                answer: msg,
              };
            } else {
              return x;
            }
          });
          dispatch({
            type: "UPDATE_CHAT",
            payload: updateChatObj[index],
          });

          if (data.questionArray.length != chat.length) {
            dispatch({
              type: "INDEX",
              payload: index + 1,
            });
            dispatch({
              type: "CHAT",
              payload: data.questionArray[index + 1],
            });
          }
          flatScrollToBottom();
          setMsg("");
        }
      }
    } else {
      Alerts("error", "Please enter value.");
    }
  };

  const handleAlert = (state) => {
    setMediaOptions(false);
  };

  const handleGalleryMedia = async (state, result) => {
    if (result == "granted") {
      let options = {
        mediaType: "video",
        videoQuality: "low",
      };

      await launchImageLibrary(options, (res) => {
        if (res.errorCode == "others") {
          Alerts(
            "error",
            res.errorMessage
              ? res.errorMessage
              : "Gallery support is not available on your device."
          );
        } else if (res.didCancel === true) {
        } else if (res?.assets[0]?.height == 0 || res?.assets[0]?.width == 0) {
          Alerts("error", "Please select jpeg/png format images.");
        } else {
          let uri = res?.assets[0]?.uri;
          let type = res.assets[0]?.type;

          if (android && !uri.includes(".mp4")) {
            uri = `${uri}.${type.split("/").pop()}`;
          } else if (ios && !uri.includes(".mov")) {
            uri = `${uri}.${type.split("/").pop()}`;
          }

          let obj = {
            name: res?.assets[0]?.fileName,
            type: type,
            uri: uri,
          };
          setVideoUri(obj);
          uploadVideo(obj);
        }
      });
      setMediaOptions(state);
    }
  };

  const handleGallery = (state) => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        "gallery",
        (res) => {
          handleGalleryMedia(state, res);
        }
      );
    } else if (android) {
      if (OS_VER >= 13) {
        handleGalleryMedia(state, "granted");
      } else {
        handlePermissions.checkMultiplePermissions(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          "gallery",
          (res) => {
            handleGalleryMedia(state, res);
          }
        );
      }
    }
  };

  const handleCameraMedia = async (state, result) => {
    if (result == "granted") {
      let options = {
        mediaType: "video",
        videoQuality: "low",
        cameraType: "back",
      };

      await launchCamera(options, (res) => {
        if (res.errorCode == "others") {
          Alerts(
            "error",
            res.errorMessage
              ? res.errorMessage
              : "Camera support is not available on your device."
          );
        } else if (res.didCancel === true) {
        } else if (res?.assets[0]?.height == 0 || res?.assets[0]?.width == 0) {
          Alerts("error", "Please select jpeg/png format images.");
        } else {
          let uri = res?.assets[0]?.uri;
          let type = res.assets[0]?.type;

          if (android && !uri.includes(".mp4")) {
            uri = `${uri}.${type.split("/").pop()}`;
          } else if (ios && !uri.includes(".mov")) {
            uri = `${uri}.${type.split("/").pop()}`;
          }

          let obj = {
            name: res?.assets[0]?.fileName,
            type: type,
            uri: uri,
          };
          setVideoUri(obj);
          uploadVideo(obj);
        }
      });
      setMediaOptions(state);
    }
  };

  const handleCamera = (state) => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.CAMERA,
        "camera",
        (res) => {
          handleCameraMedia(state, res);
        }
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        "camera",
        (res) => {
          handleCameraMedia(state, res);
        }
      );
    }
  };

  const handleRemoveVideo = (state) => {
    setVideoUri(null);
    setMediaOptions(state);
  };

  const clearRedux = () => {
    dispatch({
      type: "EMPTY_CHAT",
    });
    dispatch({
      type: "INDEX",
      payload: 0,
    });
    dispatch({
      type: "PROMPTS_INDEX",
      payload: 0,
    });
    dispatch({
      type: "PROMPTS_POOL",
      payload: [],
    });
  };

  const uploadVideo = (video) => {
    let formData = new FormData();
    formData.append("video", video);

    OnBoardingServices.uploadVideo(formData, token)
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          dispatch({
            type: "SET_VIDEO_FLAG",
            payload: true,
          });
          Alerts("success", "Video uploaded successfully");
        }
      })
      .catch((err) => Alerts("error", err?.message.toString()));
  };

  const createUser = (type) => {
    if (coords.city == "" && coords.state == "" && coords.country == "") {
      Alerts(
        "error",
        "Please enable location and open google maps to sync location!"
      );
      handleLocation();
    } else {
      setLoading(true);
      handleLocation();
      let versionCode = DeviceInfo.getVersion();
      let userDevice = DeviceInfo.getModel();
      let OSVersion = DeviceInfo.getSystemVersion();
      let OSName = android ? `Android ${OSVersion}` : `iOS ${OSVersion}`;

      let formData = new FormData();
      var smokeStr = chat[16].answer;
      var sRes = smokeStr.split(" ").filter((n) => {
        if (/Hookah|Cigarette|Weed|None/.test(n)) return n;
      });
      var dietStr = chat[17].answer;
      var dRes = dietStr.split(" ").filter((n) => {
        if (/Halal|Vegan|Vegetarian|Anything/.test(n)) return n;
      });

      let languages = chat[7].answer.split(", ");

      formData.append("versionCode", versionCode);
      formData.append("userDevice", userDevice);
      formData.append("OSVersion", OSVersion);
      formData.append("OSName", OSName);
      formData.append("firstName", chat[0].answer);
      formData.append("lastName", chat[1].answer);
      formData.append("gender", chat[3].answer);
      formData.append("tagline", chat[23].answer);
      formData.append("longitude", coords.lng);
      formData.append("latitude", coords.lat);
      formData.append("height", userHeight);
      formData.append("dob", dob);
      formData.append("city", coords.city);
      formData.append("country", coords.country);
      formData.append("address", coords.state);
      formData.append("familyOrigin", chat[5].answer.split(", ").shift());
      formData.append("community", chat[6].answer.split(", ").shift());

      languages.map((el) => {
        formData.append(`languages[]`, el);
      });
      formData.append("education", chat[8].answer);
      formData.append("occupation", chat[9].answer);
      formData.append("religion", chat[11].answer);
      formData.append("denomination", chat[12].answer);
      formData.append("practiceLevel", chat[13].answer);
      formData.append("iPray", chat[14].answer);
      formData.append("iDrink", chat[15].answer);
      sRes.map((x, index) => {
        formData.append(`smokeChoices[]`, x.split(",").shift());
      });
      dRes.map((x, index) => {
        formData.append(`dietChoices[]`, x.split(",").shift());
      });
      formData.append("school", "University");
      formData.append("marriageTimeline", chat[18].answer);
      formData.append("maritalHistory", chat[19].answer);
      formData.append("haveKids", chat[20].answer == "Yes" ? true : false);
      formData.append(
        "willingToRelocate",
        chat[21].answer == "Yes" ? true : false
      );
      formData.append("wantKids", chat[22].answer == "Yes" ? true : false);
      formData.append("countryCode", "+92");
      let vRes = chat[24].answer.split(", ");
      vRes.map((x, index) => {
        formData.append(`vibes[]`, x);
      });
      if (chat[31]?.answer.length > 0) {
        chat[31]?.answer.map((x, index) => {
          formData.append(`profilePic${index + 1}`, {
            name: x.name,
            type: x.type,
            uri: x.uri,
          });
        });
      } else {
        chat[32]?.answer.map((x, index) => {
          formData.append(`profilePic${index + 1}`, {
            name: x.name,
            type: x.type,
            uri: x.uri,
          });
        });
      }
      formData.append("verificationPicture", selfieImage, "images.jpg");
      promptsPool.map((el, ind) => {
        formData.append(
          `profilePrompts[${ind}][questionId]`,
          el.id.split("_").pop()
        );
        formData.append(`profilePrompts[${ind}][answer]`, el.answer);
      });

      if (videoFlag == false && Array.isArray(chat[31]?.isAnswered == false)) {
        setLoading(false);
        Alerts("error", "Video is not uploaded. Please wait!");
      } else if (token != null) {
        OnBoardingServices.createUser(formData, token)
          .then((res) => {
            handleStatusCode(res);
            if (res.status >= 200 && res.status <= 299) {
              dispatch({
                type: "AUTH_USER_STATUS",
                payload: "COMPLETED",
              });
              dispatch({
                type: "SET_VIDEO_FLAG",
                payload: false,
              });

              Alerts("success", res.data.message);
              clearRedux();

              if (type == "profile") {
                props.navigation.navigate("BottomTab", {
                  screen: "Settings",
                });
              } else if (type == "quiz") {
                props.navigation.replace("PersonalityQuiz");
              }
            }
          })
          .catch((err) => Alerts("error", err?.message.toString()))
          .finally(() => setLoading(false));
      }
    }
  };

  const updateChat = (val) => {
    let updateChatObj = chat.map((x) => {
      if (x.id == data.questionArray[index + 1].id) {
        return {
          ...x,
          isAnswered: true,
          answer: val,
        };
      } else {
        return x;
      }
    });
    // get object based on index
    dispatch({
      type: "UPDATE_CHAT",
      payload: updateChatObj[index + 3],
    });
    dispatch({
      type: "INDEX",
      payload: index + 1,
    });
    dispatch({
      type: "CHAT",
      payload: data.questionArray[index + 2],
    });
  };

  const showNextQuestionByIndex = (val) => {
    dispatch({
      type: "INDEX",
      payload: index + 1,
    });
    dispatch({
      type: "CHAT",
      payload: data.questionArray[index + val],
    });

    flatScrollToBottom();
    setMsg("");
  };

  const getCallBackVal = (val) => {
    if (val instanceof Date) {
      let diffTime, diffDate, calculatedAge;

      dispatch({
        type: "DOB",
        payload: moment(val).format("YYYY-MM-DD"),
      });

      diffTime = Math.abs(val - new Date());
      diffDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      calculatedAge = Math.floor(diffDate / 365);

      setAge(calculatedAge);
    } else if (/male|female/.test(val)) {
      setGender(val);
    } else if (religion.some((el) => el.name == val)) {
      setDen(denomination[val].map((x) => ({ name: x.name })));
    } else if (val == "Select Questions") {
      showNextQuestionByIndex(1);
    } else if (val == "Skip for now") {
      // setResponseText('uploadThree');
      onSend(val);
    } else if (val == "Continue to my profile") {
      createUser("profile");
    } else if (val == "Rishta Auntie Personality Quiz") {
      if (Array.isArray(chat[31]?.answer)) {
        showNextQuestionByIndex(2);
      } else {
        showNextQuestionByIndex(1);
      }
    } else if (/uploadTwo/.test(val)) {
      setMediaForm("vid");
      setMediaOptions(true);
    } else if (/uploadThree/.test(val)) {
      setMediaForm("img");
    } else if (val == "Verified") {
      if (Array.isArray(chat[28]?.answer)) {
        updateChat(val);
      } else {
        onSend(val);
      }
    } else {
      setMsg(val);
      onSend(val);
    }
  };

  const handleQuizVal = (val) => {
    if (val == "Rishta Auntie Personality Quiz") {
      createUser("quiz");
    } else {
      createUser("profile");
    }
  };

  const handleSliderValue = (label, val) => {
    setSliderVal(val);
  };

  const handleOnSelect = (item) => {
    if (item?.uri) {
      let dummyArr = [...profilePicArr];
      dummyArr[item.index]["image"] = item;
      setProfilePicArr(dummyArr);
    } else {
      setSelectedVibes(item);
    }
  };

  const handleOnRemove = (index) => {
    let dummyArr = [...profilePicArr];
    dummyArr[index]["image"] = null;
    setProfilePicArr(dummyArr);
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

  const onSendBtn = () => {
    let letterRegExp = /[^a-zA-z\/\.' ]+$/;
    let introRegExp = /[^a-zA-z0-9\/\.' ]+$/;
    if (msg == "" && responseText == "text") {
      Alerts("error", "Please enter value.");
    } else if (msg.length < 3 && responseText == "text") {
      Alerts("error", "Please enter at least 3 characters.");
    } else if (msg.length == 0 && responseText == "poolText") {
      Alerts("error", "Please complete answers for prompts pool.");
    } else if (letterRegExp.test(msg) && responseText != "poolText") {
      Alerts("error", "Please enter alphabets only.");
    } else if (age >= 18 && responseText == "birthday") {
      onSend(`Age ${age}`);
    } else if (/birthday/.test(responseText)) {
      Alerts("error", "Please select birthday from date picker.");
    } else if (gender == "" && /gender/.test(responseText)) {
      Alerts("error", "Please select value from card.");
    } else if (gender != "" && responseText == "gender") {
      onSend(gender);
    } else if (
      /religious|pray|ideal/.test(responseText) &&
      sliderVal.length == 0
    ) {
      Alerts("error", "Please select value from slider.");
    } else if (responseText == "slider" && personHeight.length == 0) {
      Alerts("error", "Please select height from slider.");
    } else if (/slider/.test(responseText) && personHeight.length > 0) {
      onSend(measureUnits.convertCentimetertoFeetAndInches(personHeight[0]));
      dispatch({
        type: "SET_USER_HEIGHT",
        payload: personHeight[0],
      });
    } else if (/religious/.test(responseText) && sliderVal.length > 0) {
      onSend(
        onSendSliderValue(
          "Rarely Religious",
          "Somewhat Religious",
          "Religious",
          "Strongly Religious"
        )
      );
      setSliderVal([2]);
    } else if (/pray/.test(responseText) && sliderVal.length > 0) {
      onSend(
        onSendSliderValue(`Don't pray`, "Sometimes", "Often", "Regularly")
      );
      setSliderVal([2]);
    } else if (/ideal/.test(responseText) && sliderVal.length > 0) {
      onSend(onSendSliderValue(`0.5 year`, "1 year", "2 year", "3 year"));
      setSliderVal([2]);
    } else if (
      /family|community|language|education|religion|denomination|martial/.test(
        responseText
      ) &&
      dropdownVal.length == 0
    ) {
      Alerts("error", "Please select value from dropdown.");
    } else if (
      /family|community|language|education|denomination|martial/.test(
        responseText
      ) &&
      dropdownVal.length > 0
    ) {
      onSend(dropdownVal.join(", "));
    } else if (responseText == "religion" && dropdownVal.length > 0) {
      onSend(dropdownVal.join(", "));
      getCallBackVal(dropdownVal[0]);
    } else if (/drink|options/.test(responseText) && ind == null) {
      Alerts("error", "Please choose option to continue.");
    } else if (/drink|options/.test(responseText) && ind != null) {
      responseText == "drink"
        ? (onSend(drinkButtons[ind].title), setInd(null))
        : (onSend(optionButtons[ind].title), setInd(null));
    } else if (responseText == "smoke") {
      smokeButtons.map((x) => {
        if (x.selected == true) {
          btnChoice.push(x.title);
        }
      });
      if (btnChoice.length == 0) {
        Alerts("error", "Please press button to continue.");
      } else {
        btnChoice.includes("None")
          ? (onSend("None"), setInd(null))
          : (onSend(`I only smoke ${btnChoice.join(", ")}`), setInd(null));
      }
    } else if (responseText == "diet") {
      dietButtons.map((x) => {
        if (x.selected == true) {
          btnChoice.push(x.title);
        }
      });
      if (btnChoice.length == 0) {
        Alerts("error", "Please press button to continue.");
      } else {
        btnChoice.includes("Anything")
          ? (onSend("Anything"), setInd(null))
          : (onSend(`I only eat ${btnChoice.join(", ")}`), setInd(null));
      }
    } else if (intro == "" && responseText == "txt") {
      Alerts("error", "Please enter value.");
    } else if (intro != "" && responseText == "txt") {
      onSend(intro);
    } else if (videoUri == null && responseText == "uploadTwo") {
      Alerts("error", "Please upload video.");
    } else if (videoUri != null && responseText == "uploadTwo") {
      onSend(videoUri);
    } else if (profilePicArr.length == 0 && responseText == "uploadThree") {
      profilePicArr.map((el) => {
        if (el?.image == undefined) {
          Alerts("error", "Please upload images.");
        }
      });
    } else if (profilePicArr.length > 0 && responseText == "uploadThree") {
      if (chat[index + 2].type !== "uploadTwo") {
        onSend("Skipped");
      } else {
        arr = profilePicArr
          .filter((el) => {
            if (el?.image != undefined) {
              return el;
            }
          })
          .map((el) => el.image);
        onSend(arr);
      }
    } else if (responseText == "verification" && profileImage.length == 0) {
      Alerts("error", "Please upload selfie!");
    } else if (responseText == "verification" && profileImage.length > 0) {
      dispatch({
        type: "SELFIE_IMAGE",
        payload: profileImage[0],
      });
      if (chat[index + 1].type !== "uploadTwo") {
        updateChat("Verified");
      } else {
        onSend("Verified");
      }
    } else if (
      /button|questions|uploadOne|uploadTwo|review|quiz/.test(responseText)
    ) {
      Alerts("error", "Please press button to continue.");
    } else {
      onSend(msg.trim());
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

  const RenderSingleButton = ({ mt, title }) => {
    return (
      <View style={{ marginTop: mt }}>
        <Button
          OnBoadringBtn
          YesNoBtnStyle={{ width: "45%", paddingVertical: "3%" }}
          title={title}
          btnTitleStyle={{ fontSize: 14 }}
          onPress={() => getCallBackVal(title)}
        />
      </View>
    );
  };

  const addRemovechoice = (item, title, arr, index) => {
    if (item.title == title) {
      arr.map((x) => (x.title != title ? (x.selected = false) : x.selected));
    }
    arr.map((x) => (x.title == title ? (x.selected = false) : x.selected));
    let dummyArr = [...arr];
    dummyArr[index].selected = !item.selected;
    title == "None" ? setSmokeButtons(dummyArr) : setDietButtons(dummyArr);
  };

  const RenderButton = ({ type, array }) => {
    return (
      <View
        style={{
          marginHorizontal: 12,
          marginTop: /uploadTwo|uploadThree/.test(type) ? 0 : 4,
        }}
      >
        {/* check multiple strings against variable */}
        {/uploadOne|uploadTwo|uploadThree|review|quiz/.test(type) ? null : (
          <Text
            style={{
              color: colors.navyBlue,
              fontWeight: "bold",
              marginBottom: type == "drink" ? 13 : type == "options" ? 12 : 7,
            }}
          >
            Please make a selection:
          </Text>
        )}
        {/drink|review|quiz/.test(type) ? (
          array.map((item, index) => (
            <Button
              key={index}
              onPress={() => {
                if (type == "drink") {
                  setInd(index);
                } else if (type == "quiz") {
                  handleQuizVal(item.title);
                } else {
                  getCallBackVal(item.title);
                }
              }}
              OnBoadringBtn={type == "drink"}
              YesNoBtn={type != "drink"}
              YesNoBtnStyle={{
                width: type == "drink" ? "60%" : "90%",
                marginBottom: 18,
                paddingVertical: type == "drink" ? "2.5%" : "4%",
                backgroundColor:
                  ind == index ? colors.primaryPink : colors.white,
              }}
              width={23}
              height={23}
              imgStyle={type == "drink" && { marginRight: 7 }}
              btnTitleStyle={{
                fontSize: 15,
                color: ind == index ? colors.white : colors.primaryPink,
              }}
              btnIcon={item.btnIcon}
              title={item.title}
              tint={ind == index ? true : false}
            />
          ))
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              top: 12,
            }}
          >
            {type == "options"
              ? array.map((item, index) => (
                  <Button
                    key={index}
                    onPress={() => setInd(index)}
                    YesNoBtn
                    YesNoBtnStyle={{
                      width: "45%",
                      borderColor:
                        item.title == "No"
                          ? colors.darkBlue
                          : colors.primaryPink,
                      backgroundColor:
                        ind == index && item.title == "No"
                          ? colors.darkBlue
                          : ind == index && item.title == "Yes"
                          ? colors.primaryPink
                          : colors.white,
                    }}
                    width={23}
                    height={23}
                    imgStyle={{ marginRight: 7 }}
                    btnTitleStyle={{
                      fontSize: 16,
                      color:
                        ind == index
                          ? colors.white
                          : item.title == "No"
                          ? colors.darkBlue
                          : colors.primaryPink,
                    }}
                    btnIcon={item.btnIcon}
                    title={item.title}
                  />
                ))
              : array.map((item, index) => (
                  <Button
                    key={index}
                    onPress={() => {
                      if (/uploadTwo|uploadThree/.test(type)) {
                        getCallBackVal(type);
                      } else if (/smoke/.test(type)) {
                        addRemovechoice(item, "None", smokeButtons, index);
                      } else if (/diet/.test(type)) {
                        addRemovechoice(item, "Anything", dietButtons, index);
                      } else {
                        getCallBackVal(item.title);
                      }
                    }}
                    OnBoadringBtn={item.title != "Skip for now"}
                    YesNoBtn={item.title == "Skip for now"}
                    YesNoBtnStyle={{
                      width: "45%",
                      marginBottom: 18,
                      backgroundColor:
                        item.selected == true
                          ? colors.primaryPink
                          : colors.white,
                    }}
                    width={25}
                    height={25}
                    imgStyle={{ marginRight: 10 }}
                    btnTitleStyle={{
                      fontSize: 14,
                      color:
                        item.selected == true
                          ? colors.white
                          : colors.primaryPink,
                    }}
                    btnIcon={item.btnIcon}
                    title={item.title}
                    tint={item.selected}
                  />
                ))}
          </View>
        )}
      </View>
    );
  };

  const handleVerificationImage = (type, image) => {
    if (type == "verified") {
      profileImage.push(image);
    } else {
      profileImage = [];
    }
  };

  const RenderImageCard = ({ type, array }) => {
    return (
      <>
        {type == "verification" ? (
          <ImageCard
            verificationPress={handleVerificationImage}
            verificationTxt="Profile Verification"
            containerStyle={{
              width: "53%",
              height: "40%",
              alignSelf: "center",
              marginTop: 14,
              borderRadius: 8,
              paddingHorizontal: 12,
            }}
            imgStyle={{ height: "82%" }}
          />
        ) : (
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
              onPress
              selectedItem={handleOnSelect}
              handleOnRemove={handleOnRemove}
              profilePicArr={profilePicArr}
              setProfilePicArr={setProfilePicArr}
              txt="Main profile pic"
              profile={true}
              containerStyle={{ width: windowWidth / 3 - 5 }}
            />
          </View>
        )}
      </>
    );
  };

  const RenderReview = ({ item }) => {
    return (
      <>
        <Message
          item={/We are reviewing your profile/.test(item[0]) && item[0]}
        />
        <View style={styles.reviewContainer}>
          <FastImage
            style={styles.avatar}
            resizeMode="cover"
            source={{
              uri: selfieImage?.uri,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              color: colors.darkBlue,
              fontWeight: "600",
              marginVertical: 10,
            }}
          >
            {/You're all set beta./.test(item[1]) && item[1]}
          </Text>
          <Text style={styles.reviewBtmTxt}>
            {/You will get a notification once we verify your profile/.test(
              item[2]
            ) && item[2]}
          </Text>
        </View>
        <View style={[styles.reviewContainer, { height: 100 }]}>
          <Text
            style={{
              fontSize: 18,
              color: colors.black,
              fontWeight: "600",
            }}
          >
            {/Your profile has been set up!/.test(item[3]) && item[3]}
          </Text>
          <Text style={styles.reviewBtmTxt}>
            {/Would you like to take a brief questionnaire now or later?/.test(
              item[4]
            ) && item[4]}
          </Text>
        </View>
      </>
    );
  };

  const handleDropdownVal = (val) => {
    setDropdownVal(val);
  };

  const handleVibesVal = (val) => {
    vibesVal = val;
    onSend(vibesVal.join(", "));
  };

  const handlePoolVal = (val) => {
    let obj = {};
    let newPrompts = val.map((el, i) => {
      obj = {
        id: `p_${el.id}`,
        question: [el.title],
        isAnswered: false,
        type: "poolText",
      };
      return obj;
    });

    dispatch({
      type: "PROMPTS_POOL",
      payload: newPrompts,
    });
    dispatch({
      type: "CHAT",
      payload: newPrompts[promptsIndex],
    });
  };

  const renderItem = ({ item }) => {
    setResponseText(item?.type);
    if (item?.type == "uploadTwo") {
      setModalUri(item?.answer?.uri);
    }
    return (
      <View key={item?.id}>
        {item?.question.map((el, ind) => {
          return <>{item?.type == "review" ? null : <Message item={el} />}</>;
        })}

        {/uploadTwo|uploadThree/.test(item?.type)
          ? null
          : item?.answer && <Message item={item} />}
        {item?.type == "uploadTwo" && item?.answer?.uri && (
          <View>
            <FastImage
              source={{ uri: item?.answer?.uri }}
              resizeMode="cover"
              style={styles.video}
            />
            <View style={styles.btnPosition}>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => setPlayed(!played)}
              >
                <Icons.FontAwesome name={"play"} size={22} color={"#f4f4f4"} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {item?.type == "uploadThree" &&
          item?.answer &&
          item?.answer.length > 0 && (
            <FlatList
              style={{
                alignSelf: "flex-end",
                marginRight: "2%",
                marginVertical: "1%",
              }}
              horizontal={true}
              data={item?.answer}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <FastImage
                  source={{ uri: item?.uri }}
                  style={{
                    width: 140,
                    height: 180,
                  }}
                  resizeMode="contain"
                />
              )}
            />
          )}

        {item?.type == "review" && <RenderReview item={item?.question} />}
      </View>
    );
  };

  const handleBackPress = () => {
    // if (index > 0) {
    //   dispatch({
    //     type: 'SET_REMOVE_CHAT',
    //     payload: chat[index].id,
    //   });

    //   dispatch({
    //     type: 'INDEX',
    //     payload: index - 1,
    //   });

    //   setResponseText(chat[index - 1].type);
    //   flatRef.current?.scrollToIndex({
    //     animated: true,
    //     index: index - 1,
    //   });
    // } else if (index == 0) {
    //   dispatch({
    //     type: 'SET_REMOVE_CHAT',
    //     payload: chat[index].id,
    //   });

    //   props.navigation.replace('WelcomeScreen');
    // }
    props.navigation.replace("WelcomeScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderContainer
        goback={"arrow-back"}
        backButton
        Icon
        gobackButtonPress={handleBackPress}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primaryPink}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            !/text|txt|poolText/.test(responseText) && ios
              ? "height"
              : ios && "padding"
          }
        >
          <ActionCard
            isImageAct={true}
            heading={"Choose an Action"}
            handleGallery={handleGallery}
            handleCamera={handleCamera}
            handleAlert={handleAlert}
            handleRemoveImage={handleRemoveVideo}
            alert={mediaOptions}
          />
          {/* <View
            style={{
              width: 150,
              padding: 10,
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.primaryBlue,
              position: 'absolute',
              top: 50,
              zIndex: 2,
            }}>
            <LinkedInModal
              clientID="78d3grhkum23po"
              clientSecret="VZH2cArF2S8iuC6D"
              redirectUri="https://localhost:8081/auth/linkedin/callback"
              onSuccess={res => {
                console.log('LinkedInModal success res: ', res);
                let token = res.access_token;
                axios
                  .get(
                    `https://api.linkedin.com/v2/skills`,
                    // `https://api.linkedin.com/v2/degrees`,
                    // `https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,email,pictureUrls,headline,location,industry,positions,educations,profilePicture(displayImage~digitalmediaAsset:playableStreams))`,
                    // `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78d3grhkum23po&redirect_uri=https://localhost:8081/auth/linkedin/callback&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`,
                    {
                      headers: {
                        Authorization: 'Bearer ' + token,
                      },
                    },
                  )
                  .then(res => {
                    console.log('me', res);

                    // axios
                    //   .get(
                    //     `https://api.linkedin.com/v2/people/(id:${res.data.id})`,
                    //     {
                    //       headers: {
                    //         Authorization: 'Bearer ' + token,
                    //       },
                    //     },
                    //   )
                    //   .then(res => {
                    //     console.log('org res', res);
                    //   })
                    //   .catch(err => console.log('org err', err));
                  })
                  .catch(err => console.log('err', err));
              }}
            />
          </View> */}
          <View
            onLayout={() => flatScrollToBottom()}
            style={{
              flex: /text|txt|poolText/.test(responseText)
                ? 1
                : /slider/.test(responseText)
                ? 0.83
                : /family|community|language/.test(responseText)
                ? 0.2
                : /education|martial/.test(responseText) && windowHeight < 800
                ? 0.55
                : /education|martial/.test(responseText)
                ? 0.6
                : responseText == "religion" && windowHeight < 800
                ? 0.36
                : responseText == "religion"
                ? 0.44
                : responseText == "denomination" && windowHeight < 800
                ? 0.43
                : responseText == "denomination"
                ? 0.37
                : /vibes|pool/.test(responseText)
                ? 0.4
                : /uploadThree|verification|review|quiz/.test(responseText)
                ? 0.93
                : /button|options|questions|uploadTwo/.test(responseText)
                ? 0.81
                : /drink/.test(responseText)
                ? 1
                : /uploadOne|smoke|diet/.test(responseText)
                ? 0.86
                : 0.84,
            }}
          >
            {chat.length > 0 && (
              <FlatList
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={true}
                contentContainerStyle={{ flexGrow: 1 }}
                ref={flatRef}
                data={chat}
                keyExtractor={(item) => item?.id}
                onContentSizeChange={() => flatScrollToBottom()}
                renderItem={renderItem}
              />
            )}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                editable={/text|txt|poolText/.test(responseText) ? true : false}
                style={styles.textInput}
                placeholder="Type message"
                placeholderTextColor={colors.mediumGrey}
                value={responseText == "txt" ? intro : msg}
                onChangeText={responseText == "txt" ? setIntro : setMsg}
              />
              <Pressable onPress={onSendBtn} style={styles.btnContainer}>
                <FastImage
                  source={require("../../assets/iconimages/send-02.png")}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
          {responseText != "text" &&
            responseText != "txt" &&
            responseText != "poolText" &&
            Keyboard.dismiss()}
          {responseText == "birthday" ? (
            <BirthdayPicker getCallBackVal={getCallBackVal} />
          ) : responseText == "gender" ? (
            <GenderOnBoarding onSelectGender={getCallBackVal} />
          ) : responseText == "slider" ? (
            <SliderView
              textWithoutIconView
              preferenceName="Height:"
              multiSliderValue={[personHeight[0]]}
              min={92}
              max={252}
              enableLabel={true}
              customLabel="cm"
              bg="transparent"
              multiSliderValuesChange={(val) => {
                setPersonHeight(val);
              }}
            />
          ) : responseText == "family" ? (
            <View style={[styles.bottomModalWrapper]}>
              <BottomModal
                toggle={true}
                dropdownTitle="Family Origin"
                array={country.length > 0 ? country : null}
                handleDropdownVal={handleDropdownVal}
              />
            </View>
          ) : responseText == "community" ? (
            <View style={[styles.bottomModalWrapper]}>
              <BottomModal
                toggle={true}
                dropdownTitle="Community"
                array={community.length > 0 ? community : null}
                handleDropdownVal={handleDropdownVal}
              />
            </View>
          ) : responseText == "language" ? (
            <View style={[styles.bottomModalWrapper]}>
              <BottomModal
                toggle={true}
                dropdownTitle="Languages"
                array={language.length > 0 ? language : null}
                handleDropdownVal={handleDropdownVal}
              />
            </View>
          ) : responseText == "education" ? (
            <View style={[styles.bottomModalWrapper]}>
              <BottomModal
                single={true}
                toggle={true}
                snap={windowHeight < 800 ? ["45%"] : ["40%"]}
                dropdownTitle="Education Level"
                array={educations.length > 0 ? educations : null}
                handleDropdownVal={handleDropdownVal}
              />
            </View>
          ) : responseText == "occupation" ? (
            <View style={[styles.bottomModalWrapper]}>
              <BottomModal
                single={true}
                toggle={true}
                dropdownTitle="Occupation"
                array={occupation.length > 0 ? occupation : null}
                handleDropdownVal={handleDropdownVal}
              />
            </View>
          ) : responseText == "button" ? (
            <RenderSingleButton mt={33} title="Got it!" />
          ) : responseText == "religion" ? (
            <View style={[styles.bottomModalWrapper]}>
              <BottomModal
                single={true}
                toggle={true}
                snap={windowHeight < 800 ? ["64%"] : ["56%"]}
                dropdownTitle="Religion"
                array={religion.length > 0 ? religion : null}
                handleDropdownVal={handleDropdownVal}
              />
            </View>
          ) : responseText == "denomination" ? (
            <View style={[styles.bottomModalWrapper]}>
              <BottomModal
                single={true}
                toggle={true}
                snap={windowHeight < 800 ? ["57%"] : ["63%"]}
                dropdownTitle="Denomination"
                array={den.length > 0 ? den : null}
                handleDropdownVal={handleDropdownVal}
              />
            </View>
          ) : responseText == "religious" ? (
            <RenderSlider
              min={1}
              max={4}
              stepsAs={resligiousSteps}
              showSteps={true}
              showStepLabels={false}
              prefName="Please make a selection:"
              customLabel={responseText}
            />
          ) : responseText == "pray" ? (
            <RenderSlider
              min={1}
              max={4}
              stepsAs={praySteps}
              showSteps={true}
              showStepLabels={false}
              prefName="Please make a selection:"
              customLabel={responseText}
            />
          ) : responseText == "drink" ? (
            <RenderButton array={drinkButtons} type={responseText} />
          ) : responseText == "smoke" ? (
            <RenderButton array={smokeButtons} type={responseText} />
          ) : responseText == "diet" ? (
            <RenderButton array={dietButtons} type={responseText} />
          ) : responseText == "ideal" ? (
            <RenderSlider
              min={1}
              max={4}
              showSteps={true}
              showStepLabels={false}
              prefName="Please make a selection:"
              customLabel={responseText}
            />
          ) : responseText == "martial" ? (
            <View style={[styles.bottomModalWrapper]}>
              <BottomModal
                single={true}
                toggle={true}
                snap={windowHeight < 800 ? ["45%"] : ["40%"]}
                dropdownTitle="Marital Status"
                array={maritalHistory.length > 0 ? maritalHistory : null}
                handleDropdownVal={handleDropdownVal}
              />
            </View>
          ) : responseText == "options" ? (
            <RenderButton array={optionButtons} type={responseText} />
          ) : responseText == "vibes" ? (
            <BottomModal
              toggle={true}
              snap={["90%"]}
              vibes
              vibesList={vibesList}
              handleVibesVal={handleVibesVal}
            />
          ) : responseText == "pool" ? (
            <BottomModal
              toggle={true}
              snap={["90%"]}
              pool
              prompts={prompts}
              handlePoolVal={handlePoolVal}
            />
          ) : responseText == "questions" ? (
            <RenderSingleButton mt={30} title="Select Questions" />
          ) : responseText == "uploadOne" ? (
            <RenderButton array={videoButtons} type={responseText} />
          ) : responseText == "uploadTwo" ? (
            <>
              <RenderButton array={uploadButton} type={responseText} />
              {videoUri != null && (
                <ProfileVerificationOnBoarding
                  type="upload"
                  selectedItem={handleOnSelect}
                  conStyle={{ marginTop: "3%" }}
                  img={videoUri?.uri}
                />
              )}
            </>
          ) : responseText == "uploadThree" ? (
            <>
              <RenderButton array={uploadButton} type={responseText} />
              {mediaForm == "img" && <RenderImageCard array={profilePicArr} />}
            </>
          ) : responseText == "verification" ? (
            <RenderImageCard type={responseText} />
          ) : responseText == "review" ? (
            <RenderButton type={responseText} array={reviewButtons} />
          ) : responseText == "quiz" ? (
            <RenderButton type={responseText} array={quizButtons} />
          ) : null}
        </KeyboardAvoidingView>
      )}
      <Modal animationType="slide" transparent visible={played}>
        <Pressable
          onPressIn={() => setPlayed(false)}
          style={{
            backgroundColor: "#00000061",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          {modalUri ? (
            <Video
              style={{ width: "50%", height: "50%" }}
              poster={modalUri}
              paused={played}
              repeat={true}
              controls={true}
              source={{ uri: modalUri }}
              posterResizeMode="cover"
              resizeMode="cover"
              onError={(e) => console.log("video err", e)}
              useTextureView={false}
              playInBackground={false}
              disableFocus={true}
            />
          ) : null}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
