import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera } from "react-native-image-picker";
import { OS_VER, android, ios, windowHeight } from "../../../utility/size";
import { alerts, handlePermissions } from "../../../utility/regex";
import { PERMISSIONS } from "react-native-permissions";
import { useDispatch, useSelector } from "react-redux";
import { useHelper } from "../../../hooks/useHelper";

import colors from "../../../utility/colors";
import FastImage from "react-native-fast-image";
import ImagePicker from "react-native-image-crop-picker";
import BottomButton from "../../../components/buttons/BottomButton";
import ActionCard from "../../../components/Cards/ActionCard";
import ImageCard from "../../../components/Cards/ImageCard";

const UploadPicture = ({ navigation, route }) => {
  let edit = route?.params;

  const dispatch = useDispatch();
  const { updateUser, handleStatusCode } = useHelper();
  const { userData, token } = useSelector(store => store.userReducer);
  const { profilePictures } = useSelector(store => store.NewOnBoardingReducer);
  const [loader, setLoader] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [mediaOptions, setMediaOptions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [check, setCheck] = useState(false);
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

  useEffect(() => {
    if (edit) {
      let filtered = userData?.UserMedia?.filter(item => {
        return item?.type === "image";
      });
      let arr = [...profilePicArr];
      filtered.map((item, index) => {
        let obj = {
          name: "image",
          type: item?.type,
          uri: item?.url,
        };
        profilePicArr.map((item2, index2) => {
          if (index === index2) {
            arr[index2].image = obj;
          }
        });
      });
      setProfilePicArr(arr);
    } else {
      if (profilePictures?.length !== 0) {
        setProfilePicArr(profilePictures);
      }
    }
  }, []);

  const handleOnSelect = item => {
    console.log("Select", item);
    if (item?.uri) {
      let dummyArr = [...profilePicArr];
      dummyArr[item.index]["image"] = item;
      setProfilePicArr(dummyArr);
    } else {
      // setSelectedVibes(item);
    }
  };

  // const getIds = userData.UserMedia.map(item => item.id);
  // console.log(getIds, "idss");

  let getIds = [];
  if (userData && Array.isArray(userData.UserMedia)) {
    const getIds = userData.UserMedia.map(item => item.id);
  }
  console.log(getIds, "idss");

  const handleOnRemove = async index => {
    try {
      if (!userData || !Array.isArray(userData.UserMedia)) {
        console.error("User data or UserMedia is invalid.");
        return;
      }

      const idToRemove = userData.UserMedia[index]?.id;
      if (!idToRemove) {
        console.error("Invalid ID to remove:", idToRemove);
        return;
      }

      const url =
        "https://api.rishtaauntie.app/dev/rishta_auntie/api/v1/user/remove-media";
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token, // Assuming token is already defined
        },
        body: JSON.stringify({ userMediaIds: [idToRemove] }), // Adjusted payload format
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.ok) {
        // Check if media was successfully removed (based on the response status)
        if (response.status === 200) {
          let dummyArr = [...profilePicArr];
          dummyArr[index]["image"] = null;
          setProfilePicArr(dummyArr);
          // Display success alert
          alerts("success", data.message);
        } else {
          // Handle unsuccessful removal
          console.error("Media removal unsuccessful:", data.message);
        }
      } else {
        // Handle error response
        console.error("Error removing media:", data);
      }
    } catch (error) {
      // Handle any network or unexpected errors here
      console.error("Error removing media:", error);
    }
  };

  const handleCameraMedia = async (state, result) => {
    try {
      if (result == "granted") {
        const options = {
          mediaType: "photo",
          quality: 0.4,
        };

        await launchCamera(options, res => {
          if (res.errorCode == "others") {
            alerts(
              "error",
              res.errorMessage
                ? res.errorMessage
                : "Camera support is not available on your device."
            );
          } else if (res.didCancel === true) {
          } else if (
            res?.assets[0]?.height == 0 ||
            res?.assets[0]?.width == 0
          ) {
            alerts("error", "Please select jpeg/png format images.");
          } else {
            setMediaOptions(state);
            let obj = {};
            obj = {
              name: res?.assets[0]?.fileName,
              type: res?.assets[0]?.type,
              uri: res?.assets[0]?.uri,
            };

            let dummyArr = [...profilePicArr];
            dummyArr[0].image = obj;
            setProfilePicArr(dummyArr);
            setCheck(true);
          }
        })
          .catch(() => {})
          .finally(() => {
            setShowAlert(false);
          });
      }
    } catch (err) {
      console.log("camera err", err);
    }
  };

  const handleCamera = state => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.CAMERA,
        "camera",
        res => {
          handleCameraMedia(state, res);
        }
      );
    } else if (android) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.ANDROID.CAMERA,
        "camera",
        res => {
          handleCameraMedia(state, res);
        }
      );
    }
  };

  const continuePress = async () => {
    if (edit) {
      setLoader(true);
      let formData = new FormData();
      profilePicArr.map((x, index) => {
        if (x?.image && !x?.image?.uri?.includes("https")) {
          formData.append(`profilePic${index + 1}`, {
            name: x?.image?.name,
            type: x?.image.type,
            uri: x?.image?.uri,
          });
        }
      });

      await updateUser(formData, token);
      setLoader(false);
      navigation.goBack();
    } else {
      let check = profilePicArr.some(item => {
        return item?.image;
      });

      if (check) {
        dispatch({
          type: "profilePictures",
          payload: profilePicArr,
        });
        navigation.navigate("UploadVideo");
      } else {
        alerts("error", "Please atleast upload one image");
      }
    }
  };

  const handleGalleryMedia = async (state, result) => {
    try {
      if (result == "granted") {
        ImagePicker.openPicker({
          cropping: false,
          mediaType: "photo",
          compressImageQuality: 0.5,
          forceJpg: true,
        })
          .then(el => {
            if (el.height == 0 || el.width == 0) {
              alerts("error", "Please select jpeg/png/heif format images.");
            } else {
              let obj = {
                name: el.path.split("/")[el.path.split("/").length - 1],
                type: el.mime,
                uri: el.path,
              };

              let dummyArr = [...profilePicArr];
              dummyArr[0].image = obj;
              setProfilePicArr(dummyArr);
              setCheck(true);
            }
          })
          .catch(err => {
            alerts("error", err.toString());
            console.log("gallery picker err:", err);
          })
          .finally(() => {
            setMediaOptions(state);
            setShowAlert(false);
          });
      }
    } catch (err) {
      console.log("gallery err", err);
    }
  };

  const handleGallery = state => {
    if (ios) {
      handlePermissions.checkMultiplePermissions(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        "gallery",
        res => {
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
          res => {
            handleGalleryMedia(state, res);
          }
        );
      }
    }
  };
  const handleAlert = state => {
    setMediaOptions(state);
  };

  const handleRemoveImage = state => {
    setImageUri(null);
    setMediaOptions(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 20, backgroundColor: colors.white }}
    >
      <ActionCard
        videoUpload
        handleCloseAlert={() => setShowAlert(false)}
        isImageAct={true}
        heading={"Choose an Action"}
        handleGallery={handleGallery}
        handleCamera={handleCamera}
        handleAlert={handleAlert}
        handleRemoveImage={handleRemoveImage}
        alert={showAlert}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../../../assets/iconimages/arrow-back.png")}
        />
      </TouchableOpacity>
      <View style={{ marginTop: "8%" }}>
        <Text style={styles.heading}>Upload photos that reflect you</Text>
        <Text style={styles.lightText}>
          Upload your best photos to stand out.
        </Text>
        <View style={{ width: "100%", marginVertical: "5%" }}></View>

        <View
          style={{
            marginTop: 7,

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
            actualImage={{ width: "90%", borderRadius: 10, marginTop: "10%" }}
            onPress
            selectedItem={handleOnSelect}
            handleOnRemove={handleOnRemove}
            profilePicArr={profilePicArr}
            setProfilePicArr={setProfilePicArr}
            txt="Main profile pic"
            profile={true}
          />
        </View>
      </View>
      <BottomButton
        text={edit ? "Update" : "Continue"}
        loading={loader}
        onPress={() => continuePress()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: { fontFamily: "Inter-Bold", fontSize: 25, color: colors.black },
  lightText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    marginTop: "3%",
    color: colors.textGrey1,
  },
});

export default UploadPicture;
