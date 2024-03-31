import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { PERMISSIONS } from "react-native-permissions";
import { handlePermissions } from "../../utility/regex";
import { OnBoardingServices } from "../../services";
import {
  android,
  ios,
  OS_VER,
  windowHeight,
  windowWidth,
} from "../../utility/size";
import { useHelper } from "../../hooks/useHelper";

import ImageCard from "../../components/Cards/ImageCard";
import styles from "./styles";
import colors from "../../utility/colors";
import ProfileServices from "../../services/ProfileServices";
import Button from "../../components/buttons/Button";
import ActionCard from "../../components/Cards/ActionCard";
import ProfileVerificationOnBoarding from "../../components/OnBoarding/ProfileVerificationOnBOarding";
import Icons from "../../utility/icons";

const EditProfile = (props) => {
  const dispatch = useDispatch();
  const { Alerts, handleStatusCode } = useHelper();
  const { token, userData } = useSelector((store) => store.userReducer);

  let profilePrompts = userData?.ProfilePrompts;
  let [vibes, setVibes] = useState(null);
  let [introVideo, setIntroVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mediaOptions, setMediaOptions] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const EditOption = [
    {
      id: 1,
      preferenceName: "Tag Line",
      type: "TagLine",
      value: userData?.Profile?.tagline,
    },
    {
      id: 2,
      preferenceName: "Edit My Vibes",
      type: "Vibes",
      value: vibes != null ? vibes : undefined,
    },
    {
      id: 3,
      preferenceName: "Profile Prompt",
      type: "ProfilePrompt",
      value: profilePrompts,
    },
  ];

  let videoButtons = [
    {
      id: 1,
      title: "Upload",
      btnIcon: require("../../assets/iconimages/Upload-01.png"),
    },
  ];

  const EditOptions = [
    {
      id: 1,
      preferenceName: "First Name",
      type: "FirstName",
      value: userData?.firstName,
    },
    {
      id: 19,
      preferenceName: "Height",
      type: "Height",
      value: userData?.Profile?.height,
    },
    {
      id: 2,
      preferenceName: "Family Origin",
      type: "FamilyOrigin",
      value: userData?.Profile?.familyOrigin,
    },
    {
      id: 3,
      preferenceName: "Community",
      type: "Community",
      value: userData?.Profile?.community,
    },
    {
      id: 4,
      preferenceName: "Languages",
      type: "Languages",
      value: userData?.UserLanguages,
    },
    {
      id: 5,
      preferenceName: "Religion",
      type: "Religion",
      value: userData?.Profile?.religion,
    },
    {
      id: 6,
      preferenceName: "Denomination",
      type: "Denomination",
      value: userData?.Profile?.denomination,
    },
    {
      id: 7,
      preferenceName: "Education Level",
      type: "EducationLevel",
      value: userData?.Profile?.education,
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
      type: "Occupation&Company",
      value: userData?.Profile?.occupation,
    },
    {
      id: 10,
      preferenceName: "Practicing Level",
      type: "PracticingLevel",
      value: userData?.Profile?.practiceLevel,
    },

    {
      id: 11,
      preferenceName: "Do you pray?",
      type: "Pray",
      value: userData?.Profile?.iPray,
    },
    {
      id: 12,
      preferenceName: "Do you drink?",
      type: "Drink",
      value: userData?.Profile?.iDrink,
    },
    {
      id: 13,
      preferenceName: "Do you smoke?",
      type: "Smoke",
      value: userData?.UserSmokes,
    },
    {
      id: 14,
      preferenceName: "What are your diet choices?",
      type: "Diet",
      value: userData?.UserDietChoices,
    },
    {
      id: 15,
      preferenceName: "Marital history",
      type: "Marital",
      value: userData?.Profile?.maritalHistory,
    },
    {
      id: 16,
      preferenceName: "Do you have kids?",
      type: "HaveKids",
      value: userData?.Profile?.haveKids,
    },
    {
      id: 17,
      preferenceName: "Do you want kids?",
      type: "WantKids",
      value: userData?.Profile?.wantKids,
    },
    {
      id: 18,
      preferenceName: "Are they willing to relocate?",
      type: "Relocate",
      value: userData?.Profile?.willingToRelocate,
    },
  ];
  const [profilePicArr, setProfilePicArr] = useState([
    {
      index: 0,
      title: "Main Display Photo",
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

  useEffect(() => {
    if (userData != null && userData.Profile != null) {
      setVibes(userData?.Profile?.vibes);
    }
  }, [userData?.Profile?.vibes]);

  useEffect(() => {
    if (userData != null && userData.UserMedia.length > 0) {
      userData.UserMedia.map((x, index) => {
        if (x.type == "image") {
          let dummyArr = [...profilePicArr];
          dummyArr[index]["image"] = {
            index,
            type: x.type,
            name: x.url.split("/").pop(),
            uri: x.url,
          };
          setProfilePicArr(dummyArr);
        } else if (x.type == "video") {
          let decodeUrl = decodeURIComponent(x.url);
          setIntroVideo({
            name: decodeUrl.split("/").pop(),
            type: x.type,
            uri: x.url,
          });
        }
      });
    }
  }, []);

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
        }
      });
      setMediaOptions(state);
    } else if (result == "blocked" || result == "denied") {
      Alerts("error", "Please allow permission from settings.");
    } else if (result == "unavailable") {
      Alerts("error", "This feature is not available on this device.");
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
        }
      });
      setMediaOptions(state);
    } else if (result == "blocked" || result == "denied") {
      Alerts("error", "Please allow permission from settings.");
    } else if (result == "unavailable") {
      Alerts("error", "This feature is not available on this device.");
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

  const handleOnSelect = (item) => {
    if (item?.uri) {
      let dummyArr = [...profilePicArr];
      dummyArr[item.index]["image"] = item;
      setProfilePicArr(dummyArr);
      setIsUploadingImage(true);
    }
  };

  const handleOnRemove = (index) => {
    let dummyArr = [...profilePicArr];
    dummyArr[index]["image"] = null;
    setProfilePicArr(dummyArr);
  };

  const uploadVideo = (video) => {
    let formData = new FormData();
    formData.append("video", video);

    OnBoardingServices.uploadVideo(formData, token)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          let decodeUrl = decodeURIComponent(res.data?.data);
          setIntroVideo({
            name: decodeUrl.split("/").pop(),
            type: "video",
            uri: res.data?.data,
          });
          Alerts("success", res.data.message);
        }
      })
      .catch((err) => Alerts("error", err?.message.toString()))
      .finally(() => {
        setVideoUri(null);
        setLoading(false);
      });
  };

  const uploadImages = (formData, video = null) => {
    ProfileServices.updateProfile(formData, token)
      .then((res) => {
        handleStatusCode(res);
        if (res.data.status >= 200 && res.data.status <= 299) {
          dispatch({
            type: "AUTH_USER",
            payload: res.data.data.user,
          });

          Alerts("success", res.data.message);
          setIsUploadingImage(false);

          if (video != null) {
            uploadVideo(video);
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        Alerts("error", err?.message.toString());
        console.log("updateProfile err:", err);
      });
  };

  const onSaveMedia = () => {
    setLoading(true);

    if (videoUri != null && isUploadingImage == false) {
      uploadVideo(videoUri);
    } else if (
      profilePicArr.some((el) => /file/.test(el?.image?.uri)) &&
      isUploadingImage
    ) {
      let formData = new FormData();
      profilePicArr.map((el, index) => {
        if (
          (el?.image != undefined || el?.image != null) &&
          !/http|https/.test(el.image.uri)
        ) {
          formData.append(`profilePic${index + 1}`, {
            name: el?.image?.name,
            type: el?.image?.type,
            uri: el?.image?.uri,
          });
        }
      });

      if (videoUri != null) {
        uploadImages(formData, videoUri);
      } else {
        uploadImages(formData);
      }
    } else {
      Alerts("error", "Please upload media!");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.greyWhite,
      }}
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
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom:
              videoUri != null || introVideo != null
                ? windowHeight * 0.53
                : windowHeight * 0.1 - 100,
          }}
        >
          {(videoUri != null || introVideo != null) && (
            <ProfileVerificationOnBoarding
              type="upload"
              img={videoUri?.uri ? videoUri?.uri : introVideo?.uri}
              conStyle={{
                width: "65%",
                height: "25%",
                marginTop: ios ? 0 : 20,
              }}
            />
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: videoUri != null || introVideo != null ? "30%" : "8%",
            }}
          >
            {videoButtons.map((item) => (
              <Button
                key={item.id}
                onPress={() => setMediaOptions(true)}
                OnBoadringBtn
                YesNoBtnStyle={{ width: "45%", paddingVertical: "1.7%" }}
                btnTitleStyle={{
                  fontSize: 16,
                  color: colors.primaryPink,
                }}
                width={27}
                height={27}
                imgStyle={{ marginRight: 10 }}
                btnIcon={item.btnIcon}
                title={item.title}
              />
            ))}
          </View>

          <ImageCard
            styleContainer={{
              height: windowHeight * 0.3,
              marginVertical: "7%",
              borderRadius: 6,
            }}
            cardStyle={{
              height: ios ? 114 : 120,
              marginBottom: ios ? -12 : 0,
              width: windowWidth / 3 - 20,
            }}
            selectedItem={handleOnSelect}
            handleOnRemove={handleOnRemove}
            profilePicArr={profilePicArr}
            setProfilePicArr={setProfilePicArr}
            txt="Main Display Photo"
          />

          <TouchableOpacity
            disabled={loading}
            style={styles.btn}
            activeOpacity={0.7}
            onPress={onSaveMedia}
          >
            {loading && (
              <ActivityIndicator
                size="small"
                color={colors.primaryPink}
                style={{ marginRight: 7 }}
              />
            )}
            <Text style={styles.txtStyle}>Save</Text>
          </TouchableOpacity>

          <View style={styles.middleSec}>
            <Text
              style={{
                marginLeft: "2%",
                color: colors.primaryBlue,
                fontFamily: "Inter-Medium",
                marginVertical: "1%",
              }}
            >
              Share your personality to get the best interactions
            </Text>

            <View>
              {EditOption.map((i) => {
                return (
                  <TouchableOpacity
                    key={i.id}
                    onPress={() =>
                      props.navigation.navigate("TalhaDemo", {
                        paramKey: i.type,
                        paramKey2: i.preferenceName,
                        value: i.value,
                      })
                    }
                    style={[
                      styles.detailsView,
                      { borderBottomWidth: 1, borderColor: "#dddddd" },
                    ]}
                  >
                    <Text style={styles.detailTxt}>{i.preferenceName}</Text>
                    <Icons.FontAwesome
                      name={"long-arrow-right"}
                      size={25}
                      color={colors.primaryBlue}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.middleSec}>
            {EditOptions.map((i) => {
              return (
                <TouchableOpacity
                  key={i.id}
                  onPress={() =>
                    props.navigation.navigate("TalhaDemo", {
                      paramKey: i.type,
                      paramKey2: i.preferenceName,
                      value: i.value,
                    })
                  }
                  style={[
                    styles.detailsView,
                    { borderBottomWidth: 1, borderColor: "#dddddd" },
                  ]}
                >
                  <Text style={styles.detailTxt}>{i.preferenceName} </Text>
                  <Icons.FontAwesome
                    name={"long-arrow-right"}
                    size={25}
                    color={colors.primaryBlue}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <Text
            style={[
              styles.txtStyle,
              {
                alignSelf: "center",
                marginTop: "3%",
                marginBottom: "4%",
                fontSize: 16,
              },
            ]}
          >
            Need Help?
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default EditProfile;
