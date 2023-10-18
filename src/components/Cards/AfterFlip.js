import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';

import styles from './styles';
import FastImage from 'react-native-fast-image';
import colors from '../../utility/colors';
import WaveForm from 'react-native-audiowaveform';
import CircularIcon from '../circularIcons';

const AfterFlip = props => {
  let date_1 = new Date(props.createdAt);
  let date_2 = new Date();
  let difference = date_2.getTime() - date_1.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

  const [loading, setLoading] = useState(false);
  const [showWaves, setShowWaves] = useState(props.showWaves);

  useEffect(() => {}, [showWaves]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.shadowContainer1} onPress={props.afterFlipPress}>
      <View style={styles.commentContainer}>
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.daysAgoTxt}>
            {TotalDays <= 1 ? TotalDays + ' Day Ago' : TotalDays + ' Days Ago'}
          </Text>
        </View>

        <View style={styles.topUserView}>
          <View style={styles.topRowView}>
            <Text numberOfLines={2} style={styles.nameTxt}>
              {props.Bname}
            </Text>
            <Text style={styles.ageTxt}> {props.age}</Text>
          </View>
        </View>

        <View style={{marginVertical: '5%'}}>
          {props.type === 'COMMENT' ? (
            <View>
              <Text numberOfLines={3} style={styles.likeCommentText}>
                {props.userMediaType === 'video'
                  ? `You commented: "${props.interactionComment}" on discover video`
                  : props.userMediaType === 'image' &&
                    props.resourceType === 'USER_MEDIA'
                  ? `You commented: "${props.interactionComment}" on picture`
                  : `You commented: "${props.interactionComment}" on profile prompt`}
              </Text>
            </View>
          ) : props.type === 'LIKE' ? (
            <Text numberOfLines={2} style={styles.likeCommentText}>
              {props.resourceType === 'USER_MEDIA' &&
              props.userMediaType === 'image'
                ? `You liked picture`
                : props.resourceType === 'USER_MEDIA' &&
                  props.userMediaType === 'video'
                ? `You liked discover video`
                : `You liked his/her profile prompt`}
            </Text>
          ) : props.type === 'VOICE_NOTE' ? (
            <View>
              <Text numberOfLines={2} style={styles.likeCommentText}>
                You left a voice note on{' '}
                {props.resourceType === 'USER_MEDIA' &&
                props.userMediaType === 'image'
                  ? 'picture'
                  : props.resourceType === 'USER_MEDIA' &&
                    props.userMediaType === 'video'
                  ? 'discover video'
                  : 'profile prompt'}
              </Text>

              <View style={styles.waveContainer}>
                <TouchableOpacity
                  disabled={loading ? true : false}
                  onPress={() => setShowWaves(!showWaves)}
                  style={styles.playBtnContainer}>
                  {loading ? (
                    <ActivityIndicator size={'small'} color={colors.white} />
                  ) : (
                    <FastImage
                      resizeMode="contain"
                      style={styles.playBtn}
                      source={
                        showWaves
                          ? require('../../assets/iconimages/pause.png')
                          : require('../../assets/iconimages/playIcon.png')
                      }
                    />
                  )}
                </TouchableOpacity>
                <WaveForm
                  style={styles.wave}
                  onFinishPlay={() => setShowWaves(false)}
                  source={{uri: props.voiceNoteUrl}}
                  waveFormStyle={{
                    waveColor: colors.primaryPink,
                    scrubColor: colors.primaryBlue,
                  }}
                  play={props.play === true && showWaves === true}
                />
              </View>
            </View>
          ) : (
            <View>
              <Text numberOfLines={2} style={styles.likeCommentText}>
                You Viewed {props.Bname}
              </Text>
            </View>
          )}
        </View>

        <View style={{alignSelf: 'center'}}>
          {props.resourceType === 'USER_MEDIA' ? (
            <FastImage style={styles.profilePic} source={props.Image} />
          ) : props.resourceType === 'PROFILE_PROMPT' ? null : (
            <FastImage style={styles.profilePic} source={props.Image} />
          )}
        </View>
        {props.resourceType === 'PROFILE_PROMPT' ? (
          <View style={styles.divider} />
        ) : null}
        {props.resourceType === 'PROFILE_PROMPT' ? (
          <View style={styles.promptContainer}>
            <Text numberOfLines={2} style={styles.questTxt}>
              {props.question}
            </Text>
            <Text numberOfLines={2} style={styles.ansTxt}>
              {props.answer}
            </Text>
          </View>
        ) : null}

        {props.theirMoves === 'theirMoves' ? (
          <View style={styles.btnView1}>
            {props.type === 'Rejected' ? (
              <CircularIcon
                iconCrossImage
                color={colors.primaryPink}
                size={26}
                circularIconStyle={[
                  styles.iconStyle,
                  {backgroundColor: colors.white},
                ]}
              />
            ) : props.type === 'Accepted' ? (
              <View style={styles.btnView1}>
                <CircularIcon
                  iconCrossImage
                  color={colors.primaryPink}
                  size={26}
                  circularIconStyle={[
                    styles.iconStyle,
                    {backgroundColor: colors.white},
                  ]}
                />
                <CircularIcon
                  iconChatImage
                  color={colors.white}
                  size={26}
                  circularIconStyle={styles.iconStyle}
                />
              </View>
            ) : props.crossBtn ? (
              <CircularIcon
                iconCrossImage
                color={colors.primaryPink}
                size={26}
                circularIconStyle={[
                  styles.iconStyle,
                  {
                    backgroundColor: colors.white,
                    elevation: 2,
                  },
                ]}
              />
            ) : null}
            {props.commentLikeButton ? (
              <CircularIcon
                iconChatImage
                color={colors.white}
                size={26}
                circularIconStyle={styles.iconStyle}
              />
            ) : null}
            {props.commentButton ? (
              <CircularIcon
                iconChatImage
                color={colors.greyWhite}
                size={26}
                circularIconStyle={styles.iconStyle}
              />
            ) : null}
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={props.onPress1}
        style={styles.diagonalXContainer}>
        <View style={styles.diagonalXInnerContainer}>
          <FastImage
            resizeMode="contain"
            style={styles.xImg}
            source={require('../../assets/iconimages/x.png')}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AfterFlip;