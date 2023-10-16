import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {windowHeight} from '../../utility/size';

import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';

const NewBlogCard = ({image, title, onPress}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.image}
          source={{uri: image}}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

export default NewBlogCard;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    width: '94%',
    marginBottom: '4%',
  },
  imageContainer: {
    height: windowHeight * 0.35,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: '2%',
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: colors.primaryBlue,
    lineHeight: 23,
  },
});
