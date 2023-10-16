import {StyleSheet} from 'react-native';
import {windowWidth} from '../../utility/size';
import colors from '../../utility/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  detailsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '3%',
  },
  detailTxt: {
    color: '#374151',
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  actionItemsView: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    paddingVertical: '3%',
    borderRadius: 10,
    paddingHorizontal: '5%',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: '5%',
  },
  horizontalLine: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#EBECEF',
    marginVertical: '2%',
  },
});
