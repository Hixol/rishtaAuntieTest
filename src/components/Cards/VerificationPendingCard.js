import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '../../utility/colors';

const VerificationPendingCard = ({heading, tagline, btnText = '', onPress}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.tagline}>{tagline}</Text>
      {btnText.length > 0 && (
        <TouchableOpacity onPress={onPress} style={styles.btnContainer}>
          <Text style={styles.btnText}>{btnText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VerificationPendingCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8%',
  },
  heading: {
    fontSize: 27,
    fontFamily: 'Inter-Bold',
    color: colors.primaryBlue,
    textAlign: 'center',
  },
  tagline: {
    width: '80%',
    marginVertical: '3%',
    alignSelf: 'center',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    color: colors.primaryBlue,
  },
  btnContainer: {
    marginTop: '7%',
    paddingHorizontal: '7%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  btnText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.primaryBlue,
  },
});
