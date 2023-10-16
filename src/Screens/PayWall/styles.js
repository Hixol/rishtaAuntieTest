import {StyleSheet} from 'react-native';
import colors from '../../utility/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  topContainer: {
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h2: {
    marginTop: '3%',
    marginBottom: '2%',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
    color: colors.gold,
  },
  h3: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    letterSpacing: 3,
    textTransform: 'capitalize',
  },
  headingWrap: {
    alignItems: 'center',
    padding: 4,
    borderRadius: 6,
    marginVertical: '3%',
  },
  premiumTxt: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.vibeMidGrey,
  },
  title: {
    fontWeight: 'bold',
    color: colors.black,
    fontSize: 16,
  },
  txt: {
    lineHeight: 22,
    fontWeight: '600',
    color: colors.vibeMidGrey,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mt: {
    marginTop: 4,
  },
  ml: {
    marginLeft: 8,
  },

  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '4%',
    flexWrap: 'wrap',
  },
  banner: {
    width: '31%',
    padding: 4,
    height: 300,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerOne: {
    backgroundColor: colors.lightSuccess,
  },
  bannerTwo: {
    backgroundColor: colors.success,
  },
  bannerThree: {
    backgroundColor: colors.danger,
  },
});
