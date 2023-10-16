import React from 'react';
import {SafeAreaView, FlatList, View, Image, Text} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import styles from './styles';
import colors from '../../utility/colors';
import DiscoverProfile from '../../components/DiscoverProfile';

const MyProfile = props => {
  const isFocused = useIsFocused();
  const tabBarHeight = useBottomTabBarHeight();
  const {userData} = useSelector(store => store.userReducer);

  let roundImage = '',
    video = '';
  if (userData?.UserMedia.length > 0) {
    userData?.UserMedia.map(x => {
      if (x.type == 'image' && x.sequence == 1) {
        roundImage = x.url;
      } else if (x.type == 'video') {
        video = x.url;
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {userData == null ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{width: '40%', height: '10%'}}
            resizeMode={'contain'}
            source={require('../../assets/iconimages/warning-icon.png')}
          />
          <Text style={{fontSize: 25, color: colors.primaryPink}}>
            You aren't log in. Please log in!
          </Text>
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
          }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            pagingEnabled
            snapToAlignment={'start'}
            data={[1]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <DiscoverProfile
                fOrigin={userData?.Profile?.familyOrigin}
                userName={userData.firstName}
                occupation={userData?.Profile?.occupation}
                tagline={userData?.Profile?.tagline}
                city={userData?.city}
                country={userData?.country}
                tabBarHeight={tabBarHeight}
                video={video}
                image={roundImage}
                age={userData?.Profile?.age}
                isFocused={isFocused}
              />
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
export default MyProfile;
