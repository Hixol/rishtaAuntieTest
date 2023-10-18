import {Platform, StyleSheet, Dimensions} from 'react-native';
import colors from '../../utility/colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.white
  },
  headerContainer: {
    position: 'absolute',
    width: '100%',
    height: '30%',
    backgroundColor: '#161616',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {color: 'white', fontSize: 25},
  userEmail: {color: 'white', fontSize: 12},
  userImageView: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: 'red',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '40%',
    elevation: 5,
  },
  userImage: {width: 100, height: 100, borderRadius: 100 / 2},
  footerContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: '8%',
  },
  dataView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%',
  },
  iconView: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161616',
  },
  optionText: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',

    color: '#161616',
    marginLeft: '7%',
  },
  userName: {alignItems: 'center', paddingVertical: '1%'},
});
