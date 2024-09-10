import { StyleSheet } from "react-native";
import { windowWidth } from "../../utility/size";
import colors from "../../utility/colors";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  tagline: {
    marginHorizontal: "5%",
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: colors.blackBlue,
    lineHeight: 25,
    width:'75%',
  },
  tagline1: {
    marginHorizontal: "5%",
    fontSize: 24,
    fontWeight: "700",
    padding: 10,
    alignItems:'center',
    margin: 10,
    fontFamily: "Inter-Medium",
    color: colors.black,
    textAlign: "center",
    width:'80%',
  },
  actionItemsView: {
    width: "90%",
    paddingVertical: "5%",
    borderRadius: 10,
    paddingHorizontal: "5%",
    borderColor: "#F3F4F6",
    alignSelf: "center",
    marginTop: "2%",
  },
  typeMainView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    width: "100%",
  },
  paddingContainer: {
    padding: "4%",
    margin: "5%",
    borderRadius: 12,
    backgroundColor: colors.greyWhite,
  },
  title: {
    marginTop: "7%",
    marginLeft: "3%",
    fontSize: 30,
    fontFamily: "Inter-Bold",
    color: colors.blackBlue,
  },
  insightContainer: {
    marginVertical: "5%",
    width: windowWidth * 0.7,
    alignSelf: "flex-end",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "5%",
  },
  iconContainer: { width: 45, height: 45 },
  icon: {
    height: "100%",
    width: "100%",
  },
  heading: {
    fontSize: 16,
    color: colors.blackBlue,
    fontFamily: "Inter-Bold",
  },
  description: {
    fontSize: 14,
    color: colors.slateGrey,
    fontFamily: "Inter-Regular",
    lineHeight: 18,
  },
});
