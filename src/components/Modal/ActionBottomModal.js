import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ios,
  screenHeight,
  userDevice,
  windowHeight,
} from "../../utility/size";
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "../../services";
import { useHelper } from "../../hooks/useHelper";
import { Button, Divider } from "react-native-elements";

import colors from "../../utility/colors";
import Icons from "../../utility/icons";
import MyButton from "../buttons/MyButton";
import NewOnBoardingDesign from "../NewOnBoardingDesign";

const ActionBottomModal = ({
  onDismiss,
  fav,
  toggle,
  setAction,
  user,
  showToast,
  deleteAcc,
}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.userReducer);
  const {
    Alerts,
    navigation,
    handleStatusCode,
    keyboardOffset,
    setKeyboardOffset,
    setOffset,
  } = useHelper();

  const bottomSheetModalRef = useRef(null);
  const reportSnapPoints = useMemo(() => ["40%", "80%"], []);
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [adjustHeight, setAdjustHeight] = useState(false);

  const snapPoints = useMemo(
    () => (deleteAcc ? ["40%"] : adjustHeight ? ["31%"] : ["29%"]),
    [adjustHeight]
  );

  const reportOptions = [
    { id: 0, name: "Harrasment" },
    { id: 1, name: "Inappropriate content" },
    { id: 2, name: "They were impersonating someone else" },
    { id: 3, name: "They are too young to be on Risht Auntie" },
    { id: 4, name: "They were soliciting" },
    { id: 5, name: "Other" },
  ];

  useEffect(() => {
    setOffset(userDevice.includes("Pro Max") ? 75 : 70);

    const navbarHeight = screenHeight - windowHeight;
    if (navbarHeight > 60) setAdjustHeight(true);
    else setAdjustHeight(false);
  }, []);

  useEffect(() => {
    if (toggle) {
      bottomSheetModalRef.current?.present();
    } else if (!toggle) {
      bottomSheetModalRef.current?.close();
    }
  }, [toggle]);

  const handleSheetChanges = (index) => {
    if (index == -1) {
      setType("");
      setSubmitted(null);
      setKeyboardOffset(0);
    }
  };

  const handleUnmatchUser = () => {
    UserService.unmatchUser(user.userId, token)
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setSubmitted(["22%"]);
        }
      })
      .catch((err) => Alerts("error", err?.message.toString()));
  };

  const reportUser = (flag) => {
    if (reason == "") {
      Alerts("error", "Please choose a suitable option!");
    } else if (description == "") {
      Alerts("error", "Please give reason!");
    } else {
      UserService.reportUser(user.userId, token, {
        reason: reason,
        description: description,
      })
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            if (showToast && flag) {
              setType("");
              Alerts(
                "success",
                `You have reported and blocked ${user.userName}`
              );
            } else if (showToast) {
              setType("");
              Alerts("success", `You have reported ${user.userName}`);
            } else if (flag) {
              setType("reportAndBlock");
            } else {
              setType("reportUser");
            }

            dispatch({
              type: "SET_DISCOVER_INDEX",
              payload: user.userId,
            });
          }
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setSubmitted(["32%"]);
          setReason("");
          setDescription("");
          setFoundIndex(null);
        });
    }
  };

  const reportandBlock = () => {
    if (reason == "") {
      Alerts("error", "Please choose a suitable option!");
    } else if (description == "") {
      Alerts("error", "Please give reason!");
    } else {
      reportUser(true);
      handleBlockUser(true);
    }
  };

  const handleBlockUser = (flag) => {
    if (reason == "") {
      Alerts("error", "Please give reason!");
    } else {
      UserService.blockUser(user.userId, token, {
        reason,
      })
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            if (showToast && flag) {
              setType("");
              Alerts(
                "success",
                `You have reported and blocked ${user.userName}`
              );
            } else if (showToast) {
              setType("");
              Alerts("success", `You have blocked ${user.userName}`);
            } else if (flag) {
              setType("reportAndBlock");
            }

            dispatch({
              type: "SET_DISCOVER_INDEX",
              payload: user.userId,
            });
          }
        })
        .catch((err) => Alerts("error", err?.message.toString()))
        .finally(() => {
          setSubmitted(["32%"]);
          setReason("");
          setDescription("");
          setFoundIndex(null);
        });
    }
  };

  const handleNavigate = (screen) => {
    setType("");
    setSubmitted(null);
    setAction(false);

    setTimeout(() => {
      navigation.navigate(screen);
    }, 300);
  };

  const handleSelection = (el, index) => {
    setReason(el);
    setFoundIndex(index);
  };

  const renderDelete = () => (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <Text
        style={[
          styles.heading,
          {
            fontSize: 24,
          },
        ]}
      >
        Are you sure you want to delete your account?
      </Text>
      <Text style={styles.deleteTxt}>Type DELETE in the box below</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Type DELETE here..."
        placeholderTextColor={colors.vibeLightGrey}
        multiline={ios ? false : true}
        backgroundColor={colors.greyWhite}
        borderRadius={10}
        onChangeText={setReason}
        onEndEditing={onFormSubmitted}
      />
      <Button
        TouchableComponent={TouchableOpacity}
        // onPress={() => handleNavigate('HomeOne')}
        buttonStyle={styles.btnContainer2}
        titleStyle={[styles.btnTitle, { color: colors.white }]}
        title="Delete"
      />
    </View>
  );

  const renderBlockSubmission = (type) => (
    <>
      {type == "block" ? (
        <Text style={styles.heading}>You have blocked {user.userName}</Text>
      ) : type == "reportUser" ? (
        <Text style={styles.heading}>You have reported {user.userName}</Text>
      ) : (
        <Text style={styles.heading}>
          You have reported and blocked {user.userName}
        </Text>
      )}
      <Button
        TouchableComponent={TouchableOpacity}
        onPress={() => handleNavigate("BlockedList")}
        buttonStyle={styles.btnContainer1}
        titleStyle={[styles.btnTitle, { color: colors.primaryPink }]}
        title="View block list"
      />
      <Button
        TouchableComponent={TouchableOpacity}
        onPress={() => handleNavigate("HomeOne")}
        buttonStyle={styles.btnContainer2}
        titleStyle={[styles.btnTitle, { color: colors.white }]}
        title="Discover more profiles"
      />
    </>
  );

  const renderUnmatch = () => (
    <>
      <Text style={styles.heading}>
        You have unmatched with {user.userName}
      </Text>
      <Button
        TouchableComponent={TouchableOpacity}
        onPress={() => handleNavigate("HomeOne")}
        buttonStyle={styles.btnContainer2}
        titleStyle={[styles.btnTitle, { color: colors.white }]}
        title="Discover more profiles"
      />
    </>
  );

  const onFormSubmitted = () => {};

  const renderReport = () => (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Report User</Text>
      <Text>
        If a user is making you uncomfortable and not following the Rishta
        Auntie code of conduct, please let us know!
      </Text>

      {reportOptions.map((el, index) => (
        <View key={el.id}>
          <NewOnBoardingDesign
            mainOnPress={() => handleSelection(el.name, index)}
            findIndex={foundIndex}
            index={index}
            item={el}
            nameorid={"name"}
            multiSelect={false}
            search={false}
            divider={false}
          />
        </View>
      ))}

      <TextInput
        onChangeText={setDescription}
        style={styles.textInput}
        placeholder="Please explain so that the Rishta
        Auntie app can take action..."
        placeholderTextColor={colors.vibeLightGrey}
        multiline={ios ? false : true}
        backgroundColor={colors.greyWhite}
        borderRadius={10}
        height={120}
        textAlignVertical="center"
        onEndEditing={onFormSubmitted}
      />

      <Button
        TouchableComponent={TouchableOpacity}
        onPress={() => reportUser(false)}
        buttonStyle={styles.btnContainer1}
        titleStyle={[styles.btnTitle, { color: colors.primaryPink }]}
        title="Report only"
      />
      <Button
        TouchableComponent={TouchableOpacity}
        onPress={reportandBlock}
        buttonStyle={styles.btnContainer2}
        titleStyle={[styles.btnTitle, { color: colors.white }]}
        title="Report and block"
      />
    </BottomSheetScrollView>
  );

  const renderBlock = () => (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <Text style={styles.heading}>Block User</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Write here..."
        placeholderTextColor={colors.vibeLightGrey}
        multiline={ios ? false : true}
        backgroundColor={colors.greyWhite}
        borderRadius={10}
        onChangeText={setReason}
        onEndEditing={onFormSubmitted}
      />
      <MyButton title="Submit" onPress={() => handleBlockUser(false)} />
    </View>
  );

  const renderOptions = () => (
    <>
      <Text style={styles.heading}>Take action</Text>

      {fav ? (
        <Pressable onPress={fav} style={styles.row}>
          <Text style={styles.optionTxt}>Favourite messages</Text>
          <Icons.Feather
            name="arrow-right"
            size={18}
            color={colors.blackBlue}
          />
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            setType("unmatch");
            handleUnmatchUser();
          }}
          style={styles.row}
        >
          <Text style={styles.optionTxt}>Unmatch User</Text>
          <Icons.Feather
            name="arrow-right"
            size={18}
            color={colors.blackBlue}
          />
        </Pressable>
      )}

      <Divider width={1} color="#F3F4F6" />

      <Pressable onPress={() => setType("report")} style={styles.row}>
        <Text style={styles.optionTxt}>Report User</Text>
        <Icons.Feather name="arrow-right" size={18} color={colors.blackBlue} />
      </Pressable>

      <Divider width={1} color="#F3F4F6" />

      <Pressable onPress={() => setType("block")} style={styles.row}>
        <Text style={styles.optionTxt}>Block User</Text>
        <Icons.Feather name="arrow-right" size={18} color={colors.blackBlue} />
      </Pressable>
    </>
  );

  return (
    <GestureHandlerRootView
      style={[styles.rootContainer, { height: toggle ? windowHeight * 1 : 0 }]}
    >
      <View style={[styles.container, { bottom: keyboardOffset }]}>
        <BottomSheetModalProvider>
          <View style={{ flex: 1 }}>
            <BottomSheetModal
              onDismiss={onDismiss}
              backgroundStyle={{
                borderTopLeftRadius: 35,
                borderTopRightRadius: 35,
                backgroundColor: colors.greyWhite,
              }}
              handleIndicatorStyle={{
                width: "10%",
                marginVertical: "1%",
                backgroundColor: colors.primaryPink,
              }}
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={
                type == "report"
                  ? reportSnapPoints
                  : submitted
                  ? submitted
                  : snapPoints
              }
              onChange={handleSheetChanges}
            >
              <View
                style={[styles.content, type == "report" && { height: "97%" }]}
              >
                {deleteAcc
                  ? renderDelete()
                  : /reportUser|reportAndBlock|block/.test(type) && submitted
                  ? renderBlockSubmission(type)
                  : type == "unmatch"
                  ? renderUnmatch()
                  : type == "report"
                  ? renderReport()
                  : type == "block"
                  ? renderBlock()
                  : renderOptions()}
              </View>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
  );
};

