import {View, Text} from 'react-native';
import React from 'react';
import colors from '../../utility/colors';
const PreferenceTextName = props => {
  return (
    <View style={{marginVertical: '2%'}}>
      <Text
        style={{
          fontSize: 16,
          color: colors.primaryBlue,
          fontFamily: 'Inter-Medium',

          alignSelf: 'flex-start',
        }}>
        {props.PreferenceTextName}
      </Text>
    </View>
  );
};

export default PreferenceTextName;
