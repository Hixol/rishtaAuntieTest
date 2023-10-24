import { StyleSheet } from "react-native";
import colors from "../../utility/colors";
import { ios, windowWidth } from "../../utility/size";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 14,
    marginTop: ios ? -5 : "7%",
  },
  box: {
    backgroundColor: colors.white,
    padding: 12,
    height: 130,
    width: windowWidth * 0.88,
    borderRadius: 4,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "10%",
  },
  boxBorder: { borderWidth: 1, borderColor: colors.primaryPink },
  boxText: {
    color: colors.blackBlue,
    fontFamily: "Inter-Medium",
    lineHeight: 20,
    fontSize: 16,
    textAlign: "center",
    width: windowWidth * 0.78,
  },
});
