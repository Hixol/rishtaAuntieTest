import React from 'react';
import {StyleSheet} from 'react-native';

import SelectDropdown from 'react-native-select-dropdown';
import colors from '../../utility/colors';
import Icons from '../../utility/icons';

const DropDownCard = props => {
  return (
    <SelectDropdown
      defaultValue={props.defaultValue}
      defaultButtonText={props.placeHolder}
      rowTextStyle={styles.dropdown2RowTxtStyle}
      dropdownStyle={{
        backgroundColor: '#f6f7fb',
        borderRadius: 12,
      }}
      rowStyle={{height: 33}}
      buttonTextStyle={styles.dropdownTxt}
      renderDropdownIcon={isOpened => {
        return (
          <Icons.FontAwesome
            name={isOpened ? 'caret-up' : 'caret-down'}
            color={colors.primaryPink}
            size={20}
          />
        );
      }}
      dropdownIconPosition={'right'}
      buttonStyle={
        props.dropDownBtnStyle ? props.dropDownBtnStyle : styles.dropDownBtn
      }
      data={props.data}
      onSelect={(selectedItem, index) => {
        props.onValueChange(selectedItem);
      }}
      buttonTextAfterSelection={(selectedItem, index) => {
        return selectedItem;
      }}
      rowTextForSelection={(item, index) => {
        return item;
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropDownBtn: {
    width: '100%',
    alignSelf: 'center',
    marginTop: '5%',
    borderRadius: 50,
    backgroundColor: '#f6f7fb',
    paddingHorizontal: '5%',
  },
  dropdownTxt: {
    textAlign: 'left',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  dropdownStyle: {
    backgroundColor: '#f6f7fb',
    borderRadius: 12,
  },
  dropdown2RowTxtStyle: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
});

export default DropDownCard;
