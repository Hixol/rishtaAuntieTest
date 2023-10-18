import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../utility/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyWhite,
    alignItems: 'center',
  },
  vibesHeading: {
    fontFamily: 'Inter-Regular',
    color: colors.primaryBlue,
    marginTop: '5%',
  },
  vibesSection: {
    width: '100%',
    paddingHorizontal:'2%',
    marginVertical: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionHeading: {
    fontFamily: 'Inter-Medium',
    color: colors.primaryBlue,
    fontSize: 18,
  },
  selectionSec: {
    marginVertical: '8%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btn: {
    height: windowHeight * 0.049,
    paddingHorizontal: '6%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.white,
    margin: '1.5%',
  },
  btnTxt: {
    color: 'black',
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: colors.white,
    height: windowHeight * 0.058,
    width: windowWidth * 0.94,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: '15%',
    borderColor: colors.primaryPink,
    borderWidth: 1.5,
  },
  saveTxt: {
    color: colors.primaryPink,
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },
});
