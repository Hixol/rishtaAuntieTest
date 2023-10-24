import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { windowWidth } from "../../utility/size";
import { useSelector } from "react-redux";
import { useHelper } from "../../hooks/useHelper";

import styles from "./styles";
import Button from "../../components/buttons/Button";
import PersonalityServices from "../../services/PersonalityServices";
import colors from "../../utility/colors";
import * as Progress from "react-native-progress";
import BottomButton from "../../components/buttons/BottomButton";

let isSubmitted = true;

const PersonalityQuiz = (props) => {
  const { Alerts, handleStatusCode } = useHelper();
  const { token } = useSelector((store) => store.userReducer);

  let [finalQuiz, setFinalQuiz] = useState([]),
    [outerIndex, setOuterIndex] = useState(0),
    [innerIndex, setInnerIndex] = useState(0),
    [index, setIndex] = useState(null),
    [quiz, setQuiz] = useState([]),
    [loading, setLoading] = useState(false),
    [showBtn, setShowBtn] = useState(false),
    [afterSave, setAfterSave] = useState(false),
    [progress, setProgress] = useState(0),
    [selectedQuestions, setSelectedQuestions] = useState([]),
    [qCounter, setQCounter] = useState(2);

  useEffect(() => {
    setLoading(true);
    PersonalityServices.getQuestions()
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          let data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            setQuiz((prevState) => [
              ...prevState,
              {
                type: data[i].type,
                qna: Object.values(data[i].questionAndAnswers),
              },
            ]);
          }
          setFinalQuiz([
            {
              type: data[0]?.type,
              qna: [data[0]?.questionAndAnswers[innerIndex]],
            },
          ]);
          setInnerIndex((prevState) => prevState + 1);
        }
      })
      .catch((err) => {
        if (err?.message.includes("Network")) {
          Alerts("error", err.message);
        } else {
          console.log("Personality questions err", err);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      isSubmitted = true;
    };
  }, []);

  const onNext = () => {
    setQCounter((prevState) => prevState + 2);
    if (index != null) {
      if (
        quiz[outerIndex]?.qna[innerIndex] !=
        finalQuiz[outerIndex]?.qna[innerIndex]
      ) {
        setFinalQuiz((prevState) =>
          prevState.map((el) => {
            if (el.type == quiz[outerIndex].type) {
              return {
                ...el,
                qna: [quiz[outerIndex].qna[innerIndex]],
              };
            } else {
              return el;
            }
          })
        );
        setInnerIndex((prevState) => prevState + 1);
        if (
          outerIndex == quiz.length - 1 &&
          innerIndex == quiz[outerIndex].qna.length - 1
        ) {
          setShowBtn(true);
        }
      } else {
        setOuterIndex((prevState) => prevState + 1);
        setInnerIndex(1);
        let obj = {
          type: quiz[outerIndex + 1].type,
          qna: [quiz[outerIndex + 1].qna[0]],
        };
        setFinalQuiz([obj]);
      }

      if (
        quiz[outerIndex]?.type == selectedQuestions[outerIndex]?.type &&
        quiz[outerIndex]?.qna.length !=
          selectedQuestions[outerIndex]?.qna.length
      ) {
        setProgress(qCounter / 50);
        setSelectedQuestions((prevState) =>
          prevState.map((item) => {
            if (item.type == quiz[outerIndex].type) {
              return {
                ...item,
                qna: [
                  ...prevState[outerIndex].qna,
                  finalQuiz[0]?.qna[0][index],
                ],
              };
            } else {
              return item;
            }
          })
        );
      } else {
        setProgress(qCounter / 50);
        setSelectedQuestions((prevState) => [
          ...prevState,
          {
            type: quiz[outerIndex].type,
            qna: [finalQuiz[0]?.qna[0][index]],
          },
        ]);
      }
      setIndex(null);
    } else {
      Alerts("error", "Please choose one that applies to you!");
    }
  };

  useEffect(() => {
    if (afterSave == true) {
      let obj = {};
      for (let i = 0; i < selectedQuestions.length; i++) {
        obj[selectedQuestions[i].type] = selectedQuestions[i]?.qna;
      }
      setAfterSave(false);
      isSubmitted = false;

      PersonalityServices.solveQuestions(obj, token)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            Alerts("success", res.data.message);
            props.navigation.navigate("BottomTab", {
              screen: "Settings",
            });
          }
        })
        .catch((err) => {
          if (err?.message.includes("Network")) {
            Alerts("error", err.message);
          } else {
            console.log("Personality solve questions err", err);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [selectedQuestions]);

  const onSave = async () => {
    if (isSubmitted) {
      setLoading(true);
      setAfterSave(true);
      setProgress(qCounter / 50);
      setSelectedQuestions((prevState) =>
        prevState.map((item) => {
          if (item.type == quiz[outerIndex].type) {
            return {
              ...item,
              qna: [...prevState[outerIndex].qna, finalQuiz[0]?.qna[0][index]],
            };
          } else {
            return item;
          }
        })
      );
    } else {
      Alerts("error", "Something went wrong. Please try again!");
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator
          size={"large"}
          color={colors.primaryPink}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      ) : (
        <SafeAreaView style={styles.container}>
          <Progress.Bar
            progress={progress}
            width={windowWidth * 0.88}
            color={colors.primaryPink}
            height={8}
          />
          <View style={{ flex: 0.8, marginTop: "9%" }}>
            <Text style={[styles.boxText, { marginBottom: "10%" }]}>
              Select the choice that applies to you:
            </Text>
            {finalQuiz.length > 0 ? (
              <FlatList
                data={finalQuiz[0]?.qna}
                key={(item, index) => index.toString()}
                renderItem={({ item }) => {
                  return item?.map((el, i) => {
                    return (
                      <Pressable
                        onPress={() => setIndex(i)}
                        style={[
                          styles.box,
                          index == i ? styles.boxBorder : null,
                        ]}
                      >
                        <Text style={styles.boxText}>{el?.title}</Text>
                      </Pressable>
                    );
                  });
                }}
              />
            ) : null}
          </View>

          {showBtn ? (
            <Button
              onPress={onSave}
              title="Save"
              YesNoBtn
              YesNoBtnStyle={{ paddingVertical: "2.5%" }}
              btnTitleStyle={{ fontSize: 18, fontFamily: "Inter-Medium" }}
            />
          ) : (
            // <Button
            //   onPress={onNext}
            //   title="NEXT"
            //   YesNoBtn
            //   YesNoBtnStyle={{paddingVertical: '2.5%'}}
            //   btnTitleStyle={{fontSize: 18, fontFamily: 'Inter-Medium'}}
            // />
            <BottomButton
              bottomStyles={{ marginBottom: 40 }}
              onPress={onNext}
              text={"NEXT"}
            />
          )}
        </SafeAreaView>
      )}
    </>
  );
};

export default PersonalityQuiz;
