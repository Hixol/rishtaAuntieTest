import {Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../../utility/colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default StyleSheet.create({
  myPrivacySetting: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    color: colors.primaryBlue,

    marginVertical: '3%',
  },
  privacySettingContainer: {
    // flex: 1,
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'center',
    // paddingHorizontal: '4%',
    borderRadius: 10,
  },
  basicPreferenceType: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: colors.primaryPink,
    // marginVertical: '1%',
  },
  container: {
    flex: 1,
    marginHorizontal: '2%',
    justifyContent: 'center',
  },
  detailsSec: {
    // height: '80%',
    // backgroundColor: 'red',
    // alignContent: 'center',
    // alignItems: 'center',
    padding: '4%',
  },
  detailsTxt: {
    fontSize: 13,
    color: colors.primaryBlue,
    fontFamily: 'Roboto-Medium',
    marginLeft: '4%',
  },
  kidsCont: {
    marginBottom: '6%',
    marginTop: '2%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: '2%',
  },
  textView: {flexDirection: 'row', backgroundColor: 'white'},
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: '4%',
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
