import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserService } from "../../services";
import { useSelector } from "react-redux";
import { insightsArr } from "../../utility/regex";
import { useHelper } from "../../hooks/useHelper";

import Loader from "../../components/Loader";
import styles from "./styles";
import moment from "moment";
import HeaderContainer from "../../components/containers/headerContainer";
import FastImage from "react-native-fast-image";
import BadgeServices from "../../services/BadgeServices";
import colors from "../../utility/colors";

const MyInsight = props => {
  const { token, userData } = useSelector(store => store.userReducer);
  const { Alerts, handleStatusCode } = useHelper();
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState({});
  const [badges, setBadges] = useState([]);
  let currentDate = moment(new Date());

  const calculateDateAndTime = () => {
    let diff = currentDate.diff(insight.signUpDate, "days");
    if (diff <= 7) {
      return (
        <>
          <Text style={styles.heading}>Just Joined</Text>
          <Text style={styles.description}>Joined Rishta Auntie Recently</Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.heading}>Joined</Text>
          <Text style={styles.description}>Joined {diff} days ago</Text>
        </>
      );
    }
  };

  const getMyInsight = () => {
    setLoading(true);
    UserService.myInsight(token)
      .then(res => {
        console.log("🚀 myInsight res:", res);
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setInsight(res.data.data);
          getUserBadge();
        }
      })
      .catch(err => {
        console.log("myInsight err:", err);
      })
      .finally(() => setLoading(false));
  };

  const getUserBadge = () => {
    setLoading(true);
    BadgeServices.getUserBadges(userData?.id, token)
      .then(res => {
        console.log("getUserBadges res", res);
        if (res.status >= 200 && res.status <= 299) {
          setBadges(res.data.data);
        } else if (res.status >= 300 && res.status <= 399) {
          Alerts(
            "error",
            "You need to perform further actions to complete the request!"
          );
        } else if (res.status >= 400 && res.status <= 499) {
          if (res.data?.error?.message.includes("premium")) {
            setError(res.data.error.message);
          } else {
            Alerts("error", res.data?.error?.message);
          }
        } else if (res.status >= 500 && res.status <= 599) {
          Alerts(
            "error",
            "Internal server error! Your server is probably down."
          );
        } else {
          Alerts("error", "Something went wrong. Please try again later!");
        }
      })
      .catch(err => console.log("getUserBadges err:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getMyInsight();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <SafeAreaView style={styles.container}>
      <HeaderContainer
        gobackButtonPress={() => props.navigation.goBack()}
        goback={"arrow-back"}
        backButton
        btnWithTitle
        screenTitle="Insights"
        titleStyle={{
          alignItems: "flex-end",
          fontSize: 22,
          fontFamily: "Inter-Bold",
          color: colors.blackBlue,
        }}
      />

      <Text style={styles.tagline}>
        Users you match with can see your insights. Play it smart. 😉
      </Text>
      <View style={styles.paddingContainer}>
        {/* <Text style={styles.title}>Insights</Text> */}
        {insight != null && Object.keys(insight).length > 0 && (
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <FastImage
                source={insightsArr[0].icon}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1, marginLeft: "4%" }}>
              {calculateDateAndTime()}
            </View>
          </View>
        )}

        {badges.length > 0 &&
          badges.map(el =>
            insightsArr.map((item, index) => {
              if (el.name == item.title) {
                return (
                  <View key={index} style={styles.row}>
                    <View style={styles.iconContainer}>
                      <FastImage
                        source={item.icon}
                        style={styles.icon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: "4%" }}>
                      <Text style={styles.heading}>{item.title}</Text>
                      <Text style={styles.description}>{item.desc}</Text>
                    </View>
                  </View>
                );
              } else {
                return null;
              }
            })
          )}
      </View>
    </SafeAreaView>
  );
};

export default MyInsight;
