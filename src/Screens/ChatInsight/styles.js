import {StyleSheet} from 'react-native';
import {ios, android, windowWidth, windowHeight} from '../../utility/size';
import colors from '../../utility/colors';

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  paddingContainer: {
    padding: '4%',
    margin: '5%',
    borderRadius: 12,
    backgroundColor: colors.greyWhite,
  },
  title: {
    marginTop: '7%',
    marginLeft: '3%',
    fontSize: 30,
    fontFamily: 'Inter-Black',
    color: colors.primaryBlue,
  },
  insightContainer: {
    marginVertical: '5%',
    width: windowWidth * 0.7,
    alignSelf: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  iconContainer: {width: 45, height: 45},
  icon: {
    height: '100%',
    width: '100%',
  },
  heading: {
    fontSize: 16,
    color: colors.blackBlue,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 14,
    color: colors.slateGrey,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
});
