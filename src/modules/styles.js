import {StyleSheet} from 'react-native';
import {CARDWIDTH} from '../constants/Constants';
import colors from '../utility/colors';

export default StyleSheet.create({
  container: {
    width: CARDWIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageView: {width: '15%', marginLeft: '3%'},
  headingText: {
    alignSelf: 'center',
    minWidth: '70%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    color: colors.blackBlue,
    fontFamily: 'Inter-Medium',
    marginLeft: 5,
    alignSelf: 'center',
  },
  textcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  MainView: {
    width: CARDWIDTH - 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '2%',
    paddingBottom: '10%',
    marginTop: '2%',
    marginHorizontal: 20,
  },
  divider: {
    backgroundColor: '#C8C8C8',
    width: CARDWIDTH - 40,
  },
  firsttext: {
    color: '#C8C8C8',
    fontSize: 15,
  },
  secondtext: {
    color: '#0F3577',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
});
