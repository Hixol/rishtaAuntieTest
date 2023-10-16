import React, {useLayoutEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {useHelper} from '../../hooks/useHelper';

import styles from './styles';
import FastImage from 'react-native-fast-image';
import ChatServices from '../../services/ChatServices';
import moment from 'moment';
import Icons from '../../utility/icons';

const calculateCallTime = seconds => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let resultedTime = '';

  if (hrs > 0) {
    resultedTime += `${hrs}h ${mins < 10 ? '0' : ''}`;
  }
  if (mins > 0) {
    resultedTime += `${mins}m ${secs < 10 ? '0' : ''}`;
  }
  resultedTime += `${secs}s`;

  return resultedTime;
};

const CallLogList = ({item}) => {
  return (
    <View style={styles.list_container}>
      <View style={[styles.row, {flex: 1}]}>
        <View style={styles.avatar_container}>
          <FastImage
            source={require('../../assets/images/user.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text
            style={[
              styles.nameTxt,
              item.logType === 'MISSED_CALL' && {color: '#F33800'},
            ]}>
            {item.callerUser.firstName} {item.callerUser.lastName}
          </Text>

          <View style={styles.row}>
            <Icons.Feather
              name={
                item.logType === 'MISSED_CALL'
                  ? 'phone-missed'
                  : 'phone-incoming'
              }
              color="grey"
              size={14}
            />

            <Text style={[styles.greyedTxt, {marginLeft: 8}]}>
              {item.logType === 'MISSED_CALL'
                ? 'Missed'
                : `Incoming ${calculateCallTime(item.duration)}`}
              , {moment(item.createdAt).format('h:mm A')}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.greyedTxt}>
        {moment(item.createdAt).format('DD/MM/YYYY')}
      </Text>
    </View>
  );
};

const NoLogs = () => (
  <View style={styles.nolog_container}>
    <View style={styles.nolog_bg}>
      <Text style={styles.nologTxt}>No recent calls</Text>
    </View>
  </View>
);

let limit = 50;
let offset = 0; // offset starts like an array index and 0 will points to first page.

const CallLog = () => {
  const {handleStatusCode} = useHelper();
  const {token, userData} = useSelector(store => store.userReducer);
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState({});

  const getCallLog = (limit, offset) => {
    setLoading(true);
    ChatServices.getCallLog(`limit=${limit}&offset=${offset * limit}`, token)
      .then(res => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let data = res.data.data;
          if (limit <= 50 && offset == 0) {
            setCallLogs(data);
          } else if (offset > 0) {
            setCallLogs(prevState => ({
              ...prevState,
              rows: [...prevState.rows, ...data?.rows],
            }));
          }
        }
      })
      .catch(err => console.log('getCallLog err:', err))
      .finally(() => setLoading(false));
  };

  useLayoutEffect(() => {
    getCallLog(limit, offset);

    return () => {
      limit = 50;
      offset = 0;
    };
  }, []);

  const loadMoreData = () => {
    offset += 1;
    getCallLog(limit, offset);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Calls</Text>
      <Text style={styles.sub_heading}>Recent</Text>
      {callLogs?.rows?.length > 0 ? (
        <FlatList
          data={callLogs.rows}
          keyExtractor={item => item.id.toString()}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.6}
          renderItem={({item}) =>
            item.callerId != userData?.id && <CallLogList item={item} />
          }
        />
      ) : (
        <NoLogs />
      )}
    </SafeAreaView>
  );
};

export default CallLog;
