import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {windowHeight, windowWidth} from '../../utility/size';

import colors from '../../utility/colors';
import DropDownCard from './DropDownCard';
import Icons from '../../utility/icons';

const DemographicsCard = ({item}) => {
  const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.header}>
        <Icons.MaterialCommunityIcons
          name="flag-triangle"
          size={25}
          color={colors.primaryBlue}
        />
        <Text style={styles.headingTxt}>My Demographics</Text>
      </View>

      <View style={styles.detailsSec}>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Family Origin</Text>
          <DropDownCard placeHolder={'Family Origin'} data={countries} />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Community</Text>
          <DropDownCard placeHolder={'Select Community'} data={countries} />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Languages Spoken</Text>
          <DropDownCard placeHolder={'Select Language'} data={countries} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: windowHeight * 0.481,
    width: windowWidth * 0.915,
    paddingVertical: '4%',
    borderRadius: 10,
  },
  header: {
    width: '100%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: '2%',
  },
  headingTxt: {
    fontSize: 22,
    color: colors.primaryPink,
    fontFamily: 'Roboto-Medium',
    marginLeft: '2%',
  },
  detailsSec: {
    height: '80%',
    alignItems: 'center',
  },
  details: {
    height: '33%',
    width: '86%',
    marginVertical: '1%',
  },
  detailsTxt: {
    fontSize: 13,
    color: colors.primaryBlue,
    fontFamily: 'Roboto-Medium',
  },
});

export default DemographicsCard;
