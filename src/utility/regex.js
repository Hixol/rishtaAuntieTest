import {Alert, Linking, PermissionsAndroid} from 'react-native';
import {
  check,
  request,
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
} from 'react-native-permissions';
import {ios} from './size';

import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';

const imgExtensions = /jpg|png|jpeg/;
const videoExtension = /mp4|mov|MOV|quicktime/;
const audioExtension = /aac|m4a/;

export const directory = {
  checkPermission: () => {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
  },
  checkAudioPermission: () => {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
  },

  checkDirectory: path => {
    return RNFetchBlob.fs.isDir(path);
  },

  makeNewDirectory: path => {
    return RNFetchBlob.fs.mkdir(path);
  },
};

export const alerts = (type, msg) => {
  const msgType = {
    success: 'Success',
    info: 'Info',
    error: 'Error',
  };

  Toast.show({
    type: type,
    text1: msgType[type],
    text2: msg,
    visibilityTime: 2500,
    topOffset: ios ? 40 : 10,
  });
};

export const handlePermissions = {
  callAlert: type => {
    Alert.alert(
      'Permission Required!',
      `Please enable ${type} permission.`,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Enable',
          onPress: () => Linking.openSettings(),
        },
      ],
      {cancelable: false},
    );
  },

  callToast: type => {
    alerts('error', `The ${type} feature is not available on this device.`);
  },

  blockedMultiplePermissions: (statuses, permissions) => {
    if (statuses[permissions[0]] == 'blocked') {
      handlePermissions.callAlert('camera');
    }
    if (statuses[permissions[1]] == 'blocked') {
      // handlePermissions.callAlert('gallery');
    }
    if (statuses[permissions[2]] == 'blocked') {
      handlePermissions.callAlert('microphone');
    }
    if (statuses[permissions[3]] == 'blocked') {
      // handlePermissions.callAlert('location');
    }
  },

  checkMultiplePermissions: (permissions, type = '', callback) => {
    if (Array.isArray(permissions)) {
      checkMultiple(permissions).then(statuses => {
        console.log('🚀 REGEX checkMultiplePermissions statuses', statuses);
        if (
          statuses[permissions[0]] == 'denied' ||
          statuses[permissions[1]] == 'denied' ||
          statuses[permissions[2]] == 'denied' ||
          statuses[permissions[3]] == 'denied'
        ) {
          handlePermissions.requestMultiplePermissions(
            permissions,
            type,
            callback,
          );
        } else if (
          statuses[permissions[0]] == 'blocked' ||
          statuses[permissions[1]] == 'blocked' ||
          statuses[permissions[2]] == 'blocked' ||
          statuses[permissions[3]] == 'blocked'
        ) {
          handlePermissions.blockedMultiplePermissions(statuses, permissions);
        } else if (
          statuses[permissions[0]] == 'granted' ||
          statuses[permissions[1]] == 'granted' ||
          statuses[permissions[2]] == 'granted' ||
          statuses[permissions[3]] == 'granted'
        ) {
          callback('granted');
        }
      });
    } else {
      check(permissions).then(status => {
        if (status == 'denied') {
          request(permissions).then(res => {
            if (res == 'granted') {
              callback(res);
            } else if (res == 'blocked') {
              handlePermissions.callAlert(type);
            } else if (res == 'limited') {
              handlePermissions.callAlert('full gallery access');
            } else if (res == 'unavailable') {
              handlePermissions.callToast(type);
            }
          });
        } else if (status == 'granted') {
          callback(status);
        } else if (status == 'blocked') {
          handlePermissions.callAlert(type);
        } else if (status == 'limited') {
          handlePermissions.callAlert('full gallery access');
        }
      });
    }
  },

  requestMultiplePermissions: (permissions, type, callback) => {
    if (Array.isArray(permissions)) {
      requestMultiple(permissions).then(statuses => {
        console.log('🚀 REGEX requestMultiplePermissions statuses', statuses);
        if (
          statuses[permissions[0]] == 'denied' ||
          statuses[permissions[1]] == 'denied' ||
          statuses[permissions[2]] == 'denied' ||
          statuses[permissions[3]] == 'denied'
        ) {
          callback('denied');
        } else if (
          statuses[permissions[0]] == 'blocked' ||
          statuses[permissions[1]] == 'blocked' ||
          statuses[permissions[2]] == 'blocked' ||
          statuses[permissions[3]] == 'blocked'
        ) {
          handlePermissions.blockedMultiplePermissions(statuses, permissions);
        } else if (
          statuses[permissions[0]] == 'granted' ||
          statuses[permissions[1]] == 'granted' ||
          statuses[permissions[2]] == 'granted' ||
          statuses[permissions[3]] == 'granted'
        ) {
          callback('granted');
        }

        if (statuses[permissions[0]] == 'unavailable') {
          handlePermissions.callToast('camera');
        }
        if (statuses[permissions[1]] == 'unavailable') {
          handlePermissions.callToast('gallery');
        }
        if (statuses[permissions[2]] == 'unavailable') {
          handlePermissions.callToast('microphone');
        }
        if (statuses[permissions[3]] == 'unavailable') {
          handlePermissions.callToast('location');
        }
      });
    } else {
      request(permissions).then(status => {
        if (status == 'denied') {
          request(permissions).then(res => {
            if (res == 'granted') {
              callback(res);
            } else if (res == 'blocked') {
              handlePermissions.callAlert(type);
            } else if (res == 'limited') {
              handlePermissions.callAlert('full gallery access');
            } else if (res == 'unavailable') {
              handlePermissions.callToast(type);
            }
          });
        } else if (status == 'granted') {
          callback(status);
        } else if (status == 'blocked') {
          handlePermissions.callAlert(type);
        } else if (status == 'limited') {
          handlePermissions.callAlert('full gallery access');
        } else if (status == 'unavailable') {
          handlePermissions.callToast(type);
        }
      });
    }
  },

  handleAndroid13BlockedPermissions: status => {
    console.log('🚀 [HandleAndroid13BlockedPermissions]', status);
    if (status[PERMISSIONS.ANDROID.CAMERA] === 'blocked') {
      handlePermissions.callAlert('camera');
    } else if (status[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] === 'blocked') {
      handlePermissions.callAlert('photos and media');
    } else if (status[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === 'blocked') {
      handlePermissions.callAlert('videos and media');
    } else if (status[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'blocked') {
      handlePermissions.callAlert('audio');
    } else if (
      status[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === 'blocked'
    ) {
      handlePermissions.callAlert('location');
    }
  },

  checkAndroid13Permissions: (permissions, type = '', callback = null) => {
    if (Array.isArray(permissions)) {
      checkMultiple(permissions).then(checkStatus => {
        console.log('🚀 [CheckAndroid13Permissions][Status]', checkStatus);
        handlePermissions.requestAndroid13Permissions(
          permissions,
          type,
          callback,
        );
        handlePermissions.handleAndroid13BlockedPermissions(checkStatus);
      });
    } else {
      handlePermissions.requestSinglePermission(permissions, type, callback);
    }
  },

  requestSinglePermission: (permission, type, callback) => {
    request(permission).then(requestStatus => {
      if (requestStatus === 'denied') {
        request(permission).then(res => callback('granted'));
      } else if (requestStatus === 'granted') {
        callback('granted');
      } else if (requestStatus === 'blocked') {
        handlePermissions.callAlert(type);
      } else if (requestStatus === 'limited') {
        alerts('error', `Please give ${type} full access`);
      } else if (requestStatus === 'unavailable') {
        handlePermissions.callToast(type);
      }
    });
  },

  requestAndroid13Permissions: (permissions, type, callback) => {
    if (Array.isArray(permissions)) {
      requestMultiple(permissions).then(requestStatus => {
        console.log('🚀 [RequestAndroid13Permissions][Status]', requestStatus);
        handlePermissions.handleAndroid13BlockedPermissions(requestStatus);
      });
    } else {
      handlePermissions.requestSinglePermission(permissions, type, callback);
    }
  },

  handleAndroidBlockedPermissions: status => {
    console.log('🚀 [HandleAndroidBlockedPermissions]', status);
    if (status[PERMISSIONS.ANDROID.CAMERA] === 'blocked') {
      handlePermissions.callAlert('camera');
    } else if (
      status[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'blocked'
    ) {
      handlePermissions.callAlert('photos and media');
    } else if (status[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'blocked') {
      handlePermissions.callAlert('audio');
    } else if (
      status[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === 'blocked'
    ) {
      handlePermissions.callAlert('location');
    }
  },

  checkAndroidPermissions: (permissions, type = '', callback = null) => {
    if (Array.isArray(permissions)) {
      checkMultiple(permissions).then(checkStatus => {
        console.log('🚀 [CheckAndroidPermissions][Status]', checkStatus);
        handlePermissions.requestAndroidPermissions(
          permissions,
          type,
          callback,
        );
        handlePermissions.handleAndroidBlockedPermissions(checkStatus);
      });
    } else {
      handlePermissions.requestSinglePermission(permissions, type, callback);
    }
  },

  requestAndroidPermissions: (permissions, type, callback) => {
    if (Array.isArray(permissions)) {
      requestMultiple(permissions).then(requestStatus => {
        console.log('🚀 [RequestAndroidPermissions][Status]', requestStatus);
        handlePermissions.handleAndroidBlockedPermissions(requestStatus);
      });
    } else {
      handlePermissions.requestSinglePermission(permissions, type, callback);
    }
  },
};

export const getTypeForApi = objType => {
  if (imgExtensions.test(objType)) {
    return 'PICTURE';
  } else if (videoExtension.test(objType)) {
    return 'VIDEO';
  } else if (audioExtension.test(objType)) {
    return 'VOICE_NOTE';
  }
};

export const checkExtension = msg => {
  if (imgExtensions.test(msg)) {
    return 'Photo';
  } else if (videoExtension.test(msg)) {
    return 'Video';
  } else if (audioExtension.test(msg)) {
    return 'Audio';
  } else {
    return msg;
  }
};

const checkInteractionType = interactionType => {
  if (interactionType === 'LIKE') return 'liked';
  else if (interactionType === 'COMMENT') return 'commented on';
  else return 'left a voice note on';
};

const checkInteractionMediaExt = mediaType => {
  if (mediaType === 'image') return 'picture';
  else if (mediaType === 'video') return 'discover video';
  else return 'prompt';
};

export const checkInteractionStatement = (
  userId,
  firstInteraction,
  otherUserName,
) => {
  let type = checkInteractionType(firstInteraction?.type);
  let ext = checkInteractionMediaExt(firstInteraction?.resource?.type);
  if (userId == firstInteraction?.userId) {
    return `You ${type} ${ext}`;
  } else {
    return `${otherUserName} ${type} your ${ext}`;
  }
};

export const measureUnits = {
  convertCentimetertoFeetAndInches: cm => {
    var realFeet = (cm * 0.3937) / 12;
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    return `${feet}.${inches}`;
  },

  convertFeetAndInchesToCentimeters: (feet, inches) => {
    return parseFloat((feet * 12 + inches) * 2.54).toFixed(0);
  },

  convertFeetAndInchesToDecimal: height => {
    let valueInPoints = height.replace(/[']+/g, '.').slice(0, -1);
    let lastNumber = parseInt(valueInPoints.split('.').pop());
    if (lastNumber <= 9) {
      valueInPoints = valueInPoints.split('.')[0];
      lastNumber = `0${lastNumber}`;
      return `${valueInPoints}.${lastNumber}`;
    } else if (lastNumber >= 10) {
      return parseFloat(valueInPoints).toFixed(2);
    }
  },

  convertFeetAndInchesToStringFormat: height => {
    let str = `${height}`;
    if (str.includes('.') === false) {
      str = `${height}.0`;
    } else if (
      !str.includes('.11') ||
      !str.includes('.12') ||
      str.includes('.1')
    ) {
      str = `${height}0`;
    }
    return str;
  },
};

export const insightsArr = [
  {
    title: 'Just joined',
    desc: 'Joined Rishta Auntie recently',
    icon: require('../assets/iconimages/join-1.png'),
  },
  {
    title: 'Frequent flyer',
    desc: 'Opens Rishta Auntie frequently',
    icon: require('../assets/iconimages/flyer-1.png'),
  },
  {
    title: 'Ghost',
    desc: 'They left 2 people on read in the past 30 days',
    icon: require('../assets/iconimages/ghost-1.png'),
  },
  {
    title: 'Rishta Auntie gold member',
    desc: "The person you're looking at has Gold",
    icon: require('../assets/iconimages/gold.png'),
  },
  {
    title: 'Editor in chief',
    desc: 'Someone who updates their profile once every 15 days',
    icon: require('../assets/iconimages/editor-1.png'),
  },
  {
    title: 'Teleprompter',
    desc: 'Their prompts speak for themselves, and get a lot of engagement',
    icon: require('../assets/iconimages/teleprompter-1.png'),
  },
  {
    title: 'Photogenic',
    desc: 'Gets more interactions on photos, rather than prompts',
    icon: require('../assets/iconimages/photogenic-1.png'),
  },
  {
    title: 'Ab bunny hai baat',
    desc: 'Uses voice on photos or prompts frequently',
    icon: require('../assets/iconimages/bunny-1.png'),
  },
  {
    title: 'Storyteller',
    desc: 'Someone who uses the voice chat feature frequently',
    icon: require('../assets/iconimages/story-1.png'),
  },
];
