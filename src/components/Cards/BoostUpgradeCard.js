import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, AppState } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { windowHeight } from "../../utility/size";

import moment from "moment";
import colors from "../../utility/colors";
import FastImage from "react-native-fast-image";
import SettingButton from "../buttons/SettingButton";
import CountDown from "react-native-countdown-component";

const BoostUpgradeCard = props => {
  const { proMember, focused, type } = props;

  const dispatch = useDispatch();
  const { userData } = useSelector(store => store.userReducer);
  const {
    isSpotTimerFinished,
    isProfileTimerFinished,
    navStartTimer,
    navEndTimer,
  } = useSelector(store => store.timerReducer);

  let secs = 0;
  let startTime = 0;
  let endTime = 0;
  const timerInSeconds =
    type == "Spotlight:"
      ? isSpotTimerFinished?.time
      : isProfileTimerFinished?.time;

  const [seconds, setSeconds] = useState(0);

  const timeToShow = timerInSeconds >= 3600 ? ["H", "M", "S"] : ["M", "S"];
  const timeLabels =
    timerInSeconds >= 3600 ? { h: "", m: "", s: "" } : { m: "", s: "" };

  const onFinish = type => {
    if (type == "spot") {
      dispatch({
        type: "SET_SPOT_TIMER",
        payload: {
          userId: userData.id,
          showtimer: false,
          time: 0,
        },
      });
    } else {
      dispatch({
        type: "SET_PROFILE_TIMER",
        payload: {
          userId: userData.id,
          showtimer: false,
          time: 0,
        },
      });
    }

    secs = 0;
  };

  const onChange = type => {
    secs += 1;

    if (seconds > 0) {
      if (type == "spot") {
        dispatch({
          type: "SET_SPOT_TIMER",
          payload: {
            userId: userData.id,
            showtimer: true,
            time: isSpotTimerFinished?.time - seconds,
          },
        });
      } else {
        dispatch({
          type: "SET_PROFILE_TIMER",
          payload: {
            userId: userData.id,
            showtimer: true,
            time: isProfileTimerFinished?.time - seconds,
          },
        });
      }

      setSeconds(0);
    } else {
      if (type == "spot") {
        dispatch({
          type: "SET_SPOT_TIMER",
          payload: {
            userId: userData.id,
            showtimer: true,
            time: isSpotTimerFinished?.time - 1,
          },
        });
      } else {
        dispatch({
          type: "SET_PROFILE_TIMER",
          payload: {
            userId: userData.id,
            showtimer: true,
            time: isProfileTimerFinished?.time - 1,
          },
        });
      }

      secs = 0;
    }
  };

  const handleAppState = appState => {
    if (appState == "background") {
      startTime = moment(Date.now());
    } else {
      endTime = moment(Date.now());
      let diff = moment.duration(endTime.diff(startTime));
      let seconds = Math.floor(diff.asSeconds());

      setSeconds(seconds);
    }
  };

  useEffect(() => {
    const subs = AppState.addEventListener("change", handleAppState);

    return () => {
      subs.remove();
    };
  }, []);

  useEffect(() => {
    if (focused && startTime != 0) {
      endTime = moment(Date.now());
      let diff = moment.duration(endTime.diff(startTime));
      let seconds = Math.floor(diff.asSeconds());

      dispatch({
        type: "SET_SPOT_TIMER",
        payload: {
          userId: userData.id,
          showtimer: true,
          time: isSpotTimerFinished?.time - seconds,
        },
      });

      dispatch({
        type: "SET_PROFILE_TIMER",
        payload: {
          userId: userData.id,
          showtimer: true,
          time: isProfileTimerFinished?.time - seconds,
        },
      });

      startTime = 0;
      endTime = 0;
    } else if (
      (!focused && isSpotTimerFinished?.showtimer) ||
      (!focused && isProfileTimerFinished?.showtimer)
    ) {
      startTime = moment(Date.now());
    }
  }, [focused]);

  // useEffect(() => {
  //   if (focused && navStartTimer != 0 && navEndTimer != 0) {
  //     let diff = moment.duration(navEndTimer.diff(navStartTimer));
  //     let seconds = Math.floor(diff.asSeconds());

  //     dispatch({
  //       type: "SET_SPOT_TIMER",
  //       payload: {
  //         userId: userData.id,
  //         showtimer: true,
  //         time: isSpotTimerFinished?.time - seconds,
  //       },
  //     });

  //     dispatch({
  //       type: "SET_PROFILE_TIMER",
  //       payload: {
  //         userId: userData.id,
  //         showtimer: true,
  //         time: isProfileTimerFinished?.time - seconds,
  //       },
  //     });
  //     setTimeout(() => {
  //       dispatch({
  //         type: "SET_NAV_START_TIMER",
  //         payload: 0,
  //       });
  //       dispatch({
  //         type: "SET_NAV_END_TIMER",
  //         payload: 0,
  //       });
  //     }, 300);
  //   }
  // }, [focused, navStartTimer, navEndTimer]);

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
            onFinish={() => onFinish("spot")}
            onChange={() => onChange("spot")}
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
            onFinish={() => onFinish("profile")}
            onChange={() => onChange("profile")}
            digitStyle={{ backgroundColor: "transparent" }}
            digitTxtStyle={{ color: colors.primaryPink }}
            timeToShow={timeToShow}
            timeLabels={timeLabels}
          />
        </View>
      ) : null}

      <View style={styles.typeMainView}>
        <FastImage
          resizeMode="contain"
          style={{ width: 30, height: 30 }}
          source={props.imageSource}
        />
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
      {proMember && (
        <Text style={styles.bottomText}>
          You can view unlimited profiles with your Rishta Auntie Gold
          membership
        </Text>
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
    minHeight: windowHeight * 0.25,
    maxHeight: windowHeight * 0.27,
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
