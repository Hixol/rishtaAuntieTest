import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Slider} from 'react-native-elements';
import {windowHeight, windowWidth} from '../../utility/size';

import Icons from '../../utility/icons';
import colors from '../../utility/colors';
import ToggleSwitch from 'toggle-switch-react-native';
import DropDownCard from './DropDownCard';

const MyMartialHistoryCard = ({item}) => {
  const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  const [currentValue, setCurrentValue] = useState(0);
  const [isEnable, setIsEnable] = useState(false);
  const [status, setStatus] = useState(false);

  const toggleSwitch = () => {
    setIsEnable(!isEnable);
  };

  const optionList = [
    {
      status: 'Yes',
      color: colors.primaryPink,
    },
    {
      status: 'No',
      color: colors.primaryBlue,
    },
  ];

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.header}>
        <Icons.MaterialCommunityIcons
          name="hands-pray"
          size={30}
          color={colors.primaryBlue}
        />
        <Text style={styles.headingTxt}>
          My Martial History and Future Plans
        </Text>
      </View>

      <View style={styles.detailsSec}>
        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Martial History</Text>
          <DropDownCard
            placeHolder={'Select Martial History'}
            data={countries}
          />
        </View>

        <View style={styles.haveKidsSec}>
          <Text style={styles.detailsTxt}>Have kids?</Text>
          <ToggleSwitch
            isOn={isEnable}
            onColor={colors.primaryPink}
            offColor={colors.greyWhite}
            size="medium"
            onToggle={toggleSwitch}
            animationSpeed={200}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.detailsTxt}>Ideal Marriage Time</Text>
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
          <Text style={styles.detailsTxt}>Want kids?</Text>
          <DropDownCard placeHolder={'Select One'} data={countries} />
        </View>

        <View style={styles.details}>
          <Text style={styles.detailsTxt}>I Pray</Text>
          <View style={[styles.btnView, {height: '82%'}]}>
            {optionList.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => setStatus(item.status)}
                  style={[
                    styles.btn,
                    {
                      backgroundColor:
                        item.status === status
                          ? colors.primaryPink
                          : colors.white,
                      borderColor:
                        item.status === status
                          ? colors.primaryPink
                          : item.color,
                    },
                  ]}>
                  {item.icon}
                  <Text
                    style={[
                      styles.btnText,
                      {
                        color:
                          item.status === status
                            ? colors.white
                            : colors.primaryPink,
                      },
                    ]}>
                    {item.status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: windowHeight * 0.64,
    width: windowWidth * 0.915,
    paddingVertical: '2%',
    borderRadius: 10,
  },
  header: {
    width: '100%',
    height: '12%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headingTxt: {
    fontSize: windowHeight * 0.02,
    color: colors.primaryPink,
    fontFamily: 'Inter-Medium',
    marginLeft: '2%',
  },
  detailsSec: {
    height: '83%',
    alignItems: 'center',
  },
  details: {
    height: '20%',
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
  haveKidsSec: {
    flexDirection: 'row',
    height: '10%',
    width: '84%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2%',
  },
  btn: {
    height: '60%',
    width: '47%',
    borderWidth: 1.5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'Inter-Medium',
  },
  btnView: {
    marginVertical: '2.5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default MyMartialHistoryCard;
