import { Dimensions } from 'react-native';

export const USER_DATA_KEY = '@rishtaauntieuser';
export const SEARCH_DATA_KEY = '@rishtaauntiesearch';
export const FAVOURITES = '@favourites';
export const REQUESTS = '@requests';
export const SEARCHES = '@searches';
export const CONTACTS_ADDED = '@contacts';
export const USER_CREDENTIAL = '@User-credential';
export const RECENT_SEARCHES = '@recent-searches';
export const CATEGORIES = '@categories';
export const PUSH_TOKEN = '@push-token';
export const INSTAGRAM_TOKEN = '@instagram-token';
export const LATITUDE = 24.875058;
export const LONGITUDE = 67.039627;

export const CUSTOMER = 'CUSTOMER';
export const SERVICE_PROVIDER = 'SERVICE_PROVIDER';
export const BASIC_INFO = 'BASIC_INFO';
export const ADDRESS = 'ADDRESS';
export const PREFERENCES = 'PREFERENCES';
export const SET_USER_INFO = 'SET_USER_INFO';
export const UPDATE_TOKEN = 'UPDATE_TOKEN';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
export const SET_CURRENT_ADDRESS = 'SET_CURRENT_ADDRESS';
export const SET_AIRPORTS_NEARBY = 'SET_AIRPORTS_NEARBY';
export const SET_CATEGORIES = 'SET_CATEGORIES';

export const SET_SUBJECTS = 'SET_SUBJECTS';
export const SET_GRADE = 'SET_GRADE';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_SCHEDULE = 'SET_SCHEDULE';

export const SHOW_FILTERS = 'SHOW_FILTERS';
export const SET_FILTERS = 'SET_FILTERS';

export const MOST_RECENT = 'MOST_RECENT';
export const MOST_LIKED = 'MOST_LIKED';
export const MOST_SAVED = 'MOST_SAVED';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const CARDWIDTH = WIDTH - WIDTH / 10;

export const LARGE_FONT_SIZE = 'large';
export const MEDIUM_FONT_SIZE = 'medium';
export const SMALL_FONT_SIZE = 'small';

export const CHAT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ssZZ';

export const USER_ENDPOINT =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record';
export const USER_FETCH_ENDPOINT =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/user';
export const USERS_FETCH_ENDPOINT =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/getAllById';
export const USER_UPDATE_ENDPOINT =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/user';
export const USER_PERSONALITY_QUIZ =
  'https://4panqeazs9.execute-api.us-east-2.amazonaws.com/dev/personality/';
export const SEARCH_ENDPOINT =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/search';
export const THEIR_HISTORY_ENDPOINT =
  'https://sxz78kvap9.execute-api.us-east-2.amazonaws.com/dev/there/history';
export const SEARCH_PREFERENCE_ENDPOINT =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/filter';
export const MY_HISTORY_ENDPOINT =
  'https://sxz78kvap9.execute-api.us-east-2.amazonaws.com/dev/history';
export const BLOCK_USER_ENDPOINT =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/block';
export const DELETE_BLOCK_USER_ENDPOINT =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/block';
export const REPORT_USER_ENDPOINT =
  'https://wz6udvf349.execute-api.us-east-2.amazonaws.com/dev/report/create';
export const DELETE_REPORT_USER_ENDPOINT =
  'https://wz6udvf349.execute-api.us-east-2.amazonaws.com/dev/report/delete';
export const SET_PREFERENCES =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/prefrence';
export const GET_PREFERENCES = (id) =>
  `https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/preference/${id}`;
export const GET_VIBES =
  'https://ibs6fpq2bl.execute-api.us-east-2.amazonaws.com/dev/question/vibe';
export const SUGGESTION_ENDPOINT = (userType, matchType) =>
  `https://4panqeazs9.execute-api.us-east-2.amazonaws.com/dev/personality/match/${userType}/${matchType}`;
export const BLOCK_USER_FETCH_ENDPOINT = (id) =>
  `https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/block/${id}/user`;
