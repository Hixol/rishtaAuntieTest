import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnBoardingServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { useHelper } from "../../hooks/useHelper";

import styles from "./styles";
import colors from "../../utility/colors";
import HeaderContainer from "../../components/containers/headerContainer";
import Button from "../../components/buttons/Button";
import SliderView from "../../components/Modal/Slider";
import DropDownView from "../../components/Modal/DropDown";
import PreferenceTextName from "../../components/containers/PreferenceTextName";
import UserService from "../../services/UserService";

const MySearchPreferencesEditScreen = (props) => {
  const dispatch = useDispatch();
  const { Alerts, handleStatusCode } = useHelper();
  const { token } = useSelector((store) => store.userReducer);
  const { paramKey, paramKey2, value } = props.route.params;

  let [distance, setDistance] = useState(
    value?.distance === "unlimited" || value?.distance === "nationwide"
      ? value?.distance
      : "range"
  );

  let [distanceSlider, setDistanceSlider] = useState(
    value?.distance === "range" && value.distance !== null
      ? parseInt(value?.distance)
      : parseInt(value?.distance)
  );

  let [age, setAge] = useState(
    (value?.ageFrom === null && value?.ageTo === null) ||
      (value?.ageFrom === undefined && value?.ageTo === undefined)
      ? [null]
      : [value?.ageFrom, value?.ageTo]
  );

  const [heightSlider, setHeightSlider] = useState(
    (value?.heightFrom === null && value?.heightTo === null) ||
      (value?.heightFrom === undefined && value?.heightTo === undefined)
      ? [null]
      : [value?.heightFrom, value?.heightTo]
  );

  const [textVal, setTextVal] = useState(
    value?.theyPray !== null ? value?.theyPray : ""
  );
  const [religion, setReligion] = useState(value?.religion);
  const [fOrigin, setFOrigin] = useState(value?.familyOrigin);
  const [community, setCommunity] = useState(value?.community);
  const [languages, setLanguages] = useState(value.languagesSpoken);
  const [denomination, setDenomination] = useState(value.religiousDenomination);
  const [pray, setPray] = useState(value.theyPray);
  const [drink, setDrink] = useState(value.drinking);
  const [smokeChoice, setSmokeChoice] = useState(value.smoking);
  const [dietChoice, setDietChoice] = useState(value.dietChoices);
  const [maritalHistory, setMaritalHistory] = useState(value.maritalHistory);
  const [haveKids, setHaveKids] = useState(value.haveKids);
  const [wantKids, setWantKids] = useState(value.wantKids);
  const [relocate, setRelocate] = useState(value.willingToRelocate);

  const [languageList, setLanguageList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [familyOriginList, setFamilyOriginList] = useState([]);
  const [occupationList, setOccupationList] = useState([]);
  const [denominationList, setDenominationList] = useState([]);
  const [religionList, setReligionList] = useState([]);

  const boolTypes = {
    haveKids: "haveKids",
    wantKids: "wantKids",
    relocate: "relocate",
    yesBtnStyle: {
      width: "45%",
    },
    yesBtnTitle: {
      fontSize: 18,
      fontFamily: "Inter-Regular",
    },
    noBtnStyle: {
      width: "45%",
      borderColor: colors.primaryBlue,
    },
    noBtnTitle: {
      fontSize: 18,
      fontFamily: "Inter-Regular",
    },
  };

  useEffect(() => {
    OnBoardingServices.profileValues(
      encodeURI(
        JSON.stringify([
          "college",
          "community",
          "denomination",
          "familyOrigin",
          "language",
          "occupation",
        ])
      )
    )
      .then((res) => {
        handleStatusCode(res);
        if (res.data.status >= 200 && res.data.status <= 299) {
          let data = res?.data?.data;

          setReligionList(Object.keys(data?.denomination)),
            setFamilyOriginList(data?.familyOrigin.map((x) => x.name));

          setCommunityList(data?.community.map((x) => x.name));
          setLanguageList(data?.language.map((x) => x.name));
          setOccupationList(data?.occupation.map((x) => x.name));
          setDenominationList(data?.denomination[religion]?.map((x) => x.name));
        }
      })
      .catch((err) => console.log("profileValues err", err));
  }, []);

  useEffect(() => {
    if (paramKey == "smoke") {
      if (Boolean(value[0].choice)) {
        smokeBtns.findIndex((x) => {
          for (let i = 0; i < value.length; i++) {
            if (value[i].choice == x.title) {
              addRemovechoice(smokeBtns[i], "None", smokeBtns, i);
            }
          }
        });
      }
    } else if (paramKey == "diet") {
      if (Boolean(value[0].choice)) {
        dietBtns.findIndex((x) => {
          for (let i = 0; i < value.length; i++) {
            if (value[i].choice == x.title) {
              addRemovechoice(dietBtns[i], "Anything", dietBtns, i);
            }
          }
        });
      }
    }
  }, [value]);

  const UpdateUserPreference = () => {
    if (token != null) {
      const body = {
        distance: distance === "range" ? distanceSlider.toString() : distance,
        ageFrom: age[0],
        ageTo: age[1],
        religion: religion,
        familyOrigin: fOrigin,
        heightFrom: 4,
        heightTo: 10,
        community: community,
        languagesSpoken: languages,
        religiousDenomination: denomination,
        theyPray: pray,
        drinking: drink,
        smoking: smokeChoice,
        dietChoices: dietChoice,
        maritalHistory: maritalHistory,
        haveKids: haveKids,
        wantKids: wantKids,
        willingToRelocate: relocate,
      };

      UserService.searchUserPreference(body, token)
        .then((res) => {
          handleStatusCode(res);
          if (res.data.status >= 200 && res.data.status <= 299) {
            dispatch({
              type: "SET_PREFERENCE_FILTER",
              payload: true,
            });
            props.navigation.goBack();
          }
        })
        .catch((err) => console.log("searchUserPreference err", err));
    } else {
      Alerts("error", "Your token has expired. Please login again.");
    }
  };

  const maritalStatusList = ["None", "Divorced", "Widowed", "Annulled"];

  const Drink = [
    {
      id: 1,
      title: "I Drink",
      btnIcon: require("../../assets/iconimages/drink.png"),
    },
    {
      id: 2,
      title: "Don't Drink",
      btnIcon: require("../../assets/iconimages/no-glass.png"),
    },
  ];

  const getSliderNumberValue = (label, val) => {
    switch (label) {
      case "religious":
        if (val == "Rarely Religious") {
          return [1];
        } else if (val == "Somewhat Religious") {
          return [2];
        } else if (val == "Religious") {
          return [3];
        } else {
          return [4];
        }

      case "pray":
        if (val == `Don't pray`) {
          return [1];
        } else if (val == "Sometimes") {
          return [2];
        } else if (val == "Often") {
          return [3];
        } else if (val == "Regularly") {
          return [4];
        } else {
          return [0];
        }

      case "ideal":
        if (val == `0.5 year`) {
          return [1];
        } else if (val == "1 year") {
          return [2];
        } else if (val == "2 year") {
          return [3];
        } else {
          return [4];
        }

      default:
        return [1];
    }
  };

  const handleSliderValue = (label, val) => {
    switch (label) {
      case "religious":
        if (val[0] == 1) {
          setTextVal("Rarely Religious");
        } else if (val[0] == 2) {
          setTextVal("Somewhat Religious");
        } else if (val[0] == 3) {
          setTextVal("Religious");
        } else {
          setTextVal("Strongly Religious");
        }
        break;
      case "pray":
        if (val[0] == 1 || val[0] == 0) {
          setPray(`Don't pray`);
        } else if (val[0] == 2) {
          setPray("Sometimes");
        } else if (val[0] == 3) {
          setPray("Often");
        } else {
          setPray("Regularly");
        }
        break;
      case "ideal":
        if (val[0] == 1) {
          setTextVal(`0.5 year`);
        } else if (val[0] == 2) {
          setTextVal("1 year");
        } else if (val[0] == 3) {
          setTextVal("2 year");
        } else {
          setTextVal("3 year");
        }
        break;

      default:
        break;
    }
  };

  const [smokeBtns, setSmokeBtns] = useState([
    {
      id: 1,
      title: "Hookah",
      btnIcon: require("../../assets/iconimages/Hookah-01.png"),
      selected: false,
    },
    {
      id: 2,
      title: "Cigarette",
      btnIcon: require("../../assets/iconimages/Cigarette.png"),
      selected: false,
    },
    {
      id: 3,
      title: "Weed",
      btnIcon: require("../../assets/iconimages/Weed-01.png"),
      selected: false,
    },
    {
      id: 4,
      title: "None",
      btnIcon: require("../../assets/iconimages/no.png"),
      selected: false,
    },
  ]);
  const [dietBtns, setDietBtns] = useState([
    {
      id: 1,
      title: "Halal",
      btnIcon: require("../../assets/iconimages/Halal.png"),
      selected: false,
    },

    {
      id: 2,
      title: "Vegan",
      btnIcon: require("../../assets/iconimages/Vegan-01.png"),
      selected: false,
    },
    {
      id: 3,
      title: "Vegetarian",
      btnIcon: require("../../assets/iconimages/Vegetarian-01.png"),
      selected: false,
    },

    {
      id: 4,
      title: "Anything",
      btnIcon: require("../../assets/iconimages/Anything-01.png"),
      selected: false,
    },
  ]);

  const distanceList = ["unlimited", "nationwide", "range"];

  const addRemovechoice = (item, title, arr, index) => {
    if (item.title == title) {
      arr.map((x) => (x.title != title ? (x.selected = false) : x.selected));
    }
    arr.map((x) => (x.title == title ? (x.selected = false) : x.selected));
    let dummyArr = [...arr];
    dummyArr[index].selected = !item.selected;
    title == "None" ? setSmokeBtns(dummyArr) : setDietBtns(dummyArr);
  };

  const RenderButton = ({ Array, paramKey, type }) => {
    return (
      <>
        <PreferenceTextName PreferenceTextName={paramKey} />
        {type == "Drink" ? (
          Array.length > 0 &&
          Array.map((item, index) => (
            <Button
              key={index}
              onPress={() => {
                setDrink(item.title);
              }}
              OnBoadringBtn
              YesNoBtnStyle={{
                width: "60%",
                marginVertical: 8,
                paddingVertical: "2.5%",
                backgroundColor:
                  drink == item.title ? colors.primaryPink : colors.white,
              }}
              width={23}
              height={23}
              imgStyle={{ marginRight: 7 }}
              btnTitleStyle={{
                fontSize: 15,
                color: drink == item.title ? colors.white : colors.primaryPink,
              }}
              btnIcon={item.btnIcon}
              title={item.title}
              tint={drink == item.title ? true : false}
            />
          ))
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {/HaveKids|WantKids|Relocate/.test(type)
              ? Array.map((item, index) => (
                  <Button
                    key={index}
                    onPress={() => setInd(index)}
                    YesNoBtn
                    YesNoBtnStyle={{
                      width: "45%",
                      borderColor:
                        item.title == "No"
                          ? colors.darkBlue
                          : colors.primaryPink,
                      backgroundColor:
                        ind == index && item.title == "No"
                          ? colors.darkBlue
                          : ind == index && item.title == "Yes"
                          ? colors.primaryPink
                          : colors.white,
                    }}
                    width={23}
                    height={23}
                    imgStyle={{ marginRight: 7 }}
                    btnTitleStyle={{
                      fontSize: 16,
                      color:
                        ind == index
                          ? colors.white
                          : item.title == "No"
                          ? colors.darkBlue
                          : colors.primaryPink,
                    }}
                    btnIcon={item.btnIcon}
                    title={item.title}
                  />
                ))
              : Array.map((item, index) => {
                  return type == "Diet" ? (
                    <Button
                      onPress={() => setDietChoice(item.title)}
                      OnBoadringBtn
                      YesNoBtnStyle={{
                        width: "48%",
                        marginBottom: 22,
                        backgroundColor:
                          item.title == dietChoice
                            ? colors.primaryPink
                            : colors.white,
                      }}
                      width={23}
                      height={23}
                      imgStyle={{ marginRight: 7 }}
                      btnTitleStyle={{
                        fontSize: 16,
                        color:
                          item.title == dietChoice
                            ? colors.white
                            : colors.primaryPink,
                      }}
                      btnIcon={item.btnIcon}
                      title={item.title}
                      tint={item.title == dietChoice}
                    />
                  ) : (
                    <Button
                      onPress={() => setSmokeChoice(item.title)}
                      OnBoadringBtn
                      YesNoBtnStyle={{
                        width: "48%",
                        marginBottom: 22,
                        backgroundColor:
                          item.title == smokeChoice
                            ? colors.primaryPink
                            : colors.white,
                      }}
                      width={23}
                      height={23}
                      imgStyle={{ marginRight: 7 }}
                      btnTitleStyle={{
                        fontSize: 16,
                        color:
                          item.title == smokeChoice
                            ? colors.white
                            : colors.primaryPink,
                      }}
                      btnIcon={item.btnIcon}
                      title={item.title}
                      tint={item.title == smokeChoice}
                    />
                  );
                })}
          </View>
        )}
      </>
    );
  };

  const Distance = (value) => {
    setDistance(value);
  };

  const DistanceSlider = (value) => {
    setDistanceSlider(value);
  };

  const AgeSliderValuesChange = (value) => {
    setAge(value);
  };

  const Religion = (value) => {
    setReligion(value);
  };

  const familyOrigin = (value) => {
    setFOrigin(value);
  };

  const HeightSliderValuesChange = (values) => {
    setHeightSlider(values);
  };

  const Community = (value) => {
    setCommunity(value);
  };

  const Languages = (value) => {
    setLanguages(value);
  };

  const ReligiousDenomination = (value) => {
    setDenomination(value);
  };

  const MaritalHistory = (value) => {
    setMaritalHistory(value);
  };

  const handleBoolValues = (type, flag) => {
    if (type == boolTypes.haveKids) {
      setHaveKids(flag);
    } else if (type == boolTypes.wantKids) {
      setWantKids(flag);
    } else if (type == boolTypes.relocate) {
      setRelocate(flag);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderContainer
        goback={"arrow-back"}
        backButton
        Icon
        name={"setting"}
        gobackButtonPress={() => props.navigation.goBack()}
      />

      <View style={styles.container}>
        <View style={styles.privacySettingContainer}>
          <View>
            {paramKey === "Distance" ? (
              <View>
                <DropDownView
                  preferenceName={paramKey2}
                  onValueChange={Distance}
                  SelectDropdown
                  defaultValue={
                    value?.distance === "unlimited" ||
                    value?.distance === "nationwide"
                      ? value?.distance
                      : distance
                  }
                  DropDownPlaceholder={value?.distance}
                  data={distanceList}
                  textWithIconView
                  preferenceIcon={require("../../assets/iconimages/location.png")}
                />
                {distance === "range" ? (
                  <SliderView
                    sp={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    multiSliderValue={[
                      value?.distance === "unlimited" ||
                      value?.distance === "nationwide"
                        ? 0
                        : parseInt(value?.distance),
                    ]}
                    multiSliderValuesChange={DistanceSlider}
                    min={0}
                    max={2000}
                    preferenceName={paramKey2}
                    customLabel="mi"
                    enableLabel={true}
                    step={1}
                  />
                ) : null}
              </View>
            ) : paramKey === "Age" ? (
              <SliderView
                sp={{ marginVertical: "1%" }}
                searchPreferences
                textWithoutIconView
                multiSliderValue={
                  heightSlider[0] !== null && heightSlider[1] !== null
                    ? [heightSlider[0], heightSlider[1]]
                    : [4, 10]
                }
                isMarkersSeparated={true}
                showSteps={true}
                multiSliderValuesChange={HeightSliderValuesChange}
                min={4}
                max={10}
                preferenceName={paramKey2}
                customLabel="feet"
                enableLabel={true}
                step={0.1}
              />
            ) : paramKey === "Religion" ? (
              <DropDownView
                textWithIconView
                preferenceIcon={require("../../assets/iconimages/myReligion.png")}
                onValueChange={Religion}
                preferenceName={paramKey2}
                SelectDropdown
                defaultValue={value?.religion}
                DropDownPlaceholder={value?.religion}
                data={religionList}
              />
            ) : paramKey === "Origin" ? (
              <DropDownView
                onValueChange={familyOrigin}
                preferenceName={paramKey2}
                SelectDropdown
                defaultValue={fOrigin}
                DropDownPlaceholder={fOrigin}
                data={familyOriginList}
                textWithIconView
                preferenceIcon={require("../../assets/iconimages/familyOrigin.png")}
              />
            ) : paramKey === "Height" ? (
              <SliderView
                sp={{ marginVertical: "1%" }}
                searchPreferences
                textWithoutIconView
                multiSliderValue={
                  heightSlider[0] !== null && heightSlider[1] !== null
                    ? [heightSlider[0], heightSlider[1]]
                    : [4, 10]
                }
                isMarkersSeparated={true}
                showSteps={true}
                multiSliderValuesChange={HeightSliderValuesChange}
                min={4}
                max={10}
                preferenceName={paramKey2}
                customLabel="feet"
                enableLabel={true}
                step={0.1}
              />
            ) : paramKey === "Community" ? (
              <DropDownView
                onValueChange={Community}
                preferenceName={paramKey2}
                SelectDropdown
                defaultValue={value?.community}
                DropDownPlaceholder={value?.community}
                data={communityList}
                textWithoutIconView
              />
            ) : paramKey === "Languages" ? (
              <DropDownView
                onValueChange={Languages}
                preferenceName={paramKey2}
                SelectDropdown
                defaultValue={value?.languagesSpoken}
                DropDownPlaceholder={value?.languagesSpoken}
                data={languageList}
                textWithoutIconView
              />
            ) : paramKey === "Religious" ? (
              <DropDownView
                onValueChange={ReligiousDenomination}
                preferenceName={paramKey2}
                SelectDropdown
                defaultValue={denomination}
                DropDownPlaceholder={"Select On"}
                data={denominationList}
                textWithoutIconView
              />
            ) : paramKey === "Pray" ? (
              <SliderView
                enableLabel={true}
                customLabel={"pray"}
                textWithoutIconView
                preferenceName={paramKey2}
                multiSliderValue={getSliderNumberValue("pray", pray)}
                min={1}
                max={4}
                showSteps={true}
                showStepLabels={false}
                multiSliderValuesChange={(val) => {
                  handleSliderValue("pray", val);
                }}
              />
            ) : paramKey === "Drink" ? (
              <RenderButton
                Array={Drink}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : paramKey === "Smoke" ? (
              <RenderButton
                Array={smokeBtns}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : paramKey === "Diet" ? (
              <RenderButton
                Array={dietBtns}
                paramKey={paramKey2}
                type={paramKey}
              />
            ) : paramKey === "Marital" ? (
              <DropDownView
                onValueChange={MaritalHistory}
                preferenceName={paramKey2}
                SelectDropdown
                DropDownPlaceholder={value?.maritalHistory}
                defaultValue={value?.maritalHistory}
                data={maritalStatusList}
                textWithoutIconView
              />
            ) : paramKey === "HaveKids" ? (
              <View>
                <View style={styles.kidsCont}>
                  <View style={styles.textView}>
                    <Text style={styles.detailsTxt}>Has Kids?</Text>
                  </View>
                </View>
                <View style={styles.btnView}>
                  <Button
                    onPress={() => handleBoolValues(boolTypes.haveKids, true)}
                    YesNoBtn
                    title={"Yes"}
                    YesNoBtnStyle={[
                      boolTypes.yesBtnStyle,
                      { backgroundColor: haveKids ? colors.primaryPink : null },
                    ]}
                    btnTitleStyle={[
                      boolTypes.yesBtnTitle,
                      { color: haveKids ? colors.white : colors.primaryPink },
                    ]}
                  />
                  <Button
                    onPress={() => handleBoolValues(boolTypes.haveKids, false)}
                    YesNoBtn
                    title={"No"}
                    YesNoBtnStyle={[
                      boolTypes.noBtnStyle,
                      {
                        backgroundColor:
                          haveKids == false ? colors.primaryBlue : null,
                      },
                    ]}
                    btnTitleStyle={[
                      boolTypes.noBtnTitle,
                      {
                        color:
                          haveKids == false ? colors.white : colors.primaryBlue,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : paramKey === "WantKids" ? (
              <View>
                <View style={styles.kidsCont}>
                  <View style={styles.textView}>
                    <Text style={styles.detailsTxt}>Wants Kids?</Text>
                  </View>
                </View>
                <View style={styles.btnView}>
                  <Button
                    onPress={() => handleBoolValues(boolTypes.wantKids, true)}
                    YesNoBtn
                    title={"Yes"}
                    YesNoBtnStyle={[
                      boolTypes.yesBtnStyle,
                      { backgroundColor: wantKids ? colors.primaryPink : null },
                    ]}
                    btnTitleStyle={[
                      boolTypes.yesBtnTitle,
                      { color: wantKids ? colors.white : colors.primaryPink },
                    ]}
                  />
                  <Button
                    onPress={() => handleBoolValues(boolTypes.wantKids, false)}
                    YesNoBtn
                    title={"No"}
                    YesNoBtnStyle={[
                      boolTypes.noBtnStyle,
                      {
                        backgroundColor:
                          wantKids == false ? colors.primaryBlue : null,
                      },
                    ]}
                    btnTitleStyle={[
                      boolTypes.noBtnTitle,
                      {
                        color:
                          wantKids == false ? colors.white : colors.primaryBlue,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : paramKey === "Relocate" ? (
              <View>
                <View style={styles.kidsCont}>
                  <View style={styles.textView}>
                    <Text style={styles.detailsTxt}>Willing to relocate?</Text>
                  </View>
                </View>
                <View style={styles.btnView}>
                  <Button
                    onPress={() => handleBoolValues(boolTypes.relocate, true)}
                    YesNoBtn
                    title={"Yes"}
                    YesNoBtnStyle={[
                      boolTypes.yesBtnStyle,
                      { backgroundColor: relocate ? colors.primaryPink : null },
                    ]}
                    btnTitleStyle={[
                      boolTypes.yesBtnTitle,
                      { color: relocate ? colors.white : colors.primaryPink },
                    ]}
                  />
                  <Button
                    onPress={() => handleBoolValues(boolTypes.relocate, false)}
                    YesNoBtn
                    title={"No"}
                    YesNoBtnStyle={[
                      boolTypes.noBtnStyle,
                      {
                        backgroundColor:
                          relocate == false ? colors.primaryBlue : null,
                      },
                    ]}
                    btnTitleStyle={[
                      boolTypes.noBtnTitle,
                      {
                        color:
                          relocate == false ? colors.white : colors.primaryBlue,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : null}

            <View style={{ marginVertical: "5%" }}>
              <Button
                onPress={() => UpdateUserPreference()}
                btnTitleStyle={{ alignItems: "center" }}
                YesNoBtn
                title={"Save"}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default MySearchPreferencesEditScreen;
