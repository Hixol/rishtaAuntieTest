import ApiManager from "./ApiManager";
import Resources, { Singleton } from "./Resources";

class UserService extends Resources {
  authUser = {};
  routes = {
    login: "/auth/signup/phone-number",
    signUp: "/auth/signup/phone-number",
    createNewProfile: "/user",
    updateNewProfile: "/user",
    signUpSocial: "/auth/signup/social",
    verifyOtp: "/auth/verify-code",
    logout: "/auth/logout",
    getVibes: "/user/vibes",
    getQuestions: "/user/questions",
    deleteAccount: `/user`,
    getAllUser: "/user/discover?",
    getOneUser: "/user/",
    likeIntercation: "/interaction/like",
    viewIntercation: "/interaction/view",
    getOtherUserDetail: "/user/",
    getAllMyMoves: "/interaction/my-moves?limit=",
    getAllMyLikes: "/interaction/my-moves/like?limit=",
    getAllMyComments: "/interaction/my-moves/comment?limit=",
    getAllMyViews: "/interaction/my-moves/view?limit=",
    getAllTheirViews: "/interaction/their-moves/view?limit=",
    getAllMyVoice: "/interaction/my-moves/voice-note?limit=",
    getAllTheirMoves: "/interaction/their-moves?limit=",
    getAllTheirLikes: "/interaction/their-moves/like?limit=",
    getAllTheirComments: "/interaction/their-moves/comment?limit=",
    getAllTheirVoice: "/interaction/their-moves/voice-note?limit=",
    getAllTheirMatchRequest: "/interaction/their-moves/match-request?",
    commentIntercation: "/interaction/comment",
    voiceIntercation: "/interaction/voice-note",
    unmatchUser: "/interaction/unmatch/",
    matchRequest: "/user/match-request",
    blockUser: "/user/",
    reportUser: "/user/",
    getOtherUser: "/user/",
    blockList: "/user/block-list",
    unblockUser: "/user/",
    myInsight: "/user/insight/",
    searchUserPreference: "/user/search-preferences",
    profile: "chat-info",
    userGet: "user",
    userProfileUpdate: "save-profile",
    status_update: "user-status",
    userrestriction: "user-restriction",
    searchUser: "user-search",
    respondLater: "message-respond-later",
    chatInfo: "chat-info",
    callLog: "call-list",
    changePassword: "change-password",
    resetPassword: "forgot-password",
    updateCurrentLocation: "/user/location",
    applyReset: "/user/apply-reset",
  };

  constructor() {
    super(arguments);
  }

  setAuthUser(user) {
    if (user) {
      this.authUser = user;
    }
  }

  login = payload => {
    return ApiManager.post(this.routes.login, payload);
  };

  signUp = payload => {
    return ApiManager.post(this.routes.signUp, payload);
  };

  signUpSocial = payload => {
    return ApiManager.post(this.routes.signUpSocial, payload);
  };

  verifyOtp = payload => {
    return ApiManager.post(this.routes.verifyOtp, payload);
  };

  logout = token => {
    return ApiManager.patch(this.routes.logout, {}, token);
  };

