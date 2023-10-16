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
  promptHeading: {
    fontFamily: 'Roboto-Regular',
    color: colors.primaryBlue,
    marginTop: '5%',
  },
  addPromptView: {
    backgroundColor: colors.white,
    marginVertical: '5%',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPromptButton: {
    alignSelf: 'center',

    paddingVertical: '3%',
    paddingHorizontal: '14%',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradePrompt: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.primaryPink,
    marginVertical: '5%',
    marginBottom: '10%',
  },
  addPromptText: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: colors.primaryPink,
  },
  headingSec: {
    width: '85%',
    alignItems: 'center',
    marginBottom: '7%',
  },
  selectionHeading: {
    fontFamily: 'Roboto-Medium',
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
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: colors.white,
    height: windowHeight * 0.053,
    width: windowWidth * 0.85,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: '10%',
    borderColor: colors.primaryPink,
    borderWidth: 1.5,
  },
  saveTxt: {
    color: colors.primaryPink,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
});
