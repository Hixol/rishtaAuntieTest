import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {windowHeight, windowWidth} from '../../utility/size';

import colors from '../../utility/colors';
import Icons from '../../utility/icons';
import DropDownCard from './DropDownCard';

const MyEducationCard = ({item}) => {
  const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.header}>
        <Icons.FontAwesome5
          name="graduation-cap"
          size={25}
          color={colors.primaryBlue}
        />
        <Text style={styles.headingTxt}>My Education and Career</Text>
      </View>

      <View style={styles.detailsSec}>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Education Level</Text>
          <DropDownCard
            placeHolder={'Select Education Level'}
            data={countries}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>College / University</Text>
          <TextInput
            placeholder="Enter College / University"
            style={[styles.dropDownBtn, {paddingBottom: 0, paddingTop: 0}]}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Major</Text>
          <DropDownCard placeHolder={'Select Major'} data={countries} />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Occupation</Text>
          <DropDownCard placeHolder={'Select Occupation'} data={countries} />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Company</Text>
          <TextInput
            placeholder="Enter Company Name"
            style={[styles.dropDownBtn, {paddingBottom: 0, paddingTop: 0}]}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Dream Job</Text>
          <TextInput
            placeholder="Job Name"
            style={[styles.dropDownBtn, {paddingBottom: 0, paddingTop: 0}]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: windowHeight * 0.8,
    width: windowWidth * 0.915,
    paddingVertical: '4%',
    borderRadius: 10,
  },
  header: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: '2%',
  },
  headingTxt: {
    fontSize: 22,
    color: colors.primaryPink,
    fontFamily: 'Inter-Medium',
    marginLeft: '2%',
  },
  detailsSec: {
    height: '85%',
    alignItems: 'center',
  },
  details: {
    height: '16%',
    width: '86%',
    marginVertical: '1%',
  },
  detailsTxt: {
    fontSize: 13,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Medium',
  },
  dropDownBtn: {
    height: '47%',
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
});

export default MyEducationCard;