  deleteAccount = (id, token) => {
    console.log("TOKEN INSIDE", token, id);

    return ApiManager.delete(
      `${this.routes.deleteAccount}/?id=${id}`,
      "",
      token
    );
  };
  getVibes = () => {
    return ApiManager.get(this.routes.getVibes);
  };
  getAllUser = (token, payload) => {
    return ApiManager.get(this.routes.getAllUser, payload, token);
  };
  getAllTheirMoves = (token, payload) => {
    return ApiManager.get(this.routes.getAllTheirMoves, payload, token);
  };
  getAllMyMoves = (token, payload) => {
    return ApiManager.get(this.routes.getAllMyMoves, payload, token);
  };
  getAllMyLikes = (token, payload) => {
    return ApiManager.get(this.routes.getAllMyLikes, payload, token);
  };
  getAllMyComments = (token, payload) => {
    return ApiManager.get(this.routes.getAllMyComments, payload, token);
  };
  getAllMyVoice = (token, payload) => {
    return ApiManager.get(this.routes.getAllMyVoice, payload, token);
  };
  getAllMyViews = (token, payload) => {
    return ApiManager.get(this.routes.getAllMyViews, payload, token);
  };
  getAllTheirViews = (token, payload) => {
    return ApiManager.get(this.routes.getAllTheirViews, payload, token);
  };
  getAllTheirLikes = (token, payload) => {
    return ApiManager.get(this.routes.getAllTheirLikes, payload, token);
  };
  getAllTheirComments = (token, payload) => {
    return ApiManager.get(this.routes.getAllTheirComments, payload, token);
  };
  getAllTheirVoice = (token, payload) => {
    return ApiManager.get(this.routes.getAllTheirVoice, payload, token);
  };
  getAllTheirMatchRequest = (token, payload) => {
    return ApiManager.get(this.routes.getAllTheirMatchRequest, payload, token);
  };
  getOneUser = id => {
    return ApiManager.get(this.routes.getOneUser, id);
  };
  getOtherUser = (id, token) => {
    return ApiManager.get(this.routes.getOtherUser, id, token);
  };
  blockList = token => {
    return ApiManager.get(this.routes.blockList, "", token);
  };
  unblockUser = (payload, token) => {
    return ApiManager.post(
      `${this.routes.unblockUser}${payload}/unblock`,
      "",
      false,
      token
    );
  };
  myInsight = token => {
    return ApiManager.get(this.routes.myInsight, "", token);
  };

  userProfile = (payload, token) => {
    return ApiManager.post(this.routes.profile, payload, false, token);
  };
  getOtherUserDetail = (id, token, payload) => {
    return ApiManager.get(
      `${this.routes.getOtherUserDetail}${id}/profile`,

      payload,
      token
    );
  };
  viewIntercation = (id, token) => {
    return ApiManager.post(
      `${this.routes.viewIntercation}/${id}`,
      "",
      false,
      token
    );
  };
  blockUser = (id, token, payload) => {
    return ApiManager.post(
      `${this.routes.blockUser}${id}/block`,
      payload,
      false,
      token
    );
  };
  reportUser = (id, token, payload) => {
    return ApiManager.post(
      `${this.routes.reportUser}${id}/report`,
      payload,
      false,
      token
    );
  };

  matchRequest = (payload, token) => {
    return ApiManager.patch(this.routes.matchRequest, payload, token);
  };

  getUser = (payload, token) => {
    return ApiManager.post(this.routes.userGet, payload, false, token);
  };
  getQuestions = () => {
    return ApiManager.get(this.routes.getQuestions);
  };
  searchUserPreference = (payload, token) => {
    return ApiManager.put(this.routes.searchUserPreference, payload, token);
  };

  userProfileUpdate = (payload, token) => {
    return ApiManager.post(
      this.routes.userProfileUpdate,
      payload,
      false,
      token
    );
  };

  likeInteraction = (payload, token) => {
    return ApiManager.post(this.routes.likeIntercation, payload, false, token);
  };
  commentIntercation = (payload, token) => {
    return ApiManager.post(
      this.routes.commentIntercation,
      payload,
      false,
      token
    );
  };
  voiceIntercation = (payload, token) => {
    return ApiManager.post(this.routes.voiceIntercation, payload, false, token);
  };

  unmatchUser = (payload, token) => {
    return ApiManager.delete(this.routes.unmatchUser + payload, null, token);
  };

  UpdateuserStautus = (payload, token) => {
    return ApiManager.post(this.routes.status_update, payload, false, token);
  };

  UserRestriction = (payload, token) => {
    return ApiManager.post(this.routes.userrestriction, payload, false, token);
  };

  searchUserList = (payload, token) => {
    return ApiManager.post(this.routes.searchUser, payload, false, token);
  };

  respondLater = (payload, token) => {
    return ApiManager.post(this.routes.respondLater, payload, false, token);
  };

  chatInfo = (payload, token) => {
    return ApiManager.post(this.routes.chatInfo, payload, false, token);
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

  updateCurrentLocation = (payload, token) => {
    return ApiManager.patch(this.routes.updateCurrentLocation, payload, token);
  };

  applyReset = token => {
    return ApiManager.delete(this.routes.applyReset, null, token);
  };
  createNewProfile = (payload, token) => {
    return ApiManager.post(this.routes.createNewProfile, payload, false, token);
  };
  updateNewProfile = (payload, token) => {
    return ApiManager.put(this.routes.updateNewProfile, payload, token);
  };
}

export default Singleton(UserService);
