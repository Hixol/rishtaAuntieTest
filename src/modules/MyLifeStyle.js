import React from 'react';
import {View, Text} from 'react-native';
import {Divider} from 'react-native-elements';
import {CARDWIDTH} from '../constants/Constants';

import DiscoverItem from './DiscoverItem';
import Colors from '../constants/Colors';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import colors from '../utility/colors';

export default function MyLifeStyle({user}) {
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.header}>
          <Text style={styles.text}>My LifeStyle</Text>
          <FastImage
            resizeMode="contain"
            style={{width: 50, height: 50}}
            source={require('../assets/iconimages/myLifestyle.png')}
          />
        </View>
        <Divider style={[styles.divider, {width: '100%', marginTop: '2%'}]} />
      </View>
      <View style={[styles.MainView]}>
        <DiscoverItem
          title="I Drink"
          Component={
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '40%',
                maxWidth: '60%',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                }}>
                {user?.Profile?.iDrink === 'I Drink' ? (
                  <FastImage
                    resizeMode="contain"
                    style={{width: 20, height: 20}}
                    source={require('../assets/iconimages/glass.png')}
                  />
                ) : user?.Profile?.iDrink === "I Don't Drink" ? (
                  <FastImage
                    resizeMode="contain"
                    style={{width: 20, height: 20}}
                    source={require('../assets/iconimages/no-glass.png')}
                  />
                ) : null}

                <Text
                  style={{
                    textAlign: 'right',
                    width: '100%',
                    fontFamily: 'Inter-Medium',
                    fontSize: 16,
                    flexDirection: 'row',
                    color: colors.blackBlue,
                  }}>
                  {user?.Profile?.iDrink}
                </Text>
              </View>
            </View>
          }
        />
        <Divider style={styles.divider} />
        <DiscoverItem
          title="I Smoke"
          Component={
            <View
              style={{
                minWidth: '40%',
                maxWidth: '60%',
                alignItems: 'flex-end',
              }}>
              <View style={{flexDirection: 'row'}}>
                {user?.UserSmokes?.map(option => (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    key={option?.choice}>
                    <FastImage
                      resizeMode="contain"
                      style={{width: 20, height: 20}}
                      source={
                        option?.choice === 'Hookah,' ||
                        option?.choice === 'Hookah'
                          ? require('../assets/iconimages/Hookah-01.png')
                          : option?.choice === 'Weed,' ||
                            option?.choice === 'Weed'
                          ? require('../assets/iconimages/Weed-01.png')
                          : option?.choice === 'Cigarette,' ||
                            option?.choice === 'Cigarette'
                          ? require('../assets/iconimages/Cigarette.png')
                          : option?.choice === 'None,' ||
                            option?.choice === 'None'
                          ? require('../assets/iconimages/no.png')
                          : null
                      }
                    />

                    <Text
                      style={{
                        textAlign: 'right',
                        width: '100%',
                        fontFamily: 'Inter-Medium',
                        fontSize: 16,
                        color: colors.blackBlue,
                      }}>
                      {option?.choice}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          }
        />
        <Divider style={styles.divider} />
        <DiscoverItem
          title="Diet Choices"
          Component={
            <View
              style={{
                minWidth: '40%',
                maxWidth: '60%',
                alignItems: 'flex-end',
              }}>
              <View style={{flexDirection: 'row'}}>
                {user?.UserDietChoices?.map(option => (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    key={option?.choice}>
                    <FastImage
                      resizeMode="contain"
                      style={{width: 20, height: 20}}
                      source={
                        option?.choice === 'Halal,' ||
                        option?.choice === 'Halal'
                          ? require('../assets/iconimages/Halal.png')
                          : option?.choice === 'Vegan,' ||
                            option?.choice === 'Vegan'
                          ? require('../assets/iconimages/Vegan-01.png')
                          : option?.choice === 'Vegetarian,' ||
                            option?.choice === 'Vegetarian'
                          ? require('../assets/iconimages/Vegetarian-01.png')
                          : option?.choice === 'Anything,' ||
                            option?.choice === 'Anything'
                          ? require('../assets/iconimages/Anything-01.png')
                          : null
                      }
                    />
                    <View>
                      <Text
                        style={{
                          textAlign: 'right',
                          width: '100%',
                          fontFamily: 'Inter-Medium',
                          fontSize: 16,
                          color: colors.blackBlue,
                        }}>
                        {option?.choice}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          }
        />
        <Divider style={styles.divider} />
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     width: CARDWIDTH,
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 350,
//     marginTop: 10,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 80,
//     marginVertical: 10,
//   },

//   row: {
//     width: CARDWIDTH - 200,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//   },
//   text: {
//     fontSize: 22,
//     color: '#0F3577',
//     marginLeft: 5,
//     alignSelf: 'center',
//   },

//   textcontainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   MainView: {
//     width: CARDWIDTH - 40,
//     height: 250,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 20,
//   },
//   ChildView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   divider: {
//     backgroundColor: '#C8C8C8',
//     width: Dimensions.get('window').width / 1.2,
//   },
//   firsttext: {
//     color: '#C8C8C8',
//     fontSize: 15,
//     fontWeight: 'bold',
//   },
//   secondtext: {
//     color: Colors.primaryColor,
//     fontSize: 12,
//     marginTop: 8,
//   },
// });
