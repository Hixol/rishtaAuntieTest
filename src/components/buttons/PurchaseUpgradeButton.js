import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {windowHeight} from '../../utility/size';
import colors from '../../utility/colors';

const PurchaseUpgradeButton = props => {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPressTitle}
        style={[styles.buttonContainer, props.buttonContStyle]}>
        <Text style={[styles.btnTitle, props.contButtonTextStyle]}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    height: windowHeight * 0.045,
    paddingHorizontal: '12%',
    borderRadius: 20,
    elevation: 5,
    marginTop: '5%',
    // paddingVertical: '3%',
    backgroundColor: colors.primaryPink,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
});

export default PurchaseUpgradeButton;
