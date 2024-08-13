import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { insightsArr } from "../../utility/regex";
import { useHelper } from "../../hooks/useHelper";
import moment from "moment";
import ChatServices from "../../services/ChatServices";
import BadgeServices from "../../services/BadgeServices";
import styles from "./styles";
import Loader from "../../components/Loader";
import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";
import SettingButton from "../../components/buttons/SettingButton";

const ChatInsight = props => {
  const navProps = props.props;
  const { el } = navProps.route.params;
  const { Alerts, handleStatusCode } = useHelper();
  const { token, userData } = useSelector(store => store.userReducer);
  const proMember = userData?.UserSetting?.isSubscribed;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [chatInsight, setChatInsight] = useState({});
  const [insight, setInsight] = useState({});
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState("");
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

  const getChatInsight = () => {
    if (Object.keys(el).length > 0 && token != null) {
      setLoading(true);
      ChatServices.getChatInsight(el.ChatMembers[0].User.id, token)
        .then(res => {
          console.log("🚀 getChatInsight res:", res);
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setChatInsight(res.data.data);
            getUserBadge();
          }
        })
        .catch(err => {
          console.log("getChatInsight err:", err);
        })
        .finally(() => setLoading(false));
    }
  };

  const getUserBadge = () => {
    setLoading(true);
    BadgeServices.getUserBadges(el.ChatMembers[0].User.id, token)
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
          if (res.data.error.message.includes("premium")) {
            setError(res.data.error.message);
          } else {
            Alerts("error", res.data.error.message);
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

  useFocusEffect(
    useCallback(() => {
      getChatInsight();
    }, [])
  );

  return loading ? (
    <Loader />
  ) : (
    <SafeAreaView style={styles.container}>
      {proMember ? (
        <>
          <Text style={styles.tagline1}>Welcome to Chat Insights!</Text>
          <Text style={styles.tagline}>
            Users you chat with can see your insights. Play it smart. 😉
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.tagline1}>Unlock Chat Insights!</Text>
          <Text style={styles.tagline}>
            Users you chat with can see your insights. Play it smart. 😉
          </Text>
        </>
      )}
      <View style={styles.paddingContainer}>
        {error.length > 0 && (
          <Text style={{ color: "red", marginLeft: "3%", fontWeight: "bold" }}>
            {error}
          </Text>
        )}

        {userData != null && Object.keys(userData).length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                fontFamily: "Inter-Bold",
                alignSelf: "center",
                textAlign: "center",
                color: "#D90368",
              }}
            >
              {userData?.firstName +
                " " +
                userData?.lastName +
                " " +
                "Insights"}
            </Text>
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
      {!proMember && (
        <View style={styles.actionItemsView}>
          <View style={styles.typeMainView}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: colors.black,
              }}
            >
              Deepen your connections with full insights.
            </Text>
          </View>
          <View style={{ marginTop: 14 }}>
            <SettingButton
              onPress={() => navigation.navigate("Paywall")}
              title="Upgrade now to unlock"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatInsight;
