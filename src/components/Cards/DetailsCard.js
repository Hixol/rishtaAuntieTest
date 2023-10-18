import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../../utility/size';

import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';

const detailsCard = ({item}) => {
  const [isLifestyle, setIsLifestyle] = useState(item.heading);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {item.icon}
        <Text style={styles.headingTxt}>{item.heading}</Text>
      </View>
      {item.views.map((view, index) => {
        return (
          <View key={index} style={[styles.details, {height: item.height}]}>
            <Text style={{color: '#a8a8a8', fontFamily: 'Inter-Medium'}}>
              {view.one}
            </Text>
            <View
              style={{
                width: isLifestyle == 'My Lifestyle' ? '32%' : '40%',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                flexDirection:
                  isLifestyle === 'My Lifestyle' ? 'column' : 'row',
              }}>
              {isLifestyle === 'My Lifestyle' ? view.icon : null}
              {view?.iconImage ? (
                <FastImage
                  resizeMode="contain"
                  style={{height: '10%', width: '10%', backgroundColor: 'red'}}
                  source={{uri: view.iconImage}}
                />
              ) : null}

              <Text
                style={{
                  color: colors.primaryBlue,
                  fontFamily: 'Inter-Medium',
                }}>
                {view.oneValue}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    // height: windowHeight * 0.55,
    height: '100%',
    width: windowWidth * 0.92,
    borderRadius: 10,
  },
  header: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    marginVertical: '3%',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#bbbbbb',
    borderBottomWidth: 0.8,
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  headingTxt: {
    fontSize: 18,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Medium',
    marginLeft: '3%',
  },
});

export default detailsCard;
