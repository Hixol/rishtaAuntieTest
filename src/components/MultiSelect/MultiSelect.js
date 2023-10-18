import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../utility/colors';

const MultiSelect = props => {
  return (
    <View
      style={[styles.selectionSec, {justifyContent: props?.justifyContent}]}>
      {props?.arrayData.map(item => {
        return props?.vibes ? (
          <TouchableOpacity
            onPress={() =>
              props?.selectedItems.includes(item)
                ? props?.handleOnSelect(
                    props?.selectedItems.filter(e => e !== item),
                  )
                : props?.selectedItems.length < 10
                ? props?.handleOnSelect(selectedItems => [
                    ...selectedItems,
                    item,
                  ])
                : null
            }
            style={[
              [styles.btn],
              {
                backgroundColor: props?.selectedItems.includes(item)
                  ? colors.primaryBlue
                  : props?.backGroundColor,
                height: props?.height,
                paddingHorizontal: props?.paddingHorizontal,
                marginHorizontal: props?.marginHorizontal,
              },
            ]}>
            <Text
              style={[
                styles.btnTxt,
                {
                  color: props?.selectedItems.includes(item)
                    ? 'white'
                    : colors.primaryBlue,
                },
              ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ) : props?.interaction ? (
          <TouchableOpacity
            onPress={() =>
              props?.selectedItems?.includes(item?.status)
                ? props?.handleOnSelect(
                    props?.selectedItems?.filter(e => e !== item?.status),
                  )
                : props?.selectedItems?.length < 10
                ? props?.handleOnSelect(selectedItems => [item?.status])
                : null
            }
            style={[
              [styles.btn],
              {
                width: props?.btnWidth,
                backgroundColor: props?.selectedItems?.includes(item.status)
                  ? colors.primaryBlue
                  : props?.backGroundColor,
                height: props?.height,

                paddingHorizontal: props?.paddingHorizontal,
                marginHorizontal: props?.marginHorizontal,
              },
            ]}>
            <Text
              style={[
                styles.btnTxt,
                {
                  color: props?.selectedItems?.includes(item.status)
                    ? 'white'
                    : colors.primaryBlue,
                },
              ]}>
              {item.status}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              props?.selectedItems.includes(item.status)
                ? props?.handleOnSelect(
                    props?.selectedItems.filter(e => e !== item.status),
                  )
                : props?.selectedItems.length < 10
                ? props?.handleOnSelect(selectedItems => [
                    ...selectedItems,
                    item.status,
                  ])
                : null
            }
            style={[
              [styles.btn],
              {
                backgroundColor: props?.selectedItems.includes(item.status)
                  ? colors.primaryBlue
                  : props?.backGroundColor,
                height: props?.height,
                paddingHorizontal: props?.paddingHorizontal,
                marginHorizontal: props?.marginHorizontal,
              },
            ]}>
            <Text
              style={[
                styles.btnTxt,
                {
                  color: props?.selectedItems.includes(item.status)
                    ? 'white'
                    : colors.primaryBlue,
                },
              ]}>
              {item.status}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  selectionSec: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  btn: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.white,
    marginVertical: '1.5%',
  },
  btnTxt: {
    color: 'black',
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
});

export default MultiSelect;
