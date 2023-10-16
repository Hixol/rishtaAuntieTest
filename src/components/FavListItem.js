import React, {useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {windowWidth} from '../utility/size';

import moment from 'moment';
import colors from '../utility/colors';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import FastImage from 'react-native-fast-image';
import Slider from 'react-native-slider';
import Icons from '../utility/icons';

const FavListItem = ({item, onLongPress}) => {
  let audioRef = useRef(null);
  const navigation = useNavigation();
  const [pausePlay, setPausePlay] = useState(true);
  const [playTime, setPlayTime] = useState('00:00');
  const [currentPosSec, setCurrentPosSec] = useState(0);
  const [currentDurSec, setCurrentDurSec] = useState(0);
  let playWidth = (currentPosSec / currentDurSec) * 100;

  if (!playWidth) {
    playWidth = 0;
  }

  const mediaPreview = (type, uri) => {
    navigation.navigate('MessagePreview', {
      type,
      uri,
    });
  };

  const VideoThumbnail = ({uri, borderCornerStyle}) => (
    <View style={[styles.videoWrapper, borderCornerStyle]}>
      <Video
        resizeMode="cover"
        repeat={true}
        poster={uri}
        style={[styles.video, borderCornerStyle]}
        paused={true}
        source={{uri: convertToProxyURL(uri)}}
      />
      <TouchableOpacity
        onPress={() => mediaPreview('video', uri)}
        style={styles.playBtnContainer}>
        <Icons.Ionicons name="play" color={colors.white} size={30} />
      </TouchableOpacity>
    </View>
  );

  const onProgress = e => {
    let minutes = Math.floor(e.currentTime / 60);
    let seconds = Math.floor(e.currentTime - minutes * 60);
    let time = `0${minutes}:0${seconds}`;
    setCurrentDurSec(e.seekableDuration);
    setCurrentPosSec(e.currentTime);
    setPlayTime(time);
  };

  const onEnd = () => {
    audioRef.current?.seek(0);
    setCurrentDurSec(0);
    setCurrentPosSec(0);
    setPausePlay(true);
  };

  const onSlidingComplete = e => {
    let time = (e / 100) * currentDurSec;
    audioRef.current?.seek(time);
  };

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={{padding: '2%'}}>
      <View style={styles.row}>
        <Avatar
          size={26}
          rounded
          source={{uri: item.Chat.Sender.UserMedia[0].url}}
        />
        <Text style={styles.nameTxt}>{item.Chat.Sender.firstName}</Text>
        <Text style={styles.dateTxt}>
          {moment(item.Chat.createdAt).format('DD/MM/YY')}
        </Text>
      </View>

      {item.Chat.type == 'PICTURE' ? (
        <Pressable
          onPress={() => mediaPreview('image', item.Chat.message)}
          style={[styles.msgContainer, styles.shadow, styles.mediaWrapper]}>
          <FastImage
            style={[styles.image, {borderTopLeftRadius: 0}]}
            source={{
              uri: item.Chat.message,
            }}
          />
        </Pressable>
      ) : item.Chat.type == 'VIDEO' ? (
        <View style={[styles.msgContainer, styles.shadow, styles.mediaWrapper]}>
          <VideoThumbnail
            uri={item.Chat.message}
            borderCornerStyle={{borderTopLeftRadius: 0}}
          />
        </View>
      ) : item.Chat.type == 'VOICE_NOTE' ? (
        <View style={[styles.msgContainer, styles.shadow]}>
          <Video
            source={{uri: item.Chat.message}}
            style={styles.audioContainer}
            audioOnly={true}
            resizeMode={'contain'}
            controls={false}
            paused={pausePlay}
            repeat={false}
            ignoreSilentSwitch={'ignore'}
            playInBackground={false}
            onProgress={e => onProgress(e)}
            onEnd={e => onEnd(e)}
          />
          <View style={styles.audioBtnSeek}>
            <Pressable
              onPress={() => setPausePlay(!pausePlay)}
              style={{alignItems: 'center'}}>
              <Icons.Ionicons
                name={pausePlay ? 'play' : 'pause'}
                color={colors.primaryPink}
                size={30}
              />
              <Text style={styles.smallFont}>{playTime}</Text>
            </Pressable>
            <View style={{width: '80%'}}>
              <Slider
                value={playWidth}
                minimumValue={0}
                maximumValue={100}
                style={{height: '100%'}}
                trackStyle={{backgroundColor: colors.black}}
                thumbStyle={styles.thumbStyle}
                onSlidingComplete={e => onSlidingComplete(e)}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.msgContainer, styles.shadow]}>
          <Text style={styles.msgText}>{item.Chat.message}</Text>
        </View>
      )}
      <View style={[styles.row, {marginLeft: 33}]}>
        <Icons.Ionicons name="star" size={12} color={colors.mediumGrey} />
        <Text style={styles.time}>
          {moment(item.Chat.createdAt).format('H:mm A')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FavListItem;

const styles = StyleSheet.create({
  msgContainer: {
    maxWidth: '78%',
    backgroundColor: colors.white,
    paddingVertical: '2%',
    paddingHorizontal: '4%',
    marginVertical: '1%',
    marginHorizontal: '2%',
    elevation: 5,
    alignSelf: 'flex-start',
    borderRadius: 24,
    borderTopLeftRadius: 0,
    marginLeft: 28,
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  msgText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameTxt: {
    fontFamily: 'Roboto-Regular',
    color: colors.black,
    fontSize: 13,
    marginHorizontal: 6,
    flex: 1,
  },
  dateTxt: {
    fontFamily: 'Roboto-Regular',
    color: colors.black,
    fontSize: 13,
  },
  time: {
    color: colors.vibeMidGrey,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },
  mediaWrapper: {
    maxWidth: '68%',
    paddingHorizontal: '1.5%',
    paddingVertical: '1.5%',
    marginVertical: '1%',
    marginHorizontal: 0,
  },
  image: {
    width: windowWidth * 0.55,
    height: 280,
    borderRadius: 18,
  },
  videoWrapper: {
    borderRadius: 18,
    width: windowWidth * 0.55,
    height: 280,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  playBtnContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 240 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioContainer: {
    width: windowWidth * 0.58,
  },
  audioBtnSeek: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 42,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  thumbStyle: {
    width: 12,
    height: 12,
    backgroundColor: colors.primaryPink,
  },
  smallFont: {
    color: colors.black,
    fontSize: 12,
  },
});
