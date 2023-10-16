import {createReducer} from '@reduxjs/toolkit';

const initialState = {
  index: 0,
  firstName: '',
  lastName: '',
  dob: null,
  gender: '',
  selfie: null,
  picture: null,
  video: null,
  routeName: '',
  religion: null,
  profilePictures: [],
  vibes: [],
  promptsPool: [],
  height: null,
  familyOrigin: [],
  community: [],
  language: [],
  educationLevel: '',
  occupation1: '',
  denomination: '',
  practicingLevel: '',
  drink: '',
  smoke: [],
  pray: '',
  dietChoices: [],
  maritalHistory: '',
  marriageTimeline: '',
  haveKids: false,
  wantKids: false,
  relocate: false,
  tagline1: '',
  wholeArray: [],
  allVibes: [],
  allPrompts: [],
  allProfileValues: [],
};

export const NewOnBoardingReducer = createReducer(initialState, {
  //This is the action that will be called when the action is dispatched
  index: (state, action) => {
    const {payload} = action;
    state.index = payload;
  },
  firstName: (state, action) => {
    const {payload} = action;
    state.firstName = payload;
  },
  lastName: (state, action) => {
    const {payload} = action;
    state.lastName = payload;
  },
  dob: (state, action) => {
    const {payload} = action;
    state.dob = payload;
  },
  gender: (state, action) => {
    const {payload} = action;
    state.gender = payload;
  },
  selfie: (state, action) => {
    const {payload} = action;
    state.selfie = payload;
  },
  picture: (state, action) => {
    const {payload} = action;
    state.picture = payload;
  },
  video: (state, action) => {
    const {payload} = action;
    state.video = payload;
  },
  profilePictures: (state, action) => {
    const {payload} = action;
    state.profilePictures = payload;
  },
  religion: (state, action) => {
    const {payload} = action;
    state.religion = payload;
  },
  routeName: (state, action) => {
    const {payload} = action;
    state.routeName = payload;
  },
  vibes: (state, action) => {
    const {payload} = action;
    state.vibes = payload;
  },
  promptsPool: (state, action) => {
    const {payload} = action;
    state.promptsPool = payload;
  },
  height: (state, action) => {
    const {payload} = action;
    state.height = payload;
  },
  familyOrigin: (state, action) => {
    const {payload} = action;
    state.familyOrigin = payload;
  },
  community: (state, action) => {
    const {payload} = action;
    state.community = payload;
  },
  language: (state, action) => {
    const {payload} = action;
    state.language = payload;
  },
  educationLevel: (state, action) => {
    const {payload} = action;
    state.educationLevel = payload;
  },
  occupation1: (state, action) => {
    const {payload} = action;
    state.occupation1 = payload;
  },
  denomination: (state, action) => {
    const {payload} = action;
    state.denomination = payload;
  },
  practicingLevel: (state, action) => {
    const {payload} = action;
    state.practicingLevel = payload;
  },

  pray: (state, action) => {
    const {payload} = action;
    state.pray = payload;
  },
  drink: (state, action) => {
    const {payload} = action;
    state.drink = payload;
  },
  smoke: (state, action) => {
    const {payload} = action;
    state.smoke = payload;
  },
  dietChoices: (state, action) => {
    const {payload} = action;
    state.dietChoices = payload;
  },
  maritalHistory: (state, action) => {
    const {payload} = action;
    state.maritalHistory = payload;
  },
  marriageTimeline: (state, action) => {
    const {payload} = action;
    state.marriageTimeline = payload;
  },
  haveKids: (state, action) => {
    const {payload} = action;
    state.haveKids = payload;
  },
  wantKids: (state, action) => {
    const {payload} = action;
    state.wantKids = payload;
  },
  relocate: (state, action) => {
    const {payload} = action;
    state.relocate = payload;
  },
  tagline1: (state, action) => {
    const {payload} = action;
    state.tagline1 = payload;
  },
  wholeArray: (state, action) => {
    const {payload} = action;
    state.wholeArray = payload;
  },
  allVibes: (state, action) => {
    const {payload} = action;
    state.allVibes = payload;
  },
  allPrompts: (state, action) => {
    const {payload} = action;
    state.allPrompts = payload;
  },
  allProfileValues: (state, action) => {
    const {payload} = action;
    state.allProfileValues = payload;
  },
});
