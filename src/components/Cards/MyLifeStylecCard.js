import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {windowHeight, windowWidth} from '../../utility/size';

import colors from '../../utility/colors';
import Icons from '../../utility/icons';

const MyLifeStylecCard = ({item}) => {
  const [isDrink, setIsDrink] = useState('');
  const [isSmoke, setIsSmoke] = useState('');
  const [isDietChoices, setIsDietChoices] = useState('');

  const drinkList = [
    {
      icon: <Icons.Entypo name="drink" size={20} color={colors.primaryBlue} />,
      status: 'I Drink',
    },
    {
      icon: (
        <Icons.MaterialIcons
          name="no-drinks"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: "Don't drink",
    },
  ];

  const smokeList = [
    {
      icon: (
        <Icons.MaterialIcons
          name="smoke-free"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: 'Hookah',
    },
    {
      icon: (
        <Icons.MaterialIcons
          name="smoke-free"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: 'Cigarette',
    },
    {
      icon: (
        <Icons.MaterialCommunityIcons
          name="leaf"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: 'Weed',
    },
    {
      icon: (
        <Icons.MaterialIcons
          name="smoke-free"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: 'None',
    },
  ];

  const dietChoices = [
    {
      icon: (
        <Icons.MaterialCommunityIcons
          name="food-halal"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: 'Halal',
    },
    {
      icon: (
        <Icons.MaterialCommunityIcons
          name="food-turkey"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: 'Vegan',
    },
    {
      icon: (
        <Icons.MaterialCommunityIcons
          name="food-drumstick-off"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: 'Vegeterian',
    },
    {
      icon: (
        <Icons.MaterialCommunityIcons
          name="food-apple"
          size={20}
          color={colors.primaryBlue}
        />
      ),
      status: 'Anything',
    },
  ];
  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.header}>
        <Icons.MaterialCommunityIcons
          name="flag-triangle"
          size={25}
          color={colors.primaryBlue}
        />
        <Text style={styles.headingTxt}>My Lifestyle</Text>
      </View>

      <View style={styles.detailsSec}>
        <Text style={styles.detailsTxt}>Do you Drink?</Text>
        <View style={[styles.details, {height: '17%'}]}>
          {drinkList.map(item => {
            return (
              <TouchableOpacity
                onPress={() => setIsDrink(item.status)}
                style={[
                  styles.btn,
                  {
                    backgroundColor:
                      item.status === isDrink
                        ? colors.primaryPink
                        : colors.white,
                  },
                ]}>
                {item.icon}
                <Text
                  style={[
                    styles.btnText,
                    {
                      color:
                        item.status === isDrink
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
        <Text style={styles.detailsTxt}>Do you Smoke?</Text>
        <View style={[styles.details, {height: '28%', flexWrap: 'wrap'}]}>
          {smokeList.map(item => {
            return (
              <TouchableOpacity
                onPress={() => setIsSmoke(item.status)}
                style={[
                  styles.smokeBtn,
                  {
                    backgroundColor:
                      item.status === isSmoke
                        ? colors.primaryPink
                        : colors.white,
                  },
                ]}>
                {item.icon}
                <Text
                  style={[
                    styles.btnText,
                    {
                      color:
                        item.status === isSmoke
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
        <Text style={styles.detailsTxt}>Diet Choices</Text>
        <View style={[styles.details, {height: '28%', flexWrap: 'wrap'}]}>
          {dietChoices.map(item => {
            return (
              <TouchableOpacity
                onPress={() => setIsDietChoices(item.status)}
                style={[
                  styles.smokeBtn,
                  {
                    backgroundColor:
                      item.status === isDietChoices
                        ? colors.primaryPink
                        : colors.white,
                  },
                ]}>
                {item.icon}
                <Text
                  style={[
                    styles.btnText,
                    {
                      color:
                        item.status === isDietChoices
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: windowHeight * 0.62,
    width: windowWidth * 0.915,
    paddingVertical: '4%',
    borderRadius: 10,
    alignItems: 'center',
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
    height: '84%',
    width: '86%',
  },
  details: {
    marginVertical: '2.5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  detailsTxt: {
    fontSize: 13,
    color: colors.primaryBlue,
    fontFamily: 'Roboto-Medium',
  },
  btn: {
    height: '57%',
    width: '47%',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primaryPink,
  },
  btnText: {
    fontFamily: 'Roboto-Medium',
    marginLeft: '2%',
  },
  smokeBtn: {
    height: '34%',
    width: '47%',
    marginVertical: '2%',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primaryPink,
  },
});

export default MyLifeStylecCard;
