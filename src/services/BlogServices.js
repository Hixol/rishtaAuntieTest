import ApiManager from './ApiManager';
import Resources, {Singleton} from './Resources';

class BlogServices extends Resources {
  authUser = {};
  routes = {
    blogList: '/user/blog',
  };

  constructor() {
    super(arguments);
  }

  blogList = token => {
    return ApiManager.get(this.routes.blogList, '', token);
  };
}

export default Singleton(BlogServices);
