import ApiManager from './ApiManager';
import Resources, {Singleton} from './Resources';

class PersonalityServices extends Resources {
  authUser = {};
  routes = {
    callLog: 'call-list',
    changePassword: 'change-password',
    resetPassword: 'forgot-password',
    getQuestions: '/personality-match/question',
    solveQuestions: '/personality-match/answer',
    matchPersonality: '/personality-match/match/',
  };

  constructor() {
    super(arguments);
  }

  getQuestions = () => {
    return ApiManager.get(this.routes.getQuestions);
  };

  solveQuestions = (payload, token) => {
    return ApiManager.post(this.routes.solveQuestions, payload, false, token);
  };

  matchPersonality = (payload, token) => {
    return ApiManager.get(this.routes.matchPersonality, payload, token);
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

export default Singleton(PersonalityServices);
