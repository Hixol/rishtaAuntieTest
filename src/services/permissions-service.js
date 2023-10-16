import {
  isOverlayPermissionGranted,
  requestOverlayPermission,
} from 'react-native-can-draw-overlays';
import {Alert} from 'react-native';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
import {android, ios} from '../utility/size';

class PermisisonsService {
  async checkAndRequestDrawOverlaysPermission() {
    if (!android) {
      return true;
    }

    const isGranted = await this.isDrawOverlaysPermisisonGranted();
    if (!isGranted) {
      Alert.alert(
        'Permission required',
        'For accepting calls in background you should provide access to show System Alerts from in background. Would you like to do it now?',
        [
          {
            text: 'Later',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Request',
            onPress: () => {
              this.requestOverlayPermission();
            },
          },
        ],
      );
    }
  }

  async isDrawOverlaysPermisisonGranted() {
    const isGranted = await isOverlayPermissionGranted();
    return isGranted;
  }

  async requestOverlayPermission() {
    const granted = await requestOverlayPermission();
    return granted;
  }

  async getAllPermissions() {
    if (android) {
      requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ]).then(statuses => {});
    } else if (ios) {
      requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
      ]).then(statuses => {});
    }
  }
}

const permisisonsService = new PermisisonsService();
export default permisisonsService;
