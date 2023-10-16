import ApiManager from './ApiManager';
import Resources, {Singleton} from './Resources';

class ChatServices extends Resources {
  authUser = {};
  routes = {
    chatHead: '/chat/chathead',
    sendChatMedia: '/chat/send-media',
    chatMessages: '/chat/',
    chatFavouriteMessage: '/chat/',
    chatReportMessage: '/chat/',
    contactSupport: '/chat/contact-support',
    ccCred: '/chat/cc-cred',
    getUserByCCUID: '/chat/user-details/',
    callLog: '/chat/call-log',
    getChatInsight: '/chat/insight/',
    ticket: '/user/ticket',
  };

  constructor() {
    super(arguments);
  }

  chatHead = token => {
    return ApiManager.get(this.routes.chatHead, '', token);
  };

  sendChatMedia = (payload, token) => {
    return ApiManager.post(this.routes.sendChatMedia, payload, false, token);
  };

  chatMessages = (payload, pagination, token) => {
    return ApiManager.get(
      this.routes.chatMessages + `${payload}/message?` + pagination,
      '',
      token,
    );
  };

  chatFavouriteMessage = (payload, token) => {
    return ApiManager.get(
      this.routes.chatFavouriteMessage + `${payload}/favourite-message`,
      '',
      token,
    );
  };

  chatReportMessage = (payload, token) => {
    return ApiManager.post(
      this.routes.chatReportMessage + `${payload}/report-message`,
      '',
      false,
      token,
    );
  };

  contactSupport = token => {
    return ApiManager.post(this.routes.contactSupport, '', false, token);
  };

  ccCred = token => {
    return ApiManager.get(this.routes.ccCred, '', token);
  };

  getUserByCCUID = (ccuid, token) => {
    return ApiManager.get(this.routes.getUserByCCUID, ccuid, token);
  };

  postCallLog = (payload, token) => {
    return ApiManager.post(this.routes.callLog, payload, false, token);
  };

  getCallLog = (pagination, token) => {
    return ApiManager.get(`${this.routes.callLog}?${pagination}`, '', token);
  };

  getChatInsight = (payload, token) => {
    return ApiManager.get(`${this.routes.getChatInsight}${payload}`, '', token);
  };

  getOpenendTicket = token => {
    return ApiManager.get(this.routes.ticket, '', token);
  };

  createTicket = (payload, token) => {
    return ApiManager.post(this.routes.ticket, payload, false, token);
  };
}

export default Singleton(ChatServices);