export const QUESTIONS_ENDPOINT =
  'https://ibs6fpq2bl.execute-api.us-east-2.amazonaws.com/dev/question/QA';
export const REQUESTS_ENDPOINT = (id, name) =>
  `https://5svwocepak.execute-api.us-east-2.amazonaws.com/dev/profile/getAll/${id}/${name}/requests`;
export const MATCHES_ENDPOINT = (id, name) =>
  `https://5svwocepak.execute-api.us-east-2.amazonaws.com/dev/profile/getAll/${id}/${name}/freinds`;
export const GET_ALL_BLOG = `https://wz6udvf349.execute-api.us-east-2.amazonaws.com/dev/blog`;

export const REQUEST_ACCEPT_ENDPOINT = `https://5svwocepak.execute-api.us-east-2.amazonaws.com/dev/profile/request`;
export const REQUEST_REJECT_ENDPOINT = `https://5svwocepak.execute-api.us-east-2.amazonaws.com/dev/profile/delete`;
export const CHAT_BASE_URL =
  'http://ec2-3-129-68-164.us-east-2.compute.amazonaws.com';
export const CONNECTION_URL = (userId) =>
  `http://ec2-3-129-68-164.us-east-2.compute.amazonaws.com/socketid-${userId}`;

export const USER_BLOCK =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/blockUser';
export const USER_COMBO_BLOCK =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/blockUserCombo/';
export const USER_MY_BLOCK =
  'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/blockUser/';

export const COUNT_QUESTION =
  'https://ibs6fpq2bl.execute-api.us-east-2.amazonaws.com/dev/question/count';

export const PRIVACY_URL = 'https://rishtaauntie.app/privacy-policy/';
export const TERMS_URL = 'https://rishtaauntie.app/terms-of-use/';
export const FAQ_URL = 'https://rishtaauntie.app/faq/';
export const COOKIES_URL = "https://rishtaauntie.app/cookies-policy"
export const USER_DELETE_ENDPOINT =
  'https://yu4neqw2q7.execute-api.us-east-1.amazonaws.com/dev/cognito/delete';
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'NoV',
  'Dec',
];

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const WEEKDAYS2 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const GOOGLE_PLACES_APIKEY = 'AIzaSyCK2q6hdRhAiQdyKwuEfd23vHklM0Jgguw';
// import {Dimensions} from 'react-native';

// export const USER_DATA_KEY = '@rishtaauntieuser';
// export const SEARCH_DATA_KEY = '@rishtaauntiesearch';
// export const FAVOURITES = '@favourites';
// export const REQUESTS = '@requests';
// export const SEARCHES = '@searches';
// export const CONTACTS_ADDED = '@contacts';
// export const USER_CREDENTIAL = '@User-credential';
// export const RECENT_SEARCHES = '@recent-searches';
// export const CATEGORIES = '@categories';
// export const PUSH_TOKEN = '@push-token';
// export const LATITUDE = 24.875058;
// export const LONGITUDE = 67.039627;

// export const CUSTOMER = 'CUSTOMER';
// export const SERVICE_PROVIDER = 'SERVICE_PROVIDER';
// export const BASIC_INFO = 'BASIC_INFO';
// export const ADDRESS = 'ADDRESS';
// export const PREFERENCES = 'PREFERENCES';
// export const SET_USER_INFO = 'SET_USER_INFO';
// export const UPDATE_TOKEN = 'UPDATE_TOKEN';
// export const SET_USER_ID = 'SET_USER_ID';
// export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
// export const SET_CURRENT_ADDRESS = 'SET_CURRENT_ADDRESS';
// export const SET_AIRPORTS_NEARBY = 'SET_AIRPORTS_NEARBY';
// export const SET_CATEGORIES = 'SET_CATEGORIES';

// export const SET_SUBJECTS = 'SET_SUBJECTS';
// export const SET_GRADE = 'SET_GRADE';
// export const SET_LOCATION = 'SET_LOCATION';
// export const SET_SCHEDULE = 'SET_SCHEDULE';

