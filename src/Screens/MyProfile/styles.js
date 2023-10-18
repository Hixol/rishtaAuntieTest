import {StyleSheet, Dimensions} from 'react-native';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

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
    fontFamily: 'Inter-Medium',

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
});
