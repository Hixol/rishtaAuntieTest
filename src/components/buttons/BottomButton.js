import React, {useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import colors from '../../utility/colors';
import {android} from '../../utility/size';

const BottomButton = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.buttonView, props.bottomStyles]}>
      {props.loading ? (
        <ActivityIndicator size={'small'} color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>
          {props.text === '' || props?.text === undefined
            ? 'Continue'
            : props.text}
        </Text>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonView: {
    width: '90%',
    paddingVertical: '5%',
    borderRadius: 10,
    backgroundColor: colors.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 15,
  },
  buttonText: {fontSize: 15, color: colors.white, fontFamily: 'Inter-Medium'},
});
export default BottomButton;
