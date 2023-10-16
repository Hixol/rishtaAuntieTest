import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CARDWIDTH} from '../constants/Constants';
import colors from '../utility/colors';

const DiscoverItem = ({title, value, Component, state, city}) => (
  <View style={styles.ChildView}>
    <Text style={styles.firsttext}>{title}</Text>
    {value ? <Text style={styles.secondtext}>{value}</Text> : Component}
  </View>
);
const styles = StyleSheet.create({
  ChildView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: CARDWIDTH - 40,
    marginVertical: '5%',
  },

  firsttext: {
    // width: (CARDWIDTH - 10) / 2,
    minWidth: '40%',
    maxWidth: '60%',
    color: '#898989',
    fontSize: 16,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  secondtext: {
    minWidth: '30%',
    maxWidth: '50%',
    color: colors.blackBlue,
    fontSize: 16,
    textAlign: 'right',
    fontFamily: 'Inter-Medium',
    flexWrap: 'wrap',
  },
});

export default DiscoverItem;
