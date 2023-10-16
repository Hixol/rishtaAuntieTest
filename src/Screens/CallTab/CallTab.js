import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import UserService from '../../../services/UserService';

//Redux
import {useSelector} from 'react-redux';
import appConfig from '../../../utils/appConfig';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CallItem = () => {
  const {token} = useSelector(store => store.userReducer);
  const [callLogData, setCallLogData] = useState([]);

  useEffect(() => {
    // UserService.callLog(token).then(res => {
    //   setCallLogData(res?.data?.data?.chats);
    // });
  }, []);

  return (
    <ScrollView>
      {callLogData.length > 0 &&
        callLogData?.map(res => {
          return (
            <TouchableOpacity style={styles.container}>
              <View style={[styles.profileView]}>
                <FastImage
                  style={styles.profileImage}
                  source={{
                    uri:
                      res?.avatar == null
                        ? require('../../assets/images/user.png')
                        : appConfig.avatarPath + res?.avatar,
                  }}
                />
              </View>
              <View style={styles.infoView}>
                <View style={styles.nameView}>
                  <Text style={styles.nameText}>
                    {res?.first_name + ' ' + res?.last_name}
                  </Text>
                  {JSON.parse(res.message).call_type == 1 ? (
                    <>
                      {JSON.parse(res.message).call_status == 1 ? (
                        <Text style={styles.messageText}>
                          Missed Audio call
                        </Text>
                      ) : (
                        <Text style={styles.messageText}> Audio call</Text>
                      )}
                    </>
                  ) : (
                    <>
                      {JSON.parse(res.message).call_status == 1 ? (
                        <Text style={styles.messageText}>
                          Missed video call
                        </Text>
                      ) : (
                        <Text style={styles.messageText}> Video call</Text>
                      )}
                    </>
                  )}
                </View>
                <View style={styles.timeView}>
                  <View
                    style={[
                      styles.onlineView,
                      {backgroundColor: 'transparent'},
                    ]}
                  />
                  <Text style={styles.timeText}>
                    {moment.utc(res?.time).local('tr').fromNow()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
    </ScrollView>
  );
};

export default CallItem;

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'White',
  },
  profileView: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 29,
  },
  infoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    height: 75,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  nameView: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    color: 'black',
  },
  messageText: {
    marginTop: 4,
    fontSize: 12,
    color: '#E25C5C',
  },
  timeView: {
    alignItems: 'flex-end',
    width: 80,
    marginRight: '5%',
  },
  onlineView: {
    height: 12,
    width: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeText: {
    marginTop: 4,
    fontSize: 12,
    color: 'grey',
  },
});
