import { StyleSheet } from "react-native";
import colors from "../../utility/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    width: "90%",
    paddingVertical: "4%",
    borderRadius: 15,
    backgroundColor: colors.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: "2%",
  },
  titleStyle: {
    fontSize: 17,
    color: colors.white,
    fontFamily: "Inter-Regular",
  },
});