export default ActionBottomModal;

const styles = StyleSheet.create({
  rootContainer: {
    width: "100%",
    backgroundColor: "#00000061",
    bottom: 0,
    position: "absolute",
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    height: "93%",
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 18,
  },
  heading: {
    fontSize: 22,
    color: colors.blackBlue,
    fontFamily: "Inter-Bold",
    marginBottom: "2%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: "4%",
  },
  optionTxt: {
    fontSize: 14,
    color: colors.blackBlue,
    fontFamily: "Inter-Medium",
  },
  textInput: {
    padding: 12,
    marginVertical: "3%",
    color: colors.black,
    fontFamily: "Inter-Regular",
    width: "90%",
    alignSelf: "center",
  },
  btnContainer1: {
    borderRadius: 10,
    backgroundColor: colors.primaryPinkOpacity,
    borderWidth: 0.5,
    borderColor: colors.primaryPink,
    paddingVertical: "4%",
    marginTop: "4%",
  },
  btnContainer2: {
    borderRadius: 10,
    backgroundColor: colors.primaryPink,
    paddingVertical: "5%",
    marginTop: "7%",
  },
  btnTitle: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
  deleteTxt: {
    fontSize: 12,
    color: colors.slateGrey,
    fontFamily: "Inter-Regular",
  },
});
