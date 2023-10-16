import { Platform, StyleSheet, Dimensions } from "react-native";
import colors from "../../utility/colors";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  headingView:{marginVertical: '3%', alignSelf: 'center'},
  headingText:{
    fontSize: 22,
    color: colors.primaryBlue,
    fontFamily: 'Roboto-Regular',
  },
  welcomeText:{
    color: colors.primaryBlue,
    fontSize: 20,
    fontFamily:'Roboto-Bold',
    alignSelf: 'center',
    marginVertical: '3%',
  },
  imgSize: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.3,
      marginVertical: '1.5%',
  },
  listView: {
    marginHorizontal: '2%',

    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  }
});
