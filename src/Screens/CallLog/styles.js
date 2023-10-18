import {StyleSheet} from 'react-native';
import {ios} from '../../utility/size';
import colors from '../../utility/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: 12,
  },
  heading: {
    fontFamily: 'Inter-Black',
    fontSize: 32,
    color: '#303234',
    marginBottom: 12,
    marginTop: ios ? -40 : 0,
  },
  sub_heading: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textGrey,
    marginVertical: 5,
  },
  list_container: {
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar_container: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight: 12,
    overflow: 'hidden',
  },
  image: {width: '100%', height: '100%'},
  nameTxt: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  greyedTxt: {
    color: colors.textGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  nolog_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.9,
  },
  nolog_bg: {
    backgroundColor: colors.softGrey,
    width: 180,
    height: 180,
    borderRadius: 180 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nologTxt: {color: 'black', fontFamily: 'Inter-Regular', fontSize: 14},
});
