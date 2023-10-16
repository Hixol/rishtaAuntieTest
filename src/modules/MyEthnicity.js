import React from 'react';
import {View, Text} from 'react-native';
import {Divider} from 'react-native-elements';
import {CARDWIDTH} from '../constants/Constants';
import DiscoverItem from './DiscoverItem';
import Colors from '../constants/Colors';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import colors from '../utility/colors';

export default function MyEthinicity({user}) {
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
          <Text style={styles.text}>My Ethnicity</Text>
          <FastImage
            resizeMode="contain"
            style={{width: 50, height: 50}}
            source={require('../assets/iconimages/myEthnicity.png')}
          />
        </View>
        <Divider style={[styles.divider, {width: '100%', marginTop: '2%'}]} />
      </View>
      <View style={styles.MainView}>
        <DiscoverItem
          title="Family Origin"
          value={user?.Profile?.familyOrigin}
        />
        <Divider style={styles.divider} />
        <DiscoverItem title="Community" value={user?.Profile?.community} />
        <Divider style={styles.divider} />
        <DiscoverItem
          title="Languages"
          value={user?.UserLanguages?.map(item => item?.language).join(', ')}
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
//     width: '100%',
//     height: 60,
//     marginVertical: 10,
//   },

//   row: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 22,
//     color: colors.primaryBlue,
//     fontFamily: 'Roboto-Medium',
//     marginLeft: 10,
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
//     width: CARDWIDTH - 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   divider: {
//     backgroundColor: '#C8C8C8',
//     width: Dimensions.get('window').width / 1.2,
//   },
//   firsttext: {
//     color: '#C8C8C8',
//     fontSize: 15,
//   },
//   secondtext: {
//     color: Colors.primaryColor,
//     fontSize: 16,
//   },
// });
