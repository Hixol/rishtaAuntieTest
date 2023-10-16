import ApiManager from './ApiManager';
import Resources, {Singleton} from './Resources';

class ProfileServices extends Resources {
  authUser = {};
  routes = {
    callLog: 'call-list',
    changePassword: 'change-password',
    resetPassword: 'forgot-password',
    updateProfile: '/user',
    updateUserSettings: '/user/setting',
    getMyProfile: '/user/me',
  };

  constructor() {
    super(arguments);
  }

  updateProfile = (payload, token) => {
    return ApiManager.put(this.routes.updateProfile, payload, token);
  };

  updateUserSettings = (payload, token) => {
    return ApiManager.patch(this.routes.updateUserSettings, payload, token);
  };

  getMyProfile = token => {
    return ApiManager.get(this.routes.getMyProfile, '', token);
  };

  callLog = token => {
    return ApiManager.get(this.routes.callLog, null, token);
  };

  changePassword = (payload, token) => {
    return ApiManager.post(this.routes.changePassword, payload, false, token);
  };

  resetPassword = payload => {
    return ApiManager.post(this.routes.resetPassword, payload);
  };
}

export default Singleton(ProfileServices);