// export const SHOW_FILTERS = 'SHOW_FILTERS';
// export const SET_FILTERS = 'SET_FILTERS';

// export const MOST_RECENT = 'MOST_RECENT';
// export const MOST_LIKED = 'MOST_LIKED';
// export const MOST_SAVED = 'MOST_SAVED';

// export const WIDTH = Dimensions.get('window').width;
// export const HEIGHT = Dimensions.get('window').height;
// export const CARDWIDTH = WIDTH - WIDTH / 10;

// export const LARGE_FONT_SIZE = 'large';
// export const MEDIUM_FONT_SIZE = 'medium';
// export const SMALL_FONT_SIZE = 'small';

// export const USER_ENDPOINT =
//   'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record';
// export const USER_FETCH_ENDPOINT =
//   'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/record/user';
// export const USERS_FETCH_ENDPOINT =
//   'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/getAllById';
// export const USER_UPDATE_ENDPOINT =
//   'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/user';
// export const USER_PERSONALITY_QUIZ =
//   'https://4panqeazs9.execute-api.us-east-2.amazonaws.com/dev/personality/';
// export const SEARCH_ENDPOINT =
//   'https://s4pt91n3ui.execute-api.us-east-2.amazonaws.com/dev/record/search';
// export const THEIR_HISTORY_ENDPOINT =
//   'https://sxz78kvap9.execute-api.us-east-2.amazonaws.com/dev/there/history';
// export const MY_HISTORY_ENDPOINT =
//   'https://sxz78kvap9.execute-api.us-east-2.amazonaws.com/dev/history';
// export const BLOCK_USER_ENDPOINT =
//   'https://srrcrhssll.execute-api.us-east-2.amazonaws.com/dev/record/block';
// export const REPORT_USER_ENDPOINT =
//   'https://wz6udvf349.execute-api.us-east-2.amazonaws.com/dev/report/create';
// export const SUGGESTION_ENDPOINT = (userType, matchType) =>
//   `https://4panqeazs9.execute-api.us-east-2.amazonaws.com/dev/personality/match/${userType}/${matchType}`;
// export const BLOCK_USER_FETCH_ENDPOINT = (id) =>
//   `https://srrcrhssll.execute-api.us-east-2.amazonaws.com/dev/record/block/${id}/user`;
// export const QUESTIONS_ENDPOINT =
//   'https://ibs6fpq2bl.execute-api.us-east-2.amazonaws.com/dev/question/QA';
// export const REQUESTS_ENDPOINT = (id, name) =>
//   `https://5svwocepak.execute-api.us-east-2.amazonaws.com/dev/profile/getAll/${id}/${name}/requests`;
// export const MATCHES_ENDPOINT = (id, name) =>
//   `https://5svwocepak.execute-api.us-east-2.amazonaws.com/dev/profile/getAll/${id}/${name}/freinds`;
// export const REQUEST_ACCEPT_ENDPOINT = `https://5svwocepak.execute-api.us-east-2.amazonaws.com/dev/profile/request`;
// export const REQUEST_REJECT_ENDPOINT = `https://5svwocepak.execute-api.us-east-2.amazonaws.com/dev/profile/delete`;
// export const CHAT_BASE_URL =
//   'http://ec2-3-129-68-164.us-east-2.compute.amazonaws.com';
// export const CONNECTION_URL = (userId) =>
//   `http://ec2-3-129-68-164.us-east-2.compute.amazonaws.com/socketid-${userId}`;

// export const CHAT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ssZZ';

// export const MONTHS = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ];

// export const MONTHS_SHORT = [
//   'Jan',
//   'Feb',
//   'Mar',
//   'Apr',
//   'May',
//   'Jun',
//   'Jul',
//   'Aug',
//   'Sep',
//   'Oct',
//   'NoV',
//   'Dec',
// ];

// export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// export const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// export const WEEKDAYS2 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// export const GOOGLE_PLACES_APIKEY = 'AIzaSyDZ8WdVpszngdJ3-UkBewTfwztYhD60gdQ';
