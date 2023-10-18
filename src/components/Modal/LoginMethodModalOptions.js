import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import colors from '../../utility/colors';
import Icons from '../../utility/icons';
import ToggleSwitch from 'toggle-switch-react-native';

const LoginMethodModalOptions = props => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  return (
    <View
      style={{
        marginVertical: '4%',
      }}>
      <View style={styles.modalOptionView}>
        <TouchableOpacity
          onPress={props.ONPRESSTOGGLE}
          style={{flexDirection: 'row'}}>
          <Icons.FontAwesome
            name={props.iconName}
            size={22}
            color={colors.primaryPink}
            style={styles.iconStyle}
          />

          <Text style={styles.optionName}>{props.loginOptionName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: '-4%'}}>
          {props.ToggleSwitchButton ? (
            <ToggleSwitch
              isOn={isEnabled}
              onColor={colors.primaryPink}
              offColor={colors.mediumGrey}
              labelStyle={{color: 'black', fontFamily: 'Inter-Bold'}}
              size="small"
              onToggle={toggleSwitch}
            />
          ) : null}
          {props.editIconButton ? (
            <Icons.Feather
              name={'edit'}
              size={22}
              color={colors.primaryPink}
              style={styles.editIcon}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginMethodModalOptions;

const styles = StyleSheet.create({
  modalOptionView: {
    marginHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconStyle: {
    marginRight: '4%',
    width: '8%',
  },
  optionName: {
    color: colors.primaryBlue,
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    width: '80%',
  },
  editIcon: {
    width: '100%',
    marginLeft: '2%',
  },
});
