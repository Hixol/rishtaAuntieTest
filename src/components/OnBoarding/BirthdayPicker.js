import {Pressable, StyleSheet, Text, Appearance} from 'react-native';
import React, {useState} from 'react';
import {useHelper} from '../../hooks/useHelper';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import DatePicker from 'react-native-date-picker';
import colors from '../../utility/colors';

const BirthdayPicker = ({getCallBackVal}) => {
  const {Alerts} = useHelper();

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [age, setAge] = useState(null);

  let diffTime, diffDate, calculatedAge;

  return (
    <>
      <Pressable
        onPress={() => setShowDate(!showDate)}
        style={{
          backgroundColor: 'white',
          marginHorizontal: 12,
          padding: 12,
          borderRadius: 24,
          marginTop: 40,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{color: colors.black, flex: 1, fontWeight: 'bold'}}>
          {moment(date).format('MMM DD YYYY')}
        </Text>
        <FastImage
          source={require('../../assets/iconimages/calendar.png')}
          style={{width: 30, height: 30}}
          resizeMode="contain"
        />
      </Pressable>
      <Text
        style={{
          fontSize: 16,
          color: colors.darkBlue,
          fontWeight: 'bold',
          marginTop: 14,
          alignSelf: 'center',
        }}>
        {age > 0 && `Age ${age}`}
      </Text>

      <DatePicker
        open={showDate}
        modal
        style={{alignSelf: 'center'}}
        theme="light"
        mode="date"
        textColor={colors.black}
        date={date}
        androidVariant="nativeAndroid"
        onConfirm={date => {
          setDate(date);
          setShowDate(!showDate);
          // setDate(date);
          diffTime = Math.abs(date - new Date());
          diffDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          calculatedAge = Math.floor(diffDate / 365);
          setAge(calculatedAge);
          if (calculatedAge < 18) {
            Alerts('error', 'You must be at least 18 years of age.');
          } else {
            getCallBackVal(date);
          }
        }}
        onCancel={() => {
          setShowDate(false);
        }}
      />
    </>
  );
};

export default BirthdayPicker;

const styles = StyleSheet.create({});
