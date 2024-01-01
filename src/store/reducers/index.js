import { combineReducers } from "@reduxjs/toolkit";
import { chatReducer } from "./OnBoardChat";
import { userReducer } from "./AuthUser";
import { timerReducer } from "./Timer";
import { profileReducer } from "./Profile";
import { NewOnBoardingReducer } from "./NewOnBoarding";
import ActiveCall from "./ActiveCall";

export default combineReducers({
  chatReducer,
  userReducer,
  timerReducer,
  profileReducer,
  ActiveCall,
  NewOnBoardingReducer,
});
