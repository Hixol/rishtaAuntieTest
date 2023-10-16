import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid} from 'react-native';
import {android} from './size';
import {alerts} from './regex';
import Toast from 'react-native-simple-toast';
import ChatServices from '../services/ChatServices';

export async function getUserById(userId, key) {
  let token = await AsyncStorage.getItem('token');
  let promise = new Promise(resolve => {
    ChatServices.getUserByCCUID(userId, token)
      .then(res => {
        if (res.status >= 200 && res.status <= 299) {
          resolve(res.data.data);
        } else if (res.status >= 300 && res.status <= 399) {
          alerts(
            'error',
            'You need to perform further actions to complete the request!',
          );
        } else if (res.status >= 400 && res.status <= 499) {
          alerts('error', res.data?.error?.message);
        } else if (res.status >= 500 && res.status <= 599) {
          alerts(
            'error',
            'Internal server error! Your server is probably down.',
          );
        } else {
          alerts('error', 'Something went wrong Please try again later');
        }
      })
      .catch(err => console.log('getUserByCCUID err', err));
  });

  let user = await promise.then(res => res.User);
  return user;
}

export async function getCallRecipientString(usersIds) {
  let opponentsNamesString = '';
  for (let i = 0; i < usersIds.length; ++i) {
    const receivedName = await getUserById(usersIds[i]);
    opponentsNamesString += receivedName.firstName;
    if (i !== usersIds.length - 1) {
      opponentsNamesString += ', ';
    }
  }
  return opponentsNamesString;
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function showToast(text) {
  const commonToast = android ? ToastAndroid : Toast;
  commonToast.showWithGravity(text, Toast.LONG, Toast.TOP);
}
