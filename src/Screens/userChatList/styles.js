import {StyleSheet} from 'react-native';
import colors from '../../utility/colors';

export default StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textGrey,
    marginVertical: 5,
  },
});
