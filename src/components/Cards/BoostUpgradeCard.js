import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { android, windowHeight } from "../../utility/size";
import { useDispatch, useSelector } from "react-redux";

import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";
import SettingButton from "../buttons/SettingButton";
import CountDown from "react-native-countdown-component";

const BoostUpgradeCard = props => {
  const { proMember, type } = props;

  const dispatch = useDispatch();
  const { userData, isSpotTimerFinished, isProfileTimerFinished } = useSelector(
    store => store.userReducer
  );

  let seconds = 0;
  const timerInSeconds = isSpotTimerFinished?.time;

  const timeToShow = timerInSeconds >= 3600 ? ["H", "M", "S"] : ["M", "S"];
  const timeLabels =
    timerInSeconds >= 3600 ? { h: "", m: "", s: "" } : { m: "", s: "" };

  const onFinish = () => {
    dispatch({
      type: "SET_SPOT_TIMER",
      payload: {
        userId: userData.id,
        showtimer: false,
        time: 0,
      },
    });

    seconds = 0;
  };

  const onChange = () => {
    seconds += 1;
    if (seconds == 10) {
      dispatch({
        type: "SET_SPOT_TIMER",
        payload: {
          userId: userData.id,
          showtimer: true,
          time: isSpotTimerFinished?.time - 10,
        },
      });

      seconds = 0;
    }
  };

  return (
    <View style={[styles.actionItemsView]}>
      {type == "Spotlight:" &&
      props.timer &&
      isSpotTimerFinished?.userId == userData.id &&
      isSpotTimerFinished?.showtimer ? (
        <View style={styles.timeView}>
          <Text style={styles.timeText}>Time left:</Text>
          <CountDown
            until={timerInSeconds}
            size={10}
            onFinish={onFinish}
            onChange={onChange}
            digitStyle={{ backgroundColor: "transparent" }}
            digitTxtStyle={{ color: colors.primaryPink }}
            timeToShow={timeToShow}
            timeLabels={timeLabels}
          />
        </View>
      ) : type == "Profiles left" &&
        props.timer &&
        isProfileTimerFinished?.userId == userData.id &&
        isProfileTimerFinished?.showtimer ? (
        <View style={styles.timeView}>
          <Text style={styles.timeText}>Time left:</Text>
          <CountDown
            until={timerInSeconds}
            size={10}
            onFinish={() => {
              dispatch({
                type: "SET_PROFILE_TIMER",
                payload: {
                  userId: userData.id,
                  timer: false,
                },
              });
            }}
            onChange={() => {}}
            digitStyle={{ backgroundColor: "transparent" }}
            digitTxtStyle={{ color: colors.primaryPink }}
            timeToShow={["M", "S"]}
            timeLabels={{ m: "", s: "" }}
          />
        </View>
      ) : null}

      <View style={styles.typeMainView}>
        <Pressable onPress={props.onSpotPress}>
          <FastImage
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
            source={props.imageSource}
          />
        </Pressable>
        {type === "Profiles left" && proMember ? null : (
          <View style={{ marginLeft: 20 }}>
            <Text style={styles.typeText}>{props.type}</Text>
            <Text style={styles.remainingText}>{props.typeCount}</Text>
          </View>
        )}
      </View>
      {type === "Profiles left" && proMember ? null : (
        <>
          <View style={{ marginTop: 14 }}>
            <SettingButton onPress={props.onPress} title={props.buttonTitle} />
          </View>
          <Text style={styles.bottomText}>{props.bottomText}</Text>
        </>
      )}
    </View>
  );
};
export default BoostUpgradeCard;

const styles = StyleSheet.create({
  actionItemsView: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    paddingVertical: "5%",
    borderRadius: 10,
    paddingHorizontal: "5%",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    height: android ? windowHeight * 0.33 : windowHeight * 0.27,
  },
  timeView: {
    flexDirection: "row",
    paddingHorizontal: "2%",
    height: 25,
    backgroundColor: colors.primaryPinkOpacity,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  timeText: {
    fontSize: 10,
    fontFamily: "Inter-Medium",
    color: colors.primaryPink,
  },
  typeMainView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    width: "100%",
  },
  typeText: {
    color: "#64748B",
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  remainingText: {
    color: "#121826",
    fontSize: 14,
    fontFamily: "Inter-Bold",
    marginTop: 5,
  },
  bottomText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Inter-Regular",
    marginTop: 14,
  },
});
