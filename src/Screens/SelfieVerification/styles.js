import {Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../../utility/colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softGrey,
  },
  innerContainer: {flex: 1, padding: 12, justifyContent: 'space-between'},
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    width: '100%',
    padding: 12,
  },
  innerCard: {
    width: 160,
    height: 250,
    alignSelf: 'center',
    alignItems: 'center',
  },
  selfieComp: {
    width: '100%',
    height: '90%',
    backgroundColor: colors.softGrey,
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {color: colors.darkBlue, fontFamily: 'Inter-Medium', fontSize: 16},
  tagline: {
    marginTop: 14,
    color: colors.darkBlue,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    width: '85%',
    textAlign: 'center',
  },
  preview: {
    width: 180,
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
});
