import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {ios, windowHeight, windowWidth, screenHeight} from '../utility/size';
import {useNavigation} from '@react-navigation/native';

import FastImage from 'react-native-fast-image';
import CountryFlag from 'react-native-country-flag';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import Countries from '../assets/countryLists/Countries';
import Icons from '../utility/icons';

const DiscoverProfile = ({
  tabBarHeight,
  video,
  image,
  userName,
  city,
  country,
  fOrigin,
  occupation,
  tagline,
  age,
  isFocused,
}) => {
  let adjustHeight = 0;
  const navigation = useNavigation();
  const [isPaused, setIsPaused] = useState(true);
  const [isPausedButton, setIsPausedButton] = useState(true);

  const pausePlay = () => {
    setIsPausedButton(!isPausedButton);
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (isFocused == true) {
      setIsPaused(true);
      setIsPausedButton(true);
    } else {
      setIsPaused(true);
      setIsPausedButton(true);
    }
  }, [isFocused]);

  let flagsLiving = [];
  flagsLiving = Countries.filter(item => {
    return item?.en === country ? item.code : null;
  });

  let flagsOrigin = [];
  flagsOrigin = Countries.filter(item => {
    return item.en === fOrigin ? item.code : null;
  });

  if (
    screenHeight - windowHeight > 0 &&
    windowHeight >= 812 &&
    windowHeight <= 816
  ) {
    adjustHeight = windowHeight - tabBarHeight * 3 + 18;
  } else if (ios && windowHeight > 920) {
    adjustHeight = windowHeight - tabBarHeight * 3 + 10;
  } else {
    adjustHeight = windowHeight - tabBarHeight * 3;
  }

  return (
    <Pressable
      onPress={() => pausePlay()}
      style={[
        styles.container,
        {
          height:
            windowHeight <= 640
              ? windowHeight - tabBarHeight - 24
              : windowHeight < 760
              ? windowHeight - tabBarHeight * 3 - 37
              : windowHeight > 760 && windowHeight < 780
              ? adjustHeight - 10
              : windowHeight > 785 && windowHeight < 789
              ? adjustHeight - 10
              : windowHeight < 790
              ? windowHeight - tabBarHeight * 3 - 34
              : windowHeight > 885 && windowHeight < 895
              ? adjustHeight - 20
              : adjustHeight,
        },
      ]}>
      {video ? (
        <View>
          <Video
            resizeMode={'cover'}
            repeat={true}
            onVideoLoadStart={() => {
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'red'}}>Hello</Text>
              </View>;
            }}
            paused={isPaused}
            style={{
              width: '100%',
              height: ios ? windowHeight * 0.76 + 8 : '100%',
            }}
            source={{uri: convertToProxyURL(video)}}
          />
          {isPausedButton ? (
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
              }}>
              <FastImage
                resizeMode="contain"
                source={require('../assets/iconimages/playIcon.png')}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            </View>
          ) : null}
        </View>
      ) : (
        <FastImage
          source={{uri: image}}
          style={{width: '100%', height: '100%'}}
        />
      )}
      <View style={styles.imgHeader}>
        <TouchableOpacity
          style={styles.iconImg}
          onPress={() => navigation.navigate('SearchPreferences')}>
          <FastImage
            style={{height: '72%', width: '60%'}}
            source={require('../assets/iconimages/heart-discover.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imgFooter}>
        <Text numberOfLines={1} style={styles.nameTxt}>
          {userName}
          {''}
          <Text style={{fontSize: 15, fontFamily: 'Roboto-Regular'}}>
            {' '}
            {age}
          </Text>
        </Text>
        <Text
          style={[
            styles.analystTxt,
            {
              textAlign: 'center',
              alignSelf: 'center',
              width: '80%',
              marginTop: '1%',
            },
          ]}>
          {occupation}
        </Text>

        <Text style={styles.statementTxt}>{tagline}</Text>
        <View style={styles.lastFooter}>
          <View style={styles.flagContainer}>
            <CountryFlag isoCode={`${flagsLiving[0]?.code}`} size={18} />
            <CountryFlag isoCode={`${flagsOrigin[0]?.code}`} size={18} />
          </View>
          <View style={styles.location}>
            <Icons.Ionicons name="location-outline" size={20} color="white" />
            <Text style={styles.name}>
              {city}, {country}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
  },
  imgHeader: {
    position: 'absolute',
    padding: '1%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  imgFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: '6%',
  },
  occupation: {
    width: '28%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagContainer: {
    position: 'absolute',

    zindex: 1,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-around',
  },
  name: {
    marginLeft: '5%',
    fontSize: 15,
    color: 'white',
    fontFamily: 'Roboto-Regular',
  },
  nameView: {
    position: 'absolute',
    zindex: 1,
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    justifyContent: 'center',
  },
  lastFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '6%',
  },
  circularImg: {
    position: 'absolute',
    backgroundColor: 'white',
    height: windowHeight * 0.075,
    width: windowHeight * 0.075,
    borderRadius: 50,
    borderWidth: 1.3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    alignSelf: 'flex-end',
    height: windowHeight * 0.12,
    width: windowHeight * 0.12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameTxt: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center',
    fontFamily: 'Roboto-Regular',
  },
  statementTxt: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: '3%',
    fontFamily: 'Roboto-Regular',
  },
  analystTxt: {color: 'white', fontSize: 15, fontFamily: 'Roboto-Regular'},
  iconImg: {
    height: windowHeight * 0.055,
    width: windowHeight * 0.055,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DiscoverProfile;
