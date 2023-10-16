import ApiManager from "./ApiManager";
import Resources, { Singleton } from "./Resources";

class ProductService extends Resources {
  authUser = {};
  routes = {
    login: "delivery_boy_login",
    GetCategories: "category",
  };

  constructor() {
    super(arguments);
  }

  GetCategories = (payload) => {
    return ApiManager.post(this.routes.GetCategories, payload, false);
  };
  callLog = (token) => {
    return ApiManager.get(this.routes.callLog, null, token);
  };

  changePassword = (payload, token) => {
    return ApiManager.post(this.routes.changePassword, payload, false, token);
  };
}

export default Singleton(ProductService);
