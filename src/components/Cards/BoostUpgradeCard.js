import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import SettingButton from '../buttons/SettingButton';
import {android, windowHeight} from '../../utility/size';

const BoostUpgradeCard = props => {
  const {proMember, type} = props;
  return (
    <View style={[styles.actionItemsView]}>
      <View style={styles.timeView}>
        <Text style={styles.timeText}>Time left: 12:12</Text>
      </View>
      <View style={styles.typeMainView}>
        <FastImage
          resizeMode="contain"
          style={{width: 30, height: 30}}
          source={props.imageSource}
        />
        {type === 'Profiles left' && proMember ? null : (
          <View style={{marginLeft: 20}}>
            <Text style={styles.typeText}>{props.type}</Text>
            <Text style={styles.remainingText}>{props.typeCount}</Text>
          </View>
        )}
      </View>
      {type === 'Profiles left' && proMember ? null : (
        <>
          <View style={{marginTop: 14}}>
            <SettingButton onPress={props.onPress} title={props.buttonTitle} />
          </View>
          <Text style={styles.bottomText}>{props.bottomText}</Text>
        </>
      )}
    </View>
  );
};
export default BoostUpgradeCard;

const styles = StyleSheet.create({
  actionItemsView: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    paddingVertical: '5%',
    borderRadius: 10,
    paddingHorizontal: '5%',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    height: android ? windowHeight * 0.33 : windowHeight * 0.27,
  },
  timeView: {
    width: '80%',
    paddingHorizontal: '2%',
    height: 25,
    backgroundColor: colors.primaryPinkOpacity,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: colors.primaryPink,
  },
  typeMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    width: '100%',
  },
  typeText: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  remainingText: {
    color: '#121826',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginTop: 5,
  },
  bottomText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 14,
  },
});
