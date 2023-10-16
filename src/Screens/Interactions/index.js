import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from './styles';
import TopTabNav from '../../components/TopTabNavigator/TopTabNav';
import HeaderContainer from '../../components/containers/headerContainer';

const Interactions = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderContainer Icon name={'setting'} />
      <TopTabNav />
    </SafeAreaView>
  );
};
export default Interactions;
