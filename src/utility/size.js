import {Platform, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const screenHeight = Dimensions.get('screen').height;

const ios = Platform.OS == 'ios';
const android = Platform.OS == 'android';
const OS_VER = Platform.constants.Release;

const userDevice = DeviceInfo.getModel();

export {
  windowHeight,
  windowWidth,
  screenHeight,
  ios,
  android,
  OS_VER,
  userDevice,
};
