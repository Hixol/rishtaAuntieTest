import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';

import styles from './styles';
import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import Countries from '../../assets/countryLists/Countries';
import CountryFlag from 'react-native-country-flag';
import CardCarousel from '../../modules/CardCarousel';
import ImageCarousel from '../../components/StorySlider/ImageCarousel';
import Icons from '../../utility/icons';

const MyProfileDetails = props => {
  const {userData} = useSelector(store => store.userReducer);

  const ref1 = React.useRef(null);
  const [bioData, setBioData] = useState(null);
  const [index, setIndex] = useState(0);

  let userImages = [];
  let countryFlag = '';
  let originFlag = '';

  Countries.filter(country => {
    if (country.en == userData?.country) {
      countryFlag = country.code;
    }
    if (country.en == userData?.Profile?.familyOrigin) {
      originFlag = country.code;
    }
  });

  useEffect(() => {
    setBioData(userData);
  }, []);

  if (userData?.UserMedia.length > 0) {
    userData?.UserMedia.map(x => {
      if (x.type == 'image') {
        userImages.push(x.url);
      }
    });
  }

  let languages = [];
  bioData ? languages.push(bioData?.UserLanguages?.map(x => x.language)) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View ref={ref1} style={styles.imgSection}>
          <View
            style={{
              width: '100%',
              height: '100%',
              zIndex: 0,
              position: 'absolute',
            }}>
            <ImageCarousel
              imageUris={userImages}
              blurPhoto={true}
              currentIndex={setIndex}
            />
          </View>

          <View style={styles.imgHeader}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('SearchPreferences')}
              style={styles.iconImg}>
              <FastImage
                style={{height: '72%', width: '60%'}}
                source={require('../../assets/iconimages/heart-discover.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.flagContainer}>
            <CountryFlag isoCode={countryFlag} size={20} />
            <CountryFlag isoCode={originFlag} size={20} />
          </View>

          <View style={styles.nameView}>
            <Text numberOfLines={1} style={styles.name}>
              {bioData ? bioData.firstName : null}{' '}
              <Text style={styles.nameTxt}>
                {bioData ? bioData.Profile.age : null}
              </Text>
            </Text>
          </View>
        </View>

        <View
          onStartShouldSetResponder={evt =>
            props.navigation.navigate('ViewProfile', {
              enable: true,
            })
          }>
          <View style={styles.analystSection}>
            <Text style={styles.statementTxt}>
              {userData?.Profile?.tagline}
            </Text>
            <View style={styles.analystTxt}>
              <View style={styles.analystFooter}>
                <Icons.MaterialCommunityIcons
                  name="map-marker-outline"
                  size={30}
                  color={colors.primaryBlue}
                />
                <Text
                  style={[
                    styles.locationTxt,
                    {
                      minWidth: '40%',
                      maxWidth: '90%',
                    },
                  ]}>
                  {bioData ? bioData.city : null},{' '}
                  {bioData ? bioData.country : null}
                </Text>
              </View>
              <Text
                style={[
                  styles.locationTxt,
                  {
                    minWidth: '30%',
                    maxWidth: '40%',
                  },
                ]}>
                {bioData ? bioData.Profile.occupation : null}
              </Text>
            </View>
          </View>

          <View style={styles.matchingSection}>
            <Text style={styles.lookingForTxt}>Personality Insights</Text>
            <View style={styles.bulbSect}>
              <View style={styles.meView}>
                <Text style={styles.meTxt}>Me:</Text>
                <Text style={styles.myvibes}>
                  {bioData ? bioData?.Profile?.personalityType : null}
                </Text>
              </View>

              <View style={styles.bulbView}>
                <FastImage
                  style={{height: '100%', width: '100%'}}
                  source={require('../../assets/iconimages/bulb.png')}
                />
              </View>
            </View>
          </View>

          <View style={styles.myVibesSection}>
            <Text style={styles.myvibes}>My Vibes</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginHorizontal: '1%',
              }}>
              {bioData != null &&
                bioData?.Profile?.vibes?.map((item, index) => {
                  return (
                    <View key={index} style={styles.ambBtn}>
                      <Text style={styles.ambitiousBttn}>{item}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>

        {/* CARD VIEW END */}
        <CardCarousel user={userData} />
        <View>
          {userData?.ProfilePrompts?.map((item, index) => {
            return (
              <View key={index} style={styles.lookingForSec}>
                <Text style={styles.lookingForTxt}>
                  {item?.Question?.title}
                </Text>
                <Text style={styles.perfectLatteTxt}>{item?.answer}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileDetails;
