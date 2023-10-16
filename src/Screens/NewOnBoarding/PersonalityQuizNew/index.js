import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../../constants/Colors';
import colors from '../../../utility/colors';

const PersonalityQuizNew = ({navigation, route}) => {
  return (
    <SafeAreaView style={{flex: 1, padding: 20, backgroundColor: '#FFFFFF'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FastImage
            resizeMode="contain"
            style={{width: 20, height: 30}}
            source={require('../../../assets/iconimages/back-arrow-blue.png')}
          />
        </TouchableOpacity>
        <FastImage
          resizeMode="contain"
          style={{width: 40, height: 50}}
          source={require('../../../assets/iconimages/shortLogo.png')}
        />
        <View style={{width: 20, height: 30}}></View>
      </View>
      <Text style={{color: '#111827', fontSize: 18, marginTop: '25%'}}>
        Time for the Rishta Auntie personality quiz!
      </Text>
      <Text
        style={{
          color: '#6B7280',
          fontSize: 18,
          marginTop: '3%',
          maxWidth: '80%',
        }}>
        This will help me learn more about you and give suggestions about
        potential matches
      </Text>
      <FastImage
        resizeMode="contain"
        style={{
          width: '70%',
          height: '40%',
          alignSelf: 'center',
          marginTop: '10%',
        }}
        source={require('../../../assets/iconimages/PersonalityBrain.png')}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('PersonalityQuiz')}
        style={{
          //   width: '60%',
          paddingVertical: '5%',
          backgroundColor: colors.primaryPink,
          alignSelf: 'center',
          marginTop: '5%',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: '5%',
        }}>
        <Text style={{color: colors.white, fontSize: 20}}>
          Rishta Auntie Personality Quiz
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('BottomTab', {
            screen: 'Settings',
          })
        }
        style={{
          //   width: '60%',
          paddingVertical: '3%',
          alignSelf: 'center',
          marginTop: '3%',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: '5%',
          borderWidth: 1,
          borderColor: '#EBECEF',
        }}>
        <Text style={{color: colors.primaryPink, fontSize: 18}}>
          Skip for Now
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default PersonalityQuizNew;
