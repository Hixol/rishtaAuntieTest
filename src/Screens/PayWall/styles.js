import { StyleSheet } from "react-native";
import colors from "../../utility/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentStyle: {
    flexGrow: 1,
    paddingHorizontal: "4%",
  },
  boxBg: {
    borderColor: colors.primaryPink,
    backgroundColor: colors.primaryPinkOpacity,
  },
  row: {
    flexDirection: "row",
  },
  row1: {
    width: "93%",
    marginTop: "5%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  para1: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.blackBlue,
    fontFamily: "Inter-Medium",
    paddingTop: "2%",
    paddingBottom: "3%",
  },
  para2Heading: {
    fontSize: 16,
    color: colors.blackBlue,
    fontFamily: "Inter-Bold",
  },
  para2: {
    fontSize: 16,
    lineHeight: 25,
    flexShrink: 1,
    color: colors.blackBlue,
    fontFamily: "Inter-Regular",
  },
  space: {
    marginTop: "4%",
  },
  checkImage: {
    height: 19,
    width: 19,
    marginTop: 4,
    marginRight: 7,
  },
  autoTxt: {
    fontSize: 14,
    color: colors.slateGrey,
    fontFamily: "Inter-Medium",
  },
  btn: {
    width: "93%",
    alignSelf: "center",
    marginTop: "5%",
    paddingVertical: "4%",
    borderRadius: 10,
    backgroundColor: colors.primaryPink,
  },
  btnTitle: {
    fontSize: 14,
    marginLeft: "5%",
    color: colors.white,
    fontFamily: "Inter-SemiBold",
  },
});
