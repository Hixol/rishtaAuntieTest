import {StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  imgHeader: {
    position: 'absolute',
    padding: '3%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  imgFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: '6%',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '17%',
    justifyContent: 'space-between',
  },
  name: {
    marginLeft: '5%',
    fontSize: 15,
    color: 'white',
    fontFamily: 'Roboto-Medium',

    width: '81%',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '34%',
  },
  lastFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '6%',
  },
  circularImg: {
    backgroundColor: 'white',
    height: windowHeight * 0.075,
    width: windowWidth * 0.156,
    alignSelf: 'flex-end',
    borderRadius: 50,
    marginRight: '5%',
    borderWidth: 1.3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.02,
  },
  skelHeart: {
    height: windowHeight * 0.055,
    width: windowWidth * 0.1,
    borderRadius: 5,
  },
  skelDots: {
    height: windowHeight * 0.055,
    width: windowWidth * 0.05,
    borderRadius: 5,
  },
  skelLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: windowHeight * 0.027,
  },
  skelFlag: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.15,
    borderRadius: 5,
  },
  skelArea: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.3,
    borderRadius: 5,
  },
  skelProf: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.16,
    borderRadius: 5,
  },
  skelDesc: {
    height: windowHeight * 0.025,
    width: windowWidth * 0.6,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: windowHeight * 0.027,
  },
  skelName: {
    height: windowHeight * 0.04,
    width: windowWidth * 0.35,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: windowHeight * 0.027,
  },
  skelPic: {
    height: windowHeight * 0.1,
    width: windowHeight * 0.1,
    borderRadius: 100,
    alignSelf: 'flex-end',
  },
});
