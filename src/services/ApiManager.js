import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import config from '../config/appConfig';

const BASE_URL = config.server_url;

axios.defaults.validateStatus = status => {
  return status >= 200 && status <= 500;
};

axios.defaults.timeout = 1800000;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['accept'] = 'application/json';
axios.defaults.headers.post['crossDomain'] = true;

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response !== undefined) {
      alert(error);
    }
    return Promise.reject(error);
  },
);

class Api {
  isInitialized = false;
  accessToken = '';

  constructor() {}

  init() {}

  getVersion() {
    return 'APi Manager 1.0';
  }

  setHeaders(token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  }

  removeAuth() {
    axios.defaults.headers.common['Authorization'] = '';
  }

  configureAPI(accessToken) {
    this.accessToken = accessToken;
    this.setHeaders(accessToken);
  }

  checkConfig(otherToken) {
    this.setHeaders(otherToken);
    return new Promise((res, rej) => {
      NetInfo.fetch().then(({isConnected}) => {
        if (isConnected) {
          res(true);
        } else {
          rej({data: 'Network connection failed!', status: 400});
        }
      });
    });
  }

  async get(url, params = '', otherToken = '') {
    try {
      await this.checkConfig(otherToken);
      return axios.get(BASE_URL + url + params);
    } catch (e) {
      return e;
    }
  }

  async put(url, body, otherToken = '') {
    try {
      await this.checkConfig(otherToken);
      return axios.put(BASE_URL + url, body);
    } catch (e) {
      return e;
    }
  }

  async patch(url, body = null, otherToken = '') {
    try {
      await this.checkConfig(otherToken);
      return axios.patch(BASE_URL + url, body);
    } catch (e) {
      return e;
    }
  }

  async post(url, body, isUrlEncoded = false, otherToken = '') {
    try {
      await this.checkConfig(otherToken);
      if (isUrlEncoded) {
        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
      } else if (isUrlEncoded === 'uploadFile') {
        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
      } else {
        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
      }

      return axios.post(BASE_URL + url, body);
    } catch (e) {
      return e;
    }
  }

  async delete(url, params = null, otherToken = '') {
    try {
      await this.checkConfig(otherToken);
      return axios.delete(BASE_URL + url, {params: params});
    } catch (e) {
      return e;
    }
  }
}

// Singleton ApiManager
const Singleton = (function () {
  let instance = null;

  function createInstance() {
    return new Api();
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
        instance.isInitialized = true;
      }
      return instance;
    },
  };
})();

export default Singleton.getInstance();
