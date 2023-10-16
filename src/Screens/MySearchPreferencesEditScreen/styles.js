import {StyleSheet} from 'react-native';
import colors from '../../utility/colors';

export default StyleSheet.create({
  myPrivacySetting: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    color: colors.primaryBlue,

    marginVertical: '3%',
  },
  privacySettingContainer: {
    backgroundColor: colors.white,
    paddingVertical: '5%',
    width: '100%',
    paddingHorizontal: '2%',
    borderRadius: 10,
  },
  basicPreferenceType: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: colors.primaryPink,
    marginVertical: '2%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: '2%',
  },
  detailsSec: {
    // height: '80%',
    // backgroundColor: 'red',
    // alignContent: 'center',
    // alignItems: 'center',
    padding: '4%',
  },
  detailsTxt: {
    alignSelf: 'center',
    fontSize: 16,
    color: colors.primaryBlue,
    fontFamily: 'Roboto-Medium',
  },
  kidsCont: {
    marginBottom: '6%',
    marginTop: '2%',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: '2%',
  },
  YesNoBtnStyle: {
    width: '48%',
    borderColor: colors.primaryBlue,
  },
  btnTitleStyle: {
    color: colors.primaryBlue,
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
  },
});
