import {Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../../utility/colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteGrey,
  },
  deleteText: {
    alignSelf: 'center',
    fontSize: 20,
    fontFamily: 'Inter-Medium',

    color: colors.primaryBlue,
    marginVertical: '3%',
  },
  ViewContainer: {
    backgroundColor: 'white',
    paddingHorizontal: '2%',
    width: windowWidth * 0.95,
    alignSelf: 'center',
    // height: '30%',
    // marginHorizontal: '3%',
    borderRadius: 10,
    marginVertical: '3%',
  },
  feedbackText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  radioBtnRowView: {flexDirection: 'row', alignItems: 'center'},
  optionText: {
    fontFamily: 'Inter-Bold',

    fontSize: 15,
    color: colors.primaryBlue,
  },
  pleaseExplainText: {
    color: colors.primaryBlue,
    fontFamily: 'Inter-Bold',

    fontSize: 18,
    marginBottom: '5%',
  },
  buttonContainer: {
    width: '90%',
    paddingVertical: '3%',
    backgroundColor: '#FFFFFF',
    marginVertical: '5%',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.primaryPink,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',

    color: '#D90368',
  },
  deleteAccountText: {
    color: colors.primaryBlue,
    fontFamily: 'Inter-Bold',

    fontSize: 16,
    alignSelf: 'center',
    // marginBottom: '5%'
  },
  container1: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: '2%',
  },
  radioText: {
    marginLeft: '3%',
    fontSize: 16,
    color: colors.primaryBlue,
    fontFamily: 'Inter-Medium',
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 100,

    alignItems: 'center',
    justifyContent: 'center',
  },

  horizontalLine: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.softGrey,
    marginVertical: '2%',
    backgroundColor:colors.softGrey
  },
});
