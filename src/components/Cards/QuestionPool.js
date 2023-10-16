import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {windowHeight, windowWidth} from '../../utility/size';

import colors from '../../utility/colors';

const QuestionPool = ({item}) => {
  let navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headingTxt}>Question Pool</Text>
      </View>
      {item.views.map((view, index) => {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AnswerPoolScreen', {
                id: view.id,
                quest: view.title,
              })
            }
            activeOpacity={0.7}
            key={index}
            style={[styles.details]}>
            <Text style={{color: colors.black, fontFamily: 'Roboto-Medium'}}>
              {view.title}
            </Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    marginVertical: '3%',
  },
  details: {
    backgroundColor: colors.greyWhite,
    justifyContent: 'center',
    borderBottomColor: '#bbbbbb',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: '2%',
    paddingHorizontal: '5%',
    paddingLeft: '7%',
    height: '10%',
  },
  headingTxt: {
    fontSize: 18,
    color: colors.primaryBlue,
    fontFamily: 'Roboto-Medium',
    marginLeft: '3%',
  },
});

export default QuestionPool;
