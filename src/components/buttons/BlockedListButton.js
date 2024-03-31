import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../utility/colors';

const BlockedListButton = props => {
  return (
    <View>
      {props.BlockedListButton ? (
        <TouchableOpacity
          onPress={props.onPress}
          style={[styles.blockedListButton, props.blockedListStyles]}>
          <Text style={styles.bloackedListButtonText}>{props.title}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  blockedListButton: {
    alignSelf: 'center',

    paddingVertical: '3%',
    paddingHorizontal: '6%',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  bloackedListButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',

    color: colors.primaryPink,
  },
});

export default BlockedListButton;
