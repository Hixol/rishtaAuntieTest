import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Amplify, Auth, Hub } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useSelector, useDispatch } from "react-redux";
import { android, ios, windowHeight, windowWidth } from "../utility/size";
import { useHelper } from "../hooks/useHelper";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";

import FastImage from "react-native-fast-image";
import colors from "../utility/colors";
import IntlPhoneInput from "react-native-intl-phone-input";
import UserService from "../services/UserService";
import config from "../aws-exports";
import Loader from "./Loader";
import Icons from "../utility/icons";

const LoginSignup = (props) => {
  const webviewRef = useRef(null);
  const dispatch = useDispatch();
  const { Alerts, handleStatusCode, dispatchAndNavigate } = useHelper();
  const { mobileNumber, email, status } = useSelector(
    (store) => store.userReducer
  );

  let [fullNumber, setFullNumber] = useState("");
  let [loading, setLoading] = useState(false);
  let [loader, setLoader] = useState(false);
  let [error, setError] = useState("");

  const [check, setCheck] = useState(false);
  const [user, setUser] = useState(null);
  const [currentAuthUser, setCurrentAuthUser] = useState(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [provider, setProvider] = useState("");
  const [identityProvider, setIdentityProvider] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [unmaskedPhoneNumber, setUnmaskedPhoneNumber] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [url, setUrl] = useState("");
  const signInWithApple = "SignInWithApple";

  const urlOpener = async (url, redirectUrl) => {
    let identityProvider = url
      .split("&")
      .find((str) => str.indexOf("identity_provider") > -1)
      .split("=")
      .pop();

    setIdentityProvider(identityProvider);
    setUrl(url);
    setLoader(false);
  };

  Amplify.configure({
    ...config,
    oauth: {
      ...config.oauth,
      urlOpener,
    },
  });

  const onChangeText = ({
    dialCode,
    unmaskedPhoneNumber,
    phoneNumber,
    isVerified,
  }) => {
    setError("");
    setDialCode(dialCode.replace(/ /g, ""));
    setUnmaskedPhoneNumber(unmaskedPhoneNumber);

    // regex => remove spaces, symbols but includes only numbers
    setPhoneNumber(phoneNumber.replace(/[^0-9]/g, ""));
    setIsVerified(isVerified);
  };

  fullNumber = dialCode + phoneNumber;

  const getUser = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setCurrentAuthUser(user);
      })
      .catch((err) => console.log("currentAuthenticatedUser err:", err));
  };

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          if (Object.keys(data).length > 0) {
            setUser(data);
            getUser();
          }
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
      }
    });

    return () => unsubscribe();
  }, []);

  const socialSignInGoogle = async () => {
    setLoader(true);
    await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
    setProvider("google");
  };

  const socialSignInFaceBook = () => {
    setLoader(true);
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
    setProvider("facebook");
  };

  const socialSignInApple = () => {
    setLoader(true);
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Apple });
    setProvider("apple");
  };

  const handleLoginService = () => {
    UserService.login({
      phoneNumber: fullNumber,
    })
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          Alerts("success", res.data.message);
          props.props.navigation.navigate("OtpScreen", {
            phoneNum: fullNumber,
            otp: res.data.data.otp,
          });
        }
      })
      .catch((err) => {
        console.log("login err", err);
        Alerts("error", err?.message.toString());
      })
      .finally(() => setLoading(false));
  };

  const clearRedux = (flag = false) => {
    dispatch({
      type: "EMPTY_CHAT",
    });
    dispatch({
      type: "INDEX",
      payload: 0,
    });
    dispatch({
      type: "PROMPTS_INDEX",
      payload: 0,
    });
    dispatch({
      type: "PROMPTS_POOL",
      payload: [],
    });

    if (flag) {
      dispatch({
        type: "USER_EMAIL",
        payload: currentAuthUser?.attributes?.email,
      });
    } else {
      dispatch({
        type: "USER_MOBILE_NO",
        payload: fullNumber,
      });
    }
  };

  const clearNewRedux = (flag = false) => {
    dispatch({
      type: "firstName",
      payload: "",
    });
    dispatch({
      type: "lastName",
      payload: "",
    });
    dispatch({
      type: "dob",
      payload: null,
    });
    dispatch({
      type: "gender",
      payload: "",
    });
    dispatch({
      type: "selfie",
      payload: null,
    });
    dispatch({
      type: "picture",
      payload: null,
    });
    dispatch({
      type: "video",
      payload: null,
    });
    dispatch({
      type: "religion",
      payload: null,
    });
    dispatch({
      type: "profilePictures",
      payload: [],
    });
    dispatch({
      type: "vibes",
      payload: [],
    });
    dispatch({
      type: "promptsPool",
      payload: [],
    });
    dispatch({
      type: "height",
      payload: "",
    });
    dispatch({
      type: "familyOrigin",
      payload: [],
    });
    dispatch({
      type: "community",
      payload: [],
    });
    dispatch({
      type: "language",
      payload: [],
    });

    dispatch({
      type: "educationLevel",
      payload: "",
    });
    dispatch({
      type: "occupation1",
      payload: "",
    });
    dispatch({
      type: "denomination",
      payload: "",
    });
    dispatch({
      type: "practicingLevel",
      payload: "",
    });
    dispatch({
      type: "drink",
      payload: "",
    });
    dispatch({
      type: "smoke",
      payload: [],
    });
    dispatch({
      type: "pray",
      payload: "",
    });
    dispatch({
      type: "dietChoices",
      payload: [],
    });
    dispatch({
      type: "maritalHistory",
      payload: "",
    });
    dispatch({
      type: "marriageTimeline",
      payload: "",
    });
    dispatch({
      type: "haveKids",
      payload: false,
    });
    dispatch({
      type: "wantKids",
      payload: false,
    });
    dispatch({
      type: "relocate",
      payload: false,
    });
    dispatch({
      type: "AUTH_TOKEN",
      payload: null,
    });
    dispatch({
      type: "AUTH_USER_STATUS",
      payload: null,
    });
    dispatch({
      type: "tagline1",
      payload: "",
    });
    dispatch({
      type: "wholeArray",
      payload: [],
    });

    if (flag) {
      dispatch({
        type: "USER_EMAIL",
        payload: currentAuthUser?.attributes?.email,
      });
    } else {
      dispatch({
        type: "USER_MOBILE_NO",
        payload: fullNumber,
      });
    }
  };

  const signIn = () => {
    if (phoneNumber === "") {
      setError("Phone Number is required...!");
    } else {
      setLoading(true);
      if (fullNumber != "") {
        if (fullNumber == mobileNumber) {
          handleLoginService();
        } else if (fullNumber != mobileNumber) {
          clearRedux();
          clearNewRedux();
          handleLoginService();
        }
      }
    }
  };

  const socialSignUp = async () => {
    const body = {
      username: currentAuthUser?.username,
      email: currentAuthUser?.attributes?.email,
      platform: provider,
    };
    const res = await Auth.updateUserAttributes(currentAuthUser, {
      "custom:platform": provider,
    });
    if (res === "SUCCESS") {
      UserService.signUpSocial(body)
        .then((res) => {
          handleStatusCode(res);
          if (res.status >= 200 && res.status <= 299) {
            let data = res?.data?.data;
            Alerts("success", res?.data?.message);

            if (Object.keys(data).length > 0) {
              if (data.status === "INACTIVE" || data?.status === undefined) {
                if (currentAuthUser?.attributes?.email === email) {
                  dispatchAndNavigate(data.status, "FullNameScreen", data);
                } else {
                  clearRedux(true);
                  clearNewRedux(true);
                  dispatchAndNavigate(data.status, "FullNameScreen", data);
                }
              } else {
                dispatchAndNavigate(data.status, "BottomTab", data);
              }
            }
          }
        })
        .catch((err) => {
          if (err?.message.includes("Network")) {
            Alerts("error", err.message);
          } else {
            console.log("socialSignUp err:", err);
          }
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
      Alerts("error", "Something went wrong Please try again later");
    }
  };

  useEffect(() => {
    if (currentAuthUser?.username && provider != "") {
      socialSignUp();
    }
  }, [currentAuthUser]);

  const handleSignupService = () => {
    UserService.signUp({
      phoneNumber: fullNumber,
    })
      .then((res) => {
        handleStatusCode(res);
        if (res.status >= 200 && res.status <= 299) {
          Alerts("success", res.data.message);
          props.props.navigation.navigate("OtpScreen", {
            phoneNum: fullNumber,
            otp: res.data.data.otp,
          });
        }
      })
      .catch((err) => Alerts("error", err?.message.toString()))
      .finally(() => setLoading(false));
  };

  const signUp = () => {
    if (phoneNumber === "" && check === false) {
      setError("Phone Number is required...!");
    } else if (phoneNumber !== "" && check === false) {
      setError("Please accept our Terms of Service...!");
    } else if (check === true && phoneNumber === "") {
      setError("Phone Number is required...!");
    } else {
      if (phoneNumber !== "" && check === true) {
        setLoading(true);
        if (fullNumber == mobileNumber) {
          handleSignupService();
        } else if (fullNumber != mobileNumber) {
          clearRedux();
          clearNewRedux();
          handleSignupService();
        }
      }
    }
  };

  const handleUrl = (endpoint) =>
    Linking.openURL(`https://rishtaauntie.app/${endpoint}/`);

  return loader ? (
    <Loader />
  ) : (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (canGoBack) {
            props.props.navigation.replace("SignInNew");
          } else {
            props.props.navigation.goBack();
          }
        }}
      >
        <FastImage
          resizeMode="contain"
          style={{ width: 20, height: 30 }}
          source={require("../assets/iconimages/arrow-back.png")}
        />
      </TouchableOpacity>
      <View style={{ marginTop: "8%" }}>
        <Text style={styles.heading}>
          {props.login
            ? "Welcome back to Rishta Auntie"
            : "Get started with Rishta Auntie"}
        </Text>
        <Text style={styles.lightText}></Text>
      </View>
      {url != "" && identityProvider == signInWithApple && (
        <WebView
          ref={webviewRef}
          style={{ flex: identityProvider == signInWithApple ? 0 : 1 }}
          source={{ uri: url }}
          incognito={true}
          onLoadProgress={() =>
            Alerts(
              "info",
              "Please wait while we are processing your request..."
            )
          }
          cacheEnabled={false}
          userAgent={
            android
              ? "Chrome/18.0.1025.133 Mobile Safari/535.19"
              : "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
          }
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
        />
      )}
      {url != "" && identityProvider != signInWithApple ? (
        <WebView
          ref={webviewRef}
          style={{ flexGrow: identityProvider == signInWithApple ? 0 : 1 }}
          source={{ uri: url }}
          incognito={true}
          startInLoadingState={true}
          renderLoading={() => (
            <Loader
              style={{
                position: "absolute",
                top: ios ? windowHeight / 2.7 : windowHeight / 2,
                left: windowWidth / 2.15,
              }}
            />
          )}
          onLoadProgress={() =>
            Alerts(
              "info",
              "Please wait while we are processing your request..."
            )
          }
          cacheEnabled={false}
          userAgent={
            android
              ? "Chrome/18.0.1025.133 Mobile Safari/535.19"
              : "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
          }
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.noAccountView}>
            <TouchableOpacity
              style={styles.socialButtons}
              onPress={() => socialSignInGoogle()}
            >
              <FastImage
                resizeMode="contain"
                style={{ width: 30, height: 30 }}
                source={require("../assets/iconimages/Google.png")}
              />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            {ios ? (
              <TouchableOpacity
                style={styles.socialButtons}
                onPress={() => socialSignInApple()}
              >
                <FastImage
                  resizeMode="contain"
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/iconimages/appleicon.png")}
                />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              flexDirection: "row",
              marginTop: "5%",
            }}
          >
            <View style={styles.divider}></View>
            <Text style={{ fontFamily: "Inter-Medium", color: "#6B7280" }}>
              Or sign in with email
            </Text>
            <View style={styles.divider}></View>
          </View>
          <View style={{ marginVertical: "5%" }}></View>
          <IntlPhoneInput
            onChangeText={onChangeText}
            containerStyle={{
              backgroundColor: colors.white,
              borderColor: colors.primaryPink,
              borderWidth: 1,
            }}
            dialCodeTextStyle={{
              color: "#111827",
              left: 5,
              fontFamily: "Inter-Regular",
            }}
            phoneInputStyle={{
              color: colors.black,
              left: 5,
              fontFamily: "Inter-Regular",
            }}
            placeholderTextColor={colors.vibeLightGrey}
            defaultCountry="PK"
            lang="en"
            modalCountryItemCountryNameStyle={{ color: "black" }}
            modalCountryItemCountryDialCodeStyle={{
              color: "black",
              fontFamily: "Inter-Regular",
            }}
          />
          <View style={{ marginTop: "2%", height: 20 }}>
            <Text
              style={{
                alignSelf: "flex-end",
                color: "#FF3D00",
                fontFamily: "Inter-Medium",
              }}
            >
              {isVerified === false && phoneNumber?.length > 0
                ? "Enter a correct phone number"
                : ""}
            </Text>
          </View>
          {props.login ? null : (
            <View
              style={[
                styles.checkBoxView,
                {
                  marginVertical: "2%",
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setCheck(!check)}
                style={styles.checkBox}
              >
                {check ? (
                  <Icons.FontAwesome
                    name="check"
                    size={20}
                    color={colors.primaryPink}
                  />
                ) : null}
              </TouchableOpacity>

              <Text style={[styles.descTxt, styles.descTxt1]}>
                By signing into Rishta Auntie you agree to the{" "}
                <Text
                  onPress={() => handleUrl("terms-of-use")}
                  style={styles.infoTxt}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  onPress={() => handleUrl("privacy-policy")}
                  style={styles.infoTxt}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
          )}

          <TouchableOpacity
            disabled={
              loading || (phoneNumber.length > 0 && isVerified === false)
            }
            onPress={() => {
              props.login ? signIn() : signUp();
            }}
            style={[
              styles.signInButton,
              { marginTop: props.login ? "35%" : "20%" },
            ]}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.white}
                style={{ marginRight: 7 }}
              />
            ) : (
              <Text style={styles.signinBtnTxt}>
                {props.login ? "Sign In" : "Join for free"}
              </Text>
            )}
          </TouchableOpacity>
          {/* {props.login ? (
            phoneNumber != '' ? null : error != '' ? (
              <Text style={styles.warningText}>{error}</Text>
            ) : null
          ) : phoneNumber === '' && check === false ? (
            <Text style={styles.warningText}>{error}</Text>
          ) : phoneNumber !== '' && check === false ? (
            <Text style={styles.warningText}>{error}</Text>
          ) : phoneNumber === '' && check === true ? (
            <Text style={styles.warningText}>{error}</Text>
          ) : null} */}

          <View style={{ marginTop: "5%" }}>
            {props.login ? (
              <>
                <View
                  style={[
                    styles.noAccountCreateOne,
                    {
                      marginVertical: "10%",
                    },
                  ]}
                >
                  <Text style={styles.noAccountTxt}>
                    Don’t have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => props.props.navigation.navigate("SignUp")}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        color: colors.primaryPink,
                        fontSize: 12,
                      }}
                    >
                      Get started
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.descTxt, { marginVertical: "10%" }]}>
                  By signing into Rishta Auntie you agree to the{" "}
                  <Text
                    onPress={() => handleUrl("terms-of-use")}
                    style={styles.infoTxt}
                  >
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text
                    onPress={() => handleUrl("privacy-policy")}
                    style={styles.infoTxt}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </>
            ) : (
              <View
                style={[
                  styles.noAccountCreateOne,
                  {
                    marginVertical: "10%",
                  },
                ]}
              >
                <Text style={styles.noAccountTxt}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => props.props.navigation.navigate("Login")}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      color: colors.primaryPink,
                      fontSize: 12,
                    }}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 25,
  },
  signUpHeading: { color: "#161616", marginTop: "5%", fontSize: 35 },
  logo: { width: "100%", height: "100%" },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    marginTop: "10%",
    alignSelf: "center",
  },
  noAccountView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: "5%",
    justifyContent: "space-evenly",
    width: "100%",
  },
  createOneText: {
    fontFamily: "Inter-Bold",
    color: colors.primaryBlue,
  },
  countryCode: {
    fontSize: 15,
    marginHorizontal: "1%",
    color: colors.black,
  },
  signInCreate: {
    marginBottom: "3%",
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: colors.primaryBlue,
  },
  countryPicker: {
    width: 50,
    height: 30,
    marginTop: 0,
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 0,
  },
  dropDownIcon: { width: "13%", alignItems: "flex-end", right: 20 },
  phoneNumber: { width: "60%", color: colors.black },
  bottomContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F4F4F4",
    zIndex: 1,
    marginTop: "50%",
    marginBottom: "10%",
    borderTopLeftRadius: 100,
    alignItems: "center",
  },
  firstNameContainer: {
    width: "80%",
    paddingHorizontal: "3%",
    backgroundColor: "#fcfcfc",
    marginTop: "10%",
    paddingVertical: "1%",
    borderRadius: 10,
    elevation: 1,
  },
  aggrementText: {
    marginLeft: "5%",
    fontSize: 11,
    fontFamily: "Inter-Medium",
    width: "80%",
    color: colors.darkBlue,
  },
  warningText: { color: "red", top: "6%", fontWeight: "700" },
  firstNameText: { fontSize: 17, color: "#232323", fontFamily: "Inter-Bold" },
  textInput: { color: "black", marginTop: "-2%" },
  horizontalLine: {
    width: "100%",
    borderWidth: 0.4,
    borderColor: "black",
    marginTop: "-3%",
  },
  signUpInButton: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#161616",
    paddingVertical: "3%",
    borderRadius: 10,
    borderTopEndRadius: 0,
    marginTop: "10%",
  },
  topContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#161616",
    zIndex: 0,
    position: "absolute",
    alignItems: "center",
  },
  noAccountCreateOne: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: '5%',
  },
  signUpText: { color: "white", fontSize: 20 },
  header: {
    width: "30%",
    height: windowHeight * 0.12,
    alignSelf: "center",
    marginVertical: "10%",
  },
  signinBox: {
    paddingVertical: "4%",
    width: "90%",
    backgroundColor: colors.white,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: "5%",
  },
  signinBtnTxt: {
    fontFamily: "Inter-Medium",
    fontSize: 17,
    color: colors.white,
  },
  signInButton: {
    width: "100%",
    paddingVertical: "5%",
    borderRadius: 15,
    backgroundColor: colors.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  orSignin: {
    alignSelf: "center",
    fontSize: 22,
    fontFamily: "Inter-Bold",
    marginVertical: "5%",
    color: colors.primaryBlue,
  },
  socialView: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statementTxt: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    textAlign: "center",
    width: "90%",
    alignSelf: "center",
    marginVertical: "10%",
    lineHeight: 14,
    color: colors.mediumGrey,
  },
  phoneNum: {
    width: "100%",

    backgroundColor: colors.greyWhite,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "3%",
    paddingVertical: ios ? "2.7%" : undefined,
  },
  phoneInner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginVertical: "7%",
  },
  checkBox: {
    height: windowHeight * 0.03,
    width: windowHeight * 0.03,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primaryPink,
    backgroundColor: colors.greyWhite,
    borderRadius: 5,
  },
  noAccountTxt: {
    fontSize: 12,
    marginRight: "2%",
    color: "#6B7280",
    fontFamily: "Inter-Medium",
  },
  heading: { fontFamily: "Inter-Bold", fontSize: 25, color: colors.black },
  lightText: {
    fontFamily: "Inter-Light",
    fontSize: 15,
    marginTop: "3%",
    color: colors.textGrey,
  },
  socialButtons: {
    width: "45%",
    paddingVertical: "3%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    flexDirection: "row",
  },
  socialText: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    marginLeft: "3%",
    color: colors.black,
  },
  divider: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  buttonView: {
    width: "90%",
    paddingVertical: "5%",
    borderRadius: 10,
    backgroundColor: colors.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  descTxt: {
    fontSize: 12,
    lineHeight: 20,
    width: "80%",
    alignSelf: "center",
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "Inter-Medium",
  },
  descTxt1: {
    marginLeft: "2%",
    marginTop: "1%",
    textAlign: "left",
  },
  infoTxt: {
    fontFamily: "Inter-Medium",
    color: colors.blackBlue,
    fontSize: 12,
  },
});

export default LoginSignup;