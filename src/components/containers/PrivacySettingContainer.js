import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import colors from '../../utility/colors';
import styles from '../../Screens/MyPrivacySetting/styles';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

const PrivacySettingContainer = props => {
  const {userData} = useSelector(store => store.userReducer);

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    props.onToggleSwitch(props.toggleOptionText, !isEnabled);
  };

  const proMem = userData?.UserSetting?.isSubscribed;

  return (
    <View>
      {props.privacySettingType ? (
        <Text style={[styles.privacySettingType, props.contStyle]}>
          {props.privacySettingType}
        </Text>
      ) : null}
      {props.arrowIcon ? (
        <TouchableOpacity
          disabled={props.disabled}
          onPress={props.arrowIcononPress}
          style={[styles.toggleOptionView, props.toggleViewStyle]}>
          <Text style={[styles.toggleOptionText, props.toggleOptionTextStyle]}>
            {props.toggleOptionText}
          </Text>
          {props.arrowIcon ? (
            <View style={styles.arrowIconView}>
              <FastImage
                tintColor={proMem ? null : colors.softGrey}
                resizeMode="contain"
                style={styles.arrowIconImage}
                source={props.imageRequire}
              />
            </View>
          ) : null}
        </TouchableOpacity>
      ) : (
        <View style={[styles.toggleOptionView, props.toggleViewStyle]}>
          <Text style={[styles.toggleOptionText, props.toggleOptionTextStyle]}>
            {props.toggleOptionText}
          </Text>
          {props.toggleSwitch ? (
            <ToggleSwitch
              disabled={props.disabled}
              isOn={props.isOn}
              onColor={colors.primaryPink}
              offColor={colors.mediumGrey}
              labelStyle={{color: 'black', fontFamily: 'Inter-Bold'}}
              size="small"
              onToggle={toggleSwitch}
            />
          ) : null}
        </View>
      )}
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
export default PrivacySettingContainer;
