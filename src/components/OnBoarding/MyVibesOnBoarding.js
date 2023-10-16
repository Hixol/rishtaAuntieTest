import React, {useState} from 'react';
import {Text, TouchableOpacity, View, Dimensions, StyleSheet} from 'react-native';
import colors from '../../utility/colors';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MyVibesOnBoarding = props => {
  const [myVibes, setMyVibes] = useState([]);

  const vibesList = [
    {
      status: 'Activist',
    },
    {
      status: 'Adventurous',
    },
    {
      status: 'Artsy Athletic',
    },
    {
      status: 'Badass',
    },
    {
      status: 'Ambitious',
    },
    {
      status: 'Bold',
    },
    {
      status: 'Biryani Lover',
    },
    {
      status: 'Bookworm',
    },
    {
      status: 'Bougie Car',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.vibesHeading, {fontSize: 24}]}>
        What are your vibes?
      </Text>
      <Text style={[styles.vibesHeading, {fontSize: 16}]}>
        Select the personality traits that express you
      </Text>
      <Text style={[styles.vibesHeading, {fontSize: 40}]}>
        {myVibes.length}/9
      </Text>
      <View style={styles.vibesSection}>
        
        <View style={styles.selectionSec}>
          {vibesList.map(item => {
            return (
              <TouchableOpacity
                style={[
                  [styles.btn],
                  {
                    backgroundColor: myVibes.includes(item.status)
                      ? colors.primaryBlue
                      : colors.white,
                  },
                ]}
                onPress={() =>
                  myVibes.includes(item.status)
                    ? setMyVibes(myVibes.filter(e => e !== item.status))
                    : setMyVibes(myVibes => [...myVibes, item.status])
                }>
                <Text
                  style={[
                    styles.btnTxt,
                    {
                      color: myVibes.includes(item.status)
                        ? 'white'
                        : colors.black,
                    },
                  ]}>
                  {item.status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyVibesOnBoarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.greyWhite,
        alignItems: 'center',
      },
      vibesHeading: {
        fontFamily:'Roboto-Regular',
        color: colors.primaryBlue,
        marginTop: '5%',
      },
      vibesSection: {
        width: '90%',
        paddingVertical: '5%',
      },
      selectionHeading: {
        fontFamily:'Roboto-Medium',
        color: colors.primaryBlue,
        fontSize: 18,
      },
      selectionSec: {
        marginVertical: '8%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      btn: {
        height: windowHeight * 0.049,
        paddingHorizontal: '6%',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: colors.white,
        margin: '1.5%',
      },
      btnTxt: {
        color: 'black',
        fontFamily:'Roboto-Regular',
        fontSize: 13,
      },
      saveBtn: {
        backgroundColor: colors.white,
        height: windowHeight * 0.053,
        width: windowWidth * 0.85,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: '10%',
        borderColor: colors.primaryPink,
        borderWidth: 1.5,
      },
      saveTxt: {
        color: colors.primaryPink,
        fontFamily:'Roboto-Medium',
        fontSize: 18,
      },
})