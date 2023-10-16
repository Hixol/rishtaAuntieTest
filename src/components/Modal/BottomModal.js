import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {ios, windowHeight, windowWidth} from '../../utility/size';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useHelper} from '../../hooks/useHelper';

import colors from '../../utility/colors';
import Icons from '../../utility/icons';
import MultiVibesSelect from '../MultiSelect/MultiSelect';
import Button from '../buttons/Button';
import MultiSelect from 'react-native-multiple-select';
import FlatListIndicator from '../ScrollIndicator';

const PromptsHeader = ({chosenPool}) => (
  <>
    <Text style={styles.promptTxt}>Prompts Pool</Text>
    <Text style={styles.promptTagline}>
      Make your profile stand out with some interesting profile prompts!
    </Text>
    <Text style={styles.selectedPrompts}>{chosenPool.length}/3 Selected</Text>
  </>
);

const VibesHeader = ({selectedItems}) => (
  <>
    <Text style={[styles.vibesHeading, {fontSize: 24}]}>
      What are your vibes?
    </Text>
    <Text style={[styles.vibesHeading, {fontSize: 16}]}>
      Select the personality traits that express you
    </Text>
    <Text style={[styles.vibesHeading, {fontSize: 40}]}>
      {selectedItems.length}/10
    </Text>
  </>
);

