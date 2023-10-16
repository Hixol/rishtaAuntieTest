import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {windowHeight, windowWidth} from '../utility/size';

import colors from '../utility/colors';
import PurchaseUpgradeButton from './buttons/PurchaseUpgradeButton';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

const BlogBlockCard = props => {
  let currentDate = moment(new Date());
  const calculateDateAndTime = () => {
    let diff = currentDate.diff(props.BlockTime, 'days');
    if (diff == 1) {
      return 'Yesterday';
    } else if (diff == 0) {
      return props.unmatched && props.BlockedList
        ? moment(props.BlockTime).format('h:mm A')
        : `Blocked at ${moment(props.BlockTime).format('h:mm A')}`;
    } else {
      return props.unmatched && props.BlockedList
        ? `${diff} days ago`
        : `Blocked ${diff} days ago`;
    }
  };

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.container, props.contStyle]}>
      <View style={styles.imgContainer}>
        <FastImage
          style={styles.img}
          source={{uri: props.Image}}
          resizeMode={'cover'}>
          <View style={styles.imgTextView}>
            {props.BlockProfileName ? (
              <View>
                <Text style={styles.blockText}>
                  {props.BlockProfileName}
                  {props.age && (
                    <Text style={[styles.blockText, {fontSize: 18}]}>
                      {' '}
                      {props.age}
                    </Text>
                  )}
                </Text>
              </View>
            ) : null}
            {!props.unmatched && props.BlockTime ? (
              <Text style={styles.blockTime}>{calculateDateAndTime()}</Text>
            ) : null}
            {props.unmatched && props.BlockTime ? (
              <Text style={styles.blockTime}>
                Unmatched: {calculateDateAndTime()}
              </Text>
            ) : null}

            {props.BlockedList ? (
              <PurchaseUpgradeButton
                title={props.title}
                onPressTitle={props.onPressTitle}
                buttonContStyle={styles.btn}
                contButtonTextStyle={styles.btnTxt}
              />
            ) : null}
          </View>
        </FastImage>
      </View>
      {props.BlogHeading ? (
        <Text style={styles.nameText}>{props.BlogHeading}</Text>
      ) : null}
    </TouchableOpacity>
  );
};
export default BlogBlockCard;

const styles = StyleSheet.create({
  container: {
    width: windowWidth * 0.47,
    height: windowHeight * 0.32,
    marginVertical: '1.5%',
  },
  imgContainer: {
    height: '90%',
    borderRadius: 22,
    overflow: 'hidden',
  },
  img: {height: '100%', width: '100%'},
  imgTextView: {
    justifyContent: 'flex-end',
    paddingBottom: '5%',
    paddingHorizontal: '4%',
    height: '100%',
  },
  nameText: {
    marginTop: 7,
    fontSize: 15,
    color: colors.black,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  blockText: {
    fontSize: 25,
    color: colors.white,
    fontFamily: 'Roboto-Medium',
  },
  blockTime: {
    fontSize: 15,
    color: colors.white,
    fontFamily: 'Inter-Medium',
  },
  btn: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: '16%',
    borderColor: colors.primaryPink,
    backgroundColor: colors.error100,
  },
  btnTxt: {
    fontSize: 14,
    color: colors.primaryPink,
    fontFamily: 'Inter-Medium',
  },
});
