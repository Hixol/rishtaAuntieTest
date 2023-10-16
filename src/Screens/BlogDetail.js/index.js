import React, {useState, useEffect} from 'react';

import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import styles from './styles';
import colors from '../../utility/colors';
import HeaderContainer from '../../components/containers/headerContainer';
import FastImage from 'react-native-fast-image';
import SocialButton from '../../components/buttons/SocialButton';
import BlogBlockCard from '../../components/BlogBlockCard';
import BlogListArray from '../../ArrayForList/ArrayForList';
import {SafeAreaView} from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BlogDetails = props => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer
        goback={'arrow-back'}
        backButton
        Icon
        name={'setting'}
        gobackButtonPress={() => props.navigation.goBack()}
      />
      <View style={{flex: 1, padding: '3%'}}>
        <View style={{marginVertical: '3%'}}>
          <SocialButton followUs />
        </View>

        <View style={styles.headingView}>
          <Text style={styles.headingText}>Rishta Auntie Blog</Text>
        </View>

        <ScrollView>
          <View style={styles.listView}>
            {BlogListArray.map(i => {
              return (
                <View key={i.id}>
                  <BlogBlockCard
                    Image={i.img}
                    BlogHeading={i.BlogDetailText}
                    contStyle={styles.imgSize}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default BlogDetails;
