import ApiManager from './ApiManager';
import Resources, {Singleton} from './Resources';

class OnBoardingServices extends Resources {
  authUser = {};
  routes = {
    callLog: 'call-list',
    changePassword: 'change-password',
    resetPassword: 'forgot-password',
    profileValues: '/user/profile-values?filter=',
    vibesListing: '/user/vibes',
    createUser: '/user',
    uploadVideo: '/user/upload-video',
  };

  constructor() {
    super(arguments);
  }

  profileValues = payload => {
    return ApiManager.get(this.routes.profileValues, payload);
  };

  vibesListing = () => {
    return ApiManager.get(this.routes.vibesListing);
  };

  createUser = (payload, token) => {
    return ApiManager.post(this.routes.createUser, payload, false, token);
  };

  uploadVideo = (payload, token) => {
    return ApiManager.post(this.routes.uploadVideo, payload, false, token);
  };

  setAuthUser(user) {
    if (user) {
      this.authUser = user;
    }
  }

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

export default Singleton(OnBoardingServices);
