import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

import colors from '../../utility/colors';

const GenderOnBoarding = props => {
  const [gender, setGender] = useState(null);

  const handleGender = genderType => {
    props.onSelectGender(genderType);
    setGender(genderType);
  };

  return (
    <View style={styles.conatiner}>
      <Text style={styles.titleTxt}>Select One:</Text>
      <View style={[styles.subContainer, props.style]}>
        <View style={[styles.imgCard, {marginRight: 20}]}>
          <TouchableOpacity
            onPress={() => handleGender('male')}
            style={[
              styles.imageContainer,
              {
                backgroundColor:
                  gender == 'male' ? colors.primaryBlue : colors.white,
              },
            ]}>
            <Image
              source={require('../../assets/iconimages/male.png')}
              style={styles.img}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.txt}>Male</Text>
        </View>

        <View style={styles.imgCard}>
          <TouchableOpacity
            onPress={() => handleGender('female')}
            style={[
              styles.imageContainer,
              {
                backgroundColor:
                  gender == 'female' ? colors.primaryPink : colors.white,
              },
            ]}>
            <Image
              source={require('../../assets/iconimages/female.png')}
              style={styles.img}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.txt}>Female</Text>
        </View>
      </View>
    </View>
  );
};

export default GenderOnBoarding;

const styles = StyleSheet.create({
  conatiner: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: -38,
  },
  titleTxt: {
    color: colors.darkBlue,
    marginBottom: 14,
    fontWeight: 'bold',
  },
  subContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  imageContainer: {
    height: 110,
    width: 110,
    padding: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  imgCard: {
    alignItems: 'center',
  },
  txt: {
    marginTop: 6,
    color: colors.darkBlue,
  },
});
