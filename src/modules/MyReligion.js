import React from 'react';
import {View, Text} from 'react-native';
import {Divider} from 'react-native-elements';
import {CARDWIDTH} from '../constants/Constants';

import DiscoverItem from './DiscoverItem';
import FastImage from 'react-native-fast-image';
import styles from './styles';

export default function MyReligion({user}) {
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
          <Text style={styles.text}>My Religion</Text>
          <FastImage
            resizeMode="contain"
            style={{width: 50, height: 50}}
            source={require('../assets/iconimages/myReligion.png')}
          />
        </View>
        <Divider style={[styles.divider, {width: '100%', marginTop: '2%'}]} />
      </View>
      <View style={styles.MainView}>
        <DiscoverItem title="Religion" value={user?.Profile?.religion} />
        <Divider style={styles.divider} />
        <DiscoverItem
          title="Denomination"
          value={user?.Profile?.denomination}
        />
        <Divider style={styles.divider} />
        <DiscoverItem
          title="Practice Level"
          value={user?.Profile?.practiceLevel}
        />
        <Divider style={styles.divider} />
        <DiscoverItem title="I Pray " value={user?.Profile?.iPray} />
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

//   text: {
//     fontSize: 22,
//     color: '#0F3577',
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
//     color: '#0F3577',
//     fontWeight: 'bold',
//     fontSize: 15,
//   },
// });
