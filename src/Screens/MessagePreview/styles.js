import {StyleSheet} from 'react-native';
import {windowWidth, windowHeight, ios} from '../../utility/size';
import colors from '../../utility/colors';

export default StyleSheet.create({
  videoWrapper: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
  },
  crossIcon: {
    position: 'absolute',
    top: ios ? 50 : 30,
    right: 10,
    zIndex: 1,
  },
});
