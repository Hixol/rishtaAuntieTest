import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CARDWIDTH} from '../constants/Constants';
import Colors from '../constants/Colors';

const DiscoverLocation = ({title, value, Component, state, city}) => (
  <View style={styles.ChildView}>
    <Text style={styles.firsttext}> {title} </Text>
    {value ? (
      <Text style={styles.secondtext}>
        {/* {city}, {state} */}
        {value}
      </Text>
    ) : (
      Component
    )}
  </View>
);
const styles = StyleSheet.create({
  ChildView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical:'5%',
    width: CARDWIDTH - 40,
  },

  firsttext: {
    width: (CARDWIDTH - 50) / 2,
    color: '#898989',
    fontSize: 16,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  secondtext: {
    width: (CARDWIDTH - 50) / 2,
    color: Colors.primaryColor,
    fontSize: 16,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
});

export default DiscoverLocation;
