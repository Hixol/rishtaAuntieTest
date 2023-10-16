import React from 'react';
import {SafeAreaView} from 'react-native';

import HeaderContainer from '../../components/containers/headerContainer';
import BlockedTabView from '../../components/TabView';

const BlockedList = props => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderContainer
        gobackButtonPress={() => props.navigation.goBack()}
        goback={'arrow-back'}
        backButton
        Icon
        name={'setting'}
      />
      <BlockedTabView />
    </SafeAreaView>
  );
};
export default BlockedList;
