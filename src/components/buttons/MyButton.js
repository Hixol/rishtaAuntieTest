import {Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '../../utility/colors';

const MyButton = ({title, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryPink,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8 * 3,
    borderRadius: 8,
    alignSelf: 'center',
  },
  title: {
    color: colors.white,
    fontWeight: '600',
  },
});
