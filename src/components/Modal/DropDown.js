import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Image} from 'react-native';

import ToggleSwitch from 'toggle-switch-react-native';
import colors from '../../utility/colors';
import DropDownCard from '../Cards/DropDownCard';

const DropDownView = props => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  return (
    <View>
      <View style={styles.details}>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: '2%',
            },
            props.innerContainerStyle,
          ]}>
          {props.textWithIconView ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                height: '120%',
              }}>
              <Image
                style={{
                  marginRight: '3%',
                  width: '20%',
                  height: '100%',
                }}
                source={props.preferenceIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.detailsTxt}>{props.preferenceName}</Text>
            </View>
          ) : null}
          {props.textWithoutIconView ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginLeft: '2%',
              }}>
              <Text style={styles.detailsTxt}>{props.preferenceName}</Text>
            </View>
          ) : null}

          {props.deal && (
            <ToggleSwitch
              isOn={isEnabled}
              onColor={colors.primaryPink}
              offColor={colors.mediumGrey}
              labelStyle={{color: 'black', fontFamily: 'Inter-Regular'}}
              size="small"
              onToggle={toggleSwitch}
            />
          )}
        </View>
        {props.SelectDropdown ? (
          <View style={props.selectDropDownStyle}>
            <DropDownCard
              dropDownBtnStyle={props.dropDownBtnStyle}
              defaultValue={props.defaultValue}
              onValueChange={props.onValueChange}
              placeHolder={props.DropDownPlaceholder}
              data={props.data}
            />
          </View>
        ) : null}
        {props.TextInput ? (
          <View style={{marginVertical: '2%'}}>
            <TextInput
              style={{
                padding: '4%',
                backgroundColor: '#f6f7fb',
                borderRadius: 40,
                color: colors.black,
                fontFamily: 'Inter-Medium',
              }}
              placeholderTextColor={props.phColor}
              placeholder={props.placeholder}
              value={props.value}
              onChangeText={props.onChangeText}
              defaultValue={props.nameValue}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default DropDownView;

const styles = StyleSheet.create({
  details: {
    width: '100%',
    marginVertical: '2%',
  },
  detailsTxt: {
    fontSize: 16,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Medium',
    marginLeft: '1%',
  },
  dropdown2RowStyle: {},
  dropdown2RowTxtStyle: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  dropdownStyle: {
    backgroundColor: '#f6f7fb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderRadius: 12,
    width: '100%',
  },
  dropdownTxt: {
    textAlign: 'left',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  dropDownBtn: {
    width: '100%',
    alignSelf: 'center',
    marginTop: '5%',
    borderRadius: 50,
    backgroundColor: '#F6F7FB',
    paddingHorizontal: '5%',
  },
});
