const educations = [
  {name: 'High School'},
  {name: 'Bachelors'},
  {name: 'Doctorate'},
  {name: 'Masters'},
];

const maritalHistory = [
  {name: 'None'},
  {name: 'Divorced'},
  {name: 'Widowed'},
  {name: 'Annulled'},
];

const resligiousSteps = [
  {index: 0, stepLabel: 'Rarely Religious'},
  {index: 1, stepLabel: 'Somewhat Religious'},
  {index: 2, stepLabel: 'Religious'},
  {index: 3, stepLabel: 'Strongly Religious'},
];

const praySteps = [
  {index: 0, stepLabel: "Don't pray"},
  {index: 1, stepLabel: 'Sometimes'},
  {index: 2, stepLabel: 'Often'},
  {index: 3, stepLabel: 'Regularly'},
];

const drinkButtons = [
  {
    id: 1,
    title: 'I Drink',
    btnIcon: require('../assets/iconimages/drink.png'),
  },
  {
    id: 2,
    title: 'Sometimes, Socially',
    btnIcon: require('../assets/iconimages/glass2-01.png'),
  },
  {
    id: 3,
    title: "I Don't Drink",
    btnIcon: require('../assets/iconimages/no-glass.png'),
  },
];

const optionButtons = [
  {
    id: 1,
    title: 'Yes',
  },
  {
    id: 2,
    title: 'No',
  },
];

const videoButtons = [
  {
    id: 1,
    title: 'Upload',
    btnIcon: require('../assets/iconimages/Upload-01.png'),
  },
  {
    id: 2,
    title: 'Record',
    btnIcon: require('../assets/iconimages/Record-01.png'),
  },
  {
    id: 3,
    title: 'Skip for now',
  },
];

const uploadButton = [
  {
    title: 'Upload',
    btnIcon: require('../assets/iconimages/camera-upload.png'),
  },
];

const reviewButtons = [
  {id: 1, title: 'Rishta Auntie Personality Quiz'},
  {id: 2, title: 'Continue to my profile'},
];

const quizButtons = [
  {id: 1, title: 'Rishta Auntie Personality Quiz'},
  {id: 2, title: 'Skip for now'},
];

export {
  educations,
  maritalHistory,
  resligiousSteps,
  praySteps,
  drinkButtons,
  optionButtons,
  videoButtons,
  uploadButton,
  reviewButtons,
  quizButtons,
};
