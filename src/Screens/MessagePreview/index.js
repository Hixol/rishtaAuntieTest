import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {windowHeight} from '../../utility/size';

import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import styles from './styles';
import Loader from '../../components/Loader';
import Icons from '../../utility/icons';

const MessagePreview = ({navigation, route}) => {
  const {type, uri} = route.params;
  const [loading, setLoading] = useState(false);

  const handleClosePress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.videoWrapper}>
      {type == 'video' ? (
        <>
          {loading && (
            <Loader
              style={{
                position: 'absolute',
                alignSelf: 'center',
                top: windowHeight / 2,
              }}
            />
          )}
          <Video
            onLoadStart={() => setLoading(true)}
            onReadyForDisplay={() => setLoading(false)}
            source={{uri: uri}}
            resizeMode="contain"
            paused={false}
            repeat={true}
            controls={true}
            style={{
              height: '80%',
              width: '100%',
            }}
          />
          <TouchableOpacity style={styles.crossIcon} onPress={handleClosePress}>
            <Icons.Ionicons name="close" size={30} color={'#fff'} />
          </TouchableOpacity>
        </>
      ) : type == 'image' ? (
        <>
          {loading && (
            <Loader
              style={{
                position: 'absolute',
                alignSelf: 'center',
                top: windowHeight / 2,
              }}
            />
          )}
          <FastImage
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            source={{uri: uri}}
            resizeMode="contain"
            style={{height: '90%', width: '100%'}}
          />
          <TouchableOpacity style={styles.crossIcon} onPress={handleClosePress}>
            <Icons.Ionicons name="close" size={30} color={'#fff'} />
          </TouchableOpacity>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default MessagePreview;
