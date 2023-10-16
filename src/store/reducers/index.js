import {combineReducers} from '@reduxjs/toolkit';
import {chatReducer} from './OnBoardChat';
import {userReducer} from './AuthUser';
import {profileReducer} from './Profile';
import {NewOnBoardingReducer} from './NewOnBoarding';
import ActiveCall from './ActiveCall';

export default combineReducers({
  chatReducer,
  userReducer,
  profileReducer,
  ActiveCall,
  NewOnBoardingReducer,
});