const BottomModal = ({
  toggle,
  pool,
  prompts,
  vibes,
  vibesList,
  snap,
  dropdownTitle,
  array,
  single = false,
  handleDropdownVal,
  handleVibesVal,
  handlePoolVal,
}) => {
  const {Alerts} = useHelper();

  const bottomSheetModalRef = useRef(null);
  let multiSelectRef = useRef(null);
  const poolRef = useRef(null);
  const snapPoints = useMemo(() => ['80%'], []);

  let indicator = new Animated.Value(0);
  const [visibleHeight, setVisibleHeight] = useState(0);
  const [wholeHeight, setWholeHeight] = useState(1);
  const [chosenPool, setChosenPool] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handlePromptsPool = item => {
    if (chosenPool.includes(item)) {
      setChosenPool(prevState => prevState.filter(el => el != item));
    } else if (chosenPool.length < 3) {
      setChosenPool(prevState => [...prevState, item]);
    }
  };

  const onNext = type => {
    if (type == 'vibes') {
      if (selectedItems.length === 0) {
        Alerts('error', 'Please select vibes!');
      } else {
        handleVibesVal(selectedItems);
      }
    } else if (type == 'pool') {
      if (chosenPool.length === 0) {
        Alerts('error', 'Please select prompts pool!');
      } else if (chosenPool.length < 3) {
        Alerts('error', 'Please select at least three prompts pool!');
      } else {
        handlePoolVal(chosenPool);
      }
    }
  };

  const ProfilePrompts = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => handlePromptsPool(item)}
        style={styles.promptContainer}>
        <Text
          style={[
            {
              color: chosenPool.includes(item)
                ? colors.primaryPink
                : colors.darkBlue,
            },
            styles.promptTitle,
          ]}>
          {item.title}
        </Text>
        {chosenPool.includes(item) ? (
          <View style={styles.checkCircle}>
            <Icons.Feather name="check" size={14} color={colors.primaryPink} />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const MyVibes = () => (
    <View style={styles.vibesSection}>
      <MultiVibesSelect
        handleOnSelect={handleOnSelect}
        arrayData={vibesList}
        selectedItems={selectedItems}
        height={windowHeight * 0.055}
        paddingHorizontal={'4%'}
        marginHorizontal={'1%'}
        justifyContent={'flex-start'}
        backGroundColor={colors.white}
      />
    </View>
  );

  const DropDown = useCallback(
    ({title, array}) => {
      const [selectedVals, setSelectedVals] = useState([]);
      const onSelectedItemsChange = selectedItems => {
        setSelectedVals(selectedItems);
        handleDropdownVal(selectedItems);
      };

      useEffect(() => {
        setSelectedVals([]);
        handleDropdownVal([]);
      }, [title]);

      return (
        <>
          <Text style={styles.dropdownTitle}>{title}</Text>
          <MultiSelect
            single={single}
            hideTags
            items={array}
            uniqueKey="name"
            ref={component => {
              multiSelectRef = component;
            }}
            hideDropdown={true}
            hideSubmitButton
            textInputProps={{autoFocus: false}}
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedVals}
            searchInputPlaceholderText="Search Items..."
            selectedItemTextColor={colors.primaryPink}
            selectedItemIconColor={colors.primaryPink}
            itemTextColor={colors.black}
            displayKey="name"
            styleIndicator={{display: 'none'}}
            searchInputStyle={{color: colors.black}}
            flatListProps={{
              keyboardShouldPersistTaps: 'handled',
            }}
            styleSelectorContainer={{paddingBottom: 0}}
            styleListContainer={{backgroundColor: colors.white}}
            styleRowList={{
              paddingVertical: '1.5%',
              alignSelf: 'center',
              width: '85%',
              borderBottomWidth: 1,
              borderBottomColor: colors.vibeLightGrey,
              backgroundColor: colors.white,
            }}
          />
        </>
      );
    },
    [dropdownTitle],
  );

  useEffect(() => {
    if (toggle == true) {
      bottomSheetModalRef.current?.present();
    } else if (toggle == false) {
      bottomSheetModalRef.current?.close();
    }
  }, [pool, vibes, dropdownTitle]);

  const handleOnSelect = items => {
    setSelectedItems(items);
  };

  const handleSheetChanges = index => {};

  const indicatorSize =
    wholeHeight > visibleHeight
      ? (visibleHeight * visibleHeight) / wholeHeight
      : visibleHeight;
  const difference =
    visibleHeight > indicatorSize && visibleHeight < 430 && windowHeight < 800
      ? indicatorSize + 120
      : visibleHeight > indicatorSize &&
        visibleHeight < 445 &&
        windowHeight < 800
      ? visibleHeight - indicatorSize - 20
      : wholeHeight > 850 && wholeHeight < 900
      ? 180
      : visibleHeight > indicatorSize && windowHeight > 800
      ? visibleHeight - indicatorSize
      : 1;

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        marginTop: vibes || pool ? -135 : 0,
      }}>
      <BottomSheetModalProvider>
        <BottomSheetModal
          keyboardBehavior={ios ? 'extend' : 'interactive'}
          keyboardBlurBehavior="restore"
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          backgroundStyle={{
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            backgroundColor: vibes ? colors.greyWhite : colors.white,
          }}
          handleIndicatorStyle={{backgroundColor: colors.primaryPink}}
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snap ? snap : snapPoints}
          onChange={handleSheetChanges}>
          <View style={styles.sheetView(vibes)}>
            {pool && prompts.length > 0 && (
              <PromptsHeader chosenPool={chosenPool} />
            )}
            {vibes && vibesList.length > 0 && (
              <VibesHeader selectedItems={selectedItems} />
            )}
          </View>
          {dropdownTitle && array && (
            <DropDown title={dropdownTitle} array={array} />
          )}

          <BottomSheetScrollView
            nestedScrollEnabled={true}
            ref={poolRef}
            contentContainerStyle={[
              styles.contentContainer,
              {backgroundColor: vibes ? colors.greyWhite : null},
            ]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={(width, height) => {
              setWholeHeight(height);
            }}
            onLayout={({nativeEvent}) =>
              setVisibleHeight(nativeEvent.layout.height)
            }
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: indicator}}}],
              {useNativeDriver: false},
            )}
            scrollEventThrottle={16}>
            {pool &&
              prompts.length > 0 &&
              prompts.map((item, index) => (
                <>
                  <ProfilePrompts item={item} />
                  {index == prompts.length - 1 ? null : (
                    <View style={styles.bottomBar}></View>
                  )}
                </>
              ))}

            {vibes && vibesList.length > 0 && <MyVibes />}
          </BottomSheetScrollView>
          {vibes || pool ? (
            <Button
              onPress={() => (vibes ? onNext('vibes') : onNext('pool'))}
              YesNoBtn
              title="NEXT"
              YesNoBtnStyle={{
                position: 'absolute',
                bottom: 10,
                width: windowWidth * 0.9,
              }}
            />
          ) : null}
          {pool || vibes ? (
            <FlatListIndicator
              type={vibes ? 'vibes' : 'pool'}
              difference={difference}
              indicator={indicator}
              visibleHeight={visibleHeight}
              wholeHeight={wholeHeight}
            />
          ) : null}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  sheetView: vibes => ({
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: vibes ? colors.greyWhite : colors.white,
  }),

  contentContainer: {flexGrow: 1, alignItems: 'center', paddingBottom: '15%'},

  promptTxt: {
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    color: colors.darkBlue,
    marginBottom: 12,
  },
  promptTagline: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: colors.darkBlue,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  selectedPrompts: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: colors.darkBlue,
    marginVertical: '5%',
  },
  bottomBar: {
    height: 1,
    backgroundColor: colors.vibeLightGrey,
    width: '70%',
    marginVertical: 4,
  },
  promptContainer: {
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    flexDirection: 'row',
  },
  promptTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  checkCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 17,
    height: 17,
    borderRadius: 17 / 2,
    backgroundColor: '#d903684d',
  },
  // My Vibes
  vibesContainer: {
    flex: 1,
    backgroundColor: colors.greyWhite,
    alignItems: 'center',
  },
  vibesHeading: {
    fontFamily: 'Roboto-Regular',
    color: colors.primaryBlue,
    marginTop: '5%',
  },
  vibesSection: {
    width: '100%',
    paddingHorizontal: '2%',
    marginVertical: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdownTitle: {
    color: colors.darkBlue,
    fontSize: 18,
    fontFamily: 'Roboto-Black',
    textAlign: 'center',
    padding: '3.5%',
  },

  indicatorContainerStyle: {
    backgroundColor: colors.vibeLightGrey,
    overflow: 'visible',
    width: 2,
  },
  scrollIndicatorStyle: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: colors.primaryPink,
  },
});
