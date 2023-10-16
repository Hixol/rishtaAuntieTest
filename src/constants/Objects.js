import Countries from '../data/Countries';
import religions, {followerNames} from '../data/religions';
import {
  formatDate,
  evalVal,
  formatAddress,
  timeInWords,
} from '../utilities/functions';
import {CUSTOMER, SERVICE_PROVIDER, SHOP_INFO} from './Constants';
import moment from 'moment';

moment.updateLocale('en', {
  relativeTime: {
    past: function (input) {
      return input === 'just now' ? input : input + ' ago';
    },
    s: 'just now',
    future: 'in %s',
    ss: '%d seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

const getProfile = (result = null) => {
  if (result)
    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      height: result.height,
      age: result.age,
      tagline: result.tagline,
      vibes: result.vibes,
      questions: result.questions,
      photoUrls: result.photoUrls,
      instaPhotoUrls: result.instaPhotoUrls,
      address: result.address,
      country: result.country,
      familyOrigin: result.familyOrigin,
      community: result.community,
      languages: result.languages,
      religion: result.religion,
      denomination: result.denomination,
      practicingLevel: result.practicingLevel,
      prayingLevel: result.prayingLevel,
      college: result.college,
      major: result.major,
      occupation: result.occupation,
      company: result.company,
      dreamJob: result.dreamJob,
      drink: result.drink,
      smoke: result.smoke,
      diet: result.diet,
      marriageTime: result.marriageTime,
      marriageHistory: result.marriageHistory,
      haveKids: result.haveKids,
      relocate: result.relocate,
      wantKids: result.wantKids,
    };
  else
    return {
      id: '',
      firstName: '',
      lastName: '',
      height: '',
      age: '',
      tagline: '',
      vibes: '',
      questions: {},
      photoUrls: '',
      instaPhotoUrls: '',
      address: '',
      country: '',
      familyOrigin: '',
      community: '',
      languages: '',
      religion: '',
      denomination: '',
      practicingLevel: '',
      prayingLevel: '',
      college: '',
      major: '',
      occupation: '',
      company: '',
      dreamJob: '',
      drink: '',
      smoke: '',
      diet: '',
      marriageTime: '',
      marriageHistory: '',
      haveKids: '',
      relocate: '',
      wantKids: '',
    };
};

const getSearchBody = (preferences) => {
  let {
    age,
    height,
    country,
    gender,
    education,
    denomination,
    religion,
    familyOrigin,
    community,
  } = preferences;

  let body = {};
  if (age.active) {
    body['age'] = `${age.value[0]}`;
    body['ageRange'] = `${age.value[1]?.toString()}`;
  }
  if (height.active) {
    body['height'] = `${height.value[0]}`;
    body['heightRange'] = `${height.value[1]?.toString()}`;
  }
  if (country.active) body['country'] = `${country.value}`;
  if (education.active) body['education'] = `${education}`;
  if (denomination.active) body['denomination'] = `${denomination}`;
  if (religion.active) body['religion'] = `${religion.value}`;
  if (familyOrigin.active) body['familyOrigin'] = `${familyOrigin}`;
  if (community.active) body['community'] = `${community}`;
  return body;
};

const getAccountSettings = (accountSettings) =>
  accountSettings || {
    pushNotif: true,
    loginWithFacebook: false,
    loginWithGoogle: false,
    loginWithInstagram: false,
    instagramFeed: false,
  };

const getPrivacySettings = (privacySettings) =>
  privacySettings || {
    stealthMode: false,
    discoveryMode: true,
    hideOnlineStatus: false,
    hideAge: false,
    showMessagePreview: true,
    photoFilter: true,
  };
const getPreferences = () => ({
  distance: {active: true, value: 'unlimited'},
  country: {active: true, value: ''},
  height: {active: true, value: ['0', '41']},
  age: {active: true, value: ['18', '68']},
  religion: {active: false, value: ''},
  familyOrigin: {active: false, value: ''},
  community: {active: false, value: ''},
  languages: {active: false, value: ''},
  denomination: {active: false, value: ''},
  practicingLevel: {active: false, value: 'Fairly Religious'},
  prayingLevel: {active: false, value: 'Sometimes'},
  drink: {active: false, value: ''},
  smoke: {active: false, value: ''},
  diet: {active: false, value: ''},
  education: {active: false, value: ''},
  major: {active: false, value: ''},
  college: {active: false, value: ''},
  occupation: {active: false, value: ''},
  marriageTime: {active: false, value: ''},
  hasKids: {active: false, value: ''},
  wantKids: {active: false, value: ''},
  relocate: {active: false, value: ''},
  blurryPictures: {active: true, value: true},
});
const evalValue = (val, defVal = '--') => {
  if (val === undefined || val === null) return defVal;
  if (typeof val === 'string' && val.length == 0) return '--';
  if (typeof val === 'number') return `${val}`;
  return val;
};
const getUserBody = (user) => ({
  id: evalValue(user.id, null),
  email: evalValue(user.email, '--'),
  phone: evalValue(user.phone, '--'),
  phoneVerified: evalValue(user.phoneVerified, false),
  type: evalValue(user.type, '--'),
  isLoggedIn: evalValue(user.isLoggedIn, false),
  status: evalValue(user.status, 'PENDING'),
  isReported: evalValue(user.isReported, false),
  name: evalValue(user.name, '--'),
  firstName: evalValue(user.firstName, '--'),
  lastName: evalValue(user.lastName, '--'),
  birthDate: evalValue(user.birthDate, '--'),
  age: evalValue(user.age, '0'),
  gender: evalValue(user.gender, '--'),
  height: evalValue(user.height, '10'),
  familyOrigin: evalValue(user.familyOrigin, '--'),
  community: evalValue(user.community, '--'),
  languages: evalValue(user.languages, '--'),
  education: evalValue(user.education, '--'),
  college: evalValue(user.college, '--'),
  major: evalValue(user.major, '--'),
  occupation: evalValue(user.occupation, '--'),
  company: evalValue(user.company, '--'),
  dreamJob: evalValue(user.dreamJob, '--'),
  religion: evalValue(user.religion, '--'),
  denomination: evalValue(user.denomination, '--'),
  practicingLevel: evalValue(user.practicingLevel, '--'),
  prayingLevel: evalValue(user.prayingLevel, '--'),
  drink: evalValue(user.drink, '--'),
  smoke: evalValue(user.smoke, []),
  diet: evalValue(user.diet, []),
  marriageTime: evalValue(user.marriageTime, '--'),
  marriageHistory: evalValue(user.marriageHistory, '--'),
  haveKids: evalValue(user.haveKids, '--'),
  relocate: evalValue(user.relocate, '--'),
  wantKids: evalValue(user.wantKids, '--'),
  tagline: evalValue(user.tagline, '--'),
  vibes: evalValue(user.vibes, []),
  questions: evalValue(user.questions, [
    {question: '--', answer: '--'},
    {question: '--', answer: '--'},
    {question: '--', answer: '--'},
  ]),
  photoUrls: evalValue(user.photoUrls, new Array(6).fill('')),
  instaPhotoUrls: evalValue(user.instaPhotoUrls, new Array(6).fill('')),
  selfie: evalValue(user.selfie, ''),
  location: evalValue(user.location, {latitude: 0.0, longitude: 0.0}),
  address: evalValue(user.address, null),
  country: evalValue(user.country, '--'),
  personality: evalValue(user.personality, null),
  accountSettings: {
    pushNotif: true,
    loginWithFacebook: false,
    loginWithGoogle: false,
    loginWithInstagram: false,
    instagramFeed: false,
  },
  privacySettings: {
    stealthMode: false,
    discoveryMode: true,
    hideOnlineStatus: false,
    hideAge: false,
    showMessagePreview: true,
    photoFilter: true,
  },
});

const getBlockedData = (user) => ({
  id: user.id,
  name: evalValue(user.name, ''),
  picture: evalValue(user.photoUrls[0]),
  religion: evalValue(user.religion),
  qualification: evalValue(user.qualification),
  occupation: evalValue(user.occupation),
  familyOrigin: evalValue(user.familyOrigin),
});

const getHistoryItem = (historyItem) => {
  let h = historyItem || {};
  const familyOrigin = h.userFamilyOrigin || '';
  const religion = h.userReligion || '';
  const followerName = followerNames[religion];
  const occupation = h.userOccupation || '';
  const age = h.userAge || '';
  const comment = h.comment || false;
  const familyOriginCountry = Countries.find(
    (item) => item.en === familyOrigin,
  );
  const familyOriginCountryCode = familyOriginCountry
    ? familyOriginCountry.code
    : null;
  const isPicture = h?.imageURI?.length > 0;
  let message = h.message;
  const createdATString = h.createdATString || '';
  const photoFilter = h.photoFilter || false;
  const hideAge = h.hideAge || false;

  // if(h.message.includes('like')) message = `Liked my ${isPicture ? 'picture' : 'Q/A'}`;
  // if(h.message.includes('commented')) message = 'Left a comment:';

  return {
    id: h.userId,
    name: h.userName,
    avatar: `https://rishta-aunti-bucket.s3.amazonaws.com/public/${h.userId}-1.jpeg`,
    familyOriginCountryCode,
    age,
    religion: followerName,
    occupation,
    message: message,
    comment: comment,
    timeInWords: moment(createdATString).fromNow(true),
    createdATString,
    imageURI: h.imageURI,
    qAns: h.question,
    isPicture,
    photoFilter,
    hideAge,
    image: h.image,
  };
};

const getMyHistoryItem = (historyItem) => {
  let h = historyItem || {};
  const familyOrigin = h.userFamilyOrigin || '';
  const religion = h.userReligion || '';
  const followerName = followerNames[religion];
  const occupation = h.userOccupation || '';
  const age = h.userAge || '';
  const comment = h.comment || '';
  const familyOriginCountry = Countries.find(
    (item) => item.en === familyOrigin,
  );
  const familyOriginCountryCode = familyOriginCountry
    ? familyOriginCountry.code
    : null;
  // const isPicture = h.imageURI.length > 0;
  let message = h.message;
  // if(h.message.includes('like')) message = `Liked my ${isPicture ? 'picture' : 'Q/A'}`;
  // if(h.message.includes('commented')) message = 'Left a comment:';

  return {
    id: h.userId,
    name: h.userName,
    avatar: `https://rishta-aunti-bucket.s3.amazonaws.com/public/${h.userId}-1.jpeg`,
    familyOriginCountryCode,
    age,
    religion: followerName,
    occupation,
    message: message,
    comment: comment,
    timeInWords: moment(h.createdATString).fromNow(),
    imageURI: h?.imageURI,
    qAns: h.question,
  };
};

export default {
  getSearchBody,
  getProfile,
  getAccountSettings,
  getPrivacySettings,
  getPreferences,
  getBlockedData,
  getUserBody,
  getHistoryItem,
  getMyHistoryItem,
};
