import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Slider} from 'react-native-elements';
import {windowHeight, windowWidth} from '../../utility/size';

import colors from '../../utility/colors';
import DropDownCard from './DropDownCard';
import Icons from '../../utility/icons';

const MyReligionCard = ({item}) => {
  const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  const [currentValue, setCurrentValue] = useState(0);

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.header}>
        <Icons.MaterialCommunityIcons
          name="hands-pray"
          size={30}
          color={colors.primaryBlue}
        />
        <Text style={styles.headingTxt}>My Religion</Text>
      </View>

      <View style={styles.detailsSec}>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Religion</Text>
          <DropDownCard placeHolder={'Select On'} data={countries} />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Denomination</Text>
          <DropDownCard placeHolder={'Select On'} data={countries} />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Practicing Level</Text>
          <Slider
            value={currentValue}
            minimumValue={0}
            maximumValue={100}
            onValueChange={value => setCurrentValue(Math.floor(value))}
            minimumTrackTintColor={colors.primaryPink}
            maximumTrackTintColor={'#C4C4C4'}
            trackStyle={styles.trackStyle}
            thumbStyle={styles.thumbStyle}
            thumbTintColor={colors.primaryPink}
            style={[styles.sliderView, {marginTop: '8%'}]}
            thumbProps={{
              children: (
                <View
                  style={{
                    color: colors.black,
                    marginTop: -26,
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontFamily: 'Inter-Bold'}}>
                    {currentValue}
                  </Text>
                </View>
              ),
            }}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>I Pray</Text>
          <Slider
            value={0}
            step={1}
            minimumValue={0}
            maximumValue={3}
            onValueChange={value => {}}
            maximumTrackTintColor={'#C4C4C4'}
            minimumTrackTintColor={colors.primaryPink}
            trackStyle={styles.trackStyle}
            thumbStyle={styles.thumbStyle}
            thumbTintColor={colors.primaryPink}
            style={[styles.sliderView, {marginTop: '4%'}]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: windowHeight * 0.595,
    width: windowWidth * 0.915,
    paddingVertical: '2%',
    borderRadius: 10,
  },
  header: {
    width: '100%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headingTxt: {
    fontSize: 22,
    color: colors.primaryPink,
    fontFamily: 'Inter-Medium',
    marginLeft: '2%',
  },
  detailsSec: {
    height: '80%',
    alignItems: 'center',
  },
  details: {
    height: '25%',
    width: '84%',
    marginVertical: '1%',
  },
  detailsTxt: {
    fontSize: 13,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Medium',
  },

  sliderView: {
    width: '96%',
    alignSelf: 'center',
  },
  thumbStyle: {
    height: windowHeight * 0.026,
    width: windowHeight * 0.026,
    shadowColor: colors.primaryPink,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0.4,
    elevation: 5,
  },
  trackStyle: {
    height: '18%',
    borderRadius: 50,
  },
});

export default MyReligionCard;
