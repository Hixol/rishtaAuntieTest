import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {windowHeight} from '../utility/size';

import colors from '../utility/colors';
import FastImage from 'react-native-fast-image';
import PurchaseUpgradeButton from './buttons/PurchaseUpgradeButton';

const PurchaseUpgrade = props => {
  const navigation = useNavigation();

  return (
    <View style={props.PurchaseUpgrade}>
      <View style={styles.topContainerView}>
        <Text style={styles.TopText}>{props.TopLeftTitle}</Text>
        <Text style={styles.timeLeft}>{props.timeLeft}</Text>
      </View>

      <View style={styles.bottomContainerView}>
        <TouchableOpacity onPress={props.IcononPress} style={styles.iconView}>
          <FastImage
            style={{width: '100%', height: '90%'}}
            resizeMode="contain"
            source={props.Image}
          />
        </TouchableOpacity>

        <View style={styles.bottomRightContainer}>
          <Text style={styles.bottomTopText}>{props.BottomTopText}</Text>
          <Text style={styles.bottomBottomText}>{props.bottomBottomText}</Text>
        </View>
      </View>

      <PurchaseUpgradeButton
        onPressTitle={() => navigation.navigate('Paywall')}
        contButtonTextStyle={{fontSize: 15}}
        buttonContStyle={{paddingHorizontal: '10%'}}
        title={props.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topContainerView: {
    width: '90%',
    flexDirection: 'row',
    marginHorizontal: '5%',
    alignItems: 'center',
  },

  TopText: {
    fontSize: 12,
    color: colors.darkBlue,
    fontFamily: 'Inter-Regular',
    width: '57%',
  },

  bottomContainerView: {
    flexDirection: 'row',
    marginHorizontal: '5%',
  },

  timeLeft: {
    fontSize: 10,
    color: colors.primaryPink,
  },

  iconView: {
    width: windowHeight * 0.065,
    height: windowHeight * 0.065,
    padding: '5%',
    backgroundColor: colors.white,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60 / 2,
    marginRight: '5%',
    shadowOffset: {
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: 'black',
  },

  bottomRightContainer: {
    alignItems: 'center',
    width: '65%',
  },

  bottomTopText: {
    fontSize: 18,
    color: colors.darkBlue,
    fontFamily: 'Inter-Bold',
  },

  bottomBottomText: {
    fontSize: 10,
    color: colors.darkBlue,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
export default PurchaseUpgrade;
