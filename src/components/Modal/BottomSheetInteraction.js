import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import colors from '../../utility/colors';
import FastImage from 'react-native-fast-image';
import ToggleSwitch from 'toggle-switch-react-native';
import MultiSelect from '../MultiSelect/MultiSelect';
import {windowHeight, windowWidth} from '../../utility/size';

const BottomSheetInteraction = props => {
  const filtersAllData = [
    {status: 'All interactions'},
    {status: 'All Requests'},
    {status: 'Views'},
  ];

  const filtersMyMovesAllData = [
    {status: 'All interactions'},
    {status: 'Views'},
  ];

  const filtersRequestData = [
    {status: 'Pending'},
    {status: 'Accepted'},
    {status: 'Rejected'},
  ];

  const filtersInteractionsData = [
    {status: 'Voice Note'},
    {status: 'Likes'},
    {status: 'Comments'},
  ];

  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState([
    filtersAllData[0]?.status,
  ]);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['100%'], []);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    if (props.showModal == true) {
      bottomSheetModalRef.current?.present();
    } else if (props.showModal == false) {
      bottomSheetModalRef.current?.close();
    }
  }, [props.showModal]);

  // callbacks
  const handleSheetChanges = index => {};

  const handleOnSelect = items => {
    setSelectedItems(items);
    props.handleOnSelect(items);
  };

  return (
    <View style={styles.container}>
      <BottomSheetModalProvider>
        <View style={{flex: 1}}>
          <BottomSheetModal
            onDismiss={props.onDismiss}
            backgroundStyle={{
              backgroundColor: colors.greyWhite,
            }}
            handleIndicatorStyle={{backgroundColor: colors.primaryPink}}
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            {props.interactionView ? (
              <BottomSheetScrollView
                indicatorStyle="black"
                contentContainerStyle={[
                  styles.contentContainer,
                  {backgroundColor: colors.greyWhite},
                ]}
                showsVerticalScrollIndicator={true}>
                <View
                  style={{
                    width: '100%',
                    height: '70%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '80%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <FastImage
                      resizeMode="contain"
                      style={{width: 40, height: 40}}
                      source={require('../../assets/iconimages/searchPreferences.png')}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        marginLeft: '2%',
                        color: colors.primaryBlue,
                        fontFamily: 'Roboto-Regular',
                      }}>
                      Within my Search Preferences
                    </Text>
                  </View>
                  <View
                    style={{
                      alignSelf: 'center',
                      marginVertical: '5%',
                    }}>
                    <ToggleSwitch
                      isOn={isEnabled}
                      onColor={colors.primaryPink}
                      offColor={colors.mediumGrey}
                      size="medium"
                      onToggle={toggleSwitch}
                    />
                  </View>
                  <Text
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontFamily: 'Roboto-Regular',
                      fontSize: 15,
                      color: colors.primaryBlue,
                    }}>
                    {isEnabled
                      ? ' Only profiles within your search preferences are displayed in "Their Moves" tab'
                      : 'All profiles who interacted with you are shown in the "Their Moves" tab'}
                  </Text>
                  <View
                    style={{
                      marginVertical: '7%',
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        width: '20%',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                      }}>
                      <FastImage
                        resizeMode="contain"
                        style={{width: 30, height: 30}}
                        source={require('../../assets/iconimages/funnel.png')}
                      />
                    </View>
                    <View style={{width: '60%'}}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontSize: 20,
                          color: colors.primaryBlue,
                          fontFamily: 'Roboto-Regular',
                        }}>
                        Filter interactions by:
                      </Text>
                    </View>
                    <View
                      style={{width: '20%', backgroundColor: 'orange'}}></View>
                  </View>
                  <View
                    style={{
                      paddingVertical: '2%',
                      width: windowWidth * 0.9,
                      backgroundColor: colors.white,
                      borderRadius: 10,
                      elevation: 20,
                      shadowColor: '#CCCCCC',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginVertical: '5%',
                      alignSelf: 'center',
                    }}>
                    <MultiSelect
                      btnWidth={props.MyMoves ? '40%' : '31%'}
                      interaction
                      handleOnSelect={handleOnSelect}
                      arrayData={
                        props.MyMoves ? filtersMyMovesAllData : filtersAllData
                      }
                      selectedItems={selectedItems}
                      height={windowHeight * 0.049}
                      paddingHorizontal={'1%'}
                      marginHorizontal={'1%'}
                      justifyContent={'space-between'}
                      backGroundColor={colors.greyWhite}
                    />
                    <MultiSelect
                      btnWidth={'31%'}
                      interaction
                      handleOnSelect={handleOnSelect}
                      arrayData={filtersInteractionsData}
                      selectedItems={selectedItems}
                      height={windowHeight * 0.049}
                      paddingHorizontal={'7%'}
                      marginHorizontal={'1%'}
                      justifyContent={'space-between'}
                      backGroundColor={colors.greyWhite}
                    />
                    {props.MyMoves ? null : (
                      <MultiSelect
                        btnWidth={'31%'}
                        interaction
                        handleOnSelect={handleOnSelect}
                        arrayData={filtersRequestData}
                        selectedItems={selectedItems}
                        height={windowHeight * 0.049}
                        paddingHorizontal={'5%'}
                        marginHorizontal={'1%'}
                        justifyContent={'space-between'}
                        backGroundColor={colors.greyWhite}
                      />
                    )}
                  </View>
                </View>
              </BottomSheetScrollView>
            ) : (
              <BottomSheetScrollView
                indicatorStyle="black"
                contentContainerStyle={[
                  styles.contentContainer,
                  {backgroundColor: colors.greyWhite},
                ]}
                showsVerticalScrollIndicator={true}>
                <View>
                  <Text>Hello</Text>
                </View>
              </BottomSheetScrollView>
            )}
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default BottomSheetInteraction;
