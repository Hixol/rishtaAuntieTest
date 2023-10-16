import ApiManager from './ApiManager';
import Resources, {Singleton} from './Resources';

class BadgeServices extends Resources {
  routes = {
    openApp: '/badge/open-app',
    getUserBadges: '/badge/user/',
  };

  constructor() {
    super(arguments);
  }

  openApp = token => {
    return ApiManager.get(this.routes.openApp, '', token);
  };

  getUserBadges = (id, token) => {
    return ApiManager.get(`${this.routes.getUserBadges}${id}`, '', token);
  };
}

export default Singleton(BadgeServices);
