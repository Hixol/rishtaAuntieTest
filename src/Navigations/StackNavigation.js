import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { useSelector } from "react-redux";

import Login from "../Screens/Login";
import SignUp from "../Screens/SignUp/index.js";
import Tabs from "./BottomTab";
import ImageContainer from "../components/containers/imageContainer";
import HeaderContainer from "../components/containers/headerContainer";
import FavouriteMessages from "../Screens/FavouriteMessages";
import MyPrivacySetting from "../Screens/MyPrivacySetting";
import MySetting from "../Screens/MySetting";
import BlockedList from "../Screens/BlockedList";
import BlogBlockCard from "../components/BlogBlockCard";
import BlogDetails from "../Screens/BlogDetail.js";
import SearchPreferences from "../Screens/SearchPreferences";
import DeleteAccountScreen from "../Screens/DeleteAccountScreen";
import ViewEditProfile from "../Screens/ViewEditProfile";
import OnBoarding from "../Screens/OnBoarding";
import MySearchPreferencesEditScreen from "../Screens/MySearchPreferencesEditScreen";
import TalhaDemo from "../Screens/TalhaDemo";
import SplashScreen from "../Screens/SplashScreen";
import WelcomeScreen from "../Screens/WelcomeScreen";
import FastImage from "react-native-fast-image";
import OtpScreen from "../Screens/OtpScreen";
import MyVibes from "../Screens/myVibes";
import QuestionPoolScreen from "../Screens/QuestionPoolScreen";
import AnswerPool from "../components/Cards/AnswerPool";
import ReportAccountScreen from "../Screens/ReportUser";
import PersonalityQuiz from "../Screens/PersonalityQuiz";
import SelfieVerification from "../Screens/SelfieVerification";
import UserChatList from "../Screens/userChatList";
import UserDetailScreen from "../Screens/userDetailScreen";
import MessagePreview from "../Screens/MessagePreview";
import IncomingCallScreen from "../Screens/CallTab/IncomingCallScreen";
import VideoScreen from "../Screens/CallTab/VideoScreen";
import MyInsight from "../Screens/MyInsight";
import PayWall from "../Screens/PayWall";
import PayWallSpots from "../Screens/PayWallSpots";
import colors from "../utility/colors";
import Icons from "../utility/icons";
import PersonalDetailsScreen1 from "../Screens/NewOnBoarding/PersonalDetails/PersonalDetailsScreen1";
import FullNameScreen from "../Screens/NewOnBoarding/PersonalDetails/FullNameScreen";
import DobScreen from "../Screens/NewOnBoarding/PersonalDetails/DobScreen";
import genderScreen from "../Screens/NewOnBoarding/PersonalDetails/GenderScreen";
import GenderScreen from "../Screens/NewOnBoarding/PersonalDetails/GenderScreen";
import UploadSelfie from "../Screens/NewOnBoarding/UploadImages.js/UploadSelfie";
import UploadVideo from "../Screens/NewOnBoarding/UploadImages.js/UploadVideo";
import UploadPicture from "../Screens/NewOnBoarding/UploadImages.js/UploadPicture";
import OnBoardingQuestions from "../Screens/NewOnBoarding/OnBoardingQuestions";
import SignInNew from "../Screens/NewOnBoarding/Auth/SignIn";
import ReligionScreen from "../Screens/NewOnBoarding/ReligionScreens/ReligionScreen";
import ProfilePicturesScreen from "../Screens/NewOnBoarding/ProfilePicturesScreen";
import PersonalityQuizNew from "../Screens/NewOnBoarding/PersonalityQuizNew";
import EditProfileScreen from "../Screens/EditProfileScreen.js";
import EditScreenSetting from "../Screens/EditScreenSetting";
import Denominations from "../Screens/NewOnBoarding/ReligionScreens/Denominations.js";

const Stack = createNativeStackNavigator();

const HeaderTitle = ({ proMember }) => (
  <View
    style={{
      width: 30,
      height: 30,
      alignSelf: "center",
      alignItems: "center",
    }}
  >
    <FastImage
      resizeMode="contain"
      style={{ width: 40, height: "100%" }}
      source={
        proMember
          ? require("../assets/iconimages/logo-gold.png")
          : require("../assets/iconimages/header-icon.png")
      }
    />
  </View>
);

const paywallProps = title => ({
  headerShown: true,
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  headerTitle: title,
  headerTitleAlign: "center",
  headerTitleStyle: {
    fontSize: 24,
    color: colors.blackBlue,
    fontFamily: "Inter-Bold",
  },
  animation: "fade_from_bottom",
});

