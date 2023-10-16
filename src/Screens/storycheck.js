import React, {useEffect, useMemo, useRef} from 'react';
import {View, StyleSheet} from 'react-native';

import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import colors from '../utility/colors';

const StoryCheck = props => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['80%'], []);

  useEffect(() => {
    if (props.showModal == true) {
      bottomSheetModalRef.current?.present();
    } else if (props.showModal == false) {
      bottomSheetModalRef.current?.close();
    }
  }, [props.showModal]);

  // callbacks
  const handleSheetChanges = () => {};

  // renders
  return (
    <View style={styles.container}>
      <BottomSheetModalProvider>
        <View
          style={{
            flex: 1,
          }}>
          <BottomSheetModal
            backgroundStyle={{
              backgroundColor: colors.greyWhite,
            }}
            handleIndicatorStyle={{backgroundColor: colors.primaryPink}}
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <BottomSheetScrollView
              indicatorStyle="black"
              contentContainerStyle={[
                styles.contentContainer,
                {backgroundColor: colors.greyWhite},
              ]}
              showsVerticalScrollIndicator={true}></BottomSheetScrollView>
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

export default StoryCheck;
