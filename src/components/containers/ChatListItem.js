import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {checkExtension} from '../../utility/regex';

import colors from '../../utility/colors';
import Icons from '../../utility/icons';
import FastImage from 'react-native-fast-image';
import moment from 'moment/moment';

const ChatListItem = ({item, status, unread, onPress}) => {
  let currentDate = moment(new Date());
  let msgDate = moment(item.lastMessageTime);

  const calculateDateAndTime = () => {
    let diff = currentDate.diff(msgDate, 'days');
    if (diff == 1) {
      return 'Yesterday';
    } else if (diff == 0) {
      return msgDate.format('h:mm A');
    } else if (isNaN(diff)) {
      return '';
    } else {
      return msgDate.format('DD-MM-YY');
    }
  };

  const TextWithIcon = ({icon, text}) => (
    <View style={styles.row}>
      <Icons.MaterialIcons
        name={icon}
        size={20}
        color={colors.vibeMidGrey}
        style={{marginRight: 2}}
      />
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageTextView}>
        <View>
          <FastImage
            style={styles.image}
            source={
              item.type === 'GROUP'
                ? require('../../assets/iconimages/group.png')
                : {uri: item.ChatMembers[0]?.User?.UserMedia[0]?.url}
            }
          />
          {status.length > 0 &&
            status.map(el =>
              el.isOnline == true &&
              el.recipientId == item.ChatMembers[0].memberId ? (
                <View key={el.recipientId} style={[styles.status]} />
              ) : null,
            )}
        </View>
        <View style={styles.userDateText}>
          <View style={styles.userDateView}>
            <Text style={styles.userNameText}>
              {item.type === 'GROUP'
                ? `Customer Support`
                : `${item.ChatMembers[0]?.User?.firstName}`}
            </Text>
            <Text style={styles.date}>{calculateDateAndTime()}</Text>
          </View>
          <View style={[styles.userDateView, styles.messageView]}>
            {checkExtension(item.lastMessage) === 'Photo' ? (
              <TextWithIcon icon="photo" text="Photo" />
            ) : checkExtension(item.lastMessage) === 'Video' ? (
              <TextWithIcon icon="videocam" text="Video" />
            ) : checkExtension(item.lastMessage) === 'Audio' ? (
              <TextWithIcon icon="mic" text="Audio" />
            ) : (
              <Text
                style={styles.messageText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {unread != null &&
                unread.senderId == item.ChatMembers[0].memberId
                  ? unread.message
                  : item.lastMessage}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: '2%',
    paddingHorizontal: '2%',
    marginTop: '0.3%',
  },

  imageTextView: {flexDirection: 'row', width: '85%'},
  image: {width: 70, height: 70, borderRadius: 200 / 2},
  userDateText: {width: '90%', paddingVertical: '2%', marginHorizontal: '2%'},

  userDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userNameText: {
    color: colors.darkBlue,
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },

  messageView: {
    marginHorizontal: '2%',
    marginVertical: '1%',
  },

  date: {color: colors.chatGrey, fontSize: 12},
  messageText: {color: colors.black, fontSize: 16},

  status: {
    backgroundColor: colors.blazingGreen,
    width: 12,
    height: 12,
    borderRadius: 12 / 2,
    position: 'absolute',
    right: 3,
    top: 8,
    borderWidth: 2,
    borderColor: colors.white,
  },

  dot: {
    backgroundColor: colors.primaryPink,
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default ChatListItem;
