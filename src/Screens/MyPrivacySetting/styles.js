import {Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../../utility/colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default StyleSheet.create({
  myPrivacySetting: {
    alignSelf: 'center',
    fontSize: 22,
    fontFamily: 'Inter-Medium',

    color: colors.primaryBlue,
    marginVertical: '5%',
  },
  privacySettingStyle: {color: colors.primaryPink},
  container: {
    width: '95%',
    borderRadius: 10,
    marginHorizontal: '5%',
    alignSelf: 'center',
    paddingVertical: '5%',
    backgroundColor: colors.white,
  },
  privacySettingContainer: {
    width: '95%',
    borderRadius: 10,
    marginHorizontal: '5%',
    alignSelf: 'center',
    paddingVertical: '2%',
    backgroundColor: colors.white,
  },
  actionItemsView: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    paddingVertical: '5%',
    borderRadius: 10,
    paddingHorizontal: '5%',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: '2%',
  },
  basicPreferenceType: {
    fontSize: 24,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginVertical: '1%',
    marginTop: '5%',
  },
  privacySettingType: {
    alignSelf: 'center',
    fontSize: 18,
    fontFamily: 'Inter-Bold',

    color: '#374151',
  },
  toggleOptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: '5%',

    alignItems: 'center',
    marginVertical:'1%'
  },
  toggleOptionText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  toggleOptionTaglineView: {
    marginTop: '1%',
  },
  arrowIconView: {
    width: '10%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: '1%',
  },
  arrowIconImage: {width: '100%', height: 15},
  horizontalLine: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: colors.softGrey,
    backgroundColor: colors.softGrey,
    marginVertical: '5%',
  },
  toggleOptionTaglineText: {fontSize: 13, color: colors.textGrey},
});
