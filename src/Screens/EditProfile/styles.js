import {Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../../utility/colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.greyWhite,
  },
  imgSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: '10%',
    backgroundColor: colors.white,
    height: windowHeight * 0.46,
    width: windowWidth * 0.93,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0.4,
    elevation: 5,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  middleSec: {
    width: windowWidth * 0.93,
    backgroundColor: colors.white,
    marginVertical: '4%',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0.4,
    elevation: 3,
  },
  detailsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    paddingVertical: '3%',
  },
  detailTxt: {
    color: colors.primaryBlue,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  arrowIconView: {
    width: '10%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: '1%',
  },
  arrowIconImage: {width: '100%', height: 15},
  btn: {
    flexDirection: 'row',
    height: windowHeight * 0.055,
    width: windowWidth * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2%',
    marginBottom: '6%',
    alignSelf: 'center',
    borderRadius: 50,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primaryPink,
  },
  txtStyle: {
    color: colors.primaryPink,
    fontFamily: 'Roboto-Bold',
    fontSize: windowHeight * 0.022,
  },
  cardBackground: {
    backgroundColor: '#00000061',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
