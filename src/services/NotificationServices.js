import ApiManager from './ApiManager';
import Resources, {Singleton} from './Resources';

class NotificationServices extends Resources {
  authUser = {};
  routes = {
    deviceToken: '/user/device-token',
    sendNotification: '/user/',
  };

  constructor() {
    super(arguments);
  }

  deviceToken = (payload, token) => {
    return ApiManager.patch(this.routes.deviceToken, payload, token);
  };

  sendNotification = (id, payload, token) => {
    return ApiManager.post(
      this.routes.sendNotification + id + '/send-notification',
      payload,
      false,
      token,
    );
  };
}

export default Singleton(NotificationServices);
