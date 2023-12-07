import React, { useState } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { measureUnits } from "../../utility/regex";
import { windowWidth } from "../../utility/size";

import MultiSlider from "@ptomasroos/react-native-multi-slider";
import colors from "../../utility/colors";
import ToggleSwitch from "toggle-switch-react-native";

const SliderView = props => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);

  return (
    <View
      style={[
        styles.details,
        props.customLabel == "mi" && { marginVertical: 0, marginTop: -18 },
      ]}
    >
      {props.customLabel == "mi" ? null : (
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            backgroundColor: props.bg ? props.bg : colors.white,
            marginHorizontal: props.bg ? "6%" : "2%",
          }}
        >
          {props.textWithIconView ? (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Image
                style={{
                  // marginRight: '3%',
                  width: "9%",
                  height: "100%",
                  // marginLeft: '5%',
                }}
                resizeMode={"contain"}
                source={props.preferenceIcon}
              />

              <Text style={styles.detailsTxt}>{props.preferenceName}</Text>
            </View>
          ) : null}
          {/* {props.textWithoutIconView ? ( */}
          {props.preferenceName == "Age" ? null : (
            <View
              style={[
                {
                  flexDirection: "row",
                  width: "100%",
                  // marginBottom: ,
                },
                props.sp,
              ]}
            >
              <Text
                style={[
                  styles.detailsTxt,
                  props.bg && { fontSize: 14, color: colors.black },
                ]}
              >
                {props.preferenceName}
              </Text>
            </View>
          )}
          {/* ) : null} */}

          {props.deal && (
            <ToggleSwitch
              isOn={isEnabled}
              onColor={colors.primaryPink}
              offColor={colors.mediumGrey}
              labelStyle={{ color: "black", fontFamily: "Inter-Regular" }}
              size="small"
              label="Deal Break?"
              onToggle={toggleSwitch}
            />
          )}
        </View>
      )}
      <View
        style={
          props.customLabel == "mi" ? styles.distanceStyle : styles.ageStyle
        }
      >
        <MultiSlider
          markerStyle={{
            ...Platform.select({
              ios: {
                height: 22,
                width: 22,
                shadowColor: "#000000",
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 1,
                shadowOpacity: 0.1,
                alignSelf: "center",
                position: "relative",
                backgroundColor:
                  props?.customLabel === "practicingLevel" ||
                  props?.customLabel === "marriageTimeline"
                    ? colors.primaryPink
                    : colors.primaryPink,
              },
              android: {
                height: 22,
                width: 22,
                borderRadius: 50,
                marginTop: 5,
                backgroundColor: colors.primaryPink,
              },
            }),
          }}
          pressedMarkerStyle={{
            ...Platform.select({
              android: {
                height: 22,
                width: 22,
                borderRadius: 20,
                backgroundColor: colors.primaryPink,
                alignSelf: "center",
              },
            }),
          }}
          selectedStyle={{
            backgroundColor: colors.primaryPink,
          }}
          trackStyle={{
            backgroundColor: "#CECECE",
            height: 7,
            borderRadius: 10,
          }}
          isMarkersSeparated={props.isMarkersSeparated}
          touchDimensions={{
            height: 40,
            width: 40,
            borderRadius: 20,
            slipDisplacement: 40,
          }}
          values={props.multiSliderValue}
          sliderLength={
            props.preferenceName == "Tag Line"
              ? windowWidth * 0.83
              : props.preferenceName == "Height:"
              ? windowWidth * 0.93
              : windowWidth * 0.8
          }
          onValuesChangeFinish={props.multiSliderValuesChange}
          min={props.min}
          max={props.max}
          step={props.step}
          smoothSnapped={true}
          showStepLabels={true}
          showSteps={true}
          showStepMarkers={true}
          stepMarkerStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            top: -2,
            backgroundColor: colors.PremiumGrey,
          }}
          stepLabelStyle={{ left: 2 }}
          allowOverlap={false}
          snapped={true}
          minMarkerOverlapDistance={10}
          enableLabel={props.enableLabel}
          customLabel={sliderPosition => {
            return (
              <>
                {props.customLabel == "simple" ? (
                  <View
                    style={{
                      position: "absolute",
                      left: sliderPosition.oneMarkerLeftPosition - 6,
                      bottom: 40,
                    }}
                  >
                    <Text style={{ color: colors.black, fontWeight: "700" }}>
                      {sliderPosition.oneMarkerValue}
                    </Text>
                  </View>
                ) : props.customLabel === "practicingLevel" ? (
                  <View>
                    <View
                      style={{
                        position: "absolute",
                        left:
                          sliderPosition.oneMarkerValue === 4
                            ? sliderPosition.oneMarkerLeftPosition - 100
                            : sliderPosition.oneMarkerLeftPosition - 8,
                        top: 40,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.black,
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {/* {index: 0, stepLabel: 'Rarely Religious'},
        {index: 1, stepLabel: 'Somewhat Religious'},
        {index: 2, stepLabel: 'Religious'},
        {index: 3, stepLabel: 'Strongly Religious'}, */}
                        {sliderPosition.oneMarkerValue === 1
                          ? "Rarely Religious"
                          : sliderPosition.oneMarkerValue === 2
                          ? "Somewhat Religious"
                          : sliderPosition.oneMarkerValue === 3
                          ? "Religious"
                          : "Strongly Religious"}
                      </Text>
                    </View>
                  </View>
                ) : props.customLabel === "marriageTimeline" ? (
                  <View>
                    <View
                      style={{
                        position: "absolute",
                        left:
                          sliderPosition.oneMarkerValue === 4
                            ? sliderPosition.oneMarkerLeftPosition - 30
                            : sliderPosition.oneMarkerLeftPosition - 8,
                        top: 40,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.black,
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {sliderPosition.oneMarkerValue === 1
                          ? "1 Year"
                          : sliderPosition.oneMarkerValue === 2
                          ? "2 Years"
                          : sliderPosition.oneMarkerValue === 3
                          ? "3 Years"
                          : "4 Years"}
                      </Text>
                    </View>
                  </View>
                ) : props.customLabel == "feet" ? (
                  props.searchPreferences ? (
                    <View>
                      <View
                        style={{
                          position: "absolute",
                          left: sliderPosition.oneMarkerLeftPosition - 25,
                          top: 40,
                        }}
                      >
                        <Text
                          style={{ color: colors.black, fontWeight: "600" }}
                        >
                          {parseFloat(sliderPosition.oneMarkerValue).toFixed(1)}{" "}
                          ft
                        </Text>
                      </View>

                      <View
                        style={{
                          position: "absolute",
                          left: sliderPosition.twoMarkerLeftPosition - 10,
                          top: -10,
                        }}
                      >
                        <Text
                          style={{ color: colors.black, fontWeight: "600" }}
                        >
                          {parseFloat(sliderPosition.twoMarkerValue).toFixed(1)}{" "}
                          ft
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          position: "absolute",
                          left: sliderPosition.oneMarkerLeftPosition - 25,
                          top: 40,
                        }}
                      >
                        <Text
                          style={{ color: colors.black, fontWeight: "600" }}
                        >
                          {parseFloat(sliderPosition.oneMarkerValue).toFixed(1)}{" "}
                          ft
                        </Text>
                      </View>
                    </View>
                  )
                ) : props.customLabel == "cm" ? (
                  <View>
                    <View
                      style={{
                        position: "absolute",
                        left: sliderPosition.oneMarkerLeftPosition - 18,
                        top: 40,
                      }}
                    >
                      <Text style={{ color: colors.black, fontWeight: "600" }}>
                        {measureUnits.convertCentimetertoFeetAndInches(
                          sliderPosition.oneMarkerValue
                        )}{" "}
                        ft
                      </Text>
                    </View>
                  </View>
                ) : props.customLabel == "mi" ? (
                  <View
                    style={{
                      position: "absolute",
                      left:
                        sliderPosition.oneMarkerValue === 0
                          ? sliderPosition.oneMarkerLeftPosition - 15
                          : sliderPosition.oneMarkerLeftPosition - 40,
                      top: 40,
                    }}
                  >
                    {sliderPosition?.oneMarkerValue === "unlimited" ||
                    sliderPosition?.oneMarkerValue === "nationwide" ? (
                      <Text
                        style={{ color: colors.primaryPink, fontWeight: "600" }}
                      >
                        {sliderPosition.oneMarkerValue}
                      </Text>
                    ) : (
                      <Text
                        style={{ color: colors.primaryPink, fontWeight: "600" }}
                      >
                        {sliderPosition.oneMarkerValue} mi
                      </Text>
                    )}
                  </View>
                ) : props.customLabel == "age" ? (
                  <View>
                    <View
                      style={{
                        position: "absolute",
                        left: sliderPosition.oneMarkerLeftPosition - 8,
                        top: 40,
                      }}
                    >
                      <Text
                        style={{ color: colors.primaryPink, fontWeight: "600" }}
                      >
                        {sliderPosition.oneMarkerValue}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        left: sliderPosition.twoMarkerLeftPosition - 8,
                        top: 40,
                      }}
                    >
                      <Text
                        style={{ color: colors.primaryPink, fontWeight: "600" }}
                      >
                        {sliderPosition.twoMarkerValue}
                      </Text>
                    </View>
                  </View>
                ) : props.customLabel == "religious" ? (
                  <View
                    style={[
                      props.style,
                      {
                        position: "absolute",
                        left:
                          sliderPosition.oneMarkerValue == 4
                            ? sliderPosition.oneMarkerLeftPosition -
                              windowWidth * 0.29
                            : sliderPosition.oneMarkerValue == 3
                            ? sliderPosition.oneMarkerLeftPosition -
                              windowWidth * 0.1 +
                              12
                            : sliderPosition.oneMarkerValue == 2
                            ? sliderPosition.oneMarkerLeftPosition -
                              windowWidth * 0.1 -
                              18
                            : sliderPosition.oneMarkerLeftPosition -
                              windowWidth * 0.1 +
                              23,
                        bottom: -10,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.black, fontWeight: "700" }}>
                      {sliderPosition.oneMarkerValue == 1 ||
                      sliderPosition.oneMarkerValue == 0
                        ? "Rarely Religious"
                        : sliderPosition.oneMarkerValue == 2
                        ? "Somewhat Religious"
                        : sliderPosition.oneMarkerValue == 3
                        ? "Religious"
                        : sliderPosition.oneMarkerValue == 4
                        ? "Strongly Religious"
                        : null}
                    </Text>
                  </View>
                ) : props.customLabel == "pray" ? (
                  <View
                    style={{
                      position: "absolute",
                      left:
                        sliderPosition.oneMarkerValue == 4
                          ? sliderPosition.oneMarkerLeftPosition -
                            windowWidth * 0.13
                          : sliderPosition.oneMarkerValue == 3
                          ? sliderPosition.oneMarkerLeftPosition -
                            windowWidth * 0.1 +
                            23
                          : sliderPosition.oneMarkerValue == 2
                          ? sliderPosition.oneMarkerLeftPosition -
                            windowWidth * 0.1 +
                            7
                          : sliderPosition.oneMarkerLeftPosition -
                            windowWidth * 0.1 +
                            23,
                      bottom: -10,
                    }}
                  >
                    <Text style={{ color: colors.black, fontWeight: "700" }}>
                      {sliderPosition.oneMarkerValue == 1 ||
                      sliderPosition.oneMarkerValue == 0
                        ? `Don't pray`
                        : sliderPosition.oneMarkerValue == 2
                        ? "Sometimes"
                        : sliderPosition.oneMarkerValue == 3
                        ? "Often"
                        : sliderPosition.oneMarkerValue == 4
                        ? "Regularly"
                        : null}
                    </Text>
                  </View>
                ) : props.customLabel == "ideal" ? (
                  <View
                    style={{
                      position: "absolute",
                      left:
                        sliderPosition.oneMarkerValue == 4
                          ? sliderPosition.oneMarkerLeftPosition - 28
                          : sliderPosition.oneMarkerLeftPosition - 18,
                      bottom: 40,
                    }}
                  >
                    <Text style={{ color: colors.black, fontWeight: "700" }}>
                      {sliderPosition.oneMarkerValue == 1 ||
                      sliderPosition.oneMarkerValue == 0
                        ? `0.5 year`
                        : sliderPosition.oneMarkerValue == 2
                        ? "1 year"
                        : sliderPosition.oneMarkerValue == 3
                        ? "2 year"
                        : sliderPosition.oneMarkerValue == 4
                        ? "3 year"
                        : null}
                    </Text>
                  </View>
                ) : null}
              </>
            );
          }}
        />
      </View>
    </View>
  );
};

export default SliderView;

const styles = StyleSheet.create({
  SliderWrapper: {
    margin: 20,
    width: 320,
    height: 300,
    justifyContent: "center",
  },
  ViewContainer: {
    alignSelf: "center",
    justifyContent: "center",
  },
  LabelWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  LabelText: {
    fontSize: 20,
  },

  details: {
    // height: '25%',
    width: "100%",
    marginVertical: "2%",
  },
  detailsTxt: {
    fontSize: 16,
    color: colors.primaryBlue,
    fontFamily: "Inter-Medium",

    alignSelf: "flex-start",
    // marginLeft: '20%',
  },
  distanceStyle: {
    alignSelf: "center",
    backgroundColor: colors.msgGrey,
    paddingHorizontal: 11.5,
    paddingVertical: 30,
    borderRadius: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  ageStyle: {
    alignSelf: "center",
    backgroundColor: colors.msgGrey,
    paddingHorizontal: 11.5,
    paddingVertical: 30,
    borderRadius: 14,
    marginTop: 10,
  },
});
