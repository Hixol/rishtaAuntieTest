import {StyleSheet} from 'react-native';
import {ios, windowHeight} from '../../utility/size';
import colors from '../../utility/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  welcomeText: {
    color: colors.primaryBlue,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginVertical: '3%',
    alignSelf: 'center',
  },
  listView: {
    marginHorizontal: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  noBlogContainer: {
    flex: 1,
    marginTop: ios ? windowHeight / 2.9 : windowHeight / 2.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBlogTxt: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    color: colors.primaryBlue,
  },
});
