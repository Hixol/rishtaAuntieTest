import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useHelper} from '../../hooks/useHelper';

import styles from './styles';
import colors from '../../utility/colors';
import HeaderContainer from '../../components/containers/headerContainer';
import Button from '../../components/buttons/Button';
import SliderView from '../../components/Modal/Slider';
import DropDownView from '../../components/Modal/DropDown';
import PreferenceTextName from '../../components/containers/PreferenceTextName';
import ProfileServices from '../../services/ProfileServices';

const TalhaDemo = props => {
  const {paramKey, paramKey2, value} = props.route.params;

  const {Alerts, handleStatusCode} = useHelper();

  const [sliderVal, setSliderVal] = useState(
    paramKey == 'Height' ? [value] : [1],
  );

  const [ind, setInd] = useState(value == true ? 0 : 1);
  const [textVal, setTextVal] = useState(
    paramKey != 'TagLine' && value ? value : '',
  );

  const [tagline, setTagline] = useState(
    paramKey == 'TagLine' && value ? value : '',
  );

  const {token, userData} = useSelector(store => store.userReducer);

  const {
    colleges,
    countries,
    communities,
    languages,
    occupations,
    religions,
    denomination,
    den,
  } = useSelector(store => store.profileReducer);

  const dispatch = useDispatch();

  const educations = ['High School', 'Bachelors', 'Doctorate', 'Masters'];
  let martialHistory = ['None', 'Divorced', 'Widowed', 'Annulled'];
  let [loading, setLoading] = useState(false);
  let btnChoice = [];

  let optionButtons = [
    {
      id: 1,
      title: 'Yes',
    },
    {
      id: 2,
      title: 'No',
    },
  ];

  const Drink = [
    {
      id: 1,
      title: 'I Drink',
      btnIcon: require('../../assets/iconimages/drink.png'),
    },
    {
      id: 2,
      title: 'Sometimes, Socially',
      btnIcon: require('../../assets/iconimages/glass2-01.png'),
    },
    {
      id: 3,
      title: "I Don't Drink",
      btnIcon: require('../../assets/iconimages/no-glass.png'),
    },
  ];

  const [smokeBtns, setSmokeBtns] = useState([
    {
      id: 1,
      title: 'Hookah',
      btnIcon: require('../../assets/iconimages/Hookah-01.png'),
      selected: false,
    },
    {
      id: 2,
      title: 'Cigarette',
      btnIcon: require('../../assets/iconimages/Cigarette.png'),
      selected: false,
    },
    {
      id: 3,
      title: 'Weed',
      btnIcon: require('../../assets/iconimages/Weed-01.png'),
      selected: false,
    },
    {
      id: 4,
      title: 'None',
      btnIcon: require('../../assets/iconimages/no.png'),
      selected: false,
    },
  ]);

  const [dietBtns, setDietBtns] = useState([
    {
      id: 1,
      title: 'Halal',
      btnIcon: require('../../assets/iconimages/Halal.png'),
      selected: false,
    },

    {
      id: 2,
      title: 'Vegan',
      btnIcon: require('../../assets/iconimages/Vegan-01.png'),
      selected: false,
    },
    {
      id: 3,
      title: 'Vegetarian',
      btnIcon: require('../../assets/iconimages/Vegetarian-01.png'),
      selected: false,
    },

    {
      id: 4,
      title: 'Anything',
      btnIcon: require('../../assets/iconimages/Anything-01.png'),
      selected: false,
    },
  ]);

  const handleDefaultChosenValues = (defaultValues, arr) => {
    let copyArr = [...arr];
    for (let i = 0; i < defaultValues.length; i++) {
      arr.map((btn, index) => {
        if (defaultValues[i].choice == btn.title) {
          copyArr[index].selected = !btn.selected;
        }
      });
    }
    return copyArr;
  };

  useEffect(() => {
    dispatch({
      type: 'PROFILE_DEN_VALUES',
      payload: denomination[
        userData.Profile.religion === 'Islam'
          ? 'Muslim'
          : userData.Profile.religion
      ].map(x => x.name),
    });

    if (paramKey == 'Smoke') {
      setSmokeBtns(handleDefaultChosenValues(value, smokeBtns));
    } else if (paramKey == 'Diet') {
      setDietBtns(handleDefaultChosenValues(value, dietBtns));
    }
  }, [value]);

  const addRemovechoice = (item, title, arr, index) => {
    if (item.title == title) {
      arr.map(x => (x.title != title ? (x.selected = false) : x.selected));
    }
    arr.map(x => (x.title == title ? (x.selected = false) : x.selected));
    let dummyArr = [...arr];
    dummyArr[index].selected = !item.selected;
    title == 'None' ? setSmokeBtns(dummyArr) : setDietBtns(dummyArr);
  };

  const RenderButton = ({Array, paramKey, type}) => {
    return (
      <>
        <PreferenceTextName PreferenceTextName={paramKey} />
        {type == 'Drink' ? (
          Array.length > 0 &&
          Array.map((item, index) => (
            <Button
              key={index}
              onPress={() => {
                setTextVal(item.title);
              }}
              OnBoadringBtn
              YesNoBtnStyle={{
                width: '60%',
                marginVertical: 8,
                paddingVertical: '2.5%',
                backgroundColor:
                  textVal == item.title ? colors.primaryPink : colors.white,
              }}
              width={23}
              height={23}
              imgStyle={{marginRight: 7}}
              btnTitleStyle={{
                fontSize: 15,
                color:
                  textVal == item.title ? colors.white : colors.primaryPink,
              }}
              btnIcon={item.btnIcon}
              title={item.title}
              tint={textVal == item.title ? true : false}
            />
          ))
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {/HaveKids|WantKids|Relocate/.test(type)
              ? Array.map((item, index) => (
                  <Button
                    key={index}
                    onPress={() => setInd(index)}
                    YesNoBtn
                    YesNoBtnStyle={{
                      width: '45%',
                      borderColor:
                        item.title == 'No'
                          ? colors.darkBlue
                          : colors.primaryPink,
                      backgroundColor:
                        ind == index && item.title == 'No'
                          ? colors.darkBlue
                          : ind == index && item.title == 'Yes'
                          ? colors.primaryPink
                          : colors.white,
                    }}
                    width={23}
                    height={23}
                    imgStyle={{marginRight: 7}}
                    btnTitleStyle={{
                      fontSize: 16,
                      color:
                        ind == index
                          ? colors.white
                          : item.title == 'No'
                          ? colors.darkBlue
                          : colors.primaryPink,
                    }}
                    btnIcon={item.btnIcon}
                    title={item.title}
                  />
                ))
              : Array.map((item, index) => {
                  return (
                    <Button
                      onPress={() => {
                        if (/Smoke/.test(type)) {
                          addRemovechoice(item, 'None', smokeBtns, index);
                        } else if (/Diet/.test(type)) {
                          addRemovechoice(item, 'Anything', dietBtns, index);
                        }
                      }}
                      OnBoadringBtn
                      YesNoBtnStyle={{
                        width: '48%',
                        marginBottom: 22,
                        backgroundColor:
                          item.selected == true
                            ? colors.primaryPink
                            : colors.white,
                      }}
                      width={23}
                      height={23}
                      imgStyle={{marginRight: 7}}
                      btnTitleStyle={{
                        fontSize: 16,
                        color:
                          item.selected == true
                            ? colors.white
                            : colors.primaryPink,
                      }}
                      btnIcon={item.btnIcon}
                      title={item.title}
                      tint={item.selected}
                    />
                  );
                })}
          </View>
        )}
      </>
    );
  };

  const onSave = () => {
    let letterRegExp = /[^a-zA-z\/\.' ]+$/;
    if (
      !/HaveKids|WantKids|Relocate/.test(paramKey) &&
      paramKey != 'TagLine' &&
      textVal == ''
    ) {
      Alerts('error', 'Please enter value.');
    } else if (textVal == userData?.firstName) {
      Alerts('error', 'Please enter new value.');
    } else if (paramKey != 'Height' && letterRegExp.test(textVal)) {
      Alerts('error', 'Please enter alphabets only.');
    } else if (token != null) {
      setLoading(true);
      let formData = new FormData();

      switch (paramKey) {
        case 'TagLine':
          formData.append('tagline', tagline);
          break;
        case 'FirstName':
          formData.append('firstName', textVal);
          break;
        case 'Height':
          formData.append('height', sliderVal[0]);
          break;
        case 'FamilyOrigin':
          formData.append('familyOrigin', textVal);
          break;
        case 'Community':
          formData.append('community', textVal);
          break;
        case 'Languages':
          formData.append('languages[]', textVal);
          break;
        case 'Religion':
          formData.append('religion', textVal);
          if (denomination) {
            dispatch({
              type: 'PROFILE_DEN_VALUES',
              payload: denomination[userData.Profile.religion].map(x => x.name),
            });
          }
          break;
        case 'Denomination':
          formData.append('denomination', textVal);
          break;
        case 'EducationLevel':
          formData.append('education', textVal);
          break;
        case 'College/University':
          formData.append('school', textVal);
          break;
        case 'Occupation&Company':
          formData.append('occupation', textVal);
          break;
        case 'PracticingLevel':
          formData.append('practiceLevel', textVal);
          break;
        case 'Pray':
          formData.append('iPray', textVal);
          break;
        case 'Drink':
          formData.append('iDrink', textVal);
          break;
        case 'Smoke':
          smokeBtns.map(x => {
            if (x.selected == true) {
              btnChoice.push(x.title);
            }
          });
          btnChoice.map((x, index) => {
            formData.append(`smokeChoices[]`, x);
          });
          break;
        case 'Diet':
          dietBtns.map(x => {
            if (x.selected == true) {
              btnChoice.push(x.title);
            }
          });
          btnChoice.map((x, index) => {
            formData.append(`dietChoices[]`, x);
          });
          break;
        case 'Marital':
          formData.append('maritalHistory', textVal);
          break;
        case 'HaveKids':
          formData.append('haveKids', ind == 0 ? true : false);
          break;
        case 'WantKids':
          formData.append('wantKids', ind == 0 ? true : false);
          break;
        case 'Relocate':
          formData.append('willingToRelocate', ind == 0 ? true : false);
          break;

        default:
          return null;
      }

      ProfileServices.updateProfile(formData, token)
        .then(res => {
          handleStatusCode(res);
          if (res.data.status >= 200 && res.data.status <= 299) {
            dispatch({
              type: 'AUTH_USER',
              payload: res.data.data.user,
            });
            Alerts('success', res.data.message);
            props.navigation.goBack();
          }
        })
        .catch(err => console.log('err', err))
        .finally(() => setLoading(false));
    }
  };

  const handleSliderValue = (label, val) => {
    switch (label) {
      case 'height':
        setSliderVal(val);
        break;
      case 'religious':
        if (val[0] == 1) {
          setTextVal('Rarely Religious');
        } else if (val[0] == 2) {
          setTextVal('Somewhat Religious');
        } else if (val[0] == 3) {
          setTextVal('Religious');
        } else {
          setTextVal('Strongly Religious');
        }
        break;
      case 'pray':
        if (val[0] == 1) {
          setTextVal(`Don't pray`);
        } else if (val[0] == 2) {
          setTextVal('Sometimes');
        } else if (val[0] == 3) {
          setTextVal('Often');
        } else {
          setTextVal('Regularly');
        }
        break;
      case 'ideal':
        if (val[0] == 1) {
          setTextVal(`0.5 year`);
        } else if (val[0] == 2) {
          setTextVal('1 year');
        } else if (val[0] == 3) {
          setTextVal('2 year');
        } else {
          setTextVal('3 year');
        }
        break;

      default:
        break;
    }
  };

  const getSliderNumberValue = (label, val) => {
    switch (label) {
      case 'religious':
        if (val == 'Rarely Religious') {
          return [1];
        } else if (val == 'Somewhat Religious') {
          return [2];
        } else if (val == 'Religious') {
          return [3];
        } else {
          return [4];
        }

      case 'pray':
        if (val == `Don't pray`) {
          return [1];
        } else if (val == 'Sometimes') {
          return [2];
        } else if (val == 'Often') {
          return [3];
        } else {
          return [4];
        }

      case 'ideal':
        if (val == `0.5 year`) {
          return [1];
        } else if (val == '1 year') {
          return [2];
        } else if (val == '2 year') {
          return [3];
        } else {
          return [4];
        }

      default:
        return [1];
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <HeaderContainer
        goback={'arrow-back'}
        backButton
        Icon
        name={'setting'}
        gobackButtonPress={() => props.navigation.goBack()}
      />

      <View style={styles.container}>
        <View
          style={[
            styles.privacySettingContainer,
            {
              backgroundColor:
                paramKey === 'ProfilePrompt' ? colors.greyWhite : colors.white,
            },
          ]}>
          <ScrollView contentContainerStyle={{paddingHorizontal: '2%'}}>
            {paramKey === 'TagLine' ? (
              <DropDownView
                preferenceName={paramKey}
                TextInput
                nameValue={value}
                onChangeText={setTagline}
                value={tagline}
                placeholder="Your tagline"
                phColor={colors.PremiumGrey}
                textWithoutIconView
              />
            ) : paramKey === 'Vibes' ? (
              props.navigation.navigate('MyVibes', {userVibes: value})
            ) : paramKey === 'ProfilePrompt' ? (
              props.navigation.navigate('ProfilePrompts')
            ) : paramKey === 'FirstName' ? (
              <DropDownView
                preferenceName={paramKey2}
                TextInput
                nameValue={value}
                onChangeText={setTextVal}
                value={textVal}
                placeholder="Your name"
                phColor={colors.PremiumGrey}
                textWithoutIconView
              />
            ) : paramKey === 'FamilyOrigin' ? (
              <DropDownView
                defaultValue={value}
                preferenceName={paramKey2}
                SelectDropdown
                onValueChange={setTextVal}
                DropDownPlaceholder={'Family Origin'}
                data={countries}
                textWithoutIconView
              />
            ) : paramKey === 'Community' ? (
              <DropDownView
                defaultValue={value}
                preferenceName={paramKey2}
                SelectDropdown
                onValueChange={setTextVal}
                DropDownPlaceholder={'Select Community'}
                data={communities}
                textWithoutIconView
              />
            ) : paramKey === 'Languages' ? (
              <View>
                <DropDownView
                  defaultValue={
                    Array.isArray(value) ? value[0].language : value
                  }
                  preferenceName={'Language Spoken'}
                  SelectDropdown
                  onValueChange={setTextVal}
                  DropDownPlaceholder={'Select Language'}
                  data={languages}
                  textWithoutIconView
                />
              </View>
            ) : paramKey === 'Religion' ? (
              <DropDownView
                defaultValue={value}
                preferenceName={paramKey2}
                SelectDropdown
                onValueChange={setTextVal}
                DropDownPlaceholder={'Select Religion'}
                data={religions}
                textWithoutIconView
              />
            ) : paramKey === 'Denomination' ? (
              <DropDownView
                defaultValue={value}
                preferenceName={paramKey2}
                SelectDropdown
                onValueChange={setTextVal}
                DropDownPlaceholder={'Select Denomination'}
                data={den}
                textWithoutIconView
              />
            ) : paramKey === 'EducationLevel' ? (
              <DropDownView
                defaultValue={value}
                preferenceName={paramKey2}
                SelectDropdown
                onValueChange={setTextVal}
                DropDownPlaceholder={'Select Education Level'}
                data={educations}
                textWithoutIconView
              />
            ) : paramKey === 'College/University' ? (
              <DropDownView
                defaultValue={value}
                preferenceName={paramKey2}
                SelectDropdown
                onValueChange={setTextVal}
                DropDownPlaceholder={'Select College'}
                data={colleges}
                textWithoutIconView
              />
            ) : paramKey === 'Occupation&Company' ? (
              <DropDownView
                preferenceName={paramKey2}
                TextInput
                nameValue={value}
                onChangeText={setTextVal}
                value={textVal}
                placeholder="Your occupation"
                phColor={colors.PremiumGrey}
                textWithoutIconView
              />
            ) : paramKey === 'Height' ? (
              <SliderView
                enableLabel={true}
                customLabel="cm"
                textWithoutIconView
                preferenceName={paramKey2}
                multiSliderValue={[sliderVal[0]]}
                min={92}
                max={252}
                multiSliderValuesChange={val => {
                  handleSliderValue('height', val);
                }}
              />
            ) : paramKey === 'PracticingLevel' ? (
              <SliderView
                enableLabel={true}
                customLabel="religious"
                textWithoutIconView
                preferenceName={paramKey2}
                multiSliderValue={getSliderNumberValue('religious', value)}
                min={1}
                max={4}
                showSteps={true}
                showStepLabels={false}
                multiSliderValuesChange={val => {
                  handleSliderValue('religious', val);
                }}
              />
            ) : paramKey === 'Pray' ? (
              <SliderView
                enableLabel={true}
                customLabel={'pray'}
                textWithoutIconView
                preferenceName={'I Pray:'}
                multiSliderValue={getSliderNumberValue('pray', value)}
                min={1}
                max={4}
                showSteps={true}
                showStepLabels={false}
                multiSliderValuesChange={val => {
                  handleSliderValue('pray', val);
                }}
              />
            ) : paramKey === 'Drink' ? (
              <RenderButton
                Array={Drink}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : paramKey === 'Smoke' ? (
              <RenderButton
                Array={smokeBtns}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : paramKey === 'Diet' ? (
              <RenderButton
                Array={dietBtns}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : paramKey === 'Marital' ? (
              <DropDownView
                defaultValue={value}
                preferenceName={paramKey2}
                SelectDropdown
                onValueChange={setTextVal}
                data={martialHistory}
                textWithoutIconView
              />
            ) : paramKey === 'HaveKids' ? (
              <RenderButton
                Array={optionButtons}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : paramKey === 'WantKids' ? (
              <RenderButton
                Array={optionButtons}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : paramKey === 'Relocate' ? (
              <RenderButton
                Array={optionButtons}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : null}
            <View style={{marginVertical: '6%'}}>
              <Button
                loading={loading}
                onPress={onSave}
                btnTitleStyle={{alignItems: 'center'}}
                YesNoBtn
                YesNoBtnStyle={{width: '100%', paddingVertical: '3%'}}
                title={'Save'}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default TalhaDemo;