const StackNavigations = props => {
  const [showScreen, setShowScreen] = useState(false);
  const { userData } = useSelector(store => store.userReducer);
  const { isIcoming, isEarlyAccepted } = useSelector(store => store.ActiveCall);

  const proMember = userData?.UserSetting?.isSubscribed;

  const centeredHeader = {
    headerShown: true,
    headerTitleAlign: "center",
    headerTitle: () => <HeaderTitle proMember={proMember} />,
  };

  const showCallScreen = () => {
    if (isIcoming && !isEarlyAccepted) {
      setShowScreen(true);
    } else if (isEarlyAccepted) {
      setShowScreen(true);
    } else {
      setShowScreen(false);
    }
  };

  useEffect(() => {
    showCallScreen();
  }, [isIcoming]);

  return !isIcoming ? (
    <Stack.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="BottomTab" children={() => <Tabs {...props} />} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerTitle: () => <HeaderTitle proMember={proMember} />,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerTitle: () => <HeaderTitle proMember={proMember} />,
        }}
      />
      <Stack.Screen
        name="userDetailScreen"
        component={UserDetailScreen}
        options={centeredHeader}
      />
      <Stack.Screen name="ImageContainer" component={ImageContainer} />
      <Stack.Screen name="HeaderContainer" component={HeaderContainer} />
      <Stack.Screen name="FavouriteMessages" component={FavouriteMessages} />
      <Stack.Screen
        name="MessagePreview"
        component={MessagePreview}
        options={{
          animationTypeForReplace: "push",
          animation: "slide_from_bottom",
        }}
      />
      {/* <Stack.Screen
        name="UserChatList"
        component={UserChatList}
        options={centeredHeader}
      /> */}
      <Stack.Screen name="MyPrivacySetting" component={MyPrivacySetting} />
      <Stack.Screen name="MySetting" component={MySetting} />
      <Stack.Screen name="BlockedList" component={BlockedList} />
      <Stack.Screen name="BlogBlockCard" component={BlogBlockCard} />
      <Stack.Screen name="BlogDetails" component={BlogDetails} />
      <Stack.Screen name="EditProfile" component={ViewEditProfile} />
      <Stack.Screen name="SearchPreferences" component={SearchPreferences} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="EditScreenSetting" component={EditScreenSetting} />
      <Stack.Screen name="Denominations" component={Denominations} />

      <Stack.Screen
        name="PersonalDetailsScreen1"
        component={PersonalDetailsScreen1}
      />
      <Stack.Screen name="FullNameScreen" component={FullNameScreen} />
      <Stack.Screen name="DobScreen" component={DobScreen} />
      <Stack.Screen name="GenderScreen" component={GenderScreen} />
      <Stack.Screen name="UploadSelfie" component={UploadSelfie} />
      <Stack.Screen name="UploadPicture" component={UploadPicture} />
      <Stack.Screen name="UploadVideo" component={UploadVideo} />
      <Stack.Screen name="ReligionScreen" component={ReligionScreen} />
      <Stack.Screen name="PersonalityQuizNew" component={PersonalityQuizNew} />
      <Stack.Screen
        name="ProfilePicturesScreen"
        component={ProfilePicturesScreen}
      />
      <Stack.Screen name="SignInNew" component={SignInNew} />
      <Stack.Screen
        name="OnBoardingQuestions"
        component={OnBoardingQuestions}
      />
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen
        name="PersonalityQuiz"
        component={PersonalityQuiz}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <Icons.Ionicons
              name="arrow-back"
              size={30}
              color={colors.darkBlue}
              onPress={() =>
                navigation.navigate("BottomTab", {
                  screen: "Settings",
                })
              }
            />
          ),
        })}
      />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="MyVibes" component={MyVibes} />
      <Stack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={centeredHeader}
      />
      <Stack.Screen
        name="QuestionPoolScreen"
        component={QuestionPoolScreen}
        options={centeredHeader}
      />
      <Stack.Screen
        name="AnswerPoolScreen"
        component={AnswerPool}
        options={centeredHeader}
      />
      <Stack.Screen
        name="MySearchPreferencesEditScreen"
        component={MySearchPreferencesEditScreen}
      />
      <Stack.Screen name="TalhaDemo" component={TalhaDemo} />
      <Stack.Screen
        name="DeleteAccountScreen"
        component={DeleteAccountScreen}
      />
      <Stack.Screen
        name="ReportAccountScreen"
        component={ReportAccountScreen}
      />
      <Stack.Screen name="SelfieVerification" component={SelfieVerification} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
      <Stack.Screen
        name="Paywall"
        component={PayWall}
        options={paywallProps("Go premium")}
      />
      <Stack.Screen
        name="PaywallSpots"
        component={PayWallSpots}
        options={paywallProps("Spotlight your profile")}
      />
      <Stack.Screen name="MyInsight" component={MyInsight} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator
      initialRouteName={isIcoming ? "IncomingCallScreen" : "VideoScreen"}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="IncomingCallScreen" component={IncomingCallScreen} />
      <Stack.Screen name="VideoScreen" component={VideoScreen} />
    </Stack.Navigator>
  );
};
export default StackNavigations;
