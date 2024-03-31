import React, {useState} from 'react';

import {Text, View, TouchableOpacity} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import colors from '../../utility/colors';
import styles from '../../Screens/MyPrivacySetting/styles';
import FastImage from 'react-native-fast-image';

const BasicPrivacySetting = props => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    props.onToggleSwitch(props.toggleOptionText, !isEnabled);
  };

  return (
    <View>
      {props.privacySettingType ? (
        <Text style={[styles.privacySettingType, props.contStyle]}>
          {props.privacySettingType}
        </Text>
      ) : null}
      {props.arrowIcon ? (
        <TouchableOpacity
          onPress={props.arrowIcononPress}
          style={[styles.toggleOptionView, props.toggleViewStyle]}>
          <Text style={styles.toggleOptionText}>{props.toggleOptionText}</Text>
          <View style={styles.arrowIconView}>
            <FastImage
              resizeMode="contain"
              style={styles.arrowIconImage}
              source={require('../../assets/iconimages/settingarrow.png')}
            />
          </View>
        </TouchableOpacity>
      ) : props.toggleSwitch ? (
        <View style={[styles.toggleOptionView, props.toggleViewStyle]}>
          <Text style={styles.toggleOptionText}>{props.toggleOptionText}</Text>

          <ToggleSwitch
            isOn={props.isOn}
            onColor={colors.primaryPink}
            offColor={colors.mediumGrey}
            labelStyle={{color: 'black', fontFamily: 'Inter-Bold'}}
            size="small"
            onToggle={toggleSwitch}
          />
        </View>
      ) : null}

      {props.toggleOptionTaglineText ? (
        <View style={styles.toggleOptionTaglineView}>
          <Text style={styles.toggleOptionTaglineText}>
            {props.toggleOptionTaglineText}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
export default BasicPrivacySetting;
