import React from 'react';
import {Text, View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {WIDTH, CARDWIDTH} from '../constants/Constants';

const Card = ({children, style, onPress}) => (
  <TouchableWithoutFeedback onPress={onPress} disabled={onPress ? false : true}>
    <View style={[styles.container, style]}>{children}</View>
  </TouchableWithoutFeedback>
);
const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.07)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 15,
  },
});

export default Card;
