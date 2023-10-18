import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../utility/colors';
export default function Button(props) {
  return (
    <Pressable
      disabled={props.loading}
      onPress={props.onPress}
      style={[styles.btnContainer, props.YesNoBtnStyle]}>
      {props.YesNoBtn ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.loading && (
            <ActivityIndicator
              size="small"
              color={colors.primaryPink}
              style={{marginRight: 7}}
            />
          )}
          <Text style={[styles.btnTitle, props.btnTitleStyle]}>
            {props.title}
          </Text>
        </View>
      ) : null}
      {props.OnBoadringBtn ? (
        <View
          style={[
            {
              flexDirection: 'row',
              marginHorizontal: '10%',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            props.onBoadringBtnStyle,
          ]}>
          <FastImage
            source={props.btnIcon}
            style={[{width: props.width, height: props.height}, props.imgStyle]}
            resizeMode={'contain'}
            tintColor={props.tint ? colors.white : null}
          />
          <Text style={[styles.btnTitle, props.btnTitleStyle]}>
            {props.title}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    width: '90%',
    borderRadius: 40,
    paddingVertical: '2%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.primaryPink,
  },
  btnTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',

    color: colors.primaryPink,
  },
});
