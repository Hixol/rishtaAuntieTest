import ApiManager from './ApiManager';
import Resources, {Singleton} from './Resources';

class IAPServices extends Resources {
  routes = {
    enableSpotlight: '/user/enable-spotlight',
    buySpotlight: '/user/purchase-spotlight',
    buySubscription: '/user/purchase-subscription',
  };

  constructor() {
    super(arguments);
  }

  enableSpotlight = token => {
    return ApiManager.patch(this.routes.enableSpotlight, null, token);
  };

  buySpotlight = (payload, token) => {
    return ApiManager.post(this.routes.buySpotlight, payload, false, token);
  };

  buySubscription = (payload, token) => {
    return ApiManager.post(this.routes.buySubscription, payload, false, token);
  };
}

export default Singleton(IAPServices);
