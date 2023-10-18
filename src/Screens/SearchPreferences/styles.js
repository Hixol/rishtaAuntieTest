import {Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../../utility/colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default StyleSheet.create({
  myPrivacySetting: {
    alignSelf: 'center',
    fontSize: 24,
    fontFamily: 'Inter-Medium',
    color: colors.primaryBlue,
  },
  SearchPreferencesView: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: '5%',
  },
  iconImage: {width: '10%', height: 40, marginHorizontal: '2%'},
  privacySettingStyle: {color: colors.primaryPink},
  disableButton: {
    paddingHorizontal: '3%',
    backgroundColor: colors.primaryPink,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2%',
    marginVertical: '1%',
    alignSelf: 'center',
    borderRadius: 40,
  },
  basicPreferenceType: {
    fontSize: 24,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginVertical: '1%',
    marginTop: '5%',
  },
  premiumPreferenceType: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Inter-Medium',

    marginVertical: '2%',
  },
  enableDisableButton: {
    paddingHorizontal: '3%',
    backgroundColor: colors.primaryPink,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '4%',
    marginVertical: '3%',
    alignSelf: 'center',
    borderRadius: 15,
    width: '100%',
  },
  preferenceType: {
    paddingHorizontal: '3%',
    backgroundColor: colors.primaryPink,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2%',
    marginVertical: '1%',
    alignSelf: 'center',
    borderRadius: 40,
  },
  container: {
    width: '95%',
    borderRadius: 10,
    marginHorizontal: '5%',
    alignSelf: 'center',
    paddingVertical: '5%',
    backgroundColor: colors.white,
  },

  actionItemsView: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    paddingVertical: '3%',
    borderRadius: 10,
    paddingHorizontal: '5%',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginVertical:'3%'
  },

  privacySettingType: {
    alignSelf: 'center',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.primaryPink,
  },
  toggleOptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '5%',

    alignItems: 'center',
  },
  toggleOptionText: {
    fontSize: 17,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Bold',
  },
  toggleOptionTaglineView: {
    marginHorizontal: '5%',
    marginTop: '1%',
  },
  horizontalLine: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.softGrey,
    backgroundColor: colors.softGrey,
    marginVertical: '3%',
  },
  toggleOptionTaglineText: {fontSize: 13, color: colors.mediumGrey},
});
