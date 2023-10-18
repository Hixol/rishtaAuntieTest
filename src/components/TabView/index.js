import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  useWindowDimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {TabBar, TabView, SceneMap} from 'react-native-tab-view';
import {UserService} from '../../services';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {windowHeight} from '../../utility/size';
import {useHelper} from '../../hooks/useHelper';

import BlogBlockCard from '../BlogBlockCard';
import colors from '../../utility/colors';
import Loader from '../Loader';

const BlockedList = props => {
  const {handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  const [loading, setLoading] = useState(false);
  const [blockedUsersList, setBlockedUsersList] = useState([]);

  const getBlockedUserList = () => {
    setLoading(true);
    UserService.blockList(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setBlockedUsersList(res.data.data);
        }
      })
      .catch(err => console.log('blockList err:', err))
      .finally(() => setLoading(false));
  };

  const unblockUser = id => {
    UserService.unblockUser(id, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          setBlockedUsersList(prevState =>
            prevState.filter(el => el.blockedUser.id != id),
          );
        }
      })
      .catch(err => console.log('unblockUser err:', err));
  };

  useEffect(() => {
    getBlockedUserList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      {/* <Text style={styles.title}>My Blocked List</Text> */}
      <ScrollView>
        <View style={styles.cardWrapper}>
          {blockedUsersList.length > 0 &&
            blockedUsersList.map(el => (
              <View style={styles.cardMargin} key={el.blockedUser.id}>
                <BlogBlockCard
                  BlockProfileName={el.blockedUser.firstName}
                  BlockTime={el.createdAt}
                  BlockedList
                  Image={el.blockedUser.UserMedia[0].url}
                  title="Unblock"
                  onPressTitle={() => unblockUser(el.blockedUser.id)}
                />
              </View>
            ))}
        </View>
      </ScrollView>
      <Text style={styles.helpText}>Need Help?</Text>
    </View>
  );
};

const UnmatchedList = () => {
  const navigation = useNavigation();
  const {handleStatusCode} = useHelper();
  const {token} = useSelector(store => store.userReducer);

  const [loading, setLoading] = useState(false);
  const [interactionsList, setInteractionsList] = useState([]);

  const getAllTheirMoves = () => {
    setLoading(true);
    UserService.getAllTheirMoves(token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let arr = [];
          let dataObj = {};

          res?.data?.data.data.map(el => {
            if (el.type == 'MATCH_REQUEST' && el.status == 2) {
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

          setInteractionsList(arr);
        }
      })
      .catch(err => {
        console.log('getAllTheirMoves err:', err);
      })
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllTheirMoves();
    }, []),
  );

  return loading ? (
    <Loader />
  ) : (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Unmatched</Text> */}
      <ScrollView>
        <View style={styles.cardWrapper}>
          {interactionsList.length > 0 ? (
            interactionsList.map(el => (
              <View key={el.id} style={styles.cardMargin}>
                <BlogBlockCard
                  BlockProfileName={el.user.firstName}
                  BlockTime={el.createdAt}
                  unmatched
                  BlockedList
                  age={el.user.Profile.age}
                  Image={el.user.UserMedia[0].url}
                  title="Visit Profile"
                  onPressTitle={() =>
                    navigation.navigate('userDetailScreen', {
                      userId: el.user.id,
                      unmatch: true,
                    })
                  }
                />
              </View>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                marginTop: windowHeight / 2.8,
                alignItems: 'center',
              }}>
              <Text style={{color: colors.black}}>
                You have no unmatched profile.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Text style={styles.helpText}>Need Help?</Text>
    </View>
  );
};

const renderTabBar = props => (
  <TabBar
    renderLabel={({route, focused, color}) => (
      <Text
        style={{
          color: colors.blackBlue,
          margin: 8,
          fontFamily: 'Inter-Bold',
          fontSize: 16,
        }}>
        {route.title}
      </Text>
    )}
    {...props}
    indicatorStyle={{
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.primaryPink,
    }}
    style={{backgroundColor: colors.greyWhite}}
  />
);

const renderScene = SceneMap({
  Blocked: BlockedList,
  Unmatched: UnmatchedList,
});

export default function BlockedTabView() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'Blocked', title: 'Blocked'},
    {key: 'Unmatched', title: 'Unmatched'},
  ]);

  return (
    <TabView
      renderTabBar={renderTabBar}
      screenOptions={{}}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, marginVertical: '2%'},
  title: {
    fontSize: 20,
    color: colors.primaryBlue,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  cardWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  cardMargin: {
    marginVertical: '2%',
    marginHorizontal: '1%',
  },
  helpText: {
    textAlign: 'center',
    color: colors.primaryPink,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
});
