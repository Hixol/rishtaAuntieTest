import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../utility/colors';

const SettingButton = props => {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPress}
        style={[styles.settingButton, props.sbStyles]}>
        <Text style={[styles.btnTitle, props.titleStyles]}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  settingButton: {
    width: '100%',
    backgroundColor: colors.primaryPink,
    borderRadius: 10,
    paddingVertical: '4%',
    marginTop: '3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },
});

export default SettingButton;
