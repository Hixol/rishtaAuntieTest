import {StyleSheet} from 'react-native';
import {windowWidth} from '../../utility/size';
import colors from '../../utility/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: '2%',
  },
  bar: {
    height: 0.5,
    backgroundColor: colors.vibeMidGrey,
    width: windowWidth,
    alignSelf: 'center',
    marginVertical: 5,
  },
  noFavContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  starContainer: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    backgroundColor: colors.chatGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
  },
  favHeading: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: colors.blackBlue,
    marginBottom: '2%',
  },
  favMsg: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.textGrey1,
    textAlign: 'center',
    lineHeight: 22,
  },
  highlight: {
    backgroundColor: 'rgba(52, 183, 241, 0.5)',
    height: '100%',
    alignSelf: 'center',
    width: windowWidth,
    position: 'absolute',
    zIndex: 1,
    top: -5,
  },
});
