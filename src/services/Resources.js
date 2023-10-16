import ApiManager from "./ApiManager";

export default class Resources {
  async find(params = null) {
    if (this.beforeRemote) {
      await this.beforeRemote("find", params);
    }

    let result = await ApiManager.get(this.routes.resource, params);
    if (this.afterRemote) {
      return await this.afterRemote("find", result, params);
    }
    return result;
  }

  async findById(id) {
    if (this.beforeRemote) {
      await this.beforeRemote("findById", id);
    }

    let result = await ApiManager.get(`${this.routes.resource}/${id}`);
    if (this.afterRemote) {
      return await this.afterRemote("findById", result, id);
    }
    return result;
  }

  async create(payload, isUrlEncoded = false) {
    if (this.beforeRemote) {
      await this.beforeRemote("create", payload, isUrlEncoded);
    }

    let result = await ApiManager.post(
      `${this.routes.resource}`,
      payload,
      isUrlEncoded
    );

    if (this.afterRemote) {
      return await this.afterRemote("create", result, payload, isUrlEncoded);
    }

    return result;
  }

  async updateAttributes(payload, id, config) {
    if (this.beforeRemote) {
      await this.beforeRemote("updateAttributes", payload, id, config);
    }

    let result = await ApiManager.patch(
      `${this.routes.resource}/${id}`,
      payload,
      config
    );

    if (this.afterRemote) {
      return await this.afterRemote(
        "updateAttributes",
        result,
        payload,
        id,
        config
      );
    }

    return result;
  }
}

export const Singleton = (SingletonClass) => {
  if (!SingletonClass.instance) {
    SingletonClass.instance = new SingletonClass();
  }
  return SingletonClass.instance;
};
