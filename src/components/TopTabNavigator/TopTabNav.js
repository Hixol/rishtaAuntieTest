import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import { UserService } from "../../services";
import { useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { windowHeight, windowWidth } from "../../utility/size";
import { useHelper } from "../../hooks/useHelper";

import BottomSheetInteraction from "../Modal/BottomSheetInteraction";
import FastImage from "react-native-fast-image";
import colors from "../../utility/colors";
import FlipCard from "../Cards/FlipCard";
import TheirFlipCard from "../Cards/theirFlipCard";

const TabViewExample = (props) => {
  const { Alerts, handleStatusCode } = useHelper();
  const navigation = useNavigation();

  const { userData } = useSelector((store) => store.userReducer);

  const [play, setPlay] = useState(true);
  const [showWaves, setShowWaves] = useState(false);

  const TheirMoves = (props) => {
    let isFocused = useIsFocused();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [theirMoves, setTheirMoves] = useState();
    const [selectedItems, setSelectedItems] = useState(["All interactions"]);
    const { token } = useSelector((store) => store.userReducer);

    const filters = [
      { id: 1, title: "All interactions" },
      { id: 2, title: "All Requests" },
      { id: 3, title: "Voice Note" },
      { id: 4, title: "Views" },
      { id: 5, title: "Likes" },
      { id: 6, title: "Comments" },
      { id: 7, title: "Pending" },
      { id: 8, title: "Accepted" },
      { id: 9, title: "Rejected" },
    ];

    const handleOnSelect = (state) => {
      setSelectedItems(state);
    };

    const getAllTheirMoves = () => {
      setLoading(true);
      UserService.getAllTheirMoves(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            let arr = [];
            let dataObj = {};
            res?.data?.data.data.map((el) => {
              // if (el.type != 'MATCH_REQUEST') {
              //   dataObj = {
              //     createdAt: el.createdAt,
              //     id: el.id,
              //     status: null,
              //     resource: el.resource,
              //     resourceType: el.resourceType,
              //     type: el.type,
              //     user: el.user,
              //   };
              // }
              if (el.type == "MATCH_REQUEST") {
                dataObj = {
                  createdAt: el.createdAt,
                  id: el.id,
                  status: el.status,
                  resource: null,
                  resourceType: null,
                  type: el.type,
                  user: el.User,
                };
                arr.push(dataObj);
              }
            });

            setTheirMoves({
              count: res?.data?.data.count,
              data: arr,
            });
          }
        })
        .catch((error) => {
          console.log("getAllTheirMoves err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllTheirLikes = () => {
      setLoading(true);

      UserService.getAllTheirLikes(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setTheirMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllTheirLikes err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllTheirComments = () => {
      setLoading(true);

      UserService.getAllTheirComments(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setTheirMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllTheirComments err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllTheirVoice = () => {
      setLoading(true);

      UserService.getAllTheirVoice(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setTheirMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllTheirVoice err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllTheirViews = () => {
      setLoading(true);
      UserService.getAllTheirViews(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setTheirMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllTheirViews err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllTheirMatchRequests = () => {
      setLoading(true);

      UserService.getAllTheirMatchRequest(
        token,
        selectedItems[0] === "All Requests" ||
          selectedItems[0] === "Pending" ||
          selectedItems[0] === "Accepted" ||
          selectedItems[0] === "Rejected"
          ? `filter=${selectedItems[0]}`
          : null
      )
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setTheirMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllTheirMatchRequests err", error);
        })
        .finally(() => setLoading(false));
    };

    const circularIconCrossPress = (item) => {
      let urlencoded = new URLSearchParams();

      urlencoded.append("id", item?.id);
      urlencoded.append("status", 2);
      UserService.matchRequest(urlencoded, token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            Alerts("success", "Request Rejected Successfully");
          }
        })
        .catch((error) => {
          console.log("circularIconCrossPress err", error);
        })
        .finally(() => setLoading(false));
    };
    const circularIconChatPress = (item) => {
      let urlencoded = new URLSearchParams();

      urlencoded.append("id", item?.id);
      urlencoded.append("status", 1);
      UserService.matchRequest(urlencoded, token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            Alerts("success", "Request Accepted Successfully");
            navigation.navigate("UserChatList");
          }
        })
        .catch((error) => {
          console.log("circularIconChatPress err", error);
        })
        .finally(() => setLoading(false));
    };

    useFocusEffect(
      React.useCallback(() => {
        return selectedItems[0] === "All interactions"
          ? getAllTheirMoves()
          : selectedItems[0] === "Likes"
          ? getAllTheirLikes()
          : selectedItems[0] === "Comments"
          ? getAllTheirComments()
          : selectedItems[0] === "Voice Note"
          ? getAllTheirVoice()
          : selectedItems[0] === "Views"
          ? getAllTheirViews()
          : selectedItems[0] === "All Requests" ||
            selectedItems[0] === "Pending" ||
            selectedItems[0] === "Rejected" ||
            selectedItems[0] === "Accepted"
          ? getAllTheirMatchRequests()
          : null;
      }, [selectedItems[0]])
    );

    return (
      <View style={styles.container}>
        {/* <View style={styles.interactionView}>
          <Text style={styles.interactionText}>Their Interaction</Text>
        </View> */}

        {/* <View style={styles.topContainer}>
          <View style={styles.topCard}>
            <FastImage
              style={{width: '15%', height: '75%'}}
              resizeMode={'contain'}
              source={require('../../assets/iconimages/spotlight-01.png')}
            />
            <View style={styles.centerdCard}>
              <Text style={styles.cardTitle}>Rishta Auntie Spotlight:</Text>
              <Text style={styles.cardDesc}>
                Boost my visibility, get more interactions
              </Text>
              <TouchableOpacity
                onPressIn={() => navigation.navigate('Paywall')}
                style={styles.cardBtn}>
                <Text style={styles.cardBtnTitle}>Spotlight for $5</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.spotlightTxt}>
                {userData?.UserSetting?.noOfSpotlight}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(!showModal)}
            style={{
              zIndex: 1,
              position: 'absolute',
              right: 0,

              height: '100%',
              alignItems: 'center',
              width: '15%',
            }}>
            <ImageBackground
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                right: -3,
                width: '100%',
              }}
              imageStyle={{width: '100%', height: '100%'}}
              resizeMode="contain"
              source={require('../../assets/iconimages/filterView.png')}>
              <FastImage
                resizeMode="contain"
                style={{
                  width: '40%',
                  left: 3,
                  height: '50%',
                }}
                source={require('../../assets/iconimages/filter.png')}
              />
            </ImageBackground>
          </TouchableOpacity>
        </View> */}

        <View style={styles.filterContainer}>
          {filters.map((el) => (
            <Pressable
              onPress={() => handleOnSelect([el.title])}
              key={el.id}
              style={[
                styles.filterBox,
                el.title == selectedItems[0] && styles.selectedFilterBox,
              ]}
            >
              <Text
                style={[
                  styles.filterTxt,
                  el.title == selectedItems[0] && styles.selectedFilterTxt,
                ]}
              >
                {el.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.listView}>
            {loading ? (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={colors.primaryPink}
                  style={{ marginRight: 7 }}
                />
              </View>
            ) : theirMoves?.count === 0 ? (
              <View
                style={{
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 20,
                    fontFamily: "Inter-Medium",
                    color: colors.primaryBlue,
                  }}
                >
                  No Interactions with your Profile yet
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                }}
              >
                {theirMoves?.data.map((item, index) => {
                  return (
                    <TouchableOpacity key={`${item.id}` + index}>
                      <TheirFlipCard
                        status={item?.status}
                        beforeFlipPress={() =>
                          navigation.navigate("userDetailScreen", {
                            userId:
                              selectedItems[0] === "All Requests" ||
                              selectedItems[0] === "Pending" ||
                              selectedItems[0] === "Accepted" ||
                              selectedItems[0] === "Rejected"
                                ? item?.User?.id
                                : selectedItems[0] === "Views"
                                ? item?.viewerUser?.id
                                : item?.user?.id,
                          })
                        }
                        item={item}
                        theirMoves={isFocused ? "theirMoves" : null}
                        selectedFilter={selectedItems[0]}
                        userMediaType={item?.resource?.type}
                        question={item?.resource?.Question?.title}
                        createdAt={item?.createdAt}
                        voiceNoteUrl={item?.voiceNoteUrl}
                        answer={item?.resource?.answer}
                        resourceType={item?.resourceType}
                        interactionComment={
                          item?.type === "COMMENT" ? item?.comment : null
                        }
                        promptImage={{
                          uri: item?.user?.UserMedia.filter(
                            (item) => item?.sequence == 1
                          )[0]?.url,
                        }}
                        Image={{
                          uri:
                            selectedItems[0] === "All Requests" ||
                            selectedItems[0] === "Pending" ||
                            selectedItems[0] === "Accepted" ||
                            selectedItems[0] === "Rejected"
                              ? item?.User?.UserMedia[0]?.url
                              : selectedItems[0] === "Views"
                              ? item?.viewerUser?.UserMedia[0]?.url
                              : item?.resource?.type === "image"
                              ? item?.user?.UserMedia.filter(
                                  (item) => item?.sequence == 1
                                )[0]?.url
                              : item?.resource?.type === "video"
                              ? item?.user?.UserMedia.filter(
                                  (item) => item?.sequence == 1
                                )[0]?.url
                              : item.type === "MATCH_REQUEST"
                              ? item.user.UserMedia[0].url
                              : null,
                        }}
                        selectedItems={selectedItems[0]}
                        Bname={
                          selectedItems[0] === "All Requests" ||
                          selectedItems[0] === "Pending" ||
                          selectedItems[0] === "Accepted" ||
                          selectedItems[0] === "Rejected"
                            ? item?.User?.firstName
                            : selectedItems[0] === "Views"
                            ? item?.viewerUser?.firstName
                            : item?.user?.firstName
                        }
                        BdaysAgo={"2 Days Ago"}
                        type={item?.type}
                        age={
                          selectedItems[0] === "All Requests" ||
                          selectedItems[0] === "Pending" ||
                          selectedItems[0] === "Accepted" ||
                          selectedItems[0] === "Rejected"
                            ? ", " + item?.User?.Profile?.age
                            : selectedItems[0] === "Views"
                            ? ", " + item?.viewerUser?.Profile?.age
                            : ", " + item?.user?.Profile?.age
                        }
                        Blocation={[
                          selectedItems[0] === "All Requests" ||
                          selectedItems[0] === "Pending" ||
                          selectedItems[0] === "Accepted" ||
                          selectedItems[0] === "Rejected"
                            ? item?.User?.city + ", " + item?.User?.country
                            : selectedItems[0] === "Views"
                            ? item?.viewerUser?.city +
                              ", " +
                              item?.viewerUser?.country
                            : item?.user?.city,
                          ", ",
                          item?.user?.country,
                        ]}
                        usersProfileName={item?.user?.firstName}
                        crossBtn
                        commentLikeButton
                        play={play}
                        showWaves={showWaves}
                        audioSource={props.audioSource}
                        circularIconCrossPress={() =>
                          circularIconCrossPress(item)
                        }
                        circularIconChatPress={() =>
                          circularIconChatPress(item)
                        }
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        <GestureHandlerRootView
          style={{
            width: "100%",
            height: showModal ? windowHeight * 0.6 : 0,
            bottom: 0,
            position: showModal ? "absolute" : "relative",
            zIndex: 1,
          }}
        >
          <BottomSheetInteraction
            handleOnSelect={handleOnSelect}
            interactionView
            onDismiss={() => setShowModal(false)}
            showModal={showModal}
          />
        </GestureHandlerRootView>
      </View>
    );
  };

  const MyMoves = () => {
    const isFocused = useIsFocused();
    const [myMoves, setMyMoves] = useState();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(["All interactions"]);
    const { token } = useSelector((store) => store.userReducer);

    const filters = [
      { id: 1, title: "All interactions" },
      { id: 2, title: "Voice Note" },
      { id: 3, title: "Views" },
      { id: 4, title: "Likes" },
      { id: 5, title: "Comments" },
    ];

    const handleOnSelect = (state) => {
      setSelectedItems(state);
    };

    const getAllMyMoves = () => {
      setLoading(true);
      UserService.getAllMyMoves(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setMyMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllMyMoves err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllMyComments = () => {
      setLoading(true);
      UserService.getAllMyComments(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setMyMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllMyComments err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllMyLikes = () => {
      setLoading(true);
      UserService.getAllMyLikes(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setMyMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllMyLikes err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllMyVoice = () => {
      setLoading(true);
      UserService.getAllMyVoice(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setMyMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllMyVoice err", error);
        })
        .finally(() => setLoading(false));
    };

    const getAllMyViews = () => {
      setLoading(true);
      UserService.getAllMyViews(token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            setMyMoves(res?.data?.data);
          }
        })
        .catch((error) => {
          console.log("getAllMyViews err", error);
        })
        .finally(() => setLoading(false));
    };

    useFocusEffect(
      React.useCallback(() => {
        return selectedItems[0] === "All interactions"
          ? getAllMyMoves()
          : selectedItems[0] === "Likes"
          ? getAllMyLikes()
          : selectedItems[0] === "Comments"
          ? getAllMyComments()
          : selectedItems[0] === "Voice Note"
          ? getAllMyVoice()
          : selectedItems[0] === "Views"
          ? getAllMyViews()
          : null;
      }, [selectedItems[0]])
    );

    return (
      <View style={styles.container}>
        {/* <View style={styles.interactionView}>
          <Text style={styles.interactionText}>My Interaction</Text>
        </View> */}
        {/* <View style={styles.topContainer}>
          <View style={styles.topCard}>
            <FastImage
              style={{width: '15%', height: '75%'}}
              resizeMode={'contain'}
              source={require('../../assets/iconimages/spotlight-01.png')}
            />
            <View style={styles.centerdCard}>
              <Text style={styles.cardTitle}>Rishta Auntie Spotlight:</Text>
              <Text style={styles.cardDesc}>
                Boost my visibility, get ore interactions
              </Text>
              <TouchableOpacity
                onPressIn={() => navigation.navigate('Paywall')}
                style={styles.cardBtn}>
                <Text style={styles.cardBtnTitle}>Spotlight for $5</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.spotlightTxt}>
                {userData?.UserSetting?.noOfSpotlight}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(!showModal)}
            style={{
              zIndex: 1,
              position: 'absolute',
              right: 0,

              height: '100%',
              alignItems: 'center',
              width: '15%',
            }}>
            <ImageBackground
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                right: -3,
                width: '100%',
              }}
              imageStyle={{width: '100%', height: '100%'}}
              resizeMode="contain"
              source={require('../../assets/iconimages/filterView.png')}>
              <FastImage
                resizeMode="contain"
                style={{
                  width: '40%',
                  left: 3,
                  height: '50%',
                }}
                source={require('../../assets/iconimages/filter.png')}
              />
            </ImageBackground>
          </TouchableOpacity>
        </View> */}

        <View style={styles.filterContainer}>
          {filters.map((el) => (
            <Pressable
              onPress={() => handleOnSelect([el.title])}
              key={el.id}
              style={[
                styles.filterBox,
                el.title == selectedItems[0] && styles.selectedFilterBox,
              ]}
            >
              <Text
                style={[
                  styles.filterTxt,
                  el.title == selectedItems[0] && styles.selectedFilterTxt,
                ]}
              >
                {el.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.listView}>
            {loading ? (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={colors.primaryPink}
                  style={{ marginRight: 7 }}
                />
              </View>
            ) : myMoves?.count === 0 ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  padding: "2%",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 20,
                    fontFamily: "Inter-Medium",
                    color: colors.primaryBlue,
                    alignSelf: "center",
                  }}
                >
                  No Interactions with your Profile yet
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                }}
              >
                {myMoves?.data.map((item, id) => {
                  return (
                    <TouchableOpacity key={item.id}>
                      <FlipCard
                        beforeFlipPress={() =>
                          navigation.navigate("userDetailScreen", {
                            userId: item?.otherUser?.id,
                          })
                        }
                        item={item}
                        otherUserId={item?.otherUser?.id}
                        myMoves={isFocused ? "myMoves" : null}
                        userMediaType={item?.resource?.type}
                        question={item?.resource?.Question?.title}
                        createdAt={item?.createdAt}
                        voiceNoteUrl={item?.voiceNoteUrl}
                        answer={item?.resource?.answer}
                        resourceType={item?.resourceType}
                        interactionComment={
                          item?.type === "COMMENT" ? item?.comment : null
                        }
                        promptImage={{
                          uri: item?.otherUser?.UserMedia.filter(
                            (item) => item?.sequence == 1
                          )[0]?.url,
                        }}
                        selectedItems={selectedItems[0]}
                        viewsImage={{
                          uri: item?.vieweeUser?.UserMedia[0]?.url,
                        }}
                        Image={{
                          uri:
                            selectedItems[0] === "Views"
                              ? item?.vieweeUser?.UserMedia[0]?.url
                              : item?.resource?.type === "image"
                              ? item?.resource?.url
                              : item?.resource?.type === "video"
                              ? item?.otherUser?.UserMedia.filter(
                                  (item) => item?.sequence == 1
                                )[0].url
                              : null,
                        }}
                        Bname={
                          selectedItems[0] === "Views"
                            ? item?.vieweeUser?.firstName
                            : item?.otherUser?.firstName
                        }
                        type={item?.type}
                        age={
                          selectedItems[0] === "Views"
                            ? ", " + item?.vieweeUser?.Profile?.age
                            : ", " + item?.otherUser?.Profile?.age
                        }
                        Blocation={[
                          selectedItems[0] === "Views"
                            ? item?.vieweeUser?.city +
                              " " +
                              item?.vieweeUser?.country
                            : item?.otherUser?.city,
                          ", ",
                          item?.otherUser?.country,
                        ]}
                        usersProfileName={item?.otherUser?.firstName}
                        crossBtn
                        commentLikeButton
                        play={play}
                        showWaves={showWaves}
                        audioSource={props.audioSource}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        <GestureHandlerRootView
          style={{
            width: "100%",
            height: showModal ? windowHeight * 0.55 : 0,
            bottom: 0,
            position: showModal ? "absolute" : "relative",
            zIndex: 1,
          }}
        >
          <BottomSheetInteraction
            MyMoves
            handleOnSelect={handleOnSelect}
            interactionView
            onDismiss={() => setShowModal(false)}
            showModal={showModal}
          />
        </GestureHandlerRootView>
      </View>
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      renderLabel={({ route }) => (
        <Text
          style={{
            color: colors.blackBlue,
            margin: 8,
            fontFamily: "Inter-SemiBold",
            fontSize: 18,
          }}
        >
          {route.title}
        </Text>
      )}
      {...props}
      indicatorStyle={{
        backgroundColor: colors.primaryPink,
        height: 5,
        borderRadius: 3,
      }}
      style={{ backgroundColor: colors.greyWhite }}
    />
  );

  const renderScene = SceneMap({
    TheirMoves: TheirMoves,
    MyMoves: MyMoves,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "TheirMoves", title: "Their Moves" },
    { key: "MyMoves", title: "My Moves" },
  ]);

  return (
    <TabView
      swipeEnabled={true}
      onSwipeStart={() => {
        setPlay(true);
        setShowWaves(false);
      }}
      renderTabBar={renderTabBar}
      screenOptions={{}}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  interactionView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  topContainer: {
    flexDirection: "row",
    width: "100%",
    height: windowHeight * 0.15,
    alignItems: "center",
    backgroundColor: colors.defaultColor,
  },
  topCard: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    height: "80%",
    borderRadius: 10,
    marginHorizontal: "5%",
    paddingHorizontal: "1%",
    paddingTop: "1.5%",
    paddingBottom: "1%",
    backgroundColor: colors.white,
  },
  centerdCard: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    color: colors.primaryBlue,
  },
  spotlightTxt: {
    fontSize: 20,
    color: colors.primaryBlue,
    fontFamily: "Inter-Medium",
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: colors.black,
  },
  cardBtn: {
    paddingHorizontal: "10%",
    paddingVertical: "5%",
    marginBottom: "3%",
    borderRadius: 40,
    backgroundColor: colors.primaryPink,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBtnTitle: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: colors.white,
  },

  filterContainer: {
    backgroundColor: colors.white,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: "2%",
  },
  filterBox: {
    marginRight: "2%",
    marginBottom: "3%",
    paddingHorizontal: "2.7%",
    paddingVertical: "2%",
    backgroundColor: colors.msgGrey,
    borderRadius: 9,
  },
  selectedFilterBox: {
    backgroundColor: colors.primaryPink,
  },
  filterTxt: {
    fontFamily: "Inter-Medium",
    color: colors.textGrey1,
    fontSize: 12,
  },
  selectedFilterTxt: {
    fontFamily: "Inter-SemiBold",
    color: colors.white,
    fontSize: 12,
  },

  listView: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  interactionText: {
    fontSize: 22,
    paddingVertical: 8,
    marginTop: 10,
    fontFamily: "Inter-Bold",
    color: colors.primaryBlue,
  },

  multiSelectView: {
    paddingVertical: "2%",
    width: windowWidth * 0.96,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "5%",
    alignSelf: "center",
  },
});
export default TabViewExample;
